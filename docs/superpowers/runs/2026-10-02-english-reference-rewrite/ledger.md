# SDD ledger — plan: docs/superpowers/plans/2026-10-02-english-reference-rewrite.md

Spec: docs/superpowers/specs/2026-10-02-english-seo-ads-design.md (read; authority for rulings)
Branch: feat/english-seo-ads
MERGE_BASE: 4221e7f
Plan revised before Task 1 dispatch (original 8-task split had a broken atomic boundary).

## Pre-flight conflict scan

### Cross-task rows (shared file or interface)

| Tasks | Produce → Consume | Finding |
|---|---|---|
| T1 → T2 | `Block`, `ReferencePage`, `range`, `multiplicationRows`, `squaresCubesRootsRows`, `metricConversionRows`, `physicsConstantRows` | Contracts match |
| T1 → T3 | `Block` via explicit path `../../../data/reference/types` | Match; explicit path avoids the `reference.ts` vs `reference/` collision |
| T1 → T4 | `ReferencePage`, `ReferenceCategory` | Match |
| T2 → T4 | `REFERENCE_PAGES_EN` | Match |
| T3 → T4 | `BlockRenderer` | Match |
| T4 → T5 | `REFERENCE_PAGES`, `getReferencePage`, `pagesInCategory`, `ReferenceNotFound`, `ReferenceIndex`, `ReferencePage` | Match |
| T4 → T5 | `referencePath(slug)` one-arg → T5 changes to `referencePath(category, slug)` | Intentional signature change; T5 Step 9/10/15/19 update all three call sites (RelatedCharts, ReferencePage, ReferenceCategory, ReferenceIndex) |
| T5 → T6 | `ENGLISH_CATEGORY_ROUTE`, `ReferenceCategory` | Match |
| T4/T5 both modify `src/reference-routes.ts` | T4 changes import source only; T5 changes URL shape | Deliberate two-pass; documented in plan |
| T5/T6 both modify `src/App.test.tsx` | T5 updates the chart-path case; T6 adds the hub case | Disjoint cases, no conflict |
| T5 modifies `RelatedCharts.tsx`; T4 creates it | — | T5's edit is a one-line href change; sequential, fine |
| T7 isolated | worker imports nothing from `src/` | Independent |

### Per-task self-consistency rows (spec's tests vs spec's code)

| Task | Check | Finding |
|---|---|---|
| T1 | `tables.test.ts` count vs described code — 3 + 4 = 7 | Consistent (plan says 7) |
| T1 | `conversions.test.ts` 3, `constants.test.ts` 3, total 13 | Consistent (plan says 3 / 3 / 13) |
| T1 | `range`/`squareRoot` both consumed by `tables.ts` | No unused exports |
| T2 | 7 test cases described | Consistent (plan says 7) |
| T2 | `en/math.ts` imports match the generators used | `range`, `multiplicationRows`, `squaresCubesRootsRows`, `metricConversionRows`, `TRIG_IDENTITY_GROUPS` — all used |
| T2 | `en/index.ts` does not need `categories.ts` (created in T5) | Correct — no forward dependency |
| T3 | `BlockRenderer.test.tsx` cell/header name collision | FIXED during plan self-review (`headers: ['×','1']` + `rows: [['7','8']]`) |
| T3 | diagram assertion robustness across parsers | FIXED (assert `querySelector('svg')` + `innerHTML` contains `<circle`) |
| T4 | Consumer list complete for the atomic delete? | FIXED — original plan missed `src/seo/meta.test.ts`; now enumerated |
| T4 | `ReferenceIndex.tsx` / `ReferencePage.tsx` compile after `getReferenceTable` removal | FIXED — both pulled into T4 |
| T4 | Flat-URL claim: do App/entry-server/adPlacements/prerender-routes tests survive? | Yes — verified by reading each file; all assert on `/en/reference/:slug`, unchanged in T4 |
| T5 | `ReferencePage.test.tsx` updated to new route pattern and 404 cases | Consistent (plan says 8 cases) |
| T5 | Does `src/entry-server.test.tsx` break here? | Yes — `ENGLISH_REFERENCE_ROUTE` auto-updates via App.tsx, so T5 owns that fix. Added. |
| T6 | `App.test.tsx` 6 existing → 7 with the hub case | Consistent (plan says 7) |
| T7 | `redirect.test.ts` case count | FIXED — 5 existing + 3 new = **8**, plan originally said 6 |

## Rulings

Ruling: Split the plan into 7 tasks with the URL change deferred to Task 5, and the data-module
delete kept alone in Task 4 — the original plan's Task 3 deleted `src/data/reference.ts` while
scheduling its two component consumers for Tasks 5/6, so Task 3's commit would not compile.
The spec is silent on task decomposition, so this is a plan-quality call, not a spec conflict.
Cost if wrong: one task's worth of rework in `src/reference-routes.ts` and the component files,
and a reordering of the remaining dispatches.

Ruling: Task 4 keeps flat URLs (`/en/reference/:slug`) rather than moving to `/en/:category/:slug`.
Changing the URL in the same commit as the atomic delete would additionally break
`App.test.tsx`, `entry-server.test.tsx`, `adPlacements.test.tsx` and `prerender/routes.test.ts`,
inflating the one unreviewable commit to ~16 files. Section 2 of the spec mandates the layered
URL but does not mandate when it lands. Cost if wrong: a slightly longer sequence of commits.

Ruling: Task 7 adds `PRERENDERED_SURFACES = ['/en']` to `worker/lib/static-paths.ts` so that
`/en/<unknown>/` returns a real 404 instead of the SPA shell. This is beyond the plan text but
delivers the spec's stated intent in Section 2 — ":category 在组件里对照 REFERENCE_CATEGORIES
校验…否则 /en/typo/ 会产出预渲染 HTML + 200，等于给 Google 一张空页" — whose actual mechanism is
the Worker fallback, not the prerender list. Cost if wrong: one small Worker behaviour change to
revert; Chinese-app behaviour is untouched and covered by a regression test.

Ruling: `.superpowers/` added to `.gitignore`. The SDD skill treats its workspace as git-ignored
scratch; this repo did not ignore it, so ledger artifacts would have shown up as untracked.
Cost if wrong: one `.gitignore` line to remove.

Ruling: `src/i18n/languages.test.ts` and `src/prerender/inject.test.ts` keep their
`/en/reference/...` sample strings. Both test generic path transforms (language-prefix stripping;
path→output-file), which hold for any path, so editing them would only add review noise. Cost if
wrong: two cosmetic string updates.

## Progress

(none yet)

## Dispatch log

Task 1: dispatched 2026-10-02 (model sonnet; BASE 27ddf1a). Brief: task-1-brief.md. Agent: a8226642b99f0c9e5.

## Environment findings (pre-Task-2)

`node_modules` is a **pnpm**-managed tree (`node_modules/.pnpm/`, `node_modules/.ignored/`), and the
git-tracked lockfile is `pnpm-lock.yaml`. `package-lock.json` is gitignored. CLAUDE.md's claim of
"npm install + package-lock.json 锁定版本" is stale.

The Task 1 implementer's bare `npx eslint` triggered a package-manager side effect: a set of
packages was moved into `node_modules/.ignored/` and a `.pnpm` store appeared. Verified
independently after the fact, from a clean git tree:
  - `npx --no-install tsc -b`            → clean
  - `npx --no-install eslint .`          → exit 0
  - `npm test`                           → 322 passed / 62 files
  - `npm run build`                      → prerendered 294 pages
So the environment is green, not damaged. No repair action taken.

Ruling: remaining implementers and reviewers must invoke tools as `./node_modules/.bin/<tool>` or
`npx --no-install <tool>` so npx never reaches the network and never triggers an install. The
plan's literal `npx vitest run <path>` is safe in practice (npx resolves `node_modules/.bin`
first) but the `--no-install` form makes that guarantee explicit.
Cost if wrong: a slower tool invocation, nothing more.

Ruling: two Task 1 test lines deviate from the plan's literal text, and the fixes are correct.
  1. `neutral/tables.test.ts` "squares back to n": the plan asserted `root * root === row[1]`
     (n²), which is unsatisfiable — e.g. n=4 gives root=2 and 4 ≠ 16. The row is `[n, n², n³, √n]`,
     so the intended target is `row[0]` (n). Implementer changed it to `row[0]`.
  2. `neutral/conversions.test.ts`: the plan expected `['Mass', '1 kg = 1000 g']`, but the
     implementation labels Mass on its largest-unit row, `['Mass', '1 t = 1000 kg']`, mirroring
     Length→km and Time→h. The implementation is byte-identical to the original production data in
     `src/data/reference.ts` (lines 88-103), which the spec requires to be migrated faithfully, so
     the test expectation was the error.
Both are errors in the plan text, not in the implementation. Cost if wrong: two test lines.

Task 1: implementer reported DONE_WITH_CONCERNS, commit 1cae0a0. Review package: review-27ddf1a..1cae0a0.diff.
Task 1: task reviewer dispatched (model sonnet).

Task 1: review returned Spec ✅, Task quality Approved. 0 Critical, 0 Important, 3 Minor:
  minor (deferred): task-1-report.md says "6 non-test files byte-identical" — there are 5.
  minor (deferred): task-1-report.md says "no bare data/reference import anywhere" — 6 pre-existing
    ones exist elsewhere; the accurate claim is "none in this task's diff", which holds.
  minor (deferred): test rewrite of the metric-conversion assertion dropped coverage of the
    `1 kg = 1000 g` relation. Being restored by fix round 1 below.

Task 1: fix round 1/5 dispatched.

Ruling: the reviewer's third Minor — that the `neutral/` layer is only partially language-neutral —
is treated as a real spec gap, not polish, and is being fixed now rather than deferred.
  The spec (Section 1) states the neutral layer is "语言中立：生成器与常量，无 slug、无文案".
  `neutral/conversions.ts` returned English group labels ('Length'/'Mass'/'Time') and
  `neutral/constants.ts` returned English quantity names ('Gravitational acceleration') plus the
  connective "or" inside a value. The spec is the binding authority; the plan text embedded that
  copy, so the plan is wrong and the code followed it.
  Reinforcing this: the comment at `conversions.ts:2-4` asserts those labels "会随语言文件走",
  which is false — a comment that states a falsehood is a defect regardless of the design argument.
  The reviewer itself recommended deferring to "before the localization task", but nothing in this
  plan defers better than now: Task 2 authors `en/math.ts` and `en/science.ts`, the two files that
  consume these generators, and is not yet dispatched.
  Cost if wrong: ~60 lines of rework across two generators, their tests, and two language files —
  all revertable, and the rendered output is unchanged either way.

Task 1: plan amended (9a731fb) and briefs 1-2 regenerated before the fix dispatch, so the
        implementer and any re-run work from corrected text.

Task 1: fix round 1/5 reported DONE, commit 197e99a (15 cases pass; full suite 324).
  The implementer flagged that the controller's plan amendment had missed the tables.test.ts
  assertion; controller corrected the plan text in a separate docs commit and recorded it as
  Finding 2 for the re-review.
Task 1: scoped re-review dispatched (model sonnet; FIX_BASE 1cae0a0, HEAD 197e99a).

Task 1: fix round 1/5 (2 addressed, 0 open; commits 1cae0a0..197e99a). Re-review clean:
  Finding 1 (neutral layer must carry no display copy) — ADDRESSED.
  Finding 2 (unsatisfiable `squares back to n` assertion) — ADDRESSED.
  New breakage in fix diff: Minor only — plan's interface summaries still named the removed
  functions; controller fixed the plan text itself (docs commit) since the stale text would have
  misled the regenerated Task 2 brief. All seven briefs regenerated afterwards.
  Deferred minor: constants.test.ts asserts neutrality on `value` but not on `alternate`.
  Out-of-scope: none material.

Task 1: complete (commits 27ddf1a..c8da39e, review clean, 1 fix round)

Ruling (pre-flight lesson): the plan text was the defect twice in Task 1, not the implementation —
  two unsatisfiable test assertions, and a stale interface summary. All were the controller's own
  writing errors. Future pre-flight scans on this plan should verify the plan's arithmetic against
  its own declared data shapes, not only cross-task interfaces.
  Cost if wrong: nothing; this is a process note.

Task 2: dispatched (model sonnet; BASE c8da39e). Brief: task-2-brief.md. Agent: acc8fb1f49b51151e.

Task 2: implementer reported DONE, commit c6ec738. Task reviewer dispatched (model sonnet).

Task 2: review returned Spec ❌ / Needs fixes. 1 Important (plan-mandated), 3 Minor.
  Important: copy length targets unmet — 5/6 summaries (47–56 vs 60–90) and 6/6 descriptions
  (117–142 vs 150–160). Inherited verbatim from the brief; not an implementer error.
  Minors (deferred): CONSTANT_NAMES keyed by string so it can't be exhaustiveness-checked;
  pages.test.ts category-membership assertion is a type-level tautology; commit trailer wording.
  Row-reconstruction risk verified exact by the reviewer (both helpers reproduce the legacy rows).
  Copy verified byte-identical to the brief across all 7 files.

Ruling: the length-target finding is a plan defect, and the fix is to make the constraint
  machine-enforced rather than to hand-edit 11 strings in the plan.
  The plan contradicted itself: Global Constraints said 60–90 / 150–160, while Task 2's text said
  to reuse the legacy copy, and the test bounds (40–100 / 100–200) were loose enough to pass the
  short copy. The spec's target is the binding value (Section 1 states summary 60–90 and
  description 150–160, and the branch is SEO-focused, so under-filled snippets are a real cost).
  Amended the plan to require extension-to-target and tightened the test bounds to 58–95 / 148–165
  / 75–135 words, so a re-run cannot silently reproduce the miss.
  I deliberately did NOT author the 11 corrected strings myself: I have already mis-counted
  length-sensitive text twice on this plan, and a machine-checked bound is a better guarantee than
  my arithmetic. The implementer writes the copy; the test proves it.
  Cost if wrong: 11 copy strings to revert, and meta descriptions that read 10–30% shorter than
  the spec asks for.

Task 2: fix round 1/5 reported DONE, commit 7dc1574. RED captured (summary 53 < 58), then GREEN;
  all summaries 60–82, descriptions 157–161, intros 80–109 words. Scoped re-review dispatched.

Task 2: fix round 1/5 scoped re-review — NOT fully addressed. physics-constants description
  measured 161 chars, 1 over the 150–160 target (src/data/reference/en/science.ts:32). All other
  11 lengths and all 6 intros inside target. No untrue claims introduced; legacy opening sentences
  intact; no field drift. Re-reviewer also found the new upper bound of 165 was itself the reason
  161 passed green.

Ruling: my "tightened" bounds reproduced the same class of defect they were meant to fix.
  I set 148–165 against a stated target of 150–160, so the upper end stayed unenforced and a
  161-char description passed. Headroom is the mechanism by which a bound stops constraining;
  the fix is bounds that ARE the target (60–90 / 150–160 / 80–120 words), no tolerance.
  Plan amended accordingly, and Task 2's code-block strings are now explicitly labelled seed copy
  with the test as arbiter — I still decline to hand-count the strings myself.
  Cost if wrong: a future author must hit the target window exactly, or widen the stated target in
  both the spec and the test together.

Task 2: fix round 2/5 reported DONE, commit ab476a5. Bounds now exact targets; predicted single
  failure (physics-constants 161 > 160) reproduced then trimmed to 150. Re-measured: summaries
  82/72/68/70/65/60, descriptions 158/159/157/160/150/160, intros 80–109 words. Scoped re-review #2
  dispatched.

Pre-dispatch content scan (controller), applied to the three highest-risk remaining tasks after the
lesson recorded under Task 1:
  Task 3 — role-name collisions, textContent ordering, innerHTML <circle injection: all sound.
  Task 4 — REFERENCE_PAGES length 6 ✓; pagesInCategory('math') expectation matches the real
    authoring order in en/math.ts:23,64,105,140 ✓; science/english lists ✓; the related href asserted
    exists in multiplication-chart's real related list ✓; irregular-verbs related:[] makes the
    "no Related charts heading" case genuine ✓.
  Task 5 — ENGLISH_ROUTE_PATHS 1+3+6=10 ✓; hub H1 'Math' and the index-card/intro regexes match the
    copy as written ✓.
No content-vs-data mismatches found in Tasks 3-5.

Task 2: fix round 2/5 (1 addressed, 0 open; commits 7dc1574..ab476a5). Re-review #2 clean:
  physics-constants description measured 150 (was 161); all 12 lengths + 6 intros inside target;
  bounds now 60/90/150/160 and 80/120 words with zero tolerance; 11 earlier values unmoved; no
  untrue claim (the "no signup" clause was dropped, not replaced); round-1 report prose corrected.
  Out-of-scope observation ledged for the final review: several values now sit exactly on a bound
  (physics 150/150, irregular-verbs summary 60/60, metric-conversions 160/160). Deliberate, per the
  "边界即目标" ruling — but any future copy touch trips the test immediately, so a future author
  should know the window is tight by design.

Task 2: complete (commits c8da39e..ab476a5, review clean, 2 fix rounds)

Task 3: dispatched (model haiku; BASE ab476a5). Brief: task-3-brief.md.

Pre-dispatch content scan, continued to Tasks 6-7 (completing the sweep over the whole plan):
  Task 6 — App.test.tsx has 6 cases today; T5 rewrites one in place (count unchanged), T6 adds the
    hub case → 7, matching the plan's stated count ✓
  Task 7 — the two literal redirect targets match LEGACY_REFERENCE_CATEGORY (multiplication-chart→
    math, physics-constants→science) ✓; "8 cases = 5 existing + 3 new" matches the file's real 5 ✓;
    every assetCandidates expectation matches the /en suppression logic ✓
All seven tasks now content-scanned. No content-vs-data mismatches anywhere in the plan.

Task 3: implementer (haiku) reported DONE, commit aae5f20, 7/7 focused, tsc + eslint clean.
  Task reviewer dispatched (model sonnet).

Task 3: review returned Spec ✅ / Approved. 0 Critical, 0 Important, 1 Minor.
  minor (deferred): FormulasBlock keys list items by formula string (plan-mandated); a repeated
    formula string within one block would log a React duplicate-key warning. No current data hits it.
  Named risk (happy-dom SVG serialization) resolved by the reviewer running the test: the asserted
  substring '<circle' is serialization-form-independent. Output pristine.
  Controller resolved the ⚠️ item: Block has exactly 3 variants (types.ts) and BlockRenderer.tsx has
  0 `default:` branches, so the exhaustiveness guard is real.

Task 3: complete (commits ab476a5..aae5f20, review clean, 0 fix rounds)

Task 4: dispatched (model sonnet; BASE aae5f20). Brief: task-4-brief.md.

Task 4: implementer reported DONE_WITH_CONCERNS, commit 82d8fe5. 352 tests / 66 files, tsc clean,
  residual grep empty, flat-URL boundary held (all six named test files pass unmodified).
  Concerns handled by the controller before review:

Ruling: the implementer's concern 1 (a seventh consumer, src/data/reference.test.ts, existed and was
  not in the brief) is a planning failure of mine: I asserted the six-consumer list from reading
  content-en.ts and the two components, without ever running the residual grep myself. The
  implementer deleted the file, which is correct — the module it tests is gone. Cost if wrong:
  nothing; the file could not survive.
  BUT its stated justification ("coverage fully superseded by neutral/tables.test.ts + en/pages.test.ts")
  is FALSE. Controller verified by reading the deleted file from git: its case
  "keeps every row the same width as its headers" has no equivalent anywhere in the new suite, and
  that missing invariant is exactly what allowed a real regression through.

Ruling (Critical, found by the controller, not flagged by the implementer): the multiplication chart
  is misaligned. Old data had headers ['×','1'..'12'] (13) and rows of 13 cells ([rowLabel, ...12
  products]). New neutral/tables.ts multiplicationRows(max=12) returns 12 cells (products only) while
  en/math.ts still supplies 13 headers, so the header row has one more cell than every body row and
  the columns do not line up. Root cause is my plan's generator design: I applied "generators produce
  rows, language files own labels" to the header row but never noticed the old table ALSO carried a
  row-label column, which the generator silently dropped. The row label is the number itself, so it
  is language-neutral and belongs in the generator.
  Checked the other four tables: squares-cubes-roots 4/4, metric-conversions 2/2, physics-constants
  3/3, irregular-verbs 3/3, trig identities is a formulas block with no headers. Multiplication only.

Ruling: the AdUnit on the chart page is not print-hidden, so a printed page carries a ~90px blank ad
  box. The Global Constraints and spec Section 2 both require the ad to be print-hidden; the brief's
  literal ReferencePage code does not do it. Fix belongs in ReferencePage.tsx (the file this task
  owns) rather than src/ads/AdUnit.tsx, which is shared with the Chinese site and out of scope.
  Cost if wrong: one wrapper div.

Task 4: fix round 1/5 dispatched (finding A critical, finding B important).

Task 4: fix round 1/5 reported DONE, commit ae454c4. Finding A RED captured then fixed (multiplication
  row width 12→13 = header count); generalised width invariant added to en/pages.test.ts. Finding B
  fixed locally in ReferencePage.tsx; AdUnit.tsx untouched. 353 tests / 66 files, tsc clean, residual
  grep empty, the four boundary test files pass unmodified.
  Because the concerns were correctness-related, the fix preceded any task review. No review had yet
  covered this task's diff, so a single FULL task review over aae5f20..ae454c4 is dispatched in place
  of review-then-re-review. Dispatched (model sonnet).

Task 4: controller's independent integration check (the implementer reported npm test + tsc + grep but
  NOT npm run build, which is the real gate for a data-layer + page-render change):
    npm run build → prerendered 294 pages (+ robots.txt, sitemap.xml) ✓
    dist/en/reference/multiplication-chart/index.html → 13 <th>; 12 body rows, every one 13 <td>
    ⇒ header/body widths agree, so the misalignment regression is fixed end-to-end in real output,
      not merely in unit tests.
    Flat URL confirmed still in use (/en/reference/...), consistent with this task's boundary.

Task 4: fix round 1/5 (1 critical + 1 important addressed, 0 open). Full task review returned
  Spec ✅ / Approved. 0 Critical, 0 Important, 6 Minor. Reviewer independently verified all five
  tables' header/row widths and demonstrated the restored invariant's RED output.
  Minors deferred to the final review's triage, with these two recommended for fixing:
  minor (deferred, RECOMMEND FIX): a table block with rows:[] would pass every test — the deleted
    reference.test.ts asserted rows.length > 0 and that has no equivalent; en/pages.test.ts's width
    invariant is vacuously true for an empty table. One line in the existing invariant loop.
  minor (deferred, RECOMMEND FIX): description and intro remain print-visible, so a printed chart
    carries title + description + intro + blocks, not the spec's "只留 H1 + 数据块". Matches the
    brief's literal code; the constraint's prose and its enumerated hide-list disagree. Two className
    additions.
  minor (deferred, OK as-is): no real-data non-empty `title` assertion (validate.ts guards at build).
  minor (deferred, OK as-is): RelatedCharts imports the deep types path while ReferencePage uses the
    barrel; brief-specified.
  minor (deferred, OK as-is): width invariant lives in tests, not validate.ts — CI catches it.
  minor (deferred, OK as-is): fix round touched neutral/tables.ts + tests, outside the brief's file
    list but inside this task's own data module; reviewer judged it in-scope.

Task 4: complete (commits aae5f20..ae454c4, review clean, 1 fix round)

Task 5: dispatched (model sonnet; BASE ae454c4). Brief: task-5-brief.md.

Post-Task-4 plan amendments (commit above): multiplicationRows' labelled shape, the missing
  src/data/reference.test.ts delete entry, and the print:hidden AdUnit wrapper were folded back into
  the plan so a re-run cannot reproduce any of the three; the width/emptiness invariant and the
  title assertion were written into Task 2's test block as the target state for the deferred minors.

Task 5: review returned Spec ✅ / Approved. 0 Critical, no fix round needed.
  Named risk 1 (coverage erosion in the five path-updated test files) came back clean in the STRONG
  direction: all five are path-only, none removed or widened, and total coverage INCREASED
  (reference-routes.test.ts 2→6 cases, +3 prerender assertions, App.test.tsx assertion tightened).
  Named risk 2 (dual not-found guard) — both branches present and both exercised; proven
  load-bearing by neutralisation. Named risk 3 (route table) — 10 entries matching the real 6-chart
  page set.
  Minors deferred to the final review's triage, none recommended as blocking:
  minor (deferred): <ReferenceLayout><ReferenceNotFound/></ReferenceLayout> duplicated at
    ReferencePage.tsx:27-33 and ReferenceCategory.tsx:14-18; could fold into ReferenceNotFound.
  minor (deferred): no direct hub canonical assertion (covered indirectly by the uniqueness loop).
  minor (deferred): content-en.ts:55 re-implements path parsing outside reference-routes.ts.
  minor (deferred): no explicit zero-ad assertion for hub pages (they are zero-ad by construction).
  minor (deferred, outside this branch): committed pnpm-lock.yaml looks stale vs package.json for the
    test deps — reported by this task's implementer and consistent with the earlier environment finding.

Ruling: I recorded this as "Important" in the review prompt in error, not the implementer's.
  The prompt said App.test.tsx "must contain a hub case in this diff" while also stating that adding
  one would collide with Task 6. The correct requirement is that it must NOT contain one. The
  reviewer caught the contradiction, verified both directions (a hub case cannot pass until App.tsx
  registers /en/:category), and resolved it against the brief — matching the brief's Step 21, which
  specifies only the chart case. No code change needed; the defect was in my instruction.
  Cost if wrong: none.

Task 5: complete (commits a65c584..dcfc621, review clean, 0 fix rounds)

Task 6: dispatched (model haiku; BASE dcfc621). Brief: task-6-brief.md.

Task 6: implementer (haiku) reported DONE, commit 44320ee, 2 files, 367 tests / 68 files, tsc clean,
  build 297 pages with "No routes matched" count 0, dist/en/math/index.html populated (title
  "Math Reference Charts", H1 "Math"), no lockfile change. Task reviewer dispatched (model sonnet).

Task 6: review returned Spec ✅ / Approved, ZERO findings at any severity. Route-ranking risk resolved
  from React Router's rules (:category is one segment, so /en/math/<slug> can only match the
  3-segment route, order-independent); hub assertion judged discriminating.
  Controller verified the reviewer's ⚠️ externally: build 297 pages, "No routes matched" count 0,
  dist/en/{math,science,english}/index.html each populated with the right <title> and <h1>,
  dist/en/math/multiplication-chart/ still renders the chart H1 (ranking holds in real output),
  hub pages have 0 .adsbygoogle while the chart page has 1, lockfile unmutated.

Task 6: complete (commits dcfc621..44320ee, review clean, 0 fix rounds)

Task 7: dispatched (model sonnet; BASE 44320ee). Brief: task-7-brief.md.

Task 7: implementer reported DONE_WITH_CONCERNS, commit 36a9eac. 372 tests / 68 files, worker suite
  19 passed, eslint exit 0, build 297 pages. End-to-end OBSERVED (not inferred): legacy
  /en/reference/<slug>/ GET → 301; new path → 200 with H1; /en/typo/ → 404 via the Worker's own
  notFoundBody(); /en/ → 200; /tutorial/ → 200; Chinese /unknown and /knowledge/p-math-1/ → 307 → 200
  (fallback preserved).

Ruling: concern 1 — the plan's own verification command contradicted the plan's own code.
  Step 12 used `curl -sI` (HEAD) to check a redirect gated on `request.method === 'GET'`, so HEAD
  returns 404 where GET returns 301. Fixed on the documentation side (GET-based checks) rather than
  widening the gate to HEAD: the gate deliberately mirrors the pre-existing legacyViewRedirect, the
  behaviour that matters to search engines and browsers is GET, and widening it would change
  Chinese-site legacy-view behaviour on the final task. Recorded as a known limitation: HEAD-based
  link checkers will report those six legacy URLs as 404.
  Cost if wrong: link-checker false negatives on six legacy URLs until someone widens the gate.

Finding recorded but NOT fixed (outside this plan, needs the user): worker/index.ts has called
  env.ASSETS since e9c3316, but wrangler.toml declares only [site] bucket = "./dist" (Workers Sites)
  and no [assets] binding exists anywhere in the repo. e9c3316 touched no config file. The deploy
  workflow is npm run build + wrangler deploy, which reads this config. Task 7's live check showed
  that under wrangler dev with the committed config EVERY static request 404s, including real assets;
  wiring a throwaway config with [assets] binding = "ASSETS" fixed it. This suggests production static
  serving has been broken since e9c3316. Not fixed here because changing deployment config is a side
  effect outside this worktree, and because it should first be established which Worker actually
  serves syy.global (this config's routes cover only api.*).

Task 7: task reviewer dispatched (model sonnet).

Task 7: review returned Spec ❌ / Needs fixes. 2 Important + 4 Minor.
  Important 1 — the GET-only redirect gate makes HEAD return 404 (plan-mandated).
  Important 2 — env.ASSETS unbound under the committed wrangler config (pre-existing, out of scope;
    already recorded above as a finding for the user, NOT a defect of this diff).
  Minors: category assertions in redirect.test.ts don't pin slug→category exactly; legacy reference
    redirect drops the query string; two boundary cases untested (/energy, /en/assets/x.js);
    notFoundBody() is English-only.

Ruling (REVISES my earlier ruling on the same point, commit 0a…): I first ruled this a documentation
  problem — fix the plan's curl command from HEAD to GET rather than widen the gate — on the grounds
  that the gate mirrors the pre-existing legacyViewRedirect and search engines use GET. The reviewer
  supplied a stronger argument I had not weighed: RFC 9110 §9.3.2 requires HEAD to return the same
  status as GET, so the GET-only gate is an HTTP correctness violation, not merely a link-checker
  annoyance. It also makes my plan's own acceptance check fail. The fix is one line with no
  behavioural downside (the anti-OPTIONS/anti-POST intent is preserved; it also makes the
  pre-existing /?view= redirect HEAD-correct). Fixing the code.
  Cost if wrong: a HEAD request to a legacy view URL now redirects instead of falling through —
  i.e. strictly more correct, and revertable in one line.

Ruling: I am pulling Minor 3 into the fix loop even though the skill says Minors do not enter it.
  Reason: the weak assertion is the same class of defect that let the multiplication-chart regression
  ship in Task 4 — a test that cannot discriminate. `redirect.test.ts` asserts only that the target
  matches /en/(math|science|english)/, so mapping irregular-verbs → math would still pass. It is a
  ~5-line test change in the same file the fix already touches. Cost if wrong: one extra test edit.
  Minors 4-6 stay deferred to the final review's triage; specifically, Minor 4 (query dropped) is
  declined on the merits as well as deferred — the chart pages read no query parameters, so carrying
  ?utm_* across a redirect adds noise for no reader.

Task 7: fix round 1/5 dispatched (finding 1 important, finding 3 minor-pulled-in).

Task 7: fix round 1/5 reported DONE_WITH_CONCERNS, commit 9fad058. worker suite 19→21,
  full suite 374/68, eslint exit 0, build OK. E2E observed, both methods:
    HEAD legacy → 301 (was 404 before the fix; before/after pair captured)
    GET legacy → 301; all five other slugs → 301 to the correct categories
    POST → 404 and OPTIONS → 204 (correctly NOT redirected)
    bare /en/reference/ and unknown slugs → 404; new path → 200 with H1; /en/typo/ → 404 via
    notFoundBody(); /en/, /en/math/, /tutorial/ → 200
  Run against a throwaway /tmp config because the committed [site] leaves env.ASSETS unbound;
  wrangler.toml untouched as instructed, temp files deleted.

Correction (mine): my fix message predicted 23 worker cases; the true count is 21. I double-counted
  the exact-category test as an addition when it *replaces* the weaker loop (net 0 for that describe,
  +2 for isRedirectableMethod). The implementer caught the discrepancy and chose correctly — keeping
  the weaker loop alongside its strictly-stronger replacement would add no coverage.
  Cost if wrong: nothing; 21 is the right number and the plan's per-file count of 10 is also right.

Good evidence note: the implementer proved the new assertion discriminates by MUTATION — flipping
  irregular-verbs → math failed the new test with `Expected /en/english/… Received /en/math/…` while
  the old regex assertion would have stayed green. That is the demonstration the pulled-in Minor was
  for, and it is stronger than a passing test alone.

Task 7: scoped re-review #1 dispatched (model sonnet).

Task 7: fix round 1/5 (2 addressed, 0 open; commits 36a9eac..9fad058). Re-review #1 clean: all
  findings addressed, no new Critical/Important breakage.
  Confirmed by diff: the GET literal is gone from the redirect path (worker/index.ts:74-76 routes
  through isRedirectableMethod), the gate was NOT over-widened (OPTIONS/POST false, CORS preflight
  branch at :82 still reachable, pinned by tests), the weak regex loop was replaced not duplicated,
  and no out-of-scope file appears (no wrangler.toml, no static-paths, no query-string handling).
  Out-of-scope observation ledged for the final review:
    minor (deferred, RECOMMEND FIX): LEGACY_REFERENCE_CATEGORY[slug] reads inherited object members,
      so the magic slugs toString/constructor/__proto__ return a truthy inherited value and
      /en/reference/toString/ 301s to a garbage target instead of 404ing. No security impact (the
      target itself 404s). One line: Object.hasOwn(...) or a Map. Present since Task 7 round 1, and
      the shape came from the plan.

Task 7: complete (commits 44320ee..9fad058, review clean, 1 fix round)

ALL SEVEN TASKS COMPLETE. Proceeding to the final whole-branch review.

FINAL WHOLE-BRANCH REVIEW (model opus, 4221e7f..9fad058): Ready to merge WITH FIXES.
  0 Critical. 2 Important (both traceable to plan defects of mine). 1 should-fix. 7 Minor.
  Verified independently, not merely asserted: the BlockRenderer exhaustiveness claim reproduced
  in a scratch project (exact TS2366); plan/code divergence in pages.test.ts confirmed by grep;
  all five tables' widths; sitemap 10 English URLs match the 10 prerendered dist/en index files 1:1
  with zero en/reference residue; hub pages 0 ad nodes vs chart page 1; print:hidden count in
  prerendered HTML.
  Important 1: printed chart carries description + intro; spec says 只留 H1 + 数据块. Plan's prose
    said this AND the plan's own code listing contradicted it; the code was believed.
  Important 2: the invariant I wrote into the plan AFTER the code was written was never applied.
    ae454c4's message claimed the guard was "泛化到 en/pages.test.ts" — it was generalized in shape
    but WEAKENED in content: the deleted test asserted non-emptiness AND width, the replacement only
    width. Verified: grep -c "toBeGreaterThan(0)" pages.test.ts = 0.
  Should-fix: LEGACY_REFERENCE_CATEGORY inherited-member lookup (301 to a garbage target for
    toString/constructor/__proto__).
  Notable new Minor: '1 day = 24 h' leaks the English word "day" into the neutral layer, and the
    test that exists to catch exactly that cannot see it because its heuristic is "no alphabetic
    token longer than 3 letters" and "day" is exactly 3 — the heuristic is calibrated to the constant
    it polices.
  Notable new Minor: no invariant ties the dataset's categories to REFERENCE_CATEGORIES, so adding a
    fourth union variant without the array makes prerender emit a 200 "Page not found" page that also
    lands in sitemap.xml — a soft-404 factory, the exact outcome spec Section 2 exists to prevent.
  Escalated for the user: AD_SLOTS placeholder '0000000000' is live in dist/ today (confirmed on the
    chart page and on dist/knowledge/p-mor-010/), i.e. every page ships an <ins> with an invalid slot.

FINAL FIX WAVE: dispatched (one dispatch, model sonnet) covering I1, I2, I3, M1-M4, M6, M7 plus M5.

FINAL FIX WAVE: reported DONE, commit 8a4257c, all ten findings (I1, I2, I3, M1-M7). 381 tests /
  68 files, tsc -b exit 0, build 297 pages, eslint exit 0, no lockfile change.
  Evidence: I1 verified in dist/en/math/multiplication-chart/index.html (description and intro <p>
    carry print:hidden; h1 and table do not). I2 guard proven to bite — emptying one table's rows
    fails the new rows.length assertion while the M4 validation case still passed, confirming the
    validator alone missed it. M1 allowlist proven to reject 'day'. M5 completed cleanly (vitest's
    scripts project resolves the worker→src TS import without special config).
  New pre-existing issue reported by the implementer (file untouched by this wave, reproduced in
    isolation): src/data/mastery/qgen/generators.test.ts flakes roughly 1 run in 30 because the
    generator sometimes emits a single option. For the user — not this branch's.

FINAL FIX WAVE re-review: dispatched (model sonnet).

FINAL FIX WAVE re-review: All findings addressed, no new Critical/Important breakage. Ready to merge: Yes.
  All ten verified against the diff and the live data (not just the report): the two unit allowlists
  cover exactly the tokens the real datasets use with no legitimate unit omitted; the M5
  cross-boundary check genuinely compares two independent sources of truth.
  One informational Minor, parked with a ruling below.
  Controller's own final verification at HEAD: 381 tests / 68 files, 297 pages prerendered, tree
  clean, no pnpm-lock.yaml change, zero en/reference residue anywhere in dist/.
  Branch: 25 commits, 55 files, +5371/-330 vs main (4221e7f).

Task 7 / FINAL: minor (parked): worker/lib/redirect.test.ts's M5 cross-check iterates a hardcoded
  six-slug list rather than deriving slugs from LEGACY_REFERENCE_CATEGORY, so a spurious ADDED entry
  in the worker map would go unnoticed. Ruling: park — the map is a frozen historical literal that
  the plan documents as closed forever, so an added entry is not a live scenario, and the check as
  written does catch the realistic failures (dataset rename, category change, map deletion).
  Cost if wrong: a future edit that adds a seventh legacy slug with a wrong category would not be
  caught by this test; it would still be caught by the per-slug exact assertions above it.

BRANCH FINISHED — Option 1 (merge locally). feat/english-seo-ads fast-forwarded into main at
  3e2c08c; suite re-verified green ON THE MERGED RESULT (381 tests / 68 files), build 297 pages,
  tsc clean; feature branch deleted. Normal repo, so no worktree cleanup needed.
  Note for the user: main was already 4 commits ahead of origin/main before this merge, so the push
  is theirs to make.
