import type { Metadata } from "next";
import TechnicalDocumentation from "../components/TechnicalDocumentation";

export const metadata: Metadata = {
  title: "Technical Documents | Morgan Ask the Expert",
  description: "Design system, technology stack, portal features, functionality tracker, and version history.",
};

export default function TechnicalDocumentsPage() {
  return <TechnicalDocumentation />;
}
