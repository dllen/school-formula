# HTML Inspector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add `--inspect <url>` flag to `extract.sh` that fetches a single URL, saves HTML fixture, prints structure report (headings, top class names, paragraph container candidates, IDs), and recommends top 1-2 selectors.

**Architecture:** New `core/inspect.ts` module + CLI dispatch + fixture-based unit test. ~150 lines total. Reuses existing cheerio dep + http fetch pattern.

**Tech Stack:** TypeScript 5.9 ESM + cheerio (existing) + Node fs.

**Spec:** `docs/superpowers/specs/2026-09-30-html-inspector-design.md`

---

## Task 1: core/inspect.ts + test (TDD)

**Files:**
- Create: `scripts/extract-data/core/inspect.ts`
- Create: `scripts/extract-data/core/inspect.test.ts`
- Create: `scripts/extract-data/__fixtures__/sample.html` (test fixture)

- [ ] **Step 1: Create test fixture `__fixtures__/sample.html`**

```html
<!DOCTYPE html>
<html><body>
  <article>
    <h1 class="chapter-title">周本纪 - 卷四</h1>
    <div class="period">威烈王二十三年</div>
    <p>周武王之母曰太姒...</p>
    <p>其后稷...</p>
    <p>三年春正月...</p>
    <p>夏四月...</p>
    <p>秋七月...</p>
    <p>冬十月...</p>
    <p>是岁也...</p>
    <p>次年...</p>
    <p>复次年...</p>
    <p>太史公曰...</p>
  </article>
</body></html>
```

- [ ] **Step 2: Write failing tests `core/inspect.test.ts`**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync as rfs } from 'node:fs';
import { inspectHtml } from './inspect.js';

let root: string;
const SAMPLE_HTML = rfs(join(import.meta.dirname, '..', '__fixtures__', 'sample.html'), 'utf-8');

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'inspect-test-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('inspectHtml', () => {
  it('returns parsed report from injected HTML', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fetchedBytes).toBe(SAMPLE_HTML.length);
    expect(report.headings.length).toBeGreaterThan(0);
    expect(report.headings[0]?.text).toContain('周本纪');
    const articleP = report.candidates.find((c) => c.selector === 'article p');
    expect(articleP?.paragraphs).toBe(10);
  });

  it('saves fixture to .fixtures/<adapter>/<hash>-<ts>.html when save=true', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', adapterKind: 'shiji', save: true, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fixturePath).toBeDefined();
    expect(existsSync(report.fixturePath!)).toBe(true);
    expect(readFileSync(report.fixturePath!, 'utf-8')).toBe(SAMPLE_HTML);
  });

  it('does not save fixture when save=false', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    expect(report.fixturePath).toBeUndefined();
  });

  it('extracts top class names', async () => {
    const fakeFetch = (async () => new Response(SAMPLE_HTML, { status: 200 })) as unknown as typeof fetch;
    const report = await inspectHtml(
      { url: 'https://example.com/page', save: false, maxHeadings: 20 },
      { root, fetchImpl: fakeFetch }
    );
    const chapterTitle = report.topClasses.find((c) => c.cls === 'chapter-title');
    expect(chapterTitle?.count).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd scripts/extract-data && npm test -- core/inspect`

Expected: all 4 tests fail with "inspectHtml is not a function".

- [ ] **Step 4: Implement `core/inspect.ts`**

```ts
// scripts/extract-data/core/inspect.ts
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';

export interface InspectOptions {
  url: string;
  adapterKind?: string;
  save: boolean;
  maxHeadings: number;
}

export interface InspectReport {
  url: string;
  fetchedBytes: number;
  fetchedMs: number;
  cached: boolean;
  headings: Array<{ level: number; text: string }>;
  topClasses: Array<{ cls: string; count: number }>;
  candidates: Array<{ selector: string; paragraphs: number; avgChars: number }>;
  ids: Array<{ id: string; count: number }>;
  fixturePath?: string;
}

const CANDIDATE_SELECTORS = [
  'article p',
  'main p',
  '.content p',
  '.article-body p',
  'body > div p',
  '.entry p',
  '.post p',
  '#content p',
  '#main p',
];

const MIN_CLASS_FREQ = 2;

function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

function tsFilenameSafe(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export async function inspectHtml(
  opts: InspectOptions,
  ctx: { root: string; fetchImpl?: typeof fetch }
): Promise<InspectReport> {
  const fetchImpl = ctx.fetchImpl ?? fetch;
  const t0 = Date.now();
  const res = await fetchImpl(opts.url);
  if (!res.ok) throw new Error(`${opts.url} → ${res.status}`);
  const html = await res.text();
  const fetchedMs = Date.now() - t0;

  // Save fixture
  let savedPath: string | undefined;
  if (opts.save) {
    const adapter = opts.adapterKind ?? 'unknown';
    const dir = join(ctx.root, 'scripts', 'extract-data', '.fixtures', adapter);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${hashUrl(opts.url)}-${tsFilenameSafe()}.html`);
    writeFileSync(file, html, 'utf-8');
    savedPath = file;
  }

  // Parse + report
  const $ = load(html);

  // Headings
  const headings: InspectReport['headings'] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    if (headings.length >= opts.maxHeadings) return;
    const tag = el.tagName.toLowerCase();
    const level = Number(tag.slice(1));
    const text = $(el).text().trim().slice(0, 80);
    if (text) headings.push({ level, text });
  });

  // Top class names
  const classCounts = new Map<string, number>();
  $('[class]').each((_, el) => {
    const cls = ($(el).attr('class') ?? '').trim().split(/\s+/);
    for (const c of cls) {
      if (!c) continue;
      classCounts.set(c, (classCounts.get(c) ?? 0) + 1);
    }
  });
  const topClasses = [...classCounts.entries()]
    .filter(([, n]) => n >= MIN_CLASS_FREQ)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cls, count]) => ({ cls, count }));

  // Container candidates
  const candidates = CANDIDATE_SELECTORS.map((selector) => {
    const ps = $(selector).toArray();
    const paragraphs = ps.length;
    const totalChars = ps.reduce((sum, p) => sum + $(p).text().trim().length, 0);
    const avgChars = paragraphs > 0 ? Math.round(totalChars / paragraphs) : 0;
    return { selector, paragraphs, avgChars };
  }).filter((c) => c.paragraphs > 0)
    .sort((a, b) => b.paragraphs - a.paragraphs);

  // IDs
  const idCounts = new Map<string, number>();
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (!id) return;
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  });
  const ids = [...idCounts.entries()]
    .map(([id, count]) => ({ id, count }));

  return {
    url: opts.url,
    fetchedBytes: html.length,
    fetchedMs,
    cached: false,
    headings,
    topClasses,
    candidates,
    ids,
    fixturePath: savedPath,
  };
}

/** Format the report as plain text for stdout. */
export function formatReport(report: InspectReport): string {
  const lines: string[] = [];
  lines.push(`=== URL: ${report.url}`);
  lines.push(`=== Fetched: ${(report.fetchedBytes / 1024).toFixed(1)} KB in ${report.fetchedMs}ms (cache: ${report.cached ? 'hit' : 'miss'})`);
  lines.push('');

  lines.push('# Heading hierarchy');
  if (report.headings.length === 0) {
    lines.push('  (none)');
  } else {
    for (const h of report.headings) {
      const indent = '  '.repeat(h.level - 1);
      lines.push(`${indent}h${h.level}: ${h.text}`);
    }
  }
  lines.push('');

  lines.push(`# Top class names (freq >= ${MIN_CLASS_FREQ})`);
  if (report.topClasses.length === 0) {
    lines.push('  (none)');
  } else {
    for (const c of report.topClasses) {
      lines.push(`  ${c.cls} ×${c.count}`);
    }
  }
  lines.push('');

  lines.push('# Container candidates (paragraph yield)');
  if (report.candidates.length === 0) {
    lines.push('  (no paragraphs found)');
  } else {
    const maxP = Math.max(...report.candidates.map((c) => c.paragraphs));
    for (const c of report.candidates) {
      const star = c.paragraphs === maxP ? ' ★' : '';
      lines.push(`  ${c.selector.padEnd(18)} → ${String(c.paragraphs).padStart(3)} paragraphs (avg ${c.avgChars} chars)${star}`);
    }
  }
  lines.push('');

  lines.push('# IDs / landmarks');
  if (report.ids.length === 0) {
    lines.push('  (none)');
  } else {
    const idStrs = report.ids.slice(0, 10).map((i) => `#${i.id} ×${i.count}`);
    lines.push('  ' + idStrs.join(', '));
  }
  lines.push('');

  if (report.candidates[0]) {
    const top = report.candidates[0];
    const second = report.candidates[1];
    const suggest = second && second.paragraphs >= top.paragraphs * 0.5 ? `'${top.selector}' or '${second.selector}'` : `'${top.selector}'`;
    lines.push(`# Suggested selector (highest yield)`);
    lines.push(`  → ${suggest}`);
  }

  if (report.fixturePath) {
    lines.push('');
    const relFixture = report.fixturePath.split('/').slice(-2).join('/');
    lines.push(`# Saved fixture: ${relFixture} (${(report.fetchedBytes / 1024).toFixed(1)} KB)`);
  }

  return lines.join('\n');
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd scripts/extract-data && npm test -- core/inspect`

Expected: all 4 tests pass.

- [ ] **Step 6: Run full test suite**

Run: `cd scripts/extract-data && npm test`

Expected: all tests pass (existing 37 + 4 new = 41).

- [ ] **Step 7: Type-check**

Run: `cd scripts/extract-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 8: Commit**

```bash
git add scripts/extract-data/core/inspect.ts scripts/extract-data/core/inspect.test.ts scripts/extract-data/__fixtures__/sample.html
git commit -m "feat(extract-data): inspectHtml core with structure report + candidate scoring"
```

---

## Task 2: CLI integration

**Files:**
- Modify: `scripts/extract-data/cli/args.ts` (add flags)
- Modify: `scripts/extract-data/index.ts` (dispatch to inspect)

- [ ] **Step 1: Update `args.ts` CliFlags interface**

Add to `CliFlags`:

```ts
export interface CliFlags {
  // ... existing ...
  inspect?: string;          // URL to inspect
  save: boolean;             // save fixture (default true when --inspect)
  maxHeadings?: number;
}
```

Initialize `save: true` in `parseCliArgs`.

Update `case` block:

```ts
case '--inspect':
  flags.inspect = argv[++i];
  if (!flags.inspect) errors.push('--inspect 需要值');
  break;
case '--no-slot':
  flags.save = false;
  break;
case '--max-headings':
  const v = argv[++i];
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) errors.push(`--max-headings 需要正整数（传入: ${v}）`);
  else flags.maxHeadings = n;
  break;
```

Also add to the "too many positionals" check: if `flags.inspect` is set, ignore positional adapter name (mutually exclusive).

- [ ] **Step 2: Update `index.ts` to dispatch inspect**

In `main()`, after parsing args and before the "missing adapter name" check, add:

```ts
if (args.flags.inspect) {
  try {
    await runInspect(args.flags.inspect, args.flags, { root: process.cwd() });
    process.exit(0);
  } catch (err) {
    console.error(`[extract-data] inspect fatal: ${(err as Error).message}`);
    process.exit(1);
  }
}
```

- [ ] **Step 3: Create `core/runner.ts` helper `runInspect`**

Add to `scripts/extract-data/core/runner.ts`:

```ts
import { inspectHtml, formatReport } from './inspect.js';
import type { CliFlags } from '../cli/args.js';

export async function runInspect(
  url: string,
  flags: CliFlags,
  ctx: { root: string }
): Promise<void> {
  const report = await inspectHtml(
    {
      url,
      adapterKind: flags.adapterName ?? 'unknown',
      save: flags.save,
      maxHeadings: flags.maxHeadings ?? 20,
    },
    ctx
  );
  console.log(formatReport(report));
}
```

- [ ] **Step 4: Update `help.ts` to document new flags**

Append to HELP_TEXT:

```
  --inspect <url>        inspect HTML structure of single URL (dev tool)
  --no-slot              skip saving fixture when --inspect (default: save)
  --max-headings <n>     heading print limit (default 20)
```

- [ ] **Step 5: Run tests + typecheck**

Run: `cd scripts/extract-data && npm test && npm run typecheck`

Expected: 41 tests pass, zero typecheck errors.

- [ ] **Step 6: Smoke test (sandbox: will fail DNS but should not crash)**

Run: `cd /Users/shichaopeng/Work/self-dir/projects/school-formula && bash scripts/extract-data/extract.sh --inspect https://example.com --no-slot 2>&1 | head -5`

Expected: `Error: 未知 adapter` or DNS error (sandbox limitation). No JavaScript crash.

- [ ] **Step 7: Commit**

```bash
git add scripts/extract-data/cli/args.ts scripts/extract-data/cli/help.ts scripts/extract-data/core/runner.ts scripts/extract-data/index.ts
git commit -m "feat(extract-data): --inspect CLI flag + dispatch"
```

---

## Task 3: .gitignore + verification

**Files:**
- Modify: `scripts/extract-data/.gitignore`

- [ ] **Step 1: Add `.fixtures/` to `.gitignore`**

Open `scripts/extract-data/.gitignore`. Confirm it contains `.cache/` and append:

```
.fixtures/
```

- [ ] **Step 2: Verify gitignore works**

Run: `cd /Users/shichaopeng/Work/self-dir/projects/school-formula/scripts/extract-data && touch .fixtures/test.html && git check-ignore -v .fixtures/test.html`

Expected: `.gitignore:XX:.fixtures/` (file is ignored).

Then `rm .fixtures/test.html`.

- [ ] **Step 3: Run lint + build + test**

Run: `cd /Users/shichaopeng/Work/self-dir/projects/school-formula && npm run lint && npm run build && npm test 2>&1 | tail -10`

Expected: lint clean, build passes, ~225 tests pass (221 + 4 new).

- [ ] **Step 4: Commit**

```bash
git add scripts/extract-data/.gitignore
git commit -m "chore(extract-data): gitignore .fixtures"
```

- [ ] **Step 5: Mark plan complete**

Report results.
