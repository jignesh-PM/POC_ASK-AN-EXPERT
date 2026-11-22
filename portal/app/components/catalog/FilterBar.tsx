import type { ReactNode } from "react";
import { Card } from "@/app/components/ui";
import styles from "./FilterBar.module.css";

/** Search and filter controls above a result list. The first child (the search) takes the extra width. */
export function FilterBar({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card as="section" padding="sm" tone="muted" aria-label={label}>
      <div className={styles.bar}>{children}</div>
    </Card>
  );
}

/** Live result count shown next to a results heading. */
export function ResultCount({ count, noun }: { count: number; noun: string }) {
  return (
    <p className={styles.count} aria-live="polite">
      {count} {count === 1 ? noun : `${noun}s`}
    </p>
  );
}
