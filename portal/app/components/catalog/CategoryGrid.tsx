"use client";

import { Boxes } from "@/app/components/Icon";
import { EmptyState, Grid } from "@/app/components/ui";
import { CatalogCard } from "./CatalogCard";
import { useVisibleCategories } from "./catalog-data";

/** Cards for every product range that has visible products. */
export function CategoryGrid() {
  const ranges = useVisibleCategories();

  if (!ranges.length) {
    return <EmptyState icon={<Boxes size={22} aria-hidden="true" />} title="No product ranges yet" description="Published ranges will appear here." />;
  }

  return (
    <Grid as="ul" min={240}>
      {ranges.map((range) => (
        <li key={range.slug}>
          <CatalogCard
            href={`/category/${range.slug}`}
            tags={[`${range.productCount} ${range.productCount === 1 ? "product" : "products"}`]}
            title={range.name}
            description={range.description}
            cta="View range"
          />
        </li>
      ))}
    </Grid>
  );
}
