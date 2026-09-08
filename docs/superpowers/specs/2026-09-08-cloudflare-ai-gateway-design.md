# Cloudflare AI Gateway 集成设计

> 状态：已确认（2026-09-08）
> 关联分支：school-formula main
> 前置文档：`docs/superpowers/specs/2026-09-07-auth-membership-design.md`（会员体系）、`docs/superpowers/specs/2026-09-06-auth-flow-implementation-design.md`（认证流程）

---

## 1. 背景

`worker/routes/ai.ts` 已实现完整的 Cloudflare AI Gateway 代理（`proxyToGateway()`，含流式 SSE 透传、JWT 鉴权、Plus/Pro 配额、D1 计数），`wrangler.toml` 预留了 `AI_GATEWAY_BASE` / `AI_GATEWAY_TOKEN` 两个变量。但前端 `src/services/ai.ts` 仍然使用 OpenAI SDK 在浏览器直连第三方 Provider，API Key 存于 `localStorage`——VIP 用户无法享受 worker 侧受控的 AI Gateway 调用（无配额、无会员校验、密钥进浏览器）。

## 2. 目标

让 **VIP（plus/pro）用户**的 AI 辅助学习统一经过 worker → Cloudflare AI Gateway，浏览器不再持有 Provider API Key：

- VIP 前端调 `POST /api/ai/gateway`，携带 JWT，worker 校验会员与配额后，服务端持 Service Token 转发至 Cloudflare AI Gateway。
- 免费用户保留现有本地 Key 直连方式作为兜底，避免回归。
- 模型调用统一收敛到 Cloudflare AI Gateway 的 URL，网关后端 Model 由 worker 侧固定（通过 `AI_GATEWAY_BASE` 指向用户创建的网关），所有 provider 差异收敛到网关。

## 3. 方案：worker 代理为主，并存降级

```
VIP（plus/pro）                      free
     │                                │
     ▼                                ▼
前端 fetch /api/ai/gateway          前端 OpenAI SDK 直连
  Authorization: Bearer <JWT>      API Key 存 localStorage
     │                                │
     ▼                                ▼
worker 校验 JWT + tier + quota     第三方 Provider
     │
     ▼
Cloudflare AI Gateway
     │
     ▼
上游 Model Provider（如 DeepSeek）
```

---

## 4. 模块改造明细

### 4.1 `src/services/ai.ts` — 新增 gateway provider

**新增 AIConfig provider 值**：`'gateway'`（extending `AIConfig.provider`）。

**新增Gateway 请求与 SSE 解析**：新增内部函数 `callGateway(params, onStream)`：

- `fetch('/api/ai/gateway', { method, headers, body })`（路径通过 `VITE_API_URL` 解析 base）。
- `Authorization: Bearer ${JWT}`（JWT 从 `src/utils/jwt.ts` 读取，与 `src/services/auth.ts` 一致）。
- 请求体 `{ prompt, model, stream: true }` —— 与 worker 当前接口签名对齐。
- SSE 解析：逐行读 `ReadableStream`，匹配 `data: {...}`，从 `choices[0].delta.content` 增量回调 `onStream`；遇 `data: [DONE]` 结束。解析器复用一份独立函数，后续如 worker 返回格式微调只改这一处。

**改造现有 4 个生成函数**（`generateKnowledgeContent` / `generateTutorialContent` / `generatePracticeQuestions` / `generateStudyPlan`）与 `generateFromTemplate`：函数内部按 `config.provider` 分支：
- `provider === 'gateway'` → `callGateway(...)`，stream 回调不变，调用方代码零改动。
- 其他 → 保留现有 OpenAI SDK 路径（兼容 free 用户及将来直连需求）。

这样改造使得上层调用方（`KnowledgeDetail.tsx**）完全无感，member 切换 provider 即切换链路。

### 4.2 `src/components/SettingsModal.tsx` — VIP 隐藏密钥项

- provider 选项追加 `gateway`，label 显示「Cloudflare 网关（VIP）」。
- VIP 选中 `gateway` 时：
  - 隐藏 API Key / Base URL / Model 输入框；
  - 展示说明文案「您的 AI 调用已通过 Cloudflare AI Gateway 统一提供，无需配置密钥。」
- 当用户已是 VIP 但当前 config.provider 是直连时，弹窗顶部出现「推荐切换到网关模式」提示条。
- 会员状态从 `useAuth()` hook 读取（`user.tier`）判断是否 plus/pro。

### 4.3 `worker/routes/ai.ts` — 小幅增强现有 `proxyToGateway`

现有代码基本复用，调整如下：

1. **请求体透传**：当前 worker 内部固定了 system prompt + `deepseek-chat` 模型。改造为保留前端传入的 `prompt`（含完整 markdown 指令），仍由 worker 侧保证最低 system prompt 兜底（拼接在前端 prompt 之后），model 默认值改为从 `AI_GATEWAY_MODEL` 变量读取（如不设则保持 `deepseek-chat`）。
2. **SSE 错误事件透传**：网关 4xx/5xx 时保留 body 详情（现状已有），并向前端返回结构化 `{ error, code, detail }` 与 status，避免前端只能拿到空 502。
3. **配额失败也累加失败计数**（避免无限重试刷配额边缘实现按需，可后续迭代）。

### 4.4 `wrangler.toml` — 增补变量

```toml
[vars]
AI_GATEWAY_BASE = ""        # 网关 URL，如 https://gateway.ai.cloudflare.com/v1/<account>/<gateway-slug>
AI_GATEWAY_TOKEN = ""       # Service Token
AI_GATEWAY_MODEL = "deepseek-chat"   # 网关上游模型，默认 deepseek-chat
```

由运维通过 `wrangler secret put AI_GATEWAY_TOKEN` 注入；`AI_GATEWAY_BASE` / `AI_GATEWAY_MODEL` 走 `[vars]` 明文即可。

---

## 5. 数据流（VIP 完整链路）

1. 家长在知识点详情页点「AI 辅导指南」。
2. `KnowledgeDetail` 调 `generateKnowledgeContent(topic, context, setStream)`。
3. `ai.ts` 判定 `config.provider === 'gateway'` → 调 `callGateway()`。
4. `callGateway` 携带 JWT 调 `/api/ai/gateway`。
5. worker：`verifyJWT` → `hasTierAccess(tier,'plus')` → `checkAndRecordQuota` → `proxyToGateway` → Cloudflare AI Gateway。
6. 网关返回 SSE 流 → worker 透传 → 前端 `callGateway` 解析 `data:` 行 → 流式渲染 markdown。
7. 结束写 `ai_quota`（成功计 tokens，失败计 count）。

## 6. 错误处理

| 场景 | 前端表现 |
|------|---------|
| JWT 失效 | 401，跳转登录（沿用现有 auth 拦截） |
| tier 不满足 | 403 + `UPGRADE_REQUIRED`，弹升级引导（沿用 `RequireTier` 模式） |
| 配额耗尽 | 429 + `QUOTA_EXCEEDED`，提示「今日额度已用完」 |
| 网关未配置 | 503 + `GATEWAY_NOT_CONFIGURED`，提示「AI 服务未就绪」 |
| 网关上游错误 | 502 + detail，展示一句「AI 服务暂时不可用，请稍后重试」 |

## 7. 验证清单

- [ ] VIP 登录 → 设置切到「Cloudflare 网关」→ 四个 AI 生成函数全部走 worker → Gateway，浏览器 Network 只看到发往 `/api/ai/gateway` 的请求。
- [ ] 免费用户仍可用本地 Key 直连（回归保护）。
- [ ] 网关未配置（`AI_GATEWAY_BASE` 空）时 VIP 调用得到明确 503 文案而非崩溃。
- [ ] SSE 流式渲染无重复/乱码；`ai_quota` 表计数正确。
- [ ] 非会员直接请求 `/api/ai/gateway` 返回 403 且不消耗额度。

## 8. 不在本次范围

- 前端直连 Cloudflare Gateway（个人 Service Token 存 localStorage）——舍弃。
- 网关限流、缓存、日志观察等 AI Gateway 控制台侧配置——由运维在 Cloudflare Dashboard 完成。
- 免费用户强制走网关——留待会员转化策略确定后另议。
