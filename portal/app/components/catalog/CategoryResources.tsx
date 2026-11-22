"use client";

import { ArrowRight, FileText, PackageSearch } from "@/app/components/Icon";
import { Button, EmptyState, Grid, SectionHeader, Stack } from "@/app/components/ui";
import { CatalogCard } from "./CatalogCard";
import { DocumentGrid } from "./DocumentGrid";
import { useVisibleDocuments, useVisibleProducts, type Category } from "./catalog-data";

/** Visible products and documents for one product range. */
export function CategoryResources({ category }: { category: Category }) {
  const products = useVisibleProducts().filter((product) => product.category === category.slug);
  const documents = useVisibleDocuments().filter((resource) => resource.category === category.name);

  return (
    <>
      <Stack as="section" gap={4} aria-labelledby="range-products-title">
        <SectionHeader
          id="range-products-title"
          eyebrow="Product & system master"
          title={`${category.name} products`}
          description="Product information with links to the official Morgan website."
        />
        {products.length ? (
          <Grid as="ul" min={260}>
            {products.map((product) => (
              <li key={product.id}>
                <CatalogCard
                  href={product.url}
                  external
                  icon={<PackageSearch size={20} aria-hidden="true" />}
                  title={product.name}
                  description={product.description}
                  cta="View on the Morgan website"
                />
              </li>
            ))}
          </Grid>
        ) : (
          <EmptyState icon={<PackageSearch size={22} aria-hidden="true" />} title="No published products" description="No products in this range are currently published." />
        )}
      </Stack>

      <Stack as="section" gap={4} aria-labelledby="range-documents-title">
        <SectionHeader
          id="range-documents-title"
          eyebrow="Technical library"
          title="Related documents"
          actions={
            <Button href="/documents" variant="secondary" size="sm" trailing={<ArrowRight size={15} aria-hidden="true" />}>
              Browse all documents
            </Button>
          }
        />
        {documents.length ? (
          <DocumentGrid documents={documents} showCategory={false} />
        ) : (
          <EmptyState
            icon={<FileText size={22} aria-hidden="true" />}
            title="No documents yet"
            description={`No approved documents are published for ${category.name} yet.`}
            action={
              <Button href="/documents" variant="secondary">
                Search the full library
              </Button>
            }
          />
        )}
      </Stack>
    </>
  );
}
