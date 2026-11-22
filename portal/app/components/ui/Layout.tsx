import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Layout.module.css";

type Width = "narrow" | "default" | "wide" | "full";

/** Top-level `<main>` wrapper giving every route the same width and vertical rhythm. */
export function Page({ width = "default", className, children, ...props }: HTMLAttributes<HTMLElement> & { width?: Width }) {
  return (
    <main className={cx(styles.page, styles[width], className)} {...props}>
      {children}
    </main>
  );
}

type HeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links aligned to the right on wide screens. */
  actions?: ReactNode;
  /** Extra content under the description (badges, filters, meta). */
  children?: ReactNode;
  className?: string;
};

/** The single `<h1>` block at the top of a page. */
export function PageHeader({ title, description, actions, children, className }: HeaderProps) {
  return (
    <header className={cx(styles.pageHeader, className)}>
      <div className={styles.headerCopy}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && <p className={styles.pageDescription}>{description}</p>}
        {children}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

/** Heading row for a section inside a page: title, description and an optional action. */
export function SectionHeader({ title, description, actions, children, className, as: Heading = "h2", id }: HeaderProps & { as?: "h2" | "h3"; id?: string }) {
  return (
    <div className={cx(styles.sectionHeader, className)}>
      <div className={styles.headerCopy}>
        <Heading id={id} className={Heading === "h2" ? styles.sectionTitle : styles.subsectionTitle}>
          {title}
        </Heading>
        {description && <p className={styles.sectionDescription}>{description}</p>}
        {children}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

/** Vertical group of blocks with consistent spacing. */
export function Stack({ gap = 6, className, children, as: Tag = "div", ...props }: HTMLAttributes<HTMLElement> & { gap?: 2 | 3 | 4 | 6 | 8 | 10; as?: "div" | "section" | "ul" | "ol" | "form" }) {
  return (
    <Tag className={cx(styles.stack, className)} style={{ gap: `var(--space-${gap})` }} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Responsive grid. `min` is the smallest column width in px. `fit` stretches
 * columns to fill the row when there are fewer items than columns.
 */
export function Grid({ min = 260, gap = 4, fit = false, className, children, as: Tag = "div", ...props }: HTMLAttributes<HTMLElement> & { min?: number; gap?: 2 | 3 | 4 | 5 | 6; fit?: boolean; as?: "div" | "ul" | "section" }) {
  return (
    <Tag className={cx(styles.grid, className)} style={{ gridTemplateColumns: `repeat(${fit ? "auto-fit" : "auto-fill"}, minmax(min(100%, ${min}px), 1fr))`, gap: `var(--space-${gap})` }} {...props}>
      {children}
    </Tag>
  );
}
