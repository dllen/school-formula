import type { Env } from '../types';
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

/** 当日 UTC 日期键（YYYY-MM-DD），用于用户级每日额度统计 */
function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * AI 请求配额检查与累加（写入 ai_quota 表）。
 * - 用户 tier：plus 50 次/天，pro 无限
 * - 返回 { allowed } 或 { allowed: false, code: 'QUOTA_EXCEEDED' }
 */
async function checkAndRecordQuota(env: Env, userId: string, tier: string): Promise<{ allowed: boolean } | { allowed: false; code: string; status: number }> {
  // pro 不限
  if (tier === 'pro') return { allowed: true };
  const LIMIT = tier === 'plus' ? 50 : 0;
  if (LIMIT === 0) return { allowed: false, code: 'FORBIDDEN', status: 403 };

  const day = dayKey();
  const row = await env.DB.prepare('SELECT count FROM ai_quota WHERE user_id = ? AND day = ?')
    .bind(userId, day)
    .first<{ count: number }>();
  if (row && row.count >= LIMIT) {
    return { allowed: false, code: 'QUOTA_EXCEEDED', status: 429 };
  }

  // 计数 +1（首次写入 ON CONFLICT DO UPDATE）
  await env.DB.prepare(
    'INSERT INTO ai_quota (user_id, day, count, tokens, updated_at) VALUES (?, ?, 1, 0, ?) ' +
    'ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at'
  )
    .bind(userId, day, new Date().toISOString())
    .run();

  return { allowed: true };
}

/** 估算 token 数：UTF-8 中文约 1.5 char/token，保守取 1 char ≈ 0.75 tokens 再乘安全系数 */
function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length * 0.75));
}

/**
 * 通过 Cloudflare AI Gateway 调用 DeepSeek（OpenAI Chat Completions 兼容接口）。
 * 网关位置在 AI Gateway 控制台创建：https://developer.cloudflare.com/ai-gateway
 * 注意：worker 侧不直连 DeepSeek（用户选择的 AI Gateway 代理），
 *       由 Cloudflare AI Gateway 负责密钥保管、缓存、请求路由、限流。
 */
async function proxyToGateway(
  env: Env,
  body: { prompt?: string; model?: string; stream?: boolean },
  userId: string,
): Promise<Response> {
  const model = body.model?.trim() || env.AI_GATEWAY_MODEL || 'deepseek-chat';

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

  const upstreamBody = JSON.stringify({
    model,
    stream,
    messages: [
      { role: 'system', content: '你是一个有帮助的 AI 助手，请用中文回答。' },
      { role: 'user', content: body.prompt || '' },
    ],
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

  // 流式：SSE 流直接透传（逐 chunk 网关 -> 客户端）
  if (stream && upstream.body) {
    const reader = upstream.body.getReader();
    return new Response(
      new ReadableStream<Uint8Array>({
        async pull(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
            }
          } catch {
            controller.close();
          }
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      },
    );
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
  try {
    const usage = (resultBody as { usage?: { prompt_tokens?: number; completion_tokens?: number } })?.usage;
    const tokens = (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? estimateTokens(text));
    if (tokens > 0) {
      await env.DB.prepare(
        'INSERT INTO ai_quota (user_id, day, count, tokens, updated_at) VALUES (?, ?, 0, ?, ?) ' +
        'ON CONFLICT(user_id, day) DO UPDATE SET tokens = tokens + excluded.tokens, updated_at = excluded.updated_at'
      )
        .bind(userId, dayKey(), tokens, new Date().toISOString())
        .run();
    }
  } catch { /* quota 写入失败不阻断主流程 */ }

  return new Response(JSON.stringify({ text, model }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function handleAI(
  request: Request,
  env: Env,
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
      quota.code === 'QUOTA_EXCEEDED' ? '今日 AI 调用次数已达上限（Plus 50 次/天），请明日再试或升级 Pro' : '无权限',
      quota.status || 429,
      quota.code,
    );
  }

  const body = await request.json().catch(() => null) as { prompt?: string; model?: string; stream?: boolean } | null;
  if (!body?.prompt) return errorResponse('缺少 prompt');

  const text = await proxyToGateway(env, body, payload.sub);
  return text;
}
