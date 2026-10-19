import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { handleAuth } from './auth';
import { hashPassword } from '../lib/password';
import { generateVerificationCode } from '../lib/email';
import type { Env } from '../types';

/**
 * 内存 FakeD1，只实现 auth.test.ts 实际触达的语句：
 *   - SELECT/INSERT/UPDATE/DELETE（带 WHERE / ORDER BY DESC LIMIT 1）
 *   - INSERT ... ON CONFLICT(key) DO UPDATE（auth_rate_limits upsert）
 *   - COUNT 聚合与 julianday() 差值（限流窗口判定）
 *   - 子查询 `WHERE user_id = (SELECT id FROM users WHERE email = ?)`
 *
 * 设计目标：让 handleAuth 走完 register/login/forgot/reset 全流程而不动真 D1。
 * 不求通用 SQL 解析——只覆盖上面这些模式，靠 if/else 路由每个 SQL 形态。
 */

interface Row { [column: string]: unknown; }

interface FakeD1Options {
  nowIso?: string;
}

class FakeD1 {
  tables: Record<string, Row[]> = {
    users: [],
    email_verifications: [],
    sessions: [],
    subscriptions: [],
    login_logs: [],
    auth_rate_limits: [],
  };
  /** Override Date.now / new Date().toISOString() for deterministic windows. */
  nowMs: number;

  constructor(opts: FakeD1Options = {}) {
    this.nowMs = opts.nowIso ? Date.parse(opts.nowIso) : Date.now();
  }

  nowIso(): string { return new Date(this.nowMs).toISOString(); }

  prepare(sql: string) {
    return makePreparedStatement(this, sql);
  }
}

/** Standalone factory so we do not need to alias `this` inside `prepare`. */
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
      return { success: true, meta: {} };
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

  // --- auth_rate_limits upsert: rate-limit.ts 主路径 ---
  if (/^INSERT INTO auth_rate_limits/i.test(trimmed) && /ON CONFLICT\(key\) DO UPDATE/i.test(trimmed)) {
    // 参数顺序：key, now, now, windowSeconds, now, windowSeconds
    const [key, nowIso, , windowSeconds] = params as [string, string, string, number];
    const table = db.tables.auth_rate_limits;
    const existing = table.find((r) => r.key === key);
    if (!existing) {
      table.push({ key, count: 1, window_start: nowIso });
    } else {
      const elapsed = (Date.parse(nowIso) - Date.parse(existing.window_start as string)) / 1000;
      if (elapsed > windowSeconds) {
        existing.count = 1;
        existing.window_start = nowIso;
      } else {
        existing.count = (existing.count as number) + 1;
      }
    }
    return [];
  }
  if (/^SELECT count FROM auth_rate_limits WHERE key = \?/i.test(trimmed)) {
    const [key] = params as [string];
    const row = db.tables.auth_rate_limits.find((r) => r.key === key);
    return row ? [{ count: row.count }] : [];
  }

  // --- users 表 ---
  if (/^INSERT INTO users \(id, email, password_hash, email_verified\) VALUES/i.test(trimmed)) {
    const [id, email, password_hash] = params as [string, string, string, number];
    db.tables.users.push({
      id,
      email,
      password_hash,
      email_verified: 1,
      tier: 'free',
      created_at: db.nowIso(),
      updated_at: db.nowIso(),
    });
    return [];
  }
  if (/^SELECT id FROM users WHERE email = \?/i.test(trimmed)) {
    const [email] = params as [string];
    return db.tables.users.filter((u) => u.email === email).map((u) => ({ id: u.id }));
  }
  if (/^SELECT \* FROM users WHERE email = \?/i.test(trimmed)) {
    const [email] = params as [string];
    return db.tables.users.filter((u) => u.email === email);
  }
  if (/^UPDATE users SET password_hash = \?, updated_at = \? WHERE email = \?/i.test(trimmed)) {
    const [password_hash, updated_at, email] = params as [string, string, string];
    for (const u of db.tables.users) {
      if (u.email === email) {
        u.password_hash = password_hash;
        u.updated_at = updated_at;
      }
    }
    return [];
  }

  // --- email_verifications 表 ---
  if (/^INSERT INTO email_verifications \(email, code, purpose, expires_at\) VALUES/i.test(trimmed)) {
    const [email, code, purpose, expires_at] = params as [string, string, string, string];
    const id = `ev-${db.tables.email_verifications.length + 1}`;
    db.tables.email_verifications.push({
      id,
      email,
      code,
      purpose,
      expires_at,
      attempts: 0,
      created_at: db.nowIso(),
    });
    return [];
  }
  if (/^SELECT id, code, expires_at FROM email_verifications WHERE email = \? AND purpose = \? ORDER BY created_at DESC LIMIT 1/i.test(trimmed)) {
    const [email, purpose] = params as [string, string];
    const matches = db.tables.email_verifications
      .filter((r) => r.email === email && r.purpose === purpose)
      .sort((a, b) => (b.created_at as string).localeCompare(a.created_at as string))
      .slice(0, 1);
    return matches.map((m) => ({ id: m.id, code: m.code, expires_at: m.expires_at }));
  }
  if (/^UPDATE email_verifications SET attempts = attempts \+ 1 WHERE id = \?/i.test(trimmed)) {
    const [id] = params as [string];
    const row = db.tables.email_verifications.find((r) => r.id === id);
    if (row) row.attempts = (row.attempts as number) + 1;
    return [];
  }
  if (/^SELECT attempts FROM email_verifications WHERE id = \?/i.test(trimmed)) {
    const [id] = params as [string];
    const row = db.tables.email_verifications.find((r) => r.id === id);
    return row ? [{ attempts: row.attempts }] : [];
  }
  if (/^DELETE FROM email_verifications WHERE id = \?/i.test(trimmed)) {
    const [id] = params as [string];
    db.tables.email_verifications = db.tables.email_verifications.filter((r) => r.id !== id);
    return [];
  }
  if (/^DELETE FROM email_verifications WHERE email = \?/i.test(trimmed)) {
    const [email] = params as [string];
    db.tables.email_verifications = db.tables.email_verifications.filter((r) => r.email !== email);
    return [];
  }

  // --- sessions 表 ---
  if (/^INSERT INTO sessions \(user_id, refresh_token_hash, expires_at\) VALUES/i.test(trimmed)) {
    const [user_id, refresh_token_hash, expires_at] = params as [string, string, string];
    db.tables.sessions.push({
      id: `s-${db.tables.sessions.length + 1}`,
      user_id,
      refresh_token_hash,
      expires_at,
      created_at: db.nowIso(),
    });
    return [];
  }
  if (/^DELETE FROM sessions WHERE refresh_token_hash = \?/i.test(trimmed)) {
    const [hash] = params as [string];
    db.tables.sessions = db.tables.sessions.filter((s) => s.refresh_token_hash !== hash);
    return [];
  }
  if (/^DELETE FROM sessions WHERE user_id = \?/i.test(trimmed)) {
    const [uid] = params as [string];
    db.tables.sessions = db.tables.sessions.filter((s) => s.user_id !== uid);
    return [];
  }
  if (/^DELETE FROM sessions WHERE user_id = \(SELECT id FROM users WHERE email = \?\)/i.test(trimmed)) {
    const [email] = params as [string];
    const user = db.tables.users.find((u) => u.email === email);
    if (user) {
      db.tables.sessions = db.tables.sessions.filter((s) => s.user_id !== user.id);
    }
    return [];
  }

  // --- login_logs 表 ---
  if (/^INSERT INTO login_logs \(user_id, email, success, ip, user_agent\) VALUES/i.test(trimmed)) {
    const [user_id, email, success, ip, user_agent] = params as [string, string, number, string, string];
    db.tables.login_logs.push({
      id: `ll-${db.tables.login_logs.length + 1}`,
      user_id,
      email,
      success,
      ip,
      user_agent,
      created_at: db.nowIso(),
    });
    return [];
  }

  throw new Error(`FakeD1: unsupported SQL pattern: ${trimmed}`);
}

/** 构造带 JWT_SECRET / FROM_EMAIL 的最小 Env，env.DB 指向 FakeD1。 */
function makeEnv(db: FakeD1): Env {
  return {
    DB: db as unknown as D1Database,
    SESSIONS: {} as KVNamespace,
    JWT_SECRET: 'test-secret-please-rotate',
    FROM_EMAIL: '', // 阻止真发邮件：触发 dev 兜底打印
    FRONTEND_URL: 'http://localhost',
    ALLOWED_ORIGINS: '',
    AI_GATEWAY_BASE: '',
    AI_GATEWAY_TOKEN: '',
    AI_GATEWAY_MODEL: '',
    ASSETS: {} as Fetcher,
    ENVIRONMENT: 'test',
  };
}

function post(path: string, body: object, ip = '203.0.113.1'): Request {
  return new Request(`https://example.com${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'cf-connecting-ip': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('handleAuth rate limiting', () => {
  let db: FakeD1;
  let env: Env;

  beforeEach(() => {
    db = new FakeD1({ nowIso: '2025-01-01T00:00:00.000Z' });
    env = makeEnv(db);
  });
  afterEach(() => {});

  it('returns 429 after the register limit is exceeded (5/小时)', async () => {
    // 前 5 次应当被放行（每次都返回 EMAIL_TAKEN，因为没插用户）
    for (let i = 0; i < 5; i++) {
      const res = await handleAuth(
        post('/api/auth/register', { email: 'a@example.com', password: 'password123' }),
        env,
        '/api/auth/register',
      );
      expect(res.status).not.toBe(429);
    }
    // 第 6 次直接被限流命中
    const sixth = await handleAuth(
      post('/api/auth/register', { email: 'a@example.com', password: 'password123' }),
      env,
      '/api/auth/register',
    );
    expect(sixth.status).toBe(429);
    const body = await sixth.json() as { error: string; code?: string };
    expect(body.code).toBe('RATE_LIMITED');
    expect(body.error).toMatch(/频繁/);
  });

  it('returns 429 after the login limit is exceeded (10/15 分钟)', async () => {
    // 前 10 次：email 不存在 → 401 INVALID_CREDENTIALS（不算限流）
    for (let i = 0; i < 10; i++) {
      const res = await handleAuth(
        post('/api/auth/login', { email: 'noone@example.com', password: 'password123' }),
        env,
        '/api/auth/login',
      );
      expect(res.status).toBe(401);
    }
    // 第 11 次：限流命中
    const blocked = await handleAuth(
      post('/api/auth/login', { email: 'noone@example.com', password: 'password123' }),
      env,
      '/api/auth/login',
    );
    expect(blocked.status).toBe(429);
    const body = await blocked.json() as { error: string; code?: string };
    expect(body.code).toBe('RATE_LIMITED');
  });

  it('rate limit buckets differ by IP for the same email', async () => {
    // 第 6 次从同一 IP 发，被限流
    for (let i = 0; i < 5; i++) {
      await handleAuth(post('/api/auth/register', { email: 'b@example.com', password: 'password123' }, '198.51.100.7'), env, '/api/auth/register');
    }
    const blocked = await handleAuth(post('/api/auth/register', { email: 'b@example.com', password: 'password123' }, '198.51.100.7'), env, '/api/auth/register');
    expect(blocked.status).toBe(429);

    // 同一邮箱，但换 IP → 不计入上一个桶，应当被放行（返回 EMAIL_TAKEN 等）
    const otherIp = await handleAuth(post('/api/auth/register', { email: 'b@example.com', password: 'password123' }, '198.51.100.8'), env, '/api/auth/register');
    expect(otherIp.status).not.toBe(429);
  });
});

describe('handleAuth reset code attempt lock', () => {
  let db: FakeD1;
  let env: Env;

  beforeEach(() => {
    db = new FakeD1({ nowIso: '2025-01-01T00:00:00.000Z' });
    env = makeEnv(db);
  });

  /** 直接种一个用户与一条邮箱验证记录，绕过注册/申请码流程。 */
  async function seedUserAndVerification(): Promise<{ email: string; code: string }> {
    const email = 'victim@example.com';
    const passwordHash = await hashPassword('old-password123');
    db.tables.users.push({
      id: 'user-victim',
      email,
      password_hash: passwordHash,
      email_verified: 1,
      tier: 'free',
      created_at: db.nowIso(),
      updated_at: db.nowIso(),
    });
    const code = generateVerificationCode();
    // expires_at 必须基于真实 Date.now()：auth.ts 的过期判断用 `new Date()`，
    // 不能用 FakeD1.nowIso()（否则在过期检查上失真）。
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    db.tables.email_verifications.push({
      id: 'ev-victim-1',
      email,
      code,
      purpose: 'reset_password',
      expires_at: expiresAt,
      attempts: 0,
      created_at: new Date().toISOString(),
    });
    return { email, code };
  }

  it('returns INVALID_CODE on wrong attempts 1..4 and increments attempts each time', async () => {
    const { email } = await seedUserAndVerification();
    for (let i = 1; i <= 4; i++) {
      const res = await handleAuth(
        post('/api/auth/reset', { email, code: 'wrong', password: 'new-password123' }),
        env,
        '/api/auth/reset',
      );
      expect(res.status, `attempt #${i}`).toBe(400);
      const body = await res.json() as { code?: string };
      expect(body.code).toBe('INVALID_CODE');
      const row = db.tables.email_verifications.find((r) => r.email === email)!;
      expect(row.attempts).toBe(i);
    }
  });

  it('locks the verification record on the 5th wrong attempt (deletes row + CODE_LOCKED)', async () => {
    const { email } = await seedUserAndVerification();
    // 错 5 次
    for (let i = 0; i < 4; i++) {
      const res = await handleAuth(
        post('/api/auth/reset', { email, code: 'wrong', password: 'new-password123' }),
        env,
        '/api/auth/reset',
      );
      expect(res.status).toBe(400);
      const body = await res.json() as { code?: string };
      expect(body.code).toBe('INVALID_CODE');
    }
    // 第 5 次：触发锁定
    const fifth = await handleAuth(
      post('/api/auth/reset', { email, code: 'wrong', password: 'new-password123' }),
      env,
      '/api/auth/reset',
    );
    expect(fifth.status).toBe(400);
    const body = await fifth.json() as { code?: string; error?: string };
    expect(body.code).toBe('CODE_LOCKED');
    expect(body.error).toMatch(/失效/);
    // 记录已被删
    expect(db.tables.email_verifications.find((r) => r.email === email)).toBeUndefined();

    // 即便之后用真码尝试，也拿不到记录（应回到 INVALID_CODE 但不再累加 attempts，因为已删）
    const stillMissing = await handleAuth(
      post('/api/auth/reset', { email, code: '000000', password: 'new-password123' }),
      env,
      '/api/auth/reset',
    );
    expect(stillMissing.status).toBe(400);
    const body2 = await stillMissing.json() as { code?: string };
    expect(body2.code).toBe('INVALID_CODE');
  });
});

describe('handleAuth password reset revokes all sessions', () => {
  let db: FakeD1;
  let env: Env;

  beforeEach(() => {
    db = new FakeD1({ nowIso: '2025-01-01T00:00:00.000Z' });
    env = makeEnv(db);
  });

  it('deletes every session for the user after a successful reset', async () => {
    // 直接走 register 流程，让用户与一条会话落到 DB
    const email = 'happy@example.com';
    const password = 'password1234';
    const reg = await handleAuth(
      post('/api/auth/register', { email, password }),
      env,
      '/api/auth/register',
    );
    expect(reg.status).toBe(200);
    expect(db.tables.sessions.length).toBe(1);
    expect(db.tables.sessions[0].user_id).toBe(db.tables.users[0].id);

    // 准备一条邮箱验证记录（expires_at 必须基于真实 Date.now()，
    // 因为 auth.ts 的过期判断用的是 `new Date()`，而不是 FakeD1.nowIso()）
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    db.tables.email_verifications.push({
      id: 'ev-happy-1',
      email,
      code,
      purpose: 'reset_password',
      expires_at: expiresAt,
      attempts: 0,
      created_at: new Date().toISOString(),
    });

    // 走 reset 成功路径
    const reset = await handleAuth(
      post('/api/auth/reset', { email, code, password: 'new-password1234' }),
      env,
      '/api/auth/reset',
    );
    expect(reset.status).toBe(200);
    const body = await reset.json() as { message?: string };
    expect(body.message).toMatch(/成功/);

    // 验证：所有 session 都被删
    expect(db.tables.sessions).toEqual([]);
    // 验证：邮箱验证记录也被删
    expect(db.tables.email_verifications.find((r) => r.email === email)).toBeUndefined();
    // 验证：用户密码已更新
    const originalHash = await hashPassword(password);
    expect(db.tables.users[0].password_hash).not.toBe(originalHash);
  });
});
