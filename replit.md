# Workspace

## Overview

Immo-hub — a Moroccan real estate marketplace inspired by mubawab.ma. French-language UI with property listings (apartments, villas, riads, lands, commercial, offices) for sale or rent across Moroccan cities.

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
- `/annonce/:id` — Listing detail with image gallery, video embed (YouTube/Vimeo), specs, description, contact form, similar listings.
- `/publier` — Form to publish a new listing (with image upload up to 12 photos as base64 data URLs + optional video URL).
- `/villes` — City directory with cover images and counts.
- `/a-propos` — Brand page.
- `/store` — Immo-hub Store: hero card for the Tablette Pro Immo-hub (offline agency portfolio + direct publish), plus boost products.
- `/estimer`, `/immobilier-neuf`, `/contact`, `/aide`, `/notifications`, `/deconnexion` — secondary pages.
- `/tableau-de-bord/*` — agency dashboard (rapport, annonces, stories, parametres, utilisateurs, abonnement, documents, historique).

## AI Agent (Samsar)

- Floating chatbot widget (`src/components/Samsar.tsx`) on every page, auto-greets visitors after 4s.
- Backend route `POST /api/chat` in `artifacts/api-server/src/routes/chat.ts` calls OpenRouter via the Replit AI Integrations proxy (env vars `AI_INTEGRATIONS_OPENROUTER_BASE_URL` + `AI_INTEGRATIONS_OPENROUTER_API_KEY`, model `openai/gpt-4o-mini`).
- System prompt loads the 40 most recent listings as catalogue context. Two intents: client recommendation and Pro Agence sales pitch (tablette + portfolio + sponsoring).

## Data model

- `listings` — id, title, description, transaction (sale|rent), propertyType, price (MAD), city, neighborhood, bedrooms, bathrooms, area, images[], videoUrl, features[], contact info, featured, lat/lng.
- `inquiries` — id, listingId, name, email, phone, message.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-listings` — seed sample listings (clears table first)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
