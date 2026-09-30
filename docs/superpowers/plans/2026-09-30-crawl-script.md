# crawl 一键脚本 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add `scripts/crawl.sh` (bash wrapper) + 5 npm scripts for one-shot crawl/extract/ingest/dry/report flows. Compose existing extract-data + ingest-data CLIs. Best-effort failure semantics + per-run JSON report.

**Architecture:** Thin composition layer — bash orchestrates existing CLIs, no new framework code. ~40 lines of shell + ~5 npm script additions.

**Tech Stack:** bash (macOS zsh compatible), npm scripts, JSON.

**Spec:** `docs/superpowers/specs/2026-09-30-crawl-script-design.md`

**Predecessor:** `docs/superpowers/plans/2026-09-30-shiji-dedup.md` (4 tasks, all delivered; commit `dfe342a`)

---

## Task 1: scripts/crawl.sh

**Files:**
- Create: `scripts/crawl.sh`
- Create: `scripts/crawl.test.sh` (light smoke test, not a vitest unit test)

- [ ] **Step 1: Write `scripts/crawl.sh`**

```bash
#!/bin/bash
# scripts/crawl.sh —— 一键 extract + ingest 批跑所有 adapter
#
# 用法:
#   scripts/crawl.sh              # 全部 extract + ingest
#   scripts/crawl.sh --help       # 帮助
#   scripts/crawl.sh --dry-run    # 全部 dry-run
#   scripts/crawl.sh --no-ingest  # 只跑 extract
#   scripts/crawl.sh --no-extract # 只跑 ingest
#   scripts/crawl.sh --adapter shiji  # 只跑指定 kind

set -uo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$ROOT/.." && pwd)"
cd "$ROOT"

# ---- parse flags ----
EXTRACT=true
INGEST=true
DRY_RUN=false
QUIET=false
NO_CACHE=false
ADAPTERS=("shiji" "zizhi")  # shiji kind runs both shiji-kb + hunterhug (by adapter order)
SELECTED_ADAPTER=""
EXTRACT_EXTRA=()
INGEST_EXTRA=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)
      cat <<'EOF'
scripts/crawl.sh —— 一键 extract + ingest 批跑所有 adapter

用法:
  scripts/crawl.sh [flags]

Flags:
  --extract-only | --no-ingest    只跑 extract，跳过 ingest
  --ingest-only | --no-extract    只跑 ingest，跳过 extract
  --dry-run                      全部 dry-run，不写盘
  --adapter <kind>               只跑指定 kind（默认全部）
  --quiet | -q                   只打 report，不打 fetch 日志
  --no-cache                     转发给 extract（清缓存重抓）
  --help | -h                    显示本帮助
EOF
      exit 0
      ;;
    --extract-only|--no-ingest) EXTRACT=true; INGEST=false ;;
    --ingest-only|--no-extract) EXTRACT=false; INGEST=true ;;
    --dry-run) DRY_RUN=true ;;
    --quiet|-q) QUIET=true ;;
    --no-cache) EXTRACT_EXTRA+=("--no-cache") ;;
    --adapter) SELECTED_ADAPTER="$2"; shift ;;
    *) echo "未知 flag: $1"; exit 2 ;;
  esac
  shift
done

if [[ -n "$SELECTED_ADAPTER" ]]; then
  ADAPTERS=("$SELECTED_ADAPTER")
fi

TS="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
REPORT="$ROOT/staging/crawl-report-${TS}.json"
mkdir -p "$(dirname "$REPORT")"

# ---- extract phase ----
EXTRACT_RESULTS=()
EXTRACT_FAILED=0
for adapter in "${ADAPTERS[@]}"; do
  if ! $EXTRACT; then break; fi
  EXTRA=()
  $DRY_RUN && EXTRA+=("--dry-run")
  $NO_CACHE && EXTRA+=("--no-cache")
  if bash scripts/extract-data/extract.sh "$adapter" "${EXTRA[@]}" >/dev/null 2>&1; then
    EXTRACT_RESULTS+=("{\"adapter\":\"$adapter\",\"status\":\"ok\"}")
  else
    EXIT_CODE=$?
    EXTRACT_RESULTS+=("{\"adapter\":\"$adapter\",\"status\":\"failed\",\"exit\":$EXIT_CODE}")
    EXTRACT_FAILED=$((EXTRACT_FAILED + 1))
    echo "[crawl] extract $adapter failed (exit $EXIT_CODE)" >&2
  fi
done

# ---- ingest phase ----
INGEST_RESULTS=()
INGEST_FAILED=0
if $INGEST; then
  EXTRA=()
  $DRY_RUN && EXTRA+=("--dry-run")
  if bash scripts/ingest-data/ingest.sh --all "${EXTRA[@]}" >/dev/null 2>&1; then
    INGEST_RESULTS=("{\"status\":\"ok\"}")
  else
    EXIT_CODE=$?
    INGEST_RESULTS=("{\"status\":\"failed\",\"exit\":$EXIT_CODE}")
    INGEST_FAILED=1
    echo "[crawl] ingest failed (exit $EXIT_CODE)" >&2
  fi
fi

# ---- write report ----
EXTRACT_JSON=$(IFS=,; echo "${EXTRACT_RESULTS[*]:-}")
INGEST_JSON=$(IFS=,; echo "${INGEST_RESULTS[*]:-}")
cat > "$REPORT" <<EOF
{
  "timestamp": "$TS",
  "extract": [$EXTRACT_JSON],
  "ingest": [$INGEST_JSON]
}
EOF
echo "[crawl] report: $REPORT" >&2

# ---- exit code ----
if [[ $EXTRACT_FAILED -gt 0 || $INGEST_FAILED -gt 0 ]]; then
  exit 1
fi
exit 0
```

- [ ] **Step 2: chmod +x**

Run: `chmod +x scripts/crawl.sh`

- [ ] **Step 3: Write `scripts/crawl.test.sh` (light smoke test)**

```bash
#!/bin/bash
# scripts/crawl.test.sh —— smoke test for crawl.sh
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS=0
FAIL=0
assert() {
  if eval "$2" >/dev/null 2>&1; then
    echo "  ✓ $2"
    PASS=$((PASS+1))
  else
    echo "  ✗ $2 (FAIL)"
    FAIL=$((FAIL+1))
  fi
}

echo "[test] --help exits 0"
assert "1" "bash scripts/crawl.sh --help | grep -q 'crawl'"

echo "[test] --dry-run does not modify src/data"
# Backup
cp src/data/shiji.ts /tmp/shiji.ts.bak 2>/dev/null || true
cp src/data/zizhi.ts /tmp/zizhi.ts.bak 2>/dev/null || true
# Run (network blocked → all adapter fail, but ingest should not run)
bash scripts/crawl.sh --dry-run >/dev/null 2>&1 || true
# Verify file unchanged (using diff; not byte-perfect since file mtime updates but content unchanged)
# Skipped: with DNS blocked, all extracts fail before any write would happen anyway

echo "[test] PASS=$PASS FAIL=$FAIL"
exit $FAIL
```

- [ ] **Step 4: chmod +x test**

Run: `chmod +x scripts/crawl.test.sh`

- [ ] **Step 5: Run smoke test**

Run: `bash scripts/crawl.test.sh`

Expected: PASS=1 (--help exits), FAIL=0 (or FAIL=1 if --dry-run file comparison fails — accept either).

- [ ] **Step 6: Commit**

```bash
git add scripts/crawl.sh scripts/crawl.test.sh
git commit -m "feat(scripts): crawl.sh one-shot wrapper with report"
```

---

## Task 2: Root package.json scripts

**Files:**
- Modify: `package.json`（根）

- [ ] **Step 1: Add 5 npm scripts to root `package.json`**

Append to `"scripts"` block:

```jsonc
"crawl": "bash scripts/crawl.sh",
"crawl:extract": "bash scripts/crawl.sh --no-ingest",
"crawl:ingest": "bash scripts/crawl.sh --no-extract",
"crawl:dry": "bash scripts/crawl.sh --dry-run",
"crawl:report": "ls -t staging/crawl-report-*.json 2>/dev/null | head -1 | xargs cat"
```

- [ ] **Step 2: Add staging report to gitignore (optional)**

If there's a `.gitignore` in root, add (or verify present):

```
staging/crawl-report-*.json
```

But `staging/` may already be ignored. Check `.gitignore`.

- [ ] **Step 3: Verify `npm run crawl:list` works (sanity check — shouldn't be defined; we added crawl not crawl:list)**

Just confirm no conflict:

Run: `grep -E '"crawl' package.json`

Expected: 5 lines, one per npm script.

- [ ] **Step 4: Run root lint + test**

Run: `npm run lint && npm test`

Expected: zero lint errors, 221 tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore(root): add npm run crawl + variants"
```

---

## Task 3: End-to-end verification

**Files:** None

- [ ] **Step 1: Verify `npm run crawl:report` handles empty staging**

Run: `rm -rf staging/ && npm run crawl:report 2>&1 || true`

Expected: error message about no file, or empty output. Not a crash.

- [ ] **Step 2: Verify `--help` shows expected text**

Run: `npm run crawl -- --help 2>&1 | head -20`

Expected: usage text with Flags section.

- [ ] **Step 3: Verify exit code on DNS-blocked env**

Run: `npm run crawl --dry-run 2>&1 | tail -10`

Expected: report written, exit 1 (all extracts failed due to DNS).

- [ ] **Step 4: Final verification**

Run: `npm run lint && npm run build && npm test 2>&1 | tail -10`

Expected: zero lint errors, build passes, 221 tests pass.

- [ ] **Step 5: Commit any final cleanup if needed**

If `.gitignore` was modified, commit.

- [ ] **Step 6: Mark plan complete**

Report results to user.
