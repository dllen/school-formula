# Final fix wave — `feat/english-seo-ads` `/en/` reference rewrite

Ten findings from the whole-branch review ("Ready to merge — With fixes"), applied as one
consolidated wave. All ten are fixed.

## Per finding

### I1 (Important) — printed chart carried prose the spec forbids
- **Changed:** `src/components/reference/ReferencePage.tsx` — added `print:hidden` to the
  description `<p>` (line 55) and the intro `<p>` (line 63). Nothing else about them changed.
- **Evidence:** prerendered `dist/en/math/multiplication-chart/index.html` now renders them as
  - `<p class="mt-1 text-sm text-[#646A73] print:hidden">…</p>` (description)
  - `<p class="text-[#1F2329] leading-relaxed print:hidden">This 1–12 multiplication chart …</p>` (intro)
  The `<h1>` and the data table remain un-hidden (`<h1 class="text-2xl font-bold text-[#1F2329]">Multiplication Chart (1–12)</h1>` and `<table class="w-full border-collapse text-sm">`), so print still leaves "只留 H1 + 数据块".

### I2 (Important) — missing regression guard for empty tables / titles
- **Changed:** `src/data/reference/en/pages.test.ts`
  - added `it('gives every page a non-empty title')` (line 68)
  - added `expect(block.rows.length).toBeGreaterThan(0);` inside the width case (line 79)
- **Evidence (grep):**
  ```
  68:  it('gives every page a non-empty title', () => {
  79:        expect(block.rows.length).toBeGreaterThan(0);
  ```
- **Evidence (guard bites):** temporarily set the multiplication block's `rows: []`:
  ```
  × keeps every table row the same width as its headers
  AssertionError: expected 0 to be greater than 0
    79|         expect(block.rows.length).toBeGreaterThan(0);
  ```
  In the same run `src/data/reference/index.test.ts` (the new M4 validation case) **passed**,
  confirming `validateReferencePages` alone does not catch an empty table — the new pages.test
  guard is the one that does. Data reverted afterwards (no diff).

### I3 (Should fix) — legacy lookup read inherited object members
- **Changed:** `worker/lib/redirect.ts` — `LEGACY_REFERENCE_CATEGORY` is now a `Map`
  (`new Map<string, string>([...])`), looked up with `.get()`. Comment updated (Chinese) to
  explain why the Map avoids `toString`/`constructor`/`__proto__`.
- **Changed:** `worker/lib/redirect.test.ts` — new case
  `'does not treat inherited object members as legacy slugs'` asserting `null` for
  `toString`, `constructor`, `__proto__`.

### M1 + M2 (Should fix) — neutrality tests could not see the leak
- **M1a:** `src/data/reference/neutral/conversions.ts` — `'1 day = 24 h'` → `'1 d = 24 h'`.
- **M1b:** `src/data/reference/neutral/conversions.test.ts` — replaced the "≤ 3 letters"
  heuristic with the explicit `UNIT_TOKENS` allowlist
  `['km','m','cm','mm','t','kg','g','mg','h','min','s','d']`, asserting
  `UNIT_TOKENS.has(token)` for every alphabetic token. `toContain('=')` and the powers-of-ten
  `toContain` cases kept.
  - **Evidence the allowlist rejects a leak:** temporarily restored `'1 day = 24 h'`:
    ```
    × carries no display copy — entries are digits, operators and unit symbols only
    AssertionError: unexpected token "day" in "1 day = 24 h": expected false to be true
    ```
    Also `node -e` check: `has(day)=false  has(d)=true  has(intro)=false`. Data reverted afterwards.
- **M2:** `src/data/reference/neutral/constants.test.ts` — the token check now runs over both
  `constant.value` and `constant.alternate` (when present) against an SI allowlist
  `['m','s','J','C','kg','mol','N']`. `alternate` (`'10 m/s²'`) is now policed; a prose leak
  there fails.

### M3 (Should fix) — dataset categories not tied to `REFERENCE_CATEGORIES`
- **Changed:** `src/reference-routes.test.ts` — added
  `it('lists every category the data actually uses')` comparing
  `[...new Set(REFERENCE_PAGES.map(p => p.category))].sort()` to `[...REFERENCE_CATEGORIES].sort()`.
  Adding a fourth union variant without updating the array now fails the suite instead of
  silently producing a soft-404.

### M4 (Should fix) — shipped dataset never validated by `npm test`
- **Changed:** `src/data/reference/index.test.ts` — added
  `it('ships a dataset that passes build-time validation')` with
  `expect(() => validateReferencePages(REFERENCE_PAGES)).not.toThrow();`.

### M5 (Should fix) — legacy slug map had no cross-check against the dataset
- **Changed:** `worker/lib/redirect.test.ts` — imports the real dataset
  (`import { REFERENCE_PAGES } from '../../src/data/reference'`) and adds a describe
  `'legacy slug map stays in sync with the dataset'`. For each of the six legacy slugs it
  calls `legacyReferenceRedirect(...)`, parses the returned `/en/<category>/<slug>/` target,
  and asserts the page exists in `REFERENCE_PAGES` with that exact category. No non-null
  assertions (uses an `if (!target) continue;` narrowing).
- **Worked cleanly.** Vitest's `scripts` project (`extends: true` on the root config) resolves
  TS across the `worker/` ↔ `src/` boundary without extra config — the test passes. Renaming a
  slug in the data would now fail this test.

### M6 (Should fix) — two `static-paths` boundary cases untested
- **Changed:** `worker/lib/static-paths.test.ts` — added
  - `assetCandidates('/energy')` and `assetCandidates('/env')` → `['/energy|env/index.html', '/index.html']`
    (app-shell fallback preserved; they merely share the `/en` prefix);
  - `assetCandidates('/en/assets/x.js')` → `['/en/assets/x.js']` (dotted asset, single path).

### M7 (Nice to have) — hub breadcrumb not print-hidden
- **Changed:** `src/components/reference/ReferenceCategory.tsx` — added `print:hidden` to the
  breadcrumb `<nav>` (line 26), matching the chart page.

## Suite / typecheck / build

- **Full suite:** `Test Files  68 passed (68)` / `Tests  381 passed (381)`.
- **`./node_modules/.bin/tsc -b`:** exit 0, no output (clean).
- **`npm run build`:** success — `prerendered 297 pages (+ robots.txt, sitemap.xml)`.
- **`./node_modules/.bin/eslint .`:** exit 0, clean.

## End-to-end print verification (step 4)

Grepped the built `dist/en/math/multiplication-chart/index.html`:

| Element | Prerendered class | Verdict |
|---|---|---|
| description `<p>` | `mt-1 text-sm text-[#646A73] print:hidden` | hidden in print |
| intro `<p>` | `text-[#1F2329] leading-relaxed print:hidden` | hidden in print |
| `<h1>` | `text-2xl font-bold text-[#1F2329]` (no `print:hidden`) | stays |
| data `<table>` | `w-full border-collapse text-sm` (no `print:hidden`) | stays |

So print now emits H1 + data block only, as Spec Section 2 requires.

## M5 note

M5 was completed cleanly (see above). No fallback/simplification was needed.

## Flaky test (pre-existing, out of scope)

During verification the full suite once reported `1 failed | 380 passed`. The culprit is
`src/data/mastery/qgen/generators.test.ts > every generator produces valid questions`
(`AssertionError: expected 1 to be greater than or equal to 2` — the question generator
sometimes emits a single option). It is:
- untouched by this wave (`git status` shows no change under `src/data/mastery/`),
- independently reproducible: a 30-run loop of that one file failed **1/30** with no other
  changes, and it does not import anything this wave touched.

It is a pre-existing randomness flake, not introduced here. Flagging it, not fixing it (out of
scope).

## `git status`

Only the 11 intended files are modified; **no `pnpm-lock.yaml` change** (verified). The
untracked `.freebuff/` was already present at session start and is left alone.

```
 M src/components/reference/ReferenceCategory.tsx
 M src/components/reference/ReferencePage.tsx
 M src/data/reference/en/pages.test.ts
 M src/data/reference/index.test.ts
 M src/data/reference/neutral/constants.test.ts
 M src/data/reference/neutral/conversions.test.ts
 M src/data/reference/neutral/conversions.ts
 M src/reference-routes.test.ts
 M worker/lib/redirect.test.ts
 M worker/lib/redirect.ts
 M worker/lib/static-paths.test.ts
```

## Files changed

Production (4):
- `src/components/reference/ReferencePage.tsx`
- `src/components/reference/ReferenceCategory.tsx`
- `src/data/reference/neutral/conversions.ts`
- `worker/lib/redirect.ts`

Tests (7):
- `src/data/reference/en/pages.test.ts`
- `src/data/reference/index.test.ts`
- `src/data/reference/neutral/constants.test.ts`
- `src/data/reference/neutral/conversions.test.ts`
- `src/reference-routes.test.ts`
- `worker/lib/redirect.test.ts`
- `worker/lib/static-paths.test.ts`

## Concerns

- The pre-existing `qgen/generators.test.ts` flake (above) means `npm test` may report a
  spurious failure roughly 1 in 10–15 runs. It predates this branch and is unrelated.
- `worker/lib/redirect.test.ts` now imports `src/` data. This is test-only; the shipped worker
  still does not import `src/`, preserving the plan's compilation-boundary decision. Worth a
  note if a future tsconfig ever adds `worker/` to a project's `include` — the cross-boundary
  import would then need to be considered.
