# 部署指南

本项目有两条部署链路，均由 GitHub Actions 在 `main` 分支 push（或手动 `workflow_dispatch`）时触发：

| 链路 | 工作流 | 定位 |
|------|--------|------|
| **Cloudflare Workers**（主） | `.github/workflows/deploy-cloudflare.yml` | 生产环境：静态前端 + `/api/*` 后端 + D1/KV |
| **GitHub Pages**（备用/遗留） | `.github/workflows/deploy.yml` | 纯静态前端备份，无后端能力 |

> 两个工作流都使用 Node.js 22 + `npm install`。项目刻意不跟踪 `package-lock.json`（见 `.gitignore`），因此 **`actions/setup-node` 不能开 `cache: 'npm'`**，否则会因找不到锁文件报错。

---

## 1. Cloudflare Workers（主部署）

### 工作流步骤

`deploy-cloudflare.yml` 依次执行：

1. `npm install` → `npm run build`（`tsc -b && vite build`，产物在 `dist/`）
2. `wrangler d1 migrations apply school-formula-db --remote`（D1 迁移）
3. `wrangler deploy`（部署 Worker；`wrangler.toml` 的 `[site] bucket = "./dist"` 把前端静态资源一并发布）

### 所需 GitHub Secrets

| Secret | 用途 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | wrangler-action 鉴权（需 Workers/D1/KV 编辑权限） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `VITE_GA4_ID` | GA4 测量 id（`G-XXXXXXXX`）。**构建期**变量，由 `deploy-cloudflare.yml` 的 Build 步骤注入；不配就不注入分析标签，构建照常成功 |

> `VITE_GA4_ID` 必须在**构建时**给：`VITE_*` 是 Vite 在打包阶段做字面替换的，运行时再设没有任何作用。本地想让构建带上 GA4，就在 `.env.production` 里填 `VITE_GA4_ID=G-XXXXXXXX`（仓库里留的是注释占位）。

### `wrangler.toml` 要点

- **Worker 名称**：`school-formula-api`，入口 `worker/index.ts`，`compatibility_flags = ["nodejs_compat"]`
- **路由**：`api.syy.global/*`、`api.syy.mobi/*`、`api.syy.one/*`（API 子域；站点本体 `syy.global` / `syy.mobi` / `syy.one` 的静态资源由 `[site]` 静态托管能力提供）
- **绑定**：D1 `DB`（`school-formula-db`）、KV `SESSIONS`
- **变量**（`[vars]`）：`FRONTEND_URL`、`ALLOWED_ORIGINS`（CORS 白名单，逗号分隔三个站点域名）、`FROM_EMAIL`、`AI_GATEWAY_BASE` / `AI_GATEWAY_TOKEN` / `AI_GATEWAY_MODEL`、`ENVIRONMENT`
- **Secrets**（`wrangler secret put`）：`JWT_SECRET`（≥32 字符随机串，`openssl rand -hex 32`）

### 首次初始化

```bash
# 1. 创建 D1 / KV（把返回的 id 填入 wrangler.toml）
npx wrangler d1 create school-formula-db
npx wrangler kv:namespace create SESSIONS

# 2. 初始化表结构
npx wrangler d1 execute school-formula-db --remote --file=db/schema.sql

# 3. 设置 secrets
npx wrangler secret put JWT_SECRET

# 4. 部署
npx wrangler deploy
```

用户体系（邮件验证码、AI 网关等）的详细配置见 [DEPLOY_AUTH.md](DEPLOY_AUTH.md)。

---

## 2. GitHub Pages（备用/遗留）

`deploy.yml` 把 `dist/` 推送到 `gh-pages` 分支。仓库 Settings → Pages → Source 选 `gh-pages` 分支根目录即可。

> **注意 `base` 路径**：`vite.config.ts` 当前 `base: '/'`。若以项目页形式访问（`https://dllen.github.io/school-formula/`），静态资源路径会 404 —— 需要把 `base` 改为 `'/school-formula/'` 重新构建，或为 gh-pages 配置自定义域名。主部署（Cloudflare Workers + 自有域名）不受此影响。

GitHub Pages 链路**只含静态前端**：认证 / 会员 / AI 网关等 `/api/*` 能力不可用（前端会按 `src/services/api-base.ts` 的域名推导规则去找 API 域名）。

---

## 3. 前端 API 地址解析

前端不硬编码 API 地址，由 `src/services/api-base.ts` 统一解析：

```
VITE_API_BASE（显式覆盖）> VITE_API_URL（旧/开发）> 按域名推导
```

- 开发：`.env.development` 设 `VITE_API_URL=http://localhost:8787`（`wrangler dev` 默认端口；`vite.config.ts` 同时配了 `/api` proxy）
- 生产：`.env.production` 为空，按站点域名推导（`syy.global` → `api.syy.global`，以此类推）
- localhost 兜底：`http://localhost:8787`
