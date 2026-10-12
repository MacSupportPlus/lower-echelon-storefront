# Lower Echelon Worldwide storefront

A custom online store for **Lower Echelon Worldwide**, an NYC streetwear brand, built to replace an aging WooCommerce site. Built by [Jason McElvain](https://github.com/MacSupportPlus).

**Live preview:** https://lower-echelon-worldwide.lowerechelon.workers.dev

![Lower Echelon storefront homepage](docs/screenshot.jpg)

## What it does
- Storefront with a motion-heavy design: drop gallery, product pages with size and color variants, and a slide-out cart
- Owner-only admin panel at `/admin` to edit products, prices, per-size stock, photos, and visibility, and to view orders
- Every page reads the live catalog, so the owner's edits show up immediately without a redeploy

## Stack
Next.js (App Router) · TypeScript · Tailwind · GSAP + Lenis + Motion · Zustand · Postgres on Neon · Kysely · Prisma (schema and migrations only) · Cloudflare Workers via OpenNext · bcryptjs

## The interesting problem
Prisma's query engine can't run inside a Cloudflare Workers isolate. The native engine can't run there at all, the WASM engine is blocked by the runtime, and the OpenNext bundler drops the WASM file. So Prisma stays the single source of truth for the **schema and migrations**, `prisma-kysely` generates typed tables from it, and all **runtime queries go through Kysely over Neon's HTTP driver**. No query engine ships to the edge. This was verified end to end in the real `workerd` runtime, not just Node.

Bundle size is about 1.2 MB gzipped, under the Workers free-plan limit.

## Run it locally
```bash
npm install
# .env.local (never committed):
#   DATABASE_URL=postgres://...      your Neon connection string
#   ADMIN_EMAIL=...  ADMIN_PASSWORD=...   used once by the seed to create the admin user
npx prisma migrate deploy
npx tsx prisma/seed/seed.ts
npm run dev          # Node dev server
npm run preview      # build and run in the real Cloudflare workerd runtime
```

## Status
In active development. Stripe Checkout and the domain cutover are next. This public copy is a snapshot for portfolio purposes; client planning notes live in a private repo.
