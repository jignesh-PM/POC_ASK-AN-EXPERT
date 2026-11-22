import type { ReactNode } from "react";
import { Check } from "@/app/components/Icon";
import { Badge, Card, SectionHeader } from "@/app/components/ui";
import styles from "./AdminPanel.module.css";

type AdminPanelProps = {
  /** Heading id; also labels the section landmark. */
  id: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Pass the flag from `useSavedFlash` to show the "Saved" confirmation. */
  saved?: boolean;
  children: ReactNode;
};

/** Consistent card for one admin section: heading, optional actions, saved status and body. */
export function AdminPanel({ id, title, description, actions, saved, children }: AdminPanelProps) {
  const status = saved === undefined ? null : <SavedStatus saved={saved} />;
  return (
    <Card as="section" padding="lg" aria-labelledby={id} className={styles.panel}>
      <SectionHeader id={id} title={title} description={description} actions={actions || status ? <>{status}{actions}</> : undefined} />
      {children}
    </Card>
  );
}

/** Live region that briefly announces a successful save. */
export function SavedStatus({ saved }: { saved: boolean }) {
  return (
    <span role="status" className={styles.status}>
      {saved && (
        <Badge tone="success">
          <Check size={14} aria-hidden="true" />
          Saved
        </Badge>
      )}
    </span>
  );
}
