export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  JWT_SECRET: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  FRONTEND_URL: string;
  ALLOWED_ORIGINS: string;
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
