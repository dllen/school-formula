#!/bin/bash
# pi-agent-edu launcher
#
# Usage:
#   ./pi-agent-edu.sh              # new session
#   ./pi-agent-edu.sh --continue   # resume last session
#   ./pi-agent-edu.sh --sessions    # list sessions
#   ./pi-agent-edu.sh --new         # force new session
#
# Requirements:
#   - Node.js 18+
#   - npm install (dependencies installed)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PI_AGENT_DIR="$SCRIPT_DIR"

# Check if dependencies are installed
if [ ! -d "$PI_AGENT_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    cd "$PI_AGENT_DIR" && npm install
fi

# Run with tsx
cd "$PI_AGENT_DIR"
exec npx tsx index.ts "$@"
