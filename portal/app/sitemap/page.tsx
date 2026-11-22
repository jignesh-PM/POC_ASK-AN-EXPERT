import type { Metadata } from "next";
import SitemapDirectionBoard from "../components/docs/SitemapDirectionBoard";
import { Badge, Page, PageHeader } from "../components/ui";
import { portalMap } from "../lib/project-documentation";

export const metadata: Metadata = {
  title: "Portal site map",
  description: "Explore the portal route map and record the next product direction.",
};

const routeCount = portalMap.reduce((total, section) => total + section.nodes.length, 0);

export default function PortalSitemapPage() {
  return (
    <Page>
      <PageHeader eyebrow="Portal direction board" title="Site map" description="See how the portal connects and record the next direction for its evolution.">
        <Badge tone="success">Working map · {routeCount} routes</Badge>
      </PageHeader>
      <SitemapDirectionBoard />
    </Page>
  );
}
