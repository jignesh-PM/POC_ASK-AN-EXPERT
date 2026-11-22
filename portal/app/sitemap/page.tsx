import type { Metadata } from "next";
import SitemapDirectionBoard from "../components/docs/SitemapDirectionBoard";
import { Badge, Page, PageHeader } from "../components/ui";
import { portalMap } from "../lib/project-documentation";

export const metadata: Metadata = {
  title: "Site map",
  description: "Portal routes and next steps.",
};

const routeCount = portalMap.reduce((total, section) => total + section.nodes.length, 0);

export default function PortalSitemapPage() {
  return (
    <Page>
      <PageHeader title="Site map" description="How the portal connects, and what to build next.">
        <Badge tone="success">{routeCount} routes</Badge>
      </PageHeader>
      <SitemapDirectionBoard />
    </Page>
  );
}
