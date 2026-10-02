## Task 5: URL 分层与 hub 页

**Files:**
- Create: `src/data/reference/en/categories.ts`
- Create: `src/components/reference/ReferenceCategory.tsx`
- Modify: `src/reference-routes.ts`
- Modify: `src/reference-routes.test.ts`
- Modify: `src/seo/content-en.ts`
- Modify: `src/seo/meta.test.ts`
- Modify: `src/prerender/routes.test.ts`
- Modify: `src/components/reference/ReferencePage.tsx`
- Modify: `src/components/reference/ReferenceIndex.tsx`
- Modify: `src/components/reference/RelatedCharts.tsx`
- Modify: `src/entry-server.test.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/ads/adPlacements.test.tsx`
- Test: `src/components/reference/ReferenceCategory.test.tsx`
- Test: `src/components/reference/ReferenceIndex.test.tsx`

**Interfaces:**
- Consumes: `REFERENCE_PAGES`、`getReferencePage`、`pagesInCategory`（Task 4）；`ReferencePage` / `ReferenceCategory`（Task 1）；`ReferenceNotFound`（Task 4）
- Produces:
  - `CATEGORY_COPY: Record<ReferenceCategory, CategoryCopy>`，`CategoryCopy = { name: string; summary: string; intro: string }`
  - `ENGLISH_CATEGORY_ROUTE = '/en/:category'`
  - `ENGLISH_REFERENCE_ROUTE = '/en/:category/:slug'`
  - `REFERENCE_CATEGORIES: readonly ReferenceCategory[]`（`['math','science','english']`）
  - `isReferenceCategory(value: string): value is ReferenceCategory`
  - `categoryPath(category: ReferenceCategory): string`
  - `referencePath(category: ReferenceCategory, slug: string): string`（**签名由一参变为两参**）
  - `referencePartsForAppPath(appPath: string): { category: string; slug: string } | null`
  - `ReferenceCategory(): ReactElement`

- [ ] **Step 1: 写 `src/data/reference/en/categories.ts`**

```ts
import type { ReferenceCategory } from '../types';

export interface CategoryCopy {
  /** hub H1 与 `/en/` 索引卡上的学科名。 */
  name: string;
  /** `/en/` 索引卡上的一句话，约 50–80 字符。 */
  summary: string;
  /** hub 页导语，同时用作该 hub 的 meta description。 */
  intro: string;
}

/** 英文面的学科文案。修改学科措辞的唯一位置。 */
export const CATEGORY_COPY: Record<ReferenceCategory, CategoryCopy> = {
  math: {
    name: 'Math',
    summary: 'Times tables, roots, conversions and formula sheets.',
    intro:
      'Printable maths reference charts for arithmetic, algebra and geometry — times tables, squares and roots, unit conversions and formula sheets. Every chart is laid out to be printed at full size and kept on a desk or in a homework folder.',
  },
  science: {
    name: 'Science',
    summary: 'Constants, units and reference data for physics and chemistry.',
    intro:
      'Printable science reference charts: the constants and reference tables that come up in physics and chemistry homework. Each row gives the quantity, the symbol it is written with, and its value in SI units.',
  },
  english: {
    name: 'English',
    summary: 'Grammar, spelling and vocabulary reference lists.',
    intro:
      'Printable English reference charts covering grammar, spelling and vocabulary — word forms and the lists that are quicker to check than to recall. Each chart is laid out to be read at a glance and printed on a single page.',
  },
};
```

- [ ] **Step 2: 重写 `src/reference-routes.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { REFERENCE_PAGES } from './data/reference';
import {
  categoryPath,
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
  ENGLISH_ROUTE_PATHS,
  isReferenceCategory,
  REFERENCE_CATEGORIES,
  referencePartsForAppPath,
  referencePath,
} from './reference-routes';

describe('English route table', () => {
  it('has a home, three category hubs and one path per chart', () => {
    expect(ENGLISH_HOME).toBe('/en/');
    expect(REFERENCE_CATEGORIES).toEqual(['math', 'science', 'english']);
    expect(ENGLISH_ROUTE_PATHS).toHaveLength(
      1 + REFERENCE_CATEGORIES.length + REFERENCE_PAGES.length,
    );
    expect(ENGLISH_ROUTE_PATHS[0]).toBe(ENGLISH_HOME);
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/');
    expect(ENGLISH_ROUTE_PATHS).toContain('/en/math/multiplication-chart/');
  });

  it('exposes React Router patterns with a :category segment', () => {
    expect(ENGLISH_CATEGORY_ROUTE).toBe('/en/:category');
    expect(ENGLISH_REFERENCE_ROUTE).toBe('/en/:category/:slug');
  });

  it('builds category and chart paths', () => {
    expect(categoryPath('math')).toBe('/en/math/');
    expect(referencePath('math', 'multiplication-chart')).toBe('/en/math/multiplication-chart/');
    expect(referencePath('english', 'irregular-verbs')).toBe('/en/english/irregular-verbs/');
  });

  it('routes every authored page to a path under its own category', () => {
    for (const page of REFERENCE_PAGES) {
      expect(ENGLISH_ROUTE_PATHS).toContain(referencePath(page.category, page.slug));
    }
  });

  it('splits an app path into category and slug', () => {
    expect(referencePartsForAppPath('/math/multiplication-chart')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math/multiplication-chart/')).toEqual({
      category: 'math',
      slug: 'multiplication-chart',
    });
    expect(referencePartsForAppPath('/math')).toBeNull();
    expect(referencePartsForAppPath('/math/a/b')).toBeNull();
    expect(referencePartsForAppPath('/tutorial')).toBeNull();
  });

  it('recognises only the three known categories', () => {
    expect(isReferenceCategory('science')).toBe(true);
    expect(isReferenceCategory('reference')).toBe(false);
    expect(isReferenceCategory('')).toBe(false);
  });
});
```

- [ ] **Step 3: 跑测试确认失败**

Run: `npx vitest run src/reference-routes.test.ts`
Expected: FAIL — `categoryPath is not a function`

- [ ] **Step 4: 重写 `src/reference-routes.ts`**

```ts
import { REFERENCE_PAGES } from './data/reference';
import type { ReferenceCategory } from './data/reference/types';
import { EN, homePath } from './i18n/languages';

/**
 * 英文面的路由表——路由、prerender 清单、sitemap 与链接助手都从这里读。
 * 与中文 app 的 `src/view-routes.ts` 对应。
 */

/** 英文面的规范首页；也是语言入口的跳转目标。 */
export const ENGLISH_HOME = homePath(EN);

/** 学科 hub 的展示顺序，同时也是 `/en/` 索引页上卡片的顺序。 */
export const REFERENCE_CATEGORIES: readonly ReferenceCategory[] = ['math', 'science', 'english'];

/** React Router 模式：单个学科 hub。 */
export const ENGLISH_CATEGORY_ROUTE = `${ENGLISH_HOME}:category`;

/** React Router 模式：单张图表页。 */
export const ENGLISH_REFERENCE_ROUTE = `${ENGLISH_HOME}:category/:slug`;

export function isReferenceCategory(value: string): value is ReferenceCategory {
  return (REFERENCE_CATEGORIES as readonly string[]).includes(value);
}

/** 学科 hub 的规范路径：`categoryPath('math')` → `/en/math/`。 */
export function categoryPath(category: ReferenceCategory): string {
  return `${ENGLISH_HOME}${category}/`;
}

/** 图表页的规范路径：`referencePath('math', 'x')` → `/en/math/x/`。 */
export function referencePath(category: ReferenceCategory, slug: string): string {
  return `${ENGLISH_HOME}${category}/${slug}/`;
}

/** 把去掉语言前缀的 app 路径（`/math/x`）拆成学科与 slug；层级不对返回 null。 */
export function referencePartsForAppPath(
  appPath: string,
): { category: string; slug: string } | null {
  const match = /^\/([^/]+)\/([^/]+)\/?$/.exec(appPath);
  return match ? { category: match[1], slug: match[2] } : null;
}

/** 英文面的全部路由路径，供 prerender 清单与 sitemap 使用。 */
export const ENGLISH_ROUTE_PATHS: string[] = [
  ENGLISH_HOME,
  ...REFERENCE_CATEGORIES.map(categoryPath),
  ...REFERENCE_PAGES.map((page) => referencePath(page.category, page.slug)),
];
```

- [ ] **Step 5: 跑测试确认通过**

Run: `npx vitest run src/reference-routes.test.ts`
Expected: PASS（6 个用例）

- [ ] **Step 6: 重写 `src/seo/content-en.ts`**

```ts
import { getReferencePage } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { Language } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  isReferenceCategory,
  referencePartsForAppPath,
} from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';

/**
 * 英文面的页面文案：`/en/`、三个学科 hub 与各张图表页。
 * 有意保持狭窄——这不是中文 app 的翻译。
 *
 * 注意：本阶段图表页与 hub 页都仍是 `kind: 'view'`，`<title>` 也仍是
 * `{title} - {brand}` 旧格式。换成 `LearningResource` / `FAQPage` 与
 * "Printable …" 标题模板属于 SEO 阶段。
 */
export function resolveEnglishContent(
  appPath: string,
  path: string,
  language: Language,
): PageContent {
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

  const parts = referencePartsForAppPath(appPath);
  if (parts && isReferenceCategory(parts.category)) {
    const page = getReferencePage(parts.slug);
    if (page && page.category === parts.category) {
      return {
        kind: 'view',
        title: `${page.title} - ${brand.name}`,
        description: page.description,
        breadcrumbs: [
          home,
          { name: CATEGORY_COPY[page.category].name, path: categoryPath(page.category) },
          { name: page.title, path },
        ],
      };
    }
  }

  const hub = /^\/([^/]+)\/?$/.exec(appPath);
  if (hub && isReferenceCategory(hub[1])) {
    const copy = CATEGORY_COPY[hub[1]];
    return {
      kind: 'view',
      title: `${copy.name} Reference Charts - ${brand.name}`,
      description: copy.intro,
      breadcrumbs: [home, { name: copy.name, path }],
    };
  }

  return { kind: 'view', title: brand.name, description: brand.description, breadcrumbs: [home] };
}
```

- [ ] **Step 7: 更新 `src/seo/meta.test.ts` 的两处路径**

`canonicalUrl` 用例里的样例路径换成新结构：

```ts
    expect(canonicalUrl('/en/math/multiplication-chart')).toBe(
      'https://syy.global/en/math/multiplication-chart/',
    );
```

图表循环用例改成用学科分层路径：

```ts
  it('gives every English reference chart its own English metadata', () => {
    for (const page of REFERENCE_PAGES) {
      const path = `/en/${page.category}/${page.slug}`;
      const meta = buildSeoMeta(path);
      expect(meta.title).toBe(`${page.title} - ${EN.name}`);
      expect(meta.description).toBe(page.description);
      expect(meta.canonical).toBe(`https://syy.global/en/${page.category}/${page.slug}/`);
      expect(meta.htmlLang).toBe('en');
      expect(meta.alternates[0]).toEqual({
        hreflang: 'en',
        href: `https://syy.global/en/${page.category}/${page.slug}/`,
      });
    }
  });
```

其它用例（含「每条 prerendered 路由的 title/description/canonical 互不相同」那条）**保持不变**——新增的三个 hub 路径各有不同的标题与导语，该断言仍成立。

- [ ] **Step 8: 更新 `src/prerender/routes.test.ts`**

把 `expect(PRERENDER_PATHS).toContain('/en/reference/multiplication-chart/');` 换成一串新路径断言：

```ts
    expect(PRERENDER_PATHS).toContain('/en/');
    expect(PRERENDER_PATHS).toContain('/en/math/');
    expect(PRERENDER_PATHS).toContain('/en/science/');
    expect(PRERENDER_PATHS).toContain('/en/english/');
    expect(PRERENDER_PATHS).toContain('/en/math/multiplication-chart/');
```

（原文件已有一行 `expect(PRERENDER_PATHS).toContain('/en/');`，替换时不要重复。）长度断言 `expect(PRERENDER_PATHS).toHaveLength(1 + 10 + kpCount + ENGLISH_ROUTE_PATHS.length)` 与新「无重复」断言**保持不变**。

- [ ] **Step 9: 改 `src/components/reference/RelatedCharts.tsx` 的链接**

把 `href={referencePath(page.slug)}` 改成：

```tsx
              href={referencePath(page.category, page.slug)}
```

- [ ] **Step 10: 改 `ReferencePage.tsx` 的面包屑与 404 判据**

把 `const { slug } = useParams<{ slug: string }>();` 与紧随的两行换成：

```tsx
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const candidate =
    category && slug && isReferenceCategory(category) ? getReferencePage(slug) : undefined;
  // 学科必须与 URL 一致，否则 /en/math/irregular-verbs/ 会产出同一份内容的第二个 URL。
  const page = candidate && candidate.category === category ? candidate : undefined;
```

把 import 行 `import { ENGLISH_HOME } from '../../reference-routes';` 换成：

```tsx
import { categoryPath, ENGLISH_HOME, isReferenceCategory } from '../../reference-routes';
```

把面包屑里 `<a …>{ENGLISH_HOME}</a>` 之后补上学科层（插在 `</nav>` 之前）：

```tsx
        <span className="mx-2">/</span>
        <a href={categoryPath(page.category)} className="hover:text-[#1F2329] transition-colors">
          {CATEGORY_COPY[page.category].name}
        </a>
```

并在 import 区加上：

```tsx
import { CATEGORY_COPY } from '../../data/reference/en/categories';
```

把右上角那个 `<span … capitalize print:hidden>{page.category}</span>` 的内容换成 `{CATEGORY_COPY[page.category].name}`，并去掉 `capitalize` 类（不再需要）。

文档注释里的「一张可打印的参考图表」之上补一行路径说明：

```tsx
/**
 * `/en/:category/:slug` —— 一张可打印的参考图表。
```

- [ ] **Step 11: 写失败测试 `ReferencePage.test.tsx`（改成新路由与 404 判据）**

把 `renderChart` 里的路由与用例路径换成新结构，并补三个 404 用例：

```tsx
function renderChart(url: string) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/en/:category/:slug" element={<ReferencePage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
```

用例路径全部由 `/en/reference/<slug>` 改为 `/en/<category>/<slug>`：
`/en/math/multiplication-chart`、`/en/math/trigonometric-identities`、`/en/english/irregular-verbs`。

「links to the related charts」用例的选择器改为：

```tsx
    expect(section?.querySelector('a[href="/en/math/squares-cubes-roots/"]')).toBeTruthy();
```

「404s on an unknown slug」用例路径改为 `/en/math/no-such-chart`，并追加两条：

```tsx
  it('404s when the slug belongs to a different category', () => {
    renderChart('/en/math/irregular-verbs');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });

  it('404s on an unknown category', () => {
    renderChart('/en/legacy/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
```

- [ ] **Step 12: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferencePage.test.tsx`
Expected: PASS（8 个用例）

- [ ] **Step 13: 写失败测试 `ReferenceCategory.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceCategory } from './ReferenceCategory';

function renderHub(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/en/:category" element={<ReferenceCategory />} />
      </Routes>
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceCategory hub', () => {
  it('lists every chart in the category', () => {
    renderHub('/en/math');
    expect(links()).toContain('/en/math/multiplication-chart/');
    expect(links()).toContain('/en/math/metric-conversions/');
    expect(links()).not.toContain('/en/science/physics-constants/');
  });

  it('shows the category name as the page heading and its intro', () => {
    renderHub('/en/math');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
    expect(screen.getByText(/Printable maths reference charts/)).toBeTruthy();
  });

  it('lists the single chart in a sparse category', () => {
    renderHub('/en/english');
    expect(links()).toContain('/en/english/irregular-verbs/');
  });

  it('404s on an unknown category', () => {
    renderHub('/en/legacy');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Page not found');
  });
});
```

- [ ] **Step 14: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferenceCategory.test.tsx`
Expected: FAIL — `Failed to resolve import "./ReferenceCategory"`

- [ ] **Step 15: 写 `ReferenceCategory.tsx`**

```tsx
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { pagesInCategory } from '../../data/reference';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { ENGLISH_HOME, isReferenceCategory, referencePath } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';
import { ReferenceNotFound } from './ReferenceNotFound';

/** `/en/:category` —— 一个学科的图表 hub，同时是该科图表的内链枢纽。 */
export function ReferenceCategory(): ReactElement {
  const { category } = useParams<{ category: string }>();

  if (!category || !isReferenceCategory(category)) {
    return (
      <ReferenceLayout>
        <ReferenceNotFound />
      </ReferenceLayout>
    );
  }

  const copy = CATEGORY_COPY[category];
  const pages = pagesInCategory(category);

  return (
    <ReferenceLayout>
      <nav aria-label="Breadcrumb" className="text-sm text-[#646A73]">
        <a href={ENGLISH_HOME} className="hover:text-[#1F2329] transition-colors">
          All charts
        </a>
      </nav>

      <section className="mt-4">
        <h1 className="text-3xl font-bold text-[#1F2329]">{copy.name}</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">{copy.intro}</p>
      </section>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => (
          <li key={page.slug}>
            <a
              href={referencePath(page.category, page.slug)}
              className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
            >
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

- [ ] **Step 16: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferenceCategory.test.tsx`
Expected: PASS（4 个用例）

- [ ] **Step 17: 写失败测试 `ReferenceIndex.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ReferenceIndex } from './ReferenceIndex';

function renderIndex() {
  return render(
    <MemoryRouter>
      <ReferenceIndex />
    </MemoryRouter>,
  );
}

const links = () => screen.getAllByRole('link').map((link) => link.getAttribute('href'));

describe('ReferenceIndex', () => {
  it('links to each of the three category hubs', () => {
    renderIndex();
    expect(links()).toContain('/en/math/');
    expect(links()).toContain('/en/science/');
    expect(links()).toContain('/en/english/');
  });

  it('does not list individual charts', () => {
    renderIndex();
    expect(links()).not.toContain('/en/math/multiplication-chart/');
  });

  it('keeps a landing heading and intro', () => {
    renderIndex();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Printable Study Reference');
    expect(screen.getByText(/Free, printable reference charts for students/)).toBeTruthy();
  });
});
```

- [ ] **Step 18: 跑测试确认失败**

Run: `npx vitest run src/components/reference/ReferenceIndex.test.tsx`
Expected: FAIL — 仍在链接单张图表，且没有 `/en/science/`

- [ ] **Step 19: 重写 `ReferenceIndex.tsx`**

```tsx
import type { ReactElement } from 'react';
import { CATEGORY_COPY } from '../../data/reference/en/categories';
import { categoryPath, REFERENCE_CATEGORIES } from '../../reference-routes';
import { ReferenceLayout } from './ReferenceLayout';

/** `/en/` —— 英文面的落地页：站点简介 + 三个学科入口。 */
export function ReferenceIndex(): ReactElement {
  return (
    <ReferenceLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2329]">Printable Study Reference</h1>
        <p className="mt-2 max-w-2xl text-[#646A73]">
          Free, printable reference charts for students, parents and teachers. Pick a subject to see
          every chart — open one and print it in a single click.
        </p>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REFERENCE_CATEGORIES.map((category) => {
          const copy = CATEGORY_COPY[category];
          return (
            <li key={category}>
              <a
                href={categoryPath(category)}
                className="flex h-full flex-col bg-white rounded-2xl border border-[#F0F1F2] shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-lg font-bold text-[#1F2329]">{copy.name}</h2>
                <p className="mt-2 text-sm text-[#646A73]">{copy.summary}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </ReferenceLayout>
  );
}
```

- [ ] **Step 20: 跑测试确认通过**

Run: `npx vitest run src/components/reference/ReferenceIndex.test.tsx`
Expected: PASS（3 个用例）

- [ ] **Step 21: 更新三处受 URL 变更影响的既有测试**

`src/entry-server.test.tsx` 的最后一条用例：

```tsx
  it('renders the English surface with real English content', () => {
    expect(render('/en')).toContain('Printable Study Reference');
    expect(render('/en/math/multiplication-chart')).toContain('Multiplication Chart');
  });
```

`src/App.test.tsx` 里那条旧路径用例：

```tsx
  it('serves an English reference chart at /en/:category/:slug', () => {
    renderApp('/en/math/multiplication-chart');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Multiplication Chart (1–12)');
  });
```

`src/ads/adPlacements.test.tsx` 的图表页用例：

```tsx
  it('shows one ad on an English reference chart', () => {
    const { container } = renderAt(
      '/en/math/multiplication-chart',
      '/en/:category/:slug',
      <ReferencePage />,
    );
    expect(adCount(container)).toBe(1);
  });
```

- [ ] **Step 22: 类型检查与全量测试**

Run: `npx tsc -b`
Expected: 无输出（成功）

Run: `npm test`
Expected: 全绿。`src/i18n/languages.test.ts` 与 `src/prerender/inject.test.ts` 用 `/en/reference/...` 只是**字面量样例**（前者测语言前缀剥离、后者测路径转文件名），对新结构同样成立，**不需要改**。

- [ ] **Step 23: 提交**

```bash
git add -A src/data/reference/en/categories.ts src/reference-routes.ts src/reference-routes.test.ts src/seo/content-en.ts src/seo/meta.test.ts src/prerender/routes.test.ts src/components/reference src/entry-server.test.tsx src/App.test.tsx src/ads/adPlacements.test.tsx
git commit -m "$(cat <<'EOF'
feat(reference): URL 分层到学科，新增学科 hub 页

/en/math/multiplication-chart/ 取代 /en/reference/multiplication-chart/，
新增 /en/{math,science,english}/ 三个学科 hub 作为该科图表的内链枢纽。
/en/ 从「列全量图表」收敛为「三张学科卡」——100 页铺开后前者会变成噪声墙。

学科与 URL 不一致时（如 /en/math/irregular-verbs/）返回未找到态，
避免同一页在多个路径下产出重复内容。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

