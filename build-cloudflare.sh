#!/bin/bash
set -e

echo "=== Cloudflare Pages Build Script ==="

# Install deps without frozen lockfile (overrides the CF default)
pnpm install --no-frozen-lockfile

# Build only the frontend
pnpm --filter @workspace/dar-listings run build

echo "=== Build complete ==="
