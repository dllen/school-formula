#!/bin/bash
# scripts/extract-data/extract.sh —— 抽取数据 wrapper
#
# Usage:
#   ./extract.sh --list              列出所有 adapter
#   ./extract.sh <adapter> [flags]   跑指定 adapter
#   ./extract.sh --help              帮助

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 18)" -ge 22 ] 2>/dev/null; then
    export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--disable-warning=ExperimentalWarning"
fi

exec node --disable-warning=ExperimentalWarning node_modules/.bin/tsx index.ts "$@"
