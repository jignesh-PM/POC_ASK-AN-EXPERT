import type { Metadata } from "next";
import { Page, PageHeader, SectionHeader, Stack } from "@/app/components/ui";
import { CategoryGrid } from "@/app/components/catalog/CategoryGrid";
import { ProductCatalogue } from "@/app/components/catalog/ProductCatalogue";

export const metadata: Metadata = { title: "Products" };

export default function CategoriesPage() {
  return (
    <Page>
      <PageHeader title="Products" description="Browse the Morgan Thermal Ceramics product range." />
      <ProductCatalogue />
      <Stack as="section" gap={4} aria-labelledby="browse-ranges-title">
        <SectionHeader id="browse-ranges-title" title="Browse by range" />
        <CategoryGrid />
      </Stack>
    </Page>
  );
}
