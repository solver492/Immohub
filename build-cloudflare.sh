#!/bin/bash
set -e

echo "=== Cloudflare Pages Build Script ==="

# Install deps
pnpm install --no-frozen-lockfile

# Build the frontend
pnpm --filter @workspace/dar-listings run build

# Copy output to root dist folder where Cloudflare looks
mkdir -p dist
cp -r artifacts/dar-listings/dist/public/* dist/

echo "=== Build complete ==="
