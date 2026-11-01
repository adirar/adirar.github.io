#!/usr/bin/env bash
# Build the site and copy the output to the repository root, which GitHub Pages serves.
set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SRC")"
cd "$SRC"
npm ci
npm run build
cd "$ROOT"
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name site-src ! -name README.md ! -name .gitignore -exec rm -rf {} +
cp -R "$SRC/dist/." "$ROOT/"
touch "$ROOT/.nojekyll"
