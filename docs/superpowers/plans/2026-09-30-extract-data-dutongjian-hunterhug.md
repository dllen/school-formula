# extract-data dutongjian + hunterhug Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 2 new concrete adapters (`dutongjian` for zizhi kind, `hunterhug` for shiji kind) + 1 new ingest-data adapter (`zizhiAdapter`) to the existing `scripts/extract-data/` framework. Both adapters follow the existing `Adapter` interface; ingest-data side uses the `simpleArrayAdapter` factory pattern from the existing `shijiAdapter`.

**Architecture:** Incremental extension of the framework delivered in commit `42f2489`. No changes to framework code, no changes to existing shiji-kb / shiji / ingest-data shiji paths. Each new adapter is ~80-150 lines (impl + tests).

**Tech Stack:** Node 22 + TypeScript 5.9 ESM + vitest + cheerio (already in extract-data deps).

**Spec:** `docs/superpowers/specs/2026-09-30-extract-data-dutongjian-hunterhug-design.md`

**Predecessor:** `docs/superpowers/plans/2026-09-29-extract-data-shiji-kb.md` (14 tasks, all delivered; commit `42f2489`)

---

## Task 1: dutongjian adapter (kind=zizhi)

**Files:**
- Create: `scripts/extract-data/adapters/dutongjian.ts`
- Create: `scripts/extract-data/adapters/dutongjian.test.ts`

- [ ] **Step 1: Write `scripts/extract-data/adapters/dutongjian.ts`**

```ts
// scripts/extract-data/adapters/dutongjian.ts
import { load } from 'cheerio';
import type { Adapter, BaseEnvelope } from '../core/adapter.js';

const BASE_URL = 'https://www.dutongjian.com/';

/** 兜底：资治通鉴各纪路径，本地 fetch 后回填真实 URL。 */
const FALLBACK_URLS: string[] = [
  '/zhou-ji/yi',
  '/zhou-ji/er',
  '/zhou-ji/san',
  '/han-ji/yi',
  '/han-ji/er',
  '/han-ji/san',
  '/tang-ji/yi',
  '/tang-ji/er',
  '/song-ji/yi',
  '/song-ji/er',
  '/yuan-ji/yi',
  '/ming-ji/yi',
];

export interface RawChapter {
  url: string;
  title: string;
  period: string;
  paragraphs: string[];
  interpretation: string;
}

export const dutongjianAdapter: Adapter = {
  kind: 'zizhi',
  name: '读通鉴',
  description: '抽取 dutongjian.com 的资治通鉴篇章',

  async listUrls(): Promise<string[]> {
    const res = await fetch(BASE_URL);
    const html = await res.text();
    const $ = load(html);
    const links = $('a[href]')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter((href): href is string => Boolean(href))
      .filter(href => href.startsWith(BASE_URL) || href.startsWith('/'))
      .filter(href => !href.includes('#'))
      .map(href => new URL(href, BASE_URL).href);
    if (links.length >= 1) return links;
    return FALLBACK_URLS.map(u => new URL(u, BASE_URL).href);
  },

  async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.text();
  },

  async parseHtml(url: string, html: string): Promise<RawChapter> {
    const $ = load(html);
    const title = $('.chapter-title, h1').first().text().trim() || '未知';
    const period = $('.period, .time').first().text().trim();
    const paragraphs = $('article p, main p, .content p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    return { url, title, period, paragraphs, interpretation: '' };
  },

  normalize(pages: unknown[]): BaseEnvelope & { volumes: RawChapter[]; url: string } {
    let counter = 18; // 现有 src/data/zizhi.ts v1-v17 已用
    const volumes = (pages as RawChapter[]).map(p => ({
      id: `v${counter++}`,
      title: p.title,
      period: p.period,
      content: p.paragraphs,
      interpretation: p.interpretation,
    }));
    return {
      source: 'dutongjian',
      extractedAt: new Date().toISOString(),
      url: BASE_URL,
      volumes,
    };
  },
};
```

- [ ] **Step 2: Write `scripts/extract-data/adapters/dutongjian.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { dutongjianAdapter } from './dutongjian.js';
import type { RawChapter } from './dutongjian.js';

describe('dutongjianAdapter', () => {
  it('has correct identity', () => {
    expect(dutongjianAdapter.kind).toBe('zizhi');
    expect(dutongjianAdapter.name).toBeTruthy();
    expect(dutongjianAdapter.description).toBeTruthy();
  });

  it('normalize assigns ids v18, v19, ...', () => {
    const pages: RawChapter[] = [
      { url: 'x', title: '周纪三', period: '威烈王二十三年', paragraphs: ['a'], interpretation: '' },
      { url: 'y', title: '周纪四', period: '显王元年', paragraphs: ['b'], interpretation: '' },
    ];
    const env = dutongjianAdapter.normalize(pages);
    expect(env.source).toBe('dutongjian');
    expect(env.volumes).toHaveLength(2);
    expect(env.volumes[0]?.id).toBe('v18');
    expect(env.volumes[1]?.id).toBe('v19');
  });

  it('normalize handles empty pages', () => {
    const env = dutongjianAdapter.normalize([]);
    expect(env.volumes).toEqual([]);
    expect(env.source).toBe('dutongjian');
  });

  it('parseHtml extracts title, period, paragraphs', async () => {
    const html = `
      <html><body>
        <h1 class="chapter-title">周纪三</h1>
        <div class="period">威烈王二十三年（戊寅，公元前四〇三年）</div>
        <article>
          <p>初命晋大夫魏斯、赵籍、韩虔为诸侯。</p>
          <p>臣光曰：天子之职莫大于礼。</p>
        </article>
      </body></html>
    `;
    const parsed = await dutongjianAdapter.parseHtml('http://x', html);
    expect(parsed.title).toBe('周纪三');
    expect(parsed.period).toContain('威烈王二十三年');
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 3: Register adapter in `scripts/extract-data/core/runner.ts`**

Open `scripts/extract-data/core/runner.ts` and update:

1. Add import after `shijiAudit` line:
```ts
import { dutongjianAdapter } from '../adapters/dutongjian.js';
```

2. Add to REGISTRY:
```ts
const REGISTRY: Adapter[] = [
  shijiKbAdapter,
  dutongjianAdapter,
];
```

- [ ] **Step 4: Run tests**

Run: `cd scripts/extract-data && npm test`

Expected: 4 new dutongjian tests pass; all previous tests still pass.

- [ ] **Step 5: Type-check**

Run: `cd scripts/extract-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/extract-data/adapters/dutongjian.ts scripts/extract-data/adapters/dutongjian.test.ts scripts/extract-data/core/runner.ts
git commit -m "feat(extract-data): dutongjian adapter (kind=zizhi, counter 18+)"
```

---

## Task 2: hunterhug adapter (kind=shiji)

**Files:**
- Create: `scripts/extract-data/adapters/hunterhug.ts`
- Create: `scripts/extract-data/adapters/hunterhug.test.ts`

- [ ] **Step 1: Write `scripts/extract-data/adapters/hunterhug.ts`**

```ts
// scripts/extract-data/adapters/hunterhug.ts
import { load } from 'cheerio';
import type { Adapter, BaseEnvelope } from '../core/adapter.js';

const BASE_URL = 'https://hunterhug.github.io/';

/** 兜底：hunterhug 史记相关路径，本地 fetch 后回填。 */
const FALLBACK_URLS: string[] = [
  '/shiji/benji/wudi',
  '/shiji/benji/xia',
  '/shiji/benji/yin',
  '/shiji/benji/zhou',
  '/shiji/benji/qin',
  '/shiji/benji/han',
  '/shiji/shijia/jiang',
  '/shiji/shijia/chu',
  '/shiji/liezhu/liubang',
  '/shiji/liezhu/hanxin',
  '/shiji/biao/han',
  '/shiji/biao/qin',
];

export interface RawChapter {
  url: string;
  title: string;
  chapter: string;
  paragraphs: string[];
  interpretation: string;
}

export const hunterhugAdapter: Adapter = {
  kind: 'shiji',
  name: 'Hunterhug 经典',
  description: '抽取 hunterhug.github.io 的史记数据（counter 100+）',

  async listUrls(): Promise<string[]> {
    const res = await fetch(BASE_URL);
    const html = await res.text();
    const $ = load(html);
    const links = $('a[href*="shiji"], a[href*="benji"], a[href*="shijia"], a[href*="liezhu"], nav a')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter((href): href is string => Boolean(href))
      .filter(href => href.startsWith(BASE_URL) || href.startsWith('/'))
      .filter(href => !href.includes('#'))
      .map(href => new URL(href, BASE_URL).href);
    if (links.length >= 1) return links;
    return FALLBACK_URLS.map(u => new URL(u, BASE_URL).href);
  },

  async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.text();
  },

  async parseHtml(url: string, html: string): Promise<RawChapter> {
    const $ = load(html);
    const title = $('h1').first().text().trim() || '未知';
    const chapter = $('h1').first().text().match(/卷[一二三四五六七八九十百零]+/)?.[1] ?? '';
    const paragraphs = $('article p, main p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    return { url, title, chapter, paragraphs, interpretation: '' };
  },

  normalize(pages: unknown[]): BaseEnvelope & { volumes: RawChapter[]; url: string } {
    let counter = 100; // 与 shiji-kb v5+ 明确区分（hunterhug 是补充源）
    const volumes = (pages as RawChapter[]).map(p => ({
      id: `v${counter++}`,
      title: p.title,
      chapter: p.chapter,
      content: p.paragraphs,
      interpretation: p.interpretation,
    }));
    return {
      source: 'hunterhug',
      extractedAt: new Date().toISOString(),
      url: BASE_URL,
      volumes,
    };
  },
};
```

- [ ] **Step 2: Write `scripts/extract-data/adapters/hunterhug.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { hunterhugAdapter } from './hunterhug.js';
import type { RawChapter } from './hunterhug.js';

describe('hunterhugAdapter', () => {
  it('has correct identity', () => {
    expect(hunterhugAdapter.kind).toBe('shiji');
    expect(hunterhugAdapter.name).toBeTruthy();
    expect(hunterhugAdapter.description).toBeTruthy();
  });

  it('normalize assigns ids v100, v101, ...', () => {
    const pages: RawChapter[] = [
      { url: 'x', title: '周本纪', chapter: '卷四', paragraphs: ['a'], interpretation: '' },
      { url: 'y', title: '秦始皇本纪', chapter: '卷六', paragraphs: ['b'], interpretation: '' },
    ];
    const env = hunterhugAdapter.normalize(pages);
    expect(env.source).toBe('hunterhug');
    expect(env.volumes).toHaveLength(2);
    expect(env.volumes[0]?.id).toBe('v100');
    expect(env.volumes[1]?.id).toBe('v101');
  });

  it('normalize handles empty pages', () => {
    const env = hunterhugAdapter.normalize([]);
    expect(env.volumes).toEqual([]);
    expect(env.source).toBe('hunterhug');
  });

  it('parseHtml extracts title, chapter, paragraphs', async () => {
    const html = `
      <html><body>
        <h1>周本纪 - 卷四</h1>
        <article>
          <p>周武王之母曰太姒...</p>
          <p>其后稷...</p>
        </article>
      </body></html>
    `;
    const parsed = await hunterhugAdapter.parseHtml('http://x', html);
    expect(parsed.title).toBe('周本纪 - 卷四');
    expect(parsed.chapter).toBe('卷四');
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 3: Register adapter in `scripts/extract-data/core/runner.ts`**

Open `scripts/extract-data/core/runner.ts` and add:

1. New import:
```ts
import { hunterhugAdapter } from '../adapters/hunterhug.js';
```

2. To REGISTRY:
```ts
const REGISTRY: Adapter[] = [
  shijiKbAdapter,
  dutongjianAdapter,
  hunterhugAdapter,
];
```

- [ ] **Step 4: Run tests**

Run: `cd scripts/extract-data && npm test`

Expected: 4 new hunterhug tests pass; all previous tests still pass (4 dutongjian + previous 37 = 45).

- [ ] **Step 5: Type-check**

Run: `cd scripts/extract-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/extract-data/adapters/hunterhug.ts scripts/extract-data/adapters/hunterhug.test.ts scripts/extract-data/core/runner.ts
git commit -m "feat(extract-data): hunterhug adapter (kind=shiji, counter 100+)"
```

---

## Task 3: ingest-data zizhi adapter

**Files:**
- Create: `scripts/ingest-data/adapters/zizhi.ts`
- Modify: `scripts/ingest-data/registry.ts`
- Create: `scripts/ingest-data/adapters/zizhi.test.ts`

- [ ] **Step 1: Write `scripts/ingest-data/adapters/zizhi.ts`**

```ts
// scripts/ingest-data/adapters/zizhi.ts
import { simpleArrayAdapter } from './simple-array.js';

export const zizhiAdapter = simpleArrayAdapter({
  kind: 'zizhi',
  envelopeKey: 'volumes',
  typeRef: {
    path: '<root>/src/data/zizhi.ts',
    name: 'ZizhiVolume',
    expr: 'ZizhiVolume[]',
  },
  file: 'src/data/zizhi.ts',
  arrayName: () => 'ZIZHI_DATA',
  checks: (items) => {
    const errs: string[] = [];
    for (const it of items as Array<Record<string, unknown>>) {
      if (typeof it.id !== 'string' || !it.id) errs.push(`id 缺失: ${JSON.stringify(it)}`);
      if (typeof it.title !== 'string' || !it.title) errs.push(`title 缺失: ${it.id}`);
      if (typeof it.period !== 'string' || !it.period) errs.push(`period 缺失: ${it.id}`);
      if (!Array.isArray(it.content) || it.content.length === 0) {
        errs.push(`content 缺失或空: ${it.id}`);
      }
    }
    return errs;
  },
});
```

- [ ] **Step 2: Register in `scripts/ingest-data/registry.ts`**

Open `scripts/ingest-data/registry.ts`. Add import (alphabetical):
```ts
import { zizhiAdapter } from './adapters/zizhi.js';
```

Add to adapters array (after `shijiAdapter`):
```ts
const adapters: Adapter[] = [
  cheatsheetAdapter,
  formulaAdapter,
  mentalMathAdapter,
  techniqueAdapter,
  tutorialAdapter,
  questionBankAdapter,
  knowledgeAdapter,
  promptAdapter,
  shijiAdapter,
  zizhiAdapter,   // ← 新增
];
```

- [ ] **Step 3: Write `scripts/ingest-data/adapters/zizhi.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { zizhiAdapter } from './zizhi.js';
import { getAdapter } from '../registry.js';

describe('zizhiAdapter', () => {
  it('is registered under kind "zizhi"', () => {
    expect(getAdapter('zizhi')).toBe(zizhiAdapter);
  });

  it('extracts volumes from envelope', () => {
    const env = {
      source: 'dutongjian',
      extractedAt: '2026-09-30T00:00:00.000Z',
      volumes: [
        { id: 'v18', title: '周纪三', period: '威烈王二十三年', content: ['a'], interpretation: '' },
      ],
    };
    const value = zizhiAdapter.extract(env);
    expect(value).toEqual(env.volumes);
  });

  it('validates missing period', () => {
    const items = [{ id: 'v18', title: 'x', content: ['a'] }];
    const errs = zizhiAdapter.validate(items, { root: '/tmp', dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('period 缺失'))).toBe(true);
  });

  it('validates empty content', () => {
    const items = [{ id: 'v18', title: 'x', period: 'y', content: [] }];
    const errs = zizhiAdapter.validate(items, { root: '/tmp', dryRun: true, knowledgePointIds: new Set() });
    expect(errs.some(e => e.includes('content 缺失'))).toBe(true);
  });
});
```

- [ ] **Step 4: Run ingest-data tests**

Run: `cd scripts/ingest-data && npm test`

Expected: all tests pass (existing 26 + 4 new = 30).

- [ ] **Step 5: Type-check ingest-data**

Run: `cd scripts/ingest-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/ingest-data/adapters/zizhi.ts scripts/ingest-data/adapters/zizhi.test.ts scripts/ingest-data/registry.ts
git commit -m "feat(ingest-data): zizhi adapter (append-only, id collision skip)"
```

---

## Task 4: RUNBOOK update

**Files:**
- Modify: `RUNBOOK.md`

- [ ] **Step 1: Add dutongjian + hunterhug sections to RUNBOOK.md**

Open `RUNBOOK.md` (existing file from Task 13 of previous plan). After the shiji section, add:

```markdown
## D. 抽取读通鉴（资治通鉴）

```bash
npm run extract -- dutongjian --dry-run
npm run extract -- dutongjian
npm run ingest -- --kind zizhi
```

期望：`src/data/zizhi.ts` 末尾追加新条目（id `v18+`），现有 v1-v17 不变。

## E. 抽取 Hunterhug 史记

```bash
npm run extract -- hunterhug --dry-run
npm run extract -- hunterhug
npm run ingest -- --kind shiji
```

期望：`src/data/shiji.ts` 末尾追加新条目（id `v100+`），现有 v1-v4 + 之前 shiji-kb 抽取的 v5+ 不变。

注：hunterhug 抽到的 shiji 数据与 shiji-kb 数据并存（不同 ID 区间），不会覆盖。可手动挑选保留哪一份。
```

- [ ] **Step 2: Commit**

```bash
git add RUNBOOK.md
git commit -m "docs(extract-data): add dutongjian + hunterhug to RUNBOOK"
```

---

## Task 5: Full lint + build + test verification

**Files:** None

- [ ] **Step 1: 根 lint**

Run: `npm run lint`

Expected: zero errors. Fix any errors in `scripts/extract-data/adapters/dutongjian.ts`, `hunterhug.ts`, or `scripts/ingest-data/adapters/zizhi.ts` if they appear.

- [ ] **Step 2: 根 build**

Run: `npm run build`

Expected: tsc + Vite pass.

- [ ] **Step 3: 根 test**

Run: `npm test`

Expected: 既有 205 个测试 + 新增 12 个（4 dutongjian + 4 hunterhug + 4 zizhi）= **217 个测试**全部通过。

- [ ] **Step 4: verify extract:list**

Run: `npm run extract:list`

Expected: 三行：
```
shiji       史记知识库     — 抽取 baojie.github.io/shiji-kb/ 的 12 本纪
zizhi       读通鉴         — 抽取 dutongjian.com 的资治通鉴篇章
shiji       Hunterhug 经典 — 抽取 hunterhug.github.io 的史记数据（counter 100+）
```

注：kind='shiji' 出现两次（shiji-kb + hunterhug），这是预期——多个源 → 同 kind。

- [ ] **Step 5: 标记 plan 完成**

如所有验收通过，向用户报告并提示用户本地执行 Task 4 RUNBOOK 步骤。
