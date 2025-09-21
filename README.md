# Daroutes Route CMS + Wiki

Full-stack starter for managing and publishing Dar es Salaam transit routes. Editors work in a secure dashboard backed by Supabase. Public visitors browse a wiki-style catalogue with MapLibre-powered visualizations and JSON APIs ready for downstream consumers.

## Features

- Next.js 14 App Router with TypeScript and Tailwind CSS
- Supabase Postgres + Auth + RLS + Storage integration
- MapLibre GL maps styled with OSM demo tiles
- React Hook Form + Zod validation for all CRUD workflows
- Drag & drop stop ordering, fare matrix editor, attachment uploads
- Public JSON endpoints for route summaries and detail pages
- Ready for Vercel (frontend) and Supabase (backend) deployment

## Getting Started

1. Create a new Supabase project and run the SQL in [`supabase.sql`](./supabase.sql) via the SQL Editor.
2. Copy `.env.example` to `.env.local` and fill in project values.
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Visit `http://localhost:3000` for the public wiki, `/dashboard` for the CMS (requires auth).

## Scripts

- `npm run dev` – start Next.js in development mode
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – ESLint with Next.js defaults
- `npm run typecheck` – TypeScript project check

## Deployment

Deploy the Next.js app to Vercel, set the environment variables, and point Supabase storage/CDN for attachments. Configure Supabase Auth providers (email + Google) and storage bucket policies as described in the project notes.
## Project Tracking

- Roadmap & prioritized work: see [TODO.md](./TODO.md).
- Release notes: maintained in [CHANGELOG.md](./CHANGELOG.md) following Keep a Changelog.
- Agent guidelines: see [AGENT.md](./AGENT.md) for contribution expectations.
