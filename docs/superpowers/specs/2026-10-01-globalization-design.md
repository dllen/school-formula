# 出海改造设计：SSG 预渲染 + i18n + SEO + AdSense

日期：2026-10-01
状态：已确认（头脑风暴五个 section 逐一通过）

## 背景与目标

`school-formula`（拾艺院）目前是纯前端 SPA + Cloudflare Workers，全部内容为中文静态数据，面向中国 K-12 家长与学生。本次改造将其升级为出海项目：

- **目标用户**：全球学生，中国课程内容原样保留并**直译**为全球主流语言（不做海外课程体系对齐）
- **第一版语言**：`zh`（默认）、`en`、`es`、`ja`、`ko`（中英 + 西/日/韩），不做 RTL
- **变现**：Google AdSense 展示广告（不投 Google Ads 买量）
- **SEO**：让全部内容页面可被 Google 抓取索引，收割教育长尾搜索流量

## 已确认的关键决策

| 决策点 | 结论 |
|--------|------|
| 渲染架构 | 方案 A：构建时预渲染（SSG），不做运行时 SSR |
| 默认语言 URL | 中文无前缀（`/` = 中文），其他语言 `/en/`、`/es/`、`/ja/`、`/ko/` |
| UI i18n 框架 | react-i18next + i18next |
| RTL | 第一批不含阿拉伯语，不做 RTL 适配 |
| 内容翻译 | LLM 批量直译，翻译产物提交进 git，增量翻译 |
| 数据加载 | 按语言代码分包 + 懒加载，组件改异步取数（DataProvider） |
| 多域名 | syy.global 为唯一规范域名，syy.mobi / syy.one 全站 301 跳转 |
| 广告与会员 | free 看广告，plus/pro 免广告（会员卖点） |
| 合规 | /privacy /about /contact /terms 四页 + Funding Choices CMP |

## Section 1：路由改造 + 预渲染管线

### 路由改造（前置条件）

现在 `App.tsx` 只有 `/` 和 `/knowledge/:id` 两条路由，Home 的 10 个视图靠 `activeView` state + query 参数切换，爬虫看不到视图内容。将视图提升为真实路由：

- `/tutorial`、`/cheatsheet`、`/mental-math`、`/formula`、`/mastery`、`/practice`、`/notes`、`/zizhi`、`/shiji`
- 旧的 `?view=xxx` query 参数 301 重定向到新路径（保已分享链接）
- Home 成为各视图的布局壳，视图内状态（如 `?kp=`）仍走 query 参数

### 预渲染管线

- 新增 `src/entry-server.tsx`：导出 `render(url, lang)`，内部 `renderToString` + `StaticRouter` + `DataProvider(lang)`，Node 侧同步读对应语言数据文件
- 新增 `scripts/prerender.mjs`：构建（`vite build`）后执行，遍历路由清单 × 5 语言，每个组合产出一份静态 HTML：
  - `dist/index.html`（中文首页）、`dist/tutorial/index.html`…
  - `dist/en/index.html`、`dist/en/knowledge/p-math-1/index.html`…
  - 规模：~12 视图路由 + 276 知识点详情页，× 5 语言 ≈ **1400+ 页面**
- 每个 HTML 的 `<head>` 由 Section 4 的 meta/hreflang/JSON-LD 生成器填充
- 客户端入口改用 `hydrateRoot`，水合后恢复完整 SPA 交互（含 localStorage hooks、AI 调用等纯客户端能力）
- 不用 puppeteer 类方案：`renderToString` 确定性强、快、CI 无头浏览器依赖为零

### Workers 部署

`dist/` 仍作为静态资源由 Workers 服务，目录式静态 HTML 天然命中。Worker 增加 mobi/one → global 的 301 逻辑（见 Section 4）。

## Section 2：i18n 框架与 UI 文案

- **框架**：`react-i18next` + `i18next`
- **语言清单**：`zh`（默认）、`en`、`es`、`ja`、`ko`
- **目录**：`src/i18n/index.ts`（初始化 + 语言检测）+ `src/i18n/locales/{lang}/{namespace}.json`
- **命名空间**按视图切分：`common`（Header/导航/按钮）、`auth`、`knowledge`、`practice`、`tutorial`、`mastery` 等；首屏只加载 `common` + 当前视图命名空间
- **语言事实来源是 URL 前缀**：`/en/knowledge/...` → en；`LanguageSwitcher` 放 Header，切换时跳转同路径的其他语言版本；localStorage 只记偏好。根路径 `/` 始终渲染中文（爬虫与首访用户所见）；仅当老用户 localStorage 里已有其他语言偏好时，客户端水合后跳到对应前缀（服务端不做 302，避免 Google 对首页自动跳转的惩罚）
- **UI chrome 与内容数据完全分离**：按钮/导航/表单/提示语走 i18next JSON；知识点/题目/教程内容走 Section 3 的数据管线
- **工作量**：所有组件硬编码中文文案提取为 key，机械性工作，按视图分批交付

## Section 3：内容翻译管线与数据分包

### 翻译管线（第三条脚本链，复用「生成/入库分离」哲学）

- 新增 `scripts/translate-data/`：读 `src/data/**` 中文源 → LLM 批量翻译（pi-agent-edu 同款 SDK 或直连 API）→ 输出 `src/data/i18n/{lang}/**`，目录结构与中文源镜像
- **增量翻译**：每条内容算 content-hash 存 `translations.lock.json`，只翻新增/变更条目，重跑成本趋近于零
- **术语表**：`glossary.json`（因数→factor、公约数→common divisor…）注入翻译 prompt，保证全站术语一致
- **翻译产物提交进 git**：构建可复现、CI 无需 API key、质量可 review
- 中文源是唯一事实来源；pi-agent-edu（生成）和 ingest-data（入库）流程不变，翻译在入库后跑

### 数据访问层改造（对现有代码侵入最大的部分）

- 现状：组件直接 `import { KNOWLEDGE_DATA }`，同步可用
- 改为 `src/data/loader.ts`：`loadData(lang, kind)` 内部动态 `import(`./i18n/${lang}/knowledge/index.ts`)`，Vite 自动按语言分包（避免 5 语言全量 bundle 膨胀 ~5 倍）
- 组件侧包一层 `DataProvider`（React context，按当前语言加载 + Suspense fallback）；zh 走原有静态 import，首屏零开销
- 所有消费 `KNOWLEDGE_DATA` / 题库 / 教程的组件过一遍，但改动收敛在消费点，数据结构本身不变

## Section 4：SEO 基础设施

### 页面级 meta（prerender 时按路由 × 语言生成）

- `<html lang>`、`<title>`、`<meta description>`：从数据派生（知识点页 = 名称 + 摘要 + 学段学科），每语言一套文案模板
- Open Graph + Twitter Card
- **hreflang**：每页输出 5 个语言版本互链 + `x-default`
- canonical 指向本语言版本的规范 URL

### 站点级文件（构建时生成）

- `sitemap.xml`：按语言拆分（`sitemap-zh.xml`、`sitemap-en.xml`… + sitemap index），~1400 URL 从路由清单自动生成
- `robots.txt`：放行全部，指向 sitemap index

### 结构化数据（JSON-LD，嵌入预渲染 HTML）

- 首页：`WebSite` + `Organization`
- 知识点页：`LearningResource` + `BreadcrumbList`
- 练习页：`Quiz`（Google 教育类富摘要，差异化流量入口）

### 多域名收敛

- syy.global 为唯一规范域名；syy.mobi / syy.one 在 Worker 层全站 301 到 syy.global 对应路径
- 消除三域名同内容的重复内容惩罚，聚拢权重

### 监测

- GA4 + Google Search Console（prerender 时注入 snippet），AdSense 优化也依赖 GA 数据

## Section 5：AdSense 接入与会员关系

### 接入方式

- client ID 走环境变量 `VITE_ADSENSE_CLIENT_ID`，仅生产构建注入；prerender 时主 script 写入 `<head>`
- 封装 `<AdUnit slot="...">` React 组件：水合后 push 广告；**plus/pro 用户渲染 null（付费免广告）**
- 根目录 `ads.txt`（审核必需）

### 广告位（克制策略）

- 知识点详情页：内容中部 + 底部各一个
- 练习结果页：一个
- 不放：登录/注册页、答题过程中

### 合规前置（AdSense 审核硬性要求）

- 新增静态页：`/privacy`、`/about`、`/contact`、`/terms`，每语言一份（内容模板化，走翻译管线）
- **GDPR 同意管理**：Google Funding Choices（免费 CMP，与 AdSense 原生集成）；EEA/UK 先弹同意再加载广告，非 EEA 直接加载

### 上线顺序

AdSense 代码可先开发，但**申请提交放在最后**：SEO 改造上线、页面可抓取、合规页就绪后再提交，审核约 1-2 周。

## 实施阶段划分（供实现计划参考）

1. **阶段一：地基**——路由改造（视图路径化）+ 预渲染管线（仅中文跑通）+ 多域名 301
2. **阶段二：i18n**——react-i18next 接入 + UI 文案提取 + 语言切换
3. **阶段三：内容翻译**——translate-data 脚本 + 数据分包 + DataProvider 改造 + 4 语言内容产出
4. **阶段四：SEO**——meta/hreflang/sitemap/JSON-LD + GA4/Search Console
5. **阶段五：AdSense**——合规页 + Funding Choices + AdUnit + 提交审核

每个阶段独立可交付、可上线，前一阶段不阻塞后一阶段的开发（阶段三、四可并行）。

## 风险与注意点

- **组件异步取数改造**是最大侵入点，需逐视图验证无回归（现有 164 个 Vitest 测试需同步更新）
- 预渲染页面数随内容增长线性上升，需关注构建时间；必要时 prerender 可并行化
- `renderToString` 环境下 localStorage/window 不可用，依赖这些的组件需在 server 入口做环境守卫（`typeof window !== 'undefined'`）
- 翻译质量需抽样人工 review，尤其数学术语和题目选项的一致性
