# 用户体系部署指南

## 前置条件
- Cloudflare 账号
- Wrangler CLI (`npm install -g wrangler`)
- SendGrid 账号（免费 100 封/天）
- 域名（用于 SendGrid 发信验证）

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
# 输入: 至少 32 字符的随机字符串（可用 openssl rand -hex 32 生成）

npx wrangler secret put SENDGRID_API_KEY
# 输入: SG.xxxxx（从 SendGrid 控制台获取）

npx wrangler secret put SENDGRID_FROM_EMAIL
# 输入: noreply@yourdomain.com（需在 SendGrid 验证域名）
```

### 5. 本地开发
```bash
# 启动 Worker（默认 http://localhost:8787）
npx wrangler dev worker/index.ts

# 前端开发服务器（另一个终端）
npm run dev
# Vite 会将 /api 代理到 localhost:8787
```

### 6. 部署 Worker
```bash
npx wrangler deploy
# 部署后 API 地址: https://school-formula-api.your-subdomain.workers.dev
```

### 7. 配置生产环境
在 Cloudflare Pages 设置中添加环境变量：
- `VITE_API_URL` = `https://school-formula-api.your-subdomain.workers.dev`

或在 `wrangler.toml` 中更新：
```toml
[vars]
FRONTEND_URL = "https://school-formula.pages.dev"
ENVIRONMENT = "production"
```

### 8. SendGrid 域名验证
1. 登录 SendGrid 控制台
2. 进入 Settings → Sender Authentication → Domain Authentication
3. 添加你的域名（如 `yourdomain.com`）
4. 按提示在域名 DNS 中添加 TXT/CNAME 记录
5. 验证通过后，`SENDGRID_FROM_EMAIL` 才能正常发信

## 测试清单
- [ ] 注册 → 收到验证码邮件
- [ ] 输入验证码 → 账户激活 → 自动登录
- [ ] 退出 → 重新登录
- [ ] 忘记密码 → 重置
- [ ] Pro 端点返回 403（免费用户）
- [ ] KV 中 refresh token 轮换正常
- [ ] CORS 只允许 Pages 域名

## 文件结构
```
├── wrangler.toml              # Workers 配置
├── worker/
│   ├── index.ts                # 入口 + 路由分发
│   ├── types.ts                # 类型定义
│   ├── lib/
│   │   ├── jwt.ts              # JWT 签名/验证
│   │   ├── password.ts         # PBKDF2 密码哈希
│   │   └── email.ts            # SendGrid 邮件
│   └── routes/
│       ├── auth.ts             # /api/auth/* (8 个端点)
│       ├── user.ts             # /api/user/*
│       └── ai.ts               # /api/ai/* (Pro)
├── db/schema.sql               # D1 表结构
├── src/
│   ├── context/                # AuthProvider + auth-context.ts
│   ├── hooks/useAuth.ts
│   ├── services/auth.ts        # API 封装
│   ├── utils/jwt.ts            # JWT 存储
│   ├── components/auth/        # Login/Register/Forgot/Paywall/UserMenu
│   └── guards/RequireTier.tsx # 会员拦截
└── .env.development / .env.production
```
