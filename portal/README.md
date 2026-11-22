# Morgan Ask the Expert portal

A Next.js prototype for product discovery, technical resources, support tools, and expert requests.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the site’s canonical URL before deployment.

## Support journey

1. **Ask.** The search bar in the header takes a question plus an industry and product.
2. **Answer with sources.** `/search` returns a Morgan AI answer citing its sources: matching products and documents from Morgan’s official site.
3. **Continue with an expert.** If the answer isn’t enough, “Continue with an expert” hands the question, industry and product to the responsible team (`/questions` → `/expert`).

## Project structure

```text
app/
  styles/
    tokens.css        Design tokens: colour, type, spacing, radius, shadow, motion
    base.css          Element defaults, focus ring, entrance animation
  components/
    ui/               Component library (Button, Card, Field, PageHeader, Tabs, Popover…) — see ui/README.md
    Icon.tsx          In-house SVG icon set
    shell/            Header, navigation drawer, search bar, breadcrumbs, error/404 UI
    catalog/          Home, products, categories, documents, tools, legal
    support/          Morgan AI answers, question hub, expert chat
    account/          Profile, password, sign-in
    admin/            Super Admin workspace (one file per view)
    docs/             Technical documents handbook and site-map board
  lib/
    storage.ts        localStorage access via useSyncExternalStore (prototype persistence)
    session.ts        Role, region, language, admin settings, audit log, analytics
    catalog-settings.ts, expert-routing.ts, profile-completion.ts, admin-knowledge-base.ts
    mock-data.ts, site-index.ts, compliance-data.ts, project-documentation.ts
  <route>/page.tsx    Server Components exporting metadata; client islands only where needed
```

## Conventions

- Build UI from `app/components/ui` and style feature components with co-located CSS Modules that use tokens only. There is no global stylesheet of component classes.
- Components never touch `window.localStorage` directly; read through the hooks in `app/lib`, write through its functions.
- Every route renders one `<PageHeader>` (the only `<h1>`). Page titles use the root `%s | Morgan Ask the Expert` template.
- Unknown slugs call `notFound()` (Cache Components is enabled, so `dynamicParams` is unavailable).

## Useful commands

```bash
npm run dev        # development server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # serve the production build
```

The role preview selector and browser-stored data are prototype features. Connect them to approved identity, content, and expert-routing services before production use.
