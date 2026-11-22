"use client";

import { ArrowRight } from "@/app/components/Icon";
import { Button, Card, Grid } from "@/app/components/ui";
import { focusSupportComposer } from "@/app/lib/support-mode";
import styles from "./SupportOptions.module.css";

/** The support journey: ask a question for an answer with sources, then continue with an expert if needed. */
export function SupportOptions() {
  return (
    <Grid as="section" min={300} gap={4} fit aria-label="Choose your support">
      <Card padding="lg" animate>
        <span className={styles.step} aria-label="Step 1">1</span>
        <h2 className={styles.title}>Get an answer with sources</h2>
        <p className={styles.text}>Type your question in the search bar and choose your industry and product. Morgan AI answers from approved product pages and technical documents, and shows its sources.</p>
        <div className={styles.action}>
          <Button variant="accent" onClick={() => focusSupportComposer()} trailing={<ArrowRight size={16} aria-hidden="true" />}>
            Ask a question
          </Button>
        </div>
      </Card>
      <Card padding="lg" tone="brand" animate>
        <span className={`${styles.step} ${styles.stepInverse}`} aria-label="Step 2">2</span>
        <h2 className={styles.title}>Continue with a Morgan expert</h2>
        <p className={styles.textInverse}>Not satisfied with the answer? Hand your question to the specialist team for your product line and continue in a live chat.</p>
        <div className={styles.action}>
          <Button href="/questions?mode=expert" variant="secondary" trailing={<ArrowRight size={16} aria-hidden="true" />}>
            Start expert chat
          </Button>
        </div>
      </Card>
    </Grid>
  );
}
