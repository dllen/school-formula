# Cloudflare 用户体系 + 三级会员 — 设计文档

> 日期：2026-09-07
> 状态：草稿

## 1. 背景与目标

`school-formula` 是纯前端 SPA，所有数据存于 localStorage，无后端。本功能引入 Cloudflare 技术栈，添加用户认证（邮箱 + 密码 + 邮箱验证码）和三级会员体系，为后续付费功能打基础。

## 2. 认证方式

仅支持 **邮箱 + 密码** 注册登录，注册时需邮件验证码确认邮箱所有权。

| 步骤 | 说明 |
|------|------|
| 1. 注册 | 输入邮箱 + 密码 → 发送验证码邮件 |
| 2. 验证 | 输入 6 位验证码 → 邮箱确认 → 账户激活 |
| 3. 登录 | 邮箱 + 密码 → 返回 JWT (access + refresh) |
| 4. 续期 | Access Token 过期 → 用 Refresh Token 换取新 Token |

**密码安全**：bcrypt 哈希存 D1，Never 存明文。

**JWT 策略**：Access Token (15min) + Refresh Token (7d, KV 存储)。

## 3. 三级会员体系

| 等级 | 标识 | 功能解锁 |
|------|------|---------|
| 免费 | `free` | 知识点浏览、速查表、古籍阅读、基础练习（限题量） |
| Plus | `plus` | 全部练习 + 错题本 + 学习进度 + 笔记 + 教程 |
| Pro | `pro` | Plus 全部 + AI 助教（服务端托管 Key）+ 会员专属内容 |

付费墙：前端路由守卫 + 后端 API 中间件双重校验 `user.tier`。
支付：本期不做，预留 `subscriptions` 表 + 支付字段，后续接入。

## 4. 架构

```
┌─────────────────────────────────────────────┐
│  Frontend (React SPA, Cloudflare Pages)      │
│  ┌────────────┐ ┌──────────┐ ┌───────────┐  │
│  │AuthContext │ │LoginModal│ │PaywallModal│  │
│  └─────┬──────┘ └────┬─────┘ └─────┬─────┘  │
│        └──────────────┼────────────┘         │
└───────────────────────┼──────────────────────┘
                        │ JWT Bearer
┌───────────────────────┼──────────────────────┐
│  Cloudflare Workers   │                      │
│  ┌──────────┐ ┌───────┴───┐ ┌─────────────┐  │
│  │/api/auth │ │/api/user  │ │/api/ai      │  │
│  └────┬─────┘ └─────┬─────┘ └──────┬──────┘  │
└───────┼──────────────┼────────────┼───────────┘
        └──────────────┼────────────┘
┌──────────────────────┼───────────────────────┐
│  Cloudflare 基础设施  │                       │
│  ┌─────┐ ┌─────┐ ┌───┴────┐ ┌────────────┐  │
│  │ D1  │ │ KV  │ │SendGrid│ │Secrets Mgr │  │
│  │用户库│ │会话  │ │邮件发送 │ │JWT密钥     │  │
│  └─────┘ └─────┘ └────────┘ └────────────┘  │
└──────────────────────────────────────────────┘
```

## 5. 数据库 Schema (D1/SQLite)

```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  email_verified INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK(tier IN ('free','plus','pro')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 邮箱验证码
CREATE TABLE email_verifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  purpose TEXT DEFAULT 'register', -- register | reset_password
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 会话 (Refresh Token 黑名单/轮换)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  refresh_token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 会员订阅 (预留)
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  tier TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TEXT,
  expires_at TEXT,
  payment_provider TEXT,
  payment_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 登录日志
CREATE TABLE login_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16))),
  user_id TEXT REFERENCES users(id),
  email TEXT,
  success INTEGER,
  error TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## 6. API 设计

| 端点 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/auth/register` | POST | 提交邮箱+密码，发送验证码 | 公开 |
| `/api/auth/verify` | POST | 输入验证码，激活账户 | 公开 |
| `/api/auth/resend` | POST | 重发验证码 | 公开 |
| `/api/auth/login` | POST | 邮箱+密码 → JWT | 公开 |
| `/api/auth/refresh` | POST | 刷新 Access Token | 公开 |
| `/api/auth/logout` | POST | 吊销 Refresh Token | 需登录 |
| `/api/auth/forgot` | POST | 发送重置密码验证码 | 公开 |
| `/api/auth/reset` | POST | 验证码+新密码 → 重置 | 公开 |
| `/api/user/me` | GET | 获取当前用户信息 | 需登录 |
| `/api/user/config` | PUT | 更新用户配置 | 需登录 |
| `/api/ai/generate` | POST | AI 生成（Pro 专属） | Pro |

### 请求/响应示例

**注册**：
```json
// POST /api/auth/register
{ "email": "parent@example.com", "password": "SecurePass123!" }
// 201 { "message": "验证码已发送", "email": "parent@example.com" }

// POST /api/auth/verify
{ "email": "parent@example.com", "code": "384721" }
// 200 { "message": "邮箱验证成功", "token": { "access": "...", "refresh": "..." } }
```

**登录**：
```json
// POST /api/auth/login
{ "email": "parent@example.com", "password": "SecurePass123!" }
// 200 { "token": { "access": "eyJ...", "refresh": "dGhp..." }, "user": { "id": "...", "email": "...", "tier": "free" } }
```

## 7. 前端组件结构

```
src/
├── context/AuthContext.tsx         # 全局认证状态（user, login, logout, isAuthenticated）
├── components/
│   ├── auth/LoginModal.tsx         # 登录弹窗（邮箱 + 密码）
│   ├── auth/RegisterModal.tsx      # 注册弹窗 → 验证码 → 完成
│   ├── auth/ForgotPasswordModal.tsx# 忘记密码
│   └── auth/PaywallModal.tsx       # 升级会员拦截弹窗
├── hooks/useAuth.ts                # useAuth() hook
├── services/auth.ts                # API 调用封装
├── utils/jwt.ts                    # JWT 解析/存储
└── guards/RequireTier.tsx          # 路由守卫组件
```

### AuthContext 接口

```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verify: (code: string) => Promise<void>;
  resendCode: () => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  tier: 'free' | 'plus' | 'pro';
  email_verified: boolean;
}
```

### 会员拦截

```tsx
// 使用示例
<RequireTier tier="plus">
  <PracticeView />
</RequireTier>
```

`RequireTier` 逻辑：
- 未登录 → 弹出 LoginModal
- 登录但 tier 不足 → 弹出 PaywallModal（显示升级权益对比）

## 8. 邮件服务

使用 **SendGrid**（Cloudflare 原生支持好，免费额度 100 封/天）。

验证码邮件内容：
```
拾艺院 邮箱验证

您的验证码是：384721

该验证码 10 分钟内有效。如非本人操作，请忽略此邮件。
```

Secrets：`SENDGRID_API_KEY`、`SENDGRID_FROM_EMAIL`、`JWT_SECRET`。

## 9. Cloudflare 配置

### wrangler.toml
```toml
name = "school-formula-api"
main = "src/worker/index.ts"
compatibility_date = "2026-09-07"

[[d1_databases]]
binding = "DB"
database_name = "school-formula-db"
database_id = "xxx"

[[kv_namespaces]]
binding = "SESSIONS"
id = "xxx"

[vars]
FRONTEND_URL = "https://school-formula.pages.dev"
```

### 部署
- Workers：`npx wrangler deploy`
- Pages：前端 SPA（GitHub Actions 自动部署或 Pages 直连）
- D1：`npx wrangler d1 create school-formula-db` + `npx wrangler d1 execute`

## 10. 数据迁移策略

**不做迁移**：现有 localStorage 数据（错题本、笔记、进度）保留本地，用户体系从零开始。后续版本再做云端同步。

## 11. 实施顺序

| 阶段 | 内容 | 可独立交付 |
|------|------|-----------|
| 1 | 基础设施：wrangler.toml + D1 建表 + KV + Secrets | ✅ |
| 2 | Workers API：注册/验证码/登录/刷新/用户信息 | ✅ |
| 3 | 前端 Auth：Context + Login/Register/Forgot Modal | ✅ |
| 4 | 会员拦截：PaywallModal + RequireTier + AI API | ✅ |

## 12. 安全考量

- 密码 bcrypt 成本因子 11
- 验证码 6 位数字，10 分钟过期，单邮箱 5 分钟限速
- JWT 密钥 256-bit 随机，存 Secrets Manager
- Refresh Token 轮换：每次刷新生成新 Token，旧 Token 失效
- 登录失败限速：5 次/15 分钟/IP
- CORS：仅允许 Pages 域名
- HTTPS 强制（Cloudflare 默认）

## 13. 后续不在范围

- 支付集成（Stripe/微信/支付宝）
- 多端数据同步（localStorage → D1）
- 社交登录（微信/Google/GitHub）
- 邀请码/推荐系统
- 管理后台
