# 英文打印资料搜索增长 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 把 303 个预渲染页接上真实内链，把 /en/* 首屏 JS 从 6.37MB 降到 ≤300KB，加上边缘缓存、合规页与真实广告位；随后按 14 页清单扩英文图表，验证自然搜索进站。

**Architecture:** 先修「爬虫看得见的链接」（页脚、导航、详情页、HTML sitemap），再做 App 级懒加载 + SSR 预加载，最后补 Worker 缓存、合规页与安全 quick fixes。每一步可独立发布，不阻塞内容生产。

**Tech Stack:** React 19、React Router 7、Vite 7、TypeScript 5.9、Vitest 5、Cloudflare Workers、Tailwind CSS 4。

**Spec:** docs/superpowers/specs/2026-10-19-english-printables-seo-design.md

---

## File Structure

新建：

- src/components/Footer.tsx — 全站页脚
- src/sitemap.ts — HTML sitemap 数据与路径常量
- src/components/HtmlSitemap.tsx — /sitemap 页面
- src/routing/lazy-with-preload.tsx — 支持预加载的懒加载组件
- src/routing/route-modules.ts — 路由到懒加载组件表
- src/routing/preload.ts — 路径到预加载函数
- src/data/knowledge/related.ts — 同科相关知识点
- src/components/legal/ — 隐私、条款、关于、联系
- worker/lib/cache.ts、worker/lib/rate-limit.ts
- docs/seo/weekly-log.md、docs/seo/content-backlog.md

修改：

- src/App.tsx、src/main.tsx、src/entry-server.tsx、src/entry-prerender.ts
- src/components/Home.tsx、Header/NavMenu.tsx、KnowledgeDetail/index.tsx、reference/ReferenceLayout.tsx、poetry/PoemDetail.tsx
- src/prerender/routes.ts、src/seo/content-zh.ts
- src/data/reference/validate.ts、en/english.ts
- worker/index.ts、worker/routes/auth.ts、worker/routes/ai.ts、worker/lib/jwt.ts、db/schema.sql
- index.html、.github/workflows/deploy-cloudflare.yml

---

## Phase 1 — 收录路径

### Task 1: 基线、周报与内容 backlog

**Files:** Create docs/seo/weekly-log.md, docs/seo/content-backlog.md

- [ ] Step 1: 新建 weekly-log.md，写入基线（日期 2026-10-19、sitemap 303 URL、主包 6,367,037 B、GSC 收录数待填），并留出周表：周 / 新增页 / 英文页总数 / 收录数 / Impressions / Clicks / 平均排名 / 首屏 JS / 备注。
- [ ] Step 2: 新建 content-backlog.md，按 spec 6.2 列出 14 个 slug、主关键词、状态、上线日期、GSC impressions 五列。
- [ ] Step 3: 提交。

~~~bash
git add docs/seo
git commit -m "docs(seo): add weekly log and content backlog"
~~~

### Task 2: 全站页脚与真实链接

**Files:** Create src/components/Footer.tsx, src/components/Footer.test.tsx；Modify src/components/Home.tsx, src/components/KnowledgeDetail/index.tsx, src/components/Header/NavMenu.tsx

- [ ] Step 1: 写失败测试 Footer.test.tsx：用 MemoryRouter 渲染 Footer，断言链接数 ≥5，且「站点地图」链接 href 为 /sitemap。
- [ ] Step 2: 运行 npx vitest run src/components/Footer.test.tsx，确认 FAIL（模块不存在）。
- [ ] Step 3: 实现 Footer.tsx：

~~~tsx
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: '知识点', to: '/' },
  { label: '教程', to: '/tutorial' },
  { label: '速查表', to: '/cheatsheet' },
  { label: '题库练习', to: '/practice' },
  { label: '古诗词', to: '/poetry' },
  { label: '站点地图', to: '/sitemap' },
] as const;

export function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-[#F0F1F2] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-[#646A73] hover:text-[#3370FF]">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-sm text-[#646A73]">
          © {new Date().getFullYear()} 拾艺院 (Shi Yi Yuan). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
~~~

- [ ] Step 4: Home.tsx 删除内联 footer 与只为页脚服务的 year state/effect，在 </main> 后渲染 <Footer />；KnowledgeDetail/index.tsx 在页面末尾渲染 <Footer />。
- [ ] Step 5: 写 Home 的 SSR 测试 Home.test.tsx：renderToString(<MemoryRouter><Home /></MemoryRouter>) 的输出匹配 href="/knowledge/ 形式，用它证明首屏有知识点链接。
- [ ] Step 6: 修改 Home.tsx 初始 selectedSubject 为 KNOWLEDGE_DATA[0].subjects[0]，handleGradeChange 同时选中新学段第一个学科。运行测试确认 PASS。
- [ ] Step 7: 写 NavMenu.test.tsx：渲染后点击「学科学习」，断言 menuitem「教程」的 href 为 /tutorial；把 NavMenu.tsx 下拉里的 button 改成 Link（to=pathForView(view.value)，onClick 只负责关闭菜单）。
- [ ] Step 8: 运行 npx vitest run src/components/Home.test.tsx src/components/Header/NavMenu.test.tsx、npm run lint；提交。

~~~bash
git add src/components/Footer.tsx src/components/Footer.test.tsx src/components/Home.tsx src/components/Home.test.tsx src/components/Header/NavMenu.tsx src/components/Header/NavMenu.test.tsx src/components/KnowledgeDetail/index.tsx
git commit -m "feat(nav): add crawlable footer and header links"
~~~

### Task 3: /sitemap HTML 索引页

**Files:** Create src/sitemap.ts, src/components/HtmlSitemap.tsx, src/sitemap.test.ts；Modify src/App.tsx, src/prerender/routes.ts, src/prerender/routes.test.ts, src/entry-prerender.ts, src/seo/content-zh.ts

- [ ] Step 1: 写 sitemap.test.ts：断言 buildHtmlSitemap 展开后无重复、数量等于 PRERENDER_PATHS.length - 1、覆盖除 /sitemap 外的每个路径；断言 XML_SITEMAP_PATHS 不含 /sitemap。
- [ ] Step 2: 运行 npx vitest run src/sitemap.test.ts，确认 FAIL。
- [ ] Step 3: 实现 src/sitemap.ts：导出 HTML_SITEMAP_PATH = '/sitemap'；buildHtmlSitemap() 返回分组（学习视图 12 条、三个学段的知识点、古诗词、英文图表与 hub）；flattenSitemap(groups) 返回全部路径。
- [ ] Step 4: 实现 HtmlSitemap.tsx：遍历分组渲染 <Link>，页面标题「站点地图」。
- [ ] Step 5: App.tsx 加路由；prerender/routes.ts 把 /sitemap 加入 PRERENDER_PATHS，并导出 XML_SITEMAP_PATHS = PRERENDER_PATHS.filter(p => p !== '/sitemap')；entry-prerender.ts 改用 XML_SITEMAP_PATHS 生成 sitemap.xml。
- [ ] Step 6: content-zh.ts 在 view 分支前为 /sitemap 返回 title/description/breadcrumbs；更新 routes.test.ts 的长度断言（+1）并断言包含 /sitemap。
- [ ] Step 7: 运行 npx vitest run src/sitemap.test.ts src/prerender/routes.test.ts、npm run build；确认 dist/sitemap/index.html 存在、dist/sitemap.xml 不含 /sitemap；提交。

~~~bash
git add src/sitemap.ts src/sitemap.test.ts src/components/HtmlSitemap.tsx src/App.tsx src/prerender/routes.ts src/prerender/routes.test.ts src/entry-prerender.ts src/seo/content-zh.ts
git commit -m "feat(seo): add crawlable html sitemap"
~~~

### Task 4: 知识点详情页内链

**Files:** Create src/data/knowledge/related.ts, related.test.ts；Modify src/components/KnowledgeDetail/index.tsx

- [ ] Step 1: 写失败测试：relatedKnowledgePoints(firstId) 返回 1–5 条、不含自身、包含同科第二条；未知 id 返回空数组。
- [ ] Step 2: 实现 related.ts：遍历 KNOWLEDGE_DATA 找到该 id 所属 subject，返回同 subject 其他知识点前 5 条。
- [ ] Step 3: 改 KnowledgeDetail：返回按钮改为 <Link to="/">；Header 前加面包屑（首页为 Link，学段·学科为文本）；FunCorner 后加「相关知识点」列表，每条 <Link to={'/knowledge/' + item.id}>；「未找到」分支也改 Link，删除 useNavigate。
- [ ] Step 4: 运行 npx vitest run src/data/knowledge/related.test.ts、npm run lint、npm run build；提交。

~~~bash
git add src/data/knowledge/related.ts src/data/knowledge/related.test.ts src/components/KnowledgeDetail/index.tsx
git commit -m "feat(seo): link knowledge detail to related points"
~~~

### Task 5: 参考页校验加严

**Files:** Modify src/data/reference/validate.ts, validate.test.ts, en/pages.test.ts, en/english.ts

- [ ] Step 1: 在 validate.test.ts 增加两个失败用例：related 少于 2 条应抛错；prose 少于 400 词应抛错。删除原来「允许空 related」的用例。
- [ ] Step 2: 运行 npx vitest run src/data/reference/validate.test.ts，确认 FAIL。
- [ ] Step 3: 在 validate.ts 增加 proseWords(page) 纯函数（summary、description、intro、howToUse、faq、block caption/label 的单词数），主循环加两条检查：related.length < 2、proseWords < 400。

~~~ts
function proseWords(page: ReferencePage): number {
  const parts: string[] = [
    page.summary,
    page.description,
    page.intro,
    ...page.howToUse,
    ...page.faq.flatMap((entry) => [entry.q, entry.a]),
  ];
  for (const block of page.blocks) {
    if (block.kind === 'table') parts.push(block.caption ?? '');
    else if (block.kind === 'formulas') parts.push(block.groups.map((group) => group.label ?? '').join(' '));
    else parts.push(block.caption ?? '');
  }
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}
~~~
- [ ] Step 4: 更新测试 fixture 的 intro / related / FAQ 文本，使「well-formed」用例能过；把 pages.test.ts 的固定 6 slug 断言改为 expect.arrayContaining 的 6 个 slug。
- [ ] Step 5: 补齐 en/english.ts 的 irregular-verbs：related 指向两个真实已有页（multiplication-chart、metric-conversions），补到 5 条 FAQ、4 条 howToUse，使字数 ≥400；其余 5 页按同样标准补足。
- [ ] Step 6: 运行 npx vitest run src/data/reference、npm run build；确认 prerender 不抛 invalid reference pages；提交。

~~~bash
git add src/data/reference/validate.ts src/data/reference/validate.test.ts src/data/reference/en/pages.test.ts src/data/reference/en/english.ts
git commit -m "test(reference): enforce related links and prose length"
~~~

---

## Phase 2 — 首屏瘦身与缓存

### Task 6: lazyWithPreload 与路由模块表

**Files:** Create src/routing/lazy-with-preload.tsx, lazy-with-preload.test.tsx, route-modules.ts, preload.ts, preload.test.ts

- [ ] Step 1: 写失败测试：lazyWithPreload 的组件在 preload() 完成后 renderToString 能输出内容；routeKeyForPath 对 /、/tutorial、/knowledge/x、/poetry/x、/en/、/en/math/、/en/math/multiplication-chart/ 分别返回 home、home、knowledgeDetail、poemDetail、referenceIndex、referenceCategory、referencePage。
- [ ] Step 2: 运行 npx vitest run src/routing，确认 FAIL。
- [ ] Step 3: 实现 lazy-with-preload.tsx：

~~~tsx
import type { ComponentType, ReactElement } from 'react';

export type PreloadableComponent<P extends object> = ((props: P) => ReactElement) & {
  preload: () => Promise<void>;
};

export function lazyWithPreload<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
): PreloadableComponent<P> {
  let loaded: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;

  const load = () => {
    if (!pending) {
      pending = factory().then((module) => {
        loaded = module.default;
      });
    }
    return pending;
  };

  function Lazy(props: P): ReactElement {
    if (!loaded) throw load();
    const Component = loaded;
    return <Component {...props} />;
  }

  Lazy.preload = load;
  return Lazy as PreloadableComponent<P>;
}
~~~

- [ ] Step 4: 实现 route-modules.ts（home、knowledgeDetail、poemDetail、referenceIndex、referenceCategory、referencePage 各 lazyWithPreload(() => import(...))）与 preload.ts（routeKeyForPath 正则匹配 + preloadRoute）。
- [ ] Step 5: 运行 npx vitest run src/routing，确认 PASS；提交。

~~~bash
git add src/routing
git commit -m "feat(routing): add preload-aware lazy components"
~~~

### Task 7: App 懒加载与 SSR/客户端预加载

**Files:** Modify src/App.tsx, src/view-routes.ts, src/entry-server.tsx, src/entry-prerender.ts, src/main.tsx

- [ ] Step 1: view-routes.ts 导出 INITIAL_VIEW_PATHS = Object.values(VIEW_PATHS)。
- [ ] Step 2: App.tsx 用 ROUTE_COMPONENTS 替换静态 import，Routes 外包 <Suspense fallback={<div className="min-h-screen bg-[#F5F6F7]" />}>；视图路由改为 INITIAL_VIEW_PATHS.map。
- [ ] Step 3: entry-server.tsx 的 render 改为 async：先 await preloadRoute(url)，再 renderToString。
- [ ] Step 4: entry-prerender.ts 的循环里改为 const appHtml = await render(route)，再 injectPage。
- [ ] Step 5: main.tsx 在 hydrateRoot/createRoot 前 preloadRoute(window.location.pathname)，用 .then(start, start) 兜底。
- [ ] Step 6: 运行 npm run lint、npm test、npm run build；检查英文页 HTML 只引用入口 chunk；提交。

~~~bash
git add src/App.tsx src/view-routes.ts src/entry-server.tsx src/entry-prerender.ts src/main.tsx
git commit -m "perf(routing): lazy-load routes with ssr preload"
~~~

### Task 8: Worker 边缘缓存

**Files:** Create worker/lib/cache.ts, cache.test.ts；Modify worker/index.ts, worker/index.test.ts

- [ ] Step 1: 写 cache.test.ts：/assets/* 返回含 immutable；HTML 返回含 s-maxage=3600 与 stale-while-revalidate；/api/* 返回 no-store。
- [ ] Step 2: 实现 cacheControlFor(pathname, contentType)：

~~~ts
const HTML_CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
const ASSET_CACHE = 'public, max-age=31536000, immutable';

export function cacheControlFor(pathname: string, contentType: string): string {
  if (pathname.startsWith('/api/')) return 'no-store';
  if (pathname.startsWith('/assets/')) return ASSET_CACHE;
  if (contentType.includes('text/html')) return HTML_CACHE;
  return 'public, max-age=3600';
}
~~~

- [ ] Step 3: worker/index.ts 的 fetch 增加 ctx: ExecutionContext 参数；serveStatic 返回后设置 Cache-Control；对 GET 的 HTML 用 caches.default 做 match/put（cacheKey = new Request(url.origin + path)），put 用 ctx.waitUntil。
- [ ] Step 4: 更新 worker/index.test.ts：调用时传 ctx 桩；新增 hashed asset 的 immutable 断言。
- [ ] Step 5: 运行 npx vitest run worker、npm run lint；提交。

~~~bash
git add worker/index.ts worker/index.test.ts worker/lib/cache.ts worker/lib/cache.test.ts
git commit -m "perf(worker): cache prerendered html and hashed assets"
~~~

---

## Phase 3 — 合规与安全

### Task 9: 合规四页与 favicon

**Files:** Create src/components/legal/LegalPage.tsx, legal-content.ts, LegalPage.test.tsx, public/favicon.svg；Modify src/App.tsx, src/prerender/routes.ts, src/seo/content-zh.ts, src/components/Footer.tsx, src/components/reference/ReferenceLayout.tsx, index.html

- [ ] Step 1: 定义 LEGAL_PATHS = ['/privacy','/terms','/about','/contact'] 与 LEGAL_CONTENT（每页 title、description、2–3 节 paragraphs，含 support@syy.global）。
- [ ] Step 2: 实现 LegalPage：useLocation 去掉尾斜杠后取内容，渲染标题、分节、返回首页 Link、Footer。
- [ ] Step 3: App 为四个路径加路由；PRERENDER_PATHS 加这四项（同时保留在 XML sitemap 中）；content-zh.ts 为四页返回 title/description/breadcrumbs；Footer 追加四个法律链接；ReferenceLayout 页脚追加英文法律链接。
- [ ] Step 3b: 把 LEGAL_PATHS 加进 buildHtmlSitemap 的「站点信息」分组，并更新 sitemap.test 的数量断言与 routes.test 的长度断言（+4）；否则 /sitemap 会漏掉新页。
- [ ] Step 4: 创建 public/favicon.svg（蓝底白字「拾」），index.html 的 href 改为 /favicon.svg。
- [ ] Step 5: 写 LegalPage.test.tsx（/privacy 渲染出一级标题「隐私政策」且包含 support@syy.global），运行测试、npm run build，确认 dist/privacy/index.html 等存在；提交。

~~~bash
git add src/components/legal src/components/Footer.tsx src/components/reference/ReferenceLayout.tsx src/App.tsx src/prerender/routes.ts src/seo/content-zh.ts index.html public/favicon.svg
git commit -m "feat(legal): add policy pages and brand favicon"
~~~

### Task 10: JWT fail-closed

**Files:** Modify worker/lib/jwt.ts；Create worker/lib/jwt.test.ts

- [ ] Step 1: 写失败测试：env.JWT_SECRET 为空时 signJWT 抛错；正常 secret 时 signJWT/verifyJWT 往返成功、篡改 token 返回 null。
- [ ] Step 2: 修改 importHMACSecret：删除 FALLBACK_JWT_SECRET，secret 为空直接 throw new Error('JWT_SECRET is not configured')。
- [ ] Step 3: 运行 npx vitest run worker/lib/jwt.test.ts、npm run lint；提交。

~~~bash
git add worker/lib/jwt.ts worker/lib/jwt.test.ts
git commit -m "fix(auth): fail closed when jwt secret is missing"
~~~

### Task 11: 认证限流、验证码尝试上限、改密踢会话

**Files:** Create worker/lib/rate-limit.ts, rate-limit.test.ts, worker/migrations/0002_auth_hardening.sql；Modify worker/routes/auth.ts, db/schema.sql, worker/routes/auth.test.ts

- [ ] Step 1: 迁移文件：

~~~sql
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL
);
ALTER TABLE email_verifications ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
~~~

把同样内容同步进 db/schema.sql。

- [ ] Step 2: 写 rate-limit.test.ts（纯函数 windowExpired(now, start, windowSeconds)），实现 worker/lib/rate-limit.ts：

~~~ts
export async function takeRateLimit(
  env: { DB: D1Database },
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO auth_rate_limits (key, count, window_start) VALUES (?, 1, ?) ' +
    'ON CONFLICT(key) DO UPDATE SET ' +
    'count = CASE WHEN (julianday(?) - julianday(window_start)) * 86400 > ? THEN 1 ELSE count + 1 END, ' +
    'window_start = CASE WHEN (julianday(?) - julianday(window_start)) * 86400 > ? THEN excluded.window_start ELSE window_start END'
  ).bind(key, now, now, windowSeconds, now, windowSeconds).run();
  const row = await env.DB.prepare('SELECT count FROM auth_rate_limits WHERE key = ?')
    .bind(key).first<{ count: number }>();
  return (row?.count ?? 1) <= limit;
}
~~~

- [ ] Step 3: auth.ts 中 register/login/forgot 入口调用 takeRateLimit：key = endpoint + ':' + (cf-connecting-ip || 'unknown') + ':' + email.toLowerCase()；login 限 10 次/15 分钟，forgot 限 5 次/小时，register 限 5 次/小时；超限返回 429 + code RATE_LIMITED。
- [ ] Step 4: reset 路由：验证码错误时 UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?，达到 5 次删除该记录并返回 CODE_LOCKED；密码更新成功后 DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)。
- [ ] Step 5: 为上述行为写 worker/routes/auth.test.ts（用内存 FakeDB 实现 prepare/bind/first/run 所需语句），覆盖：超限 429、错误验证码 5 次锁定、重置后会话被删。
- [ ] Step 6: 运行 npx vitest run worker、npm run lint；提交。

~~~bash
git add worker/lib/rate-limit.ts worker/lib/rate-limit.test.ts worker/migrations/0002_auth_hardening.sql worker/routes/auth.ts worker/routes/auth.test.ts db/schema.sql
git commit -m "fix(auth): rate limit auth endpoints and revoke sessions on reset"
~~~

### Task 12: AI 配额原子化与模型白名单

**Files:** Modify worker/routes/ai.ts, worker/migrations/0003_ai_quota.sql（如需）, worker/types.ts；Create worker/routes/ai.test.ts

- [ ] Step 1: 把 checkAndRecordQuota 改成单条原子 SQL：INSERT ... ON CONFLICT DO UPDATE SET count = count + 1 WHERE ai_quota.count < ?；用 result.meta.changes === 0 判定超限；pro 直接放行。
- [ ] Step 2: 模型白名单：const ALLOWED_MODELS = new Set(['deepseek-chat', 'deepseek-reasoner'])；请求 model 不在白名单时回退 env.AI_GATEWAY_MODEL。
- [ ] Step 3: 流式响应包一层 TransformStream 累计文本长度，flush 时按 estimateTokens 写 ai_quota.tokens；失败不阻断主流程。
- [ ] Step 4: worker/index.ts 的 500 分支改为固定文案 Internal server error，不再回传 err.message。
- [ ] Step 5: 写 ai.test.ts（FakeDB）覆盖：并发配额不超卖、白名单外 model 被替换、流式结束后 tokens 增加。
- [ ] Step 6: 运行 npx vitest run worker；提交。

~~~bash
git add worker/routes/ai.ts worker/routes/ai.test.ts worker/index.ts worker/migrations
git commit -m "fix(ai): make quota atomic and allowlist models"
~~~

### Task 13: AdSense slot 与 CMP

**Files:** Modify .github/workflows/deploy-cloudflare.yml；Create docs/adsense.md

- [ ] Step 1: 在 Build 步骤 env 增加 VITE_ADSENSE_SLOT_KNOWLEDGE_MID、VITE_ADSENSE_SLOT_KNOWLEDGE_BOTTOM、VITE_ADSENSE_SLOT_REFERENCE_BOTTOM 三个 secret。
- [ ] Step 2: 新建 docs/adsense.md：创建 3 个广告单元、配置 GitHub secrets、在 AdSense Privacy & messaging 启用 EEA/UK 认证 CMP、用 curl 验证 adsbygoogle 出现、打印时广告隐藏。
- [ ] Step 3: 本地 npm run build（不设 slot）确认 0 个 adsbygoogle（fail-safe），CI 设置后应有；提交。

~~~bash
git add .github/workflows/deploy-cloudflare.yml docs/adsense.md
git commit -m "chore(ads): inject adsense slots in ci and document cmp"
~~~

---

## Phase 4 — 内容（14 页）

### Task 14: 内容 SOP 与首篇 hundreds-chart

**Files:** Create src/data/reference/en/data/hundredsChart.ts；Modify src/data/reference/en/math.ts

- [ ] Step 1: 写 src/data/reference/en/data/hundredsChart.ts，导出 HUNDREDS_CHART_ROWS（10 行 × 10 列，1–100）与 HUNDREDS_CHART_BLANK_ROWS（同样形状的空字符串）。
- [ ] Step 2: 在 math.ts 的 MATH_PAGES 里加 hundreds-chart 对象：title、summary 60–90 字符、description 150–160 字符、intro 80–120 词、blocks（完整表格 + 空白表格两个 table block）、howToUse 4 条、faq 5 条、related 为 ['place-value-chart','number-line','multiplication-chart']（后两页上线前先填已有 slug）。
- [ ] Step 3: 运行 npx vitest run src/data/reference、npm run build；确认 dist/en/math/hundreds-chart/index.html 存在。
- [ ] Step 4: 更新 content-backlog.md 状态为已上线；提交。

~~~bash
git add src/data/reference/en/data/hundredsChart.ts src/data/reference/en/math.ts docs/seo/content-backlog.md
git commit -m "content(reference): add printable hundreds chart"
~~~

### Task 15: 剩余 13 页清单（逐页实现）

**Files:** 每页新建 src/data/reference/en/data/<name>.ts，并在对应分类文件里追加对象：math.ts / science.ts / english.ts。

| slug | 主关键词 | 数据文件 | block 要求 | related（上线后填真实 slug） |
|---|---|---|---|---|
| math/place-value-chart | printable place value chart | placeValueChart.ts | 整数位值表 + 小数位值表 | hundreds-chart, number-line, area-perimeter-volume-formulas |
| math/number-line | printable number line | numberLine.ts | −20–100 的 diagram/table，多个刻度段 | place-value-chart, hundreds-chart, roman-numerals |
| math/roman-numerals | roman numerals chart | romanNumerals.ts | 1–1000 表格 + 转换规则 formulas | hundreds-chart, prime-numbers, divisibility-rules |
| math/prime-numbers | prime numbers chart | primeNumbers.ts | 1–100 标记表 + 判定步骤 | divisibility-rules, hundreds-chart, fraction-decimal-percent |
| math/divisibility-rules | divisibility rules chart | divisibilityRules.ts | 2–12 规则表 | prime-numbers, fraction-decimal-percent, multiplication-chart |
| math/fraction-decimal-percent | fraction decimal percent chart | fractionDecimalPercent.ts | 常用分数换算表 | divisibility-rules, area-perimeter-volume-formulas, metric-conversions |
| math/area-perimeter-volume-formulas | area perimeter volume formulas | areaPerimeterVolumeFormulas.ts | formulas 分组（2D/3D） | fraction-decimal-percent, trigonometric-identities, metric-conversions |
| math/customary-unit-conversions | customary unit conversion chart | customaryUnitConversions.ts | 长度/重量/体积换算表 | metric-conversions, si-unit-prefixes, physics-constants |
| science/si-unit-prefixes | SI unit prefixes chart | siUnitPrefixes.ts | 10⁻¹²–10¹² 前缀表 | physics-constants, metric-conversions, customary-unit-conversions |
| science/periodic-table | printable periodic table | periodicTable.ts | 118 元素表（按族/周期排版） | physics-constants, si-unit-prefixes, metric-conversions |
| english/phonics-sounds | phonics sounds chart | phonicsSounds.ts | 44 音素表（音素/例词） | sight-words, parts-of-speech, irregular-verbs |
| english/sight-words | sight words list printable | sightWords.ts | Dolch 220 分 5 级表 | phonics-sounds, parts-of-speech, irregular-verbs |
| english/parts-of-speech | parts of speech chart | partsOfSpeech.ts | 8 类词性表（定义/例词） | phonics-sounds, sight-words, irregular-verbs |

- [ ] Step 1: 按上表逐页实现；每页 summary 60–90 字符、description 150–160 字符、intro 80–120 词、prose ≥400 词、FAQ ≥3、howToUse ≥2、related ≥2（指向已存在的 slug）。
- [ ] Step 2: 每完成 2 页运行 npx vitest run src/data/reference 与 npm run build；确认新 URL 的 dist 文件存在。
- [ ] Step 3: 打印预览：A4 与 Letter 各打一次，检查表格不跨页、宽表可横滑、广告/导航不出现。
- [ ] Step 4: 更新 content-backlog.md 与 weekly-log.md；逐页提交。

### Task 16: W12 Gate 复盘

- [ ] Step 1: 运行 npm run lint、npm test、npm run build。
- [ ] Step 2: 在 GSC 记录：英文页总数、收录率、30 天 impressions、进入前 50 的 query 数；写入 weekly-log.md。
- [ ] Step 3: 按 spec 4.2 判定 G2：通过则规划 40 页；未通过按 4.4 诊断顺序排查，并记录下一步。

### Task 17: 内容清理（5.6，AdSense 申请前）

**Files:** Modify src/data/questions/index.ts, src/data/questions/primary-moral-questions.ts, src/data/tutorials/*.ts；Create src/data/questions/quality.test.ts, src/data/tutorials/quality.test.ts

- [ ] Step 1: 在 src/data/questions/index.ts 增加 isPlaceholderQuestion(q)：题干或选项含未替换的变量占位符（美元符号 + 花括号包裹的 subject）时返回 true；ALL_QUESTIONS 与 getQuestionById 都过滤掉这类题。
- [ ] Step 2: 写 quality.test.ts：断言过滤后的题库中没有任何占位符字符串；断言题 ID 全局唯一；断言每条 knowledgePointIds 都能在 KNOWLEDGE_DATA 找到。
- [ ] Step 3: 用 sed 把 src/data/questions/primary-moral-questions.ts 里与数学冲突的 q-pm- 前缀批量改成 q-pmo-（先 grep 统计，再 sed -i）；重跑测试直到 ID 唯一。
- [ ] Step 4: 写 src/data/tutorials/quality.test.ts：断言所有 tutorial practice 题的 ID 全局唯一、knowledgePointIds 无断链；用同样方式给重复 ID 加学科前缀。
- [ ] Step 5: 运行 npx vitest run src/data/questions src/data/tutorials、npm run build；确认 0 占位题、0 重复 ID、0 断链后提交。

~~~bash
git add src/data/questions src/data/tutorials
git commit -m "chore(data): remove placeholders and enforce unique ids"
~~~

---

## Self-Review

- Spec 5.1 对应 Task 2/3/4；5.2 对应 Task 6/7；5.3 对应 Task 8；5.4 对应 Task 9/13；5.5 对应 Task 10/11/12；5.6 对应 Task 17；6.x 对应 Task 14/15；7.x 对应 Task 1/16。
- 所有 Task 都有失败测试或可验证命令；没有 TBD；路径与函数名前后一致（RouteKey、PreloadableComponent、HTML_SITEMAP_PATH、cacheControlFor、takeRateLimit）。
- 内容任务的 14 页清单在 Task 15 的表格里逐页列出，不使用「同上」跳过具体 page 字段。
