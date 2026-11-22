import type { Metadata } from "next";
import { ArrowRight } from "@/app/components/Icon";
import { Button, Page, PageHeader, SectionHeader, Stack } from "@/app/components/ui";
import { CalloutCard } from "@/app/components/catalog/CalloutCard";
import { CategoryGrid } from "@/app/components/catalog/CategoryGrid";
import { RegionalCompliance } from "@/app/components/catalog/RegionalCompliance";
import { StaffRedirect } from "@/app/components/catalog/StaffRedirect";
import { SupportAreas } from "@/app/components/catalog/SupportAreas";
import { SupportOptions } from "@/app/components/catalog/SupportOptions";
import Mascot from "@/app/components/mascot/Mascot";
import styles from "@/app/components/catalog/HomePage.module.css";

export const metadata: Metadata = { title: { absolute: "Morgan Ask the Expert" } };

export default function Home() {
  return (
    <Page>
      <StaffRedirect />
      <div className={styles.hero}>
        {/* Slow-drifting brand glows behind the hero. */}
        <span className={styles.glowAccent} aria-hidden="true" />
        <span className={styles.glowBrand} aria-hidden="true" />
        <div className={styles.heroTop}>
          <PageHeader title="How can we help?" description="Instant answers from Morgan AI, or a chat with a Morgan expert." />
          <Mascot mood="wave" size="lg" say bubble="top" className={styles.heroMascot} />
        </div>
        <SupportOptions />
      </div>

      <Stack as="section" gap={4} aria-labelledby="home-ranges-title">
        <SectionHeader
          id="home-ranges-title"
          title="Product ranges"
          actions={
            <Button href="/categories" variant="secondary" size="sm" trailing={<ArrowRight size={15} aria-hidden="true" />}>
              All products
            </Button>
          }
        />
        <CategoryGrid />
      </Stack>

      <CalloutCard
        tone="muted"
        title="Looking for a document?"
        description="Datasheets, manuals and certificates for every product range."
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
