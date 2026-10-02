# 阶段 C 技术 SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给 `/en/` 英文面补齐结构化数据、意图化标题、og:image 与 GA4，让搜索引擎能正确理解这些页面、社交分享不再是裸链接。

**Architecture:** 三块都落在既有的 `src/seo/*` 与它的构建入口上。JSON-LD 靠扩展 `PageContent.kind` 分流（现在图表页与 hub 页都挤在兜底的 `'view'` 里）；标题模板走 `content-en.ts` 的确定性规则；og:image 是一个新的构建期子系统——纯函数负责卡片布局（可单测），渲染层负责 satori→PNG（I/O，失败不阻断构建）。

**Tech Stack:** React 19、TypeScript（strict + `verbatimModuleSyntax`）、satori、`@resvg/resvg-wasm`、Vitest（happy-dom）

**Spec:** `docs/superpowers/specs/2026-10-02-english-seo-ads-design.md` 的 Section 3

## Global Constraints

- **本阶段不扩内容**：交付后站上仍是 10 个英文页。它把地基做对，不产生新流量。
- **内链已由阶段 B 交付**（`/en/` → 学科 hub、hub → 图表、图表 → related + 面包屑）。本计划**不含内链工作**。
- **og:image 只覆盖英文面 10 页**：`/en/`、三个学科 hub、六张图表页。不做中文页。
- **不做并发池、不做内容哈希缓存**——那是为初版估的 390 张设计的，10 张不需要。
- **渲染失败必须回退，不 throw**：单张失败则省略该页的 og:image，绝不挂掉部署。
- **标题只写 "Printable"，不写 "PDF"**。我们提供浏览器打印，不发 PDF 文件。
- **新增字体放 `assets/fonts/`，不放 `public/`**——`public/` 是浏览器会下载的地方，这份字体只服务构建期。
- **两个资源旋钮必须保持默认**（`html_handling = auto-trailing-slash`、`not_found_handling = none`）——`wrangler.toml` 里已写明理由，本阶段不要动它们。
- **TypeScript**：`strict`、`verbatimModuleSyntax`（类型导入写 `import type { X }`）、`noUnusedLocals`、`noUnusedParameters`。命名导出。
- **测试命令**：`./node_modules/.bin/vitest run <path>`，全量 `npm test`。**不要用裸 `npx <tool>` 或 `npm run lint`**——本机环境下它们会触发装包副作用，改动 `node_modules` 与 `pnpm-lock.yaml`。
- **提交信息**：Conventional Commits，结尾空一行加 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`。

### 一条前置依赖（不属于本计划）

**部署管道目前不工作**：`main` 上的 worker 脚本没有出现在生产（证据：`https://api.syy.global/definitely-not-a-real-route` 返回纯文本 `Not found`，而代码返回 HTML）。静态内容却始终是新的 → apex 由另一条不在本仓库配置里的管道在服务。

后果：**本计划的所有产出，在管道修好之前都不会上线**。这不影响开发与测试（本地全都能验），但「上了线才算数」这件事要先解决。相关的排查线索在 `wrangler.toml` 的注释里。

## 文件结构

**新建**

| 文件 | 职责 | 任务 |
|---|---|---|
| `src/seo/analytics.ts` | GA4 snippet 生成（含同意模式默认值），未配置 id 时返回空 | 3 |
| `src/prerender/og-card.ts` | 纯函数：页面数据 + 品牌 → satori 元素树 | 4 |
| `src/prerender/og.ts` | satori → resvg-wasm → PNG，写盘，逐张回退 | 5 |
| `assets/fonts/inter-latin-{400,700}-normal.woff` | 构建期字体（合计约 62KB） | 5 |

**修改**

| 文件 | 改动 | 任务 |
|---|---|---|
| `src/seo/types.ts` | `PageContent.kind` 加 `'reference'` / `'hub'` | 1 |
| `src/seo/content-en.ts` | 图表页与 hub 页返回新 kind，带 `resource`/`faq`/`charts` | 1 |
| `src/seo/meta.ts` | `LearningResource` / `FAQPage` / `CollectionPage` + `ItemList` 分支 | 1 |
| `src/seo/meta.test.ts` | 新分支断言 | 1 |
| `src/seo/site.ts` | `BrandCopy` 加可选 `titleBrand` | 2 |
| `src/seo/content-en.ts` | 标题模板（同文件第二次改，任务 2） | 2 |
| `src/seo/head.ts` | 注入 GA4 | 3 |
| `src/seo/head.test.ts` | GA4 注入断言 | 3 |
| `package.json` | devDeps: `satori`、`@resvg/resvg-wasm` | 5 |
| `src/entry-prerender.ts` | 调 `writeOgImages` | 5 |
| `src/seo/og.ts` | 新增：`ogImagePath(route)` 与 `ogImageUrl(route)` | 6 |
| `src/seo/meta.ts` | `ogImage` + `og:image:width/height` + `twitter:card` | 6 |
| `src/seo/head.ts` | 输出 og:image 相关标签 | 6 |

---

## Task 1: 内容模型扩展与 JSON-LD 补完

现在图表页与 hub 页都返回兜底的 `kind: 'view'`，于是两者共用同一套 `WebPage` + `BreadcrumbList`。拆出两个 kind，各自拿到该有的标记。

**Files:**
- Modify: `src/seo/types.ts`
- Modify: `src/seo/content-en.ts`
- Modify: `src/seo/meta.ts`
- Test: `src/seo/meta.test.ts`

**Interfaces:**
- Consumes: `getReferencePage`、`pagesInCategory`、`REFERENCE_PAGES`（`src/data/reference`）；`CATEGORY_COPY`（`src/data/reference/en/categories`）；`CATEGORY_COPY[cat].name`、`page.title`、`page.description`、`page.faq`、`page.category`、`page.slug`
- Produces: `PageContent` 新增两个变体；`buildJsonLd` 对它们分别产出 `LearningResource` + `FAQPage` + `BreadcrumbList` 与 `CollectionPage` + `ItemList` + `BreadcrumbList`

- [ ] **Step 1: 写失败测试**

在 `src/seo/meta.test.ts` 末尾追加：

```ts
describe('JSON-LD for the English surface', () => {
  it('marks a chart page as a LearningResource with its FAQ', () => {
    const meta = buildSeoMeta('/en/math/multiplication-chart');
    const types = meta.jsonLd.map((block) => block['@type']);

    expect(types).toEqual(['LearningResource', 'FAQPage', 'BreadcrumbList']);

    const faq = meta.jsonLd[1] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
    expect(faq.mainEntity[0].name).toBe('What is a multiplication chart?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain('every pair of numbers');
  });

  it('marks a hub page as a CollectionPage whose ItemList covers that category', () => {
    const meta = buildSeoMeta('/en/math');
    const types = meta.jsonLd.map((block) => block['@type']);

    expect(types).toEqual(['CollectionPage', 'ItemList', 'BreadcrumbList']);

    const list = meta.jsonLd[1] as { numberOfItems: number; itemListElement: { name: string; url: string }[] };
    expect(list.numberOfItems).toBe(4);
    expect(list.itemListElement[0].name).toBe('Multiplication Chart (1–12)');
    expect(list.itemListElement[0].url).toBe('https://syy.global/en/math/multiplication-chart/');
  });

  it('leaves the Chinese pages on their existing markup', () => {
    const point = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    expect(buildSeoMeta(`/knowledge/${point.id}`).jsonLd.map((b) => b['@type'])).toEqual([
      'LearningResource',
      'BreadcrumbList',
    ]);
    expect(buildSeoMeta('/tutorial').jsonLd.map((b) => b['@type'])).toEqual([
      'WebPage',
      'BreadcrumbList',
    ]);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/seo/meta.test.ts`
Expected: FAIL —— 图表页拿到的是 `['WebPage', 'BreadcrumbList']`，与 `['LearningResource', 'FAQPage', 'BreadcrumbList']` 不等。

- [ ] **Step 3: 扩展 `PageContent`**

`src/seo/types.ts` 改为（保留原有的 `home` / `view` / `knowledge` 三个变体不动，新增两个）：

```ts
/** Normalized page metadata a route resolves to, before URL/schema composition. */
export type PageContent =
  | { kind: 'home'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | { kind: 'view'; title: string; description: string; breadcrumbs: Breadcrumb[] }
  | {
      kind: 'knowledge';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      resource: { name: string; description: string; subject: string; grade: string };
    }
  | {
      /** 英文面的图表页。带 faq 是为了产出 FAQPage 标记，不是文案来源。 */
      kind: 'reference';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      resource: { name: string; description: string; category: string };
      faq: { q: string; a: string }[];
    }
  | {
      /** 英文面的学科 hub。charts 构成 ItemList。 */
      kind: 'hub';
      title: string;
      description: string;
      breadcrumbs: Breadcrumb[];
      category: string;
      charts: { name: string; path: string }[];
    };
```

- [ ] **Step 4: 让 `content-en.ts` 返回新 kind**

`src/seo/content-en.ts`：import 区加上 `pagesInCategory`、`referencePath`，并把两处 `kind: 'view'` 换掉。

```ts
import { getReferencePage, pagesInCategory } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { Language } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  isReferenceCategory,
  referencePartsForAppPath,
  referencePath,
} from '../reference-routes';
import { brandFor } from './site';
import type { Breadcrumb, PageContent } from './types';
```

图表页分支（原来 `kind: 'view'` 那一处）换成：

```ts
    if (page && page.category === parts.category) {
      return {
        kind: 'reference',
        title: `${page.title} - ${brand.name}`,
        description: page.description,
        breadcrumbs: [
          home,
          { name: CATEGORY_COPY[page.category].name, path: categoryPath(page.category) },
          { name: page.title, path },
        ],
        resource: {
          name: page.title,
          description: page.description,
          category: CATEGORY_COPY[page.category].name,
        },
        faq: page.faq,
      };
    }
```

hub 分支换成：

```ts
  const hub = /^\/([^/]+)\/?$/.exec(appPath);
  if (hub && isReferenceCategory(hub[1])) {
    const copy = CATEGORY_COPY[hub[1]];
    return {
      kind: 'hub',
      title: `${copy.name} Reference Charts - ${brand.name}`,
      description: copy.intro,
      breadcrumbs: [home, { name: copy.name, path }],
      category: copy.name,
      charts: pagesInCategory(hub[1]).map((page) => ({
        name: page.title,
        path: referencePath(page.category, page.slug),
      })),
    };
  }
```

文件顶部的文档注释里那句「本阶段图表页与 hub 页都仍是 `kind: 'view'`」要一并删掉——它已经不成立了。

- [ ] **Step 5: 加 `buildJsonLd` 的两个分支**

`src/seo/meta.ts`，在 `knowledge` 分支之后、默认 `WebPage` 返回之前插入：

```ts
  if (content.kind === 'reference') {
    return [
      {
        '@context': context,
        '@type': 'LearningResource',
        name: content.resource.name,
        description: content.resource.description,
        url: canonical,
        inLanguage,
        learningResourceType: 'reference chart',
        about: content.resource.category,
      },
      {
        '@context': context,
        '@type': 'FAQPage',
        mainEntity: content.faq.map((entry) => ({
          '@type': 'Question',
          name: entry.q,
          acceptedAnswer: { '@type': 'Answer', text: entry.a },
        })),
      },
      breadcrumbJsonLd(content, context),
    ];
  }

  if (content.kind === 'hub') {
    return [
      {
        '@context': context,
        '@type': 'CollectionPage',
        name: content.title,
        description: content.description,
        url: canonical,
        inLanguage,
        about: content.category,
      },
      {
        '@context': context,
        '@type': 'ItemList',
        numberOfItems: content.charts.length,
        itemListElement: content.charts.map((chart, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: chart.name,
          url: canonicalUrl(chart.path),
        })),
      },
      breadcrumbJsonLd(content, context),
    ];
  }
```

- [ ] **Step 6: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/seo/meta.test.ts`
Expected: PASS

- [ ] **Step 7: 全量测试 + 类型检查**

Run: `npm test` → 全绿；`./node_modules/.bin/tsc -b` → 无输出。
若有既有断言因 kind 变化而失效，按新结构更新断言值——**不要放宽断言**。

- [ ] **Step 8: 提交**

```bash
git add src/seo/types.ts src/seo/content-en.ts src/seo/meta.ts src/seo/meta.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): 图表页与学科 hub 各自的 JSON-LD

两者原先都挤在兜底的 kind: 'view' 里，共用 WebPage + BreadcrumbList。
拆成 'reference'（LearningResource + FAQPage）与 'hub'（CollectionPage +
ItemList），FAQ 数据来自页面已有的 faq 字段。

注：Google 自 2023-08 起把 FAQ 富摘要收窄到政府/医疗类站点，本站拿不到
富摘要——这条标记的收益是帮助 Google 理解页面内容，不是展示。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 标题模板与 titleBrand

搜「printable multiplication chart」的人，现在的标题里没有 "printable"。改成 `Printable {title} – Free | {titleBrand}`。

**Files:**
- Modify: `src/seo/site.ts`
- Modify: `src/seo/content-en.ts`
- Test: `src/seo/meta.test.ts`

**Interfaces:**
- Consumes: `BrandCopy`（`src/seo/site.ts`）
- Produces: `BrandCopy.titleBrand?: string`；`src/seo/content-en.ts` 导出 `englishTitleFor(subject: string, brand: BrandCopy): string`

- [ ] **Step 1: 写失败测试**

在 `src/seo/meta.test.ts` 追加：

```ts
describe('English title template', () => {
  it('leads with Printable and puts the intent modifier before the brand', () => {
    expect(buildSeoMeta('/en/math/multiplication-chart').title).toBe(
      'Printable Multiplication Chart (1–12) – Free | Shiyiyuan',
    );
    expect(buildSeoMeta('/en/math').title).toBe('Printable Math Charts – Free | Shiyiyuan');
  });

  it('keeps every English title inside the ~60 character SERP budget', () => {
    for (const path of ENGLISH_ROUTE_PATHS) {
      // 首页走的是「品牌 + tagline」，刻意不走这个模板，因此不在预算内。
      if (path === ENGLISH_HOME) continue;
      const title = buildSeoMeta(path).title;
      expect(title.length, `${path} → ${title}`).toBeLessThanOrEqual(60);
    }
  });

  it('leaves Chinese titles alone', () => {
    expect(buildSeoMeta('/').title).toContain('拾艺院');
    expect(buildSeoMeta('/').title).not.toContain('Printable');
  });
});
```

`ENGLISH_ROUTE_PATHS` 与 `ENGLISH_HOME` 需要从 `../reference-routes` import（该测试文件若尚未 import，就在顶部加上）。

- [ ] **Step 2: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/seo/meta.test.ts`
Expected: FAIL —— 实际是 `Multiplication Chart (1–12) - Shiyiyuan Study Reference`。

- [ ] **Step 3: 给 `BrandCopy` 加 `titleBrand`**

`src/seo/site.ts`：接口加一个可选字段，英文品牌填上短名。

```ts
export interface BrandCopy {
  /** Full site name: title suffix, `og:site_name` and JSON-LD name. */
  name: string;
  /**
   * 短品牌名，**只用于 `<title>`**。全名（如 `Shiyiyuan Study Reference`，26 字符）
   * 拼进标题会让总长超过 Google 约 60 字符的截断点，把意图修饰词挤掉。
   * 不设则退回 `name`（中文标题因此不受影响）。
   */
  titleBrand?: string;
  /** Short one-line positioning used in the home title. */
  tagline: string;
  /** Default page description for the home page and unknown routes. */
  description: string;
  /** Open Graph locale (underscored, e.g. `en_US`). */
  ogLocale: string;
}
```

英文品牌那一项加上 `titleBrand: 'Shiyiyuan',`（放在 `name` 之后）。

- [ ] **Step 4: 改标题模板**

`src/seo/content-en.ts`：加一个导出的辅助函数，并在两个分支里用它。

```ts
/** 品牌短名，缺省退回全名。 */
function titleBrand(brand: BrandCopy): string {
  return brand.titleBrand ?? brand.name;
}

/**
 * 英文面标题模板：意图修饰词在前、品牌在后。
 *
 * 只写 "Printable" 不写 "PDF"——我们提供的是浏览器打印，不发 PDF 文件；
 * 宣称 PDF 而用户落地后找不到下载按钮就是跳出。
 */
export function englishTitleFor(subject: string, brand: BrandCopy): string {
  return `Printable ${subject} – Free | ${titleBrand(brand)}`;
}
```

（`BrandCopy` 需 `import type { BrandCopy } from './site';`。）

图表页那行 `title: \`${page.title} - ${brand.name}\`` 换成：

```ts
        title: englishTitleFor(page.title, brand),
```

hub 分支那行 `title: \`${copy.name} Reference Charts - ${brand.name}\`` 换成：

```ts
      title: englishTitleFor(`${copy.name} Charts`, brand),
```

`home` 分支与最后的兜底分支**保持不变**（首页与未知路由不走这个模板）。

- [ ] **Step 5: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/seo/meta.test.ts`
Expected: PASS。若 60 字符那条失败，**改模板措辞而不是抬高上限**——上限来自 Google 的截断点，不是随手定的。

- [ ] **Step 6: 全量测试 + 类型检查**

Run: `npm test` → 全绿；`./node_modules/.bin/tsc -b` → 无输出。

- [ ] **Step 7: 提交**

```bash
git add src/seo/site.ts src/seo/content-en.ts src/seo/meta.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): 英文面标题加意图修饰词，品牌改用短名

搜 "printable multiplication chart" 的人，原标题里没有 printable。改成
Printable {title} – Free | Shiyiyuan。

新增 BrandCopy.titleBrand：品牌全名 26 字符拼进去会让标题到 ~84 字符，在
Google 约 60 字符处把修饰词挤掉，等于两样都浪费。短名只用于 <title>，
og:site_name 与 JSON-LD 仍用全名。测试逐条断言所有英文标题 ≤ 60 字符。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: GA4 与同意模式

**Files:**
- Create: `src/seo/analytics.ts`
- Modify: `src/seo/head.ts`
- Test: `src/seo/analytics.test.ts`
- Test: `src/seo/head.test.ts`

**Interfaces:**
- Produces: `buildAnalyticsTags(measurementId: string | undefined): string[]`（未配置时返回 `[]`）；`EEA_UK_CH_REGIONS: readonly string[]`；`GA4_MEASUREMENT_ID: string | undefined`

- [ ] **Step 1: 写失败测试 `src/seo/analytics.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildAnalyticsTags, EEA_UK_CH_REGIONS } from './analytics';

describe('buildAnalyticsTags', () => {
  it('emits nothing at all when no measurement id is configured', () => {
    // 与 AD_SLOTS 改成 null 后的处理方式一致：宁可不注入，也不留一个空壳 script。
    expect(buildAnalyticsTags(undefined)).toEqual([]);
    expect(buildAnalyticsTags('')).toEqual([]);
  });

  it('denies analytics storage by default in EEA/UK/Switzerland and grants it elsewhere', () => {
    const [consent] = buildAnalyticsTags('G-TEST123');
    expect(consent).toContain("gtag('consent','default'");
    expect(consent).toContain("analytics_storage:'denied'");
    expect(consent).toContain('region:');
    for (const code of ['DE', 'FR', 'GB', 'CH', 'NO']) {
      expect(EEA_UK_CH_REGIONS).toContain(code);
    }
  });

  it('loads the tag with the configured id', () => {
    const tags = buildAnalyticsTags('G-TEST123');
    expect(tags.join('\n')).toContain('G-TEST123');
    expect(tags.join('\n')).toContain('googletagmanager.com/gtag/js');
  });
});

describe('EEA_UK_CH_REGIONS', () => {
  it('is exactly the EEA (EU-27 + Iceland, Liechtenstein, Norway) plus the UK and Switzerland', () => {
    expect([...EEA_UK_CH_REGIONS].sort()).toEqual(
      [
        'AT','BE','BG','CH','CY','CZ','DE','DK','EE','ES','FI','FR','GB','GR','HR','HU','IE','IS',
        'IT','LI','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK',
      ].sort(),
    );
    expect(EEA_UK_CH_REGIONS).toHaveLength(32);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/seo/analytics.test.ts`
Expected: FAIL —— `Failed to resolve import "./analytics"`

- [ ] **Step 3: 写 `src/seo/analytics.ts`**

```ts
// src/seo/analytics.ts
const env = import.meta.env as Record<string, string | undefined>;

/** GA4 measurement id（`G-XXXXXXX`）。未设置时整个分析标签不注入。 */
export const GA4_MEASUREMENT_ID: string | undefined = env.VITE_GA4_ID;

/**
 * 同意模式默认值要拒绝的区域：EEA（EU-27 + 冰岛、列支敦士登、挪威）+ 英国 + 瑞士。
 *
 * 名单按定义写死为可核对的常量，而不是抄一份会过期的国家列表：EU-27 加上
 * IS/LI/NO 是 EEA 的定义，GB/CH 按 spec 的要求一并纳入。
 *
 * 这些区域默认 `analytics_storage: 'denied'`，其余区域 granted——所以 GA4
 * 现在就能合规上线，不必等 CMP；CMP 获批后接管 ads 同意，analytics 这部分
 * 已经是对的。
 */
export const EEA_UK_CH_REGIONS: readonly string[] = [
  // EU-27
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU',
  'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  // EEA 非欧盟
  'IS', 'LI', 'NO',
  // 按 spec 一并纳入
  'GB', 'CH',
];

/** GA4 的 head 片段。未配置 id 时返回空数组。 */
export function buildAnalyticsTags(measurementId: string | undefined): string[] {
  if (!measurementId) return [];

  const regions = EEA_UK_CH_REGIONS.map((code) => `'${code}'`).join(',');

  return [
    '<script>window.dataLayer=window.dataLayer||[];' +
      "function gtag(){dataLayer.push(arguments);}" +
      "gtag('consent','default',{region:[" + regions + "]," +
      "analytics_storage:'denied',ad_storage:'denied'});" +
      "gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied'});" +
      "gtag('js',new Date());" +
      `gtag('config','${measurementId}');</script>`,
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`,
  ];
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/seo/analytics.test.ts`
Expected: PASS（5 个用例）

- [ ] **Step 5: 写失败测试追加到 `src/seo/head.test.ts`**

```ts
describe('renderHead analytics', () => {
  it('omits the analytics tags when no measurement id is set', () => {
    const html = renderHead(buildSeoMeta('/en/math'));
    expect(html).not.toContain('googletagmanager');
  });
});
```

Run: `./node_modules/.bin/vitest run src/seo/head.test.ts`
Expected: PASS 立刻通过（当前未接 GA4）——这是**特征测试**，用来锁住「未配置就什么都不注入」的行为，接上 GA4 后它仍然必须通过。

- [ ] **Step 6: 把 GA4 接进 `src/seo/head.ts`**

import 区加：

```ts
import { buildAnalyticsTags, GA4_MEASUREMENT_ID } from './analytics';
```

在 `for (const block of meta.jsonLd)` 那个循环**之前**插入：

```ts
  tags.push(...buildAnalyticsTags(GA4_MEASUREMENT_ID));
```

- [ ] **Step 7: 跑测试 + 构建冒烟**

Run: `./node_modules/.bin/vitest run src/seo/`
Expected: PASS

Run: `npm run build`
Expected: 结尾 `prerendered 297 pages`；`grep -c googletagmanager dist/en/math/index.html` → **0**（本机没有 `VITE_GA4_ID`，所以不注入）

- [ ] **Step 8: 提交**

```bash
git add src/seo/analytics.ts src/seo/analytics.test.ts src/seo/head.ts src/seo/head.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): 接入 GA4 与按区域给的同意模式默认值

未配置 VITE_GA4_ID 时整个片段不注入——与 AD_SLOTS 改成 null 后一致，
不留一个空壳 script。EEA/UK/瑞士默认 analytics_storage denied，其余
granted，因此不必等 CMP 就能合规上线。

区域名单按定义写成常量（EU-27 + IS/LI/NO 是 EEA 的定义，GB/CH 按 spec
纳入），并有逐条断言，避免抄一份会过期的列表。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: og 卡片布局（纯函数）

把布局与渲染分开：本任务只做「页面数据 → satori 元素树」，不碰文件系统、不加载字体，所以可以单测。

**Files:**
- Create: `src/prerender/og-card.ts`
- Test: `src/prerender/og-card.test.ts`

**Interfaces:**
- Consumes: `ReferencePage` / `Block`（`src/data/reference/types`）；`BrandCopy`（`src/seo/site`）
- Produces: `interface SatoriElement { type: string; props: { style?: Record<string, unknown>; children?: unknown } }`；`buildOgCard(page: ReferencePage, brand: BrandCopy): SatoriElement`；`OgCardInput = { title: string; subtitle: string; grid?: string[][] }`；`buildOgCardFrom(input: OgCardInput, brand: BrandCopy): SatoriElement`

- [ ] **Step 1: 写失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { getReferencePage } from '../data/reference';
import { brandFor } from '../seo/site';
import { EN } from '../i18n/languages';
import { buildOgCard, buildOgCardFrom } from './og-card';

const brand = brandFor(EN);
const collectText = (node: unknown): string =>
  typeof node === 'string'
    ? node
    : Array.isArray(node)
      ? node.map(collectText).join('')
      : node && typeof node === 'object' && 'props' in node
        ? collectText((node as { props: { children?: unknown } }).props.children)
        : '';

describe('buildOgCard', () => {
  it('shows the chart title and the brand', () => {
    const page = getReferencePage('multiplication-chart')!;
    const text = collectText(buildOgCard(page, brand));
    expect(text).toContain('Multiplication Chart (1–12)');
    expect(text).toContain('Shiyiyuan');
  });

  it('previews the first table block as a grid', () => {
    const page = getReferencePage('multiplication-chart')!;
    const card = buildOgCard(page, brand);
    // 根节点是纵向 flex
    expect((card.props.style as { flexDirection?: string }).flexDirection).toBe('column');

    // 先取到局部变量再收窄——两次写 page.blocks[0] 的话 TS 不会跨访问收窄。
    const first = page.blocks[0];
    const grid = first.kind === 'table' ? first.rows : [];
    expect(collectText(buildOgCardFrom({ title: 'T', subtitle: 'S', grid }, brand))).toContain('144');
  });

  it('falls back to the first formula lines when the page has no table', () => {
    const page = getReferencePage('trigonometric-identities')!;
    const text = collectText(buildOgCard(page, brand));
    expect(text).toContain('sin²θ + cos²θ = 1');
  });

  it('omits the grid entirely when there is neither a table nor a formulas block', () => {
    const card = buildOgCardFrom({ title: 'Only a title', subtitle: 'and a subtitle' }, brand);

    // 断言的是「没有网格容器」，而不是「标题在」——标题在任何路径上都在，
    // 那样的断言在网格容器照常产出时也会通过，等于在它声称守护的 bug 上无法失败。
    const children = card.props.children as unknown[];
    expect(children).toHaveLength(3); // 品牌 + 标题 + 副标题，没有第四个网格节点
    for (const child of children) {
      const style = (child as { props?: { style?: { flexDirection?: string } } }).props?.style;
      expect(style?.flexDirection).not.toBe('column');
    }
  });

  it('previews a table page by extracting that table', () => {
    // 钉住 buildOgCard 的表格分支：删掉它就取不到表格最后一格。
    const text = collectText(buildOgCard(getReferencePage('multiplication-chart')!, brand));
    expect(text).toContain('144');
  });

  it('falls back cleanly for a page with neither a table nor a formulas block', () => {
    // 钉住 buildOgCard 的兜底分支：blocks 为空时不该产出网格容器。
    const page = { ...getReferencePage('multiplication-chart')!, blocks: [] };
    const card = buildOgCard(page, brand);
    expect(collectText(card)).toContain(page.title);
    expect(card.props.children as unknown[]).toHaveLength(3);
  });
});

describe('buildOgCardFrom grid bounds', () => {
  it('takes at most 8 rows and 8 columns', () => {
    const rows = Array.from({ length: 20 }, (_, r) =>
      Array.from({ length: 20 }, (_, c) => `${r}-${c}`),
    );
    const text = collectText(buildOgCardFrom({ title: 'T', subtitle: 'S', grid: rows }, brand));
    expect(text).toContain('7-7');
    expect(text).not.toContain('8-8');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/prerender/og-card.test.ts`
Expected: FAIL —— `Failed to resolve import "./og-card"`

- [ ] **Step 3: 写 `src/prerender/og-card.ts`**

```ts
// src/prerender/og-card.ts
import type { ReferencePage } from '../data/reference/types';
import type { BrandCopy } from '../seo/site';

/** satori 接受的元素形状（React 元素的子集），用纯对象写所以不需要 React。 */
export interface SatoriElement {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: unknown;
  };
}

export interface OgCardInput {
  title: string;
  subtitle: string;
  /** 可选的表格缩影。超过 8×8 的部分裁掉。 */
  grid?: string[][];
}

const CARD = { width: 1200, height: 630 } as const;
const GRID_MAX_ROWS = 8;
const GRID_MAX_COLS = 8;
const FORMULA_LINES = 3;

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): SatoriElement => ({ type, props: { style, children } });

/** 表格前 8×8 格的缩影。格子越少字号越大，让 6 列的乘法表也能看清。 */
function gridPreview(rows: string[][]): SatoriElement | undefined {
  const cut = rows.slice(0, GRID_MAX_ROWS).map((row) => row.slice(0, GRID_MAX_COLS));
  if (cut.length === 0 || cut[0].length === 0) return undefined;

  const cols = cut[0].length;
  const fontSize = cols <= 6 ? 22 : 16;

  return el(
    'div',
    { display: 'flex', flexDirection: 'column', gap: 2, marginTop: 28 },
    cut.map((row, rowIndex) =>
      el(
        'div',
        { display: 'flex', gap: 2 },
        row.map((cell) =>
          el(
            'div',
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 34,
              border: '1px solid #D8DCE3',
              backgroundColor: rowIndex === 0 ? '#EDF2FF' : '#FFFFFF',
              fontSize,
              color: '#1F2329',
            },
            cell,
          ),
        ),
      ),
    ),
  );
}

/** 公式清单的前三行，用作没有表格时的缩影。 */
function formulaPreview(page: ReferencePage): string[] | undefined {
  const block = page.blocks.find((b) => b.kind === 'formulas');
  if (!block || block.kind !== 'formulas') return undefined;
  return block.groups.flatMap((group) => group.items).slice(0, FORMULA_LINES);
}

/**
 * 一张 OG 卡片的元素树。
 *
 * 卡片内容刻意包含该页数据的缩影——这正是「生成真图」相对「一张通用模板图」
 * 的全部意义。satori 的 CSS 支持是子集（flex 好、grid 一般），所以布局只用
 * flex + 固定像素，别引入百分比或 grid。
 */
export function buildOgCardFrom(input: OgCardInput, brand: BrandCopy): SatoriElement {
  const children: unknown[] = [
    el('div', { display: 'flex', fontSize: 26, color: '#3370FF', fontWeight: 700 }, brand.name),
    el(
      'div',
      { display: 'flex', marginTop: 16, fontSize: 58, lineHeight: 1.15, color: '#1F2329' },
      input.title,
    ),
    el('div', { display: 'flex', marginTop: 12, fontSize: 26, color: '#646A73' }, input.subtitle),
  ];

  if (input.grid && input.grid.length > 0) {
    const preview = gridPreview(input.grid);
    if (preview) children.push(preview);
  }

  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: CARD.width,
      height: CARD.height,
      padding: 64,
      backgroundColor: '#F5F6F7',
    },
    children,
  );
}

/** 从图表页数据构造卡片。表格页用表格缩影，公式页用前三条公式。 */
export function buildOgCard(page: ReferencePage, brand: BrandCopy): SatoriElement {
  const table = page.blocks.find((b) => b.kind === 'table');
  const formulas = formulaPreview(page);

  if (table && table.kind === 'table') {
    return buildOgCardFrom({ title: page.title, subtitle: page.summary, grid: table.rows }, brand);
  }

  if (formulas) {
    return buildOgCardFrom(
      {
        title: page.title,
        subtitle: page.summary,
        grid: formulas.map((line) => [line]),
      },
      brand,
    );
  }

  return buildOgCardFrom({ title: page.title, subtitle: page.summary }, brand);
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/prerender/og-card.test.ts`
Expected: PASS（5 个用例）

- [ ] **Step 5: 类型检查**

Run: `./node_modules/.bin/tsc -b`
Expected: 无输出

- [ ] **Step 6: 提交**

```bash
git add src/prerender/og-card.ts src/prerender/og-card.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): og 卡片的布局函数（纯数据 → satori 元素树）

把布局与渲染分开：这一层不碰文件系统、不加载字体，所以能单测。卡片内容
包含该页数据的缩影——表格页取前 8×8 格，公式页取前三条公式——这是
「生成真图」相对「一张通用模板图」的意义所在。

satori 的 CSS 支持是子集，所以只用 flex + 固定像素。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: og 渲染与构建接线

产出 10 张 PNG。**这一轮没有任何页面引用它们**——那是有意的中间态：先让图确实存在，再由任务 6 把标签接上，避免出现「标签指向不存在的图」。

**Files:**
- Create: `assets/fonts/inter-latin-400-normal.woff`、`assets/fonts/inter-latin-700-normal.woff`
- Create: `src/prerender/og.ts`
- Modify: `package.json`
- Modify: `tsconfig.app.json`
- Modify: `src/entry-prerender.ts`
- Test: `src/prerender/og.test.ts`

**Interfaces:**
- Consumes: `buildOgCard` / `buildOgCardFrom`（`./og-card`）；`pagesInCategory`、`ReferencePage`、`ReferenceCategory`（`../data/reference`）；`CATEGORY_COPY`；`brandFor`（`../seo/site`）；`REFERENCE_CATEGORIES`、`ENGLISH_HOME`、`categoryPath`、`referencePath`（`../reference-routes`）
- Produces: `OG_ROUTES: { route: string; path: string }[]`（10 项，`path` 形如 `og/math/multiplication-chart.png`）；`writeOgImages(distDir: string, prepare?: () => Promise<Fonts>): Promise<number>`（第二个形参有默认值，`entry-prerender.ts` 只传 `distDir`）

> **后续变更（Task 6 Step 0）**：`OgRoute` 与 `OG_ROUTES` 会从本文件搬到 `src/seo/og-routes.ts`，
> 并由本文件再导出。原因是 `src/seo/` 属于 `tsconfig.app.json` 的 program，而那份配置没有 node 类型，
> 一旦 `src/seo/` 下有文件 import 本文件，`tsc -b` 就会因 `node:fs` 报错（`exclude` 挡不住 import 图）。
> 本任务按上面写即可——搬动由 Task 6 负责，因为需求是 Task 6 引入的。

- [ ] **Step 1: 装依赖并下载字体**

```bash
npm install --save-dev satori @resvg/resvg-wasm
mkdir -p assets/fonts
curl -sSL -o assets/fonts/inter-latin-400-normal.woff \
  https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff
curl -sSL -o assets/fonts/inter-latin-700-normal.woff \
  https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff
ls -l assets/fonts/
```

Expected: 两个文件，分别约 30,696 与 31,320 字节（合计约 62KB）。
`assets/fonts/` **刻意不在 `public/` 下**——那份字体只服务构建期，不该被浏览器下载。

**同一提交里还要带上授权文本。** Inter 是 SIL OFL 1.1（`@fontsource/inter` 的 `license` 字段即 `OFL-1.1`，上游 `inter-ui` 同）。这个仓库是公开的，提交字体二进制即构成再分发，而 OFL 要求授权文本随字体一起走。执行：

```bash
ls node_modules/@fontsource/inter/ | grep -i licen   # 看它实际随附的授权文件名
cp node_modules/@fontsource/inter/LICENSE assets/fonts/LICENSE   # 文件名按上一步的实际输出调整
```

若该包没有随附授权文件，就从 https://openfontlicense.org/ 取 OFL 1.1 全文写入 `assets/fonts/LICENSE`。另外这次分发的是**未修改**的原文件，OFL 的保留字体名（RFN）条款因此不适用——不要重命名或改造这些 woff。

- [ ] **Step 2: 确认 resvg 的 wasm 文件名**

Run: `ls node_modules/@resvg/resvg-wasm/`

把实际文件名记下来（常见是 `index_bg.wasm`）。后面的 `og.ts` 里用到它；若名字不同，改那处路径。

- [ ] **Step 3: 把两个用 Node API 的文件移出浏览器 tsconfig**

`src/prerender/og.ts` 用 `node:fs`，而 `tsconfig.app.json` 的 types 只有 `vite/client`——没有 Node 类型，`tsc -b` 会报 `Cannot find module 'node:fs'`。`src/entry-prerender.ts` 正是因为这个被 exclude 的，同样处理。

把 `tsconfig.app.json` 的 `exclude` 改成：

```json
  "exclude": [
    "src/data/tutorials/_template.ts",
    "src/entry-prerender.ts",
    "src/prerender/og.ts",
    "src/prerender/og.test.ts"
  ]
```

这两个文件仍会被 `tsconfig.prerender.json` 检查到（它的 `include` 是整个 `src`，且带 node 类型），所以不会留下类型盲区。

- [ ] **Step 4: 写失败测试 `src/prerender/og.test.ts`**

```ts
// @vitest-environment node
// resvg 的 wasm 需要真实的 Node 全局；happy-dom 环境会干扰它的初始化。
import { describe, expect, it } from 'vitest';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { OG_ROUTES, writeOgImages } from './og';

describe('OG_ROUTES', () => {
  it('covers the English surface only: home, three hubs, six charts', () => {
    expect(OG_ROUTES).toHaveLength(10);
    // 名字里的 1/3/6 必须真被断言。只写 toHaveLength(10) 的话，把一张图表页换成
    // 第二个 hub 照样能过——真正有鉴别力的是这条拆分。
    expect(OG_ROUTES.filter((entry) => entry.kind === 'home')).toHaveLength(1);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'hub')).toHaveLength(3);
    expect(OG_ROUTES.filter((entry) => entry.kind === 'chart')).toHaveLength(6);
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/en.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math.png');
    expect(OG_ROUTES.map((entry) => entry.path)).toContain('og/math/multiplication-chart.png');
  });

  it('never writes outside dist/og', () => {
    for (const entry of OG_ROUTES) {
      expect(entry.path.startsWith('og/')).toBe(true);
      expect(entry.path).not.toContain('..');
    }
  });

  it('does not touch the Chinese pages', () => {
    // 不能只写 startsWith('/en')：'/english/…' 也满足它，而那不是英文面。
    for (const entry of OG_ROUTES) {
      expect(entry.route === '/en/' || entry.route.startsWith('/en/'), entry.route).toBe(true);
    }
  });
});

describe('writeOgImages', () => {
  it('writes one distinct 1200×630 PNG per route', async () => {
    const distDir = mkdtempSync(join(tmpdir(), 'og-test-'));
    try {
      const written = await writeOgImages(distDir);
      expect(written).toBe(10);

      // 逐张核对：文件真在盘上、是真 PNG、尺寸对。只读回一张的话，
      // 「渲染一张然后复制十份」这种 bug 能整个溜过去。
      const pngs = OG_ROUTES.map((entry) => {
        const png = readFileSync(join(distDir, entry.path));
        // PNG 魔术字节
        expect(png.subarray(0, 8), entry.path).toEqual(
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        );
        expect(png.byteLength, entry.path).toBeGreaterThan(2000);
        // PNG 的 IHDR：宽在 16..19 字节、高在 20..23，都是大端。
        expect(png.readUInt32BE(16), entry.path).toBe(1200);
        expect(png.readUInt32BE(20), entry.path).toBe(630);
        return png;
      });

      // 十张内容互不相同——同一张图复制十份同样是坏的。
      expect(new Set(pngs.map((png) => png.toString('base64'))).size).toBe(10);

      expect(readdirSync(join(distDir, 'og/math'))).toContain('metric-conversions.png');
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  }, 120_000);

  it('degrades to zero cards instead of rejecting when the renderer cannot be prepared', async () => {
    // spec:220 —— 渲染失败回退，不 throw。字体缺失（spec:381 恰好点名的场景
    // "不提交字体文件它直接报错"）与 wasm 初始化失败都发生在这里，而 writeOgImages
    // 是被 entry-prerender.ts 顶层 await 的：从这里抛出去就是 unhandled rejection，
    // 整个 `npm run build` 死。这条用例就是钉住那个「不 throw」。
    const distDir = mkdtempSync(join(tmpdir(), 'og-fallback-'));
    try {
      await expect(
        writeOgImages(distDir, () => Promise.reject(new Error('ENOENT: missing font'))),
      ).resolves.toBe(0);
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  });
});
```

- [ ] **Step 5: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/prerender/og.test.ts`
Expected: FAIL —— `Failed to resolve import "./og"`

- [ ] **Step 6: 写 `src/prerender/og.ts`**

```ts
// src/prerender/og.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import satori from 'satori';
import { pagesInCategory } from '../data/reference';
import { CATEGORY_COPY } from '../data/reference/en/categories';
import type { ReferenceCategory, ReferencePage } from '../data/reference/types';
import { EN } from '../i18n/languages';
import {
  categoryPath,
  ENGLISH_HOME,
  REFERENCE_CATEGORIES,
  referencePath,
} from '../reference-routes';
import { brandFor } from '../seo/site';
import { buildOgCard, buildOgCardFrom } from './og-card';

const require = createRequire(import.meta.url);
const FONT_DIR = join(process.cwd(), 'assets', 'fonts');

/**
 * 一个待生成 OG 图的目标。刻意带上 kind，而不是从路径字符串反推是 hub 还是图表页——
 * 字符串反推很脆，判别联合也让 cardFor 成为一个干净的 switch。
 */
export type OgRoute =
  | { kind: 'home'; route: string; path: string }
  | { kind: 'hub'; route: string; path: string; category: ReferenceCategory }
  | { kind: 'chart'; route: string; path: string; page: ReferencePage };

/** `/en/`、三个学科 hub、六张图表页——只覆盖英文面 10 页。 */
export const OG_ROUTES: OgRoute[] = [
  { kind: 'home', route: ENGLISH_HOME, path: 'og/en.png' },
  ...REFERENCE_CATEGORIES.flatMap((category) => [
    { kind: 'hub' as const, route: categoryPath(category), path: `og/${category}.png`, category },
    ...pagesInCategory(category).map((page) => ({
      kind: 'chart' as const,
      route: referencePath(page.category, page.slug),
      path: `og/${page.category}/${page.slug}.png`,
      page,
    })),
  ]),
];

let initialised = false;

/** resvg 的 wasm 需要显式初始化，每进程一次即可。 */
async function ensureWasm(): Promise<void> {
  if (initialised) return;
  const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
  await initWasm(readFileSync(wasmPath));
  initialised = true;
}

function loadFonts() {
  return [
    { name: 'Inter', weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', weight: 700 as const, style: 'normal' as const },
  ].map((font) => ({
    ...font,
    data: readFileSync(join(FONT_DIR, `inter-latin-${font.weight}-normal.woff`)),
  }));
}

/** 每个目标对应的卡片元素树。 */
function cardFor(entry: OgRoute) {
  const brand = brandFor(EN);

  switch (entry.kind) {
    case 'home':
      return buildOgCardFrom({ title: brand.name, subtitle: brand.tagline }, brand);
    case 'chart':
      return buildOgCard(entry.page, brand);
    case 'hub': {
      const copy = CATEGORY_COPY[entry.category];
      return buildOgCardFrom(
        { title: `Printable ${copy.name} Charts`, subtitle: copy.summary },
        brand,
      );
    }
  }
}

/** 准备渲染器：wasm 初始化 + 字体载入。两者都是进程级前置条件，不随单页变化。 */
async function prepareRenderer(): Promise<ReturnType<typeof loadFonts>> {
  await ensureWasm();
  return loadFonts();
}

/**
 * 渲染并写入 OG 图。**逐张回退，绝不 throw**——一张图失败不该让整个部署挂掉；
 * 失败的那页在任务 6 之后会因为没有图而自然省略 og:image 标签。
 *
 * `prepare` 默认就是真实实现。留这个形参是为了让「前置条件失败」那条路径**可测**：
 * 字体缺失时 loadFonts 会 throw，而 FONT_DIR 在模块加载时就固定成
 * `join(process.cwd(), 'assets', 'fonts')` 了，测试没有别的办法让它失败
 * （除非真去删仓库里的字体文件）。
 */
export async function writeOgImages(
  distDir: string,
  prepare: () => Promise<ReturnType<typeof loadFonts>> = prepareRenderer,
): Promise<number> {
  // wasm 初始化与字体载入要在逐张 try 之外（它们不是单页的事），但**同样必须被兜住**：
  // writeOgImages 是被 entry-prerender.ts 顶层 await 的，从这里抛出去就是一个
  // unhandled rejection，整个 `npm run build` 直接死——spec:220 明文禁止
  // （"渲染失败回退，不 throw……而不是挂掉构建"），而 spec:381 恰好点名了这个场景
  // （"不提交字体文件它直接报错"）。前置条件失败 = 一张图也做不出来，所以整批跳过，
  // 留一条醒目的警告；构建日志里的 `0 og images` 会同时把它暴露出来。
  let fonts: ReturnType<typeof loadFonts>;
  try {
    fonts = await prepare();
  } catch (error) {
    console.warn(`og: skipped all ${OG_ROUTES.length} cards — ${(error as Error).message}`);
    return 0;
  }

  let written = 0;
  for (const entry of OG_ROUTES) {
    try {
      const svg = await satori(cardFor(entry) as never, {
        width: 1200,
        height: 630,
        fonts,
      });
      const resvg = new Resvg(svg);
      const rendered = resvg.render();
      const png = rendered.asPng();

      const outFile = join(distDir, entry.path);
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, png);

      // 文件确实落盘了才计数——free 失败不该让计数少报一张已经在磁盘上的图。
      written++;

      // wasm 版要求手动释放（该包的 README 原文：Wasm-based instances require manual
      // memory management via .free()）。10 张图的泄漏量可忽略，但图数一旦增长
      // （阶段 E 铺到 100 页）就是线性的。**先写盘再 free**——asPng() 的返回值
      // 若是 wasm 内存的视图，free 之后就读不到了。
      // 单独兜一层：释放失败只警告，不能把一张已经写好的图报成 "skipped"。
      try {
        rendered.free();
        resvg.free();
      } catch (error) {
        console.warn(`og: leak on ${entry.route} — ${(error as Error).message}`);
      }
    } catch (error) {
      console.warn(`og: skipped ${entry.route} — ${(error as Error).message}`);
    }
  }

  return written;
}
```

- [ ] **Step 7: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/prerender/og.test.ts`
Expected: PASS。首跑较慢（wasm 初始化 + 10 张渲染）。

若报的是 wasm 路径找不到，按 Step 2 记下的实际文件名改 `ensureWasm` 里那一行。

- [ ] **Step 8: 接进构建入口**

`src/entry-prerender.ts`：import 区加

```ts
import { writeOgImages } from './prerender/og';
```

把结尾两行日志改成（`writeOgImages` 是异步的，模块顶层 await 在本仓库的 ESNext 目标下可用）：

```ts
const ogCount = await writeOgImages(distDir);

console.log(`prerendered ${written} pages (+ robots.txt, sitemap.xml, ${ogCount} og images)`);
```

- [ ] **Step 9: 构建冒烟**

Run: `npm run build`
Expected: 结尾含 `10 og images`；`ls dist/og/ dist/og/math/` 有 10 个 PNG；`file dist/og/math/multiplication-chart.png` 认得出是 PNG

Run: `git status --short`
Expected: 只有源码与字体改动（`dist/`、`dist-ssr/` 已忽略）

- [ ] **Step 10: 提交**

```bash
git add package.json src/prerender/og.ts src/prerender/og.test.ts src/entry-prerender.ts assets/fonts/
git commit -m "$(cat <<'EOF'
feat(seo): 构建期渲染英文面 10 张 og:image

satori（元素树 → SVG）→ @resvg/resvg-wasm（SVG → PNG）。选 wasm 版而非
原生 resvg 是为避开「原生二进制在某个平台/Node ABI 上缺失」这类 CI 崩溃。

字体用 fontsource 的 inter-latin woff（400/700 各约 30KB，合计 62KB），
放 assets/fonts/ 而不是 public/——只服务构建期，不该被浏览器下载。
satori 接受 .woff，所以不需要自建子集。

逐张回退不 throw：一张图失败只跳过该页，不让部署挂掉。不做并发池与内容
哈希缓存——那是为初版估的 390 张设计的，10 张不需要。

此时还没有页面引用这些图（有意的中间态），任务 6 接上标签。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: 把 og:image 接进 head

**Files:**
- Create: `src/seo/og-routes.ts`
- Create: `src/seo/og.ts`
- Modify: `src/prerender/og.ts`
- Modify: `src/seo/meta.ts`
- Modify: `src/seo/head.ts`
- Test: `src/seo/og.test.ts`
- Test: `src/seo/meta.test.ts`
- Test: `src/seo/head.test.ts`

**Interfaces:**
- Consumes: `OG_ROUTES`（`src/seo/og-routes`）；`SITE`、`ENGLISH_HOME`
- Produces: `ogImagePath(path: string): string | undefined`；`ogImageUrl(path: string): string | undefined`；`SeoMeta.ogImage?: { url: string; width: number; height: number }`

- [ ] **Step 0: 把纯数据的 OG 路由表抽到 `src/seo/og-routes.ts`**

**为什么必须先做这一步**：`src/seo/` 下的文件属于 `tsconfig.app.json` 的 program（`include: ["src"]`），而那份配置的 `types` 只有 `["vite/client"]`、没有 `node`。
Task 5 把用了 `node:fs` 的 `src/prerender/og.ts` 排除在外，但 **`exclude` 只过滤 `include` 的匹配结果，挡不住 import 图**——只要 `src/seo/` 下有文件 import 它，它照样进 program，`tsc -b` 就会报 4 个错：

```
src/prerender/og.ts(2,56): error TS2307: Cannot find module 'node:fs' ...
src/prerender/og.ts(3,31): error TS2307: Cannot find module 'node:module' ...
src/prerender/og.ts(4,31): error TS2307: Cannot find module 'node:path' ...
src/prerender/og.ts(21,23): error TS2591: Cannot find name 'process'. ...
```

（以上是控制者用一个临时探针文件实测出来的，不是推断。）

所以：把 `OgRoute` 类型与 `OG_ROUTES` 常量 —— 它们只依赖 `../data/reference`、`../data/reference/types`、`../reference-routes`，全是纯模块 —— 搬到新的 `src/seo/og-routes.ts`。渲染器（wasm、satori、node:fs）留在 `src/prerender/og.ts`。

新建 `src/seo/og-routes.ts`：

```ts
// src/seo/og-routes.ts
//
// OG 图的路由表。刻意与渲染器（src/prerender/og.ts）分开：这一半是纯数据，
// 只依赖 data/ 与 reference-routes，所以能被 src/seo/ 下的模块安全 import；
// 渲染器那一半用 node:fs 与 wasm，不属于 tsconfig.app.json 的 program。
import { pagesInCategory } from '../data/reference';
import type { ReferenceCategory, ReferencePage } from '../data/reference/types';
import {
  categoryPath,
  ENGLISH_HOME,
  REFERENCE_CATEGORIES,
  referencePath,
} from '../reference-routes';

/**
 * 一个待生成 OG 图的目标。刻意带上 kind，而不是从路径字符串反推是 hub 还是图表页——
 * 字符串反推很脆，判别联合也让 cardFor 成为一个干净的 switch。
 */
export type OgRoute =
  | { kind: 'home'; route: string; path: string }
  | { kind: 'hub'; route: string; path: string; category: ReferenceCategory }
  | { kind: 'chart'; route: string; path: string; page: ReferencePage };

/** `/en/`、三个学科 hub、六张图表页——只覆盖英文面 10 页。 */
export const OG_ROUTES: OgRoute[] = [
  { kind: 'home', route: ENGLISH_HOME, path: 'og/en.png' },
  ...REFERENCE_CATEGORIES.flatMap((category) => [
    { kind: 'hub' as const, route: categoryPath(category), path: `og/${category}.png`, category },
    ...pagesInCategory(category).map((page) => ({
      kind: 'chart' as const,
      route: referencePath(page.category, page.slug),
      path: `og/${page.category}/${page.slug}.png`,
      page,
    })),
  ]),
];
```

然后改 `src/prerender/og.ts`：删掉上面搬走的 `OgRoute` 与 `OG_ROUTES` 两段（原第 23–44 行），改成从新模块 import 并**原样再导出**——`src/prerender/og.test.ts` 是从 `'./og'` 取 `OG_ROUTES` 的，再导出让它一字不改：

```ts
import { OG_ROUTES, type OgRoute } from '../seo/og-routes';

export { OG_ROUTES, type OgRoute };
```

同时删掉 `src/prerender/og.ts` 里因为搬走而不再使用的 import：`pagesInCategory`、`ReferenceCategory`/`ReferencePage` 类型、`categoryPath`/`ENGLISH_HOME`/`REFERENCE_CATEGORIES`/`referencePath`。**`CATEGORY_COPY`、`EN`、`brandFor`、`buildOgCard*` 都还在用，别删。**（`noUnusedLocals` 开着，漏删会直接报错，不会静默。）

- [ ] **Step 0b: 跑测试与类型检查确认这次搬动是纯搬运**

Run: `./node_modules/.bin/vitest run src/prerender/og.test.ts`
Expected: PASS（5 个用例，与搬动前一致）

> 这里写 5 而不是 4：本步骤初稿写下时该文件是 4 条，Task 5 的 review 修复轮又加了
> 一条「前置条件失败时降级而非抛出」，变成 5 条。搬动的判据是**数字不变**，不是某个具体值。

Run: `./node_modules/.bin/tsc -b`
Expected: 无输出

- [ ] **Step 1: 写失败测试 `src/seo/og.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { OG_ROUTES } from './og-routes';
import { ogImagePath, ogImageUrl } from './og';

describe('ogImagePath', () => {
  it('resolves every English page that has a generated image', () => {
    for (const { route, path } of OG_ROUTES) {
      expect(ogImagePath(route), route).toBe(path);
    }
  });

  it('returns undefined for pages without a generated image', () => {
    // 中文页刻意不生成 og 图（276 张图的成本换接近零的社交回报）。
    expect(ogImagePath('/')).toBeUndefined();
    expect(ogImagePath('/tutorial')).toBeUndefined();
    expect(ogImagePath('/knowledge/p-mor-010')).toBeUndefined();
  });

  it('normalizes the trailing-slash variants of a route', () => {
    expect(ogImagePath('/en/math')).toBe('og/math.png');
    expect(ogImagePath('/en/math/')).toBe('og/math.png');
    expect(ogImagePath('/en')).toBe('og/en.png');
    expect(ogImagePath('/en/')).toBe('og/en.png');
  });
});

describe('ogImageUrl', () => {
  it('is absolute against the canonical origin', () => {
    expect(ogImageUrl('/en/math/multiplication-chart')).toBe(
      'https://syy.global/og/math/multiplication-chart.png',
    );
  });

  it('is undefined when there is no image', () => {
    expect(ogImageUrl('/')).toBeUndefined();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `./node_modules/.bin/vitest run src/seo/og.test.ts`
Expected: FAIL —— `Failed to resolve import "./og"`

- [ ] **Step 3: 写 `src/seo/og.ts`**

```ts
// src/seo/og.ts
import { OG_ROUTES } from './og-routes';
import { SITE } from './site';

/** 去掉尾斜杠，并把 `/en` 归一成 `/en/`。 */
function normalize(path: string): string {
  const withoutQuery = path.split('#')[0].split('?')[0];
  if (withoutQuery === '/' || withoutQuery === '') return '/';
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed === '/en' ? '/en/' : trimmed;
}

/**
 * 路由 → 相对 dist/ 的 OG 图路径。没有图的页面返回 undefined。
 *
 * **两侧都归一化后再建表**：OG_ROUTES 的 route 来自 categoryPath / referencePath，
 * 是带尾斜杠的（`/en/math/`），而查表传进来的是不带尾斜杠的形式（`/en/math`）。
 * 不归一化的话永远查不中。
 */
const BY_ROUTE = new Map<string, string>(
  OG_ROUTES.map((entry) => [normalize(entry.route), entry.path]),
);

export function ogImagePath(path: string): string | undefined {
  return BY_ROUTE.get(normalize(path));
}

/** 绝对的 og:image URL；没有图时 undefined。 */
export function ogImageUrl(path: string): string | undefined {
  const relative = ogImagePath(path);
  return relative ? `${SITE.origin}/${relative}` : undefined;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/seo/og.test.ts`
Expected: PASS（5 个用例）

- [ ] **Step 5: 写失败测试追加到 `src/seo/meta.test.ts` 与 `src/seo/head.test.ts`**

`meta.test.ts`：

```ts
describe('og:image', () => {
  it('points at the generated card for an English page', () => {
    expect(buildSeoMeta('/en/math/multiplication-chart').ogImage).toEqual({
      url: 'https://syy.global/og/math/multiplication-chart.png',
      width: 1200,
      height: 630,
    });
  });

  it('is absent for pages with no generated image', () => {
    expect(buildSeoMeta('/').ogImage).toBeUndefined();
    expect(buildSeoMeta('/tutorial').ogImage).toBeUndefined();
  });

  it('uses a large twitter card only when there is an image', () => {
    expect(buildSeoMeta('/en/math').twitter.card).toBe('summary_large_image');
    expect(buildSeoMeta('/').twitter.card).toBe('summary');
  });
});
```

`head.test.ts`：

```ts
describe('renderHead og:image', () => {
  it('emits the image and its dimensions when present', () => {
    const html = renderHead(buildSeoMeta('/en/math'));
    expect(html).toContain('<meta property="og:image" content="https://syy.global/og/math.png" />');
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
  });

  it('emits nothing when the page has no image', () => {
    const html = renderHead(buildSeoMeta('/'));
    expect(html).not.toContain('og:image');
  });
});
```

Run: `./node_modules/.bin/vitest run src/seo/meta.test.ts src/seo/head.test.ts`
Expected: FAIL —— `ogImage` 还不存在，`twitter.card` 仍是 `summary`。

- [ ] **Step 6: 在 `SeoMeta` 与 `buildSeoMeta` 里加 `ogImage`**

`src/seo/meta.ts`：import 区加 `import { ogImageUrl } from './og';`；`SeoMeta` 接口加：

```ts
  /** 绝对 og:image URL 与尺寸。没有为该页生成图时为 undefined。 */
  ogImage?: { url: string; width: number; height: number };
```

`buildSeoMeta` 里，在 `const canonical = canonicalUrl(path);` 之后加：

```ts
  const imageUrl = ogImageUrl(path);
```

并在返回对象里，`twitter` 与 `jsonLd` 之间插入：

```ts
    ...(imageUrl ? { ogImage: { url: imageUrl, width: 1200, height: 630 } } : {}),
```

`twitter` 那行改成：

```ts
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: content.title,
      description: content.description,
    },
```

- [ ] **Step 7: 在 `renderHead` 里输出标签**

`src/seo/head.ts`：把 `twitter:card` 那一行**之前**插入：

```ts
  if (meta.ogImage) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(meta.ogImage.url)}" />`,
      `<meta property="og:image:width" content="${meta.ogImage.width}" />`,
      `<meta property="og:image:height" content="${meta.ogImage.height}" />`,
    );
  }
```

- [ ] **Step 8: 跑测试确认通过**

Run: `./node_modules/.bin/vitest run src/seo/`
Expected: PASS

- [ ] **Step 9: 全量测试 + 构建冒烟**

Run: `npm test` → 全绿
Run: `./node_modules/.bin/tsc -b` → 无输出
Run: `npm run build` → `10 og images`
Run: `grep -c 'og:image' dist/en/math/index.html` → **3**（image + width + height）
Run: `grep -c 'og:image' dist/index.html` → **0**（中文首页无图，符合预期）

- [ ] **Step 10: 提交**

```bash
git add src/seo/og-routes.ts src/seo/og.ts src/seo/og.test.ts src/prerender/og.ts src/seo/meta.ts src/seo/meta.test.ts src/seo/head.ts src/seo/head.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): 英文面页面输出 og:image

只有生成了图的页面才输出标签——`/`、中文页等一律没有，所以也不会出现
指向不存在文件的 og:image。有图时 twitter:card 从 summary 换成
summary_large_image。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

## 完成标准

- `npm test` 全绿；`./node_modules/.bin/tsc -b` 无输出；`./node_modules/.bin/eslint .` 退出码 0
- `npm run build` 输出含 `297 pages` 与 `10 og images`
- `dist/og/` 下有 10 个真 PNG（`file` 认得出）
- `dist/en/math/multiplication-chart/index.html` 含 `LearningResource`、`FAQPage`、`og:image`，标题以 `Printable ` 开头且 ≤ 60 字符
- `dist/index.html` 与任一中文页**不含** `og:image`、不含 `Printable`
- 本机未设 `VITE_GA4_ID` 时，产物里不出现 `googletagmanager`
- 所有英文标题 ≤ 60 字符（由测试保证）

## 不在本计划范围内

- **阶段 D（合规与变现）**：`/privacy` `/about` `/contact` `/terms` 八页、CMP、AdSense 提交。
- **阶段 E（内容扩充）**：6 页 → 40 → 100。本轮交付后英文面仍是 10 页。
- **hreflang 推导、sitemap 按语言拆分、`<lastmod>`**——spec Section 3「明确不做的三项」，理由已写明。
- **中文页的 og:image**——刻意不做。
- **GSC 的 DNS TXT 验证**——纯手动步骤，由站方执行。

## 已知限制

- **og:image 的观感需要实机迭代**。satori 的 CSS 支持是子集（flex 好、grid 一般），任务的测试只保证「元素树里有标题与预期数量的格子、产物是合法 PNG」，**不保证好看**。构建后请打开几张 `dist/og/*.png` 目视一遍，再决定要不要调字号或留白。
- **本计划的产出在部署管道修好前不会上线**。见 Global Constraints 里那条前置依赖。
