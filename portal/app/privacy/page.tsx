import type { Metadata } from "next";
import { LegalArticle } from "@/app/components/catalog/LegalArticle";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalArticle
      title="Privacy Policy"
      description="How personal and profile information is handled when you use this portal."
      sections={[
        {
          heading: "How Morgan uses your data",
          body: "This prototype demonstrates the customer consent and data handling journey. In production, Morgan will publish the approved GDPR privacy notice and record consent with a version, date and account history.",
        },
        { heading: "Your choices", body: "You can view, export or delete your data from the profile page." },
      ]}
    />
  );
}
