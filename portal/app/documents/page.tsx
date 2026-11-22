import type { Metadata } from "next";
import { Info } from "@/app/components/Icon";
import { Alert, Page, PageHeader } from "@/app/components/ui";
import { DocumentLibrary } from "@/app/components/catalog/DocumentLibrary";

export const metadata: Metadata = { title: "Product documents" };

export default function DocumentsPage() {
  return (
    <Page>
      <PageHeader title="Product documents" description="Find datasheets, safety data sheets, installation manuals and technical papers." />
      <DocumentLibrary />
      <Alert icon={<Info size={18} aria-hidden="true" />}>Documents open on the Morgan Thermal Ceramics website. Availability varies by region.</Alert>
    </Page>
  );
}
