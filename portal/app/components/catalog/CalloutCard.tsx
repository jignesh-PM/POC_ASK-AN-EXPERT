import type { ReactNode } from "react";
import { Card } from "@/app/components/ui";
import styles from "./CalloutCard.module.css";

type CalloutCardProps = {
  title: string;
  description: string;
  /** Primary action(s), placed on the right on wide screens. */
  action: ReactNode;
  tone?: "brand" | "muted";
};

/** Full-width banner that points to a next step (documents, expert help, …). */
export function CalloutCard({ title, description, action, tone = "brand" }: CalloutCardProps) {
  return (
    <Card as="section" padding="lg" tone={tone} aria-label={title}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <h2 className={styles.title}>{title}</h2>
          <p className={tone === "brand" ? styles.descriptionInverse : styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>{action}</div>
      </div>
    </Card>
  );
}
