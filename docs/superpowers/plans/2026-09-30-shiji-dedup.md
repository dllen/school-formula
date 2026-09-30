# shiji dedup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add title+chapter-based dedup to the ingest pipeline so `shiji-kb` (v5+) and `hunterhug` (v100+) extractions don't produce duplicate chapters in `src/data/shiji.ts`. Extend framework minimally (1 helper + 2 config fields + 1 merge-step filter), enable on shijiAdapter only.

**Architecture:** Generic dedup option on `simpleArrayAdapter` (via `dedupBy` + `dedupFields` config). Framework reads existing data file with new `extractItemFields` regex helper, builds a Set<string> of existing dedup keys, then filters incoming items in `merge()`. Skip items log to stderr. Other adapters unchanged.

**Tech Stack:** TypeScript 5.9 ESM + Node fs APIs + regex (no new deps).

**Spec:** `docs/superpowers/specs/2026-09-30-shiji-dedup-design.md`

**Predecessor:** `docs/superpowers/plans/2026-09-30-extract-data-dutongjian-hunterhug.md` (5 tasks, all delivered; commit `800f396`)

---

## Task 1: extractItemFields utility (TDD)

**Files:**
- Modify: `scripts/ingest-data/tsedit.ts` (add function + JSDoc)
- Modify: `scripts/ingest-data/tsedit.test.ts` (add 2 tests)

- [ ] **Step 1: Write failing tests in `scripts/ingest-data/tsedit.test.ts`**

Append to the existing test file:

```ts
describe('extractItemFields', () => {
  it('extracts title+chapter pairs from item blocks', () => {
    const content = `
      const DATA = [
        { id: 'v1', title: '周本纪', chapter: '卷一', content: [] },
        { id: 'v2', title: '夏本纪', chapter: '卷二', content: [] },
        { id: 'v3', title: '周本纪', chapter: '卷一', content: [] },
      ];
    `;
    const items = extractItemFields(content, 'title', 'chapter');
    expect(items).toEqual([
      { title: '周本纪', chapter: '卷一' },
      { title: '夏本纪', chapter: '卷二' },
      { title: '周本纪', chapter: '卷一' },
    ]);
  });

  it('skips item blocks missing requested fields', () => {
    const content = `const X = [{ id: 'v1' }, { title: 'a', chapter: 'b' }];`;
    const items = extractItemFields(content, 'title', 'chapter');
    expect(items).toEqual([{ title: 'a', chapter: 'b' }]);
  });

  it('returns empty array when no item blocks match', () => {
    expect(extractItemFields('', 'title')).toEqual([]);
  });
});
```

Make sure `extractItemFields` is imported at the top of the test file.

- [ ] **Step 2: Run tests to verify they fail (function not yet implemented)**

Run: `cd scripts/ingest-data && npm test`

Expected: 3 new tests fail with "extractItemFields is not defined" or similar import error.

- [ ] **Step 3: Implement `extractItemFields` in `scripts/ingest-data/tsedit.ts`**

Append to the end of `tsedit.ts`:

```ts
/** 从源文件提取每个 item 块的字段映射。
 *  item 块按最外层 {...} 切分（不适用于嵌套对象，但本项目所有 array item 都是 flat 的）。
 *  返回并行数组：[{ field1: 'v1', field2: 'v2' }, ...]。 */
export function extractItemFields(
  content: string,
  ...fieldNames: string[]
): Array<Record<string, string>> {
  const items: Array<Record<string, string>> = [];
  const itemRegex = /\{[^{}]*\}/g;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(content))) {
    const block = m[0];
    const entry: Record<string, string> = {};
    for (const f of fieldNames) {
      const re = new RegExp(`\\b${f}:\\s*['"]([^'"]+)['"]`);
      const fm = re.exec(block);
      if (fm) entry[f] = fm[1];
    }
    if (Object.keys(entry).length > 0) items.push(entry);
  }
  return items;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd scripts/ingest-data && npm test`

Expected: all tests pass (existing 30 + 3 new = 33).

- [ ] **Step 5: Type-check**

Run: `cd scripts/ingest-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/ingest-data/tsedit.ts scripts/ingest-data/tsedit.test.ts
git commit -m "feat(ingest-data): extractItemFields utility for dedup support"
```

---

## Task 2: dedup in simpleArrayAdapter.merge (TDD)

**Files:**
- Modify: `scripts/ingest-data/adapters/simple-array.ts` (add config fields + merge filter)
- Modify: `scripts/ingest-data/adapters/simple-array.test.ts` (or formula-merge.test.ts) (add 1 integration test)

- [ ] **Step 1: Read existing simple-array.test.ts and formula-merge.test.ts to find a good test file**

Run: `ls /Users/shichaopeng/Work/self-dir/projects/school-formula/scripts/ingest-data/adapters/*.test.ts`

Use the test file that already tests simpleArrayAdapter (most likely `simple-array.test.ts` or `formula-merge.test.ts`). If neither exists, use `simple-array.test.ts`.

- [ ] **Step 2: Write failing test for dedup behavior**

Append a new `describe('dedup')` block to the chosen test file:

```ts
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { simpleArrayAdapter } from './simple-array.js';
import type { IngestContext } from '../types.js';

describe('simpleArrayAdapter dedup', () => {
  let tmpDir: string;
  let ctx: IngestContext;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'dedup-test-'));
    ctx = { root: tmpDir, dryRun: false, knowledgePointIds: new Set() };
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('skips incoming items whose dedupBy key matches existing data', () => {
    const file = join(tmpDir, 'data.ts');
    writeFileSync(
      file,
      `export const DATA = [
        { id: 'v1', title: '周本纪', chapter: '卷一', content: ['a'] },
      ];`,
      'utf-8'
    );
    const adapter = simpleArrayAdapter({
      kind: 'test',
      envelopeKey: 'items',
      typeRef: { path: '/x.ts', name: 'Item', expr: 'Item[]' },
      file: 'data.ts',
      arrayName: () => 'DATA',
      dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
      dedupFields: ['title', 'chapter'],
    });

    // Spy on stderr to capture skip log
    const stderrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const incoming = [
      { id: 'v2', title: '周本纪', chapter: '卷一', content: ['dup'] },  // skip
      { id: 'v3', title: '夏本纪', chapter: '卷二', content: ['b'] },    // append
    ];
    const result = adapter.merge(incoming, { items: incoming }, ctx);

    expect(result.inserted).toBe(1);  // 只 append 了 1 条
    const updated = readFileSync(file, 'utf-8');
    expect(updated).toContain('夏本纪');
    expect(updated).toContain('v3');
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining('skip "周本纪|卷一"')
    );

    stderrSpy.mockRestore();
  });
});
```

Make sure `vi` is imported from vitest at the top.

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd scripts/ingest-data && npm test`

Expected: new dedup test fails (because `simpleArrayAdapter` doesn't yet use `dedupBy`).

- [ ] **Step 4: Extend `SimpleArrayConfig` and `merge()` in `simple-array.ts`**

Modify `scripts/ingest-data/adapters/simple-array.ts`:

1. Add `import { extractItemFields }`:
```ts
import { appendToConstArray, extractIds, extractItemFields } from '../tsedit';
```

2. Add to `SimpleArrayConfig`:
```ts
export interface SimpleArrayConfig {
  kind: string;
  envelopeKey: string;
  typeRef: TypeRef;
  file: string;
  arrayName: (item: unknown, raw: unknown) => string;
  checks?: (items: { id: string }[], ctx: IngestContext) => string[];
  /** dedup key 函数。返回相同 key 的 incoming item 会被跳过。返回空字符串 → 不参与 dedup。 */
  dedupBy?: (item: Record<string, unknown>) => string;
  /** 与 dedupBy 配套，用于从现有数据文件抽取字段以重建 dedup key。 */
  dedupFields?: string[];
}
```

3. Replace the `merge` function body:

```ts
    merge(value, raw, ctx) {
      const abs = join(ctx.root, cfg.file);
      const content = readFileSync(abs, 'utf-8');
      let items = value as Record<string, unknown>[];

      // Dedup against existing data
      if (cfg.dedupBy && cfg.dedupFields) {
        const existingItems = extractItemFields(content, ...cfg.dedupFields);
        const existingKeys = new Set(
          existingItems
            .map(e => cfg.dedupBy!(e as Record<string, unknown>))
            .filter(k => k.length > 0)
        );
        const filtered: typeof items = [];
        for (const it of items) {
          const key = cfg.dedupBy(it);
          if (key && existingKeys.has(key)) {
            console.error(`[ingest-data] ${cfg.kind}: skip "${key}" — 已有`);
          } else {
            filtered.push(it);
          }
        }
        items = filtered;
      }

      const groups = new Map<string, Record<string, unknown>[]>();
      for (const it of items) {
        const name = cfg.arrayName(it, raw);
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name)!.push(it);
      }
      let updated = content;
      for (const [name, group] of groups) {
        updated = appendToConstArray(updated, name, group);
      }
      writeFileSync(abs, updated, 'utf-8');
      return { files: [abs], inserted: items.length };
    },
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd scripts/ingest-data && npm test`

Expected: dedup test now passes; existing 30 tests still pass (33 total).

- [ ] **Step 6: Type-check**

Run: `cd scripts/ingest-data && npm run typecheck`

Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
git add scripts/ingest-data/adapters/simple-array.ts scripts/ingest-data/adapters/<test-file>.test.ts
git commit -m "feat(ingest-data): simpleArrayAdapter dedupBy/dedupFields config"
```

---

## Task 3: Enable dedup on shijiAdapter

**Files:**
- Modify: `scripts/ingest-data/adapters/shiji.ts` (add 2 config lines)

- [ ] **Step 1: Add dedup config to `shiji.ts`**

Open `scripts/ingest-data/adapters/shiji.ts` and add 2 lines after `checks:`:

```ts
  dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
  dedupFields: ['title', 'chapter'],
```

Final adapter config:

```ts
export const shijiAdapter = simpleArrayAdapter({
  kind: 'shiji',
  envelopeKey: 'volumes',
  typeRef: {
    path: '<root>/src/data/shiji.ts',
    name: 'ShijiVolume',
    expr: 'ShijiVolume[]',
  },
  file: 'src/data/shiji.ts',
  arrayName: () => 'SHIJI_DATA',
  checks: (items) => {
    const errs: string[] = [];
    for (const it of items as Array<Record<string, unknown>>) {
      if (typeof it.id !== 'string' || !it.id) errs.push(`id 缺失: ${JSON.stringify(it)}`);
      if (typeof it.title !== 'string' || !it.title) errs.push(`title 缺失: ${it.id}`);
      if (typeof it.chapter !== 'string' || !it.chapter) errs.push(`chapter 缺失: ${it.id}`);
      if (!Array.isArray(it.content) || it.content.length === 0) {
        errs.push(`content 缺失或空: ${it.id}`);
      }
    }
    return errs;
  },
  dedupBy: (it) => `${it.title ?? ''}|${it.chapter ?? ''}`,
  dedupFields: ['title', 'chapter'],
});
```

- [ ] **Step 2: Run ingest-data tests + typecheck**

Run: `cd scripts/ingest-data && npm test && npm run typecheck`

Expected: 33 tests pass, zero typecheck errors. shijiAdapter existing 4 tests still pass.

- [ ] **Step 3: Commit**

```bash
git add scripts/ingest-data/adapters/shiji.ts
git commit -m "feat(ingest-data): enable dedup on shiji adapter"
```

---

## Task 4: Full lint + build + test verification

**Files:** None

- [ ] **Step 1: 根 lint**

Run: `npm run lint`

Expected: zero errors.

- [ ] **Step 2: 根 build**

Run: `npm run build`

Expected: tsc + Vite pass.

- [ ] **Step 3: 根 test**

Run: `npm test`

Expected: 既有 217 个测试 + ingest-data 新增 4 个（3 tsedit + 1 dedup integration）= **221 个测试**全部通过。

- [ ] **Step 4: 标记 plan 完成**

如所有验收通过，向用户报告。
