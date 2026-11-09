# 用户体系部署指南

> 认证 / 会员 / AI 网关全部运行在 Cloudflare Workers 上（`school-formula-api`）。
> 整体部署流程见 [DEPLOYMENT.md](DEPLOYMENT.md)，本文只覆盖用户体系相关的资源配置。

## 前置条件

- Cloudflare 账号（已托管 `syy.global` / `syy.mobi` / `syy.one` 域名）
- Wrangler CLI（`npm install -g wrangler` 或用仓库 devDependencies 里的 `npx wrangler`）

## 部署步骤

### 1. 创建 D1 数据库

```bash
npx wrangler d1 create school-formula-db
# 将返回的 database_id 填入 wrangler.toml 的 [[d1_databases]]
```

### 2. 创建 KV 命名空间

```bash
npx wrangler kv:namespace create SESSIONS
# 将返回的 id 填入 wrangler.toml 的 [[kv_namespaces]]
```

### 3. 初始化数据库表

```bash
npx wrangler d1 execute school-formula-db --remote --file=db/schema.sql
```

CI 部署时 `deploy-cloudflare.yml` 会先跑 `d1 migrations apply school-formula-db --remote`。

### 4. 设置 Secrets

```bash
npx wrangler secret put JWT_SECRET
# 输入：至少 32 字符的随机字符串（openssl rand -hex 32）
```

### 5. 配置邮件发送（Resend）

验证码 / 密码重置邮件走 **Resend**（`worker/lib/email.ts`）。旧的 MailChannels 免费接口已于 2024-06-30 停服，不要再按老文档配置。

1. 在 [Resend](https://resend.com/domains) 添加并验证 `syy.global`（MX / SPF / DKIM 三条记录加到 Cloudflare DNS）
2. 写入 secret：`npx wrangler secret put RESEND_API_KEY`
3. `wrangler.toml` 的 `[vars]` 里 `FROM_EMAIL` 必须是已验证域名下的地址（当前 `noreply@syy.global`）

备选方案是 Cloudflare Email Service 的 `[[send_email]]` 绑定（`EMAIL`），代码会优先使用它、Resend 退为兜底。

完整步骤、排错表与应急取码方式见 [docs/email.md](docs/email.md)。本地 `wrangler dev` 未配置任何通道时，验证码会打印到 wrangler 控制台。

### 6. 配置 AI 网关（可选）

不配置时 `/api/ai/*` 返回 `503 GATEWAY_NOT_CONFIGURED`：

1. 在 [Cloudflare AI Gateway 控制台](https://ai.cloudflare.com) 创建网关
2. `wrangler.toml` 的 `[vars]` 填：
   - `AI_GATEWAY_BASE` = 网关 Base URL
   - `AI_GATEWAY_TOKEN` = 网关 Service Token 或 Cloudflare API Token
   - `AI_GATEWAY_MODEL` = 默认模型（当前 `deepseek-flash`；旧名 `deepseek-chat` / `deepseek-reasoner` 已于 2026-07-24 下线）

### 7. 本地开发

```bash
# 终端 1：启动 Worker（默认 http://localhost:8787）
npx wrangler dev worker/index.ts

# 终端 2：前端开发服务器
npm run dev
```

前端 API 地址由 `src/services/api-base.ts` 解析：`.env.development` 的 `VITE_API_URL=http://localhost:8787` 生效；localhost 也有同地址兜底。`.env.production` 刻意留空 —— 生产按站点域名推导到 `api.<域名>`。

### 8. 部署

```bash
npx wrangler deploy
# 路由：api.syy.global/* / api.syy.mobi/* / api.syy.one/*（见 wrangler.toml routes）
```

CORS 白名单由 `[vars]` 的 `ALLOWED_ORIGINS` 控制（当前为三个站点域名，逗号分隔）。

## 认证流程说明

- **注册免验证**（方案 2）：`POST /api/auth/register` 直接激活账号（`email_verified=1`），邮箱仅用于找回密码，注册时**不**发验证码邮件。
- **找回密码**：`POST /api/auth/forgot` 发送 6 位验证码（10 分钟有效，经 Resend 或 Cloudflare Email Service 发出）→ `POST /api/auth/reset` 重置。为防邮箱枚举，forgot 对不存在的邮箱也返回相同文案。
- **会话**：JWT access token + KV 中的 refresh token（`/api/auth/refresh` 轮换，`/api/auth/logout` 失效）。

### 端点清单

| 路由 | 端点 |
|------|------|
| `/api/auth/*` | `register` / `login` / `refresh` / `logout` / `forgot` / `reset`（均 POST） |
| `/api/user/*` | `me`（GET）/ `config`（PUT） |
| `/api/ai/*` | AI 网关代理（按会员等级拦截，见 `worker/routes/ai.ts`） |
| `/api/health` | 健康检查 |

## 测试清单

- [ ] 注册 → 直接激活并自动登录（不收验证码邮件）
- [ ] 退出 → 重新登录
- [ ] 忘记密码 → 收到验证码邮件 → 重置成功
- [ ] 免费用户访问 Pro 端点返回 403
- [ ] refresh token 轮换正常（KV 中旧 token 失效）
- [ ] CORS 只允许 `ALLOWED_ORIGINS` 中的站点域名
- [ ] 未配置 `AI_GATEWAY_BASE` 时 `/api/ai/*` 返回 503

## 文件结构

```
├── wrangler.toml               # Workers 配置（routes / D1 / KV / vars）
├── worker/
│   ├── index.ts                # 入口 + 路由分发（/api/auth|user|ai|health）
│   ├── types.ts                # Env 等类型定义
│   ├── lib/
│   │   ├── jwt.ts              # JWT 签名/验证
│   │   ├── password.ts         # PBKDF2 密码哈希
│   │   └── email.ts            # 验证码邮件（EMAIL 绑定 / Resend）
│   └── routes/
│       ├── auth.ts             # /api/auth/*（register/login/refresh/logout/forgot/reset）
│       ├── user.ts             # /api/user/*（me/config）
│       └── ai.ts               # /api/ai/*（AI 网关代理，按会员等级拦截）
├── db/schema.sql               # D1 表结构
├── src/
│   ├── context/                # AuthContext.tsx + auth-context.ts
│   ├── hooks/useAuth.ts
│   ├── services/
│   │   ├── api-base.ts         # API base 统一解析（所有 fetch 后端的服务都从这里取）
│   │   └── auth.ts             # 认证 API 封装
│   ├── utils/jwt.ts            # JWT 存储
│   ├── components/auth/        # Login/Register/ForgotPassword/Paywall/UserMenu 五个 Modal
│   └── guards/RequireTier.tsx  # 会员等级拦截
└── .env.development            # VITE_API_URL=http://localhost:8787（.env.production 为空）
```
