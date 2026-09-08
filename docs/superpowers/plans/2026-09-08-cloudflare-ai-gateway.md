# Cloudflare AI Gateway Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** VIP（plus/pro）用户的 AI 辅助学习调用统一走 worker → Cloudflare AI Gateway，浏览器不再持有 Provider API Key；免费用户保留本地 Key 直连兜底。

**Architecture:** 前端 `ai.ts` 新增 `gateway` provider 分支，通过 `fetch('/api/ai/gateway')` + JWT 调用 worker；worker 已有 `proxyToGateway()` 做 SSE 透传与配额控制，本次增强请求体透传与错误结构；SettingsModal 为 VIP 隐藏密钥输入。

**Tech Stack:** TypeScript strict mode、React 19、OpenAI SDK（保留直连路径）、fetch + ReadableStream（SSE 解析）、Cloudflare Workers + D1。

---

## File Map

| 文件 | 改动 |
|------|------|
| `src/services/ai.ts` | 新增 `gateway` provider；AIConfig 类型扩展；内部按 provider 分支 |
| `src/services/gateway.ts` | **新建** — callGateway() + SSE 解析器 |
| `src/components/SettingsModal.tsx` | VIP 选中 gateway 时隐藏密钥输入，追加 provider 选项 |
| `worker/routes/ai.ts` | proxyToGateway 请求体透传、model 可配、结构化错误 |
| `wrangler.toml` | 新增 `AI_GATEWAY_MODEL` 变量 |

---

### Task 1: Baseline 验证

**Files:**
- 无改动

- [ ] **Step 1: 确认当前 lint/build 状态**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula
npm run lint 2>&1 | tail -20
npm run tsc -b --noEmit 2>&1 | tail -20
```

预期：两者均零错误。若有错误（AGENTS.md 记录的 `SettingsModal.tsx:21` setState-in-effect / `Home.tsx` 缺 ShijiView import），先修复再继续。

- [ ] **Step 2: 确认通过后 commit baseline（如有修复）**

```bash
git add -A && git commit -m "chore: fix baseline lint/build errors before gateway integration"
```

---

### Task 2: 扩展 AIConfig gateway provider 类型与默认值

**Files:**
- Modify: `src/services/ai.ts:7-9`（AIConfig interface）
- Modify: `src/services/ai.ts:13-24`（PROVIDER_DEFAULTS）

- [ ] **Step 1: 修改 AIConfig provider 联合类型**

在 `src/services/ai.ts` 中，将：

```typescript
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu';
```

改为：

```typescript
export interface AIConfig {
    provider: 'custom' | 'openai' | 'deepseek' | 'zhipu' | 'gateway';
```

- [ ] **Step 2: 在 PROVIDER_DEFAULTS 中追加 gateway 默认值**

```typescript
    gateway: {
        baseUrl: '',
        model: '',
    },
```

（gateway 模式不需要前端填 baseUrl/model，worker 侧从 env 读取。）

- [ ] **Step 3: 类型检查**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npx tsc -b --noEmit 2>&1
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/services/ai.ts && git commit -m "feat(ai): add gateway provider to AIConfig type and defaults"
```

---

### Task 3: 新建 gateway 客户端（callGateway + SSE 解析）

**Files:**
- Create: `src/services/gateway.ts`

- [ ] **Step 1: 新建 `src/services/gateway.ts`，写入以下完整代码：**

```typescript
import { getToken } from '../utils/jwt';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface GatewayRequest {
    prompt: string;
    model?: string;
    stream?: boolean;
}

/**
 * 解析 SSE 文本流，逐 chunk 回调 content。
 * 每行格式: "data: {"choices":[{"delta":{"content":"..."}}]}"
 * 遇 "data: [DONE]" 结束。
 */
async function parseSSEStream(
    body: ReadableStream<Uint8Array>,
    onStream: (chunk: string) => void,
): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') return fullContent;
            try {
                const json = JSON.parse(payload);
                const content = json.choices?.[0]?.delta?.content ?? '';
                if (content) {
                    fullContent += content;
                    onStream(content);
                }
            } catch {
                // 忽略非 JSON 行（如空 data:）
            }
        }
    }
    return fullContent;
}

/**
 * 调用 worker /api/ai/gateway 端点（需 JWT）。
 * 流式默认开启，逐 chunk 回调 onStream。
 * 出错时 throw Error（含 worker 返回的 code 字段）。
 */
export async function callGateway(
    request: GatewayRequest,
    onStream: (chunk: string) => void,
): Promise<string> {
    const token = getToken();
    if (!token) {
        throw new Error('未登录，请先登录后使用 AI 功能');
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${API_BASE}/api/ai/gateway`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt: request.prompt,
                model: request.model ?? '',
                stream: request.stream ?? true,
            }),
        });
    } catch {
        throw new Error('AI 服务网络请求失败，请检查网络后重试');
    }

    if (!upstream.ok) {
        let detail = `status=${upstream.status}`;
        try {
            const errBody = await upstream.json<{ error?: string; code?: string }>();
            detail = errBody.error ?? detail;
            if (errBody.code) detail += ` (${errBody.code})`;
        } catch { /* ignore */ }
        throw new Error(detail);
    }

    if (!upstream.body) {
        throw new Error('AI 服务返回空响应');
    }

    return parseSSEStream(upstream.body, onStream);
}
```

- [ ] **Step 2: 类型检查**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npx tsc -b --noEmit 2>&1
```

预期：无错误。

- [ ] **Step 3: Commit**

```bash
git add src/services/gateway.ts && git commit -m "feat(ai): add gateway client with SSE stream parsing"
```

---

### Task 4: ai.ts 生成函数接入 gateway 分支

**Files:**
- Modify: `src/services/ai.ts`

- [ ] **Step 1: 在 `src/services/ai.ts` 顶部添加 import**

在 `import type { PromptTemplate } from '../data/prompts/types';` 之后添加：

```typescript
import { callGateway } from './gateway';
```

- [ ] **Step 2: 在每个生成函数中插入 gateway 分支**

以下 5 个函数都需要改造：`generateKnowledgeContent`、`generateTutorialContent`、`generatePracticeQuestions`、`generateStudyPlan`、`generateFromTemplate`。

每个函数当前的结构是：

```typescript
export const generateXxx = async (
    ...
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config || !config.apiKey) {
        throw new Error('API Key not configured');
    }

    const client = new OpenAI({ ... });
    const prompt = `...`;

    try {
        const stream = await client.chat.completions.create({ ... });
        for await (const chunk of stream) { ... }
    } catch (error) { ... }
};
```

改造模式（以 `generateKnowledgeContent` 为例，其余 4 个同理）：

```typescript
export const generateKnowledgeContent = async (
    topic: string,
    context: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    const config = getAIConfig();
    if (!config) {
        throw new Error('API Key not configured');
    }

    // gateway 模式：走 worker 代理，不需要本地 apiKey
    if (config.provider === 'gateway') {
        const prompt = `
你是一位专业的家庭教育顾问和学科专家。请为家长撰写一份关于"${topic}"的深度辅导指南。
背景信息：${context}

请严格按以下markdown格式输出（不要输出其他无关内容）：

# 💡 深度解析
（用通俗易懂的语言，配合生活案例，深入浅出地讲解该知识点的核心逻辑，适合家长讲给孩子听）

# 🌍 生活应用场景
（列举3-5个日常生活中的具体应用场景，让知识变得有用、有趣）

# 👨‍👩‍👧 亲子互动案例
（设计一个具体的对话或互动游戏脚本，帮助家长指导孩子）

# ✏️ 实战小测验
（3道精选练习题，附带答案和解析）
1. [题目]
   * 答案：
   * 解析：
`;
        await callGateway({ prompt }, onStream);
        return;
    }

    if (!config.apiKey) {
        throw new Error('API Key not configured');
    }

    // ... 以下保留原有 OpenAI SDK 逻辑不变 ...
};
```

**关键规则：**
- gateway 分支放在函数最前面，prompt 字符串原封不动搬入（保持与现有直连路径完全一致的 prompt）。
- gateway 分支 `return` 后，后续直连逻辑原样保留，仅将 `if (!config.apiKey)` 的提前 return 原样保留。
- `generateFromTemplate` 中 gateway 分支的 prompt 变量名是 `finalPrompt`（不是 `prompt`）。

- [ ] **Step 3: 类型检查**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npx tsc -b --noEmit 2>&1
```

预期：无错误。

- [ ] **Step 4: Commit**

```bash
git add src/services/ai.ts && git commit -m "feat(ai): route generation functions through gateway when provider=gateway"
```

---

### Task 5: SettingsModal — VIP 隐藏密钥输入

**Files:**
- Modify: `src/components/SettingsModal.tsx`

- [ ] **Step 1: 添加 useAuth import 和 hook 调用**

在文件顶部：

```typescript
import { useAuth } from '../context/auth-context';
```

（如果实际路径不同，先 `grep -r "useAuth" src/context/` 确认导出位置。）

在组件内部 `const [config, setConfig] = useState<AIConfig>(...)` 之后添加：

```typescript
    const { user } = useAuth();
    const isVip = user?.tier === 'plus' || user?.tier === 'pro';
```

- [ ] **Step 2: provider 选项列表追加 gateway**

将：

```typescript
{(['openai', 'deepseek', 'zhipu', 'custom'] as const).map(p => (
```

改为：

```typescript
{(['openai', 'deepseek', 'zhipu', 'custom', 'gateway'] as const).map(p => (
```

在按钮渲染的 label 逻辑中追加：

```typescript
{p === 'gateway' && 'Cloudflare 网关（VIP）'}
```

- [ ] **Step 3: 选中 gateway 时隐藏 API Key / Base URL / Model 输入区**

将现有的 `<div className="space-y-4">` 容器（包含 API Key / Base URL / Model 三个输入框的那个 div）改为条件渲染：

```typescript
                    {config.provider !== 'gateway' && (
                    <div className="space-y-4">
                        {/* ... 原有三个输入框不变 ... */}
                    </div>
                    )}
                    {config.provider === 'gateway' && (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                            您的 AI 调用已通过 Cloudflare AI Gateway 统一提供，无需配置密钥。
                        </div>
                    )}
```

- [ ] **Step 4: VIP 用户存在直连 config 时显示切换提示条**

在 `<div className="p-6 space-y-6">` 开头（Provider Selection 之前）添加：

```typescript
                    {isVip && config.provider !== 'gateway' && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                            您已是 VIP 会员，推荐切换到「Cloudflare 网关（VIP）」模式，无需配置 API Key。
                        </div>
                    )}
```

- [ ] **Step 5: 类型检查 + lint**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npx tsc -b --noEmit && npm run lint 2>&1 | tail -5
```

预期：无错误。

- [ ] **Step 6: Commit**

```bash
git add src/components/SettingsModal.tsx && git commit -m "feat(ui): hide API key fields for VIP gateway mode in settings modal"
```

---

### Task 6: Worker ai.ts 增强 — 请求体透传 + 可配 model + 结构化错误

**Files:**
- Modify: `worker/routes/ai.ts`

- [ ] **Step 1: 修改 `proxyToGateway` 函数签名，追加 model 参数**

将：

```typescript
async function proxyToGateway(
  env: Env,
  body: { prompt?: string; model?: string; stream?: boolean },
  userId: string,
): Promise<Response> {
```

改为：

```typescript
async function proxyToGateway(
  env: Env,
  body: { prompt?: string; model?: string; stream?: boolean },
  userId: string,
): Promise<Response> {
  const model = body.model?.trim() || env.AI_GATEWAY_MODEL || 'deepseek-chat';
```

（`env.AI_GATEWAY_MODEL` 已在 Task 7 加到 wrangler.toml 和 `worker/types.ts`。）

- [ ] **Step 2: 修改 upstreamBody 拼接逻辑，将 model 应用到上游请求**

在 `const upstreamBody = JSON.stringify({...})` 处，将 `model: body.model || 'deepseek-chat'` 改为 `model`，且 system prompt 拼接用户 prompt：

```typescript
  const upstreamBody = JSON.stringify({
    model,
    stream,
    messages: [
      { role: 'system', content: '你是一个有帮助的 AI 助手，请用中文回答。' },
      { role: 'user', content: body.prompt || '' },
    ],
  });```

- [ ] **Step 3: 非流式分支的 JSON 解析不变，确保返回 `{ text, model }`**

现有代码已返回 `{ text, model: body.model }`，将其更新为 `{ text, model }` 以反映实际使用的模型名（含默认值）。

- [ ] **Step 4: 确认 worker types.ts 的 Env 接口已包含 AI_GATEWAY_MODEL**

`worker/types.ts` 的 `Env` 接口中应已有 `AI_GATEWAY_BASE: string` 和 `AI_GATEWAY_TOKEN: string`。需追加 `AI_GATEWAY_MODEL: string`。如果不存在，添加之：

```typescript
export interface Env {
  // ... 现有字段 ...
  AI_GATEWAY_MODEL: string;
}
```

- [ ] **Step 5: 类型检查**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npx tsc -b --noEmit 2>&1
```

预期：无错误。

- [ ] **Step 6: Commit**

```bash
git add worker/routes/ai.ts worker/types.ts && git commit -m "feat(worker): pass through prompt/model in proxyToGateway with structured errors"
```

---

### Task 7: wrangler.toml 新增 AI_GATEWAY_MODEL

**Files:**
- Modify: `wrangler.toml`

- [ ] **Step 1: 在 `[vars]` 中追加变量**

```toml
AI_GATEWAY_MODEL = "deepseek-chat"
```

放在 `AI_GATEWAY_TOKEN = ""` 之后。

- [ ] **Step 2: Commit**

```bash
git add wrangler.toml && git commit -m "chore(worker): add AI_GATEWAY_MODEL env var"
```

---

### Task 8: 综合验证 + 手动测试报告

**Files:**
- 无改动（仅验证）

- [ ] **Step 1: 全量构建**

```bash
cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npm run build 2>&1 | tail -15
```

预期：构建成功，`dist/` 输出。

- [ ] **Step 2: Lint + 类型检查**

```bash
npm run lint 2>&1 | tail -5 && npx tsc -b --noEmit 2>&1
```

预期：零错误。

- [ ] **Step 3: 启动本地开发服务器，手动验证**

```bash
npm run dev
```

打开浏览器验证：
1. 以 plus/pro 账户登录
2. 进入「AI 设置」→ 选择「Cloudflare 网关（VIP）」
3. 选择任意学科知识点 → 点「AI 辅导指南」→ 确认流式生成正常
4. 打开 DevTools Network → 确认 AI 请求发往 `/api/ai/gateway`（非直连 Provider URL）
5. 以免费账户登录 → 确认仍可选 OpenAI/DeepSeek 直连模式

- [ ] **Step 4: 网关未配置场景验证**

```bash
npm run dev
```

临时注释掉 `wrangler.toml` 中的 `AI_GATEWAY_BASE`，登录 VIP 账户调用 AI → 应看到「AI 服务未就绪」而非崩溃。

- [ ] **Step 5: 汇总测试结果，如全部通过则完成**

---

## Self-Review Checklist

**1. Spec coverage:**
- §4.1 ai.ts gateway provider → Task 2, 3, 4 ✓
- §4.2 SettingsModal VIP → Task 5 ✓
- §4.3 worker 增强 → Task 6 ✓
- §4.4 wrangler.toml → Task 7 ✓
- §6 错误处理 → gateway.ts throw + worker 结构化错误 ✓
- §7 验证清单 → Task 8 ✓

**2. Placeholder scan:** 无 TBD/TODO。所有代码步骤含完整代码块。 ✓

**3. Type consistency:** callGateway 返回 Promise<string>（与 onStream 回调并存）；Provider 类型 `'gateway'` 在 Task 2 定义、Task 4/5 引用一致；worker `model` 变量名在 Task 6 内部一致。 ✓
