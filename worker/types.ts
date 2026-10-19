export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  JWT_SECRET: string;
  FROM_EMAIL: string;
  FRONTEND_URL: string;
  ALLOWED_ORIGINS: string;
  AI_GATEWAY_BASE: string;
  AI_GATEWAY_TOKEN: string;
  AI_GATEWAY_MODEL: string;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  nickname: string | null;
  avatar_url: string | null;
  email_verified: number;
  tier: 'free' | 'plus' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  tier: 'free' | 'plus' | 'pro';
  email_verified: boolean;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface AuthResult {
  user: UserResponse;
  tokens: TokenPair;
}

/**
 * Minimal subset of Cloudflare's `ExecutionContext` that the Worker actually uses.
 * `waitUntil` lets us finish cache writes / background tasks after the response is
 * returned to the client. The full type ships with `@cloudflare/workers-types`
 * which is not in this repo; redeclare locally so we don't add a runtime dep.
 */
export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
