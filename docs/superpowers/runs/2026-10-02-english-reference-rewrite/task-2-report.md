# Task 2 Report: 英文页面数据（6 页迁移）

## What I implemented

Created the English language layer for the `/en/` reference-chart surface — seven files, all under `src/data/reference/en/`:

- `data/trigIdentities.ts` — `TRIG_IDENTITY_GROUPS` (4 labelled groups).
- `data/irregularVerbs.ts` — `IRREGULAR_VERB_ROWS` (24 verbs × 3 forms).
- `math.ts` — `MATH_PAGES` (4 pages) with a module-local `METRIC_GROUP_LABELS`
  record and `metricConversionRows()` helper that renders the neutral group keys
  (length/mass/time) into the labelled `string[][]` shape the table block needs.
- `science.ts` — `SCIENCE_PAGES` (1 page) with a module-local `CONSTANT_NAMES`
  record and `physicsConstantRows()` helper (English quantity names + "or"
  connective supplied locally; neutral layer carries only symbol/value).
- `english.ts` — `ENGLISH_PAGES` (1 page, `related: []` by design).
- `index.ts` — `REFERENCE_PAGES_EN`, concatenating math → science → english.
- `pages.test.ts` — 7 stub-guard tests.

Six pages total, matching the pre-rewrite set: `multiplication-chart`,
`squares-cubes-roots`, `trigonometric-identities`, `metric-conversions`,
`physics-constants`, `irregular-verbs`. Every page gains `intro`, `howToUse`
(3 bullets each), `faq` (4 entries each) and `related`.

All copy, slugs, titles, headers and helper bodies are verbatim from the brief.
Neutral layer untouched; `src/data/reference.ts` untouched; no `src/data/reference/index.ts`
created; no bare `data/reference` import anywhere.

## What I tested and results

Command: `./node_modules/.bin/vitest run src/data/reference/en/` (from repo root).

Result: `Test Files 1 passed (1)` / `Tests 7 passed (7)`. Output pristine — no stray warnings.

Type check: `./node_modules/.bin/tsc -b` → exit 0, no diagnostics.

## TDD Evidence

**RED** — wrote `pages.test.ts` first, before any implementation file existed:

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 ❯ |app| src/data/reference/en/pages.test.ts (0 test)
Error: Failed to resolve import "./index" from "src/data/reference/en/pages.test.ts". Does the file exist?
 Test Files  1 failed (1)
      Tests  no tests
```

Expected: the test imports `./index`, which did not exist yet, so the suite could
not even load — the correct RED for a "file does not exist yet" step. No assertion
ever ran.

**GREEN** — after creating all six data files + `index.ts`:

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  264ms
```

All 7 assertions green on the first run; no copy needed adjustment (length
stub-guards 40–100 / 100–200 / 60–150 words all satisfied by the brief's copy).

## Files changed

Commit `c6ec738` — `feat(reference): 英文图表面六页迁移到分节式模型`:

- `src/data/reference/en/data/irregularVerbs.ts` (new)
- `src/data/reference/en/data/trigIdentities.ts` (new)
- `src/data/reference/en/english.ts` (new)
- `src/data/reference/en/index.ts` (new)
- `src/data/reference/en/math.ts` (new)
- `src/data/reference/en/pages.test.ts` (new)
- `src/data/reference/en/science.ts` (new)

7 files changed, 422 insertions(+). Nothing else staged (pre-existing untracked
`.freebuff/` deliberately left alone).

## Self-review findings

- **Completeness**: all 7 brief files created; 6 pages present; every page carries
  `intro` / `howToUse` / `faq` / `related` (verified by grep counts: 4+1+1 pages
  each with the four new fields).
- **Discipline**: no extra charts, no extra exports, no barrel that imports
  `data/reference` by a bare path, no copy "improvements". Scope exactly as briefed.
- **Local helpers on purpose**: `metricConversionRows()` / `physicsConstantRows()`
  reuse the old function names with English copy supplied locally, as the brief's
  Task-1 decision requires.
- **Testing**: tests assert real exported data (slugs, categories, related-link
  integrity, length bounds, per-page minimums) — no mocks.

No issues found requiring a fix.

## Issues or concerns

None. The task is complete as specified and green on both the focused test and
`tsc -b`.

---

# Fix round 1 — SEO length targets

## What I changed

The original plan self-contradicted: the Global Constraints declared
`summary` 60–90 / `description` 150–160, but the reused legacy copy measured
47–56 / 117–142, and the loose stub-guard test (40–100 / 100–200) let it pass.
The regenerated brief (Step 3 preamble + Step 7) fixed this. I:

1. **Tightened `pages.test.ts`** (Step 7) — replaced the two stub-guard length
   tests with the target-bound versions: `summary` 58–95, `description` 148–165,
   `intro` 75–135 words.
2. **Extended the copy** in the four `math.ts` pages, the one `science.ts` page
   and the one `english.ts` page — keeping every legacy opening sentence intact
   and appending only true value points (free to print, no signup, single page,
   classroom/homework use). No PDF download, answer keys or worksheet-generator
   promises. British English maintained.
   - `trigonometric-identities` summary (68) and `irregular-verbs` summary (60)
     already met the target and were left unchanged.

## Covering tests

`src/data/reference/en/pages.test.ts`:
- `holds summary and description at the SEO length targets` (new bounds)
- `holds intro at the target length` (new bounds)

## Command and output

RED — tightened test against the *un-extended* copy:

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 ❯ |app| src/data/reference/en/pages.test.ts (7 tests | 1 failed)
AssertionError: expected 53 to be greater than or equal to 58
 ❯ pages.test.ts:45:35  expect(page.summary.length).toBeGreaterThanOrEqual(58)
 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
```

The failure is exactly the gap the old loose bound failed to catch — `summary 53 < 58`
on `multiplication-chart`.

GREEN — after extending the copy:

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  276ms
```

```
$ ./node_modules/.bin/tsc -b
tsc exit=0   (no diagnostics)
```

## Measured lengths (every summary and description)

Measured by importing `REFERENCE_PAGES_EN` and reading `.length` / word count.
Spec targets: summary 60–90, description 150–160, intro 80–120 words.
Test bounds: summary 58–95, description 148–165, intro 75–135 words.

| page | summary len | description len | intro words |
|---|---|---|---|
| multiplication-chart | 82 | 158 | 109 |
| squares-cubes-roots | 72 | 159 | 80 |
| trigonometric-identities | 68 | 157 | 80 |
| metric-conversions | 70 | 160 | 89 |
| physics-constants | 65 | 161 | 81 |
| irregular-verbs | 60 | 160 | 93 |

**Correction (fix round 2).** The sentence that previously stood here claimed all
six descriptions sat inside the spec target (150–160). That contradicted the table
directly above it and was wrong: after round 1 only **five** of six did —
`physics-constants` measured **161**, inside round 1's loose test bound (148–165)
but 1 character over target. The table is right; that prose was the error. The
corrected reading of round 1 is: all six summaries (60–82) and five of six
descriptions (157–160) were inside target; the `physics-constants` description at
161 was the single exception. All six intros were inside 80–120 words. The
exception is fixed in round 2 below.

## Deferred (not touched, per instruction)

`CONSTANT_NAMES` key type, the tautological category-membership assertion, and
the commit-trailer wording — all left as-is (round-1 review Minor findings).

---

# Fix round 2 — bounds enforced exactly, and `physics-constants` trimmed

## What I changed

Round 1's test bound (`description` 148–165) left headroom against the stated
target (150–160), so `physics-constants` at 161 passed — the same
"headroom defeats the constraint" mistake as the original 40–100. The
regenerated brief (Step 7) removed all tolerance. I:

1. **Tightened both length tests** to the target itself, no tolerance —
   `summary` 60–90, `description` 150–160, `intro` 80–120 words.
2. **Trimmed the `physics-constants` description** from 161 to 150 by dropping the
   appended `, no signup` clause, leaving `… and more. Free to print.` The legacy
   opening claim is untouched; the remaining appended value point ("free to print")
   is true; no new claim was introduced. No other page's copy moved.

## Command and output

RED — exact-bounds test against the round-1 copy (one failure, as expected):

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 ❯ |app| src/data/reference/en/pages.test.ts (7 tests | 1 failed)
 FAIL  > holds summary and description inside the SEO length targets
AssertionError: expected 161 to be less than or equal to 160
 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
```

GREEN — after the trim:

```
$ ./node_modules/.bin/vitest run src/data/reference/en/
 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  345ms
```

```
$ ./node_modules/.bin/tsc -b
tsc exit=0   (no diagnostics)
```

## Re-measured lengths (every summary and description)

Measured by importing `REFERENCE_PAGES_EN` and reading `.length` / word count,
under the exact-target test bounds (60–90 / 150–160 / 80–120 words).

| page | summary len | description len | intro words |
|---|---|---|---|
| multiplication-chart | 82 | 158 | 109 |
| squares-cubes-roots | 72 | 159 | 80 |
| trigonometric-identities | 68 | 157 | 80 |
| metric-conversions | 70 | 160 | 89 |
| physics-constants | 65 | **150** (was 161) | 81 |
| irregular-verbs | 60 | 160 | 93 |

Every one of the twelve lengths is now inside the exact targets: summaries
60–82 (all ≤90), descriptions 150–160 (all ≤160), intros 80–109 words
(all ≤120). `physics-constants` moved 161 → 150; no other value changed from
its round-1 measurement.

## Deferred (still not touched)

`CONSTANT_NAMES` key type, the tautological category-membership assertion, and
the commit-trailer wording — left as-is, per instruction.
