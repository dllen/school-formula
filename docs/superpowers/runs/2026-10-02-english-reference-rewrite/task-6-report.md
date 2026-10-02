# Task 6 Report: 路由接线

## What I implemented

Two-file diff, exactly as the brief specified:

1. `src/App.tsx` — imported `ReferenceCategory` and `ENGLISH_CATEGORY_ROUTE`, and registered the hub route:
   `<Route path={ENGLISH_CATEGORY_ROUTE} element={<ReferenceCategory />} />` between the existing `ENGLISH_HOME` and `ENGLISH_REFERENCE_ROUTE` entries.
2. `src/App.test.tsx` — added the single hub test case, inserted between the existing English index and chart cases:
   ```tsx
   it('serves an English category hub at /en/:category', () => {
     renderApp('/en/math');
     expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
   });
   ```

The pre-existing chart-path case (`/en/math/multiplication-chart` → `Multiplication Chart (1–12)`) was left exactly as Task 5 left it.

## TDD Evidence

- **RED** — `./node_modules/.bin/vitest run src/App.test.tsx` (test added first, before wiring):
  - `stderr | src/App.test.tsx > App routes > serves an English category hub at /en/:category` → `No routes matched location "/en/math"`
  - `Tests  1 failed | 6 passed (7)`
  - Failure: `TestingLibraryElementError: Unable to find an accessible element with the role "heading"` (only the `LocationProbe` output rendered).
- **GREEN** — same command after wiring the route:
  - `Test Files  1 passed (1)` / `Tests  7 passed (7)`

## Verification

- `./node_modules/.bin/tsc -b` → exit 0.
- `npm test` → `Test Files  68 passed (68)` / `Tests  367 passed (367)`. Output pristine apart from the pre-existing `AbortError` teardown noise from `src/App.test.tsx` (happy-dom fetch abort, unrelated to this change).
- `npm run build` → `prerendered 297 pages (+ robots.txt, sitemap.xml)`.
- `npm run build 2>&1 | grep -c "No routes matched"` → `0` (the hub-shell "No routes matched /en/math/" line is gone).
- `dist/en/` → `english/`, `math/`, `science/`, `index.html`.
- `dist/en/math/` → `metric-conversions/`, `multiplication-chart/`, `squares-cubes-roots/`, `trigonometric-identities/`, `index.html` (5.9K).

### Hub shell now populated (not empty)

From `dist/en/math/index.html`:
- `<title>Math Reference Charts - Shiyiyuan Study Reference</title>`
- `<h1 class="text-3xl font-bold text-[#1F2329]">Math</h1>`
- `#root` inner content ≈ 3133 bytes.

### Sitemap

- `grep -c "en/math/multiplication-chart" dist/sitemap.xml` → `1` (≥ 1)
- `grep -c "en/reference" dist/sitemap.xml` → `0`

## Files changed

- `src/App.tsx` (+7 −1)
- `src/App.test.tsx` (+5 −0)

`git diff --stat`: 2 files changed, 12 insertions(+), 1 deletion(-).

## Confirmation re: lockfile

`git status --short` after commit shows only `?? .freebuff/` (pre-existing untracked directory, present in the initial snapshot before this task). **No `pnpm-lock.yaml` change.**

## Self-review findings

- Completeness: hub route registered AND hub test case added; chart-path case untouched. ✓
- Discipline: diff is exactly two files; nothing extra (no additional routes, no refactor, no stray hub case, no second ad). ✓
- Verification: "No routes matched" build line gone (grep count 0); `dist/en/math/index.html` is populated with title + H1 "Math". ✓

## Issues / concerns

None. Commit is `44320ee`.
