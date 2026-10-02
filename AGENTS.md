# AGENTS.md — school-formula / 拾艺院核心知识点库

> 本文件面向 AI 编程助手。读者应假定对该项目一无所知，以下信息均基于仓库当前实际内容整理，不做推断。

---

## 1. 项目概述

`school-formula` 是一个面向家长与学生的**中小学核心知识点学习平台**，品牌名为 **拾艺院 · 核心知识点库**。前端为 React SPA，后端为 Cloudflare Workers（认证/会员/AI 网关），学习数据（知识点、速查表、教程、题库等）以静态 TypeScript 模块形式内置在仓库中。

主要功能模块：

- **知识点库**：按小学 / 初中 / 高中分学段，展示各学科核心知识点，点击可进入详情页。
- **速查表**：提供九九乘法表、除法表、拼音、常用汉字、成语、元素周期表、不规则动词、三角函数公式、物理常数等可打印表格。
- **古籍阅读**：内置《资治通鉴》与《史记》部分篇章，供学生在线阅读。
- **AI 智能助教**：在知识点详情页可调用大模型生成家长辅导指南（深度解析、生活场景、亲子互动、实战测验），通过流式输出展示。

当前仓库源：`git@github.com:dllen/school-formula.git`，默认分支 `main`。

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19.2.0（函数组件 + Hooks） |
| 路由 | React Router 7.11.0（`BrowserRouter`） |
| 语言 | TypeScript 5.9.3 |
| 构建工具 | Vite 7.2.4 |
| 样式 | Tailwind CSS 4.1.17（通过 `@tailwindcss/vite` 插件） |
| Markdown 渲染 | `react-markdown` 10.1.0 |
| AI 调用 | `openai` SDK 6.15.0（在浏览器中直接调用第三方兼容 OpenAI 的 API） |
| 包管理器 | npm（`package-lock.json` **不**纳入版本控制，CI 使用 `npm install`；请勿在 `actions/setup-node` 中启用 `cache: 'npm'`，否则会因找不到锁文件而报错） |

> 测试：统一使用 Vitest。根 `npm test` 通过 `vitest.config.ts` 的 workspace `projects` 跑两份：`app`（happy-dom，src/**） + `scripts`（node，scripts/**）；`scripts/ingest-data` 与 `scripts/pi-agent-edu` 子包各自 `cd scripts/<sub> && npm test`（`vitest run`）独立可用。

### 当前构建/检查状态

- `npm run build`（TypeScript 项目引用编译 + Vite 构建）：✅ 通过
- `npm run lint`（ESLint flat config）：✅ 零错误（含 `scripts/` 下两个子包）
- `npm test`（Vitest）：164 个测试通过（26 个 test files，跨 `app` + `scripts` 两份 workspace project），零 "No test suite found"。

---

## 3. 项目结构

> 此树为精简版；完整结构见 `CLAUDE.md`（含 `src/components/`、`src/data/` 的子目录与 `scripts/ingest-data` 的 adapter 列表）。

```
.
├── .github/workflows/             # CI/CD（deploy.yml 与 deploy-cloudflare.yml）
├── db/schema.sql                  # D1 表结构
├── docs/superpowers/              # 设计 specs 与实现 plans
├── extra-data/                    # 原始数据文件（常用汉字库 2000/3500）
├── public/                        # 静态资源（vite.svg 等）
├── scripts/
│   ├── ingest-data/               # 数据入库侧（确定性 CLI，读 staging 合并进 src/data）
│   └── pi-agent-edu/              # 数据生成侧（pi agent 交互式 CLI，写 staging JSON）
│       ├── cli/{args,output,help}.ts     # 命令行参数解析、输出与帮助
│       ├── wizard/{data,mapping,index}.ts # 引导常量、kindFromTask 映射、runWizard
│       └── session/{types,helpers,class,index}.ts # 会话实现
├── worker/                        # Cloudflare Workers 后端（auth/user/ai 路由）
├── src/
│   ├── assets/                    # 图片/图标资源
│   ├── components/                # React 组件
│   │   ├── CheatSheetCard.tsx
│   │   ├── CheatSheetListItem.tsx
│   │   ├── CheatSheetView.tsx
│   │   ├── GradeSelector.tsx
│   │   ├── Header.tsx
│   │   ├── Home.tsx               # 主页面（包含四个视图的路由/切换）
│   │   ├── KnowledgeDetail.tsx    # 知识点详情 + AI 生成
│   │   ├── KnowledgeList.tsx
│   │   ├── SettingsModal.tsx      # AI 配置弹窗
│   │   ├── ShijiView.tsx          # 史记阅读视图
│   │   ├── SubjectGrid.tsx
│   │   └── ZizhiView.tsx          # 资治通鉴阅读视图
│   ├── data/                      # 静态数据与类型定义
│   │   ├── characters2000.ts
│   │   ├── characters3500.ts
│   │   ├── cheatsheets.ts
│   │   ├── idioms.ts
│   │   ├── knowledge.ts           # 汇总导出 KNOWLEDGE_DATA
│   │   ├── knowledge/             # 分学段知识点数据
│   │   │   ├── primary.ts
│   │   │   ├── middle.ts
│   │   │   └── high.ts
│   │   ├── periodicTable.ts
│   │   ├── shiji.ts
│   │   ├── types.ts               # 核心类型：GradeLevel、KnowledgePoint、Subject、GradeData
│   │   └── zizhi.ts
│   ├── services/
│   │   └── ai.ts                  # AI 配置读写 + 流式生成逻辑
│   ├── App.tsx                    # 路由配置：/ 与 /knowledge/:id
│   ├── main.tsx                   # 应用入口（React 19 createRoot + StrictMode）
│   ├── App.css                    # Vite 模板遗留样式，当前未在 main.tsx 中引入
│   └── index.css                  # 仅包含 @import "tailwindcss";
├── index.html                     # 应用 HTML 入口，title: 拾艺院 - 核心知识点库
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── DEPLOYMENT.md                  # GitHub Pages 部署说明
```

---

## 4. 构建与开发命令

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建产物
npm run preview

# 代码检查
npm run lint

# 运行测试
npm test

# 数据生产（生成/入库分离）
npm run gen:dsl          # pi-agent-edu 引导模式：生成 JSON 到 staging/
npm run ingest           # ingest-data 把 staging/ 合并进 src/data/
npm run ingest:list      # 列出 staging 文件
npm run ingest:dry       # 校验但不写盘
```

构建产物输出到 `dist/` 目录。`build` 脚本会先执行 `tsc -b` 进行 TypeScript 项目引用编译，再由 Vite 打包。

### 数据生产管线

内容数据（教程/题库/知识点/速查表/公式/口算/掌握度/提示词）由两条脚本链路生产：

- **生成侧** `scripts/pi-agent-edu/`：pi agent 交互式 CLI，入口 `index.ts`（约 296 行）只挂 `main()` 交互 REPL；命令解析落在 `cli/args.ts`、提示与写盘落在 `cli/output.ts`、帮助文本落在 `cli/help.ts`；引导常量（学段/科目/年级/任务/难度/题数）在 `wizard/data.ts`，任务→入库 kind 映射在 `wizard/mapping.ts`（`kindFromTask`），引导执行与 prompt 拼装在 `wizard/index.ts`；会话实现拆为 `session/{types,helpers,class,index}.ts`。系统提示词要求输出 8 种「JSON 信封」，`save`/`退出` 写 `staging/<kind>/generated-<ts>.json`。
- **入库侧** `scripts/ingest-data/`：确定性 CLI，读 `staging/<kind>/*.json` → `satisfies` + TypeScript 编译器 API 对 `src/data/*/types.ts` 校验 → 合并 + 接线 `index.ts`/`ALL_*`。零代码执行、只追加不覆盖。

详见 `CLAUDE.md` 的「数据生产管线」小节（含 kind→信封键→数据类型映射表）。

---

## 5. 运行时架构

- **纯静态 SPA**：`index.html` 加载 `src/main.tsx`，React 接管 `#root`。
- **客户端路由**：使用 `BrowserRouter`，路由定义在 `src/App.tsx`：
  - `/` → `Home` 组件（内部通过 `activeView` 状态切换知识点/速查表/资治通鉴/史记）
  - `/knowledge/:id` → `KnowledgeDetail` 组件
- **数据流**：无全局状态管理，组件间状态通过 React `useState` 在 `Home` 等父组件中维护。
- **AI 调用**：`src/services/ai.ts` 使用 `openai` SDK 在浏览器端直接请求用户配置的 API Endpoint（OpenAI / DeepSeek / 智谱 / 自定义）。API Key 仅保存在浏览器 `localStorage`（`school_formula_ai_config`），不会发送到项目方的服务器。
- **注意**：因为 API Key 在浏览器中使用，该设计依赖用户自行保管密钥；不要建议将密钥硬编码进源码。

---

## 5.1 SEO 与预渲染（文档 head 的唯一所有者）

预渲染把每条路由渲染成静态 HTML。页面 `<head>` 的**唯一来源**是 `src/seo/`，按「数据 / 逻辑 / 呈现」分层：

```
src/seo/
├── site.ts     # 站点常量：规范域名 origin、品牌文案、默认语言与 LANGUAGES 列表
├── content.ts  # 路由 → 页面内容策略：视图标题/描述、首页文案、知识点索引与面包屑
├── meta.ts     # buildSeoMeta(path): SeoMeta（唯一派生逻辑：canonical、hreflang、OG/Twitter、JSON-LD）
├── head.ts     # renderHead(meta): string（仅呈现：把 SeoMeta 转成 head HTML，含转义）
└── files.ts    # buildRobotsTxt() / buildSitemap(paths)（站点级文件）
```

- `src/prerender/inject.ts` 的 `injectPage(template, appHtml, headHtml)` 负责最终的文档拼装：用 `renderHead(...)` 的输出替换模板里的 `<title>`，再把 SSR 出的 app HTML 注入 `#root`。
- `src/entry-prerender.ts` 遍历 `PRERENDER_PATHS`，为每条路由生成 head + HTML，并写出 `dist/robots.txt` 与 `dist/sitemap.xml`（287 个 URL）。
- canonical 采用「目录式」URL（非根路径带尾斜杠），与 Worker 的 `/tutorial` → 308 → `/tutorial/` 行为一致。
- 视图标题/描述新增或修改时改 `src/seo/content.ts`；站点域名/品牌改 `src/seo/site.ts`。客户端路由切换不会更新 head（静态页面由预渲染产出，爬虫可见）。
- Worker 侧 `worker/lib/static-paths.ts` 的 `isSeoFile()` 保证 `/robots.txt`、`/sitemap.xml` 缺失时返回 404，而不是被 SPA fallback 换成 app HTML。

## 5.2 多语言与英文站点（/en）

语言由 URL 前缀决定，唯一事实来源是 `src/i18n/languages.ts` 的 `LANGUAGES`：

- `languageForPath(path)`：判断路径属于哪种语言（`/en`、`/en/...` → en；其余 → zh-CN）。
- `appPathFor(path)`：剥离语言前缀，得到应用内路径（`/en/reference/x` → `/reference/x`）。
- 站点文案（品牌名、description、`og:locale`）按语言存放在 `src/seo/site.ts` 的 `BRAND`，通过 `brandFor(language)` 取用。

**英文站点**是刻意收窄的一个面（`/en/` 与 `/en/reference/:slug`），只承载语言中立的可打印速查表（`src/data/reference.ts`），不是整站翻译：

- 组件在 `src/components/reference/`：`ReferenceLayout`（英文页头/页脚）、`ReferenceIndex`（`/en/` 列表）、`ReferencePage`（单表 + 打印）、`PrintButton`。
- 路由在 `src/App.tsx`；预渲染路径由 `src/seo/content.ts` 的 `ENGLISH_REFERENCE_PATHS` 提供，并自动进入 `sitemap.xml`。
- 每个英文页输出 `<html lang="en">` 与 `hreflang="en"` + `x-default`；中文页保持 `zh-CN`，且交替链接不含 `/en`（`src/seo/meta.ts`）。

新增一门语言：在 `LANGUAGES` 加一项、在 `BRAND` 加对应文案，并在 `resolvePageContent` 增加该语言的内容分支。

## 5.3 语言入口与广告（AdSense）

**语言入口**：`src/components/Header/LanguageSwitcher.tsx` 在顶栏与移动端菜单提供进入英文站点的链接（`/en`）；英文站点的 `ReferenceLayout` 提供反回 `/` 的 `中文` 链接。中文页面的 head（SEO 输出）不因此改变。

**广告**由 `src/ads/` 单一负责：

- `config.ts`：发布商 id `ADSENSE_CLIENT_ID`（默认真实 `ca-pub-3563451416072185`，可用 `VITE_ADSENSE_CLIENT_ID` 覆盖）与三处广告位 `AD_SLOTS`（可用 `VITE_ADSENSE_SLOT_*` 覆盖；默认值为占位 id，上线前需替换为 AdSense 后台的真实广告单元 id）。
- `adsense.ts`：`ensureAdSenseScript()` 按需注入 AdSense 脚本，每文档仅一次；`pushAd()` 每个 `<ins>` 仅推送一次（StrictMode 重挂载安全）。
- `AdUnit.tsx`：`<AdUnit placement="..." />`。仅在配置齐全时渲染；预留最小高度避免布局偏移；plus/pro 会员不展示（隐藏并跳过推送）。

广告**只出现在内容页**：知识点详情页两处（`knowledgeMid` / `knowledgeBottom`）、英文速查表页一处（`referenceBottom`）。首页、各视图列表页、`/en/` 索引页均无广告。新增广告位：在 `AD_SLOTS` 加一项，并在目标内容组件放置 `<AdUnit>`。

## 6. 代码风格与开发约定

### 6.1 TypeScript

- 严格模式已启用（`strict: true`）。
- 项目使用 TypeScript 项目引用：`tsconfig.json` 引用 `tsconfig.app.json`（应用代码，`include: ["src"]`）和 `tsconfig.node.json`（构建配置，`include: ["vite.config.ts"]`）。
- 允许直接导入 `.ts`/`.tsx` 扩展名（`allowImportingTsExtensions: true`），配合 `noEmit: true`。
- 要求 `verbatimModuleSyntax: true`，导入类型时请使用 `import type { ... }` 或 `import { type ... }`。
- 未使用的局部变量/参数会报错（`noUnusedLocals`、`noUnusedParameters`）。

### 6.2 ESLint

- 顶层单一 ESLint 9 flat config（`eslint.config.js`）；`scripts/` 下不再有子包各自的配置文件。
- 配置扩展：
  - `@eslint/js` recommended
  - `typescript-eslint` recommended
  - `eslint-plugin-react-hooks` recommended
  - `eslint-plugin-react-refresh` vite preset
- 路径覆盖：
  - `src/**/*.{ts,tsx}`：browser globals + `react-hooks` / `react-refresh`。
  - `scripts/**/*.ts`：Node globals；关闭 `react-hooks/rules-of-hooks`、`react-hooks/exhaustive-deps`、`react-refresh/only-export-components`；`@typescript-eslint/no-explicit-any` 降为 warn。
  - `scripts/**/*.test.ts`：`@typescript-eslint/no-explicit-any` 关闭。
- 仅检查 `**/*.{ts,tsx}`，`dist/` 与 `scripts/*/node_modules/**` 被忽略。
- 运行命令：`npm run lint`（一次跑通主应用与两个子包）。

### 6.3 样式

- 使用 Tailwind CSS v4，通过 `src/index.css` 中的 `@import "tailwindcss";` 引入。
- 组件内直接写 Tailwind 工具类；少量自定义样式在 `App.css` 中，但该文件当前未被引入（Vite 模板遗留）。
- UI 文本以简体中文为主，面向中小学家长与学生。

### 6.4 组件与数据约定

- 组件文件默认以命名导出（named export）形式导出组件，例如 `export const Home = () => ...`。
- 数据文件集中放在 `src/data/`，类型定义在 `src/data/types.ts`。
- 知识点 ID 需要全局唯一，作为路由参数 `/knowledge/:id` 使用。
- 新增知识点时，应同步更新对应学段的数据文件（`primary.ts` / `middle.ts` / `high.ts`），并确保 ID 不重复。

---

## 7. 部署流程

项目通过 **GitHub Pages** 自动部署：

1. 触发条件：
   - `main` 分支收到 `push`
   - 或手动通过 GitHub Actions UI 触发 `workflow_dispatch`
2. 两个工作流（`.github/workflows/deploy.yml` 与 `.github/workflows/deploy-cloudflare.yml`）均使用 Node.js 22（LTS）：
   - `npm install`（`package-lock.json` 不在版本控制中，因此两个 workflow 都**不**配置 `cache: 'npm'`，避免 `actions/setup-node` 因找不到锁文件而报错）
   - `npm run build`
   - `deploy.yml` 将 `dist/` 推送到 `gh-pages` 分支；`deploy-cloudflare.yml` 将前端部署到 Cloudflare Workers
3. GitHub Pages 源应配置为 `gh-pages` 分支的根目录。

> **`base` 路径注意**：`vite.config.ts` 的 `base` 为 `'/'`（适配 Cloudflare Workers + 自有域名的主部署）。GitHub Pages 备用链路若以项目页形式访问（`https://dllen.github.io/school-formula/`）会静态资源 404，需改 `base` 或配自定义域名，详见 `DEPLOYMENT.md` 第 2 节。

---

## 8. 安全注意事项

- **API Key 存储在浏览器本地**：AI 配置（包括 API Key）保存在 `localStorage`，属于客户端风险区域。不要建议用户将生产级密钥长期存储在此处，也不要在后端代理未建立的情况下将密钥提交到仓库。
- **无后端认证/授权**：应用本身没有登录、权限、CORS 代理或数据持久化服务。
- **无输入校验框架**：AI 配置表单仅做基础 UI 输入，未对 URL、模型名做严格校验。
- **静态数据不可变**：所有学习内容都是打包进 bundle 的静态模块，没有运行时数据库或 API 拉取。

---

## 9. 已知限制与可改进点

- 没有端到端测试覆盖「生成 → staging → 入库」的完整链路（需真实 pi 模型/鉴权，当前仅各侧单测）。
- `App.css` 是模板遗留文件，当前未被引用，可考虑删除或合并到 `index.css`。
- GitHub Pages 备用链路的 `base` 路径仅适配自定义域名/根路径部署（见第 7 节）。
- 古籍阅读模块目前只包含少量示例章节，可继续扩展 `src/data/zizhi.ts` 与 `src/data/shiji.ts`。

---

## 10. 快速上手（给 AI 助手的检查清单）

修改代码前建议先执行：

```bash
npm install
npm run lint
npm run build
```

如果修改涉及路由、数据类型或新增组件：

1. 检查 `src/data/types.ts` 是否需要调整。
2. 若新增视图，在 `src/App.tsx` 添加路由或在 `src/components/Home.tsx` 的 `ViewType` 与渲染分支中处理。
3. 若新增 AI 相关功能，确认 `src/services/ai.ts` 中的 prompt / provider 配置是否匹配需求。
4. 构建成功后，可通过 `npm run preview` 在本地验证生产效果。
