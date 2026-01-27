# CLAUDE.md — ShawarmaTrail

## Project Overview
ShawarmaTrail — Interactive map of the best shawarma places in Israel.
Built with Next.js 15 (App Router) + Convex + Mapbox + Tailwind CSS.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Convex (reactive backend — queries, mutations, actions)
- **Maps:** Mapbox GL JS
- **Auth:** Convex Auth (Google + Phone)
- **Hosting:** Vercel (frontend) + Convex Cloud (backend)

## Project Structure
```
shawarma-trail/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Homepage with map
│   │   ├── place/[slug]/ # Individual place page
│   │   └── shawarma/[city]/ # City listing page (SEO)
│   ├── components/       # React components
│   │   ├── Map.tsx
│   │   ├── PlaceCard.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── Filters.tsx
│   │   └── SearchBar.tsx
│   └── lib/              # Utilities
├── convex/               # Convex backend
│   ├── schema.ts         # DB schema
│   ├── places.ts         # Place queries/mutations
│   ├── reviews.ts        # Review queries/mutations
│   ├── users.ts          # User queries/mutations
│   ├── search.ts         # Search & filter logic
│   └── geo.ts            # Geospatial utilities
├── public/               # Static assets
└── PRD.md                # Product Requirements
```

## Commands
- `npm run dev` — Start dev server (Next.js + Convex)
- `npx convex dev` — Convex dev mode (auto-sync)
- `npm run build` — Production build
- `npm run lint` — ESLint

## Code Style
- TypeScript strict mode
- Functional components with hooks
- Hebrew UI text, English code/comments
- Tailwind for all styling (no CSS modules)
- Mobile-first responsive design

## Convex Patterns
- Use `query()` for read operations, `mutation()` for writes
- Use `action()` for external API calls (Mapbox, Google)
- Define all args with `v` validators
- Index frequently queried fields
- Use `searchIndex` for text search

## Key Decisions
- **Geospatial:** Bounding box + Haversine (no PostGIS) — filter by lat/lng range, then calculate exact distance
- **Images:** Convex File Storage for uploads
- **SEO:** Static generation (SSG) for city/region pages
- **RTL:** Full RTL support (Hebrew UI)

## MVP Scope (Phase 1)
1. Interactive map with all places
2. Search & filters (kashrut, meat type, style, price, region)
3. Place detail page with info + reviews
4. User auth + write reviews with ratings
5. Top lists by city/region
6. Mobile responsive + PWA

## DO NOT
- Don't use CSS-in-JS or styled-components
- Don't add features beyond MVP scope without asking
- Don't skip TypeScript types
- Don't hardcode Hebrew strings (use a constants file for i18n readiness)
