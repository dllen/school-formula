# AGENTS.md — school-formula / 拾艺院核心知识点库

> 本文件面向 AI 编程助手。读者应假定对该项目一无所知，以下信息均基于仓库当前实际内容整理，不做推断。

---

## 1. 项目概述

`school-formula` 是一个面向家长与学生的**中小学核心知识点学习平台**，品牌名为 **拾艺院 · 核心知识点库**。前端为 React SPA，后端为 Cloudflare Workers（认证/会员/AI 网关），学习数据（知识点、速查表、教程、题库等）以静态 TypeScript 模块形式内置在仓库中。

主要功能模块（入口都在 `Home` 的视图路由里，另有详情页与英文站）：

- **知识点库**：按小学 / 初中 / 高中分学段、分学科展示知识点，进入详情页可看系统教程、例题、练习与趣味角。
- **教程 / 题库练习**：结构化教程单元（教 / 学 / 练）与专题练习，带进度、错题本与掌握度。
- **速查表 / 公式 / 口算**：可打印的表格与公式、速算口诀。
- **古诗词 / 古籍阅读**：古诗词浏览与阅读，《资治通鉴》《史记》章节阅读。
- **AI 智能助教**：知识点详情页的家长辅导指南、经典阅读的 AI 解读，以及独立的 AI 对话页（会话历史存在本地）。
- **学习笔记**：本地保存的学习笔记（`localStorage`）。
- **小学语文**：`/yuwen` 下人教版 1–5 年级 10 册 / 326 课 / 2988 个生字，含拼音表、多音字、单元生字复习、可打印听写单，以及单字的笔顺 / 读音 / 同音字 / 字形 / 组词。
- **英文站**：`/en` 下语言中立的可打印速查表。

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
- `npm test`（Vitest）：630 个测试通过（116 个 test files，跨 `app` + `scripts` 两份 workspace project），零 "No test suite found"。
- `npm run lint` 的忽略列表包含第三方 submodule `.claude/**`（其自带构建，不归本仓库检查）。

---

## 3. 项目结构

> 此树为精简版；完整结构见 `CLAUDE.md`（含 `src/components/`、`src/data/` 的子目录与 `scripts/ingest-data` 的 adapter 列表）。

```
.
├── .github/workflows/             # CI/CD（deploy.yml 与 deploy-cloudflare.yml）
├── db/schema.sql                  # D1 表结构
├── design.md                      # 锁定的 UI 设计系统（shape / theme / 控件 / 表面 / 动效）
├── docs/
│   ├── ui-system.md               # UI 施工指南：页面骨架 / 组件原语 / 检查清单 / 陷阱
│   ├── adsense.md / cloudflare-ai.md / email.md / seo/
│   └── superpowers/               # 设计 specs 与实现 plans
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
│   ├── components/                # React 组件（按功能分子目录）
│   │   ├── Header/                # Logo / NavMenu / MobileNav / UserMenu / LanguageSwitcher
│   │   ├── KnowledgeDetail/       # 知识点详情 + 教程 / 练习 / 趣味角 / AI 生成
│   │   ├── AIChatView/            # AI 助教对话（会话列表 / 消息区 / 气泡）
│   │   ├── practice/ tutorials/ poetry/ prompts/ reference/ auth/ legal/
│   │   ├── Home.tsx               # 主页面：11 个视图的路由/切换
│   │   ├── yuwen/                 # 小学语文（/yuwen）：9 个页面 + 原语（田字格/拼音开关/朗读/笔顺/组词）
│   │   ├── KnowledgeList.tsx / SubjectGrid.tsx / GradeSelector.tsx
│   │   ├── CheatSheet*.tsx / FormulaView.tsx / MentalMathView.tsx / NotesView.tsx
│   │   ├── Mastery*View.tsx / TutorialView.tsx / ZizhiView.tsx / ShijiView.tsx
│   │   ├── Footer.tsx / AuthModal.tsx / SettingsModal.tsx / HtmlSitemap.tsx
│   │   └── icons/                 # Icon.tsx（统一图标集）+ iconFor.ts（数据 emoji 映射）
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
│   │   ├── yuwen/                 # 小学语文数据：生成文件 + 手写查询层（scripts 生成，勿手改生成文件）
│   │   ├── shiji.ts
│   │   ├── types.ts               # 核心类型：GradeLevel、KnowledgePoint、Subject、GradeData
│   │   └── zizhi.ts
│   ├── yuwen/                     # paths.ts：/yuwen 路由常量与 3878 条预渲染路径
│   ├── services/                  # ai.ts / gateway.ts / auth.ts
│   ├── styles/                    # 设计系统：tokens.css + base.css + ui.css
│   ├── utils/                     # jwt / questionUtils / markdown（渲染前剥离标题 emoji）
│   ├── App.tsx                    # 路由配置
│   ├── main.tsx                   # 应用入口（React 19 createRoot + StrictMode）
│   ├── App.css                    # Vite 模板遗留样式，当前未在 main.tsx 中引入
│   └── index.css                  # 入口：Hallmark stamp + @import（tailwindcss → tokens → base → ui）
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
  - `/` 与 11 个视图路径（`/tutorial`、`/cheatsheet`、`/mental-math`、`/formula`、`/mastery`、`/practice`、`/notes`、`/zizhi`、`/shiji`、`/ai-chat`、`/poetry`）→ `Home` 组件，按路径切换视图
  - `/knowledge/:id` → `KnowledgeDetail`；`/poetry/:id` → `PoemDetail`
  - `/en/`、`/en/:category/`、`/en/:category/:slug/` → 英文速查表（独立布局）
  - `/sitemap`、`/privacy`、`/terms`、`/about`、`/contact` → 站点地图与法务页
- **数据流**：无全局状态管理，组件间状态通过 React `useState` 在 `Home` 等父组件中维护。
- **AI 调用**：`src/services/ai.ts` 使用 `openai` SDK 在浏览器端直接请求用户配置的 API Endpoint（OpenAI / DeepSeek / 智谱 / 自定义）。API Key 仅保存在浏览器 `localStorage`（`school_formula_ai_config`），不会发送到项目方的服务器。
- **注意**：因为 API Key 在浏览器中使用，该设计依赖用户自行保管密钥；不要建议将密钥硬编码进源码。
- **AI 接入指南**：AI Gateway 配置、鉴权头（`cf-aig-authorization`）、Workers AI 兜底与 Vectorize RAG 方案见 [docs/cloudflare-ai.md](docs/cloudflare-ai.md)。
- **邮件通道**：验证码 / 密码重置邮件走 Resend（`RESEND_API_KEY`）或 Cloudflare Email Service 绑定（`EMAIL`），MailChannels 免费接口已于 2024-06-30 停服；配置、排错与应急取码见 [docs/email.md](docs/email.md)。

---

## 5.1 SEO 与预渲染（文档 head 的唯一所有者）

预渲染把每条路由渲染成静态 HTML。页面 `<head>` 的**唯一来源**是 `src/seo/`，按「数据 / 逻辑 / 呈现」分层：

```
src/seo/
├── site.ts        # 站点常量：规范域名 origin、品牌文案、默认语言与 LANGUAGES 列表
├── types.ts       # PageContent / Breadcrumb 类型
├── content.ts     # resolvePageContent(path)：按语言分派到 content-zh / content-en
├── content-zh.ts  # 中文站点的路由 → 标题/描述/面包屑（含知识点索引）
├── content-en.ts  # 英文站点的路由 → 标题/描述/面包屑
├── meta.ts        # buildSeoMeta(path): SeoMeta（唯一派生逻辑：canonical、hreflang、OG/Twitter、JSON-LD）
├── head.ts        # renderHead(meta): string（仅呈现：把 SeoMeta 转成 head HTML，含转义）
└── files.ts       # buildRobotsTxt() / buildSitemap(paths)（站点级文件）
```

- `src/prerender/inject.ts` 的 `injectPage(template, appHtml, headHtml)` 负责最终的文档拼装：用 `renderHead(...)` 的输出替换模板里的 `<title>`，再把 SSR 出的 app HTML 注入 `#root`。
- `src/entry-prerender.ts` 遍历 `PRERENDER_PATHS`，为每条路由生成 head + HTML，并写出 `dist/robots.txt` 与 `dist/sitemap.xml`（5000 个 URL，构建时打印 5001 条预渲染路由；其中 3878 条来自 `/yuwen`）。
- canonical 采用「目录式」URL（非根路径带尾斜杠），与 Worker 的 `/tutorial` → 308 → `/tutorial/` 行为一致。
- 标题/描述文案：中文改 `src/seo/content-zh.ts`，英文改 `src/seo/content-en.ts`；站点域名/品牌改 `src/seo/site.ts`。客户端路由切换不会更新 head（静态页面由预渲染产出，爬虫可见）。
- Worker 侧 `worker/lib/static-paths.ts` 的 `isSeoFile()` 保证 `/robots.txt`、`/sitemap.xml` 缺失时返回 404，而不是被 SPA fallback 换成 app HTML。

## 5.2 多语言与英文站点（/en）

语言由 URL 前缀决定，唯一事实来源是 `src/i18n/languages.ts` 的 `LANGUAGES`：

- `languageForPath(path)`：判断路径属于哪种语言（`/en`、`/en/...` → en；其余 → zh-CN）。
- `appPathFor(path)`：剥离语言前缀，得到应用内路径（`/en/reference/x` → `/reference/x`）。
- 站点文案（品牌名、description、`og:locale`）按语言存放在 `src/seo/site.ts` 的 `BRAND`，通过 `brandFor(language)` 取用。

**英文站点**是刻意收窄的一个面（`/en/` 与 `/en/reference/:slug`），只承载语言中立的可打印速查表（`src/data/reference.ts`），不是整站翻译：

- 组件在 `src/components/reference/`：`ReferenceLayout`（英文页头/页脚）、`ReferenceIndex`（`/en/` 列表）、`ReferencePage`（单表 + 打印）、`PrintButton`。
- 路由表在 `src/reference-routes.ts`（`ENGLISH_HOME` / `ENGLISH_REFERENCE_ROUTE` / `referencePath` / `ENGLISH_ROUTE_PATHS`）：App 路由、预渲染清单、`sitemap.xml` 与各处链接都读这一张表。
- 每个英文页输出 `<html lang="en">` 与 `hreflang="en"` + `x-default`；中文页保持 `zh-CN`，且交替链接不含 `/en`（`src/seo/meta.ts`）。

新增一门语言：在 `LANGUAGES` 加一项、在 `BRAND` 加对应文案，并在 `resolvePageContent` 增加该语言的内容分支。

## 5.3 语言入口与广告（AdSense）

**语言入口**：`src/components/Header/LanguageSwitcher.tsx` 在顶栏与移动端菜单提供进入英文站点的链接（`/en/`）；英文站点的 `ReferenceLayout` 提供反回 `/` 的 `中文` 链接。中文页面的 head（SEO 输出）不因此改变。

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

### 6.3 样式与设计系统

> 事实来源：根目录 `design.md`（锁定的系统决策）与 `src/styles/{tokens,base,ui}.css`（实现）。新增页面前先读 `docs/ui-system.md`，那里有页面骨架、组件原语、表面阶梯、检查清单和陷阱。

- Tailwind CSS v4，入口 `src/index.css`：`@import "tailwindcss";` 之后依次 `tokens.css` → `base.css` → `ui.css`。
- `tokens.css`（`@theme`）：OKLCH 色板、字体栈、字号、间距、圆角、阴影、缓动、时长、z-index、容器宽度。所有色值均为 OKLCH，不写 hex、不用 Tailwind 内置调色板。
- 语义 token：`accent`（品牌蓝：主操作 / 选中 / 焦点）、`paper` / `card` / `well`（表面）、`ink`（四级文字）、`rule` / `divider`、`success` / `error` / `warning` / `info`（各有 fill / `-ink` / `-bg`）。页面底色是 `bg-paper`，成组次要内容用 `bg-paper-2`。
- `base.css`：画布、`:focus-visible`、`::selection`、滚动条、标题换行、`prefers-reduced-motion`（全站统一）。
- `ui.css`（`@layer components`）：页面骨架与组件原语，新页面优先复用：`page-shell` / `container-page` / `page-head` / `page-title` / `page-lead`、`seg` + `seg-btn`、`btn` + `btn-primary` / `btn-secondary` / `btn-ghost`、`rail` / `rail-item`、`index-head` / `kp-row`、`section` / `section-head`、`well` / `sheet`、`prose-body`、`toc`、`tag`、`breadcrumb`、`empty-state`、`table-basic`、`field` / `input`、`chat-layout` 等。
- **表面阶梯**：whitespace → 1px divider → paper-2 well → card（border 与 shadow 二选一）。不做卡片套卡片；不给内容卡片加阴影；一页一种主按钮样式。
- **Tailwind v4 陷阱**：不要写 `bg-[paper-2]`、`text-[ink]` 这类「方括号主题名」——编译结果是 `background-color: paper-2`（无效 CSS，静默丢弃）。必须写主题工具类：`bg-paper-2`、`text-ink-2`、`border-divider`、`bg-accent-soft`。历史上清理过 466 处这种写法。
- Markdown：项目**没有** `@tailwindcss/typography`，`prose` 类无效；所有 Markdown 输出放进 `.prose-body`（段落间距、列表符号、表格、代码块由 `ui.css` 提供）。标题里的装饰 emoji 用 `src/utils/markdown.ts` 的 `stripHeadingEmoji()` 在渲染前剥掉。
- 图标：`src/components/icons/Icon.tsx` 唯一图标集（24×24，1.8px 描边）+ `iconFor()`；不使用 emoji 当图标。组件只导一次：`import { Icon } from './icons/Icon'`。
- 动效：禁 `transition-all`；只动 `transform` / `opacity` / 颜色；颜色过渡 `--dur-micro`（120ms），入场 `--ease-out`（`cubic-bezier(0.16, 1, 0.3, 1)`）。`base.css` 已统一收起 `prefers-reduced-motion`。
- 通用规则：`html` / `body` 用 `overflow-x: clip`（不用 `hidden`）；交互元素必须有即时 `:focus-visible`；装饰性 SVG 必须 `aria-hidden="true"`。
- UI 文本以简体中文为主；古典文学（诗词 / 史记 / 资治通鉴）用 `font-serif`，其余页面不用衬线。
- 暗色模式尚未实现（`color-scheme: light`）。

### 6.4 组件与数据约定

- 组件文件默认以命名导出（named export）形式导出组件，例如 `export const Home = () => ...`。
- 新增页面按 `docs/ui-system.md` 的骨架写：`page-shell` + `Header` + `container-page pt-10` + `page-head` + `Footer`，内容用目录行 / 发丝线分区，不另起一套卡片。
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
