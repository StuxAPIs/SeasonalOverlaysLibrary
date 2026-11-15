#!/bin/bash
# Seasonal Overlays Library - Local dev server
# Usage: ./dev-server.sh [port] [--lan]
#   port    default: 8000
#   --lan   listen on all interfaces so phones/tablets on your network can
#           connect (prints the addresses to open); default is 127.0.0.1 only
#
# The library and its demo site are static files (no build step, no server-side
# config), so there's no DEV_MODE/production split to toggle - this script
# just serves the repo root over HTTP without hand-configuring a static server.
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8000
HOST=127.0.0.1

while [ $# -gt 0 ]; do
    case "$1" in
        --lan) HOST=0.0.0.0; shift ;;
        ''|*[!0-9]*) echo "Unknown option: $1" >&2; echo "Usage: ./dev-server.sh [port] [--lan]" >&2; exit 1 ;;
        *) PORT="$1"; shift ;;
    esac
done

if command -v php >/dev/null 2>&1; then
    SERVER=php
elif command -v python3 >/dev/null 2>&1; then
    SERVER=python3
else
    echo "Neither php nor python3 found on PATH - install one to run a local server." >&2
    exit 1
fi

echo "Serving $DIR at http://127.0.0.1:$PORT"
if [ "$HOST" = "0.0.0.0" ]; then
    # This machine's IPv4 addresses (Windows, macOS or Linux), minus loopback
    case "$OSTYPE" in
        msys*|cygwin*|win32*) ADDRS="$(ipconfig | awk -F': *' '/IPv4/{print $2}' | tr -d '\r')" ;;
        darwin*) ADDRS="$(ifconfig | awk '/inet /{print $2}')" ;;
        *) ADDRS="$(hostname -I 2>/dev/null)" ;;
    esac
    echo "On your local network (--lan), open one of these on the other device:"
    for a in $ADDRS; do
        case "$a" in 127.*|'') ;; *) echo "    http://$a:$PORT" ;; esac
    done
    echo "  (usually the 192.168.x.x one; allow $([ "$SERVER" = php ] && echo PHP || echo Python) through the firewall if asked)"
fi

if [ "$SERVER" = php ]; then
    exec php -S "$HOST:$PORT" -t "$DIR"
else
    exec python3 -m http.server "$PORT" --directory "$DIR" --bind "$HOST"
fi
