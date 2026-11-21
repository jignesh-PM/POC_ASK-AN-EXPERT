import type { Metadata } from "next";
import SitemapDirectionBoard from "../components/SitemapDirectionBoard";

export const metadata: Metadata = {
  title: "Portal Site Map | Morgan Ask the Expert",
  description: "Explore the portal route map and record the next product direction.",
};

export default function PortalSitemapPage() {
  return <SitemapDirectionBoard />;
}
