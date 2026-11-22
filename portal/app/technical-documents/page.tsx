import type { Metadata } from "next";
import TechnicalDocumentation from "../components/docs/TechnicalDocumentation";
import { Page, PageHeader } from "../components/ui";

export const metadata: Metadata = {
  title: "Technical documents",
  description: "Design system, technology, features and version history.",
};

export default function TechnicalDocumentsPage() {
  return (
    <Page>
      <PageHeader
        title="Technical documents"
        description="Design, technology and features: what works today and what production needs."
      />
      <TechnicalDocumentation />
    </Page>
  );
}
