import { ArrowLeft } from "@/app/components/Icon";
import { Button, Card, Page, PageHeader, Stack } from "@/app/components/ui";
import styles from "./LegalArticle.module.css";

type LegalArticleProps = {
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
};

/** Shared layout for the privacy policy and terms of use. */
export function LegalArticle({ title, description, sections }: LegalArticleProps) {
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={description}
        actions={
          <Button href="/legal" variant="ghost" size="sm" leading={<ArrowLeft size={15} aria-hidden="true" />}>
            All legal information
          </Button>
        }
      />
      <Card as="article" padding="lg">
        <Stack gap={6}>
          {sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              <p className={styles.body}>{section.body}</p>
            </section>
          ))}
        </Stack>
      </Card>
    </Page>
  );
}
