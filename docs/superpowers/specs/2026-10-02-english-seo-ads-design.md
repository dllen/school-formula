# 英文打印图表面扩充设计：SEO 补完 + 内容规模化 + AdSense 变现

日期：2026-10-02
状态：已确认（头脑风暴五个 section 逐一通过）
上游：[2026-10-01 出海改造设计](./2026-10-01-globalization-design.md)（本设计**修订**其 Section 2/3 的语言范围与 Section 4/5 的部分条目）

## 背景

2026-10-01 的出海 spec 锚定了 SSG + i18n + SEO + AdSense 四件事。实际落地过程中路线发生了偏移：阶段一（SSG 地基）已完成，但「中文课程直译成 5 种语言」这条被放弃，改为**英文单语的打印图表窄面**——`/en/` 下的 6 张可打印参考图表。

本次改造把这个窄面做成正经资产：内容扩到约 100 页、补齐 SEO 基础设施、接通 AdSense 变现。

### 现状盘点

**已完成**

| 项 | 载体 |
|---|---|
| SSG 预渲染管线 | `src/entry-server.tsx` + `src/entry-prerender.ts` + `src/prerender/{inject,routes}.ts` |
| 视图路径化（10 个视图） | `src/view-routes.ts` |
| SEO meta 生成 | `src/seo/{meta,head,content,content-zh,content-en,site,files}.ts` |
| JSON-LD（WebSite / Organization / LearningResource / BreadcrumbList / WebPage） | `src/seo/meta.ts` |
| sitemap.xml + robots.txt（构建时生成） | `src/seo/files.ts` |
| `/en/` 英文面（6 张图表） | `src/data/reference.ts` + `src/components/reference/` |
| AdSense 代码（脚本加载 / AdUnit / ads.txt） | `src/ads/` + `public/ads.txt` |
| Worker 目录索引 + 规范域名 301 | `worker/lib/{static-paths,redirect}.ts` |

**缺口**（按「挡住收益」排序）

1. **合规四页完全不存在** —— AdSense 审核硬性拒签项，现在提交必被拒。
2. **CMP 未配置** —— EEA/UK/CH 流量需要 Google 认证的 TCF CMP。
3. **广告位是占位符却不返回 null** —— `AD_SLOTS` 默认 `'0000000000'` 是 truthy，`isAdConfigured()` 返回 true，导致中英所有页面（含预渲染静态 HTML）都在渲染带非法 slot 的 `<ins>`，留 90px 空白框。
4. **零分析** —— 没有 GA4、没有 Search Console，看不到增长也无法做广告优化。
5. **英文内容只有 6 页** —— 太薄，排不上名，也撑不起广告收益。
6. **全站零 og:image** —— `seo/meta.ts` 根本没有 `og:image` 字段，分享出去是裸链接。
7. **图表页之间零内链** —— 每页只连回首页，100 页站点靠这个爬不到权重传递。
8. **标题无意图修饰词** —— 搜「printable multiplication chart」的人看到的标题里没有 "printable"。

## 已确认的决策

| 决策点 | 结论 |
|---|---|
| 内容定位 | 深耕**可打印参考图表**细分（math / science / english），不翻译中文课程、不对齐海外课标 |
| 页面结构 | 分节式：`Block[]`（table / formulas / diagram）+ intro + howToUse + faq + related |
| 内容生产 | **计算优先**：能推导的用生成器函数算，算不出来的手写结构化常量。不引入新脚本链 |
| 页面深度 | 数据块 + intro（80–120 词）+ How to use it（2–4 条）+ FAQ（3–5 条）+ related 内链，约 400–600 词/页 |
| 语言维度 | **先做英文，模型预留语言**：中立模块放生成器/常量，语言模块负责组装 + 文案 + 本地化 slug |
| 改动范围 | 英文面为重心；中文站只补两项真·全站通用项（GA4、og:image），内容/路由/组件不动 |
| og:image | 构建时用 satori + `@resvg/resvg-wasm` 生成每页真图，失败回退学科兜底图 |
| AdSense 时序 | 内容铺到 40 页再提交申请；审核期并行铺到 100 页 |
| 联系邮箱 | `support@syy.global` |

## Section 1：内容模型与数据层

### 组织方式

不做「数据对象 + copy 对象按 blockId 关联」——那层关联是多余的。真正语言中立的不是数据而是**生成器函数**：乘法表的数字是 `range(1,12).map(r => range(1,12).map(c => r*c))`，是计算不是数据，不需要为每种语言存一份。

```
src/data/reference/
├── types.ts                     # ReferencePage / Block / ReferenceCategory
├── neutral/                     # 语言中立：生成器与常量，无 slug、无文案
│   ├── tables.ts                # multiplicationTable(), squaresCubesRoots(), …
│   ├── conversions.ts           # 分数↔小数、公制/英制换算
│   ├── constants.ts             # π / e / 对数表 / 物理常数
│   └── elements.ts              # 118 元素：序数 / 符号 / 原子质量（纯数据）
├── en/                          # 英文面：组装 neutral + 英文文案 + 本地化 slug
│   ├── math.ts
│   ├── science.ts
│   └── english.ts
├── validate.ts                  # validateReferencePages()
└── index.ts                     # 聚合、按 slug 查、路由清单
```

`neutral/` 模块的签名**刻意不含 slug**：slug 是本地化的（`/es/math/tabla-de-multiplicar/`），必须住在语言文件里。将来加西语时新增 `es/` 目录调用同一批生成器，而非去 copy 文件里对 blockId。

### 类型

```ts
export type ReferenceCategory = 'math' | 'science' | 'english';

/** 一个完整页面 = 语言中立的 blocks + 本地化文案（slug 也本地化）。 */
export interface ReferencePage {
  slug: string;                     // 本地化，全站唯一
  category: ReferenceCategory;
  title: string;                    // H1 来源
  summary: string;                  // 索引卡一句话，约 60–90 字符
  description: string;              // meta description，约 150–160 字符
  intro: string;                    // 80–120 词
  blocks: Block[];                  // 主体，语言中立
  howToUse: string[];               // "How to use it"，2–4 条
  faq: { q: string; a: string }[];  // 3–5 条 → FAQPage JSON-LD
  related: string[];                // 3–5 个 slug，显式指定
}

export type Block =
  | { kind: 'table';    headers?: string[]; rows: string[][]; caption?: string }
  | { kind: 'formulas'; groups: { label?: string; items: string[] }[] }
  | { kind: 'diagram';  svg: string; caption?: string };
```

**渲染顺序固定**：H1 → intro → blocks → howToUse → FAQ → related。页面的散文部分不放进 `blocks`，这样「数据块」与「围绕数据块的解说」在类型上就是分开的，BlockRenderer 只负责后者，打印样式也只针对后者。

`summary` 与 `description` 是两个字段而非一个：索引卡要短（约 60–90 字符，一行放得下），meta description 要长（约 150–160 字符，带意图修饰词）。长度目标不同，合并会逼作者二选一。

`related` 用显式指定而非自动取同类：40 页数学互相内链会退化成 39 个链接的噪声墙，3–5 个手挑的才有用。

### 边界情况

- **不规则动词表本质是英文数据**，无法中立化。它标记为 `english` 类，将来 `es/` 不产出该页——这是正常的，不是缺陷。
- **元素周期表**的中立部分只有序数与符号；元素**名称**是文案，进 `en/science.ts`。

### 防呆

`validateReferencePages(pages)` 断言：slug 全局唯一、title/summary/description/intro 非空、`faq.length >= 3`、`howToUse.length >= 2`、`blocks.length >= 1`、`related` 指向的 slug 都存在。**在构建时调用并直接 throw** —— 半成品页面进不了 `dist/`。

## Section 2：路由与渲染

### URL 结构

```
/en/                              概览 hub：三个学科入口 + 站点简介
/en/math/                         学科 hub：该科导语 + 图表清单
/en/science/
/en/english/
/en/math/multiplication-chart/    图表页
```

学科进 URL 的三个理由：给 Google 主题信号（`/en/math/` 这一段本身就是分类词）；面包屑与 BreadcrumbList 天然成立；hub 页是**可承载聚合内容的真实页面**，不是虚拟分类页。canonical 一律带尾斜杠（`canonicalUrl()` 已如此）。

### 迁移

现有 6 页在 `/en/reference/{slug}/`，301 到 `/en/{category}/{slug}/`。

**这 6 条映射写在 `worker/lib/redirect.ts`，不从 `src/` 导入。** `worker/` 是独立编译边界（`tsconfig.app.json` 只 `include: ["src"]`，`worker/` 不在任何 tsconfig 的 include 里，只靠 vitest 单独跑测试），而这 6 条是一次性的历史 URL、永远不会增长——为 6 个常量把 worker 绑到 `src/data/reference` 的整个模块图上不划算。

### 路由模块

`src/reference-routes.ts` 继续做唯一 owner（路由、prerender 清单、sitemap、链接助手都从它读）：

```ts
export const ENGLISH_HOME = '/en/';
export const REFERENCE_CATEGORIES: readonly ReferenceCategory[];   // 顺序即 hub 展示顺序
export function categoryPath(category: ReferenceCategory): string;               // '/en/math/'
export function referencePath(category: ReferenceCategory, slug: string): string; // '/en/math/…/'
export const ENGLISH_ROUTE_PATHS: string[];   // hub + 3 学科 hub + 全部图表页
```

`App.tsx` 三条路由：

```
/en/                    → ReferenceIndex
/en/:category/          → ReferenceCategory
/en/:category/:slug/    → ReferencePage
```

`:category` 在组件内对照 `REFERENCE_CATEGORIES` 校验，非法值渲染「未找到」态。否则 `/en/typo/` 会产出预渲染 HTML + 200，等于给 Google 一张空页。

### Worker 静态服务无需改动

已确认 `worker/lib/static-paths.ts` 的 `assetCandidates()` 对任意深度目录都返回 `<path>/index.html` 候选，`/en/math/multiplication-chart/` 直接命中预渲染产物。

### 组件

```
src/components/reference/
├── ReferenceLayout.tsx         外壳（保留）
├── ReferenceIndex.tsx          /en/ hub（重写）
├── ReferenceCategory.tsx       学科 hub                              [新]
├── ReferencePage.tsx           图表页（重写）
├── blocks/BlockRenderer.tsx    按 block.kind 分发                    [新]
├── blocks/TableBlock.tsx                                            [新]
├── blocks/FormulasBlock.tsx                                         [新]
├── blocks/DiagramBlock.tsx                                          [新]
├── FaqSection.tsx                                                    [新]
├── RelatedCharts.tsx                                                 [新]
└── PrintButton.tsx             （保留）
```

`BlockRenderer` 是纯 switch，三个 block 组件各自独立可测。加一种 block 类型只动这两处。

### 打印

`@media print` 隐藏：站点导航、广告位、FAQ、相关图表、页脚。**只留 H1 + 数据块**。打印体验是这个垂类的核心卖点——一张乘法表印出来带 FAQ 就是失败的。

## Section 3：SEO 基础设施补完

### og:image 管线

```
src/prerender/og.ts        # writeOgImages(pages, distDir)
       ↓ 被 src/entry-prerender.ts 调用（不新增构建步骤）
   satori（纯 JS，页面数据 → 1200×630 SVG）
       ↓ @resvg/resvg-wasm（SVG → PNG）
dist/og/reference/{category}/{slug}.png
dist/og/knowledge/{id}.png
dist/og/{category}/default.png          # 学科兜底图
```

放进已有 prerender 入口而非新开 `scripts/*.mjs`：与 `src/prerender/{inject,routes}.ts` 组织方式一致，且能直接 import `src/data/reference`（`.mjs` 脚本 import TS 源码要另配 loader）。

实现要点：

- **satori 需要字体数据**。往仓库提交一份拉丁字符字体子集（约 100–200KB），否则渲染报错。用 **Inter**——SIL Open Font License，允许自由再分发，避免把字体二进制提交进仓库时的授权问题。一次性成本。
- **`@resvg/resvg-wasm` 需要显式 `initWasm()`**。Node 下读 wasm 字节喂进去。选 wasm 而非 `@resvg/resvg-js`（原生）是为了彻底避开「原生二进制在某个 Node ABI / 平台上缺失」这类 CI 崩溃。
- **渲染失败回退学科兜底图，不 throw**。一张 OG 图失败不该让部署挂掉。
- **并发池（上限 4–8）+ 内容哈希缓存**。中英合计约 390 张（100 英文面 + 12 视图 + 276 知识点），satori 每张约 50–150ms，单线程会让构建多花 1 分钟以上。本地重复构建命中缓存秒过，CI 首次全量生成。

OG 图必须栅格化：SVG 不被 Facebook / Twitter / LinkedIn 支持。

### JSON-LD 补完

| 页面 | 现状 | 补完 |
|---|---|---|
| 首页 | `WebSite` + `Organization` | 不变 |
| 知识点页 | `LearningResource` + `BreadcrumbList` | 不变 |
| 图表页 | `WebPage` + `BreadcrumbList` | `LearningResource` + **`FAQPage`**（来自 `faq` 字段）+ `BreadcrumbList` |
| hub 页 | 无 | `CollectionPage` + `ItemList` |
| 合规页 | 无 | `WebPage` |

`PageContent.kind` 从 `'home' | 'knowledge' | 'view'` 扩为加上 `'reference' | 'hub'`——现在的 `'view'` 是兜底桶，图表页和 hub 页需要各自的 JSON-LD 分支。

### 标题模板

现状 `` `${table.title} - ${brand.name}` `` 没有意图修饰词。改为 title 带修饰、H1 保持干净：

```
<title>  Printable Multiplication Chart (1–12) – Free & No Signup | Shiyiyuan
<h1>     Multiplication Chart (1–12)
```

确定性规则（写死在 `seo/content-en.ts`）：title = `Printable {title} – Free{意图后缀} | {brand}`，意图后缀按品种取 `& No Signup` / `for Students` / `Reference Sheet`。

**标题只写 "Printable"，不写 "PDF"。** 我们提供的是浏览器打印，不发 PDF 文件——宣称 PDF 是虚假的，且用户落地后找不到下载按钮就是跳出。

### 内链

三个方向，全部是真实链接（非 JS 路由跳转）：

1. `/en/` hub → 三个学科 hub
2. 学科 hub → 该科全部图表页（这页本身是 `ItemList` 的载体）
3. 图表页 → `related` 里那 3–5 个 slug + 面包屑回 hub

### GA4 + 同意模式 + Search Console

- `VITE_GA4_ID` 注入 prerender 的 `<head>`，与 AdSense 同一处，**全站生效（中英都有）**。
- **同意模式默认值按区域给**：EEA/UK/瑞士 → `analytics_storage: 'denied'`，其他区域 → `granted`。这样 GA4 现在就能合规上线，不必等 CMP——CMP 获批后接管 ads 同意，analytics 那部分已经是对的。
- **Search Console 验证走 DNS TXT** 而非 meta 标签：覆盖所有子域名、重新部署不失效。**这是用户手动步骤。**

### 明确不做的三项

这三项都在 2026-10-01 spec 里，推演后判定**现在做是猜**：

**hreflang 推导** —— 现状是「自指 + x-default 自指」，退化但**合法**（自指 hreflang 不违规）。要产生真正的 en↔es 互链，需要每页记录各语言的本地化 slug 映射——而正确的映射长什么样，只有真的有第二门语言时才知道。**等 `es/` 落地时再加**，届时 `ReferencePage` 加 `alternates?: Record<langCode, string>`。

**sitemap 按语言拆分** —— 总量约 400 URL，单文件上限是 50,000 URL / 50MB。拆分的唯一收益是 GSC 里按语言看诊断，不值这个复杂度。

**`<lastmod>`** —— 需要 URL→声明该页的源文件的映射，耦合进构建。而 Google 明确说除非 lastmod 一贯准确否则基本忽略。半准不准的 lastmod 比如实省略更糟。

## Section 4：变现与合规

### 合规四页

**中英各一套，各用自己的语言**：`/privacy` `/about` `/contact` `/terms` 是中文站那套，`/en/privacy/` `/en/about/` `/en/contact/` `/en/terms/` 是英文面那套。广告同时投在中文知识点页和英文图表页上，隐私政策必须覆盖全站；政策得用用户看得懂的语言写。

与图表页同构——**结构化数据 + 共享渲染器**：

```ts
// src/data/legal/{privacy,about,contact,terms}.ts + en/*
interface LegalPage {
  slug: string;
  title: string;
  description: string;
  updated: string;                          // 显示给用户的最后更新日期
  sections: { heading: string; paragraphs: string[] }[];
}
```

走 React 渲染而非裸 HTML，以复用 Header/Footer/语言切换，保持站点一致。

隐私政策必须如实披露（按站点实际行为写）：AdSense 与第三方供应商的 Cookie（含 DoubleClick DART cookie）、GA4、账号体系的邮箱与密码哈希、localStorage 里的学习进度与 AI 配置、CMP 与同意撤回入口、数据删除请求的联系方式。

> **合规声明**：本设计产出的法律文本是**依据站点实际数据处理行为写的模板，不构成法律意见**。提交 AdSense 前应由站方复核，尤其 `/contact` 与数据删除流程。

`/contact` 使用 `support@syy.global`。

### 广告位

| 位置 | 投放 |
|---|---|
| 图表页：数据块之后、FAQ 之前 | ✅ 1 个 |
| 图表页：相关图表之后、页脚之前 | ✅ 1 个 |
| 知识点页（中文）：中部 + 底部 | ✅ 已有 2 个 |
| 学科 hub 页 / `/en/` hub | ❌ 以导航为主，属 AdSense「内容过少页面」政策灰区，收益也低 |
| 合规四页 | ❌ |
| 登录 / 注册 / 答题过程 | ❌（2026-10-01 spec 已定） |

hub 页不投放是刻意判断：那些页面的价值是内链枢纽，用 40 张卡片包围一个广告位收益微薄而政策风险实在。

### 先修占位槽位

`AD_SLOTS` 默认值从 `'0000000000'` 改成 `null`，`isAdConfigured` 相应要求非空。在拿到真实 slot id 之前 `AdUnit` 真的返回 null——**页面无空白框、预渲染 HTML 干净、无 CLS**。脚本照常加载，账号与站点的关联仍可验证。

### 时序

| 时间 | 动作 | 归属 |
|---|---|---|
| 第 1–2 周 | 内容 6→40、合规八页、GA4 + GSC、ad slot 真实化 | 开发 |
| 第 1 周 | GSC DNS TXT 验证；AdSense 后台建 ad unit 拿真实 slot id；确认联系邮箱 | 站方 |
| 第 3 周 | 提交 AdSense 站点审核 | 站方 |
| 第 3–4 周 | 审核期，并行铺 40→100 | 开发 |
| 第 5 周 | 获批 → 后台 Privacy & messaging 配 GDPR 消息（CMP） | 站方 |
| 第 5 周 | 配好 slot id 环境变量，广告正式上线 | 开发 |

### 会员关系

英文面**没有登录体系**——SEO 流量全是匿名访客，因此**永远看广告**，不存在「plus/pro 免广告」。2026-10-01 spec 里的会员免广告只作用于中文 app。明确记录，避免将来被误认为漏实现。

### 收益预期

第 5 周广告上线 ≠ 第 5 周有收益。新域名上的全新英文内容，从被索引到排上长尾词通常要 **3–6 个月**。教育/打印类内容的美英流量 RPM 大致在每千次展示 $2–8（区间很宽，取决于季节与品类）。

现实形状：**第 1–2 个月可能只有几百次会话/月，收益接近于零；真正的曲线在第 3 个月之后**，取决于内容能否排上去。本项目的价值在复利——100 页是可继续加到 300、500 页的底座，不是一次性投放。

## Section 5：实施分期、测试与风险

### 分期

五个阶段，每阶段独立可交付、独立可回滚。

**阶段 A — 内容模型地基**（一切的前提）
`types.ts` + `neutral/` 生成器 + 单测 → `en/{math,science,english}.ts` 迁移现有 6 页 + `index.ts` + `validate.ts` → 删除旧 `src/data/reference.ts`，接线 `seo/content-en.ts`

**阶段 B — 路由与渲染**
`reference-routes.ts` 新 URL 结构 → `BlockRenderer` + 三个 block 组件 → `ReferencePage` 重写 → `ReferenceCategory` 学科 hub + `ReferenceIndex` 重写 → `App.tsx` 路由 + worker 301 映射表 → 打印样式

**阶段 C — SEO 补完**
`PageContent.kind` 扩展 + `LearningResource` + `FAQPage` JSON-LD → 标题模板 → **og:image 管线单独一个 commit** → GA4 + 同意模式 → 内链

**阶段 D — 合规与变现**
`src/data/legal/` + `LegalPage` 组件 + 八页接线 → `AD_SLOTS` 占位改 `null` → 图表页第二个广告位

**阶段 E — 内容扩充**（与代码阶段解耦，可穿插）
6→40 页（**先易后难**，计算类排在前面，保证第 3 周有货可提交）→ 40→100 页

### 测试

| 层 | 内容 |
|---|---|
| 生成器 | 数值正确性（乘法表 12×13、√n 三位小数）+ **不变量断言**（`n² === n*n`、`sin²+cos²=1` 抽样） |
| 校验器 | `validateReferencePages` 负例：重复 slug、FAQ 不足 3 条、`related` 指向不存在的页 |
| 路由 | URL 生成、`:category` 非法值、6 条 301 映射 |
| 组件 | 三种 block 各自渲染、FAQ 列表、howToUse 列表、related 链接、广告位未配置时**不渲染** |
| SEO | title / description / JSON-LD 快照（沿用现有 `meta.test.ts` 模式） |
| 构建冒烟 | prerender 产物 HTML 含预期 title、`FAQPage`、`og:image` |

现有测试中三处会因结构变更失效，需同步更新：`reference-routes.test.ts`、`seo/content-en` 相关断言、`adPlacements.test.tsx`。

### 风险

**1. satori + resvg-wasm 是新增构建期依赖（中）**
satori 的 CSS 支持是子集（flex 好、grid 一般），首次接入大概率要调排版。隐性成本是字体子集——不提交字体文件它直接报错。缓解：单独一个 commit，失败可整体回滚；渲染失败已兜底成学科图，不会挂掉部署。

**2. 内容产能是最大的不确定性（高）**
这不是代码风险而是产能风险。100 页里非计算类（118 元素数据、语法表、几何公式）必须手写。缓解：阶段 E 严格先易后难，计算类 40 页排前面，保证第 3 周 AdSense 提交时货架是满的。

**3. 6 条 301 导致短期排名波动（低）**
只有 `/en/reference/*` 已被索引才会有感，属正常现象。

**4. 打印 CSS 跨浏览器差异（中）**
Chrome / Safari / Firefox 的分页与表头重复行为不同，**必须实机验证**，无法靠单测覆盖。

**5. `AdUnit` 依赖 `useAuth`（低）**
英文面目前由 `main.tsx` 全局 `AuthProvider` 包裹，没问题。若将来英文面走独立入口，这个依赖要重看。

## 附录：内容清单（约 100 页）

**Math（约 40）**
计算类：1–100 number chart、hundreds chart、number line、place value chart、fraction↔decimal↔percent、fraction strips、decimal place value、roman numerals、prime numbers、factors chart、rounding chart、times tables 1–20、division chart、addition/subtraction tables、exponents chart、logarithms table、trig values table、unit circle、metric conversion、imperial conversion、temperature conversion、Pythagorean triples、graph paper / coordinate plane
手写类：geometry formula sheet、area & perimeter、volume、surface area、circle formulas、angle types、polygon names、2D/3D shapes、symmetry、order of operations、integer rules、divisibility rules

**Science（约 25）**
metric prefixes、SI units、periodic table、electromagnetic spectrum、solar system data、planets、moon phases、rock cycle、water cycle、human body systems、cell organelles、biological classification、common chemical formulas、polyatomic ions、pH scale、gas laws、Newton's laws、energy types、circuit symbols、geologic time scale、weather symbols、photosynthesis、animal classification、physics constants ✅、lab safety symbols

**English（约 35）**
parts of speech、verb tenses、punctuation rules、capitalization、homophones、prefixes & suffixes、root words、sight words、phonics chart、digraphs & blends、vowel sounds、consonant sounds、syllable types、spelling rules、contractions、commonly misspelled words、transition words、sentence types、figurative language、literary devices、point of view、plot diagram、character traits、essay structure、citation formats、question words、pronoun chart、preposition list、conjunction list、adverb list、adjective order、comparative & superlative、active & passive voice、irregular verbs ✅

> 已完成 6 页：multiplication-chart、squares-cubes-roots、trigonometric-identities、physics-constants、metric-conversions、irregular-verbs

## 非目标

- **五语言 / 西语日韩语** —— 数据模型预留语言维度，但本批次只交付英文。
- **RTL 适配** —— 不含阿拉伯语。
- **中文课程内容翻译** —— 已放弃的路线。
- **对齐海外课标（Common Core / UK KS / SAT）** —— 需重做数据模型，不属本批次。
- **PDF 文件下载** —— 只有浏览器打印。因此标题不宣称 PDF。
- **中文站的内容/路由/组件改动** —— 只补 GA4 与 og:image 两项全站通用项。
- **hreflang 推导 / sitemap 拆分 / lastmod** —— 见 Section 3「明确不做的三项」。
- **hub 页广告** —— 见 Section 4 广告位表。
