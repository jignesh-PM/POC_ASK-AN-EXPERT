import type { ReactNode } from "react";
import { Card, Eyebrow, IconTile } from "@/app/components/ui";
import styles from "./CalloutCard.module.css";

type CalloutCardProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  /** Primary action(s), placed on the right on wide screens. */
  action: ReactNode;
  tone?: "brand" | "muted";
};

/** Full-width banner that points to a next step (documents, expert help, …). */
export function CalloutCard({ icon, eyebrow, title, description, action, tone = "brand" }: CalloutCardProps) {
  return (
    <Card as="section" padding="lg" tone={tone} aria-label={title}>
      <div className={styles.layout}>
        <IconTile size="lg" tone={tone === "brand" ? "accent" : "brand"}>
          {icon}
        </IconTile>
        <div className={styles.copy}>
          <Eyebrow tone={tone === "brand" ? "inverse" : "accent"}>{eyebrow}</Eyebrow>
          <h2 className={styles.title}>{title}</h2>
          <p className={tone === "brand" ? styles.descriptionInverse : styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>{action}</div>
      </div>
    </Card>
  );
}
