"use client";

import { usePublishedKnowledge } from "@/app/lib/admin-knowledge-base";
import { useCatalogSettings } from "@/app/lib/catalog-settings";
import { categories, mainAreas, products } from "@/app/lib/mock-data";
import { officialSiteIndex, type IndexedResource } from "@/app/lib/site-index";
import { STORAGE_KEYS, useStoredJSON } from "@/app/lib/storage";

/*
 * Catalogue visibility in one place: every page that lists products, ranges,
 * documents or support areas reads through these hooks so admin visibility
 * settings apply consistently. The lists are tiny, so no memoisation.
 */

export type Category = (typeof categories)[number];
export type Product = (typeof products)[number];
export type CategoryWithCount = Category & { productCount: number };

const NO_HIDDEN_AREAS: string[] = [];

/** Case-insensitive "contains" match of a free-text query against the given fields. */
export function matchesQuery(query: string, ...fields: string[]) {
  const needle = query.trim().toLowerCase();
  return !needle || fields.join(" ").toLowerCase().includes(needle);
}

export function categoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? "Products";
}

/** Products not hidden by the catalogue visibility settings. */
export function useVisibleProducts(): Product[] {
  const { hiddenProductIds } = useCatalogSettings();
  return products.filter((product) => !hiddenProductIds.includes(product.id));
}

/** Product ranges with at least one visible product, plus their visible product count. */
export function useVisibleCategories(): CategoryWithCount[] {
  const visible = useVisibleProducts();
  return categories
    .map((category) => ({ ...category, productCount: visible.filter((product) => product.category === category.slug).length }))
    .filter((category) => category.productCount > 0);
}

/** Official documents not hidden by an admin, followed by published admin-added knowledge sources. */
export function useVisibleDocuments(): IndexedResource[] {
  const { hiddenDocumentIds } = useCatalogSettings();
  const published = usePublishedKnowledge();
  return [...officialSiteIndex.filter((resource) => !hiddenDocumentIds.includes(resource.id)), ...published];
}

/** Main support areas not hidden by an admin. */
export function useVisibleMainAreas() {
  const hidden = useStoredJSON(STORAGE_KEYS.adminAreaVisibility, NO_HIDDEN_AREAS);
  return mainAreas.filter((area) => !hidden.includes(area.slug));
}
