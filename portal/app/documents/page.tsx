import type { Metadata } from "next";
import { Info } from "@/app/components/Icon";
import { Alert, Page, PageHeader } from "@/app/components/ui";
import { DocumentLibrary } from "@/app/components/catalog/DocumentLibrary";

export const metadata: Metadata = { title: "Product documents" };

export default function DocumentsPage() {
  return (
    <Page>
      <PageHeader title="Product documents" description="Search Morgan technical papers, datasheets, safety information and installation guidance." />
      <DocumentLibrary />
      <Alert icon={<Info size={18} aria-hidden="true" />}>Documents open on Morgan Thermal Ceramics&apos; official website. Availability may vary by product and region.</Alert>
    </Page>
  );
}
