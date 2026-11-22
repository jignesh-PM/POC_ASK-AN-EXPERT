import type { Metadata } from "next";
import { LegalArticle } from "@/app/components/catalog/LegalArticle";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalArticle
      title="Terms of Use"
      description="The terms that apply to product information, technical content and expert support in this portal."
      sections={[
        {
          heading: "Using this portal",
          body: "Information in this portal supports product selection and technical enquiries. Always confirm safety-critical decisions with an approved Morgan expert or product documentation.",
        },
        { heading: "Prototype", body: "This environment uses dummy content and mock AI responses for review." },
      ]}
    />
  );
}
