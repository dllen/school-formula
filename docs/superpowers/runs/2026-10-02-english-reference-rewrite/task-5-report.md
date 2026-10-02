# Task 5 Report: URL 分层与 hub 页

**Status:** DONE
**Commit:** `dcfc621` — feat(reference): URL 分层到学科，新增学科 hub 页

## What was implemented

The `/en/` English surface moved from flat URLs to category-nested URLs and gained three subject hubs.

- `/en/` (`ReferenceIndex`) now renders three subject cards (Math / Science / English) instead of a list of every chart.
- `/en/math/`, `/en/science/`, `/en/english/` are subject hubs (`ReferenceCategory`) listing that category's charts, with the category name as H1 and `CATEGORY_COPY[...].intro` as the lead paragraph and meta description.
- Chart pages moved from `/en/reference/:slug` to `/en/:category/:slug`; the breadcrumb gained the category level between "All charts" and the chart title; the small corner badge now shows the display name instead of the raw lowercase category.
- `referencePath` is now two-argument: `referencePath(category, slug)`.
- A slug whose category does not match the URL category (e.g. `/en/math/irregular-verbs/`) renders the not-found state, so one page cannot exist at two URLs. Same for unknown categories (`/en/legacy/...`).

## What was tested and results

Per-step targeted runs are in the TDD evidence below.

- `./node_modules/.bin/tsc -b` → clean, exit 0.
- `npm test` → **`Test Files 68 passed (68)`, `Tests 366 passed (366)`**. No test files skipped.
  - The trailing `DOMException [AbortError]` lines on stderr are pre-existing happy-dom teardown noise from the stubbed AdSense fetch; they are not failures and predate this task.
- `./node_modules/.bin/eslint src/` → no output (clean).
- `npm run build` → succeeded; `prerendered 297 pages (+ robots.txt, sitemap.xml)`.
  - Build emitted `No routes matched location "/en/math/"` (and `/en/science/`, `/en/english/`). This is the deliberate intermediate state: the hub paths are in `ENGLISH_ROUTE_PATHS` (hence in `PRERENDER_PATHS`) but the hub route is wired into the router in Task 6, not here. The hub HTML files still get the correct SEO `<title>` from `content-en.ts`.

### `dist/en/` listing (all `index.html`)

```
dist/en/index.html
dist/en/math/index.html
dist/en/math/metric-conversions/index.html
dist/en/math/multiplication-chart/index.html
dist/en/math/squares-cubes-roots/index.html
dist/en/math/trigonometric-identities/index.html
dist/en/science/index.html
dist/en/science/physics-constants/index.html
dist/en/english/index.html
dist/en/english/irregular-verbs/index.html
```

`dist/en/` top level is `english/ index.html math/ science/` — the three hubs exist and the old `dist/en/reference/` directory is gone. The chart page HTML carries the real H1 (`<h1 ...>Multiplication Chart (1–12)</h1>`); the hub pages carry the correct `<title>Math Reference Charts - Shiyiyuan Study Reference</title>` but an empty `#root`, as expected until Task 6 wires the route.

## TDD Evidence

**`src/reference-routes.test.ts`** (rewritten)
- RED: `./node_modules/.bin/vitest run src/reference-routes.test.ts` → `Test Files 1 failed (1)`, `Tests 6 failed (6)`, incl. `TypeError: categoryPath is not a function` and `referencePartsForAppPath is not a function`. Expected: these exports do not exist in the Task-4 route table.
- GREEN: same command → `Test Files 1 passed (1)`, `Tests 6 passed (6)`.

**`src/components/reference/ReferenceCategory.test.tsx`** (new)
- RED: `./node_modules/.bin/vitest run src/components/reference/ReferenceCategory.test.tsx` → `Failed to resolve import "./ReferenceCategory" from "src/components/reference/ReferenceCategory.test.tsx". Does the file exist?`. Expected: the component does not exist yet.
- GREEN: same command → `Test Files 1 passed (1)`, `Tests 4 passed (4)`.

**`src/components/reference/ReferenceIndex.test.tsx`** (new)
- RED: `./node_modules/.bin/vitest run src/components/reference/ReferenceIndex.test.tsx` → `Test Files 1 failed (1)`, `Tests 1 failed | 2 passed (3)`; `links to each of the three category hubs` failed because the old index lists individual charts, so `links()` contained no `/en/math/` or `/en/english/`.
- GREEN: same command → `Test Files 1 passed (1)`, `Tests 3 passed (3)`.

**`src/components/reference/ReferencePage.test.tsx`** (rewritten)
- The brief's order implements the source change (Step 10) before rewriting the test (Step 11), so the suite was already green when the rewritten test first ran: `Tests 8 passed (8)`. To prove the new cross-category guard is genuinely load-bearing rather than tautological, I temporarily neutralised it (`candidate.category === candidate.category`) and re-ran:
  - RED: `404s when the slug belongs to a different category` → `AssertionError: expected 'Irregular Verbs' to be 'Page not found'` (`Tests 1 failed | 7 passed`).
  - Guard restored → `Tests 8 passed (8)`.

## Files created and modified

Created:
- `src/data/reference/en/categories.ts`
- `src/components/reference/ReferenceCategory.tsx`
- `src/components/reference/ReferenceCategory.test.tsx`
- `src/components/reference/ReferenceIndex.test.tsx`

Modified:
- `src/reference-routes.ts`
- `src/reference-routes.test.ts`
- `src/seo/content-en.ts`
- `src/seo/meta.test.ts`
- `src/prerender/routes.test.ts`
- `src/components/reference/ReferencePage.tsx`
- `src/components/reference/ReferencePage.test.tsx`
- `src/components/reference/ReferenceIndex.tsx`
- `src/components/reference/RelatedCharts.tsx`
- `src/entry-server.test.tsx`
- `src/App.test.tsx`
- `src/ads/adPlacements.test.tsx`

`src/App.tsx` is intentionally untouched. `src/i18n/languages.test.ts` and `src/prerender/inject.test.ts` were not touched and pass.

## The five test files updated — exact path change

| File | Path change |
|---|---|
| `src/seo/meta.test.ts` | `canonicalUrl('/en/reference/multiplication-chart')` → `/en/math/multiplication-chart`; chart loop `/en/reference/${slug}` → `/en/${category}/${slug}` (title/description/canonical/alternates assertions unchanged) |
| `src/prerender/routes.test.ts` | `toContain('/en/reference/multiplication-chart/')` → four `toContain` assertions for `/en/math/`, `/en/science/`, `/en/english/`, `/en/math/multiplication-chart/`; length + no-duplicates assertions unchanged |
| `src/entry-server.test.tsx` | `render('/en/reference/multiplication-chart')` → `render('/en/math/multiplication-chart')` (same `toContain('Multiplication Chart')`) |
| `src/App.test.tsx` | case renamed to `... at /en/:category/:slug`; `renderApp('/en/reference/multiplication-chart')` → `/en/math/multiplication-chart`; H1 assertion per brief now `toBe('Multiplication Chart (1–12)')`. **No hub case added** (Task 6). |
| `src/ads/adPlacements.test.tsx` | route `/en/reference/:slug` → `/en/:category/:slug`, path → `/en/math/multiplication-chart`; ad count assertion unchanged |

Every change is a path/pattern update plus (in meta.test.ts and App.test.tsx only) the brief-specified assertion text. No assertion was loosened, deleted, or weakened.

## Self-review findings

- **Completeness:** all three hub paths are in `ENGLISH_ROUTE_PATHS` (via `REFERENCE_CATEGORIES.map(categoryPath)`); every create/modify in the brief's file list is done, plus `ReferencePage.test.tsx` which Step 11 requires even though the file header list omits it.
- **Boundary held:** `git diff -- src/App.tsx` is empty; `App.test.tsx` contains the updated chart case and no hub case.
- **Discipline:** no extra exports, no stray hub route, exactly one AdUnit on the chart page (unchanged), no refactor beyond the brief.
- **Side effect caught and reverted:** running `npm run lint` triggered an incidental pnpm install that rewrote `pnpm-lock.yaml` (adding already-installed test deps). The initial tree was clean, so I restored it with `git checkout -- pnpm-lock.yaml`; the commit contains no lockfile change.

## Issues / concerns

- **Empty hub shells in `dist/` until Task 6.** The hub paths are prerendered now (correct SEO titles) but render an empty `#root` because the router does not yet have the `ENGLISH_CATEGORY_ROUTE` route. This is the brief's intended intermediate state and Task 6 adds the route. If a reviewer diffs `dist/`, the empty hub HTML is expected, not a regression.
- The `pnpm-lock.yaml` reconciliation described above indicates the committed lockfile is stale relative to `package.json` (test deps present but not recorded). Not in scope for this task; flagging for the controller.
