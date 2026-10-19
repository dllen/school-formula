/**
 * 认证端点限流
 *
 * 数据持久化在 D1 `auth_rate_limits` 表（PRIMARY KEY `key`，TEXT）。
 * 每条 `key` 是 `endpoint:ip:email` 的组合，按 IP+邮箱 共同配额，
 * 单一维度（如邮箱）可被另一维度绕开，因此两段都进 key。
 *
 * 落库 SQL 与 SQLite/D1 `ON CONFLICT(key) DO UPDATE` 的写法完全一致；
 * 这里把它抽成纯函数 `checkRateLimit`，让 Node 下的 Vitest 不依赖 D1 也能
 * 测三条路径：放行 / 累加超限 / 窗口过期重置。生产路径用真 D1 跑同一份 SQL。
 */

export interface RateLimitState {
  count: number;
  windowStart: number; // epoch 毫秒
}

export interface RateLimitEnv {
  DB: D1Database;
}

/**
 * 纯函数：根据当前时间与窗口，判断此次调用应放行还是拒绝。
 * 同时把状态原地推进：窗口未过则 count+1，窗口已过则重置为 1。
 * 返回布尔（true = 放行）。`limit` 是允许的累计命中上限。
 */
export function checkRateLimit(
  state: RateLimitState | undefined,
  nowMs: number,
  windowSeconds: number,
  limit: number,
): { allowed: boolean; next: RateLimitState } {
  if (!state) {
    return { allowed: 1 <= limit, next: { count: 1, windowStart: nowMs } };
  }
  const elapsedSeconds = (nowMs - state.windowStart) / 1000;
  if (elapsedSeconds > windowSeconds) {
    return { allowed: 1 <= limit, next: { count: 1, windowStart: nowMs } };
  }
  const nextCount = state.count + 1;
  return { allowed: nextCount <= limit, next: { count: nextCount, windowStart: state.windowStart } };
}

/**
 * D1 包装：用 upsert + select 模拟 `checkRateLimit` 语义。
 * - INSERT ... ON CONFLICT(key) DO UPDATE：窗口未过则 count+1，否则重置为 1 并换 window_start。
 * - 然后 SELECT count 决定是否放行。
 *
 * D1 / SQLite 的 ALTER TABLE ADD COLUMN 与 julianday() 都是 D1 支持的标准 SQL。
 */
export async function takeRateLimit(
  env: RateLimitEnv,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO auth_rate_limits (key, count, window_start) VALUES (?, 1, ?) ' +
    'ON CONFLICT(key) DO UPDATE SET ' +
    'count = CASE WHEN (julianday(?) - julianday(window_start)) * 86400 > ? THEN 1 ELSE count + 1 END, ' +
    'window_start = CASE WHEN (julianday(?) - julianday(window_start)) * 86400 > ? THEN excluded.window_start ELSE window_start END'
  ).bind(key, now, now, windowSeconds, now, windowSeconds).run();
  const row = await env.DB.prepare('SELECT count FROM auth_rate_limits WHERE key = ?')
    .bind(key).first<{ count: number }>();
  return (row?.count ?? 1) <= limit;
}

/**
 * 构造限流 key：`endpoint:ip:email`，邮箱统一小写。
 * - endpoint 防止 login/forgot 配额互相挤占
 * - ip 是 cf-connecting-ip（Cloudflare 给的客户端 IP；没有时上层已经兜底为 'unknown'）
 * - email 把同一邮箱的所有 IP 限在一起，缓解单 IP 轮询逃逸
 */
export function rateLimitKey(endpoint: string, ip: string, email: string): string {
  return `${endpoint}:${ip}:${email.toLowerCase()}`;
}
