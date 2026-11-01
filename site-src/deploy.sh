#!/usr/bin/env bash
# Kept for convenience; the cross-platform version is `npm run deploy` (tools/deploy.mjs).
set -euo pipefail
cd "$(dirname "$0")"
npm ci
npm run deploy
