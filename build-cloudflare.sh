#!/bin/bash
set -e

echo "=== Cloudflare Pages Build Script ==="

# Install deps
pnpm install --no-frozen-lockfile

# Build movia-immo (the nice branch app)
pnpm --filter @workspace/movia-immo run build

# Copy output to /dist for Cloudflare
mkdir -p dist
cp -r artifacts/movia-immo/dist/public/* dist/

echo "=== Build complete ==="
