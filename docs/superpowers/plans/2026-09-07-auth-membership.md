# Cloudflare 用户体系 + 三级会员 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 school-formula 添加邮箱+密码+验证码认证系统和三级会员体系（free/plus/pro），后端用 Cloudflare Workers + D1 + KV + SendGrid。

**Architecture:** Workers 提供 REST API（注册/验证/登录/JWT 鉴权），前端 React SPA 通过 AuthContext 管理认证状态，RequireTier 组件做会员拦截。D1 存储用户数据，KV 存会话，SendGrid 发验证码邮件。

**Tech Stack:** Cloudflare Workers (TypeScript), D1 (SQLite), KV, SendGrid, React 19, Tailwind CSS, bcrypt(scrypt), JWT(HMAC-SHA256)

---

## 文件结构

```
├── wrangler.toml                  # Cloudflare 配置
├── worker/
│   ├── index.ts                   # Worker 入口 + 路由分发
│   ├── types.ts                   # Env 类型定义
│   ├── lib/
│   │   ├── jwt.ts                 # JWT 签名/验证
│   │   ├── password.ts            # 密码哈希 (scrypt)
│   │   └── email.ts               # SendGrid 邮件发送
│   └── routes/
│       ├── auth.ts                # /api/auth/* 端点
│       ├── user.ts                # /api/user/* 端点
│       └── ai.ts                  # /api/ai/* Pro 专属
├── db/
│   └── schema.sql                 # D1 建表 SQL
├── src/
│   ├── context/AuthContext.tsx    # 全局认证状态
│   ├── hooks/useAuth.ts           # useAuth hook
│   ├── services/auth.ts           # API 调用封装
│   ├── utils/jwt.ts               # JWT 解析工具
│   ├── components/auth/
│   │   ├── LoginModal.tsx         # 登录弹窗
│   │   ├── RegisterModal.tsx      # 注册弹窗（含验证码）
│   │   ├── ForgotPasswordModal.tsx# 忘记密码弹窗
│   │   └── PaywallModal.tsx       # 升级会员弹窗
│   └── guards/RequireTier.tsx     # 会员等级路由守卫
```

---

## Task 1: Cloudflare 基础设施配置

**Files:**
- Create: `wrangler.toml`
- Create: `db/schema.sql`

- [ ] **Step 1: 创建 wrangler.toml**

创建 `wrangler.toml`：

```toml
name = "school-formula-api"
main = "worker/index.ts"
compatibility_date = "2026-09-07"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "school-formula-db"
database_id = "REPLACE_WITH_REAL_ID"

[[kv_namespaces]]
binding = "SESSIONS"
id = "REPLACE_WITH_REAL_ID"

[vars]
FRONTEND_URL = "https://school-formula.pages.dev"
ENVIRONMENT = "development"
```

- [ ] **Step 2: 创建 D1 schema**

创建 `db/schema.sql`：

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  email_verified INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK(tier IN ('free','plus','pro')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  purpose TEXT DEFAULT 'register',
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TEXT,
  expires_at TEXT,
  payment_provider TEXT,
  payment_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS login_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16))),
  user_id TEXT REFERENCES users(id),
  email TEXT,
  success INTEGER,
  error TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

- [ ] **Step 3: 提交**

```bash
git add wrangler.toml db/schema.sql
git commit -m "feat(auth): add wrangler config and D1 database schema"
```

---

## Task 2: Worker 入口 + 类型定义

**Files:**
- Create: `worker/types.ts`
- Create: `worker/index.ts`

- [ ] **Step 1: 创建 worker/types.ts**

```typescript
export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  JWT_SECRET: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  FRONTEND_URL: string;
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

export interface ApiError {
  error: string;
  code?: string;
}
```

- [ ] **Step 2: 创建 worker/index.ts**

```typescript
import { handleAuth } from './routes/auth';
import { handleUser } from './routes/user';
import { handleAI } from './routes/ai';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.FRONTEND_URL,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': env.FRONTEND_URL,
      'Content-Type': 'application/json',
    };

    try {
      let response: Response;

      if (path.startsWith('/api/auth/')) {
        response = await handleAuth(request, env, path);
      } else if (path.startsWith('/api/user/')) {
        response = await handleUser(request, env, path);
      } else if (path.startsWith('/api/ai/')) {
        response = await handleAI(request, env, path);
      } else if (path === '/api/health') {
        response = new Response(JSON.stringify({ status: 'ok' }), { headers: corsHeaders });
      } else {
        response = new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: corsHeaders,
        });
      }

      // 附加 CORS 头
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, { status: response.status, headers: newHeaders });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal server error';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
```

- [ ] **Step 3: 提交**

```bash
git add worker/types.ts worker/index.ts
git commit -m "feat(auth): add worker entry point and type definitions"
```

---

## Task 3: Worker 工具库 (JWT + Password + Email)

**Files:**
- Create: `worker/lib/jwt.ts`
- Create: `worker/lib/password.ts`
- Create: `worker/lib/email.ts`

- [ ] **Step 1: 创建 worker/lib/jwt.ts**

```typescript
import type { Env } from '../types';

function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function importHMACSecret(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function createJWTPayload(subject: string, tier: string, expiresIn: number): object {
  const now = Math.floor(Date.now() / 1000);
  return {
    sub: subject,
    tier,
    iat: now,
    exp: now + expiresIn,
  };
}

export async function signJWT(
  subject: string,
  tier: string,
  env: Env,
  expiresIn: number = 900 // 15 min
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = createJWTPayload(subject, tier, expiresIn);

  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importHMACSecret(env.JWT_SECRET);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

export async function verifyJWT(token: string, env: Env): Promise<{ sub: string; tier: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importHMACSecret(env.JWT_SECRET);
  const signature = base64UrlDecode(signatureB64);

  const valid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(signingInput));
  if (!valid) return null;

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return { sub: payload.sub, tier: payload.tier };
}

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}
```

- [ ] **Step 2: 创建 worker/lib/password.ts**

```typescript
// 使用 scrypt (Web Crypto API) 做密码哈希
// 格式: scrypt$<salt_hex>$<hash_hex>

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex: string): Uint8Array {
  const buf = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    buf[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buf;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return `pbkdf2$${bufToHex(salt)}$${bufToHex(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;

  const salt = hexToBuf(parts[1]);
  const expectedHash = parts[2];
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return bufToHex(new Uint8Array(bits)) === expectedHash;
}
```

- [ ] **Step 3: 创建 worker/lib/email.ts**

```typescript
import type { Env } from '../types';

export function generateVerificationCode(): string {
  const num = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return num.toString().padStart(6, '0');
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  env: Env
): Promise<boolean> {
  const subject = '拾艺院 邮箱验证';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #1a1a1a; margin-bottom: 24px;">拾艺院 邮箱验证</h2>
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
        您的验证码是：
      </p>
      <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
      </div>
      <p style="color: #888; font-size: 14px;">
        该验证码 10 分钟内有效。如非本人操作，请忽略此邮件。
      </p>
    </div>
  `;

  try {
    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: env.SENDGRID_FROM_EMAIL, name: '拾艺院' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add worker/lib/jwt.ts worker/lib/password.ts worker/lib/email.ts
git commit -m "feat(auth): add JWT, password hashing, and email utilities"
```

---

## Task 4: 认证 API 路由

**Files:**
- Create: `worker/routes/auth.ts`

- [ ] **Step 1: 创建 worker/routes/auth.ts**

```typescript
import type { Env, UserResponse } from '../types';
import { signJWT, verifyJWT, generateRefreshToken } from '../lib/jwt';
import { hashPassword, verifyPassword } from '../lib/password';
import { generateVerificationCode, sendVerificationEmail } from '../lib/email';

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

function toUserResponse(row: Record<string, unknown>): UserResponse {
  return {
    id: row.id as string,
    email: row.email as string,
    nickname: (row.nickname as string) || null,
    avatar_url: (row.avatar_url as string) || null,
    tier: row.tier as 'free' | 'plus' | 'pro',
    email_verified: !!(row.email_verified as number),
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handleAuth(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const endpoint = path.replace('/api/auth/', '');

  // POST /api/auth/register
  if (endpoint === 'register' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body?.password) {
      return errorResponse('邮箱和密码不能为空');
    }
    if (!EMAIL_REGEX.test(body.email)) {
      return errorResponse('邮箱格式不正确');
    }
    if (body.password.length < 8) {
      return errorResponse('密码至少 8 位');
    }

    // 检查邮箱是否已注册
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (existing) {
      return errorResponse('该邮箱已被注册', 409, 'EMAIL_TAKEN');
    }

    // 创建用户
    const userId = crypto.randomUUID().replace(/-/g, '');
    const passwordHash = await hashPassword(body.password);
    await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, email_verified) VALUES (?, ?, ?, 0)'
    )
      .bind(userId, body.email.toLowerCase(), passwordHash)
      .run();

    // 发送验证码
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO email_verifications (email, code, purpose, expires_at) VALUES (?, ?, ?, ?)'
    )
      .bind(body.email.toLowerCase(), code, 'register', expiresAt)
      .run();

    await sendVerificationEmail(body.email.toLowerCase(), code, env);

    return jsonResponse({ message: '验证码已发送', email: body.email.toLowerCase() });
  }

  // POST /api/auth/verify
  if (endpoint === 'verify' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; code?: string } | null;
    if (!body?.email || !body?.code) {
      return errorResponse('邮箱和验证码不能为空');
    }

    const record = await env.DB.prepare(
      'SELECT code, expires_at FROM email_verifications WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1'
    )
      .bind(body.email.toLowerCase(), 'register')
      .first<{ code: string; expires_at: string }>();

    if (!record || record.code !== body.code) {
      return errorResponse('验证码错误', 400, 'INVALID_CODE');
    }
    if (new Date(record.expires_at) < new Date()) {
      return errorResponse('验证码已过期', 400, 'CODE_EXPIRED');
    }

    // 激活用户
    await env.DB.prepare('UPDATE users SET email_verified = 1, updated_at = ? WHERE email = ?')
      .bind(new Date().toISOString(), body.email.toLowerCase())
      .run();

    // 清理验证码
    await env.DB.prepare('DELETE FROM email_verifications WHERE email = ?')
      .bind(body.email.toLowerCase())
      .run();

    // 签发 Token
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) return errorResponse('用户不存在', 404);

    const access = await signJWT(user.id as string, user.tier as string, env);
    const refresh = generateRefreshToken();
    const refreshHash = await hashToken(refresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(user.id as string, refreshHash, refreshExpires)
      .run();

    return jsonResponse({
      message: '邮箱验证成功',
      user: toUserResponse(user),
      tokens: { access, refresh },
    });
  }

  // POST /api/auth/resend
  if (endpoint === 'resend' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string } | null;
    if (!body?.email) return errorResponse('邮箱不能为空');

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND email_verified = 0')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) return errorResponse('用户不存在或已验证', 404);

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO email_verifications (email, code, purpose, expires_at) VALUES (?, ?, ?, ?)'
    )
      .bind(body.email.toLowerCase(), code, 'register', expiresAt)
      .run();

    await sendVerificationEmail(body.email.toLowerCase(), code, env);
    return jsonResponse({ message: '验证码已重发' });
  }

  // POST /api/auth/login
  if (endpoint === 'login' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body?.password) {
      return errorResponse('邮箱和密码不能为空');
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) {
      return errorResponse('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(body.password, user.password_hash as string);
    if (!valid) {
      return errorResponse('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');
    }
    if (!user.email_verified) {
      return errorResponse('请先验证邮箱', 403, 'EMAIL_NOT_VERIFIED');
    }

    const access = await signJWT(user.id as string, user.tier as string, env);
    const refresh = generateRefreshToken();
    const refreshHash = await hashToken(refresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(user.id as string, refreshHash, refreshExpires)
      .run();

    // 记录登录日志
    await env.DB.prepare(
      'INSERT INTO login_logs (user_id, email, success, ip, user_agent) VALUES (?, ?, 1, ?, ?)'
    )
      .bind(user.id as string, body.email.toLowerCase(), request.headers.get('cf-connecting-ip') || '', request.headers.get('user-agent') || '')
      .run();

    return jsonResponse({
      user: toUserResponse(user),
      tokens: { access, refresh },
    });
  }

  // POST /api/auth/refresh
  if (endpoint === 'refresh' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { refresh?: string } | null;
    if (!body?.refresh) return errorResponse('缺少刷新令牌');

    const refreshHash = await hashToken(body.refresh);
    const session = await env.DB.prepare(
      'SELECT s.*, u.tier FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.refresh_token_hash = ? AND s.expires_at > ?'
    )
      .bind(refreshHash, new Date().toISOString())
      .first<{ user_id: string; tier: string }>();

    if (!session) return errorResponse('无效的刷新令牌', 401, 'INVALID_REFRESH');

    // 轮换：删除旧 refresh，发新的
    await env.DB.prepare('DELETE FROM sessions WHERE refresh_token_hash = ?')
      .bind(refreshHash)
      .run();

    const access = await signJWT(session.user_id, session.tier, env);
    const newRefresh = generateRefreshToken();
    const newRefreshHash = await hashToken(newRefresh);
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)'
    )
      .bind(session.user_id, newRefreshHash, refreshExpires)
      .run();

    return jsonResponse({ tokens: { access, refresh: newRefresh } });
  }

  // POST /api/auth/logout
  if (endpoint === 'logout' && request.method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const payload = await verifyJWT(authHeader.slice(7), env);
      if (payload) {
        // 删除该用户所有会话
        await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?')
          .bind(payload.sub)
          .run();
      }
    }
    return jsonResponse({ message: '已登出' });
  }

  // POST /api/auth/forgot
  if (endpoint === 'forgot' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string } | null;
    if (!body?.email) return errorResponse('邮箱不能为空');

    const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(body.email.toLowerCase())
      .first();
    if (!user) {
      // 不泄露邮箱是否存在
      return jsonResponse({ message: '如果邮箱存在，验证码已发送' });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO email_verifications (email, code, purpose, expires_at) VALUES (?, ?, ?, ?)'
    )
      .bind(body.email.toLowerCase(), code, 'reset_password', expiresAt)
      .run();

    await sendVerificationEmail(body.email.toLowerCase(), code, env);
    return jsonResponse({ message: '如果邮箱存在，验证码已发送' });
  }

  // POST /api/auth/reset
  if (endpoint === 'reset' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as { email?: string; code?: string; password?: string } | null;
    if (!body?.email || !body?.code || !body?.password) {
      return errorResponse('邮箱、验证码和新密码不能为空');
    }
    if (body.password.length < 8) {
      return errorResponse('密码至少 8 位');
    }

    const record = await env.DB.prepare(
      'SELECT code, expires_at FROM email_verifications WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1'
    )
      .bind(body.email.toLowerCase(), 'reset_password')
      .first<{ code: string; expires_at: string }>();

    if (!record || record.code !== body.code) {
      return errorResponse('验证码错误', 400, 'INVALID_CODE');
    }
    if (new Date(record.expires_at) < new Date()) {
      return errorResponse('验证码已过期', 400, 'CODE_EXPIRED');
    }

    const newHash = await hashPassword(body.password);
    await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?')
      .bind(newHash, new Date().toISOString(), body.email.toLowerCase())
      .run();

    await env.DB.prepare('DELETE FROM email_verifications WHERE email = ?')
      .bind(body.email.toLowerCase())
      .run();

    return jsonResponse({ message: '密码重置成功' });
  }

  return errorResponse('未找到端点', 404);
}
```

- [ ] **Step 2: 提交**

```bash
git add worker/routes/auth.ts
git commit -m "feat(auth): implement auth API routes (register/verify/login/refresh/logout/forgot/reset)"
```

---

## Task 5: 用户 + AI 路由

**Files:**
- Create: `worker/routes/user.ts`
- Create: `worker/routes/ai.ts`

- [ ] **Step 1: 创建 worker/routes/user.ts**

```typescript
import type { Env, UserResponse } from '../types';
import { verifyJWT } from '../lib/jwt';

function jsonResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function toUserResponse(row: Record<string, unknown>): UserResponse {
  return {
    id: row.id as string,
    email: row.email as string,
    nickname: (row.nickname as string) || null,
    avatar_url: (row.avatar_url as string) || null,
    tier: row.tier as 'free' | 'plus' | 'pro',
    email_verified: !!(row.email_verified as number),
  };
}

async function getAuthenticatedUser(request: Request, env: Env): Promise<UserResponse | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const payload = await verifyJWT(authHeader.slice(7), env);
  if (!payload) return null;

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(payload.sub)
    .first();
  if (!user) return null;

  return toUserResponse(user);
}

const TIER_ORDER = { free: 0, plus: 1, pro: 2 };
export function hasTierAccess(userTier: string, requiredTier: string): boolean {
  return TIER_ORDER[userTier as keyof typeof TIER_ORDER] >= TIER_ORDER[requiredTier as keyof typeof TIER_ORDER];
}

export async function handleUser(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const endpoint = path.replace('/api/user/', '');
  const user = await getAuthenticatedUser(request, env);

  // GET /api/user/me
  if (endpoint === 'me' && request.method === 'GET') {
    if (!user) return errorResponse('未登录', 401);
    return jsonResponse({ user });
  }

  // PUT /api/user/config
  if (endpoint === 'config' && request.method === 'PUT') {
    if (!user) return errorResponse('未登录', 401);
    const body = await request.json().catch(() => null) as { nickname?: string } | null;

    if (body?.nickname !== undefined) {
      await env.DB.prepare('UPDATE users SET nickname = ?, updated_at = ? WHERE id = ?')
        .bind(body.nickname, new Date().toISOString(), user.id)
        .run();
    }

    const updated = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(user.id)
      .first();
    return jsonResponse({ user: toUserResponse(updated!) });
  }

  return errorResponse('未找到端点', 404);
}
```

- [ ] **Step 2: 创建 worker/routes/ai.ts**

```typescript
import type { Env } from '../types';
import { verifyJWT } from '../lib/jwt';
import { hasTierAccess } from './user';

function jsonResponse(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleAI(
  request: Request,
  env: Env,
  path: string
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

  // 检查 Pro 权限
  if (!hasTierAccess(payload.tier, 'pro')) {
    return errorResponse('此功能需要 Pro 会员', 403, 'UPGRADE_REQUIRED');
  }

  // AI 生成代理（服务端托管 API Key）
  if (path === '/api/ai/generate') {
    const body = await request.json().catch(() => null) as { prompt?: string; model?: string } | null;
    if (!body?.prompt) return errorResponse('缺少 prompt');

    // TODO: 调用 OpenAI/DeepSeek API（用服务端配置的 Key）
    // 当前返回占位
    return jsonResponse({
      result: 'AI 功能即将上线，敬请期待',
      model: body.model || 'default',
    });
  }

  return errorResponse('未找到端点', 404);
}
```

- [ ] **Step 3: 提交**

```bash
git add worker/routes/user.ts worker/routes/ai.ts
git commit -m "feat(auth): add user profile and AI proxy routes"
```

---

## Task 6: 前端 AuthContext + useAuth

**Files:**
- Create: `src/context/AuthContext.tsx`
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1: 创建 src/context/AuthContext.tsx**

```tsx
import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getToken, setToken, clearToken, getRefreshToken, setRefreshToken, clearRefreshToken } from '../utils/jwt';

export interface User {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  tier: 'free' | 'plus' | 'pro';
  email_verified: boolean;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ email: string }>;
  verify: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
      } else if (resp.status === 401) {
        // 尝试 refresh
        const refreshed = await tryRefresh();
        if (!refreshed) {
          clearToken();
          clearRefreshToken();
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const resp = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setToken(data.tokens.access);
        setRefreshToken(data.tokens.refresh);
        await refreshUser();
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, [refreshUser]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '登录失败' }));
      throw new Error(err.error || '登录失败');
    }
    const data = await resp.json();
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '注册失败' }));
      throw new Error(err.error || '注册失败');
    }
    return resp.json();
  }, []);

  const verify = useCallback(async (email: string, code: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '验证失败' }));
      throw new Error(err.error || '验证失败');
    }
    const data = await resp.json();
    setToken(data.tokens.access);
    setRefreshToken(data.tokens.refresh);
    setUser(data.user);
  }, []);

  const resendCode = useCallback(async (email: string) => {
    const resp = await fetch(`${API_BASE}/api/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: '重发失败' }));
      throw new Error(err.error || '重发失败');
    }
  }, []);

  const logout = useCallback(() => {
    const token = getToken();
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearToken();
    clearRefreshToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verify,
        resendCode,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: 创建 src/hooks/useAuth.ts**

```tsx
import { useContext } from 'react';
import { AuthContext, type User } from '../context/AuthContext';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ email: string }>;
  verify: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 3: 提交**

```bash
git add src/context/AuthContext.tsx src/hooks/useAuth.ts
git commit -m "feat(auth): add AuthContext and useAuth hook"
```

---

## Task 7: JWT 工具 + API 封装

**Files:**
- Create: `src/utils/jwt.ts`
- Create: `src/services/auth.ts`

- [ ] **Step 1: 创建 src/utils/jwt.ts**

```typescript
const ACCESS_TOKEN_KEY = 'sf_access_token';
const REFRESH_TOKEN_KEY = 'sf_refresh_token';

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
```

- [ ] **Step 2: 创建 src/services/auth.ts**

```typescript
import { getToken } from '../utils/jwt';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return resp;
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  verify: (email: string, code: string) =>
    apiFetch('/api/auth/verify', { method: 'POST', body: JSON.stringify({ email, code }) }),

  resend: (email: string) =>
    apiFetch('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email }) }),

  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),

  forgot: (email: string) =>
    apiFetch('/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) }),

  reset: (email: string, code: string, password: string) =>
    apiFetch('/api/auth/reset', { method: 'POST', body: JSON.stringify({ email, code, password }) }),

  getMe: () => apiFetch('/api/user/me'),

  updateConfig: (data: Record<string, unknown>) =>
    apiFetch('/api/user/config', { method: 'PUT', body: JSON.stringify(data) }),
};
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/jwt.ts src/services/auth.ts
git commit -m "feat(auth): add JWT storage utilities and auth API service"
```

---

## Task 8: 认证 UI 组件

**Files:**
- Create: `src/components/auth/LoginModal.tsx`
- Create: `src/components/auth/RegisterModal.tsx`
- Create: `src/components/auth/ForgotPasswordModal.tsx`
- Create: `src/components/auth/PaywallModal.tsx`

- [ ] **Step 1: 创建 src/components/auth/LoginModal.tsx**

```tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export function LoginModal({ onClose, onSwitchToRegister, onSwitchToForgot }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">登录拾艺院</h2>
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入密码"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <button onClick={onSwitchToForgot} className="text-sm text-gray-500 hover:text-blue-600">
            忘记密码？
          </button>
          <p className="text-sm text-gray-500">
            还没有账号？{' '}
            <button onClick={onSwitchToRegister} className="text-blue-600 font-medium hover:underline">
              立即注册
            </button>
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 src/components/auth/RegisterModal.tsx**

```tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type Step = 'register' | 'verify';

export function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { register, verify, resendCode } = useAuth();
  const [step, setStep] = useState<Step>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(email, password);
      setEmail(data.email);
      setStep('verify');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verify(email, code);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await resendCode(email);
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重发失败');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {step === 'register' ? '注册拾艺院' : '验证邮箱'}
        </h2>
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
        )}

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="至少 8 位"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? '发送中...' : '注册并发送验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-gray-600">
              验证码已发送至 <strong>{email}</strong>，请查收邮件。
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6 位验证码</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? '验证中...' : '验证并登录'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className="w-full text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50"
            >
              {countdown > 0 ? `${countdown}秒后可重发` : '重发验证码'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          已有账号？{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 font-medium hover:underline">
            直接登录
          </button>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 src/components/auth/ForgotPasswordModal.tsx**

```tsx
import { useState, useEffect } from 'react';
import { authApi } from '../../services/auth';

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type Step = 'email' | 'verify';

export function ForgotPasswordModal({ onClose, onSwitchToLogin }: Props) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgot(email);
      setStep('verify');
      setCountdown(60);
    } catch (err) {
      setError('发送失败，请检查邮箱');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await authApi.reset(email, code, password);
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">密码重置成功</h2>
          <p className="text-gray-600 mb-6">请使用新密码登录</p>
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">重置密码</h2>
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">注册邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '发送中...' : '发送验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '重置中...' : '重置密码'}
            </button>
            <button
              type="button"
              disabled={countdown > 0}
              onClick={async () => {
                await authApi.forgot(email);
                setCountdown(60);
              }}
              className="w-full text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50"
            >
              {countdown > 0 ? `${countdown}秒后可重发` : '重发验证码'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 src/components/auth/PaywallModal.tsx**

```tsx
interface Props {
  requiredTier: 'plus' | 'pro';
  onClose: () => void;
}

const TIER_INFO = {
  plus: {
    name: 'Plus',
    emoji: '⭐',
    price: '¥19/月',
    features: ['全部练习题库', '错题本', '学习进度追踪', '学习笔记', '教程系统'],
  },
  pro: {
    name: 'Pro',
    emoji: '👑',
    price: '¥49/月',
    features: ['Plus 全部功能', 'AI 智能助教（免配置）', '会员专属内容', '优先客服支持'],
  },
};

export function PaywallModal({ requiredTier, onClose }: Props) {
  const info = TIER_INFO[requiredTier];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">{info.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">升级至 {info.name}</h2>
        <p className="text-gray-600 mb-6">解锁更多学习功能，助力孩子成长</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-2xl font-bold text-blue-600 mb-3">{info.price}</div>
          <ul className="text-left space-y-2">
            {info.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium opacity-75 cursor-not-allowed"
        >
          即将开放
        </button>
        <p className="mt-3 text-xs text-gray-400">支付功能即将上线，敬请期待</p>

        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
          稍后再说
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/auth/LoginModal.tsx src/components/auth/RegisterModal.tsx src/components/auth/ForgotPasswordModal.tsx src/components/auth/PaywallModal.tsx
git commit -m "feat(auth): add login, register, forgot password, and paywall modals"
```

---

## Task 9: 会员守卫 + Header 用户菜单

**Files:**
- Create: `src/guards/RequireTier.tsx`
- Create: `src/components/auth/UserMenu.tsx`
- Modify: `src/components/Home.tsx` — 添加 AuthProvider 和登录入口

- [ ] **Step 1: 创建 src/guards/RequireTier.tsx**

```tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from '../auth/LoginModal';
import { PaywallModal } from '../auth/PaywallModal';

const TIER_ORDER = { free: 0, plus: 1, pro: 2 };

interface Props {
  tier: 'free' | 'plus' | 'pro';
  children: React.ReactNode;
}

export function RequireTier({ tier, children }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // 免费功能直接放行
  if (tier === 'free') return <>{children}</>;

  // 未登录 → 显示登录
  if (!isAuthenticated || !user) {
    return (
      <>
        <div
          className="cursor-pointer opacity-75 hover:opacity-100 transition"
          onClick={() => setShowLogin(true)}
        >
          {children}
        </div>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  // 等级不足 → 显示付费墙
  if (TIER_ORDER[user.tier] < TIER_ORDER[tier]) {
    return (
      <>
        <div
          className="cursor-pointer opacity-75 hover:opacity-100 transition"
          onClick={() => setShowPaywall(true)}
        >
          {children}
        </div>
        {showPaywall && <PaywallModal requiredTier={tier} onClose={() => setShowPaywall(false)} />}
      </>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: 创建 src/components/auth/UserMenu.tsx**

```tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isAuthenticated && user) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
            {user.nickname?.[0] || user.email[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
            {user.nickname || user.email.split('@')[0]}
          </span>
          {user.tier !== 'free' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white uppercase">
              {user.tier}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.tier} 会员</p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
      >
        登录
      </button>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </>
  );
}
```

- [ ] **Step 3: 修改 src/main.tsx 包裹 AuthProvider**

在 `src/main.tsx` 中：

```diff
+ import { AuthProvider } from './context/AuthProvider';
  import App from './App';

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
+     <AuthProvider>
        <App />
+     </AuthProvider>
    </StrictMode>
  );
```

- [ ] **Step 4: 提交**

```bash
git add src/guards/RequireTier.tsx src/components/auth/UserMenu.tsx src/main.tsx
git commit -m "feat(auth): add tier guard, user menu, and wire AuthProvider"
```

---

## Task 10: Vite 环境变量配置

**Files:**
- Create: `.env.development`
- Create: `.env.production`
- Modify: `vite.config.ts` — 添加 API 代理

- [ ] **Step 1: 创建 .env.development**

```
VITE_API_URL=http://localhost:8787
```

- [ ] **Step 2: 创建 .env.production**

```
VITE_API_URL=https://school-formula-api.your-subdomain.workers.dev
```

- [ ] **Step 3: 修改 vite.config.ts 添加代理**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 4: 提交**

```bash
git add .env.development .env.production vite.config.ts
git commit -m "feat(auth): add environment config and dev proxy for API"
```

---

## Task 11: Wrangler Secrets + 部署文档

**Files:**
- Create: `DEPLOY_AUTH.md`

- [ ] **Step 1: 创建部署文档**

创建 `DEPLOY_AUTH.md`：

```markdown
# 用户体系部署指南

## 前置条件
- Cloudflare 账号
- Wrangler CLI (`npm install -g wrangler`)
- SendGrid 账号（免费 100 封/天）

## 部署步骤

### 1. 创建 D1 数据库
```bash
npx wrangler d1 create school-formula-db
# 将返回的 database_id 填入 wrangler.toml
```

### 2. 创建 KV 命名空间
```bash
npx wrangler kv:namespace create SESSIONS
# 将返回的 id 填入 wrangler.toml
```

### 3. 初始化数据库表
```bash
npx wrangler d1 execute school-formula-db --file=db/schema.sql
```

### 4. 设置 Secrets
```bash
npx wrangler secret put JWT_SECRET
# 输入: 至少 32 字符的随机字符串

npx wrangler secret put SENDGRID_API_KEY
# 输入: SG.xxxxx

npx wrangler secret put SENDGRID_FROM_EMAIL
# 输入: noreply@yourdomain.com
```

### 5. 本地开发
```bash
npx wrangler dev worker/index.ts
```

### 6. 部署
```bash
npx wrangler deploy
```

### 7. 配置 Pages CORS
在 Cloudflare Pages 设置中，将 API 域名加入允许来源。
```

- [ ] **Step 2: 提交**

```bash
git add DEPLOY_AUTH.md
git commit -m "feat(auth): add deployment documentation"
```

---

## 自检

| Spec 要求 | 对应 Task |
|-----------|-----------|
| 邮箱 + 密码注册 | Task 4 (register) |
| 邮箱验证码 | Task 4 (verify/resend) + Task 8 (RegisterModal) |
| JWT 鉴权 | Task 3 (jwt.ts) + Task 2 (index.ts) |
| Refresh Token 轮换 | Task 4 (refresh) |
| 三级会员 (free/plus/pro) | Task 1 (schema) + Task 9 (RequireTier) |
| 付费墙拦截 | Task 8 (PaywallModal) + Task 9 (RequireTier) |
| AI 代理 (Pro) | Task 5 (ai.ts) |
| SendGrid 邮件 | Task 3 (email.ts) |
| 部署配置 | Task 1 (wrangler.toml) + Task 11 (DEPLOY_AUTH.md) |
| 忘记密码 | Task 4 (forgot/reset) + Task 8 (ForgotPasswordModal) |
PLAN_EOL
echo "Plan written: $(wc -l < /Users/shichaopeng/Work/self-dir/projects/school-formula/docs/superpowers/plans/2026-09-07-auth-membership.md) lines"