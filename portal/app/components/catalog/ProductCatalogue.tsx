"use client";

import { useState } from "react";
import { Search } from "@/app/components/Icon";
import { Button, EmptyState, Field, Grid, SearchInput, SectionHeader, Select, Stack } from "@/app/components/ui";
import { CatalogCard } from "./CatalogCard";
import { FilterBar, ResultCount } from "./FilterBar";
import { categoryName, matchesQuery, useVisibleCategories, useVisibleProducts } from "./catalog-data";

const ALL = "all";

/** Searchable, filterable list of visible products. */
export function ProductCatalogue() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState(ALL);
  const products = useVisibleProducts();
  const ranges = useVisibleCategories();

  const results = products.filter(
    (product) => (range === ALL || product.category === range) && matchesQuery(query, product.name, product.description, categoryName(product.category)),
  );
  const clearFilters = () => {
    setQuery("");
    setRange(ALL);
  };

  return (
    <Stack as="section" gap={6} aria-labelledby="product-results-title">
      <FilterBar label="Filter products">
        <Field label="Search products" hideLabel>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
        </Field>
        <Field label="Product range" hideLabel>
          <Select value={range} onChange={(event) => setRange(event.target.value)}>
            <option value={ALL}>All product ranges</option>
            {ranges.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
      </FilterBar>

      <SectionHeader id="product-results-title" title="All products" actions={<ResultCount count={results.length} noun="product" />} />

      {results.length ? (
        <Grid as="ul" min={260}>
          {results.map((product) => (
            <li key={product.id}>
              <CatalogCard
                href={`/category/${product.category}`}
                tags={[categoryName(product.category)]}
                title={product.name}
                description={product.description}
                cta="View range"
              />
            </li>
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="No products found"
          description="Try another name or product range."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}
    </Stack>
  );
}
