# Workspace

## Overview

Dar Listings — a Moroccan real estate marketplace inspired by mubawab.ma. French-language UI with property listings (apartments, villas, riads, lands, commercial, offices) for sale or rent across Moroccan cities.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TanStack Query + wouter + Tailwind v4 + framer-motion + react-hook-form

## Artifacts

- `artifacts/dar-listings` — React + Vite frontend (preview path `/`).
- `artifacts/api-server` — Express API server (preview path `/api`).

## Pages

- `/` — Home with hero search, featured listings, popular cities, recent listings, marketing strip.
- `/recherche` — Filterable listing grid (transaction, type, city, bedrooms, sort).
- `/annonce/:id` — Listing detail with image gallery, specs, description, contact form, similar listings.
- `/publier` — Form to publish a new listing.
- `/villes` — City directory with cover images and counts.
- `/a-propos` — Brand page.

## Data model

- `listings` — id, title, description, transaction (sale|rent), propertyType, price (MAD), city, neighborhood, bedrooms, bathrooms, area, images[], features[], contact info, featured, lat/lng.
- `inquiries` — id, listingId, name, email, phone, message.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-listings` — seed sample listings (clears table first)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
