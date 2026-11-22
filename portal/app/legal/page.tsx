import type { Metadata } from "next";
import { FileText, ShieldCheck } from "@/app/components/Icon";
import { Grid, Page, PageHeader } from "@/app/components/ui";
import { CatalogCard } from "@/app/components/catalog/CatalogCard";

export const metadata: Metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <Page width="narrow">
      <PageHeader eyebrow="Morgan Ask the Expert" title="Legal" description="Privacy and terms for using Morgan Ask the Expert." />
      <Grid as="ul" min={260} aria-label="Legal information">
        <li>
          <CatalogCard
            href="/privacy"
            headingLevel="h2"
            icon={<ShieldCheck size={20} aria-hidden="true" />}
            tags={["Your information"]}
            title="Privacy Policy"
            description="Learn how personal and profile information is handled when you use this portal."
            cta="Read the privacy policy"
          />
        </li>
        <li>
          <CatalogCard
            href="/terms"
            headingLevel="h2"
            icon={<FileText size={20} aria-hidden="true" />}
            tags={["Portal guidance"]}
            title="Terms of Use"
            description="Review the terms that apply to product information, technical content and expert support."
            cta="Read the terms of use"
          />
        </li>
      </Grid>
    </Page>
  );
}
