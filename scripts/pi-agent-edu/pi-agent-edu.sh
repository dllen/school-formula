#!/bin/bash
# pi-agent-edu launcher
#
# Usage:
#   ./pi-agent-edu.sh              # interactive mode (new or resume)
#   ./pi-agent-edu.sh --sessions   # list saved sessions
#   ./pi-agent-edu.sh --continue   # resume last session
#   ./pi-agent-edu.sh --continue <id>  # resume specific session
#   ./pi-agent-edu.sh --new       # force new session
#
# Requirements:
#   - Node.js 18+
#   - pi CLI installed (https://pi.dev)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check pi is available
if ! command -v pi &> /dev/null; then
    echo "Error: pi CLI not found in PATH"
    echo ""
    echo "Please install pi agent first:"
    echo "  npm install -g @pi-kit/pi"
    echo "  or visit https://pi.dev"
    exit 1
fi

# Run the interactive CLI
cd "$SCRIPT_DIR"
exec npx tsx index.ts "$@"
