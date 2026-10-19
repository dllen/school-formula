import { describe, expect, it } from 'vitest';
import { checkRateLimit, rateLimitKey } from './rate-limit';

describe('rateLimitKey', () => {
  it('lowercases the email so case variants share the same bucket', () => {
    expect(rateLimitKey('login', '1.2.3.4', 'User@Example.COM')).toBe('login:1.2.3.4:user@example.com');
  });

  it('keeps endpoint + ip + email as distinct segments', () => {
    expect(rateLimitKey('forgot', '9.9.9.9', 'a@b.c')).toBe('forgot:9.9.9.9:a@b.c');
  });

  it('does not collapse different endpoints to the same key', () => {
    const a = rateLimitKey('login', '1.1.1.1', 'x@y.z');
    const b = rateLimitKey('forgot', '1.1.1.1', 'x@y.z');
    expect(a).not.toBe(b);
  });
});

describe('checkRateLimit', () => {
  const WINDOW = 60; // 1 minute
  const LIMIT = 5;

  it('allows the first hit on a fresh key', () => {
    const r = checkRateLimit(undefined, 1_000_000, WINDOW, LIMIT);
    expect(r.allowed).toBe(true);
    expect(r.next).toEqual({ count: 1, windowStart: 1_000_000 });
  });

  it('rejects after the limit is exceeded within a single window', () => {
    // 模拟限流 key 在 1 分钟内连续命中到超限：
    // 状态：count=4, windowStart=T；第 5 次 allowed=true；第 6 次 allowed=false
    let state: { count: number; windowStart: number } | undefined = undefined;
    const baseMs = 1_700_000_000_000;
    for (let i = 1; i <= LIMIT; i++) {
      const r = checkRateLimit(state, baseMs + i * 1000, WINDOW, LIMIT);
      expect(r.allowed, `hit #${i} should be allowed`).toBe(true);
      state = r.next;
    }
    // LIMIT 次都在窗口内：第 6 次应当被拒
    const overflow = checkRateLimit(state, baseMs + (LIMIT + 1) * 1000, WINDOW, LIMIT);
    expect(overflow.allowed).toBe(false);
    // 拒绝时 count 仍递增到 LIMIT+1，以便记录攻击面
    expect(overflow.next.count).toBe(LIMIT + 1);
  });

  it('resets the counter once the window has fully expired', () => {
    const baseMs = 1_700_000_000_000;
    // 先把窗口打满到拒绝
    let state: { count: number; windowStart: number } | undefined = undefined;
    for (let i = 1; i <= LIMIT + 1; i++) {
      const r = checkRateLimit(state, baseMs + i * 1000, WINDOW, LIMIT);
      state = r.next;
    }
    expect(state?.count).toBe(LIMIT + 1);

    // 窗口外再次命中：应当被当作新窗口的第一次，重新放行
    // 末次累加在 baseMs + 6*1000；需要超过 baseMs + 6*1000 + WINDOW*1000
    const freshMs = baseMs + (LIMIT + 1) * 1000 + WINDOW * 1000 + 1000;
    const r = checkRateLimit(state, freshMs, WINDOW, LIMIT);
    expect(r.allowed).toBe(true);
    expect(r.next).toEqual({ count: 1, windowStart: freshMs });
  });

  it('treats a hit exactly at the window boundary as still in-window', () => {
    const baseMs = 1_700_000_000_000;
    const r1 = checkRateLimit(undefined, baseMs, WINDOW, LIMIT);
    // 恰好 WINDOW 秒后，elapsed == WINDOW，不严格 > WINDOW，所以算同一窗口
    const r2 = checkRateLimit(r1.next, baseMs + WINDOW * 1000, WINDOW, LIMIT);
    expect(r2.allowed).toBe(true);
    expect(r2.next.count).toBe(2);
  });
});
