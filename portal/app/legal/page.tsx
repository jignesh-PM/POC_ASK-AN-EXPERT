import type { Metadata } from "next";
import { Grid, Page, PageHeader } from "@/app/components/ui";
import { CatalogCard } from "@/app/components/catalog/CatalogCard";

export const metadata: Metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <Page width="narrow">
      <PageHeader title="Legal" />
      <Grid as="ul" min={260} aria-label="Legal information">
        <li>
          <CatalogCard
            href="/privacy"
            headingLevel="h2"
            tags={["Your information"]}
            title="Privacy Policy"
            description="How we handle your personal and profile information."
            cta="Read policy"
          />
        </li>
        <li>
          <CatalogCard
            href="/terms"
            headingLevel="h2"
            tags={["Portal guidance"]}
            title="Terms of Use"
            description="Terms for using product information and expert support."
            cta="Read terms"
          />
        </li>
      </Grid>
    </Page>
  );
}
