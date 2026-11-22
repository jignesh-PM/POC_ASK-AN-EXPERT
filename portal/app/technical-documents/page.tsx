import type { Metadata } from "next";
import TechnicalDocumentation from "../components/docs/TechnicalDocumentation";
import { Page, PageHeader } from "../components/ui";

export const metadata: Metadata = {
  title: "Technical documents",
  description: "Design system, technology stack, portal features, functionality tracker and version history.",
};

export default function TechnicalDocumentsPage() {
  return (
    <Page>
      <PageHeader
        title="Technical documents"
        description="A working reference for the portal's design language, technology, capabilities and delivery direction. It separates what works in this prototype from what production delivery still needs."
      />
      <TechnicalDocumentation />
    </Page>
  );
}
