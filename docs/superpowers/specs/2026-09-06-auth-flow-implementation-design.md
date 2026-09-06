# 登录流程实施设计 Spec

**日期：** 2026-09-06
**状态：** 已确认，待实现
**范围：** 前端登录 UI + 前后端对接（Cloudflare Worker API）
**关联文档：** `docs/superpowers/specs/2026-09-07-auth-membership-design.md`（产品设计：三级会员体系、付费墙）——本文不重复其内容，仅做实施对接。

---

## 一、背景与目标

后端认证 API 已完整实现（`worker/routes/auth.ts`、`worker/routes/user.ts`、`worker/lib/jwt.ts`、`worker/lib/password.ts`），前端无任何登录 UI，前后端未打通。

**本期目标：** 前端添加登录操作 UI，完成前后端打通。

**关键决策（已与用户确认）：**

| 决策点 | 结论 |
|---|---|
| UI 形态 | **方案 A**：合并 AuthModal + Tab 切换（登录/注册），忘记密码为登录页内链接 |
| AI 助教与登录关系 | **方案 B**：未登录也能用 AI 助教，登录不阻断现有流程，作为额外能力 |
| 第三方登录 | **方案 A**：暂不做，只做邮箱 + 密码 |
| 注册流程 | 邮箱 + 密码注册 → 邮件验证码（10 分钟有效）→ **verify 成功直接登录**（后端返回 `{ user, tokens }\) |

**后端行为约束（已实现，前端必须对齐）：**

- `POST /api/auth/register` 只发验证码，**不签发 token**（邮箱未激活）
- `POST /api/auth/login` 检查 `email_verified`，未激活返回 `403 EMAIL_NOT_VERIFIED`
- `POST /api/auth/verify` 成功返回 `{ message, user, tokens: { access, refresh } }` → 前端直接存 token 完成注册登录
- `POST /api/auth/resend` `{ email }` → 重发验证码（仅未激活用户，已激活返回 404）
- 验证码有效期 10 分钟（后端 `expires_at = now + 10min`）

**非目标（YAGNI）：**

- 第三方登录（微信/GitHub OAuth）
- 三级会员付费墙、订阅（产品 spec 已有规划，本期不消费 tier）
- 多域名登录态共享（不同域 localStorage 隔离，各域名独立登录）

---

## 二、架构

### 2.1 新增/改造文件

| 文件 | 变更 |
|---|---|
| `src/services/auth.ts` | 新增：token 管理、API 方法、`authFetch` 拦截器、`useAuth` hook、`initAuth` |
| `src/components/AuthModal.tsx` | 新增：登录/注册/验证/忘记密码/重置多视图弹窗 |
| `src/components/Header.tsx` | 改造：登录按钮 / 用户菜单 + 挂载 AuthModal |
| `src/main.tsx` | 改造：应用启动时调用 `initAuth()` |

### 2.2 数据流

```
【注册】
AuthModal → auth.register(email, password)
         → POST /api/auth/register
         → { message, email }（后端发验证码邮件）
         → UI 自动切换「验证邮箱」视图（邮箱预填，6 位验证码输入）
         → [可选] 点击「重新发送验证码」→ POST /api/auth/resend
         → auth.verify(email, code)
         → POST /api/auth/verify
         → { user, tokens } → 写 localStorage → Header 刷新 → 关闭弹窗

【登录】
AuthModal → auth.login(email, password)
         → POST /api/auth/login → { user, tokens }
         → 写 localStorage → Header 刷新 → 关闭弹窗

【后续请求】
authFetch(path) → 自动附加 Bearer access
              → 401 → refreshPromise 单例排队 → POST /api/auth/refresh
              → 新 access 写回 → 重放原请求
              → refresh 失效 → 清存储 → 回未登录态
```

---

## 三、API 封装设计（`src/services/auth.ts`）

### 3.1 base URL 推导

前端部署域名 `syy.global` / `syy.mobi` / `syy.one` 对应 API 域名 `api.syy.*`，运行时从 `location.hostname` 推导，零配置：

```typescript
const API_BASE = `https://api.${location.hostname}`;
// 支持环境变量/常量覆盖（开发期 proxy 场景）
const API_BASE = import.meta.env.VITE_API_BASE ?? `https://api.${location.hostname}`;
```

> 约束：API Worker 需配置 `api.syy.*` 域名（已通过 wrangler routes 规划，DNS 生效后即通）。开发期 `vite.config.ts` 已有 `/api` proxy（target: `http://localhost:8787`）。

### 3.2 存储键

```typescript
const ACCESS_KEY = 'sf_access_token';
const REFRESH_KEY = 'sf_refresh_token';
const USER_KEY = 'sf_user';
```

localStorage 读写 try/catch 包裹（隐私模式可能抛错），失败降级内存变量，不阻塞渲染。

### 3.3 核心接口

| 方法 | 签名 | 对应后端 |
|---|---|---|
| `register(email, password)` | `Promise<{ message: string; email: string }>` | `POST /api/auth/register` |
| `verify(email, code)` | `Promise<{ user: UserResponse; tokens: Tokens }>` | `POST /api/auth/verify` |
| `resendCode(email)` | `Promise<void>` | `POST /api/auth/resend` |
| `login(email, password)` | `Promise<{ user: UserResponse; tokens: Tokens }>` | `POST /api/auth/login` |
| `forgotPassword(email)` | `Promise<void>` | `POST /api/auth/forgot` |
| `resetPassword(email, code, newPassword)` | `Promise<void>` | `POST /api/auth/reset` |
| `logout()` | `Promise<void>` | `POST /api/auth/logout` + 清本地 |
| `getMe()` | `Promise<UserResponse>` | `GET /api/user/me` |
| `updateNickname(nickname)` | `Promise<UserResponse>` | `PUT /api/user/config` |
| `refreshTokens()` | `Promise<void>` | `POST /api/auth/refresh` |
| `initAuth()` | `Promise<void>` | refresh + getMe 静默恢复会话 |
| `authFetch(path, options?)` | `Promise<Response>` | 带 token + 401 刷新重放 |

### 3.4 `authFetch` 行为

1. 内存缓存 access token，附加 `Authorization: Bearer <access>`
2. 响应 401 → 若 refresh 存在且 `refreshPromise` 空闲 → 发 refresh
3. 并发 401：其余请求 await 同一个 `refreshPromise`（后端 refresh 轮换删旧 token，并发会互相踩）
4. refresh 成功：更新内存 + localStorage，重放原请求（一次，不循环）
5. refresh 失败或重放再 401：清本地存储 → notify listeners → Header 回未登录态

### 3.5 Token 生命周期

| Token | 有效期 | 存储位置 |
|---|---|---|
| access | 15 分钟（后端 JWT 900s） | localStorage + 内存双写 |
| refresh | 7 天（后端 session） | localStorage |

浏览器关闭重开：`initAuth()` 自动 refresh 恢复会话。

---

## 四、组件设计

### 4.1 AuthModal 多视图状态机

单弹窗内部 view 切换，不用 modal 堆叠：

```
AuthModal
  ├─ view='login'        登录表单（邮箱 + 密码 + 「忘记密码」→ forgot）
  ├─ view='register'     注册表单（邮箱 + 密码 + 确认密码）
  │     ↓ register 成功后自动切换
  ├─ view='verify'       邮箱预填（只读）+ 6 位验证码 + 「重新发送」→ resend
  ├─ view='forgot'       邮箱输入 → 发送重置码 → 成功提示（附「返回登录」）
  └─ view='reset'        邮箱 + 重置码 + 新密码（从 forgot 带 email 自动转入）
```

**Tab 结构**：仅 login / register 两个 Tab 常驻顶部；verify 是 register 成功后自动切换出的子视图（不带 Tab），底部有「返回注册」小链接。

**交互要点：**

- 客户端校验前置：邮箱格式、密码 ≥ 8 位、两次密码一致、验证码 6 位
- `register` 提交 → 后端返回 `{ message, email }` → 自动切 view='verify'，邮件已发
- `resend` 成功 → 「验证码已重发」提示；后端 resend 仅对未激活用户有效（404 时提示「该邮箱已注册/已验证，请直接登录」）
- `verify` 成功 → 写 token → 关闭登录弹窗（直接登录态）
- `forgot` 发送成功 → 切 `reset` view（预填邮箱）
- 提交中按钮 loading + disabled，防重复提交
- 注册/登录首页：错误内联红字；网络错误兜底文案

**视觉规范（沿用 SettingsModal）：**

- 容器：`bg-white rounded-2xl shadow-xl w-full max-w-md`
- 输入框：`px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none`
- 主按钮：`bg-blue-600 text-white rounded-lg hover:bg-blue-700`
- 错误：`text-red-500 text-sm`
- 遮罩：`bg-black/50 backdrop-blur-sm`，点击遮罩关闭

### 4.2 Header 改造

**未登录：** 现有设置图标旁加「登录」文字按钮（蓝底白字圆角）。

**已登录：** 替换为用户头像圆（nickname 首字符，无昵称用邮箱首字母），hover 展开下拉菜单：

```
┌────────────────────┐
│ 👤 昵称 · email    │  ← 静态信息（localStorage user 缓存）
│ ────────────────── │
│ 退出登录           │  ← POST /api/auth/logout + 清存储
└────────────────────┘
```

**简化决策（YAGNI）：** 本期下拉菜单只放「退出登录」，不做「修改昵称」编辑态（`PUT /api/user/config` 接口已就绪，后续迭代加）。

### 4.3 `useAuth` 与多标签页同步

```typescript
// auth.ts 模块级状态（不引入 Context/Redux）
let currentUser: UserResponse | null = null;
const listeners = new Set<() => void>();
export const useAuth = () => { /* useReducer 订阅、返回 user/isLoggedIn */ };
```

- Header + AuthModal 各调用一次 `useAuth()`，登录/登出/初始化时 notify
- 多标签页：`window.addEventListener('storage', ...)` —— 本标签页写 localStorage 时其他标签页收事件 → 同步 `currentUser`

---

## 五、错误处理映射

| 后端响应 | 位置 | 前端展示 |
|---|---|---|
| `400 邮箱和密码不能为空` 等字段校验 | 字段下方 | 红字文案（展示后端 `error` 字符串） |
| `401 INVALID_CREDENTIALS`（登录密码错） | 登录表单底部 | 红字「邮箱或密码错误」 |
| `403 EMAIL_NOT_VERIFIED` | 登录表单底部 | 红字「请先验证邮箱」+ 「去验证」链接（切 view='verify' 需 email——登录时回填当前输入的邮箱） |
| `409 EMAIL_TAKEN` | 注册表单底部 | 红字「该邮箱已被注册」 |
| `400 INVALID_CODE` | verify / reset 表单底部 | 「验证码错误」 |
| `400 CODE_EXPIRED` | verify / reset 表单底部 | 「验证码已过期，请重新获取」 |
| `404 用户不存在或已验证`（resend） | verify 表单底部 | 「该邮箱已注册，请直接登录」+ 跳转 login |
| `400 用户不存在`（verify 时数据库异常） | verify 表单底部 | 「用户不存在，请重新注册」 |
| `401 INVALID_REFRESH` | 全局 | 静默清状态，回未登录 |
| fetch 抛异常（断网等） | 当前视图底部 | 「网络异常，请检查网络后重试」 |

> 后端统一返回 `{ error: string, code?: string }`，前端展示 `error` 文案，`code` 用于逻辑分支。

---

## 六、`initAuth` 启动流程（挂载 `main.tsx`）

```
main.tsx
  └─ auth.initAuth()  异步、不阻塞渲染
        ├─ refresh token 不存在 → 未登录
        ├─ 存在 → POST /api/auth/refresh
        │         ├─ 成功 → 写新 access → GET /api/user/me → currentUser → notify
        │         └─ 失败 → 静默清存储，未登录
        └─ 完成
```

initAuth 期间 Header 显示未登录态；完成后如有用户则直接跳已登录，无中间闪烁。

---

## 七、后端接口契约（已实现，仅对接参考）

| 接口 | 请求 | 成功响应 |
|---|---|---|
| `POST /api/auth/register` | `{ email, password }` | `{ message, email }`（发验证码） |
| `POST /api/auth/verify` | `{ email, code }` | `{ message, user, tokens: { access, refresh } }` |
| `POST /api/auth/resend` | `{ email }` | `{ message: '验证码已重发' }` |
| `POST /api/auth/login` | `{ email, password }` | `{ user, tokens }` |
| `POST /api/auth/refresh` | `{ refresh }` | `{ tokens: { access, refresh } }` |
| `POST /api/auth/logout` | Bearer | `{ message }` |
| `POST /api/auth/forgot` | `{ email }` | `{ message }` |
| `POST /api/auth/reset` | `{ email, code, password }` | `{ message }` |
| `GET /api/user/me` | Bearer | `{ user }` |
| `PUT /api/user/config` | Bearer, `{ nickname? }` | `{ user }` |

`UserResponse`：`{ id, email, nickname, avatar_url, tier, email_verified }`；`Tokens`：`{ access, refresh }`。

错误响应统一：`{ error: string, code?: string }`。

---

## 八、实施顺序

1. `src/services/auth.ts`：存储工具 + API 方法 + `authFetch` + 刷新排队 + `useAuth` + `initAuth`
2. `src/components/AuthModal.tsx`：五视图弹窗（login/register/verify/forgot/reset）+ 错误内联
3. `src/components/Header.tsx`：登录按钮 / 用户菜单 + 挂载 AuthModal
4. `src/main.tsx`：`initAuth()` 调用
5. `npx tsc -b` 类型检查 + `npm run build` 构建验证
6. 手动验收清单逐条核对

---

## 九、验收清单（手动）

- [ ] 注册新邮箱（密码 ≥ 8 位）→ 收验证码 → verify 成功直接登录 → Header 显示用户
- [ ] 重复注册同一邮箱 → 「该邮箱已被注册」
- [ ] 登录错误密码 → 「邮箱或密码错误」
- [ ] 注册后未验证直接登录（同邮箱）→ 「请先验证邮箱」+ 「去验证」跳转正常
- [ ] 点「重新发送验证码」→ resend 成功提示；对已验证邮箱 resend → 提示去登录
- [ ] 验证码过期（等 10 分钟或构造过期 code）→ 「验证码已过期，请重新获取」
- [ ] 刷新浏览器 → 自动恢复登录态
- [ ] 退出登录 → Header 回未登录态
- [ ] 忘记密码 → 提交邮箱 → 填重置码 + 新密码 → 用新密码登录成功
- [ ] 构造过期 access → 下次 authFetch 自动 refresh 成功
- [ ] A 标签页登录 → B 标签页 storage 事件自动同步
- [ ] 未登录完整回归：AI 助教、知识点、速查表不受影响

---

## 十、已知限制

- 不支持第三方登录（本期明确不做）
- 多域名登录态不跨域（localStorage 隔离），各域名需分别登录
- access token 存 localStorage 有 XSS 理论风险（与项目 AI API Key 同等存储策略，保持一致；后端 JWT 15min 短有效期降低风险窗口）
- 修改昵称本期不做（接口就绪，后续迭代）
