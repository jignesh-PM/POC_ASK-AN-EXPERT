import type { Metadata } from "next";
import { LegalArticle } from "@/app/components/catalog/LegalArticle";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalArticle
      title="Privacy Policy"
      description="How we handle your personal and profile information."
      sections={[
        {
          heading: "How Morgan uses your data",
          body: "Prototype: this shows the consent journey only. The live portal will publish Morgan’s approved GDPR privacy notice and record each consent with its version and date.",
        },
        { heading: "Your choices", body: "View, export or delete your data from your profile." },
      ]}
    />
  );
}
