# AGENTS.md — school-formula / 拾艺院核心知识点库

> 本文件面向 AI 编程助手。读者应假定对该项目一无所知，以下信息均基于仓库当前实际内容整理，不做推断。

---

## 1. 项目概述

`school-formula` 是一个面向家长与学生的**中小学核心知识点学习平台**，品牌名为 **拾艺院 · 核心知识点库**。它是一个纯前端单页应用（SPA），无后端服务，所有学科数据、速查表、古籍阅读内容均以静态 TypeScript 模块形式内置在仓库中。

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
| 包管理器 | npm（`package-lock.json` 不纳入版本控制，请使用 `npm install` 安装） |

> 注意：项目未配置测试框架，仓库中不存在 `*.test.*`、`*.spec.*`、`vitest`、`jest`、`playwright`、`cypress` 等测试相关文件。

### 当前构建/检查状态

> 以下问题在当前 `main` 分支已存在，并非本次 AGENTS.md 编写引入。

- `npm run lint` 会报错：`src/components/SettingsModal.tsx:21` 中在 `useEffect` 内直接调用 `setState`，触发 `react-hooks/set-state-in-effect` 规则。
- `npm run build` 会报错：`src/components/Home.tsx` 使用了 `<ShijiView />` 但未导入该组件，导致 TypeScript 编译失败（`TS2304: Cannot find name 'ShijiView'`）。

在继续功能开发前，建议先修复上述两个问题，使 `npm run lint` 与 `npm run build` 均通过。

---

## 3. 项目结构

```
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署工作流
├── extra-data/                    # 原始数据文件（常用汉字库 2000/3500）
├── public/                        # 静态资源（vite.svg 等）
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
```

构建产物输出到 `dist/` 目录。`build` 脚本会先执行 `tsc -b` 进行 TypeScript 项目引用编译，再由 Vite 打包。

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

## 6. 代码风格与开发约定

### 6.1 TypeScript

- 严格模式已启用（`strict: true`）。
- 项目使用 TypeScript 项目引用：`tsconfig.json` 引用 `tsconfig.app.json`（应用代码，`include: ["src"]`）和 `tsconfig.node.json`（构建配置，`include: ["vite.config.ts"]`）。
- 允许直接导入 `.ts`/`.tsx` 扩展名（`allowImportingTsExtensions: true`），配合 `noEmit: true`。
- 要求 `verbatimModuleSyntax: true`，导入类型时请使用 `import type { ... }` 或 `import { type ... }`。
- 未使用的局部变量/参数会报错（`noUnusedLocals`、`noUnusedParameters`）。

### 6.2 ESLint

- 使用 ESLint 9 flat config（`eslint.config.js`）。
- 配置扩展：
  - `@eslint/js` recommended
  - `typescript-eslint` recommended
  - `eslint-plugin-react-hooks` recommended
  - `eslint-plugin-react-refresh` vite preset
- 仅检查 `**/*.{ts,tsx}`，`dist/` 被忽略。
- 运行命令：`npm run lint`。

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
2. 工作流（`.github/workflows/deploy.yml`）使用 Node.js 20：
   - `npm cache clean --force`（清理缓存避免 `edgesOut` 错误）
   - `npm install --no-audit --no-fund`
   - `npm run build`
   - 将 `dist/` 推送到 `gh-pages` 分支
3. GitHub Pages 源应配置为 `gh-pages` 分支的根目录。

> **重要不一致点**：`DEPLOYMENT.md` 声称 `vite.config.ts` 已配置 `base: '/school-formula/'`，但**当前实际代码中 `vite.config.ts` 的 `base` 为 `'/'`**。若仓库以项目页形式部署到 `https://dllen.github.io/school-formula/`，当前配置可能导致静态资源 404。修改部署配置时，请确认 `base` 与 GitHub Pages 实际路径一致。

---

## 8. 安全注意事项

- **API Key 存储在浏览器本地**：AI 配置（包括 API Key）保存在 `localStorage`，属于客户端风险区域。不要建议用户将生产级密钥长期存储在此处，也不要在后端代理未建立的情况下将密钥提交到仓库。
- **无后端认证/授权**：应用本身没有登录、权限、CORS 代理或数据持久化服务。
- **无输入校验框架**：AI 配置表单仅做基础 UI 输入，未对 URL、模型名做严格校验。
- **静态数据不可变**：所有学习内容都是打包进 bundle 的静态模块，没有运行时数据库或 API 拉取。

---

## 9. 已知限制与可改进点

- **构建与 lint 当前存在已知错误**（见第 2 节），需先修复再合并新功能。
- 没有单元测试、集成测试或 E2E 测试。
- `README.md` 仍是 Vite 模板的默认说明，未针对本项目重写。
- `App.css` 是模板遗留文件，当前未被引用，可考虑删除或合并到 `index.css`。
- GitHub Pages 的 `base` 路径与部署文档不一致（见第 7 节）。
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
