import type { Env, ExecutionContext } from '../types';
import { verifyJWT } from '../lib/jwt';
import { hasTierAccess } from './user';

function jsonResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 400, code?: string): Response {
  return new Response(JSON.stringify({ error, code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 通过 Worker 暴露的模型白名单。
 *
 * - 默认值（`wrangler.toml` 的 `AI_GATEWAY_MODEL`）是 `deepseek-chat`；
 * - 计划 / 文档里显式提到 `deepseek-reasoner`（DeepSeek 推理模型）作为白名单成员；
 * - 只允许这两个：用户/前端把任意字符串塞进 `request.model` 时，Worker 应当
 *   静默回退到默认模型而不是允许任意上游调用。
 *
 * 白名单外的请求不会报错——只是被替换为 `env.AI_GATEWAY_MODEL`，
 * 避免单次用户输入把整个 AI 路径拒掉。
 */
const ALLOWED_MODELS: ReadonlySet<string> = new Set(['deepseek-chat', 'deepseek-reasoner']);

/** Resolve the model name actually sent to the gateway. */
function resolveModel(requested: string | undefined, env: Env): string {
  const fallback = env.AI_GATEWAY_MODEL || 'deepseek-chat';
  const candidate = requested?.trim();
  if (!candidate) return fallback;
  return ALLOWED_MODELS.has(candidate) ? candidate : fallback;
}

/** 当日 UTC 日期键（YYYY-MM-DD），用于用户级每日额度统计 */
function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 估算 token 数。
 *
 * 当前实现是简单的字符数 / 4（DeepSeek/OpenAI 的中英文混合经验值，
 * 4 个字符约对应 1 个 token）。导出供测试直接断言。
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * AI 请求配额检查与累加（写入 ai_quota 表）。
 * - pro 不限（直接放行，不写库）。
 * - plus 50 次/天，超限返回 `AI_QUOTA_EXCEEDED` (HTTP 429)。
 * - free 不允许调用，返回 `FORBIDDEN` (HTTP 403)。
 *
 * 用单条原子 SQL 完成「读旧 count → 比限 → +1 → 写回」以避免两个并发请求
 * 各自读到的 count 都是 49 时都再 +1，从而把上限超卖到 51。两个并发最多
 * 通过 UPDATE 看到的原子 count 之争决定谁能赢，输的那一次 `changes === 0`。
 */
async function checkAndRecordQuota(
  env: Env,
  userId: string,
  tier: string,
): Promise<
  | { allowed: true }
  | { allowed: false; code: 'FORBIDDEN' | 'AI_QUOTA_EXCEEDED'; status: 403 | 429 }
> {
  if (tier === 'pro') return { allowed: true };
  const LIMIT = tier === 'plus' ? 50 : 0;
  if (LIMIT === 0) return { allowed: false, code: 'FORBIDDEN', status: 403 };

  const day = dayKey();
  const updatedAt = new Date().toISOString();
  // 原子 upsert：第一次插 row；冲突时在 count 还没到上限的前提下自增 1。
  // WHERE 子句排除掉「count 已达上限」的分支——被排除时 D1 仍然返回 success，
  // 但 result.meta.changes === 0，调用方即可判定为超限。
  const result = await env.DB.prepare(
    'INSERT INTO ai_quota (user_id, day, count, tokens, updated_at) VALUES (?, ?, 1, 0, ?) ' +
      'ON CONFLICT(user_id, day) DO UPDATE SET ' +
      'count = ai_quota.count + 1, ' +
      'tokens = ai_quota.tokens + 0, ' +
      'updated_at = excluded.updated_at ' +
      'WHERE ai_quota.count < ?',
  )
    .bind(userId, day, updatedAt, LIMIT)
    .run();

  if (result.meta && (result.meta as { changes?: number }).changes === 0) {
    return { allowed: false, code: 'AI_QUOTA_EXCEEDED', status: 429 };
  }
  return { allowed: true };
}

/**
 * 把请求 + 响应回写的 token 估算写入 ai_quota（只增 tokens 字段）。
 * 失败不抛——配额记账不可阻塞主流程。
 */
async function recordTokens(
  env: Env,
  userId: string,
  tokens: number,
): Promise<void> {
  if (tokens <= 0) return;
  try {
    await env.DB.prepare(
      'UPDATE ai_quota SET tokens = tokens + ?, updated_at = ? WHERE user_id = ? AND day = ?',
    )
      .bind(tokens, new Date().toISOString(), userId, dayKey())
      .run();
  } catch {
    /* quota 写入失败不阻断主流程 */
  }
}

/**
 * 用 TransformStream 包一层上游 SSE 流：一边透传字节给客户端，一边累加字符
 * 数估算 token 消耗。流关闭时（flush）按累计文本量把 token 估算回写到
 * ai_quota 表。失败不抛——token 记账是尽力而为。
 *
 * 注意：TransformStream 是字节级透传，这意味着我们不解析 SSE 协议；
 * 对于 OpenAI/DeepSeek Chat Completions 流，"data: {...}" 行里 JSON 中的
 * `choices[0].delta.content` 文本会被原样按 1 char ≈ 0.25 token 的换算关系
 * 计入估算。"data: [DONE]" 哨兵行也算进去但占比极小，可忽略。
 */
function wrapStreamWithUsage(
  input: ReadableStream<Uint8Array>,
  env: Env,
  ctx: ExecutionContext,
  userId: string,
  day: string,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  let totalChars = 0;
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      try {
        totalChars += decoder.decode(chunk, { stream: true }).length;
      } catch {
        /* decode 失败不阻断 */
      }
      controller.enqueue(chunk);
    },
    flush() {
      // 收尾：把残留的尾部不完整 UTF-8 片段也计入。
      try {
        totalChars += decoder.decode().length;
      } catch {
        /* ignore */
      }
      const approxTokens = Math.ceil(totalChars / 4);
      ctx.waitUntil(
        env.DB.prepare(
          'UPDATE ai_quota SET tokens = tokens + ?, updated_at = ? WHERE user_id = ? AND day = ?',
        )
          .bind(approxTokens, new Date().toISOString(), userId, day)
          .run(),
      );
    },
  });
  return input.pipeThrough(transform);
}

/**
 * 通过 Cloudflare AI Gateway 调用 DeepSeek（OpenAI Chat Completions 兼容接口）。
 * 网关位置在 AI Gateway 控制台创建：https://developer.cloudflare.com/ai-gateway
 * 注意：worker 侧不直连 DeepSeek（用户选择的 AI Gateway 代理），
 *       由 Cloudflare AI Gateway 负责密钥保管、缓存、请求路由、限流。
 */
async function proxyToGateway(
  env: Env,
  body: { prompt?: string; messages?: Array<{ role: string; content: string }>; model?: string; stream?: boolean },
  userId: string,
  ctx: ExecutionContext,
): Promise<Response> {
  const model = resolveModel(body.model, env);

  const base = (env.AI_GATEWAY_BASE || '').trim();
  if (!base) {
    return jsonResponse({ error: 'AI 网关未配置（Cloudflare AI Gateway Base URL 缺失）', code: 'GATEWAY_NOT_CONFIGURED' }, 503);
  }
  const token = (env.AI_GATEWAY_TOKEN || '').trim();
  if (!token) {
    return jsonResponse({ error: 'AI 网关 Token 缺失', code: 'GATEWAY_TOKEN_MISSING' }, 503);
  }

  const url = `${base}/chat/completions`;
  const stream = body.stream !== false;

  // 多-turn chat：如果客户端提供了 messages 则直接使用，否则退化为单 prompt 模式
  const messages = body.messages ?? [
    { role: 'system', content: '你是一个有帮助的 AI 助手，请用中文回答。' },
    { role: 'user', content: body.prompt || '' },
  ];

  const upstreamBody = JSON.stringify({
    model,
    stream,
    messages,
  });

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: stream ? 'text/event-stream' : 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: upstreamBody,
    });
  } catch {
    return errorResponse('AI 网关连接失败', 502);
  }

  // 网关不可用（401/403 鉴权问题、5xx 网关故障）-> 502 + 上游错误信息
  if (!upstream.ok) {
    let detail = `status=${upstream.status}`;
    try {
      const errText = await upstream.text();
      detail += ` body=${errText.slice(0, 300)}`;
    } catch { /* ignore */ }
    return jsonResponse({ error: `AI 网关上游错误，${detail}`, code: 'GATEWAY_UPSTREAM_ERROR' }, 502);
  }

  // 流式：SSE 流直接透传（包一层 TransformStream 累计 token 估算）
  if (stream && upstream.body) {
    return new Response(wrapStreamWithUsage(upstream.body, env, ctx, userId, dayKey()), {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  // 非流式（或上游不支持流）：整体读取 JSON（兼容网关连接异常时的状态码）
  let resultBody: unknown;
  try {
    resultBody = await upstream.json();
  } catch {
    return errorResponse('AI 网关返回非 JSON 数据', 502);
  }
  const text =
    (resultBody as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message?.content ?? '';
  // 记录 token 估算消耗
  const usage = (resultBody as { usage?: { prompt_tokens?: number; completion_tokens?: number } })?.usage;
  const tokens = (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? estimateTokens(text));
  if (tokens > 0) {
    await recordTokens(env, userId, tokens);
  }

  return new Response(JSON.stringify({ text, model }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function handleAI(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // 验证 JWT
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('未登录', 401);
  }

  const payload = await verifyJWT(authHeader.slice(7), env);
  if (!payload) return errorResponse('令牌无效或已过期', 401);

  // 权限：plus 及以上可用
  if (!hasTierAccess(payload.tier, 'plus')) {
    return errorResponse('此功能需要 Plus 会员', 403, 'UPGRADE_REQUIRED');
  }

  // 用户日额度检查（plus 50/天，pro 不限）
  const quota = await checkAndRecordQuota(env, payload.sub, payload.tier);
  if (!quota.allowed) {
    return errorResponse(
      quota.code === 'AI_QUOTA_EXCEEDED'
        ? '今日 AI 调用次数已达上限（Plus 50 次/天），请明日再试或升级 Pro'
        : '无权限',
      quota.status,
      quota.code,
    );
  }

  const body = (await request.json().catch(() => null)) as {
    prompt?: string;
    messages?: Array<{ role: string; content: string }>;
    model?: string;
    stream?: boolean;
  } | null;
  if (!body?.prompt && !body?.messages) return errorResponse('缺少 prompt 或 messages');

  return await proxyToGateway(env, body, payload.sub, ctx);
}
