import type { Metadata } from "next";
import { ArrowRight } from "@/app/components/Icon";
import { Button, Page, PageHeader, SectionHeader, Stack } from "@/app/components/ui";
import { CalloutCard } from "@/app/components/catalog/CalloutCard";
import { CategoryGrid } from "@/app/components/catalog/CategoryGrid";
import { RegionalCompliance } from "@/app/components/catalog/RegionalCompliance";
import { StaffRedirect } from "@/app/components/catalog/StaffRedirect";
import { SupportAreas } from "@/app/components/catalog/SupportAreas";
import { SupportOptions } from "@/app/components/catalog/SupportOptions";
import styles from "@/app/components/catalog/HomePage.module.css";

export const metadata: Metadata = { title: { absolute: "Morgan Ask the Expert" } };

export default function Home() {
  return (
    <Page>
      <StaffRedirect />
      <div className={styles.hero}>
        <PageHeader
          title="How can we help you today?"
          description="Get answers about Morgan insulation, refractory and fire protection products — instantly from Morgan AI, or directly from a product specialist."
        />
        <SupportOptions />
      </div>

      <Stack as="section" gap={4} aria-labelledby="home-ranges-title">
        <SectionHeader
          id="home-ranges-title"
          title="Product ranges"
          actions={
            <Button href="/categories" variant="secondary" size="sm" trailing={<ArrowRight size={15} aria-hidden="true" />}>
              View all products
            </Button>
          }
        />
        <CategoryGrid />
      </Stack>

      <CalloutCard
        tone="muted"
        title="Need a datasheet, manual or certificate?"
        description="Browse Morgan product and application documents in one place."
        action={
          <Button href="/documents" trailing={<ArrowRight size={16} aria-hidden="true" />}>
            Browse documents
          </Button>
        }
      />

      <SupportAreas />
      <RegionalCompliance />
    </Page>
  );
}
