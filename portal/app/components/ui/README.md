# Morgan portal component library

All UI is built from these components and the tokens in `app/styles/tokens.css`.
Import from the barrel: `import { Button, Card, PageHeader } from "@/app/components/ui";`
Icons come from `@/app/components/Icon` (add new glyphs to its table; never inline SVG).

## Rules

1. **Tokens only.** CSS modules use `var(--color-*)`, `var(--space-*)`, `var(--text-*)`, `var(--radius-*)`, `var(--shadow-*)`. No raw hex values, px font sizes, or ad-hoc shadows.
2. **One CSS module per feature component**, co-located (`Foo.tsx` + `Foo.module.css`). No new global classes.
3. **Every route renders `<Page>`** with one `<PageHeader>` (the only `<h1>`). Sections use `<SectionHeader>` (h2/h3).
4. **No `localStorage` in components.** Read through hooks in `app/lib/*` (`useRole`, `useCatalogSettings`, `useRoutingRequests`, …), write through the lib functions. They use `useSyncExternalStore`, so no setState-in-effect and no hydration mismatch.
5. **Minimum text size is `--text-xs` (12px).** Body copy is `--text-md`/`--text-base`.
6. **No eyebrow / kicker labels** above titles. If context matters, show it as a `Badge` under the title instead.
7. **Accessible by default:** icons get `aria-hidden="true"`; icon-only buttons need `aria-label`; form controls sit inside `<Field label=…>`.

## Components

| Component | Use for | Key props |
| --- | --- | --- |
| `Page` | `<main>` wrapper for a route | `width`: `narrow` \| `default` \| `wide` \| `full` |
| `PageHeader` | Page title block (h1) | `title`, `description`, `actions`, `children` |
| `SectionHeader` | Section title row | same as PageHeader + `as` (`h2`/`h3`), `id` |
| `Stack` / `Grid` | Vertical rhythm / responsive card grid | `gap`; Grid `min` column width, `fit` to stretch a short row |
| `Button` | Every action or call to action | `variant`: `primary` \| `accent` \| `secondary` \| `ghost` \| `link` \| `danger`; `size`: `sm` \| `md` \| `lg`; `href` (renders a Link, or `<a target=_blank>` with `external`); `leading`/`trailing` icons; `iconOnly` |
| `Card` | Any surface; clickable when `href` set | `padding`, `tone`: `default` \| `muted` \| `brand` \| `accent`; `href`, `external`, `as`, `animate` |
| `IconTile` | Icon in a tinted square | `tone`, `size` |
| `Badge` | Type / status / category label | `tone` |
| `Stat` | Metric tile | `label`, `value`, `hint` |
| `EmptyState` | No results / nothing yet | `icon`, `title`, `description`, `action` |
| `Alert` | Inline feedback or validation | `tone`: `info` \| `success` \| `warning` \| `danger` |
| `Field` | Label + control + hint/error | `label`, `hint`, `error`, `optional`, `hideLabel` |
| `Input`, `Textarea`, `Select`, `SearchInput` | Form controls (go inside `Field`) | native props |
| `Checkbox`, `Switch` | Boolean inputs with inline label | `label`, `description` |
| `Tabs` | Switching between panels | `items`, `value`, `onChange`, `label` |

## Example

```tsx
<Page>
  <PageHeader title="Product documents" description="Search datasheets and manuals." />
  <Grid min={280}>
    {docs.map((doc) => (
      <Card key={doc.id} href={doc.url} animate>
        <Badge tone="brand">{doc.type}</Badge>
        <h3>{doc.title}</h3>
        <p>{doc.summary}</p>
      </Card>
    ))}
  </Grid>
</Page>
```
