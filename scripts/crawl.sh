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

set -o pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$ROOT/.." && pwd)"
cd "$ROOT"

# ---- parse flags ----
EXTRACT=true
INGEST=true
DRY_RUN=false
QUIET=false
NO_CACHE=false
ADAPTERS=("shiji" "zizhi")
SELECTED_ADAPTER=""
EXTRACT_EXTRA=()

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
  if [[ ${#EXTRACT_EXTRA[@]} -gt 0 ]]; then EXTRA+=("${EXTRACT_EXTRA[@]}"); fi
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
    INGEST_RESULTS+=("{\"status\":\"ok\"}")
  else
    EXIT_CODE=$?
    INGEST_RESULTS+=("{\"status\":\"failed\",\"exit\":$EXIT_CODE}")
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
