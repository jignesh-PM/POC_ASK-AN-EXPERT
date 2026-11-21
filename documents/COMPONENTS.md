# Portal Components and Page Structure

## Application chrome

### `SiteChrome`
- Path: `portal/app/components/SiteChrome.tsx`
- Provides the shared navigation sidebar, region/language controls, role switcher, top bar, page content area and footer.
- It wraps every route through `portal/app/layout.tsx`.

## Shared content

### Seed data
- Path: `portal/app/lib/mock-data.ts`
- Exports product categories, main resource areas, technical tools and document summaries.

### Official-site index
- Path: `portal/app/lib/site-index.ts`
- Exports resource records, keyword search and mock AI answer generation.
- Resource URLs point to public Morgan reference pages; no production AI or live data service is used.

## Reusable visual areas

The prototype currently uses CSS classes and route-local JSX instead of a formal component library. The main repeated UI regions are:

- Navigation sidebar and account controls: `SiteChrome`
- Header and role controls: `SiteChrome`
- Footer and legal links: `SiteChrome`
- Hero/search form: home page
- AI answer and sourced-results cards: home page
- Main-area/resource cards: home page and catalogue routes
- Search and filter forms: search, categories and documents routes
- Expert conversation layout: `/expert`
- Administration navigation and summary cards: `/admin`

## Routes and components

| Route | Page implementation | Main components |
|---|---|---|
| `/` | `portal/app/page.tsx` | Engineering navigation, global search, AI answer panel, source cards, main-area cards, chat widget |
| `/categories` | `portal/app/categories/page.tsx` | Category list cards |
| `/category/[slug]` | `portal/app/category/[slug]/page.tsx` | Category header and filtered document cards |
| `/main-area/[slug]` | `portal/app/main-area/[slug]/page.tsx` | Main-area detail and related resource links |
| `/tools` | `portal/app/tools/page.tsx` | Technical tool cards |
| `/tools/[slug]` | `portal/app/tools/[slug]/page.tsx` | Tool detail and prototype input form |
| `/documents` | `portal/app/documents/page.tsx` | Technical document index |
| `/search` | `portal/app/search/page.tsx` | Search form and indexed-resource results |
| `/questions` | `portal/app/questions/page.tsx` | Customer question thread list |
| `/expert` | `portal/app/expert/page.tsx` | Expert queue and conversation panel |
| `/admin` | `portal/app/admin/page.tsx` | Admin navigation, metrics and management panels |
| `/sign-in` | `portal/app/sign-in/page.tsx` | Login/sign-up and OTP prototype controls |
| `/profile` | `portal/app/profile/page.tsx` | Profile summary and account details |
| `/privacy` | `portal/app/privacy/page.tsx` | Legal copy |
| `/terms` | `portal/app/terms/page.tsx` | Legal copy |

## Shared design system

Global styles are in `portal/app/globals.css`. It defines page shells, navigation, cards, forms, chat widgets, responsive layouts and legal-page styles.

## Cleanup conventions

- Keep route implementations small and route-local until reused by at least two screens.
- Extract a component only when it has a stable interface and is reused across routes.
- Remove duplicate prototype implementations instead of maintaining parallel UI code.
- Keep only public assets that are referenced by JSX or CSS.
- Keep seed-data modules separate from page rendering so mock integrations can be replaced later.
