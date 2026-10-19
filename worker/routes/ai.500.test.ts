// worker/routes/ai.500.test.ts
//
// 独立测试 worker/index.ts 的 500 分支：当路由处理器抛错时，应当回传
// 固定的 `{"error":"Internal server error"}` 而不是 `err.message`，
// 以避免把上游 / DB 内部细节泄漏给客户端。

import { describe, expect, it, vi } from 'vitest';
import type { Env, ExecutionContext } from '../types';

// 在 import worker 之前先 mock 它依赖的 ./ai 路由——
// 这样 worker/index.ts 拿到的 handleAI 是一个抛异常的桩，能触发 catch-all。
const leakingMessage = 'upstream-secret-detail: db path /secret/path with token=abc';

vi.mock('./ai', () => ({
  handleAI: async () => {
    throw new Error(leakingMessage);
  },
  estimateTokens: () => 0,
}));

// 动态导入 worker —— 必须在 vi.mock 之后。
const workerPromise = import('../index');

function makeEnv(): Env {
  return {
    DB: {} as D1Database,
    SESSIONS: {} as KVNamespace,
    JWT_SECRET: 'test-secret-please-rotate',
    FROM_EMAIL: '',
    FRONTEND_URL: 'http://localhost',
    ALLOWED_ORIGINS: '',
    AI_GATEWAY_BASE: '',
    AI_GATEWAY_TOKEN: '',
    AI_GATEWAY_MODEL: '',
    ASSETS: {} as Fetcher,
    ENVIRONMENT: 'test',
  };
}

function buildCtx(): ExecutionContext {
  return {
    waitUntil() {},
    passThroughOnException() {},
  };
}

describe('worker.fetch catch-all', () => {
  it('returns the fixed message and never leaks err.message to the client', async () => {
    const workerMod = await workerPromise;
    const req = new Request('https://syy.global/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'hi', stream: false }),
    });
    const res = await workerMod.default.fetch(req, makeEnv(), buildCtx());
    expect(res.status).toBe(500);
    const body = await res.json() as { error?: string };
    expect(body.error).toBe('Internal server error');
    expect(body.error).not.toContain('upstream-secret-detail');
    expect(body.error).not.toContain('token');
  });
});
