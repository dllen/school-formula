# 拾艺院 · 核心知识点库

面向家长与学生的**中小学核心知识点学习平台**。前端 React SPA + Cloudflare Workers 后端，学习数据以静态 TypeScript 模块内置在仓库中。

- **生产域名**：`syy.global`（另有 `syy.mobi`、`syy.one`）
- **仓库**：`git@github.com:dllen/school-formula.git`，默认分支 `main`

## 功能模块

- **知识点库**：按小学 / 初中 / 高中分学段，分学科展示核心知识点，点击进入详情页。
- **教程 / 题库**：结构化教程单元（教/学/练）与分学段题库，支持练习与错题本。
- **速查表**：九九乘法表、常用汉字、成语、元素周期表、三角函数公式等可打印表格。
- **掌握度**：解题技巧（techniques）+ 进度追踪 + 题目生成器。
- **古籍阅读**：内置《资治通鉴》与《史记》部分篇章。
- **AI 智能助教**：知识点详情页可调用大模型生成家长辅导指南（深度解析 / 生活场景 / 亲子互动 / 实战测验）。
- **会员体系**：free / plus / pro 三级（AI 调用配额：plus 50 次/天，pro 无限）。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router 7 |
| 后端 | Cloudflare Workers（认证 / 会员 / AI 网关） |
| 数据库 | Cloudflare D1（SQLite） |
| 会话 | Cloudflare KV |
| AI | `openai` SDK（直连）或 Worker `/api/ai/gateway`（Cloudflare AI Gateway 代理） |

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器（http://localhost:5173）
npm run build        # 类型检查 + 生产构建（输出 dist/）
npm run preview      # 预览生产构建
npm run lint         # ESLint 代码检查
npm test             # 运行测试（Vitest）
```

Worker 本地开发（前端通过 `vite.config.ts` 的 proxy 把 `/api` 代理到 8787）：

```bash
npx wrangler dev worker/index.ts
```

## 数据生产管线

学习内容数据（教程 / 题库 / 知识点 / 速查表 / 公式 / 口算 / 掌握度 / 提示词）由两条脚本链路生产，**生成与入库分离**：

```bash
npm run gen:dsl        # pi-agent-edu 引导模式：生成 JSON 到 staging/
npm run ingest         # ingest-data 把 staging/ 合并进 src/data/
npm run ingest:list    # 列出 staging 文件
npm run ingest:dry     # 校验但不写盘
```

- **生成侧** `scripts/pi-agent-edu/`：pi agent 交互式 CLI，系统提示词要求输出 8 种「JSON 信封」，`save`/`退出` 写入 `staging/<kind>/generated-<timestamp>.json`。
- **入库侧** `scripts/ingest-data/`：确定性 CLI，读取 `staging/<kind>/*.json`，用 `satisfies` + TypeScript 编译器 API 对 `src/data/*/types.ts` 真实类型做校验，再合并进 `src/data/` 并接线 `index.ts`/`ALL_*`。零代码执行、只追加不覆盖。

详见 `CLAUDE.md` 的「数据生产管线」小节。

## 部署

- **Cloudflare Workers**：push 到 `main` 或手动触发 `.github/workflows/deploy-cloudflare.yml`，把 `dist/` 作为静态资源 + Worker 提供 `/api/*`。
- **GitHub Pages**（备用）：`.github/workflows/deploy.yml` 推送到 `gh-pages` 分支。

## 更多文档

- `CLAUDE.md` — 面向 Claude Code 的项目指引（架构、数据层、开发约定、环境变量）。
- `AGENTS.md` — 面向 AI 编程助手的项目说明。
- `docs/superpowers/specs/` — 设计文档；`docs/superpowers/plans/` — 实现计划。
