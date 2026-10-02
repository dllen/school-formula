# Task 1 Report: 类型定义与中立生成器

**Status:** DONE_WITH_CONCERNS
**Commit:** `1cae0a0` — feat(reference): 中立生成器与分节式页面类型

## What I implemented

Created 8 files, all under `src/data/reference/` (a new directory that co-exists
with the untouched `src/data/reference.ts`):

| File | Contents |
|------|----------|
| `types.ts` | `ReferenceCategory`, `Block`, `ReferencePage` — verbatim from brief |
| `neutral/numeric.ts` | `range`, `squareRoot` — verbatim |
| `neutral/tables.ts` | `multiplicationRows`, `squaresCubesRootsRows` — verbatim |
| `neutral/conversions.ts` | `metricConversionRows` — verbatim |
| `neutral/constants.ts` | `physicsConstantRows` — verbatim |
| `neutral/tables.test.ts`, `neutral/conversions.test.ts`, `neutral/constants.test.ts` | tests |

Constraints honoured: named exports only; no default exports; Chinese comments
kept as written; no new runtime dependencies; `package.json` untouched;
`src/data/reference.ts` untouched; **no** `src/data/reference/index.ts` created;
no bare `data/reference` import anywhere (grepped: none).

## What I tested and the results

- `npx vitest run src/data/reference/neutral/` → **13 passed (3 files)**, matching
  the brief's Step 14 expectation.
- Full suite `npx vitest run` → **322 passed (62 files), 0 failed** (no regression).
- `npx tsc -b` → **No errors found** (exit 0).
- `./node_modules/.bin/eslint src/data/reference/types.ts src/data/reference/neutral/`
  → clean, no output.

## TDD Evidence

### `neutral/tables.test.ts`
- **RED** — `npx vitest run src/data/reference/neutral/tables.test.ts` →
  `Error: Failed to resolve import "./tables" … Does the file exist?`
  `Test Files 1 failed (1) / Tests no tests`. Expected: `tables.ts` did not exist yet.
- **GREEN** — after writing `tables.ts`: `Test Files 1 passed (1) / Tests 7 passed (7)`.

### `neutral/conversions.test.ts`
- **RED** — `npx vitest run src/data/reference/neutral/conversions.test.ts` →
  `Error: Failed to resolve import "./conversions" … Does the file exist?`
  `Test Files 1 failed (1) / Tests no tests`. Expected: file did not exist yet.
- **GREEN** — after writing `conversions.ts`: `Test Files 1 passed (1) / Tests 3 passed (3)`.

### `neutral/constants.test.ts`
- **RED** — `npx vitest run src/data/reference/neutral/constants.test.ts` →
  `Error: Failed to resolve import "./constants" … Does the file exist?`
  `Test Files 1 failed (1) / Tests no tests`. Expected: file did not exist yet.
- **GREEN** — after writing `constants.ts`: `3 passed (3)`; directory run `13 passed (13)`.

## Self-review findings — two defects in the brief (see Concerns)

I read my own diff against the brief. The 6 non-test files are byte-identical to
the brief. **Two of the brief's test cases are mathematically unsatisfiable
against the brief's own implementation**, so 2 test lines were corrected (the
generators were left verbatim — I chose to keep the deliverable source exactly as
the brief wrote it and fix only the assertions that could never pass):

1. **`tables.test.ts` line 56**, assertion `squares back to n for every perfect
   square in range`: the brief compared `root * root` against `Number(row[1])`,
   but `row[1]` is `n²`, not `n` — the assertion `(√n)² === n²` only holds at
   `n = 1`. Failure observed: `expected 4 to be 16` at `n = 4`. The test's own
   title says "squares back to **n**", and `n` is `row[0]`; the same file's
   sibling assertions pin `rows[19][0] === '20'` (row[0] = n) and
   `Number(row[1]) === n*n` (row[1] = n²). Changed `row[1]` → `row[0]`.
   The corrected assertion exercises 4 real cases (n = 1, 4, 9, 16).

2. **`conversions.test.ts` line 22**: the brief asserted the row
   `['Mass', '1 kg = 1000 g']`, but the brief's own `metricConversionRows()`
   labels the Mass group on its largest-unit row `['Mass', '1 t = 1000 kg']`
   (with `['', '1 kg = 1000 g']` unlabeled). The three groups are symmetric —
   the label sits on the largest-unit row: `Length` → `1 km = 1000 m`,
   `Time` → `1 h = 60 min = 3600 s`, `Mass` → `1 t = 1000 kg`. No row equal to
   `['Mass', '1 kg = 1000 g']` can exist alongside the group test's required
   `['Length', 'Mass', 'Time']` label sequence. Changed the expected pair to
   `['Mass', '1 t = 1000 kg']`, which keeps the generator verbatim and the
   symmetric invariant intact. Failure observed before the fix:
   `expected [ [ 'Length', '1 km = 1000 m' ], …(8) ] to deep equally contain [ 'Mass', '1 kg = 1000 g' ]`.

Everything else in every test file is verbatim from the brief; no test was
weakened (both corrections compare against the value the generator actually
produces and that the rest of the file already proves correct).

## Files changed

```
A src/data/reference/types.ts
A src/data/reference/neutral/numeric.ts
A src/data/reference/neutral/tables.ts
A src/data/reference/neutral/tables.test.ts
A src/data/reference/neutral/conversions.ts
A src/data/reference/neutral/conversions.test.ts
A src/data/reference/neutral/constants.ts
A src/data/reference/neutral/constants.test.ts
```

## Issues / concerns

1. **The brief contains two false test assertions** (details above). I corrected
   the two test lines and left the generators verbatim. If the controller prefers
   a different resolution (e.g. reorder the Mass rows so `['Mass', '1 kg = 1000 g']`
   exists and drop/relabel the tonne row), it is a 1–2 line change. The brief's
   stated "Expected: PASS" counts (7 / 3 / 13) are all met after the corrections.

2. **Environment side effect, since reverted:** running `npx eslint …` caused
   corepack/pnpm to reconcile and rewrite `pnpm-lock.yaml` (this repo's
   `node_modules` is pnpm-managed via `.pnpm` symlinks despite the npm-oriented
   CLAUDE.md) and to move some npm-installed packages into `node_modules/.ignored`.
   I reverted `pnpm-lock.yaml` (`git checkout --`), confirmed the toolchain is
   intact (vitest 322 pass, tsc clean), and got clean lint by invoking the binary
   directly (`./node_modules/.bin/eslint`) instead of `npx`. Working tree is
   clean apart from the pre-existing untracked `.freebuff/` and the committed task files.

3. `src/data/reference.ts` and `src/data/reference/index.ts` were deliberately
   not touched/created, per the task's module-resolution constraint.

---

# Fix round 1 — neutral layer must carry no display copy

**Status:** DONE
**Commit:** `197e99a` — refactor(reference): 让 neutral 生成器真正语言中立

## What changed

The spec (`docs/superpowers/specs/2026-10-02-english-seo-ads-design.md`, Section 1)
requires the `neutral/` layer to be 无 slug、无文案. Two generators baked English
display names into their returned data (and their comments claimed the opposite):

- `neutral/conversions.ts` — `metricConversionRows(): string[][]` returned
  `['Length', '1 km = 1000 m']`. Replaced with the neutral shape:
  `export type ConversionGroupKey = 'length' | 'mass' | 'time'`;
  `export interface ConversionGroup { key: ConversionGroupKey; entries: string[] }`;
  `export function metricConversionGroups(): ConversionGroup[]`. Equality strings
  unchanged (digits + SI unit symbols only); the group label is now a key.
- `neutral/constants.ts` — `physicsConstantRows(): string[][]` returned
  `['Gravitational acceleration', 'g', '9.8 m/s² (or 10 m/s²)']`. Replaced with
  `export interface PhysicalConstant { symbol: string; value: string; alternate?: string }`
  and `export function physicalConstants(): PhysicalConstant[]`. The connective
  "or" is gone: `{ symbol: 'g', value: '9.8 m/s²', alternate: '10 m/s²' }`.

Both files rewritten verbatim from the regenerated brief (Steps 9 and 13).
`types.ts`, `numeric.ts`, `tables.ts` unchanged. `src/data/reference/en/**` was
not touched — English display names are Task 2's job.

`neutral/conversions.test.ts` and `neutral/constants.test.ts` were rewritten to
the regenerated brief's versions (Steps 7 and 11). Each gains one case asserting
the neutrality property directly: every alphabetic token in an entry/value is at
most 3 characters (a unit symbol such as `km` / `min` / `day` / `kg` / `mol`,
never a word like `Length`). Coverage lost in the earlier round is restored:
`1 kg = 1000 g` is asserted again (via the `mass` group's entries).

## TDD evidence (fix round)

### `conversions.test.ts` (rewritten to the neutral spec)
- **RED** — `./node_modules/.bin/vitest run src/data/reference/neutral/conversions.test.ts`
  → `4 tests | 4 failed`, `TypeError: metricConversionGroups is not a function`
  (the old module still exported `metricConversionRows`). Expected: the new
  export did not exist yet.
- **GREEN** — after rewriting `conversions.ts`:
  `Test Files 1 passed (1) / Tests 4 passed (4)`.

### `constants.test.ts` (rewritten to the neutral spec)
- **RED** — `./node_modules/.bin/vitest run src/data/reference/neutral/constants.test.ts`
  → `4 tests | 4 failed`, `TypeError: physicalConstants is not a function`.
  Expected: the new export did not exist yet.
- **GREEN** — after rewriting `constants.ts`: `4 passed (4)`.

### Covering suite + type check
- `./node_modules/.bin/vitest run src/data/reference/neutral/` →
  **`Test Files 3 passed (3) / Tests 15 passed (15)`** (tables 7 + conversions 4
  + constants 4), matching the regenerated brief's Step 14.
- `./node_modules/.bin/tsc -b` → no output, `TSC_EXIT=0`.
- `./node_modules/.bin/eslint src/data/reference/neutral/` → no output, `ESLINT_EXIT=0`.
- Full suite `./node_modules/.bin/vitest run` → **324 passed (62 files), 0 failed**
  (was 322; +2 from the two added neutrality cases).

## Notes

- The regenerated brief's `tables.test.ts` (Step 3, line 145) still contains the
  unsatisfiable `expect(root * root).toBe(Number(row[1]))` assertion described in
  the first report; it was not part of this amendment. My previous `row[0]`
  correction stands, and the brief's expected count of 7 tables cases is met.
- Tools were invoked as `./node_modules/.bin/<tool>`, never bare `npx`, so no
  package-manager side effect occurred this round (`git status` showed only the
  4 intended modified files).
- Commit message: the regenerated brief's Step 16 repeats the original
  `feat(reference)…` message, which no longer describes this delta (a rename +
  neutral-shape refactor already-committed code). I used a descriptive
  `refactor(reference)…` message instead; squash/adjust freely if you prefer the
  brief's literal text.

