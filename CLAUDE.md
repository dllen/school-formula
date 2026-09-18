# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

`school-formula`（品牌名：**拾艺院 · 核心知识点库**）是一个面向家长与学生的**中小学核心知识点学习平台**。纯前端 SPA + Cloudflare Workers 后端，无传统服务器。

- **仓库**：`git@github.com:dllen/school-formula.git`，默认分支 `main`
- **生产域名**：`syy.global`（另有 `syy.mobi`、`syy.one` 多域名）
- **技术栈**：React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router 7 + Cloudflare Workers/D1/KV

## 常用命令

```bash
# 安装依赖（使用 package-lock.json 锁定版本）
npm install

# 前端开发服务器（Vite，默认 http://localhost:5173）
npm run dev

# TypeScript 类型检查 + 生产构建（输出到 dist/）
npm run build

# 预览生产构建
npm run preview

# 代码检查（ESLint 9 flat config）
npm run lint

# 运行测试（Vitest）
npm test
npm run test:watch
npm run coverage

# 数据生产（pi-agent-edu 生成 → staging/ → ingest-data 入库）
npm run gen:dsl          # 启动引导模式（8 种任务类型，生成 JSON 到 staging/）
npm run ingest           # 把 staging/ 合并进 src/data/（校验 + 合并 + 接线）
npm run ingest:list      # 列出 staging 文件
npm run ingest:dry       # 校验但不写盘
```

### Worker 本地开发

```bash
# 启动 Worker（默认 http://localhost:8787）
npx wrangler dev worker/index.ts

# 部署 Worker
npx wrangler deploy

# 执行 D1 迁移
npx wrangler d1 execute school-formula-db --file=db/schema.sql
```

> 前端 Vite 开发服务器通过 `vite.config.ts` 中的 proxy 将 `/api` 代理到 `localhost:8787`。

## 架构概览

### 前后端分离

| 层级 | 技术 | 部署 |
|------|------|------|
| 前端 SPA | React 19 + Vite + Tailwind | Cloudflare Workers（`dist/` 作为静态资源） |
| 后端 API | Cloudflare Workers | `school-formula-api` Worker |
| 数据库 | Cloudflare D1（SQLite） | `school-formula-db` |
| 会话存储 | Cloudflare KV | `SESSIONS` 命名空间 |
| AI 代理 | Cloudflare AI Gateway | 外部服务（DeepSeek 等） |

### 前端架构

```
src/
├── components/          # React 组件（按功能分子目录）
│   ├── auth/            # 登录/注册/忘记密码/会员拦截
│   ├── Header/          # 导航栏（Logo、NavMenu、MobileNav、UserMenu）
│   ├── practice/        # 练习系统（QuestionCard、ErrorBook、PracticeResult 等）
│   ├── prompts/         # 提示词库（PromptCard、PromptDetail、PromptModal 等）
│   └── tutorials/       # 教程组件（TutorialUnitDetail、TutorialLearnTab 等）
├── context/             # AuthContext + auth-context.ts（useAuth hook）
├── hooks/               # 自定义 hooks
│   ├── useAuth.ts       # 认证消费 hook
│   ├── useLearningProgress.ts  # 学习进度（localStorage: school_formula_progress）
│   ├── useTopicMastery.ts      # 专题掌握度（localStorage: school_formula_topic_mastery）
│   └── useErrorBook.ts         # 错题本（localStorage: school_formula_error_book）
├── data/                # 静态数据（知识点、题库、速查表、古籍、提示词模板等）
│   ├── knowledge/       # 分学段知识点（primary/middle/high，按学科分子文件）
│   ├── questions/       # 题库（按学科分文件）
│   ├── tutorials/       # 教程内容（按学科分文件）
│   ├── mastery/         # 掌握度系统（techniques、progress、qgen 题目生成器）
│   └── prompts/         # 提示词模板库（按场景分类：explain/generate/assess/plan 等）
├── services/
│   ├── ai.ts            # AI 调用（直连 OpenAI/DeepSeek/智谱 或 gateway 代理）
│   ├── gateway.ts       # Worker /api/ai/gateway 代理调用（SSE 流式解析）
│   └── auth.ts          # 认证 API 封装
├── guards/
│   └── RequireTier.tsx  # 会员等级拦截（free/plus/pro）
├── utils/
│   ├── jwt.ts           # JWT token 存储/读取
│   └── questionUtils.ts # 题库工具函数
├── App.tsx              # 路由配置（/ 和 /knowledge/:id）
└── main.tsx             # 应用入口（AuthProvider + BrowserRouter）
```

### 后端架构（Cloudflare Workers）

```
worker/
├── index.ts             # 入口：路由分发 + CORS + 静态资源服务
├── types.ts             # Env 接口、UserRow、TokenPair 等类型
├── lib/
│   ├── jwt.ts           # JWT 签名/验证（HS256，Web Crypto API）
│   ├── password.ts      # PBKDF2 密码哈希（100000 轮 SHA-256）
│   └── email.ts         # 邮件发送（Cloudflare MailChannels，免费 3000 封/月）
├── routes/
│   ├── auth.ts          # /api/auth/*（register/login/refresh/logout/forgot/reset）
│   ├── user.ts          # /api/user/*（me/config）
│   └── ai.ts            # /api/ai/*（gateway 代理 + 配额管理）
└── migrations/
    └── 0001_ai_quota.sql
```

### 认证架构

- **JWT**：HS256 签名，15 分钟有效期，存储在 localStorage
- **Refresh Token**：32 字节随机，SHA-256 哈希后存 D1 `sessions` 表，7 天有效期，每次刷新轮换
- **密码**：PBKDF2（100000 轮 SHA-256）+ 16 字节随机盐
- **注册**：免邮箱验证，注册即登录（方案 2）
- **多标签页同步**：通过 `storage` 事件同步登录/登出状态
- **并发刷新排队**：多个请求同时 401 时只发一次 refresh

### AI 调用架构

两种模式：

1. **直连模式**：浏览器端通过 `openai` SDK 直接调用用户配置的 API（OpenAI/DeepSeek/智谱/自定义），API Key 存 localStorage
2. **Gateway 模式**：前端 → Worker `/api/ai/gateway` → Cloudflare AI Gateway → DeepSeek，Worker 负责 JWT 验证、配额管理、SSE 流式透传

**配额**：plus 50 次/天，pro 无限，free 无权限

### 会员体系

| 等级 | AI 调用 | 功能 |
|------|---------|------|
| free | 无 | 基础浏览 |
| plus | 50 次/天 | AI 功能 |
| pro | 无限 | 全部功能 |

## 路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Home` | 主页面，通过 `activeView` 状态切换 10 个视图 |
| `/knowledge/:id` | `KnowledgeDetail` | 知识点详情 + AI 生成 |

`Home` 组件的 `ViewType`：`knowledge` | `tutorial` | `cheatsheet` | `mental-math` | `formula` | `mastery` | `practice` | `notes` | `zizhi` | `shiji`

URL 参数：`?view=practice&kp=p-math-1` 可直接定位到特定视图和知识点。

## 数据层

### 静态数据（打包进 bundle）

- **知识点**：`src/data/knowledge/` 按学段（primary/middle/high）和学科分文件，汇总导出 `KNOWLEDGE_DATA`
- **题库**：`src/data/questions/` 按学科分文件，支持选择题、填空题、判断题
- **教程**：`src/data/tutorials/` 按学科分文件，包含教学目标、讲解、例题、互动、练习
- **提示词模板**：`src/data/prompts/` 按场景分类（explain/generate/assess/plan/error-analysis/derivation/explore/interaction）
- **掌握度**：`src/data/mastery/` 包含 techniques（解题技巧）、progress（进度追踪）、qgen（题目生成器）

### 运行时数据（localStorage）

| Key | 用途 |
|-----|------|
| `school_formula_ai_config` | AI 配置（provider/apiKey/baseUrl/model） |
| `school_formula_progress` | 学习进度（答题数、正确率、连续天数） |
| `school_formula_topic_mastery` | 专题掌握度（按知识点独立记录） |
| `school_formula_error_book` | 错题本 |
| `school_formula_access_token` | JWT access token |
| `school_formula_refresh_token` | Refresh token |

### 数据库（Cloudflare D1）

表结构定义在 `db/schema.sql`：`users`、`email_verifications`、`sessions`、`subscriptions`、`login_logs`、`ai_quota`

### 数据生产管线（生成/入库分离）

教程、题库、知识点、速查表、公式、口算、掌握度、提示词等数据由两条独立脚本链路生产，**生成与入库分离**：

1. **生成侧** `scripts/pi-agent-edu/`：交互式 CLI，通过 pi agent（`@earendil-works/pi-coding-agent` SDK）生成内容。系统提示词要求输出「JSON 信封」（8 种，键名固定），`save`/`退出` 写入 `staging/<kind>/generated-<timestamp>.json`。
2. **入库侧** `scripts/ingest-data/`：确定性 CLI（`npm run ingest`），读取 `staging/<kind>/*.json`，用 `satisfies` + TypeScript 编译器 API 对 `src/data/*/types.ts` 真实类型做校验，再合并进 `src/data/` 并接线 `index.ts`/`ALL_*`。零代码执行、只追加不覆盖。

`staging/`（已 .gitignore）按 kind 分目录：

| kind（目录） | 信封键 | 数据类型 |
|--------------|--------|----------|
| `tutorials` | `tutorial` | `Tutorial`（单元含 10 道 practice 题，难度 easy/medium/hard） |
| `questions` | `questions` | `Question[]`（独立题库，难度 basic/intermediate/advanced，含 stem/tags/knowledgePointIds） |
| `knowledge` | `knowledgePoints`（+`grade`+`subject`） | `KnowledgePoint[]` |
| `cheatsheets` | `cheatsheets` | `CheatSheet[]` |
| `formulas` | `formulas` | `Formula[]` |
| `mental-math` | `mnemonics`（+`grade`） | `MentalMathMnemonic[]` |
| `techniques` | `techniques` | `Technique[]` |
| `prompts` | `prompts` | `PromptTemplate[]` |

> 端到端流程：`npm run gen:dsl` 生成 → `save` 写 `staging/` → `npm run ingest` 入库。入库脚本与生成器无关，任何来源产生的规范 JSON 都能入库。两个脚本各有一套测试（`node --import tsx --test`），独立于主应用。

## 部署

### Cloudflare Workers（主部署）

- **触发**：push 到 `main` 分支或手动 `workflow_dispatch`
- **工作流**：`.github/workflows/deploy-cloudflare.yml`
- **步骤**：npm install → npm run build → wrangler deploy
- **前端**：`dist/` 作为 Worker 静态资源（`[site] bucket = "./dist"`）
- **API**：Worker 同时服务前端静态资源和 `/api/*` 路由

### GitHub Pages（备用/遗留）

- **工作流**：`.github/workflows/deploy.yml`
- **步骤**：npm ci → npm run build → 推送到 `gh-pages` 分支

> **注意**：`vite.config.ts` 的 `base` 为 `'/'`，`DEPLOYMENT.md` 声称已配置 `base: '/school-formula/'`，实际未配置。若以项目页形式部署需修改。

## 开发约定

### TypeScript

- 严格模式（`strict: true`）
- 项目引用：`tsconfig.json` → `tsconfig.app.json`（src）+ `tsconfig.node.json`（vite.config.ts）
- `verbatimModuleSyntax: true`：导入类型必须用 `import type { ... }`
- `allowImportingTsExtensions: true` + `noEmit: true`
- `noUnusedLocals` + `noUnusedParameters`：未使用变量会报错

### ESLint

- ESLint 9 flat config（`eslint.config.js`）
- 扩展：`@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` + `react-refresh`
- 仅检查 `**/*.{ts,tsx}`，`dist/` 被忽略

### 组件约定

- 命名导出（named export）：`export const Home = () => ...`
- 数据文件集中在 `src/data/`，类型定义在对应 `types.ts`
- 知识点 ID 全局唯一，作为路由参数 `/knowledge/:id`

### 样式

- Tailwind CSS v4，通过 `@import "tailwindcss";` 引入
- UI 文本以简体中文为主

## 环境变量

### 前端（`.env.development` / `.env.production`）

| 变量 | 说明 |
|------|------|
| `VITE_API_URL` | API 地址（开发环境 `http://localhost:8787`） |
| `VITE_API_BASE` | API 基础地址（生产环境按域名推导） |

### Worker（`wrangler.toml` `[vars]`）

| 变量 | 说明 |
|------|------|
| `FRONTEND_URL` | 前端 URL（`https://syy.global`） |
| `ALLOWED_ORIGINS` | CORS 允许的源（逗号分隔） |
| `AI_GATEWAY_BASE` | Cloudflare AI Gateway Base URL |
| `AI_GATEWAY_TOKEN` | AI Gateway 鉴权 Token |
| `AI_GATEWAY_MODEL` | 默认模型（`deepseek-chat`） |
| `FROM_EMAIL` | 发件地址（`noreply@syy.global`） |
| `ENVIRONMENT` | 环境标识（`production`） |

### Worker Secrets

| Secret | 说明 |
|--------|------|
| `JWT_SECRET` | JWT 签名密钥（至少 32 字符） |

## 多域名架构

生产环境支持三个域名，API 域名按域名自动推导：

| 站点域名 | API 域名 |
|----------|----------|
| `syy.global` | `api.syy.global` |
| `syy.mobi` | `api.syy.mobi` |
| `syy.one` | `api.syy.one` |

Worker 通过 `routes` 配置将 `api.syy.global/*`、`api.syy.mobi/*`、`api.syy.one/*` 路由到同一 Worker。

## 安全注意事项

- **API Key 存储**：直连模式下 API Key 存 localStorage，gateway 模式下由 Worker 保管
- **JWT 安全**：access token 15 分钟过期，refresh token 7 天过期且每次轮换
- **密码安全**：PBKDF2 100000 轮 SHA-256 + 随机盐
- **CORS**：Worker 端校验 Origin，仅允许配置的域名
- **无输入校验框架**：AI 配置表单仅做基础 UI 输入
