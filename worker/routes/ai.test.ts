import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { handleAI, estimateTokens } from './ai';
import { signJWT } from '../lib/jwt';
import type { Env, ExecutionContext } from '../types';

/**
 * 内存 FakeD1，只实现 ai.test.ts 实际触达的语句：
 *   - INSERT ... ON CONFLICT(user_id, day) DO UPDATE ... WHERE ai_quota.count < ?
 *     （原子配额累加，自带「count 超限则 changes === 0」语义）
 *   - UPDATE ai_quota SET tokens = tokens + ? WHERE user_id = ? AND day = ?
 *     （流式 / 非流式响应后回写 token 估算）
 *
 * 不求通用 SQL 解析——按 `execute` 里 if/else 形状路由每个 SQL。
 */
interface Row { [column: string]: unknown; }

class FakeD1 {
  tables: Record<string, Row[]> = {
    ai_quota: [],
  };
  /** 下次 .run() 应该报告的 meta.changes；execute() 后清空。*/
  nextChanges: number | undefined = undefined;
  prepare(sql: string) { return makePreparedStatement(this, sql); }
}

function makePreparedStatement(db: FakeD1, sql: string) {
  const params: unknown[] = [];
  const stmt = {
    sql,
    params,
    bind(...bindParams: unknown[]) {
      params.length = 0;
      for (let i = 0; i < bindParams.length; i++) params.push(bindParams[i]);
      return stmt;
    },
    run: async () => {
      execute(db, sql, params);
      // 真 D1 的 .run() 返回 success + meta.changes（变更行数）。
      // execute() 通过 nextChanges 把"WHERE 排除"分支报告为 changes=0；
      // 否则我们回退到 "所有 SQL 都算 1"（与 INSERT/UPDATE 写入 1 行的常见路径一致）。
      const meta = { changes: db.nextChanges ?? 1 };
      db.nextChanges = undefined;
      return { success: true, meta };
    },
    first: async <T>() => {
      const rows = execute(db, sql, params);
      return (rows[0] as T) ?? null;
    },
    all: async <T>() => execute(db, sql, params) as T[],
  };
  return stmt;
}

function execute(db: FakeD1, sql: string, params: unknown[]): Row[] {
  const trimmed = sql.replace(/\s+/g, ' ').trim();

  // 原子配额 upsert：INSERT ... ON CONFLICT(user_id, day) DO UPDATE ...
  // WHERE ai_quota.count < ?
  // 参数顺序：userId, day, updatedAt, limit
  if (
    /^INSERT INTO ai_quota/i.test(trimmed) &&
    /ON CONFLICT\(user_id, day\)/i.test(trimmed) &&
    /WHERE ai_quota\.count < /i.test(trimmed)
  ) {
    const [userId, day, updatedAt, limit] = params as [string, string, string, number];
    const existing = db.tables.ai_quota.find(
      (r) => r.user_id === userId && r.day === day,
    );
    if (!existing) {
      // 首次写入：插入一条 count=1 的新行
      db.tables.ai_quota.push({
        user_id: userId,
        day,
        count: 1,
        tokens: 0,
        updated_at: updatedAt,
      });
      db.nextChanges = 1;
    } else {
      // 真 D1 的语义："INSERT ... ON CONFLICT DO UPDATE WHERE <cond>"
      // 当 WHERE 排除掉时，依然 success 但 changes=0。
      if ((existing.count as number) < limit) {
        existing.count = (existing.count as number) + 1;
        existing.tokens = (existing.tokens as number) + 0;
        existing.updated_at = updatedAt;
        db.nextChanges = 1;
      } else {
        db.nextChanges = 0;
      }
    }
    return [];
  }

  // 流式 / 非流式响应后回写 token 估算
  if (
    /^UPDATE ai_quota SET tokens = tokens \+ \?/i.test(trimmed) &&
    /WHERE user_id = \? AND day = \?/i.test(trimmed)
  ) {
    const [tokens, updatedAt, userId, day] = params as [number, string, string, string];
    const row = db.tables.ai_quota.find(
      (r) => r.user_id === userId && r.day === day,
    );
    if (row) {
      row.tokens = (row.tokens as number) + tokens;
      row.updated_at = updatedAt;
    }
    return [];
  }

  throw new Error(`FakeD1: unsupported SQL pattern: ${trimmed}`);
}

function makeEnv(db: FakeD1, overrides: Partial<Env> = {}): Env {
  return {
    DB: db as unknown as D1Database,
    SESSIONS: {} as KVNamespace,
    JWT_SECRET: 'test-secret-please-rotate',
    FROM_EMAIL: '',
    FRONTEND_URL: 'http://localhost',
    ALLOWED_ORIGINS: '',
    AI_GATEWAY_BASE: 'https://gateway.example.test',
    AI_GATEWAY_TOKEN: 'test-token',
    AI_GATEWAY_MODEL: 'deepseek-chat',
    ASSETS: {} as Fetcher,
    ENVIRONMENT: 'test',
    ...overrides,
  };
}

async function signToken(env: Env, sub: string, tier: string): Promise<string> {
  return signJWT(sub, tier, env);
}

function buildCtx(): ExecutionContext & { waitUntilCalls: Promise<unknown>[] } {
  const waitUntilCalls: Promise<unknown>[] = [];
  return {
    waitUntil(promise: Promise<unknown>) {
      waitUntilCalls.push(promise);
    },
    passThroughOnException() {},
    waitUntilCalls,
  };
}

function postRequest(path: string, body: object, auth: string): Request {
  return new Request(`https://example.com${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    body: JSON.stringify(body),
  });
}

interface FetchCall {
  url: string;
  body: { model?: string; stream?: boolean; messages?: unknown };
}

/**
 * 构造一条 SSE 字节流响应（4 chunks × 16 chars ≈ ceil(64/4)=16 tokens）。
 * 每次调用都产生一个新的 Response 实例——上游流一旦被消费就不可重用。
 */
function makeStreamingResponse(): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"abcd"}}]}\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"efgh"}}]}\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"ijkl"}}]}\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"mnop"}}]}\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n'));
        controller.close();
      },
    }),
    { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
  );
}

/**
 * 把 fetch 替换成一个捕获调用参数的 stub。
 *
 * `replyFactory` 每次被调用时都返回一个新的 Response，避免前一次消费
 * 流之后第二次拿到空体（这会让 `upstream.json()` 抛错，最终把测试拖到 502）。
 */
function stubFetchOk(replyFactory: () => Response): { calls: FetchCall[]; restore: () => void } {
  const calls: FetchCall[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : (input as Request).url;
    const rawBody = init?.body;
    const parsed = rawBody && typeof rawBody === 'string' ? JSON.parse(rawBody) : {};
    calls.push({ url, body: parsed });
    return replyFactory();
  }) as typeof fetch;
  return {
    calls,
    restore: () => { globalThis.fetch = originalFetch; },
  };
}

// ============================================================================
// Pure helper tests (estimateTokens)
// ============================================================================

describe('estimateTokens helper', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('rounds up to ceil(length / 4) for short strings', () => {
    // "abcd" = 4 chars → ceil(4/4) = 1
    expect(estimateTokens('abcd')).toBe(1);
    // "abc" = 3 chars → ceil(3/4) = 1
    expect(estimateTokens('abc')).toBe(1);
    // "abcde" = 5 chars → ceil(5/4) = 2
    expect(estimateTokens('abcde')).toBe(2);
  });

  it('rounds up to exactly length / 4 for long strings', () => {
    // "x" * 100 = 100 chars → ceil(100/4) = 25
    expect(estimateTokens('x'.repeat(100))).toBe(25);
    // "学" * 16 = 16 chars → ceil(16/4) = 4
    expect(estimateTokens('学'.repeat(16))).toBe(4);
    // 1000 chars → 250
    expect(estimateTokens('y'.repeat(1000))).toBe(250);
  });
});

// ============================================================================
// handleAI(model allowlist)
// ============================================================================

describe('handleAI model allowlist', () => {
  let db: FakeD1;
  let env: Env;
  let restoreFetch: (() => void) | null = null;

  beforeEach(() => {
    db = new FakeD1();
    env = makeEnv(db);
  });

  afterEach(() => {
    if (restoreFetch) restoreFetch();
    restoreFetch = null;
  });

  function jsonReply(body: object): Response {
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('rewrites a non-allowlisted model name to env.AI_GATEWAY_MODEL', async () => {
    const token = await signToken(env, 'user-1', 'plus');
    const stub = stubFetchOk(() =>
      jsonReply({ choices: [{ message: { content: 'ok' } }], usage: { completion_tokens: 1 } }),
    );
    restoreFetch = stub.restore;
    const res = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'hello', model: 'gpt-5', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(res.status).toBe(200);
    expect(stub.calls.length).toBe(1);
    // 白名单只放 deepseek-chat / deepseek-reasoner；gpt-5 应被回退到默认
    expect(stub.calls[0].body.model).toBe('deepseek-chat');
  });

  it('passes through allowlisted model names unchanged', async () => {
    const token = await signToken(env, 'user-2', 'plus');
    const stub = stubFetchOk(() =>
      jsonReply({ choices: [{ message: { content: 'ok' } }], usage: { completion_tokens: 1 } }),
    );
    restoreFetch = stub.restore;
    await handleAI(
      postRequest('/api/ai/chat', { prompt: 'hi', model: 'deepseek-reasoner', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(stub.calls[0].body.model).toBe('deepseek-reasoner');
  });

  it('falls back to env.AI_GATEWAY_MODEL when model is omitted', async () => {
    const token = await signToken(env, 'user-2b', 'plus');
    const stub = stubFetchOk(() =>
      jsonReply({ choices: [{ message: { content: 'ok' } }] }),
    );
    restoreFetch = stub.restore;
    await handleAI(
      postRequest('/api/ai/chat', { prompt: 'hi', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(stub.calls[0].body.model).toBe('deepseek-chat');
  });
});

// ============================================================================
// handleAI(atomic quota)
// ============================================================================

describe('handleAI atomic quota', () => {
  let db: FakeD1;
  let env: Env;
  let restoreFetch: (() => void) | null = null;

  beforeEach(() => {
    db = new FakeD1();
    env = makeEnv(db);
  });

  afterEach(() => {
    if (restoreFetch) restoreFetch();
    restoreFetch = null;
  });

  function stubEmptyContent(): { calls: FetchCall[]; restore: () => void } {
    return stubFetchOk(
      () => new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  it('increments count on each successful plus-tier call', async () => {
    const token = await signToken(env, 'user-3', 'plus');
    const stub = stubEmptyContent();
    restoreFetch = stub.restore;
    const res1 = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'a', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(res1.status).toBe(200);
    const res2 = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'b', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(res2.status).toBe(200);
    expect(stub.calls.length).toBe(2);
    const row = db.tables.ai_quota.find((r) => r.user_id === 'user-3')!;
    expect(row).toBeDefined();
    expect(row.count).toBe(2);
    expect(row.tokens).toBe(0);
  });

  it('returns 429 AI_QUOTA_EXCEEDED once count reaches the plus limit', async () => {
    const token = await signToken(env, 'user-4', 'plus');
    const stub = stubEmptyContent();
    restoreFetch = stub.restore;
    // 在 FakeD1 里直接置 count=50（与限额相等）。
    // 下一次 ON CONFLICT ... WHERE ai_quota.count < 50 不成立 →
    // FakeD1 把 nextChanges 置 0 → run() 报 changes=0 →
    // handleAI 判定为超限并返回 429 AI_QUOTA_EXCEEDED。
    const day = new Date().toISOString().slice(0, 10);
    db.tables.ai_quota.push({
      user_id: 'user-4',
      day,
      count: 50,
      tokens: 0,
      updated_at: new Date().toISOString(),
    });
    const res = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'c', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(res.status).toBe(429);
    const body = await res.json() as { error: string; code?: string };
    expect(body.code).toBe('AI_QUOTA_EXCEEDED');
    expect(body.error).toMatch(/上限/);
    // 守门：超限路径下不应再调用 fetch
    expect(stub.calls.length).toBe(0);
  });

  it('pro tier bypasses quota entirely and never writes ai_quota', async () => {
    const token = await signToken(env, 'user-5', 'pro');
    const stub = stubEmptyContent();
    restoreFetch = stub.restore;
    const res = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'd', stream: false }, `Bearer ${token}`),
      env,
      buildCtx(),
    );
    expect(res.status).toBe(200);
    expect(stub.calls.length).toBe(1);
    expect(db.tables.ai_quota.find((r) => r.user_id === 'user-5')).toBeUndefined();
  });
});

// ============================================================================
// handleAI(streaming usage accounting)
// ============================================================================

describe('handleAI streaming usage accounting', () => {
  let db: FakeD1;
  let env: Env;
  let restoreFetch: (() => void) | null = null;

  beforeEach(() => {
    db = new FakeD1();
    env = makeEnv(db);
  });
  afterEach(() => {
    if (restoreFetch) restoreFetch();
    restoreFetch = null;
  });

  it('writes back cumulative token estimate after a streaming response closes', async () => {
    const token = await signToken(env, 'user-6', 'plus');
    // 喂一条 SSE 字节流作为上游响应（content-type = text/event-stream）。
    // 我们关心的是 flush 在最终消费完流时是否被触发：因此用真实的 ReadableStream。
    const stub = stubFetchOk(() => makeStreamingResponse());
    restoreFetch = stub.restore;
    const ctx = buildCtx();
    const res = await handleAI(
      postRequest('/api/ai/chat', { prompt: 'stream', stream: true }, `Bearer ${token}`),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    // 客户端消费 response body —— TransformStream 的 flush 在流被读完时触发。
    const body = await res.text();
    expect(body).toContain('data: [DONE]');
    // 等所有 waitUntil 上的 promise 完成。
    await Promise.all(ctx.waitUntilCalls);
    const row = db.tables.ai_quota.find((r) => r.user_id === 'user-6')!;
    expect(row).toBeDefined();
    expect((row.tokens as number)).toBeGreaterThan(0);
    // count 已经被原子配额累加到 1
    expect((row.count as number)).toBe(1);
  });
});
