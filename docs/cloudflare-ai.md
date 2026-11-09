# Cloudflare AI 功能开发指南

- **Status:** 已切到 DeepSeek 直连（`AI_GATEWAY_BASE = https://api.deepseek.com`）；`AI_GATEWAY_TOKEN` 用 `wrangler secret put` 注入，仓库内保持空串
- **适用范围:** `worker/routes/ai.ts`、`src/services/gateway.ts`、`src/services/ai.ts`、`wrangler.toml`
- **相关文档:** [DEPLOYMENT.md](../DEPLOYMENT.md)、[DEPLOY_AUTH.md](../DEPLOY_AUTH.md)、[adsense.md](adsense.md)

## 概述

AI 功能全部跑在 Cloudflare 上，没有独立服务器。请求链路：

```text
浏览器
  │  Bearer <JWT>
  ▼
Worker  /api/ai/*                        worker/index.ts
  │  1. verifyJWT                       worker/lib/jwt.ts
  │  2. tier 校验（plus / pro）          worker/routes/user.ts
  │  3. 配额检查 + 计数（D1）            worker/routes/ai.ts
  ▼
Cloudflare AI Gateway
  │  缓存 / 重试 / 限流 / 日志 / BYOK
  ▼
DeepSeek（OpenAI Chat Completions 协议）
  │  SSE 流
  ▼
Worker 透传 + token 估算写回 D1
  ▼
浏览器  parseSSEStream -> 逐字渲染
```

Cloudflare 各组件在这里的分工：

| 层 | 组件 | 项目内位置 | 作用 |
|---|---|---|---|
| 接入 | Workers | `worker/index.ts` | 路由分发、CORS、静态资源、SSE 透传 |
| 模型 | AI Gateway | `worker/routes/ai.ts` | 代理第三方模型，缓存、重试、限流、日志、密钥保管 |
| 模型 | Workers AI（`env.AI`） | **未接入** | 平台自带模型，无需外部 key，有免费额度 |
| 状态 | D1 | `worker/migrations/0001_ai_quota.sql` | 用户、会员、每日配额、token 用量 |
| 状态 | KV | `SESSIONS` | 会话（refresh token） |
| 检索 | Vectorize | **未接入** | RAG 向量检索 |
| 编排 | Durable Objects / Queues / Workflows | **未接入** | 多轮会话、长任务 |
| 观测 | AI Gateway 日志 | 控制台 | 请求量、token、成本、失败率 |

> `ai_quota` 表不在 `db/schema.sql` 里，而是由 `worker/migrations/0001_ai_quota.sql` 创建。CI 先跑 schema 再跑 migrations，两处都要保留。

## 三种接入方式

| 方式 | 密钥位置 | 计费 | 适用场景 | 现状 |
|---|---|---|---|---|
| A. AI Gateway → DeepSeek | Worker secret | 按 token | 主力链路，质量最好 | 代码完成，配置为空 |
| B. Workers AI `env.AI.run` | 无需 key | 免费额度 + neuron | 免费档、降级兜底、摘要/分类/embedding | 未接入 |
| C. 浏览器直连 | 用户 localStorage | 用户自付 | 早期试用、自带 key 的用户 | 已有（`src/services/ai.ts`），不推荐生产 |

推荐组合：**A 做主力 + B 做兜底**。免费用户走 B，plus/pro 走 A，网关故障时自动降级。

## 路线 A：AI Gateway（主力）

### 1. 创建网关

Cloudflare 控制台 → **AI → AI Gateway** → 新建网关，记下 `account_id` 与 `gateway_id`。

DeepSeek 的 provider-native 端点：

```text
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/deepseek
```

Worker 会在这串后面拼 `/chat/completions`，所以 `AI_GATEWAY_BASE` 填**不带结尾斜杠**的这一串。

### 2. 写入配置

```bash
# Base URL 不是秘密，可以留在 wrangler.toml 的 [vars]
# token 必须走 secret：wrangler.toml 会提交进 git，[vars] 是明文
npx wrangler secret put AI_GATEWAY_TOKEN

# 本地开发用 .dev.vars（已在 .gitignore 中）
printf 'AI_GATEWAY_TOKEN=%s\n' 'your-token' >> .dev.vars
```

> **`AI_GATEWAY_TOKEN` 到底放什么？** 取决于 `AI_GATEWAY_BASE`：
>
> | Base | 变量值 | 实际发出的 Header |
> |---|---|---|
> | `https://api.deepseek.com` | DeepSeek key（`sk-...`） | `Authorization` |
> | `https://gateway.ai.cloudflare.com/.../deepseek`，网关未开鉴权 | DeepSeek key | `Authorization` |
> | 同上，网关开了鉴权（新建网关默认开） | Cloudflare AI Gateway token | 需 `cf-aig-authorization`，当前代码只发 `Authorization` → 401 |
>
> 变量名是历史遗留：它命名成"网关 token"，但代码把它放在 provider key 的位置。直连场景下请把它当成 `AI_API_KEY` 理解。

对应 `wrangler.toml`：

```toml
[vars]
AI_GATEWAY_BASE = "https://gateway.ai.cloudflare.com/v1/<account_id>/<gateway_id>/deepseek"
AI_GATEWAY_MODEL = "deepseek-flash"
AI_THINKING = "disabled"
```

### 3. 鉴权头：必须区分两个概念

新建的 AI Gateway **默认开启 Authenticated Gateway**。provider-native 端点（`gateway.ai.cloudflare.com`）上：

| Header | 放什么 | 什么时候发 |
|---|---|---|
| `cf-aig-authorization` | Cloudflare AI Gateway token | 网关开了鉴权（新网关默认开）**必发** |
| `Authorization` | provider key（DeepSeek key） | 没有用 BYOK 时发；用了 BYOK **不要发** |

当前实现只发了 `Authorization`（`worker/routes/ai.ts` 的 `proxyToGateway`），因此只有「网关未开鉴权 + token 就是 DeepSeek key」这一种情况能跑通。

**修法**（把两个变量拆开，兼容 BYOK 与非 BYOK）：

```ts
// worker/types.ts
AI_GATEWAY_TOKEN: string;   // cf-aig-authorization
AI_PROVIDER_KEY: string;    // Authorization（BYOK 时留空）

// worker/routes/ai.ts -> proxyToGateway()
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: stream ? 'text/event-stream' : 'application/json',
};
if (env.AI_GATEWAY_TOKEN) {
  headers['cf-aig-authorization'] = `Bearer ${env.AI_GATEWAY_TOKEN}`;
}
if (env.AI_PROVIDER_KEY) {
  headers.Authorization = `Bearer ${env.AI_PROVIDER_KEY}`;
}
```

### 4. 前端调用

前端不需要改。`src/services/gateway.ts` 已封装：

- `callGateway({ prompt })`：单轮
- `chatGateway({ messages })`：多轮，带完整上下文
- 两者都默认 `stream: true`，逐 chunk 回调，最终返回完整文本

```ts
import { chatGateway } from '../services/gateway';

await chatGateway(
  { messages: [{ role: 'user', content: '解释一下分数' }] },
  (chunk) => setText((prev) => prev + chunk),
);
```

### 5. 失败模式

| 现象 | 原因 | 处理 |
|---|---|---|
| `503 GATEWAY_NOT_CONFIGURED` | `AI_GATEWAY_BASE` 为空 | 填 Base URL |
| `503 GATEWAY_TOKEN_MISSING` | `AI_GATEWAY_TOKEN` 为空 | `wrangler secret put` |
| `502 GATEWAY_UPSTREAM_ERROR` + 401 | 用了 `Authorization` 做网关鉴权 | 改 `cf-aig-authorization` |
| `403 UPGRADE_REQUIRED` | 用户是 free | 正常拦截，前端引导升级 |
| `429 AI_QUOTA_EXCEEDED` | plus 当日 50 次用完 | 正常拦截 |
| `400 Model Not Exist` | 用了 2026-07-24 已下线的 `deepseek-chat` / `deepseek-reasoner` | 改用 `deepseek-flash` 或 `deepseek-v4-pro` |

### 6. 有 DeepSeek key 时的最短路径（直连）

`proxyToGateway` 只依赖三件事：`base + /chat/completions`、`Authorization: Bearer`、OpenAI 消息体。所以**不改代码**就能跳过 AI Gateway，把 base 直接指向 DeepSeek：

```bash
# key 存 secret，不要写进 wrangler.toml
npx wrangler secret put AI_GATEWAY_TOKEN   # 粘贴 DeepSeek API key
```

```toml
[vars]
AI_GATEWAY_BASE = "https://api.deepseek.com"
AI_GATEWAY_MODEL = "deepseek-flash"
AI_THINKING = "disabled"
```

验证：

```bash
curl -s https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{"model":"deepseek-flash","stream":false,"messages":[{"role":"user","content":"你好"}]}'
```

代价：没有网关的缓存、请求日志、自动重试。需要这些能力时再把 base 换成网关地址，并补上 `cf-aig-authorization`（见上文第 3 节）。

DeepSeek 现行价格（每 1M tokens，2026-11）：

| 模型 | 输入（缓存命中） | 输入（缓存未命中） | 输出 |
|---|---|---|---|
| `deepseek-flash` | $0.003 / $0.006 | $0.15 / $0.30 | $0.60 / $1.20 |
| `deepseek-v4-pro` | $0.022 / $0.044 | $0.66 / $1.32 | $1.98 / $3.96 |

> 斜杠前为非高峰价、后为高峰价（高峰为 UTC 周一至周五 01:00–04:00、06:00–10:00）。一次家长辅导指南（约 1,500 输出 token）在 flash 上不到 $0.002。

## 路线 B：Workers AI（兜底 / 免费档）

### 1. 绑定

```toml
# wrangler.toml
[ai]
binding = "AI"
```

项目没有安装 `@cloudflare/workers-types`（`worker/types.ts` 里 `ExecutionContext` 也是本地声明的），补最小接口即可：

```ts
export interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

// Env
AI: AiBinding;
AI_PROVIDER: 'gateway' | 'workers-ai';
```

### 2. 调用

```ts
const res = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [{ role: 'user', content: prompt }],
  stream: true,
});
return new Response(res, { headers: { 'Content-Type': 'text/event-stream' } });
```

模型名更新很快，以[模型目录](https://developers.cloudflare.com/workers-ai/models/)为准。

### 3. SSE 格式差异（必须处理）

Workers AI 的流是 `data: {"response":"token"}`；本项目前端只认 OpenAI 的 `choices[0].delta.content`。在 Worker 侧重封装，前端就不用动：

```ts
function toOpenAIStream(input: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = '';

  return input.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, ctrl) {
        buf += dec.decode(chunk, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const payload = t.slice(5).trim();
          if (payload === '[DONE]') {
            ctrl.enqueue(enc.encode('data: [DONE]\n\n'));
            continue;
          }
          try {
            const text = (JSON.parse(payload) as { response?: string }).response ?? '';
            if (text) {
              ctrl.enqueue(
                enc.encode(
                  `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`,
                ),
              );
            }
          } catch {
            /* 非 JSON 行忽略 */
          }
        }
      },
      flush(ctrl) {
        ctrl.enqueue(enc.encode('data: [DONE]\n\n'));
      },
    }),
  );
}
```

### 4. 分派

在 `handleAI` 里按 `env.AI_PROVIDER` 分派；或按 `payload.tier` 决定：free → Workers AI，plus/pro → 网关。网关报错时也可回落到 Workers AI，避免整页失败。

## 上线前必须补齐的四件事

### 1. 配额与计费

已实现：`worker/routes/ai.ts` 用单条原子 SQL 完成「读-比-加-写」，避免并发超卖；流结束时用 `TransformStream` 回写 token 估算。

可改进：

- `chars / 4` 是估算值；非流式响应里网关会返回真实 `usage`，优先用它。
- 缓存命中时网关同样返回 `usage`，注意别重复计费。
- 建议给 `ai_quota` 加 `cost_cents`，按模型单价折算，pro 也设软上限 + 告警。

### 2. 缓存（最省钱）

AI Gateway 控制台开启 **Cache Responses**，或按请求加头：

```text
cf-aig-cache-ttl: 86400      # 秒
cf-aig-skip-cache: true      # 需要绕过时
```

缓存键默认由 provider、endpoint、model、鉴权头、完整 body 哈希而成，差异一个字符就 miss。响应头 `cf-aig-cache-status: HIT|MISS` 可以回传前端。缓存对确定性、非流式请求收益最大。

### 3. 限流

会员配额是「每天 50 次」，挡不住 1 秒内刷 50 次。复用 `worker/lib/rate-limit.ts` 的 D1 方案，key 用 `ai:${userId}`，窗口 60s、上限 10 次即可，不必引入新依赖。AI Gateway 侧的限流是全局的，只能兜底。

### 4. RAG（Vectorize）

知识点都在 `src/data/knowledge/`，模型并不知道你的教材版本，纯生成容易超纲。做法：

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "school-formula-kb"
```

```bash
npx wrangler vectorize create school-formula-kb --dimensions=1024 --metric=cosine
```

```ts
const emb = await env.AI.run('@cf/baai/bge-m3', { text: [question] });
const { matches } = await env.VECTORIZE.query(emb.data[0], {
  topK: 5,
  returnMetadata: 'all',
});
const context = matches.map((m) => m.metadata?.text).join('\n\n');
```

把 `context` 拼进 system prompt。灌库可以复用 `scripts/ingest-data/` 的链路，新增一个 embed 步骤。

## 进阶

- **多轮会话**：`/ai-chat` 目前是前端拼完整 messages 每次重发。要支持长会话、跨设备恢复，把历史落 D1 或 Durable Objects；WebSocket 长连接可以用 Cloudflare Agents SDK。
- **长任务**：批量生成教案、批量 embedding 放 Queues 或 Workflows，别在 HTTP 请求里跑（Worker 有 CPU 时间上限）。
- **降级**：网关 5xx 时自动切 Workers AI；两者都不可用时返回明确的 `AI_UNAVAILABLE`，而不是 500。

## 落地顺序

1. 建网关 → `AI_GATEWAY_BASE` 填进 `[vars]` → `wrangler secret put AI_GATEWAY_TOKEN`。
2. 修 `cf-aig-authorization`（不做这步，新网关必然 401）。
3. token 从 `[vars]` 移到 secret，拆出 `AI_PROVIDER_KEY`。
4. 接 Workers AI，加 `AI_PROVIDER` 开关做兜底。
5. 开网关缓存 + 复用 D1 限流。
6. Vectorize + `bge-m3` 做 RAG。
7. Durable Objects / Agents SDK 重做 `/ai-chat` 的会话层。

## 验证

```bash
# 类型 / lint / 单测 / 构建
npm run lint
npm test -- worker/routes/ai.test.ts
npm run build

# 本地起 Worker（Vite 的 /api 代理指向 8787）
npx wrangler dev worker/index.ts

# 健康检查
curl -s http://localhost:8787/api/health

# 带 JWT 打网关（-N 关掉缓冲，能看到流）
curl -N -X POST http://localhost:8787/api/ai/gateway \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $JWT" \
  -d '{"prompt":"用一句话解释分数","stream":true}'

# 确认绑定被识别（应出现 AI / VECTORIZE）
npx wrangler deploy --dry-run
```

## 成本与安全

- **不要**把 provider key 写进 `wrangler.toml`、前端代码或 `VITE_*` 变量——`VITE_*` 会被打进 bundle，等于公开。
- 浏览器直连模式（`src/services/ai.ts`）的 key 存在 localStorage，适合自带 key 的用户，不适合作为生产主链路。
- `worker/routes/ai.ts` 的 `catch` 故意不回传 `err.message`（可能含上游 token / 拓扑），新增路由保持同样习惯。
- AI Gateway token 是**账号级**的，无法只授权单个网关；不同租户要用不同 Cloudflare 账号或 Worker 侧绑定隔离。
- 免费额度用完会自动停，但配置了付费的 gateway 会直接产生账单；上线前给账号设预算告警。
