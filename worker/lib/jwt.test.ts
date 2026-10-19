import { describe, expect, it } from 'vitest';
import { signJWT, verifyJWT } from './jwt';
import type { Env } from '../types';

/** Build a minimal Env-like stub carrying only JWT_SECRET for these tests. */
function envWith(secret: string | undefined): Env {
  return { JWT_SECRET: secret ?? '' } as unknown as Env;
}

describe('signJWT / verifyJWT', () => {
  it('throws when JWT_SECRET is empty', async () => {
    await expect(signJWT('user-1', 'free', envWith(''))).rejects.toThrow(/JWT_SECRET/);
    await expect(signJWT('user-1', 'free', envWith(undefined))).rejects.toThrow(/JWT_SECRET/);
  });

  it('signs and verifies a token round-trip', async () => {
    const env = envWith('test-secret-please-rotate');
    const token = await signJWT('user-1', 'plus', env);
    const verified = await verifyJWT(token, env);
    expect(verified).toEqual({ sub: 'user-1', tier: 'plus' });
  });

  it('returns null when a token has been tampered with', async () => {
    const env = envWith('test-secret-please-rotate');
    const token = await signJWT('user-1', 'plus', env);
    const tampered = token.slice(0, -2) + (token.endsWith('A') ? 'B' : 'A');
    expect(await verifyJWT(tampered, env)).toBeNull();
  });

  it('returns null for a malformed token', async () => {
    const env = envWith('test-secret-please-rotate');
    expect(await verifyJWT('not.a.valid.token', env)).toBeNull();
    expect(await verifyJWT('only-one-segment', env)).toBeNull();
    expect(await verifyJWT('a.b', env)).toBeNull();
  });
});
