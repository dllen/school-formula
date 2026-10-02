## Task 7: Worker 旧 URL 301 与 `/en/` 真 404

本任务做两件事，都属 Section 2「迁移」与「`:category` 校验收敛成真 404」的落地：

1. 旧 `/en/reference/*` 301 到新路径。
2. `/en/` 前缀下关闭 SPA 兜底——英文面每一条合法路径都有预渲染产物，因此缺产物就是真的不存在。**不改这一条的话，`/en/typo/` 会命中兜底返回 200 + 应用外壳，等于给 Google 一张软 404 空页。** 中文站行为不变。

**Files:**
- Modify: `worker/lib/redirect.ts`
- Modify: `worker/lib/redirect.test.ts`
- Modify: `worker/lib/static-paths.ts`
- Modify: `worker/lib/static-paths.test.ts`
- Modify: `worker/index.ts`

**Interfaces:**
- Consumes: 无（worker 是独立编译边界，不 import `src/`）
- Produces:
  - `legacyReferenceRedirect(url: URL): string | null`
  - `assetCandidates(pathname: string): string[]`（行为变更：`/en/` 前缀下不再回退 `/index.html`）

- [ ] **Step 1: 写失败测试（redirect）**

把 `worker/lib/redirect.test.ts` 的 import 行改成：

```ts
import { hostRedirect, legacyReferenceRedirect, legacyViewRedirect } from './redirect';
```

在文件末尾追加：

```ts
describe('legacyReferenceRedirect', () => {
  it('moves a flat chart URL under its category', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/multiplication-chart/')),
    ).toBe('https://syy.global/en/math/multiplication-chart/');
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/reference/physics-constants')),
    ).toBe('https://syy.global/en/science/physics-constants/');
  });

  it('covers every chart that existed before the move', () => {
    const slugs = [
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
      'physics-constants',
      'irregular-verbs',
    ];
    for (const slug of slugs) {
      const target = legacyReferenceRedirect(new URL(`https://syy.global/en/reference/${slug}/`));
      expect(target).toMatch(/^https:\/\/syy\.global\/en\/(math|science|english)\//);
    }
  });

  it('ignores paths outside the legacy prefix', () => {
    expect(
      legacyReferenceRedirect(new URL('https://syy.global/en/math/multiplication-chart/')),
    ).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/en/reference/nope/'))).toBeNull();
    expect(legacyReferenceRedirect(new URL('https://syy.global/tutorial'))).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run worker/lib/redirect.test.ts`
Expected: FAIL — `legacyReferenceRedirect is not a function`

- [ ] **Step 3: 在 `worker/lib/redirect.ts` 里实现**

追加：

```ts
/**
 * 图表迁到学科分层 URL 之前的历史 slug→学科映射。
 *
 * 这是一份**冻结的历史记录**：这六个 URL 在 2026-10 之前对外发布过，写完就再也不会
 * 增长。所以它是字面量，且刻意不从 `src/data/reference` 导入——worker 不在任何
 * tsconfig 的 include 里（`tsconfig.app.json` 只含 `src`），为六个常量把它绑到 src
 * 的整个模块图上不划算。
 */
const LEGACY_REFERENCE_CATEGORY: Record<string, string> = {
  'multiplication-chart': 'math',
  'squares-cubes-roots': 'math',
  'trigonometric-identities': 'math',
  'metric-conversions': 'math',
  'physics-constants': 'science',
  'irregular-verbs': 'english',
};

export function legacyReferenceRedirect(url: URL): string | null {
  const match = /^\/en\/reference\/([^/]+)\/?$/.exec(url.pathname);
  if (!match) return null;
  const category = LEGACY_REFERENCE_CATEGORY[match[1]];
  if (!category) return null;
  return `${url.origin}/en/${category}/${match[1]}/`;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run worker/lib/redirect.test.ts`
Expected: PASS（**8 个用例**：原有 5 个 + 新增 3 个）

- [ ] **Step 5: 写失败测试（static-paths）**

在 `worker/lib/static-paths.test.ts` 的 `describe('assetCandidates')` 里追加两条：

```ts
  it('does not fall back to the app shell under the prerendered /en/ surface', () => {
    expect(assetCandidates('/en/math/multiplication-chart')).toEqual([
      '/en/math/multiplication-chart/index.html',
    ]);
    expect(assetCandidates('/en/typo')).toEqual(['/en/typo/index.html']);
    expect(assetCandidates('/en')).toEqual(['/en/index.html']);
  });

  it('keeps the app-shell fallback for the Chinese app', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/unknown')).toEqual(['/unknown/index.html', '/index.html']);
  });
```

- [ ] **Step 6: 跑测试确认失败**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: FAIL — `/en/typo` 仍返回两个候选

- [ ] **Step 7: 改 `worker/lib/static-paths.ts`**

```ts
const SEO_FILES = new Set(['/robots.txt', '/sitemap.xml']);

/**
 * 全量预渲染的语言面。这些前缀下每一条合法路径都有自己的目录索引，所以不需要
 * 回退到应用外壳——回退会把一个 URL 拼写错误变成 200 + 空壳，即软 404。
 * 与 `KNOWN_VIEWS`（redirect.ts）一样是字面量：新增语言面时两处都要改。
 */
const PRERENDERED_SURFACES = ['/en'];

/** Site files that must be served verbatim, never masked by the SPA fallback. */
export function isSeoFile(pathname: string): boolean {
  return SEO_FILES.has(pathname);
}

function isPrerenderedSurface(dir: string): boolean {
  return PRERENDERED_SURFACES.some((surface) => dir === surface || dir.startsWith(`${surface}/`));
}

export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  if (isPrerenderedSurface(dir)) return [`${dir}/index.html`];
  return [`${dir}/index.html`, '/index.html'];
}
```

- [ ] **Step 8: 跑测试确认通过**

Run: `npx vitest run worker/lib/static-paths.test.ts`
Expected: PASS

- [ ] **Step 9: 接进 `worker/index.ts`**

import 行改为：

```ts
import { hostRedirect, legacyReferenceRedirect, legacyViewRedirect } from './lib/redirect';
```

fetch 里的重定向两行：

```ts
    const redirect = hostRedirect(url) ?? (request.method === 'GET' ? legacyViewRedirect(url) : null);
```

改为：

```ts
    const legacyRedirect =
      request.method === 'GET' ? (legacyReferenceRedirect(url) ?? legacyViewRedirect(url)) : null;
    const redirect = hostRedirect(url) ?? legacyRedirect;
```

- [ ] **Step 10: 把 `serveStatic` 的兜底响应换成可看的 404 页**

在文件里 `normalizeOrigin` 之前加：

```ts
/** 404 响应体。刻意不用应用外壳——软 404 会被爬虫当作可索引的薄页面。 */
function notFoundBody(): string {
  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Page not found</title>',
    '</head><body><h1>Page not found</h1>',
    '<p>This page does not exist. <a href="/en/">Browse the reference charts</a>.</p>',
    '</body></html>',
  ].join('');
}
```

把 `serveStatic` 最后一行

```ts
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
```

换成

```ts
  return new Response(notFoundBody(), {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
```

- [ ] **Step 11: 跑 worker 测试**

Run: `npx vitest run worker/`
Expected: PASS

- [ ] **Step 12: 端到端验证**

Run: `npm run build && npx wrangler dev worker/index.ts`（另开一个终端）

```bash
curl -sI  http://localhost:8787/en/reference/multiplication-chart/ | head -2
# 期望：HTTP/1.1 301 + location: http://localhost:8787/en/math/multiplication-chart/

curl -sI  http://localhost:8787/en/math/multiplication-chart/ | head -1
# 期望：HTTP/1.1 200

curl -s   http://localhost:8787/en/math/multiplication-chart/ | grep -c "Multiplication Chart (1–12)"
# 期望：≥ 1

curl -sI  http://localhost:8787/en/typo/ | head -1
# 期望：HTTP/1.1 404

curl -sI  http://localhost:8787/en/ | head -1
# 期望：HTTP/1.1 200

curl -sI  http://localhost:8787/tutorial/ | head -1
# 期望：HTTP/1.1 200（中文站兜底行为不变）
```

- [ ] **Step 13: 提交**

```bash
git add worker/ .gitignore
git commit -m "$(cat <<'EOF'
feat(worker): 旧 /en/reference/* 301 到学科分层路径，/en/ 下关闭 SPA 兜底

英文面每条合法路径都有预渲染产物，回退到应用外壳会把 URL 拼写错误
变成 200 + 空壳的软 404。中文站兜底行为不变。

六个历史 slug→学科是冻结的字面量，刻意不从 src 导入——worker 是
独立编译边界。

顺手把 .superpowers/ 加进 .gitignore：SDD 工作区是 git-ignored scratch，
本仓库先前没忽略它。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## 完成标准

全部任务完成后应当满足：

- `npm test` 全绿
- `npm run lint` 无错误
- `npm run build` 成功，输出包含 `/en/`、`/en/{math,science,english}/`、六张图表页
- `dist/sitemap.xml` 含全部英文面 URL，且**不含**任何 `en/reference`
- `curl` 验证：旧 `/en/reference/*` → 301，新路径 → 200 且 HTML 内含 H1，`/en/typo/` → 404，中文站路径行为不变
- `src/data/reference.ts` 已删除，全仓库无 `getReferenceTable` / `REFERENCE_TABLES` / `REFERENCE_SLUGS` 残留
- 图表页渲染顺序为 面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related，且恰好 1 个 AdUnit

## 已知限制（本计划不处理，需在后续计划中收口）

- **客户端未找到态仍是 200。** Worker 层已经把 `/en/` 下的缺产物变成真 404，但如果用户从已加载的页面里做客户端跳转到 `/en/typo/`，React Router 会渲染未找到组件而不改 HTTP 状态。这不会产生可索引的 URL（该 URL 直连时返回 404），但严格来说仍是软 404。彻底修需要客户端路由拦截。
- **`ReferenceNotFound` 没有 `noindex`。** 该组件所在页面直连时已经是 404，无需额外标记；若将来出现 200 态的未找到页面再补。
- **`src/i18n/languages.test.ts` 与 `src/prerender/inject.test.ts` 仍以 `/en/reference/...` 作为样例字符串。** 两者测的都是路径的通用变换（语言前缀剥离 / 路径转文件名），对新结构同样成立，所以刻意不改——改了只是噪声。

## 不在本计划范围内

- **阶段 C（SEO 补完）**：`PageContent.kind` 扩展、`LearningResource` / `FAQPage` / `CollectionPage` JSON-LD、标题模板加 "Printable"、og:image 管线、GA4 与同意模式。本计划里 hub 页与图表页仍然走 `kind: 'view'`，`<title>` 仍是 `{title} - {brand}` 旧格式——这是刻意的中间状态。
- **阶段 D（合规与变现）**：合规八页、`AD_SLOTS` 占位槽位改 `null`、图表页第二个广告位。
- **阶段 E（内容扩充）**：6 页 → 100 页。`en/english.ts` 的 `related: []` 与 science/english 两个 hub 各只有 1 张卡，都是当前内容量的反映，靠扩充内容自然解决。
