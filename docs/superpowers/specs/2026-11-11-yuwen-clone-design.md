# 小学语文模块设计（yuwen.muduo.org 内容克隆）

> 日期：2026-11-11
> 状态：待批准（brainstorming 完成）
> 参考站：<http://yuwen.muduo.org/>

## 1. 概述

把参考站 yuwen.muduo.org（人教版小学语文生字站）的**内容全量克隆**进本项目，作为「工具速查 → 小学语文」入口下的独立内容模块：10 册课本 → 326 课 → 2988 个生字详情，外加拼音表、多音字、单元生字复习与可打印听写单。

参考站自述「按课文学生字：读音、同音字、形近字和组词，只用学过的字」。它的价值在于**把 2988 个生字挂回具体课文与单元**，这正是本项目现有 characters2000 / characters3500 字表所缺的上下文。

**核心决策**（来自 brainstorming，已逐条确认）：

| 维度 | 决策 |
|------|------|
| 克隆范围 | **全量**：课本 / 课 / 单字详情 / 生字复习 / 听写单 / 拼音表 / 多音字 |
| 视觉基准 | 沿用本项目设计系统重做外观，**保留原站全部交互**（隐藏拼音、点击朗读、笔顺动画、打印） |
| URL 形态 | **语义化路径**，全部挂 /yuwen 前缀；单元用三段式而非查询参数 |
| 预渲染 | **全量预渲染** + 全量 sitemap（约 5001 页） |
| 数据管线 | 沿用仓库既有的「抽取 → staging → 入库 → 静态 TS 数据」三管线 |
| 导航位置 | 现有「工具速查」分组新增「小学语文」 |

## 2. 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 模块边界 | 独立路由树 /yuwen/*，不并入 Home 的 ViewType 视图切换 | 9 类页面、3878 条路由；塞进 Home 会让它变成第二个 App |
| 数据形态 | 静态 TS 模块 src/data/yuwen/*.ts | 与仓库其余数据一致；预渲染在 Node 里直接 import，无额外 I/O |
| 数据加载 | 整个模块走独立懒加载 chunk | 数据约 1–1.5MB，不能进首屏 |
| 派生字段 | 入库时算好（同音字、字→部件、单元区间） | 运行时只剩查表；避免部件关系被重复存上百遍 |
| 抓取实现 | 新增 yuwen-muduo adapter，复用 scripts/extract-data 框架 | 限速/重试/缓存/信封都是现成的；重跑成本低 |
| 入库语义 | yuwen kind **整树重写**（唯一一处偏离「只追加不覆盖」） | 该 kind 独占整棵 src/data/yuwen/ 子树；追加会让重跑产生新旧混杂 |
| 笔顺 | hanzi-writer（npm，MIT）+ 默认 CDN 笔画数据 | 数据不进 bundle；与原站同源（hanzi-writer-data，Arphic 许可） |
| 朗读 | 浏览器 speechSynthesis，rate 0.8 | 与原站行为一致，零成本、无第三方服务 |
| 导航改动 | 放宽 nav item 类型（支持 to 路径），**不动 ViewType** | 避免牵扯 Home 渲染分支与 Worker 的 KNOWN_VIEWS 同步副本 |
| 中文路径 | 保留中文（/yuwen/char/天），补 canonical 编码与 Worker 解码 | URL 可读、SEO 友好；编码问题用纯函数 + 单测收口 |
| 署名 | /yuwen 各页页脚标注数据来源 | 内容来自第三方站点，标明出处是基本礼貌 |

## 3. 范围

**做**：10 册索引、326 课详情、2988 字详情（笔顺/读音/同音字/字形/组词）、79 个单元生字复习、79 张听写单（打乱/提示/答案选项 + 打印）、393 个韵母拼音页、158 个多音字页、全量预渲染 + sitemap、导航与移动端入口、AGENTS.md / CLAUDE.md 同步。

**不做**（明确出界）：站内搜索、学习进度/错题本联动、描红的手写正确性判定（描红只演示笔顺）、原站的 GA / Cloudflare Insights、英文翻译、字表增删维护 UI。

## 4. 架构与数据流

~~~
yuwen.muduo.org
   │  scripts/extract-data/adapters/yuwen-muduo.ts（限速 200ms / 重试 / 缓存）
   ▼
staging/yuwen/generated-<ts>.json     单一信封：books/lessons/chars/stems/duoyin/radicals
   │  scripts/ingest-data/adapters/yuwen.ts（satisfies + TS 编译器真类型校验）
   ▼
src/data/yuwen/{books,lessons,chars,pinyin,duoyin,radicals}.ts + index.ts（运行时索引）
   │
   ├── src/components/yuwen/*（9 个页面 + 6 个原语 + 页面骨架）
   ├── src/prerender/routes.ts（3878 条路由 → 预渲染 + sitemap）
   └── src/seo/content-zh.ts（标题/描述/面包屑按数据派生）
~~~

## 5. 站点结构与规模

| 参考站路径 | 克隆后路径 | 数量 |
|---|---|---|
| / | /yuwen | 1 |
| /book/1a … /book/5b | /yuwen/book/1a … | 10 |
| /lesson/G1A01 | /yuwen/lesson/G1A01 | 326 |
| /char/天 | /yuwen/char/天 | 2988 |
| /pinyin | /yuwen/pinyin | 1 |
| /pinyin/a | /yuwen/pinyin/a | 393 |
| /duoyin | /yuwen/duoyin | 1 |
| /chars?start=G1A01&end=G1A06 | /yuwen/review/1a/1 | 79 |
| /tingxie?start=…&end=… | /yuwen/tingxie/1a/1（?shuffle=1&hint=1&answers=0） | 79 |

单元数（抓取时从各册页得到）：1a–5a 各 8 个，5b 7 个，合计 79。

**路由总量 3878 条**；现有预渲染 1123 条，合并后约 **5001 页**，XML sitemap 约 5000 条 URL（HTML 站点地图自身仍不入 sitemap）。

## 6. 文件清单

### 新增

~~~
scripts/extract-data/adapters/yuwen-muduo.ts          抽取适配器（6 个解析器）
scripts/extract-data/adapters/yuwen-muduo.test.ts
scripts/extract-data/__fixtures__/yuwen/{index,book,lesson,pinyin,duoyin,char}.html
scripts/ingest-data/adapters/yuwen.ts                 入库适配器（整树重写）
scripts/ingest-data/adapters/yuwen.test.ts

src/data/yuwen/types.ts                               数据模型（手写）
src/data/yuwen/{books,lessons,chars,pinyin,duoyin,radicals}.ts   生成
src/data/yuwen/index.ts                               生成 + 运行时索引/查询
src/data/yuwen/index.test.ts

src/yuwen/paths.ts                                    路由常量与 URL 构造/反解
src/yuwen/paths.test.ts

src/components/yuwen/YuwenPageShell.tsx               页面骨架（Header + container + Footer）
src/components/yuwen/YuwenIndexPage.tsx
src/components/yuwen/YuwenBookPage.tsx
src/components/yuwen/YuwenLessonPage.tsx
src/components/yuwen/YuwenReviewPage.tsx
src/components/yuwen/YuwenTingxiePage.tsx
src/components/yuwen/YuwenPinyinIndexPage.tsx
src/components/yuwen/YuwenPinyinStemPage.tsx
src/components/yuwen/YuwenDuoyinPage.tsx
src/components/yuwen/YuwenCharPage.tsx
src/components/yuwen/ZiGrid.tsx                       田字格大字格
src/components/yuwen/PinyinToggle.tsx                 隐藏/显示拼音
src/components/yuwen/SpeakButton.tsx                  朗读按钮
src/components/yuwen/WordList.tsx                     组词
src/components/yuwen/CharChips.tsx                    同音字/部件字 chips
src/components/yuwen/BishunSection.tsx                笔顺动画 + 描红
src/components/yuwen/hooks/useSpeech.ts
src/components/yuwen/*.test.tsx
~~~

### 修改

~~~
scripts/extract-data/core/runner.ts                   REGISTRY 注册 yuwenMuduoAdapter
scripts/ingest-data/registry.ts                       registry 注册 yuwenAdapter
src/App.tsx                                           9 条 /yuwen/* 路由（懒加载）
src/routing/route-modules.ts                          9 个 RouteKey + lazyWithPreload
src/prerender/routes.ts                               allYuwenRoutePaths() 并入 PRERENDER_PATHS
src/seo/content-zh.ts                                 resolveYuwenContent（标题/描述/面包屑）
src/seo/meta.ts                                       canonicalUrl 对中文路径做 encodePath
src/components/Header/nav-items.ts（新增）             NAV_GROUPS 单一事实来源
src/components/Header/NavMenu.tsx                     支持 { to } 项与路径前缀激活
src/components/Header/MobileNav.tsx                   改用共享 NAV_GROUPS + 激活态
src/components/Header/index.tsx                       activeView 放宽为 ViewType | null
src/components/HtmlSitemap.tsx                        增「小学语文」区块（10 册 + 2 个工具页）
src/styles/ui.css                                     yuwen 原语 + @media print 听写单
worker/lib/static-paths.ts                            PRERENDERED_SURFACES += '/yuwen'；候选路径解码
worker/lib/static-paths.test.ts
AGENTS.md / CLAUDE.md                                 补该模块入口与命令（实现完成后）
~~~

## 7. 数据模型

src/data/yuwen/types.ts：

~~~
/** 一册课本。units 保留原站单元划分，供复习/听写页使用。 */
export interface YuwenBook {
  id: string;              // '1a' … '5b'
  title: string;           // '一年级上册'
  grade: 1 | 2 | 3 | 4 | 5;
  term: 'a' | 'b';
  lessonCount: number;
  charCount: number;
  units: YuwenUnit[];
}

export interface YuwenUnit {
  no: number;              // 1..8
  lessonIds: string[];     // ['G1A01','G1A06']
}

/** 一课。chars 按课文顺序排列（去重）。 */
export interface YuwenLesson {
  id: string;              // 'G1A01'
  bookId: string;
  unitNo: number;
  title: string;           // '识字1：天地人'
  preview: string;         // '天地人你我他'
  chars: string[];
}

/** 单字。readings 已按拼音表合并；radicals 是所属部件名。 */
export interface YuwenChar {
  ch: string;
  readings: YuwenReading[];
  radicals: string[];      // ['土']
}

export interface YuwenReading {
  py: string;              // 'dì'
  stem: string;            // 'di'
  lessonId?: string;       // 首次出现于哪一课；无归属则缺省
  words: string[];         // 该读音的词
}

/** 拼音表条目。rows 按声调分组，chars 保持原站顺序。 */
export interface YuwenStem {
  stem: string;            // 'a' / 'zhang'
  rows: { py: string; chars: string[] }[];
}

/** 多音字。 */
export interface YuwenDuoyin {
  ch: string;
  readings: { py: string; words: string[]; lessonId?: string }[];
}

/** 部件 → 含该部件的字。「提土旁」这类名称只做展示。 */
export interface YuwenRadical {
  name: string;            // '土'
  label?: string;          // '提土旁'
  chars: string[];
}
~~~

**存储约简**：不存「每个字的同音字 / 形近字列表」，分别由 pinyin（按精确 py 分组）与 radicals（反查）在 index.ts 里一次建好 Map。这样同一信息不会在 2988 个条目里重复上百遍。

src/data/yuwen/index.ts 导出：

~~~
export const YUWEN_BOOKS: YuwenBook[];
export const YUWEN_LESSONS: YuwenLesson[];
export const YUWEN_CHARS: YuwenChar[];
export const YUWEN_STEMS: YuwenStem[];
export const YUWEN_DUOYIN: YuwenDuoyin[];
export const YUWEN_RADICALS: YuwenRadical[];

export function bookById(id: string): YuwenBook | undefined;
export function lessonById(id: string): YuwenLesson | undefined;
export function charByChar(ch: string): YuwenChar | undefined;
export function stemByStem(stem: string): YuwenStem | undefined;
export function duoyinByChar(ch: string): YuwenDuoyin | undefined;
export function homophonesOf(ch: string, py: string): string[];   // 同音字（不含自身）
export function charsOfRadical(name: string): string[];
export function unitOf(bookId: string, unitNo: number): { lessons: YuwenLesson[]; chars: string[] } | undefined;
export function charsOfLesson(lessonId: string): string[];
~~~

不变量：ch 全局唯一；stem 全局唯一；lessonId/bookId 引用必须存在（入库校验）；同册内 lessonIds 顺序即课文顺序；unitOf().chars 去重且保持课文顺序。

## 8. 抓取管线

scripts/extract-data/adapters/yuwen-muduo.ts，实现现有 Adapter 契约（listUrls / fetchHtml / parseHtml / normalize）：

- kind: 'yuwen'，name: '小学语文（人教版生字）'
- listUrls()：从首页取 10 册 → 每册页取课文 id 与单元边界 → 加上 /pinyin、/duoyin、以及拼音表页里出现的全部 /char/<字>（去重 2988 个）。合计约 3380 个 URL。
- parseHtml(url, html) 按路径分派 6 个解析器：

| 页面 | 解析产出 |
|---|---|
| 首页 / | 册列表（id、标题、课数、生字数） |
| /book/:id | 单元划分 + 每课标题与 preview |
| /lesson/:id | 有序生字表、按字分组的组词 |
| /pinyin | 393 个韵母条目、每个声调行的 py 与字 |
| /duoyin | 158 个多音字的读音/词/首次出现课 |
| /char/:ch | 读音（含学于哪课）、同音字、部件与含该部件的字、组词 |

- normalize() 归一为单一信封：{ source:'yuwen-muduo', extractedAt, books, lessons, chars, stems, duoyin, radicals }
- 交叉校验（normalize 内）：课的生字 ⊆ 拼音表字全集；多音字的字 ⊆ 字全集；单元区间连续覆盖该册全部课；缺一即报错（**宁可失败也不产出半套数据**）。
- 限速 200ms/请求（约 11–13 分钟）；重试与 HTML 缓存由框架负责，重跑命中缓存。

## 9. 入库管线

scripts/ingest-data/adapters/yuwen.ts：

- typeRef：src/data/yuwen/types.ts 下的一组类型，用 satisfies 做真类型校验（与其余 kind 同一套机制）。
- validate() 业务规则：册 id 形如 [1-5][ab]；课 id 形如 G[1-5][AB]\d{2} 且前缀与册一致；每课至少 1 个生字；**各册 lessonCount/charCount 与 units/lessons 汇总一致**且课的生字并集等于字表全集；stem 与声调拼音一致；引用完整性（第 7 节不变量）。数量不写死，避免参考站内容增补后重跑被判失败。
- merge()：**整文件重写** 6 个数据文件，文件头写「由 scripts/ingest-data 生成，请勿手改。来源：yuwen.muduo.org」。
- wire()：重写 src/data/yuwen/index.ts（运行时索引与查询函数）。
- --dry-run 只校验不写盘。

**这是唯一偏离「只追加不覆盖」的 kind**，适配器文件顶部注释说明理由：参考站更新后必须整树替换，追加会产生新旧混杂。

## 10. 路由与 URL

src/yuwen/paths.ts 为唯一事实来源：

~~~
export const YUWEN_BASE = '/yuwen';
export const YUWEN_HOME = '/yuwen';
export function bookPath(id: string): string;            // /yuwen/book/1a
export function lessonPath(id: string): string;          // /yuwen/lesson/G1A01
export function charPath(ch: string): string;            // /yuwen/char/天
export function reviewPath(bookId: string, unitNo: number): string;
export function tingxiePath(bookId: string, unitNo: number, opts?: {
  shuffle?: boolean; hint?: boolean; answers?: boolean;
}): string;
export function pinyinPath(stem?: string): string;
export function duoyinPath(): string;
export function isYuwenPath(pathname: string): boolean;  // /yuwen 或 /yuwen/…
export function allYuwenRoutePaths(): string[];          // 3878 条，返回**未编码**的原始路径，供预渲染/sitemap
~~~

原始路径（未编码）是这里的唯一表示：预渲染用 outputFileFor 落成 dist/yuwen/char/天/index.html 这样的中文目录，链接由 React Router 负责编码，canonical/sitemap 在第 14 节统一编码。三者都从同一份原始路径派生。

路由注册（src/App.tsx + src/routing/route-modules.ts）：

~~~
/yuwen                           YuwenIndexPage
/yuwen/book/:bookId              YuwenBookPage
/yuwen/lesson/:lessonId          YuwenLessonPage
/yuwen/review/:bookId/:unitNo    YuwenReviewPage
/yuwen/tingxie/:bookId/:unitNo   YuwenTingxiePage
/yuwen/char/:ch                  YuwenCharPage
/yuwen/pinyin                    YuwenPinyinIndexPage
/yuwen/pinyin/:stem              YuwenPinyinStemPage
/yuwen/duoyin                    YuwenDuoyinPage
~~~

页面内遇到不存在的 id / 字 / 韵母 → 渲染统一「找不到」空状态（不抛错、不跳首页），客户端与预渲染同一套组件。

?shuffle / hint / answers 是听写单可选参数，**不参与预渲染路径**（预渲染只产出默认参数页面），切换走 useSearchParams。

## 11. 组件与交互

### 11.1 页面骨架

YuwenPageShell：page-shell + Header（activeView=null）+ container-page pt-10 + Footer；子页面只负责 page-head 与正文。面包屑用 breadcrumb 原语，逐级指回册/课。

### 11.2 原语

| 组件 | 行为 |
|---|---|
| ZiGrid | 田字格大字 + 拼音；size 取 md（课内）/lg（复习页）/sm（组词行）；每格链到字详情 |
| PinyinToggle | 切换 hide-py 状态，写 localStorage.yuwen_hide_pinyin；首屏前内联初始化避免闪烁 |
| SpeakButton | speechSynthesis，lang='zh-CN'、rate 0.8、先 cancel()；不支持时整块不渲染 |
| WordList | 组词 chips，带朗读 |
| CharChips | 同音字 / 含某部件的字；支持 current 高亮 |
| BishunSection | useEffect 里 await import('hanzi-writer')；笔画数据走默认 CDN loader；无数据/无网络时整段隐藏；提供播放笔顺、描红练习与逐笔小格 |

### 11.3 各页要点

- **首页**：10 张册卡片（课数/生字数 + 单元按钮）；顶部两个工具入口；page-lead 说明。
- **册页**：每单元一节，单元头带「生字复习」「听写单」两个次按钮，下面是课文列表（标题 + preview）。
- **课页**：本课生字大字格 + 组词逐字行；「听写单」「隐藏拼音」按钮；底部上一课/下一课。
- **复习页**：按课分节的大字格；顶部「打印听写单」「隐藏拼音」。
- **听写单**：三个下拉（顺序/提示/答案）即时切 URL 参数；纸张区域含标题、范围、姓名/日期/得分、题号 + 拼音 + 空田字格；附答案页；「打印」调 window.print()。
- **字详情**：hero（大字 + 全部读音）→ 笔顺 → 读音（拼音标签、朗读、所属课、组词、同音字）→ 字形（部件 + 含该部件的字）→ 组词。
- **拼音表**：按韵母分组，每韵母下按声调分行；索引页给 393 个韵母的字母导航。
- **多音字**：每字一段，按读音分行，每行读音标签 + 朗读 + 词表 + 首次出现课。

## 12. 导航

- 新增 src/components/Header/nav-items.ts，把 NAV_GROUPS 抽成单一事实来源，NavMenu 与 MobileNav 共用（现在两处各写一份，加一项要改两遍，顺手收口）。
- 条目类型：

~~~
export interface NavItem {
  label: string;
  view?: ViewType;   // 视图路由（走 pathForView）
  to?: string;       // 独立页面路由（如 /yuwen）
}
~~~

- 「工具速查」加 { label: '小学语文', to: '/yuwen' }，作为该组第一项。
- 激活态：item.view === activeView 或（item.to 且当前 pathname 属于该路径）——组级高亮同理。
- Header 的 activeView 放宽为 ViewType | null；/yuwen 页面传 null，onViewChange 照旧 navigate(pathForView(view))。
- **不动** ViewType、Home、view-routes.ts、Worker 的 KNOWN_VIEWS。

## 13. SEO 与预渲染

- src/seo/content-zh.ts 增 resolveYuwenContent(appPath)，在知识库/诗词分支之后、兜底之前分派。标题/描述按数据派生，例：
  - /yuwen：小学语文生字表 · 人教版 1–5 年级
  - /yuwen/book/1a：一年级上册生字表（41 课 · 300 字）
  - /yuwen/lesson/G1A01：识字1：天地人 · 生字与组词
  - /yuwen/char/天：天（tiān）的读音、笔顺、组词与字形
  - 面包屑：首页 › 小学语文 › 一年级上册 › 识字1：天地人 › 天
- src/prerender/routes.ts：PRERENDER_PATHS 并入 allYuwenRoutePaths()，sitemap 一并收录。预计打印 prerendered 5001 pages。
- **og 图**：不为 yuwen 单独生成（沿用「无图则不输出 og:image」的现状），实现时确认 buildSeoMeta 的兜底行为。
- **HTML 站点地图**：只列 /yuwen、10 册、/yuwen/pinyin、/yuwen/duoyin（13 条）——2988 个字链接会让页面臃肿，字页靠册/课页与 sitemap 发现。

## 14. 中文路径编码（专项）

/yuwen/char/天 要同时满足三处：

| 位置 | 现状 | 改法 |
|---|---|---|
| canonical / og:url / JSON-LD | canonicalUrl 原样拼接路径 | 新增纯函数 encodePath(path)（encodeURI 语义，幂等），canonicalUrl 调用它；单测覆盖中文、已编码、含空格 |
| sitemap.xml | canonicalUrl + escapeXml | 随 canonicalUrl 一起编码，无需另改 |
| Worker 静态资源 | assetCandidates 直接用 pathname 拼磁盘路径 | 对 pathname 做 decodeURIComponent（try/catch 兜底原值）；单测覆盖 /yuwen/char/%E5%A4%A9 → /yuwen/char/天/index.html |

本地用 wrangler dev 实测一条中文路径必须 200 且 body 含该字，避免「只在预渲染产物里正确、线上 404」。

## 15. Worker

- worker/lib/static-paths.ts：PRERENDERED_SURFACES 加 '/yuwen'，让 /yuwen/ 下拼错的路径返回 404 而不是软 404 空壳。
- 带 . 的路径仍按原逻辑只试单条候选（文件资源）。
- 边缘缓存与其余路由行为不变。

## 16. 样式与打印

src/styles/ui.css 新增 @layer components 段：

~~~
.zi-grid / .zi-cell / .zi-cell__py / .zi-cell__ch    田字格网格
.zi-cell--current                                     当前字高亮
.yuwen-book-grid / .yuwen-book-card                   首页册卡片
.tx-sheet / .tx-grid / .tx-box / .tx-key              听写单纸张
@media print { .site-header, .site-footer, nav { display: none } .tx-sheet { page-break-after: always } }
~~~

- 只用 token（OKLCH 变量与既有原语），不写 hex；不写 bg-[paper-2] 这类失效的方括号主题名；transition 只动 transform/opacity/颜色。
- 打印样式只影响 /yuwen/tingxie/*，用 @media print 内选择器限定。

## 17. 测试矩阵

| 层 | 测试文件 | 覆盖点 |
|---|---|---|
| 抽取 | yuwen-muduo.test.ts + 6 份 fixtures | 6 个解析器各至少 1 例；缺字段容错；normalize 交叉校验失败时报错 |
| 入库 | yuwen.test.ts | 类型校验拒绝坏数据；业务规则（id 形态、引用完整性、数量断言）；dry-run 不写盘；整树重写幂等 |
| 数据运行时 | src/data/yuwen/index.test.ts | 同音字分组、部件反查、unit 区间与字的顺序、课/册查询、未知 id 返回 undefined |
| 路由 | src/yuwen/paths.test.ts | 9 类 URL 构造；isYuwenPath 边界（/yuwenx 不算）；allYuwenRoutePaths() 数量与唯一性 |
| 组件 | src/components/yuwen/*.test.tsx | ZiGrid 渲染拼音与字；PinyinToggle 读写 localStorage；不支持语音时不渲染按钮；听写单三种参数组合；BishunSection 在 mock hanzi-writer 下渲染步骤与无数据隐藏 |
| SEO | src/seo/content-zh.test.ts（新增）、src/seo/meta.test.ts（扩展）、src/seo/files.test.ts（扩展） | yuwen 6 类路径的标题/描述/面包屑；canonical 中文编码、幂等、与 sitemap 一致 |
| Worker | worker/lib/static-paths.test.ts | /yuwen/... 只试目录候选；/yuwen/char/%E5%A4%A9 解码命中；/yuwen/typo 不回落 app shell |
| 预渲染 | src/prerender/routes.test.ts（扩展） | yuwen 路由全部进 PRERENDER_PATHS 与 sitemap |

## 18. 验收标准

1. npm run lint 零错误（含 scripts/）。
2. npm test 全绿，新增用例覆盖第 17 节全部行。
3. npm run build 通过，日志打印 prerendered 5001 pages（±10），dist/sitemap.xml 条数约 5000 且中文路径为百分号编码。
4. npm run preview 手点：首页 → 册 → 课 → 字 → 复习 → 听写单（打印预览字段正确）→ 拼音表 → 韵母页 → 多音字；隐藏拼音开关跨页保持；朗读可用；笔顺可播放、无数据时整段隐藏。
5. wrangler dev 下 /yuwen/char/天 返回 200 且 HTML 含该字；/yuwen/不存在 返回 404。
6. 首屏 bundle 不因该模块增长（/yuwen 数据在独立 chunk）。
7. 顶栏与移动端抽屉都能进入「工具速查 → 小学语文」，进入后该分组高亮。
8. 页脚数据来源署名存在。

## 19. 风险与降级

| 风险 | 概率 | 对策 |
|---|---|---|
| 参考站限速/封禁 | 中 | 200ms 间隔 + UA + 重试 + 缓存；失败可续跑。**降级**：只抓 338 个结构页（首页/册/课/拼音/多音字），字详情由结构数据派生（字页降级为读音 + 组词 + 同音字 + 所属课），后续补抓 |
| 参考站改版导致解析失败 | 中 | 解析器单测 + fixtures 锁结构；normalize 交叉校验直接报错而非静默产出 |
| 中文路径线上 404 | 中 | 第 14 节两处改动 + wrangler dev 实测 + 单测 |
| 数据量影响构建 | 低 | 增量约 1–1.5MB，预渲染 +25–40 秒 |
| hanzi-writer CDN 依赖 | 低 | 无网络时整段隐藏（与原站一致）；后续可自托管数据 |
| 版权/署名 | — | 页脚署名，不在本项目主张版权；如你有其他要求，实现前告知 |

## 20. 后续（不在本次范围）

- 生字与现有知识点/题库打通（字详情页挂该字练习题）。
- 学习进度：标记「已掌握/待复习」，接入 useLearningProgress。
- 自托管 hanzi-writer-data，去掉 CDN 依赖。
- 英文站立面（当前仅中文）。

## 21. 实施顺序（供 writing-plans 使用）

1. 数据模型 + 抽取适配器（含 fixtures 与单测）→ 实跑抓取落 staging
2. 入库适配器 + 数据文件生成 + 运行时查询层（含单测）
3. 路由常量 + 9 个页面组件 + 原语 + 样式（含组件单测）
4. 导航改动（共享 nav-items、NavMenu / MobileNav / Header）
5. SEO content + canonical 编码 + prerender 路由 + sitemap + HTML sitemap
6. Worker 静态路径（解码 + PRERENDERED_SURFACES）+ 测试
7. 全量构建与验收（第 18 节逐条），文档同步
