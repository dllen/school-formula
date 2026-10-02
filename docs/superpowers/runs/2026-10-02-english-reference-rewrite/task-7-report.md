# Task 7 Report: Worker 旧 URL 301 与 `/en/` 真 404

## Status: DONE_WITH_CONCERNS

---

## What I implemented

Two independent Worker behaviours, exactly as specified in the brief:

1. **Legacy `/en/reference/<slug>/` → 301 to the new category-nested URL.**
   - `worker/lib/redirect.ts` gains `legacyReferenceRedirect(url: URL): string | null`
     plus the frozen literal `LEGACY_REFERENCE_CATEGORY` (all six slugs), with the
     comment explaining why it is a literal and deliberately not imported from
     `src/data/reference`.
   - Regex `/^\/en\/reference\/([^/]+)\/?$/` matches both trailing-slash and
     non-slash forms; unknown slug → `null`; non-legacy prefix → `null`.

2. **SPA-fallback suppression under the prerendered `/en/` surface.**
   - `worker/lib/static-paths.ts` gains the literal `PRERENDERED_SURFACES = ['/en']`
     and `isPrerenderedSurface()`; `assetCandidates('/en/...')` now returns a single
     candidate (`<dir>/index.html`) with no `/index.html` app-shell fallback.
     The Chinese app keeps the two-candidate fallback unchanged.
   - `worker/index.ts`: redirect wiring becomes
     `legacyReferenceRedirect(url) ?? legacyViewRedirect(url)`, and the
     `serveStatic` terminal 404 body is now a small HTML page (`notFoundBody()`)
     instead of plain text — deliberately not the app shell, so a missing
     `/en/` asset is a genuine 404 rather than a 200 soft-404.

### Brief deviation (one, deliberate)

The brief's Step 13 commit message included a `.gitignore` paragraph
("顺手把 .superpowers/ 加进 .gitignore"). **That entry is already committed** —
`.gitignore` already contains `.superpowers/` with that exact comment, and
`git status` shows `.gitignore` unmodified. Committing the paragraph would have
described a change not in the commit, so I dropped it and staged only the five
`worker/` files.

---

## What I tested and results

| Command | Result |
|---|---|
| `./node_modules/.bin/vitest run worker/lib/redirect.test.ts worker/lib/static-paths.test.ts` | 2 files, **14 passed** (redirect 8, static-paths 6) |
| `./node_modules/.bin/vitest run worker/` | 3 files, **19 passed** |
| `npm test` (full suite) | **Test Files 68 passed (68) — Tests 372 passed (372)** |
| `./node_modules/.bin/eslint worker/` | exit 0, no output |
| `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit` | exit 0 |
| `npm run build` | success — `prerendered 297 pages (+ robots.txt, sitemap.xml)` |

Full-suite summary line:
`Test Files  68 passed (68)` / `Tests  372 passed (372)`

(The full suite prints happy-dom `DOMException [AbortError]` teardown noise on
stderr; it is pre-existing and unrelated — the worker tests run in the `scripts`
project and are unaffected.)

`redirect.test.ts` has 8 cases (2 `hostRedirect` + 3 `legacyViewRedirect` +
3 `legacyReferenceRedirect`) — matches the brief's stated expectation.

---

## TDD Evidence

### RED

Command:
`./node_modules/.bin/vitest run worker/lib/redirect.test.ts worker/lib/static-paths.test.ts`

Output (excerpt):
```
FAIL  |scripts| worker/lib/redirect.test.ts > legacyReferenceRedirect > ignores paths outside the legacy prefix
TypeError: legacyReferenceRedirect is not a function
 ❯ worker/lib/redirect.test.ts:59:7

FAIL  |scripts| worker/lib/static-paths.test.ts > assetCandidates > does not fall back to the app shell under the prerendered /en/ surface
AssertionError: expected [ …(2) ] to deeply equal [ Array(1) ]

- Expected
+ Received

  [
    "/en/math/multiplication-chart/index.html",
+   "/index.html",
  ]
 ❯ worker/lib/static-paths.test.ts:21:62

 Test Files  2 failed (2)
      Tests  4 failed | 10 passed (14)
```

Why expected: `legacyReferenceRedirect` did not exist yet (the three new
redirect cases fail with `TypeError: ... is not a function`), and
`assetCandidates` still returned the two-candidate app-shell fallback for `/en/`
paths. This is precisely the two behaviours the task adds.

### GREEN

Command: `./node_modules/.bin/vitest run worker/`

```
 Test Files  3 passed (3)
      Tests  19 passed (19)
```

Followed by `npm test` → `Test Files 68 passed (68)` / `Tests 372 passed (372)`.

---

## End-to-end results

`npm run build` succeeded, then the Worker was started and probed.
**Important environment caveat** (see "Concerns"): under the repo's committed
`wrangler.toml` the `env.ASSETS` binding is **not** bound by `wrangler dev`, so
no static file is served at all (even a real `dist/assets/*.js` and
`robots.txt` returned 404). I confirmed the two behaviours live by running
`wrangler dev` against a **throwaway config in `/tmp`** that wires
`[assets] directory = "<repo>/dist" binding = "ASSETS"`, then deleted it. No
repo config file was modified. A Worker log line is shown for each check to
prove the UserWorker produced the response.

| # | Command | Expected | Observed |
|---|---|---|---|
| 1 | `curl -s http://localhost:8787/en/reference/multiplication-chart/` (GET) | 301 → `/en/math/multiplication-chart/` | **301**, `location: http://localhost:8787/en/math/multiplication-chart/` ✅ |
| 1b | `curl -sI http://localhost:8787/en/reference/multiplication-chart/` (HEAD — **the brief's literal `curl -sI` form**) | brief says 301 | **404** ❌ (see Concerns — the redirect is GET-gated per the brief's own Step 9 code) |
| 2 | `curl -sI http://localhost:8787/en/math/multiplication-chart/` | 200 | **200** ✅ |
| 3 | `curl -s http://localhost:8787/en/math/multiplication-chart/ \| grep -c "Multiplication Chart (1–12)"` | ≥ 1 | **6** ✅ |
| 4 | `curl -sI http://localhost:8787/en/typo/` | 404 | **404** ✅ |
| 4b | `curl -s http://localhost:8787/en/typo/` — response body | genuine 404 body, not the app shell | body matches the Worker's own `notFoundBody()` marker `This page does not exist. <a href="/en/">` — **matches = 1** ✅ (proves the Worker, not the asset layer, produced the 404) |
| 5 | `curl -sI http://localhost:8787/en/` | 200 | **200** ✅ |
| 6 | `curl -sI http://localhost:8787/tutorial/` | 200 | **200** ✅ |
| 7 | `curl -sIL http://localhost:8787/unknown` (extra: Chinese app-shell fallback preserved) | must not become 404 | **307 → 200** ✅ |
| 8 | `curl -sIL http://localhost:8787/knowledge/p-math-1/` (extra: Chinese deep path) | must not become 404 | **307 → 200** ✅ |

Checks 1–6 are the brief's list; 7–8 are extras I added to confirm the Chinese
fallback is genuinely untouched end-to-end. Worker log confirming the
UserWorker handled them:

```
[wrangler:inf] GET  /en/reference/multiplication-chart/ 301 Moved Permanently
[wrangler:inf] HEAD /en/math/multiplication-chart/      200 OK
[wrangler:inf] GET  /en/math/multiplication-chart/      200 OK
[wrangler:inf] HEAD /en/typo/                           404 Not Found
[wrangler:inf] GET  /en/typo/                           404 Not Found
[wrangler:inf] HEAD /en/                                200 OK
[wrangler:inf] HEAD /tutorial/                          200 OK
```

The 307s in checks 7–8 come from wrangler-dev's asset-layer trailing-slash
normalisation (introduced by my temporary `[assets]` config); `grep -rn 307 worker/`
is empty — the Worker itself emits only 301. Both resolve to 200, so the Chinese
fallback behaviour is preserved.

`dist/` structure verified before probing: `dist/en/`, `dist/en/{math,science,english}/`,
`dist/en/math/multiplication-chart/index.html` all present; `dist/en/typo/` absent;
`grep -c "en/reference" dist/sitemap.xml` → **0**; sitemap lists all 10 English URLs.

---

## Files changed

Committed in `36a9eac` (5 files, +106 −4, all under `worker/`):

- `worker/index.ts`
- `worker/lib/redirect.ts`
- `worker/lib/redirect.test.ts`
- `worker/lib/static-paths.ts`
- `worker/lib/static-paths.test.ts`

---

## Lockfile / working-tree cleanliness

`git status --short` after the commit:
```
?? .freebuff/
```
No `pnpm-lock.yaml` (or any other lockfile) change. `.freebuff/` was already
untracked at session start and is untouched by me. `dist/` and `dist-ssr/` are
gitignored, so the build left no tracked changes. Temp files
(`/tmp/wrangler-e2e.toml`, `/tmp/wrangler-e2e.log`, `/tmp/wrangler-dev.log`)
were deleted; the Worker processes were stopped and port 8787 confirmed closed.

---

## Self-review findings

- **Completeness** ✅ — both behaviours implemented; `legacyReferenceRedirect`
  test iterates all six legacy slugs, and the literal map contains all six.
- **Fidelity** ✅ — the legacy map is a literal in `worker/lib/redirect.ts` with
  no `src/` import. I verified the comment's claim: `tsconfig.app.json` includes
  only `["src"]` and `tsconfig.node.json` only `["vite.config.ts"]`, so `worker/`
  really is in no tsconfig `include`. Chinese fallback untouched, with the
  regression test `keeps the app-shell fallback for the Chinese app` present and
  passing.
- **Discipline** ✅ — diff is only `worker/` files; no extra redirects, no extra
  surfaces, no unrelated refactors.
- **Verification** ✅ — curl checks actually run; statuses reported as observed.
- **Testing** ✅ — tests assert real behaviour; the two new `static-paths`
  assertions are the discriminating ones (a `/en/` directory must yield exactly
  one candidate).

## Concerns

1. **The brief's check 1 command contradicts the brief's own Step 9 code.**
   `curl -sI` sends **HEAD**, but Step 9 specifies the redirect is gated on
   `request.method === 'GET'` (mirroring the pre-existing `legacyViewRedirect`).
   So the brief's `curl -sI .../en/reference/multiplication-chart/` returns 404,
   not the "expected" 301. The redirect itself is correct and confirmed by GET
   (check 1). I did **not** change the method gate, because the brief is explicit
   about the exact code and the constraint says to use the brief's exact values —
   but flagging it: if 301-on-HEAD matters for crawlers, that is a follow-up.

2. **Pre-existing, out of scope: `env.ASSETS` is unbound under the committed
   config.** `wrangler.toml` declares `[site] bucket = "./dist"` (Workers Sites,
   which binds `__STATIC_CONTENT`), while `worker/index.ts` calls
   `env.ASSETS.fetch(...)` — introduced in commit `e9c3316`, an earlier task in
   this same plan. Under `wrangler dev` with the committed config, **every**
   static request 404s (real assets, `robots.txt`, all pages), so no E2E static
   result is observable and production static serving looks broken too. This is
   outside my task (`wrangler.toml` is not a `worker/` file, and the constraint
   scopes my diff to `worker/`), so I left it alone and worked around it only for
   verification with a throwaway `/tmp` config. It should be fixed in a follow-up
   (switch `[site]` to `[assets]`, or read from `__STATIC_CONTENT`).

---

# Fix round 1

Commit: **`9fad058`** `fix(worker): HEAD 与 GET 一样跳转旧地址，修正 RFC 9110 §9.3.2 违规`
(3 files, all `worker/`, +40 −16)

## Finding 1 — GET-only gate broke HEAD (fixed)

Extracted the method decision into a pure, testable function and used it at the
call site:

- `worker/lib/redirect.ts` gains the named export `isRedirectableMethod(method: string): boolean`
  (`GET` / `HEAD` → true; else false), with the Chinese comment citing RFC 9110 §9.3.2.
- `worker/index.ts` now decides via `isRedirectableMethod(request.method)` instead of
  `request.method === 'GET'`. `hostRedirect` is untouched, and the redirect chain
  order is unchanged (`hostRedirect(url) ?? legacyRedirect`).

This also makes the pre-existing `/?view=` legacy redirect HEAD-correct, as you noted.

## Finding 2 — category assertion could not discriminate (fixed)

Replaced `covers every chart that existed before the move` (the regex-shape loop)
with `maps every legacy slug to its exact category`, which pins all six
slug→category→target triples exactly. The old assertion would pass if a slug were
mapped to the wrong category; the new one cannot.

**Verified the new assertion actually discriminates** (mutation check): I
temporarily flipped `'irregular-verbs': 'english'` → `'math'` in
`worker/lib/redirect.ts`, ran the test, observed it fail, then reverted.
The mutated URL still matched the old regex, so the old test would have stayed
green — confirming the new one catches the bug the old one appeared to guard:

```
× maps every legacy slug to its exact category
AssertionError: expected 'https://syy.global/en/math/irregular-…'
                to be 'https://syy.global/en/english/irregul…'
Expected: "https://syy.global/en/english/irregular-verbs/"
Received: "https://syy.global/en/math/irregular-verbs/"
 Tests  1 failed | 9 passed (10)
```
Reverted immediately; `grep 'irregular-verbs'` back to `'english'`.

## TDD evidence (fix round)

### RED

Command: `./node_modules/.bin/vitest run worker/lib/redirect.test.ts`

```
FAIL |scripts| worker/lib/redirect.test.ts > isRedirectableMethod > redirects both GET and HEAD ...
TypeError: isRedirectableMethod is not a function
 ❯ worker/lib/redirect.test.ts:70:12
FAIL |scripts| worker/lib/redirect.test.ts > isRedirectableMethod > leaves other methods alone
TypeError: isRedirectableMethod is not a function
 ❯ worker/lib/redirect.test.ts:75:12

 Test Files  1 failed (1)
      Tests  2 failed | 8 passed (10)
```

Why expected: `isRedirectableMethod` did not exist yet. **As you predicted, the
exact-category test passed already** (8 passed = 2 hostRedirect + 3 legacyViewRedirect
+ 3 legacyReferenceRedirect, the new exact-category one among them) — the map was
already correct, so this change buys discriminating power, not a behaviour fix.
That is exactly why I added the mutation check above as the real evidence.

### GREEN

Command: `./node_modules/.bin/vitest run worker/`
```
 Test Files  3 passed (3)
      Tests  21 passed (21)
```

### Test-count note (discrepancy vs your expected 23)

You predicted `19 + 4 = 23`. Observed is **21**. Arithmetic: the exact-category
test *replaces* the non-discriminating loop (net 0, not +1 — keeping the weak test
alongside would have been redundant paperwork), and `isRedirectableMethod` adds 2,
so `19 + 2 = 21`. `npm test` accordingly moved 372 → 374 (net +2). If you did want
the old loop retained as well, say so and I will re-add it, but I judged it strictly
weaker than its replacement.

## Full-suite / lint / build (fix round)

| Command | Result |
|---|---|
| `./node_modules/.bin/vitest run worker/` | 3 files, **21 passed** |
| `npm test` | **Test Files 68 passed (68) — Tests 374 passed (374)** |
| `./node_modules/.bin/eslint worker/` | exit 0, no output |
| `npm run build` | success — `prerendered 297 pages (+ robots.txt, sitemap.xml)` |

## End-to-end results (fix round)

Same throwaway `/tmp` `[assets]` config as round 1 (the committed `[site]` config
still leaves `env.ASSETS` unbound — unchanged, and you asked me not to touch
`wrangler.toml`). Both methods verified this time.

| # | Command | Expected | Observed |
|---|---|---|---|
| 1 | `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8787/en/reference/multiplication-chart/` (GET) | 301 | **301** ✅ |
| 2 | `curl -sI -o /dev/null -w '%{http_code}\n' http://localhost:8787/en/reference/multiplication-chart/` (**HEAD — the check that failed before**) | 301 | **301** ✅ |
| 2b | `location` header of the HEAD response | `.../en/math/multiplication-chart/` | `Location: http://localhost:8787/en/math/multiplication-chart/` ✅ |
| 3 | HEAD each of the other five legacy slugs | 301 to the right category | `squares-cubes-roots` → `/en/math/` · `trigonometric-identities` → `/en/math/` · `metric-conversions` → `/en/math/` · `physics-constants` → `/en/science/` · `irregular-verbs` → `/en/english/` — all **301** ✅ |
| 4 | `curl -s -X POST .../en/reference/multiplication-chart/` | not redirected | **404** (not 301) ✅ |
| 5 | `curl -s -X OPTIONS .../en/reference/multiplication-chart/` | not redirected | **204** (CORS preflight, not 301) ✅ |
| 6 | `HEAD /en/reference/multiplication-chart` (no trailing slash) | 301 | **301** ✅ |
| 7 | `HEAD /en/reference/` (bare) | not redirected | **404** ✅ |
| 8 | `HEAD /en/reference/nope/` (unknown slug) | not redirected | **404** ✅ |
| 9 | `HEAD /en/math/multiplication-chart/` | 200 | **200** ✅ |
| 10 | `grep -c "Multiplication Chart (1–12)"` on the new path | ≥ 1 | **6** ✅ |
| 11 | `HEAD /en/typo/` | 404 with the Worker's own body | **404**, body matches `notFoundBody()` ✅ |
| 12 | `HEAD /en/`, `HEAD /en/math/` | 200 | **200**, **200** ✅ |
| 13 | `HEAD /tutorial/` (Chinese fallback unchanged) | 200 | **200** ✅ |

**The HEAD check, before and after** (the number you asked for):

| | HEAD `…/en/reference/multiplication-chart/` |
|---|---|
| Before (round 1, GET-only gate) | **404** |
| After (`9fad058`, GET+HEAD) | **301** |

Worker was stopped afterwards (port 8787 confirmed closed) and the `/tmp` config
log deleted.

## Files changed (fix round)

- `worker/index.ts`
- `worker/lib/redirect.ts`
- `worker/lib/redirect.test.ts`

`git status --short` after the commit: only the pre-existing untracked `.freebuff/`.
**No `pnpm-lock.yaml` change.**

## Not touched, per your instruction

`wrangler.toml` / the `env.ASSETS` mismatch (tracked for the human);
`legacyReferenceRedirect` still drops the query string (declined on the merits);
`notFoundBody()` left English-only; the two untested boundary cases left alone.

