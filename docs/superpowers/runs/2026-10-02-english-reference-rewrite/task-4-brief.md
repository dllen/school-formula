## Task 4: 数据模块原子替换 + 图表页重写（URL 保持扁平）

本任务是本计划里最大的一个，因为**它必须是原子的**：删掉 `src/data/reference.ts` 会让 6 个消费者同时编译失败，必须在同一个提交里全部改完。为了让这个提交可以 review，**URL 形状刻意保持不变**（仍是 `/en/reference/:slug`）——URL 分层推到 Task 5。

**Files:**
- Create: `src/data/reference/validate.ts`
- Create: `src/data/reference/index.ts`
- Create: `src/components/reference/ReferenceNotFound.tsx`
- Create: `src/components/reference/FaqSection.tsx`
- Create: `src/components/reference/RelatedCharts.tsx`
- Modify: `src/reference-routes.ts`
- Modify: `src/reference-routes.test.ts`
- Modify: `src/seo/content-en.ts`
- Modify: `src/seo/meta.test.ts`
- Modify: `src/components/reference/ReferenceIndex.tsx`
- Modify: `src/components/reference/ReferencePage.tsx`
- Modify: `src/components/reference/ReferenceLayout.tsx`
- Modify: `src/entry-prerender.ts`
- Test: `src/data/reference/validate.test.ts`
- Test: `src/data/reference/index.test.ts`
- Test: `src/components/reference/ReferencePage.test.tsx`
- Delete: `src/data/reference.ts`

**Interfaces:**
- Consumes: `REFERENCE_PAGES_EN`（Task 2）、`ReferencePage` / `ReferenceCategory`（Task 1）、`BlockRenderer`（Task 3）
- Produces:
  - `validateReferencePages(pages: readonly ReferencePage[]): void`（不合法则 throw）
  - `REFERENCE_PAGES: readonly ReferencePage[]`
  - `getReferencePage(slug: string): ReferencePage | undefined`
  - `pagesInCategory(category: ReferenceCategory): ReferencePage[]`
  - `ReferenceNotFound(): ReactElement`
  - `FaqSection({ faq }: { faq: readonly { q: string; a: string }[] }): ReactElement | null`
  - `RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null`
  - `ReferencePage(): ReactElement`
  - `ReferenceIndex(): ReactElement`
  - `referencePath(slug: string): string`（**仍是一参**）
  - `referenceSlugForAppPath(appPath: string): string | null`（不变）
  - `ENGLISH_REFERENCE_ROUTE = '/en/reference/:slug'`（不变）

- [ ] **Step 1: 写失败测试 `validate.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import type { ReferencePage } from './types';
import { validateReferencePages } from './validate';

function page(overrides: Partial<ReferencePage> = {}): ReferencePage {
  return {
    slug: 'a-page',
    category: 'math',
    title: 'A Page',
    summary: 'A summary.',
    description: 'A description.',
    intro: 'An intro.',
    blocks: [{ kind: 'table', rows: [['1']] }],
    howToUse: ['Do this.', 'Then that.'],
    faq: [
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
      { q: 'Q3', a: 'A3' },
    ],
    related: [],
    ...overrides,
  };
}

describe('validateReferencePages', () => {
  it('accepts a well-formed page set', () => {
    expect(() => validateReferencePages([page()])).not.toThrow();
  });

  it('rejects duplicate slugs', () => {
    expect(() => validateReferencePages([page(), page()])).toThrow(/duplicate slug: a-page/);
  });

  it('rejects empty required copy', () => {
    expect(() => validateReferencePages([page({ intro: '   ' })])).toThrow(/empty intro/);
    expect(() => validateReferencePages([page({ title: '' })])).toThrow(/empty title/);
    expect(() => validateReferencePages([page({ summary: '' })])).toThrow(/empty summary/);
    expect(() => validateReferencePages([page({ description: ' ' })])).toThrow(/empty description/);
  });

  it('rejects a page with too few FAQ entries or how-to-use steps', () => {
    expect(() => validateReferencePages([page({ faq: [{ q: 'Q', a: 'A' }] })])).toThrow(
      /at least 3 FAQ/,
    );
    expect(() => validateReferencePages([page({ howToUse: ['one'] })])).toThrow(
      /at least 2 howToUse/,
    );
  });

  it('rejects a page with no blocks', () => {
    expect(() => validateReferencePages([page({ blocks: [] })])).toThrow(/at least one block/);
  });

  it('rejects an empty FAQ question or answer', () => {
    const faq = [
      { q: '', a: 'A' },
      { q: 'Q', a: 'A' },
      { q: 'Q', a: 'A' },
    ];
    expect(() => validateReferencePages([page({ faq })])).toThrow(/empty FAQ/);
  });

  it('rejects a related slug that no page declares', () => {
    expect(() => validateReferencePages([page({ related: ['ghost'] })])).toThrow(
      /related slug not found: ghost/,
    );
  });

  it('accepts a related slug that a sibling page declares', () => {
    const other = page({ slug: 'other-page' });
    expect(() => validateReferencePages([page({ related: ['other-page'] }), other])).not.toThrow();
  });

  it('allows an empty related list', () => {
    expect(() => validateReferencePages([page({ related: [] })])).not.toThrow();
  });

  it('reports every problem at once rather than the first', () => {
    const broken = page({ slug: 'broken', title: '', intro: '', blocks: [] });
    expect(() => validateReferencePages([broken])).toThrow(
      /empty title[\s\S]*empty intro[\s\S]*at least one block/,
    );
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/data/reference/validate.test.ts`
Expected: FAIL — `Failed to resolve import "./validate"`

- [ ] **Step 3: 写 validate.ts**

```ts
import type { ReferencePage } from './types';

/**
 * 构建期防呆：半成品页面必须在构建时炸掉，而不是带着空 intro 或断掉的内链
 * 混进 dist/ 被爬虫抓走。由 entry-prerender 在写盘前调用一次。
 *
 * 一次收集全部问题再抛，避免「修一个跑一次」的循环。
 */
export function validateReferencePages(pages: readonly ReferencePage[]): void {
  const slugs = new Set<string>();
  const problems: string[] = [];

  for (const page of pages) {
    if (slugs.has(page.slug)) problems.push(`duplicate slug: ${page.slug}`);
    slugs.add(page.slug);
  }

  for (const page of pages) {
    for (const field of ['title', 'summary', 'description', 'intro'] as const) {
      if (!page[field].trim()) problems.push(`${page.slug}: empty ${field}`);
    }
    if (page.blocks.length < 1) problems.push(`${page.slug}: needs at least one block`);
    if (page.howToUse.length < 2) problems.push(`${page.slug}: needs at least 2 howToUse steps`);
    if (page.faq.length < 3) problems.push(`${page.slug}: needs at least 3 FAQ entries`);
    for (const entry of page.faq) {
      if (!entry.q.trim() || !entry.a.trim()) {
        problems.push(`${page.slug}: empty FAQ question or answer`);
      }
    }
    for (const related of page.related) {
      if (!slugs.has(related)) problems.push(`${page.slug}: related slug not found: ${related}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`invalid reference pages:\n  ${problems.join('\n  ')}`);
  }
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run src/data/reference/validate.test.ts`
Expected: PASS（10 个用例）

- [ ] **Step 5: 写 `index.ts`**

```ts
import { REFERENCE_PAGES_EN } from './en';
import type { ReferenceCategory, ReferencePage } from './types';

/**
 * 当前已撰写的全部图表页。加一门语言时在数组里补一个展开项即可——
 * 语言维度靠目录划分，不靠参数。
 */
export const REFERENCE_PAGES: readonly ReferencePage[] = [...REFERENCE_PAGES_EN];

const BY_SLUG = new Map(REFERENCE_PAGES.map((page) => [page.slug, page]));

/** slug 目前全局唯一（只有一门语言）。加第二门语言时改成 (lang, slug) 复合键。 */
export function getReferencePage(slug: string): ReferencePage | undefined {
  return BY_SLUG.get(slug);
}

export function pagesInCategory(category: ReferenceCategory): ReferencePage[] {
  return REFERENCE_PAGES.filter((page) => page.category === category);
}

export type { Block, ReferenceCategory, ReferencePage } from './types';
```

- [ ] **Step 6: 写 `index.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { getReferencePage, pagesInCategory, REFERENCE_PAGES } from './index';

describe('reference page index', () => {
  it('exposes every authored page', () => {
    expect(REFERENCE_PAGES).toHaveLength(6);
  });

  it('looks a page up by slug', () => {
    expect(getReferencePage('multiplication-chart')?.title).toBe('Multiplication Chart (1–12)');
    expect(getReferencePage('no-such-chart')).toBeUndefined();
  });

  it('filters by category, preserving authoring order', () => {
    expect(pagesInCategory('math').map((page) => page.slug)).toEqual([
      'multiplication-chart',
      'squares-cubes-roots',
      'trigonometric-identities',
      'metric-conversions',
    ]);
    expect(pagesInCategory('science').map((page) => page.slug)).toEqual(['physics-constants']);
    expect(pagesInCategory('english').map((page) => page.slug)).toEqual(['irregular-verbs']);
  });
});
```

- [ ] **Step 7: 写 `ReferenceNotFound.tsx`**

标题用中性的 "Page not found"——它同时服务图表页与（Task 5 之后的）学科 hub 两个场景。

```tsx
import type { ReactElement } from 'react';
import { ENGLISH_HOME } from '../../reference-routes';

/** 未知 slug / 未知学科的兜底页。 */
export function ReferenceNotFound(): ReactElement {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1F2329]">Page not found</h1>
      <p className="mt-2 text-[#646A73]">
        This chart does not exist, or it has moved to a different category.
      </p>
      <a href={ENGLISH_HOME} className="mt-4 inline-block text-[#3370FF] hover:underline">
        ← All reference charts
      </a>
    </>
  );
}
```

- [ ] **Step 8: 写 `FaqSection.tsx`**

```tsx
import type { ReactElement } from 'react';

/** 图表页的 FAQ。同时是 FAQPage 结构化数据的数据源。 */
export function FaqSection({
  faq,
}: {
  faq: readonly { q: string; a: string }[];
}): ReactElement | null {
  if (faq.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-[#1F2329]">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-3">
        {faq.map((entry) => (
          <div key={entry.q} className="bg-white rounded-xl border border-[#F0F1F2] p-5">
            <dt className="font-semibold text-[#1F2329]">{entry.q}</dt>
            <dd className="mt-1 text-sm text-[#646A73]">{entry.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 9: 写 `RelatedCharts.tsx`**

Task 4 里 `referencePath` 仍是一参（扁平 URL）。

```tsx
import type { ReactElement } from 'react';
import type { ReferencePage } from '../../data/reference/types';
import { referencePath } from '../../reference-routes';

/** 相关图表内链。空列表时整段不渲染，而不是留一个空标题。 */
export function RelatedCharts({ pages }: { pages: readonly ReferencePage[] }): ReactElement | null {
  if (pages.length === 0) return null;
  return (
    <section className="mt-10 print:hidden" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-[#1F2329]">
        Related charts
      </h2>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.slug)}
              className="block h-full bg-white rounded-xl border border-[#F0F1F2] p-5 hover:shadow-md transition-shadow"
            >
              <span className="block font-semibold text-[#1F2329]">{page.title}</span>
              <span className="mt-1 block text-sm text-[#646A73]">{page.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 10: 改 `ReferenceLayout.tsx` 的打印行为**

在 `<header>` 的 className 末尾加 ` print:hidden`，在 `<footer>` 的 className 末尾加 ` print:hidden`。改后两行分别是：

```tsx
      <header className="bg-white border-b border-[#E5E6EB] sticky top-0 z-40 print:hidden">
```

```tsx
      <footer className="py-8 text-center text-sm text-[#8F959E] bg-white border-t border-[#F0F1F2] print:hidden">
```

- [ ] **Step 11: 写失败测试 `ReferencePage.test.tsx`**

Task 4 里路由仍是 `/en/reference/:slug`。

```tsx
import { render, screen } from '@testing-library/react';
import type { ContextType } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/auth-context';
import { ReferencePage } from './ReferencePage';

// happy-dom 拒绝加载外部 AdSense 脚本，这里把加载器打桩。
vi.mock('../../ads/adsense', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../ads/adsense')>();
  return { ...actual, ensureAdSenseScript: vi.fn() };
});

const auth: NonNullable<ContextType<typeof AuthContext>> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

function renderChart(url: string) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/en/reference/:slug" element={<ReferencePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ReferencePage', () => {
  it('renders the chart title, intro and table', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Multiplication Chart (1–12)',
    );
    expect(screen.getByText(/puts every times table on a single grid/)).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: '×' })).toBeTruthy();
  });

  it('renders the how-to-use steps and the FAQ', () => {
    renderChart('/en/reference/multiplication-chart');
    expect(screen.getByText(/Put one finger on the row/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeTruthy();
    expect(screen.getByText('What is a multiplication chart?')).toBeTruthy();
  });

  it('links to the related charts', () => {
    renderChart('/en/reference/multiplication-chart');
    const heading = screen.getByRole('heading', { name: 'Related charts' });
    const section = heading.closest('section');
    expect(section?.querySelector('a[href="/en/reference/squares-cubes-roots/"]')).toBeTruthy();
  });

  it('renders formula groups for the identities chart', () => {
    renderChart('/en/reference/trigonometric-identities');
    expect(screen.getByText('Pythagorean')).toBeTruthy();
    expect(screen.getByText('sin²θ + cos²θ = 1')).toBeTruthy();
  });

  it('omits the related section when a chart has no siblings', () => {
    renderChart('/en/reference/irregular-verbs');
    expect(screen.queryByRole('heading', { name: 'Related charts' })).toBeNull();
  });

  it('404s on an unknown slug', () => {
    renderChart('/en/reference/no-such-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
```

- [ ] **Step 12: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferencePage.test.tsx`
Expected: FAIL — 缺少 FaqSection

- [ ] **Step 13: 重写 `ReferencePage.tsx`**

```tsx
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { AdUnit } from '../../ads/AdUnit';
import { getReferencePage } from '../../data/reference';
import { ENGLISH_HOME } from '../../reference-routes';
import { BlockRenderer } from './blocks/BlockRenderer';
import { FaqSection } from './FaqSection';
import { PrintButton } from './PrintButton';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';
import { RelatedCharts } from './RelatedCharts';

/**
 * 一张可打印的参考图表。
 *
 * 渲染顺序固定：面包屑 → H1 → intro → blocks → howToUse → 广告 → FAQ → related。
 * 广告落在数据块之后、FAQ 之前，是为了让打印输出与正文阅读都不被广告打断。
 */
export function ReferencePage(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getReferencePage(slug) : undefined;

  if (!page) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const related = page.related
    .map((relatedSlug) => getReferencePage(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="text-sm text-[#646A73] print:hidden">
        <a href={ENGLISH_HOME} className="hover:text-[#1F2329] transition-colors">
          All charts
        </a>
      </nav>

      <article className="mt-4 bg-white rounded-2xl border border-[#F0F1F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2329]">{page.title}</h1>
            <p className="mt-1 text-sm text-[#646A73]">{page.description}</p>
          </div>
          <span className="shrink-0 px-3 py-1 bg-blue-100 text-[#3370FF] text-xs font-medium rounded-full capitalize print:hidden">
            {page.category}
          </span>
        </div>

        <div className="p-6">
          <p className="text-[#1F2329] leading-relaxed">{page.intro}</p>

          <BlockRenderer blocks={page.blocks} />

          <section className="mt-10 print:hidden" aria-labelledby="how-to-use-heading">
            <h2 id="how-to-use-heading" className="text-xl font-bold text-[#1F2329]">
              How to use it
            </h2>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-[#1F2329]">
              {page.howToUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="mt-6 flex justify-end print:hidden">
            <PrintButton />
          </div>
        </div>
      </article>

      <AdUnit placement="referenceBottom" />

      <FaqSection faq={page.faq} />

      <RelatedCharts pages={related} />
    </ReferenceLayout>
  );
}
```

- [ ] **Step 14: 改 `ReferenceIndex.tsx` 到新 API（字段改名，仍扁平链接）**

Task 5 会把它改成三张学科卡；这里只做让编译通过、链接仍指向扁平 URL 的最小改动。`category` 值现在是小写，用 `capitalize` 类保持显示效果。

```tsx
import type { ReactElement } from 'react';
import { REFERENCE_PAGES } from '../../data/reference';
import { referencePath } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页，列出全部打印参考图表。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers — multiplication
          tables, roots, trigonometric identities, physics constants, metric conversions and
          irregular verbs. Open a chart and print it in one click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_PAGES.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.slug)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <span className="inline-block self-start px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3 capitalize">
                {page.category}
              </span>
              <h2 className="text-lg font-bold text-[#1F2329]">{page.title}</h2>
              <p className="mt-2 text-sm text-[#646A73]">{page.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </ReferenceLayout>
  );
}
```

- [ ] **Step 15: 改 `src/reference-routes.ts` 只换 import 源**

URL 形状不变。只改 import 与 `ENGLISH_ROUTE_PATHS` 的数据来源。

```ts
import { REFERENCE_PAGES } from './data/reference';
import { EN, homePath } from './i18n/languages';

/**
 * The English surface's route table — the single place the router, the prerender/sitemap
 * route list and the link helpers all read. Mirrors `src/view-routes.ts` for the Chinese app.
 */

/** Canonical home of the English surface; also the language entry point's target. */
export const ENGLISH_HOME = homePath(EN);

/** React Router pattern for a single reference chart. */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}reference/:slug`;

/** Canonical path of a reference chart. */
export function referencePath(slug: string): string {
  return `${ENGLISH_HOME}reference/${slug}/`;
}

/** Slug of a chart from its language-stripped path (`/reference/x`), or null. */
export function referenceSlugForAppPath(appPath: string): string | null {
  const match = /^\/reference\/([^/]+)\/?$/.exec(appPath);
  return match ? match[1] : null;
}

/** Every English route path, in the shape the prerender list and sitemap use. */
export const ENGLISH_ROUTE_PATHS: string[] = [
  ENGLISH_HOME,
  ...REFERENCE_PAGES.map((page) => referencePath(page.slug)),
];
```

- [ ] **Step 16: 改 `src/seo/content-en.ts` 到新 API**

只把 `getReferenceTable` 换成 `getReferencePage`，字段名从 `table.*` 换成 `page.*`。其余不变。

```ts
import { getReferencePage } from '../data/reference';
import type { Language } from '../i18n/languages';
import { ENGLISH_HOME, referenceSlugForAppPath } from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * The English surface's page copy: a small set of printable reference charts
 * (`/en/` and `/en/reference/:slug`). Deliberately scoped — not a translation of the app.
 *
 * 注意：本阶段仍是 `kind: 'view'` 与 `{title} - {brand}` 标题格式。换成
 * `LearningResource` / `FAQPage` 与 "Printable …" 标题模板属于 SEO 阶段。
 */
export function resolveEnglishContent(appPath: string, path: string, language: Language): PageContent {
  const brand = brandFor(language);
  const home: Breadcrumb = { name: 'Home', path: ENGLISH_HOME };

  if (appPath === '/') {
    return {
      kind: 'home',
      title: `${brand.name} - ${brand.tagline}`,
      description: brand.description,
      breadcrumbs: [home],
    };
  }

  const slug = referenceSlugForAppPath(appPath);
  const page = slug ? getReferencePage(slug) : undefined;
  if (page) {
    return {
      kind: 'view',
      title: `${page.title} - ${brand.name}`,
      description: page.description,
      breadcrumbs: [home, { name: page.title, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
```

- [ ] **Step 17: 改 `src/reference-routes.test.ts`**

只把 `REFERENCE_SLUGS` 换成 `REFERENCE_PAGES`，断言值不变。

```ts
import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  referencePath,
  referenceSlugForAppPath,
} from './reference-routes';

describe('English route table', () => {
  it('has a canonical home plus one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/reference/:slug');
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(1 + REFERENCE_PAGES.length);
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain(referencePath('multiplication-chart'));
  });

  it('builds chart paths and resolves them back to a slug', () => {
    expect(referencePath('irregular-verbs')).toBe('/en/reference/irregular-verbs/');
    expect(referenceSlugForAppPath('/reference/irregular-verbs')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/reference/irregular-verbs/')).toBe('irregular-verbs');
    expect(referenceSlugForAppPath('/tutorial')).toBeNull();
  });
});
```

- [ ] **Step 18: 改 `src/seo/meta.test.ts` 的英文图表用例**

两处改动：import 换成 `REFERENCE_PAGES`；`canonicalUrl` 的样例路径与图表循环改用 `page.*`。**其余断言不变。**

把文件顶部的

```ts
import { REFERENCE_TABLES } from '../data/reference';
```

换成

```ts
import { REFERENCE_PAGES } from '../data/reference';
```

把 `canonicalUrl` 用例里的

```ts
    expect(canonicalUrl('/en/reference/multiplication-chart')).toBe(
      'https://syy.global/en/reference/multiplication-chart/',
    );
```

**保持不变**（Task 4 仍是扁平 URL）。

把图表循环用例整体换成：

```ts
  it('gives every English reference chart its own English metadata', () => {
    for (const page of REFERENCE_PAGES) {
      const path = `/en/reference/${page.slug}`;
      const meta = buildSeoMeta(path);
      expect(meta.title).toBe(`${page.title} - ${EN.name}`);
      expect(meta.description).toBe(page.description);
      expect(meta.canonical).toBe(`https://syy.global/en/reference/${page.slug}/`);
      expect(meta.htmlLang).toBe('en');
      expect(meta.alternates[0]).toEqual({
        hreflang: 'en',
        href: `https://syy.global/en/reference/${page.slug}/`,
      });
    }
  });
```

- [ ] **Step 19: 删除旧模块并在构建期接线校验**

`src/entry-prerender.ts` 里加两行 import：

```ts
import { REFERENCE_PAGES } from './data/reference';
import { validateReferencePages } from './data/reference/validate';
```

在 `const distDir = …` 之前插入：

```ts
validateReferencePages(REFERENCE_PAGES);
```

然后：

```bash
git rm src/data/reference.ts
```

- [ ] **Step 20: 确认没有旧符号残留**

Run: `grep -rn "getReferenceTable\|REFERENCE_TABLES\|REFERENCE_SLUGS" src/ worker/`
Expected: 无输出。

- [ ] **Step 21: 类型检查与全量测试**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npm test`
Expected: 全绿。本任务刻意保持扁平 URL，所以 `App.test.tsx`、`entry-server.test.tsx`、`adPlacements.test.tsx`、`src/prerender/routes.test.ts`、`src/i18n/languages.test.ts`、`src/prerender/inject.test.ts` **都不需要改**——如果其中任何一个失败了，说明改动超出了本任务范围，先修改动而不是改断言。

- [ ] **Step 22: 提交**

```bash
git add -A src/data/reference src/reference-routes.ts src/reference-routes.test.ts src/seo/content-en.ts src/seo/meta.test.ts src/components/reference src/entry-prerender.ts
git commit -m "$(cat <<'EOF'
feat(reference): 数据模块原子替换，图表页改为分节式渲染

删 src/data/reference.ts 会让 6 个消费者同时编译失败，所以建目录、
删旧文件、改完所有消费者必须一个提交。URL 形状刻意保持不变，把
分层 URL 的连带影响推到下一个提交。

图表页渲染顺序固定为 面包屑 → H1 → intro → blocks → howToUse →
广告 → FAQ → related；打印时隐藏导航、广告、FAQ、相关图表与按钮。

校验在 entry-prerender 里调用并直接 throw，一次收集全部问题再抛。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

