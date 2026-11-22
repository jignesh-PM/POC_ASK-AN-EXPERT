"use client";

import { Grid, SectionHeader, Stack } from "@/app/components/ui";
import { CatalogCard } from "./CatalogCard";
import { useVisibleMainAreas } from "./catalog-data";

/** Shortcut cards to the first few main support areas the admin has left visible. */
export function SupportAreas({ limit = 3 }: { limit?: number }) {
  const areas = useVisibleMainAreas().slice(0, limit);
  if (!areas.length) return null;

  return (
    <Stack as="section" gap={4} aria-labelledby="support-areas-title">
      <SectionHeader id="support-areas-title" title="Support areas" />
      <Grid as="ul" min={240}>
        {areas.map((area) => (
          <li key={area.slug}>
            <CatalogCard href={`/main-area/${area.slug}`} title={area.title} description={area.description} cta="Open" />
          </li>
        ))}
      </Grid>
    </Stack>
  );
}
