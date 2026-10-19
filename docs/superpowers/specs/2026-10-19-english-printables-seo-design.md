# 英文打印资料搜索增长设计（Plan A）

日期：2026-10-19
状态：已确认（四节设计逐节确认）
上游：
- [2026-10-02 英文打印图表面 + AdSense 设计](./2026-10-02-english-seo-ads-design.md)
- [2026-10-06 出海变现扩张设计](./2026-10-06-paid-pdf-email-monetization-design.md)——本 spec 只执行其 Gate 0 的「先验证流量」，不触发支付、订阅、PDF 与 Email drip

## 0. 一句话

在 3–6 个月、每周 ≤5 小时的约束下，只做一件事：把英文可打印参考图表从 6 页扩到 20 页，同时修好收录、性能、合规与安全地基，验证「自然搜索能否带来稳定进站」。中文站冻结内容扩张，只做零成本修复。

## 1. 背景与诊断

### 1.1 线上实测（2026-10-19）

| 项 | 实测值 | 含义 |
|---|---|---|
| 站点状态 | `https://syy.global/` 200，Cloudflare | 已上线，不是未部署 |
| 可索引 URL | 303（sitemap 与预渲染文件一致） | 276 知识点 + 5 诗 + 10 英文 + 12 视图页 |
| 首页站内链接 | 1 个 `<a>` | 导航与学科卡片是 `button`，爬虫拿不到 |
| 知识点详情站内链接 | 0 个 `<a>` | 276 个页面没有入链，只能靠 sitemap 发现 |
| 知识点详情正文 | 约 211 词 | 一句话定义，属于薄内容 |
| 英文图表页正文 | 约 755 词 | 全站质量最高的面 |
| 主 JS | 6,367,037 B raw / 1,596,712 B gzip | 303 个页面共用同一个 chunk |
| 首屏 HTML | TTFB 0.68–1.13s，`cache-control: max-age=0`，`cf-cache-status: DYNAMIC` | 每个请求回源 Worker，未吃边缘缓存 |
| 静态资源缓存 | `max-age=14400, must-revalidate` | 带 hash 的资源可以更长 |
| 广告 | `AD_SLOTS` 默认全 `null` | 即使 AdSense 审核通过也展示 0 条广告 |
| 合规页 | 0 个 | 无 privacy / terms / about / contact |
| `ads.txt` | 200，发布商 id 与站点一致 | 这一项已就绪 |

### 1.2 三路只读审计结论

**工程**

- 主包 6.37MB 的根因：`src/App.tsx` 静态导入 Home、KnowledgeDetail、PoemDetail、Reference\*；`src/components/Home.tsx` 静态导入 11 个视图；`src/data/` 的题库（2.5MB）、知识点（2.1MB）、教程（1.3MB）全部进入主 chunk；全仓 0 处 `React.lazy`。
- SSR 用 `renderToString`（`src/entry-server.tsx`），引入 lazy 后必须在渲染前预加载路由模块，否则会 suspend 报错。
- 预渲染 HTML 已包含正文（SSR 可用），问题不在「JS 才能看到内容」，而在内链、体积、缓存。
- 认证：无 IP/邮箱频控；6 位验证码无尝试上限；改密后不删除 `sessions`。
- JWT：`worker/lib/jwt.ts` 在 `JWT_SECRET` 缺失时静默使用 fallback，任何人可自签 pro token。
- AI 配额：`SELECT + UPSERT` 非原子；流式请求提前返回，token 记账被跳过；`model` 由客户端任意传。
- D1 schema 漂移：`db/schema.sql` 没有 `ai_quota` 表（只存在于 `worker/migrations/0001_ai_quota.sql`）。

**内容**

- 6426 道题中 1583 道是模板占位（24.6%），59 个选项含未替换的 `${subject}`。
- 704 个题 ID 在小学数学与道德与法治之间冲突；21 组教程练习 ID 重复；9 条 `knowledgePointIds` 断链。
- 存量：276 知识点（小/初/高 = 171/59/46）、47 教程、187 速查表、30 公式、32 古籍章节、5 诗。
- 教程 47、题库 6426、速查表 187 没有独立 URL，全部藏在单个视图 URL 后面。
- 英文面只有 6 张图表 / 10 个 URL，但模板、JSON-LD、og、打印样式、FAQ、related 已经具备。

**体验**

- 学习数据只存 localStorage，登录后不同步；错题本只在练习完成态出现。
- 付费路径名存实亡：`RequireTier` 全站零引用，Paywall 按钮 `disabled`。
- 首页右栏默认是空占位；页脚只有版权一行；favicon 仍是 Vite 默认。
- AI 失败一律 `alert`，吞掉未登录/未配置/额度用尽等真实原因。

### 1.3 核心判断

项目的可索引页面数量已经够多，但**收录路径、页面质量、加载性能三者都不支撑排名**；同时中文教育 SERP 由巨头占据，且本站托管在 Cloudflare、无 ICP 备案，百度生态不占优。唯一能在现有约束下触达 Google、且单位经济更好的面，是**英文可打印参考图表**。

因此本轮不是「全面优化」，而是「用一个窄面验证 SEO 模型」：英文页做深、地基修好、中文冻结。

## 2. 为什么选 A（而不是 B / C）

| 路径 | 做什么 | 结论 |
|---|---|---|
| **A. 英文打印资料窄面（本 spec）** | 6 → 20 页，修地基，验证 Google 长尾 | **选它**：Google 可触达、无需备案；printable 意图明确；英文教育 RPM（$5–15）高于中文；已有 SSG/og/AdSense/reference 管线 |
| B. 中文速查表/知识点页面化 | 187 速查表 + 47 教程 + 276 知识点给独立 URL | 存量最快，但百度需备案/国内节点，Google 中文量小，中文 RPM 低；作为 A 验证后的第二曲线 |
| C. 先修质量与留存 | 清题库、账号同步、付费墙、首屏引导 | 没流量时留存/付费无法验证；只把其中零成本项并入 Phase 1 |

**A 的代价**：新域名权威低。3 个月主要看收录与 impressions；6 个月 100–300 clicks/月是合理预期；「稳定进站」更可能是 6–9 个月。

## 3. 范围与非目标

### 3.1 范围内

1. 英文参考图表 6 → 20 页，并把现有 6 页回填到统一标准。
2. 收录路径、首屏体积、缓存、合规页、安全 quick fixes、内容清理六项工程改造。
3. GSC / Bing / GA4 度量与 W1 / W4 / W12 / W24 四个 Gate。

### 3.2 非目标（本轮明确不做）

1. 中文内容不扩张：276 知识点不新增，只修内链与断链。
2. 不做账号同步、支付、订阅、PDF、Email drip（属于 10-06 spec 的 Gate 1+）。
3. 不把 6426 题库 / 47 教程 / 187 速查表页面化。
4. 不做中文 24 个学段/学科 hub 页（用 `/sitemap/` HTML 索引页替代）。
5. 不做全量架构重构、UI 改版、新增 AI 功能。
6. 不买外链、不做论坛灌水、不做批量社媒。

### 3.3 前提假设

- 能拿到 `syy.global` 的 Google Search Console 与 Bing Webmaster 权限。
- 英文内容由 AI 起草后**人工改写**，不需要母语级，但要能判断「像不像人写的、有没有用」。
- 每周真实可投入 ≤5 小时；若更少，按 5.8 的砍单顺序削减，Gate 指标不变。

## 4. 目标与成功标准

### 4.1 北极星

**连续 2 个月自然搜索 clicks ≥100/月，且 impressions 趋势向上。** 不追收入，不追注册。

### 4.2 Gate

| Gate | 时点 | 通过条件 | 通过后 | 未通过 |
|---|---|---|---|---|
| G0 | W1 | GSC + Bing 验证；sitemap 提交；基线记录完成 | 进入工程 | 先解决验证问题 |
| G1 | W4 | `/en/*` 首屏 JS ≤300KB raw；可索引页 ≥5 内链；HTML 边缘缓存命中；≥2 个新页 | 继续 | 砍功能保收录 |
| G2 | W12 | 英文页 ≥20；英文页收录率 ≥80%；30 天 impressions ≥1,000；≥5 个 query 进前 50 | 扩到 40 页 | 诊断 4 周再决定 |
| G3 | W24 | 连续 2 个月 clicks ≥100/月；impressions ≥5,000/月；≥3 个 query 进前 20 | 启动变现 Gate 1 | 转 B 或停止 |
| G4 | W24+ | AdSense 批准；RPM ≥$5 | 优化广告位 | 不影响主线 |

### 4.3 失败判定与转向

- **W12**：若 indexed <50% 或 impressions <200 → 先按 4.4 诊断并修技术；再给 4 周，仍无改善则判定「英文页竞争力不足」，转 B 或换关键词簇。
- **W24**：若 clicks <50/月且 impressions 不涨 → 停止扩页，转向外链/分发，或承认 SEO 模型不成立。
- **终止条件**：W16 时 20 页全部收录、技术项全绿、impressions 仍无增长 → 停止扩页。

### 4.4 诊断顺序

1. 没收录 → robots / canonical / noindex / sitemap / JS 渲染
2. 有收录没 impressions → 关键词需求太小或排名 >100 → 换词、加内链、补内容
3. 有 impressions 没 clicks → title / description / og 图
4. 有 clicks 但跳出高 → 页面质量、打印体验、移动端
5. 都正常但不涨 → 域名权威不足 → 内容深度 + 真实资源页外链（不买）

## 5. 工程改造

总预算约 25.5 小时（5.1–5.6），集中在 W1–W5，5.6 放在 W8；按 ROI 排序。

### 5.1 收录路径（W1–W2，约 6h）

- `src/components/Home.tsx`：初始化时默认选中第一个学科，让 SSR 右栏直接渲染知识点链接（现在是空占位 `KnowledgeList` 分支）。`KnowledgeList` 已使用 `<Link>`，无需改。
- `src/components/Header/NavMenu.tsx`：下拉项从 `button` 改为 `<Link to={pathForView(view)}>`；顶部大组仍是按钮。
- 新增全站页脚组件：站点地图、12 个视图链接、隐私/条款/关于/联系，全部真实 `<a>`；挂到 `Home`、`KnowledgeDetail`、`PoemDetail` 与英文 `ReferenceLayout`。
- `src/components/KnowledgeDetail/index.tsx`：面包屑（首页为链接；学段 · 学科为文本，不新增 hub 页）、同科相关知识点 5 条、返回列表改为 `<Link>`；「未找到」页同样用链接。
- 新增 `/sitemap/` HTML 索引页：按学段/学科列出全部可索引 URL（当前 303），预渲染，加入页脚链接。
- 英文面已有面包屑与 related（`ReferencePage` / `ReferenceCategory`），补齐 hub ↔ 图表 ↔ related 的闭环即可。

**验收**：每个可索引页 ≥5 条站内 `<a>`；首页到任意 URL ≤2 次点击；303 个 URL 全部出现在 `/sitemap/`；`/sitemap/` 本身不在 XML sitemap 中。

### 5.2 首屏瘦身（W2–W4，约 8h）

- App 级路由 `React.lazy`：Home / KnowledgeDetail / PoemDetail / ReferenceIndex / ReferenceCategory / ReferencePage 各自成 chunk；`/en/*` 不再下载 6.37MB。
- **SSG 约束**：`src/entry-server.tsx` 使用 `renderToString`，lazy 组件会 suspend。实现一个 `lazyWithPreload` 助手（导出 `preload()`），在 `render(route)` 前 `await` 当前路由的 preload，再 `renderToString`；客户端在 `hydrateRoot` 前用同一张路由表 preload 当前路径，避免水合闪烁。
- 中文首页先接受 Home chunk 仍偏大（约 2.5–3MB raw）；Phase 3 再拆 11 个视图与知识点数据。
- **Fallback**：若 lazy + SSR 预加载两轮迭代内搞不定，退到「英文独立 Vite entry（`en.html` + 迷你路由）」，只瘦英文页，中文不动。

**验收**：`/en/*` 首屏 JS ≤300KB raw；中文首页 ≤2.5MB raw；303 页仍全量预渲染；无 hydration 警告；`npm run build` 与 `npm test` 通过。

### 5.3 缓存与 TTFB（W3，约 2.5h）

- `worker/index.ts`：对 GET 且非 `/api/*` 的响应使用 Cache API（key = host + pathname），TTL 1 小时 + `stale-while-revalidate`；部署后自然过期，不需要手动 purge。
- hashed assets 包装为 `cache-control: public, max-age=31536000, immutable`（现在 4 小时 + must-revalidate）。
- **验收**：复访 `cf-cache-status: HIT`；TTFB p75 <400ms。

### 5.4 合规与信任页（W4–W5，约 4h）

- 新增 `/privacy/`、`/terms/`、`/about/`、`/contact/` 四页，中英双语内容同页，预渲染，全站页脚链接；联系邮箱 `support@syy.global`。
- 替换 favicon 与默认 Logo 资源；`index.html` 的 Vite 默认图标改为品牌图标。
- AdSense：CI 注入真实 `VITE_ADSENSE_SLOT_*`（现在默认 `null`，等于没广告）；`ads.txt` 已就绪；EEA/UK 使用 Google Privacy & Messaging 的认证 CMP。
- **验收**：四页可访问且被预渲染；页脚全站可见；英文图表页广告位真实渲染；打印时广告隐藏。

### 5.5 安全 quick fixes（W4，约 2.5h）

- `worker/lib/jwt.ts`：`JWT_SECRET` 为空直接抛错（fail-closed），不再使用 fallback。
- `worker/routes/auth.ts`：登录/注册/忘记密码按 IP + 邮箱限流；验证码 5 次失败作废；改密后删除该用户全部 `sessions`。
- `worker/routes/ai.ts`：配额原子化（单条 SQL 或 D1 batch）；流式请求也记 usage；`model` 用白名单。
- `worker/index.ts`：500 返回固定文案，不回传 `err.message`。
- `db/schema.sql`：补 `ai_quota` 表，与 `worker/migrations/0001_ai_quota.sql` 对齐。
- 新增路由测试：auth / ai / jwt 至少覆盖上述五条。

**验收**：五条都有测试；线上不存在 fallback secret；`db/schema.sql` 与 migrations 一致（补 `ai_quota`）。

### 5.6 内容清理（W8+，约 2.5h，AdSense 申请前）

- 脚本下线 1583 道占位题，修 59 处 `${subject}`。
- `scripts/ingest-data` 增加跨文件全局 ID 唯一校验与 `knowledgePointIds` 引用校验；修 704 个冲突 ID 与 9 条断链。
- **验收**：0 占位题、0 重复题 ID、0 断链；`npm run lint`、`npm test`、`npm run build` 全绿。

### 5.7 验收基线

- `/en` 图表页 Lighthouse mobile Performance ≥90，LCP ≤2.5s，TBT ≤200ms（lab；字段数据等有流量后看）。
- 可索引页 ≥5 内链，canonical / hreflang / JSON-LD 正确。
- 首屏 JS：`/en` ≤300KB raw；中文 ≤2.5MB raw。
- 预渲染 HTML 边缘缓存命中；TTFB p75 <400ms。

### 5.8 砍单顺序（时间不够时从下往上砍）

1. 必须：5.1 收录路径、5.2 英文瘦身、5.3 缓存、5.5 安全
2. AdSense 申请前：5.4 合规页、5.6 内容清理
3. 可延后：中文视图级拆分、中文 hub 页、题库/教程页面化

## 6. 内容与页面标准

### 6.1 选页原则

一页只打一个主关键词，且同时满足：

1. 有明确 **print / pdf / free** 意图，不是泛泛的「what is X」。
2. 我们能给出比前 10 名更好的可打印物（更清晰、A4/Letter 双适配、黑白友好、无 paywall）。
3. 前 10 名存在明显缺口（薄内容、强制注册、导出付费、移动端差）。

**不做**：按年级批量生成的同模板页、纯单词/公式罗列页、与现有页关键词互抢的页面（例如不拆 12 个「7 times table」独立页）。

### 6.2 新页清单（14 页，W3–W12）

| 簇 | slug（`/en/` 下） | 主关键词 | 备注 |
|---|---|---|---|
| 数 | `math/hundreds-chart` | printable hundreds chart | 1–100，含空白版 |
| 数 | `math/place-value-chart` | printable place value chart | 个位到百万，含小数版 |
| 数 | `math/number-line` | printable number line | −20–100，多刻度 |
| 数 | `math/roman-numerals` | roman numerals chart | 1–1000 + 转换规则 |
| 数 | `math/prime-numbers` | prime numbers chart | 1–100 + 判定方法 |
| 数 | `math/divisibility-rules` | divisibility rules chart | 2–12 |
| 数 | `math/fraction-decimal-percent` | fraction decimal percent chart | 常用换算表 |
| 数 | `math/area-perimeter-volume-formulas` | area perimeter volume formulas | 图形公式速查 |
| 测 | `math/customary-unit-conversions` | customary unit conversion chart | 美制单位，与现有 metric 页互补 |
| 科 | `science/si-unit-prefixes` | SI unit prefixes chart | 10⁻¹²–10¹² |
| 科 | `science/periodic-table` | printable periodic table | 数据现成；打印布局最重，排最后 |
| 英 | `english/phonics-sounds` | phonics sounds chart | 44 音素 |
| 英 | `english/sight-words` | sight words list printable | Dolch 220 |
| 英 | `english/parts-of-speech` | parts of speech chart | 8 类词性 |

现有 6 页（multiplication-chart、squares-cubes-roots、metric-conversions、trigonometric-identities、physics-constants、irregular-verbs）在 W3 抽查并补齐打印说明与内链（模板已具备 FAQ / related），约 1.5h。

### 6.3 单页标准（每页必须全过）

- **可打印主体**：A4 + Letter 双适配、黑白友好、打印时隐藏导航/广告/按钮、表格不跨页断裂。
- **正文 400–800 词**：这是什么 / 给谁用（年级段）/ 3 个具体用法（家长或老师能照着做）/ 打印说明 / 相关图表。
- **FAQ 3–5 条**：页面可见 + `FAQPage` JSON-LD。
- **内链 ≥5**：返回 hub + 3 个相关图表 + 英文首页（或首页）；带面包屑。
- **SEO**：title ≤60 字符、description 140–160、canonical、`hreflang=en` + `x-default`、构建期 og:image、`last updated`。
- **广告**：仅图表下方 1 个位置，打印时隐藏。
- **质量红线**：不出现未验证的数字/事实、不出现重复段落；每页至少一条「只有我们会给的具体建议」（例如「打印时选 Actual size，否则 1 cm 网格会缩成 0.9」）。

### 6.4 单页生产流程（目标 1.5–2h/页）

1. 关键词 + SERP 检查 15min（Google 自动补全 / People also ask；记录前 10 名的 3 个缺口）。
2. 数据块 30–45min（`src/data/reference/`，沿用 `Block[]`）。
3. 正文 AI 起草 + 人工改写 45min（必须重写开头与「怎么用」）。
4. 内链 + 构建 + 打印预览 20min。
5. GSC 提交 URL 5min。

### 6.5 分发（只做一件，可选）

每页 1 张 Pinterest pin（复用构建期 og 图），每周 ≤30min。不买外链、不做论坛灌水、不做批量社媒。

### 6.6 校验

- 扩展 `validateReferencePages`：词数 ≥400、内链 ≥5、FAQ 存在、主关键词唯一、无占位符/未替换变量；构建失败即阻断。
- 打印预览无截断；移动端宽表可横向滚动。
- W12 验收：英文页 ≥20（现有 6 + 新增 14），每页 ≥5 内链，0 薄页。

## 7. 度量与运营节奏

### 7.1 工具

- Google Search Console：域名属性（DNS 验证）+ 提交 sitemap；看 Indexed pages、Impressions、Clicks、Average position、CTR。
- Bing Webmaster Tools：从 GSC 导入 + 提交 sitemap（Bing 索引更快，可提前看趋势）。
- GA4：确认 `/en/*` 有 page_view；Pinterest 用 UTM。
- Cloudflare：Worker Analytics 看 TTFB 与缓存命中；包体积看构建日志。
- 周报：仓库内 `docs/seo/weekly-log.md`，每周一行，不另建系统。

### 7.2 W1 基线

记录：GSC 已收录页数（预计接近 0）、近 28 天 impressions/clicks、sitemap 303 个 URL、3 个关键模板（首页、知识点详情、英文图表）的 Lighthouse mobile 分数与 TTFB p50/p75。

### 7.3 每周 5 小时分配

| 事项 | 时间 |
|---|---|
| 内容（1–1.5 页） | 2.5h |
| 工程 | 1.5h |
| GSC / CWV / 周报 | 0.5h |
| Pinterest / 分发（可选） | 0.5h |

### 7.4 周报模板

```
| 周 | 新增页 | 英文页总数 | 收录数 | Impressions | Clicks | 平均排名 | 首屏 JS | 备注 |
|----|--------|------------|--------|-------------|--------|----------|---------|------|
```

## 8. 风险与缓解

| 风险 | 概率/影响 | 缓解 |
|---|---|---|
| 新域名权威低，长尾也排不上 | 高/高 | 只做低竞争长尾 + 内链 + Pinterest；W16 终止条件兜底 |
| AI 内容被判 scaled content | 中/高 | 每页人工重写开头与用法；禁止批量同模板；保持 2 页/周 |
| SSG + lazy 水合/预渲染出问题 | 中/中 | 时间盒 2 次迭代；失败退英文独立 entry |
| AdSense 拒批 | 中/中 | 先补合规页 + 清占位题再申请；W1–W8 不申请 |
| 每周 5h 不够 | 高/中 | 按 5.8 砍单；Gate 指标不变，页数可降 |
| 儿童隐私合规（COPPA/GDPR） | 低/高 | 英文站不收集账号/邮箱/儿童信息；隐私页写明；广告用认证 CMP |
| 版权/数据准确性 | 低/中 | 只用公有领域数据（元素周期表、Dolch 词表、数学事实）；正文原创 |

## 9. 实施顺序与工时

| 阶段 | 周次 | 内容 | 工时 |
|---|---|---|---|
| 0 度量 | W1 | G0、基线、GSC/Bing、sitemap | 2h |
| 1 收录 | W1–W2 | 5.1 全部 | 6h |
| 2 瘦身 | W2–W4 | 5.2 + 5.3 | 10.5h |
| 3 合规与安全 | W4–W5 | 5.4 + 5.5 | 6.5h |
| 4 内容 | W3–W12 | 6 页抽查 + 14 新页 + 校验 | 约 25h |
| 5 清理 | W8 | 5.6 | 2.5h |
| 6 Gate | W12 | G2 复盘与调整 | 2h |

合计约 54.5h，按 12 周摊 ≈4.5h/周，留少量缓冲。若实际更慢，优先保 Gate 指标、砍页数。

## 10. 本 spec 的完成定义

1. 英文页 ≥20，且每页通过 6.3 与 6.6 的检查。
2. G0 / G1 / G2 三个 Gate 的记录可在 `docs/seo/weekly-log.md` 查到。
3. 5.1 / 5.2 / 5.3 / 5.4 / 5.5 的验收项全部满足；5.6 在 AdSense 申请前满足。
4. `npm run lint`、`npm test`、`npm run build` 全绿。
5. 本文档不包含支付、订阅、PDF、Email drip——这些由 10-06 spec 的 Gate 1+ 决定。

## 附录 A：关键证据索引

- 主包体积：`dist/assets/index-*.js`（6,367,037 B）
- 静态导入：`src/App.tsx`、`src/components/Home.tsx`
- SSR 入口：`src/entry-server.tsx`（`renderToString`）
- 预渲染清单：`src/prerender/routes.ts`
- 英文路由表：`src/reference-routes.ts`
- 广告配置：`src/ads/config.ts`
- JWT fallback：`worker/lib/jwt.ts`
- 认证路由：`worker/routes/auth.ts`
- AI 配额：`worker/routes/ai.ts`
- 数据校验：`scripts/ingest-data/adapters/question-bank.ts`
- 英文页模板：`src/components/reference/ReferencePage.tsx`

## 附录 B：决策记录

| 决策 | 结论 | 理由 |
|---|---|---|
| 市场 | 英语国家 K-12 家长/老师 | Google 可触达、无需备案、RPM 高 |
| 页面数 | 6 → 20（W12），40（W24，若 G2 通过） | 5h/周产能下可交付 |
| 内容生产 | AI 起草 + 人工改写 | 纯 AI 直出有 scaled content 风险 |
| 中文 | 冻结扩张 | 百度生态不占优，避免分散 |
| 变现 | 本轮不做 | 没流量时无法验证 |
| 安全 | 进 Phase 1 | 成本低、风险高 |
| 英文瘦身 | 优先；中文暂时保留大包 | 本轮 KPI 在英文页 |
