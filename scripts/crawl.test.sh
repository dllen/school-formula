#!/bin/bash
# scripts/crawl.test.sh —— smoke test for crawl.sh
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS=0
FAIL=0
check() {
  local desc="$1"
  local expected_exit=$2
  shift 2
  "$@" >/dev/null 2>&1
  local actual_exit=$?
  if [[ $actual_exit -eq $expected_exit ]]; then
    echo "  ✓ $desc"
    PASS=$((PASS+1))
  else
    echo "  ✗ $desc (expected $expected_exit, got $actual_exit)"
    FAIL=$((FAIL+1))
  fi
}

echo "[test] --help exits 0"
check "help exits 0" 0 bash scripts/crawl.sh --help

echo "[test] --dry-run writes a report file"
rm -rf staging/
bash scripts/crawl.sh --dry-run >/dev/null 2>&1
if ls staging/crawl-report-*.json >/dev/null 2>&1; then
  echo "  ✓ report file exists"
  PASS=$((PASS+1))
else
  echo "  ✗ report file missing"
  FAIL=$((FAIL+1))
fi

echo "[test] unknown flag exits 2" 
check "unknown flag exits 2" 2 bash scripts/crawl.sh --bogus

echo "[test] PASS=$PASS FAIL=$FAIL"
# cleanup test staging
rm -rf staging/
exit $FAIL
