import type { Metadata } from "next";
import { LegalArticle } from "@/app/components/catalog/LegalArticle";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalArticle
      title="Terms of Use"
      description="Terms for using product information, technical content and expert support."
      sections={[
        {
          heading: "Using this portal",
          body: "Use this information to support product selection and technical enquiries. Confirm safety-critical decisions with a Morgan expert or the product documentation.",
        },
        { heading: "Prototype", body: "This prototype uses sample content and simulated AI answers." },
      ]}
    />
  );
}
