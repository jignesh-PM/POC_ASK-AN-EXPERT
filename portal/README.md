# Morgan Ask the Expert portal

A Next.js prototype for product discovery, technical resources, support tools, and expert requests.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the site’s canonical URL before deployment. Integration variables are placeholders until their services are connected.

## Project structure

```text
app/
  components/      Shared chrome, controls, motion, documentation, and error UI
  lib/             Portal content, route map, and documentation records
  categories/      Product category index
  category/[slug]/ Category detail
  documents/       Customer-facing technical resource library
  technical-documents/ Portal design and implementation handbook
  sitemap/         Visual route and product direction board
  sitemap.ts       XML sitemap route
  error.tsx        Route-segment 500 recovery UI
  global-error.tsx Root-level error recovery UI
  not-found.tsx    Branded 404 UI
```

## Technical Documents

The handbook at `/technical-documents` documents the brand system, Roboto type scale, technology stack, portal features, functionality tracker, and prototype release history. Tracker statuses are saved in browser local storage for the demo. The visual sitemap at `/sitemap` uses the same route data and provides a local direction note.

## UI and motion

- Morgan Blue `#002F5F`, Morgan Orange `#EF6400`, white, and black form the core palette.
- Roboto is loaded through `next/font` and used as the portal interface family.
- Radix UI provides accessible select and menu behavior; Lucide React provides icons.
- GSAP powers intentional 2D interface motion. Three.js is isolated to the home hero background.
- Motion respects `prefers-reduced-motion` where animation is used.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Portal overview and search |
| `/categories` | Product category index |
| `/documents` | Customer-facing technical documents |
| `/tools` | Support tools |
| `/questions` | Ask the Expert flow |
| `/profile` | Prototype profile |
| `/technical-documents` | Product and implementation handbook |
| `/sitemap` | Visual portal map and direction board |
| `/sitemap.xml` | Search-engine sitemap |

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

The account-role selector and local direction/tracker storage are prototype features. Connect them to approved identity, content, and project services before production use.
