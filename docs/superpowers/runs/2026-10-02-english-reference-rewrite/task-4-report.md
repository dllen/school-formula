# Task 4 Report — 数据模块原子替换 + 图表页重写（URL 保持扁平）

**Status: DONE_WITH_CONCERNS** (one extra deletion beyond the brief's file list; one print-style spec discrepancy)

## What I implemented

Deleted the single-file data module `src/data/reference.ts` and replaced it with the directory
`src/data/reference/`, then rewired all consumers in the same commit:

- `src/data/reference/validate.ts` — build-time validation (`validateReferencePages`), collects every
  problem before throwing.
- `src/data/reference/index.ts` — `REFERENCE_PAGES` (spread of `REFERENCE_PAGES_EN`), `getReferencePage`,
  `pagesInCategory`, plus the `Block` / `ReferenceCategory` / `ReferencePage` type re-exports.
- `src/components/reference/ReferenceNotFound.tsx`, `FaqSection.tsx`, `RelatedCharts.tsx` — new.
- `src/components/reference/ReferencePage.tsx` — rewritten to the fixed render order
  面包屑 → H1 → intro → blocks → howToUse → ad → FAQ → related, with exactly one
  `<AdUnit placement="referenceBottom" />`.
- `src/components/reference/ReferenceIndex.tsx` — new `REFERENCE_PAGES` API, flat links, `capitalize`.
- `src/components/reference/ReferenceLayout.tsx` — `print:hidden` on header and footer.
- `src/reference-routes.ts` — import + `ENGLISH_ROUTE_PATHS` data source only; **flat URL and the
  one-argument `referencePath(slug)` unchanged**.
- `src/seo/content-en.ts` — `getReferenceTable` → `getReferencePage`, `table.*` → `page.*`.
- `src/entry-prerender.ts` — calls `validateReferencePages(REFERENCE_PAGES)` before writing `dist/`.

No URL, route pattern, or `referencePath` signature changed. No new dependency. `package.json` untouched.

## Verification

- **Residual-symbol grep** — `grep -rn "getReferenceTable\|REFERENCE_TABLES\|REFERENCE_SLUGS" src/ worker/`
  → **no output** (exit 1).
- **Type check** — `./node_modules/.bin/tsc -b` → exit 0, no output.
- **Full suite** — `./node_modules/.bin/vitest run` → `Test Files 66 passed (66)` /
  `Tests 352 passed (352)`.
- **Lint** — `npm run lint` → exit 0, every `errorCount` 0.
- The Step 21 signal tests (`App.test.tsx`, `entry-server.test.tsx`, `adPlacements.test.tsx`,
  `src/prerender/routes.test.ts`, `src/i18n/languages.test.ts`, `src/prerender/inject.test.ts`) all pass
  **unmodified** — confirmation the change stayed inside the flat-URL boundary.

## TDD Evidence

### `src/data/reference/validate.test.ts` (new)
- **RED** — `./node_modules/.bin/vitest run src/data/reference/validate.test.ts`
  → `Test Files 1 failed (1) / Tests no tests`, reason: `Failed to resolve import "./validate"`.
  Expected, since `validate.ts` did not exist yet.
- **GREEN** — same command → `Test Files 1 passed (1) / Tests 10 passed (10)`.

### `src/data/reference/index.test.ts` (new)
- Written after `index.ts` (the brief's step order has no separate RED step here).
- **GREEN** — `./node_modules/.bin/vitest run src/data/reference/index.test.ts`
  → `Test Files 1 passed (1) / Tests 3 passed (3)`.

### `src/components/reference/ReferencePage.test.tsx` (new)
- **RED** — `./node_modules/.bin/vitest run src/components/reference/ReferencePage.test.tsx`
  → `Test Files 1 failed (1) / Tests 4 failed | 2 passed (6)`.
  Failures were exactly the missing new behaviour: no intro text, no
  "Frequently asked questions" heading, no "Related charts" heading, and the 404 heading read
  `Chart not found` instead of `Page not found`.
- **GREEN** (after the rewrite + `git rm src/data/reference.ts`, since the new `import` only resolves to
  the directory once the old file is gone) — same command →
  `Test Files 1 passed (1) / Tests 6 passed (6)`.

### Modified tests (not new)
- `src/reference-routes.test.ts` and `src/seo/meta.test.ts`: `REFERENCE_SLUGS`/`REFERENCE_TABLES` →
  `REFERENCE_PAGES`; assertion values unchanged (still the flat `/en/reference/<slug>/` URLs).
  Both green in the full-suite run.

## Files

**Created**: `src/data/reference/validate.ts`, `src/data/reference/index.ts`,
`src/components/reference/ReferenceNotFound.tsx`, `src/components/reference/FaqSection.tsx`,
`src/components/reference/RelatedCharts.tsx`, `src/data/reference/validate.test.ts`,
`src/data/reference/index.test.ts`, `src/components/reference/ReferencePage.test.tsx`.

**Modified**: `src/reference-routes.ts`, `src/reference-routes.test.ts`, `src/seo/content-en.ts`,
`src/seo/meta.test.ts`, `src/components/reference/ReferenceIndex.tsx`,
`src/components/reference/ReferencePage.tsx`, `src/components/reference/ReferenceLayout.tsx`,
`src/entry-prerender.ts`.

**Deleted**: `src/data/reference.ts` (brief) and **`src/data/reference.test.ts` (extra — see concerns)**.

**Commit**: `82d8fe5` — `feat(reference): 数据模块原子替换，图表页改为分节式渲染` (18 files).

## Concerns

1. **Seventh consumer the brief did not list — `src/data/reference.test.ts` (deleted).**
   The brief states there are "exactly six consumers". There is a seventh: the co-located test
   `src/data/reference.test.ts`, which imported `getReferenceTable` / `REFERENCE_SLUGS` /
   `REFERENCE_TABLES` from the deleted module. After `git rm src/data/reference.ts` it failed
   5/5 with `TypeError: getReferenceTable is not a function`. It tests only the deleted
   `ReferenceTable` shape. **(Corrected in fix round 1: my original claim that its coverage was
   "fully superseded" was wrong — its `keeps every row the same width as its headers` case had no
   equivalent, and that gap hid a real misalignment bug. The invariant has now been restored,
   generalised, in `en/pages.test.ts`.)** The brief forbids loosening assertions, and a
   test of a deleted module cannot be kept — deleting it is the only way to a green suite. I deleted it
   and am surfacing it here rather than blocking. **If a reviewer disagrees, this is the one change to
   revisit.**

2. **The ad is not print-hidden, which appears to contradict the global constraint.**
   The task's global constraints say "Print styles hide the breadcrumb, ad, howToUse, FAQ, related and
   the print button". The brief's literal `ReferencePage.tsx` renders a bare
   `<AdUnit placement="referenceBottom" />` with no `print:hidden`, `AdUnit.tsx` itself has none, and
   there is no global `@media print` rule in the codebase (grep finds `print:hidden` only on the
   breadcrumb, category badge, howToUse, print-button wrapper, FAQ, related, header and footer).
   I transcribed the brief's code exactly (it is the authoritative file-level spec, and adding the class
   inside `src/ads/AdUnit.tsx` would be outside this task's file list). **Resolved in fix round 1: the
   controller confirmed the constraint, and the call site in `ReferencePage.tsx` is now wrapped in
   `<div className="print:hidden">` (fix local to `ReferencePage.tsx`; `src/ads/AdUnit.tsx` untouched).**

3. **Attribution line uses `Claude Sonnet 5`, not `Claude Opus 5`.**
   The brief's commit command ends with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. The harness
   attribution reminder in force says to end commits with `Co-Authored-By: Claude Sonnet 5
   <noreply@anthropic.com>` and that it replaces earlier guidance. I used the harness line (it also reflects
   the actual authoring model). Subject and body are the brief's verbatim.

4. **`pnpm-lock.yaml` side effect reverted.** Running `npm run lint` (RTK-wrapped) triggered a pnpm
   resolution that regenerated `pnpm-lock.yaml` (adding testing-library/happy-dom entries). The baseline was
   clean, so I restored the file — it is **not** in the commit. Final `git status` shows only the untracked
   `.freebuff/`.

## Self-review findings

- Faithful transcription of the brief's code for every new/rewritten file (class names, copy, render order,
  single `AdUnit`). No URL/route/`referencePath` change, no extra export, no barrel, no second ad, no extra
  tests beyond the three the brief specifies.
- `src/data/reference.ts` removed with `git rm`, not emptied; the directory and every consumer landed in the
  same commit, so no intermediate commit would fail `tsc -b`.
- Test output on the new files is pristine (no stray warnings): the `AbortError` chatter visible in the
  full-suite tail originates from the pre-existing, unmodified `src/App.test.tsx` teardown and is unrelated
  to this change.

---

# Fix round 1

## Finding A (Critical) — multiplication chart row/header misalignment

The deleted `src/data/reference.test.ts` carried a row-width invariant
(`keeps every row the same width as its headers`) that nothing in the new suite replaced. Without it, the
generator rewrite dropped the leading row-label column: `multiplicationRows(12)` returned **12** cells per
row while `en/math.ts` still passed **13** headers (`['×', ...range(1,12)]`). Header row and body rows did
not line up. Multiplication was the only affected table (the other four are unchanged and well-formed;
trigonometric-identities is a `formulas` block with no headers).

### Changes

- **`src/data/reference/en/pages.test.ts`** — added a generalised invariant over every page's table blocks:

  ```ts
  it('keeps every table row the same width as its headers', () => {
    for (const page of REFERENCE_PAGES_EN) {
      for (const block of page.blocks) {
        if (block.kind !== 'table' || !block.headers) continue;
        for (const row of block.rows) {
          expect(row).toHaveLength(block.headers.length);
        }
      }
    }
  });
  ```

  Written first, confirmed RED, then GREEN after the generator fix.

- **`src/data/reference/neutral/tables.ts`** — `multiplicationRows` now emits `[rowLabel, ...products]`:

  ```ts
  export function multiplicationRows(max = 12): string[][] {
    const numbers = range(1, max);
    return numbers.map((row) => [String(row), ...numbers.map((col) => String(row * col))]);
  }
  ```

  The row label is the number itself, so it is language-neutral and belongs in the generator. Doc comment
  updated (grid is now `1 + max` wide, still no header row).

- **`src/data/reference/neutral/tables.test.ts`** — assertions updated to the labelled shape:
  `returns a labelled grid of products with no header row` (width 13, `rows[11][12] === '144'`); the
  product-invariant case now asserts `rows[row][0] === String(row + 1)` and indexes products at `col + 1`;
  the custom-maximum case's expected array gains a leading label per row.

### Multiplication chart: actual row width vs header count

| | header cells | body row cells | aligned |
|---|---|---|---|
| before | 13 | 12 | no |
| after | 13 | 13 | yes |

Empirical RED output (the real module, before the fix):

```
FAIL  src/data/reference/en/pages.test.ts > English reference pages > keeps every table row the same width as its headers
AssertionError: expected [ '1', '2', '3', '4', '5', '6', …(6) ] to have a length of 13 but got 12
- 13
+ 12
```

## Finding B (Important) — ad not print-hidden

The spec requires the ad slot hidden when printing. Wrapped the call site in
`src/components/reference/ReferencePage.tsx`:

```tsx
      <div className="print:hidden">
        <AdUnit placement="referenceBottom" />
      </div>
```

`src/ads/AdUnit.tsx` (shared with the Chinese knowledge-detail page) was **not** touched.

## Fix-round verification

- **RED → GREEN** — `./node_modules/.bin/vitest run src/data/reference/`
  - RED (before generator fix): `Test Files 1 failed | 5 passed (6)` / `Tests 1 failed | 35 passed (36)`
    — the single failure was the width invariant on the multiplication chart (12 vs 13).
  - GREEN (after): `./node_modules/.bin/vitest run src/data/reference/ src/components/reference/`
    → `Test Files 8 passed (8)` / `Tests 49 passed (49)`.
- **Full suite** — `npm test` → exit 0, `Test Files 66 passed (66)` / `Tests 353 passed (353)`
  (352 before, +1 for the new invariant).
- **Type check** — `./node_modules/.bin/tsc -b` → exit 0, no output.
- **Residual grep** — `grep -rn "getReferenceTable\|REFERENCE_TABLES\|REFERENCE_SLUGS" src/ worker/`
  → no output (exit 1).
- **Flat-URL boundary intact** — `./node_modules/.bin/vitest run src/App.test.tsx src/entry-server.test.tsx
  src/ads/adPlacements.test.tsx src/prerender/routes.test.ts` → `4 passed (4)` / `16 passed (16)`, and
  `git status` confirms those four files are **unmodified**.
- **No lockfile side effect** — `npm test` this round left `pnpm-lock.yaml` untouched.

## Fix-round commit

`fix(reference): 乘法表补回行号列，广告位打印时隐藏` — 4 files
(`src/data/reference/neutral/tables.ts`, `src/data/reference/neutral/tables.test.ts`,
`src/data/reference/en/pages.test.ts`, `src/components/reference/ReferencePage.tsx`).
