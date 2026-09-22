#!/bin/bash
# Soonpage - Local dev server
# Usage: ./dev-server.sh [port]
#   port    default: 8000
#
# This project is a single static HTML page (no build step, no server-side
# config), so there's no DEV_MODE/production split to toggle - this script
# just serves the repo root over HTTP so index.html can be opened without
# hand-configuring a static server each time.
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"

case "$PORT" in
    ''|*[!0-9]*) echo "Port must be numeric" >&2; exit 1 ;;
esac

echo "Serving $DIR at http://127.0.0.1:$PORT"

if command -v php >/dev/null 2>&1; then
    php -S "127.0.0.1:$PORT" -t "$DIR"
elif command -v python3 >/dev/null 2>&1; then
    python3 -m http.server "$PORT" --directory "$DIR" --bind 127.0.0.1
else
    echo "Neither php nor python3 found on PATH - install one to run a local server." >&2
    exit 1
fi
