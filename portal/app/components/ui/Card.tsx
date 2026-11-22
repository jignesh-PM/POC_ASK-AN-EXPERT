import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { MascotOr } from "../mascot/Mascot";
import styles from "./Card.module.css";

type Padding = "none" | "sm" | "md" | "lg";
type Tone = "default" | "muted" | "brand" | "accent";

type CardProps = HTMLAttributes<HTMLElement> & {
  padding?: Padding;
  tone?: Tone;
  /** Makes the whole card a link. External URLs open in a new tab. */
  href?: string;
  external?: boolean;
  as?: "div" | "article" | "section" | "aside" | "li" | "form";
  /** Entrance animation. Defaults to on for linked cards. */
  animate?: boolean;
};

/** Surface container. Interactive when `href` is set (hover lift and focus ring). */
export function Card({ padding = "md", tone = "default", href, external, as: Tag = "div", animate, className, children, ...props }: CardProps) {
  const classes = cx(styles.card, styles[`pad-${padding}`], styles[`tone-${tone}`], href && styles.interactive, className);
  // Clickable cards animate in by default; static cards opt in with `animate`.
  const motion = (animate ?? Boolean(href)) ? { "data-animate": "" } : {};
  if (href) {
    const isExternal = external || /^https?:/.test(href);
    if (isExternal) {
      return (
        <a className={classes} href={href} target="_blank" rel="noreferrer" {...motion} {...(props as HTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} {...motion} {...(props as HTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }
  return (
    <Tag className={classes} {...motion} {...props}>
      {children}
    </Tag>
  );
}

/** Rounded tinted square that holds an icon. */
export function IconTile({ children, tone = "brand", size = "md", className }: { children: ReactNode; tone?: "brand" | "accent" | "success" | "danger" | "neutral"; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span className={cx(styles.iconTile, styles[`tile-${tone}`], styles[`tile-${size}`], className)} aria-hidden="true">
      {children}
    </span>
  );
}

/** Small label for type, status or category. */
export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "brand" | "accent" | "success" | "danger" | "warning"; className?: string }) {
  return <span className={cx(styles.badge, styles[`badge-${tone}`], className)}>{children}</span>;
}

/** Key figure with a label and optional hint. */
export function Stat({ label, value, hint, className }: { label: ReactNode; value: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.stat, className)}>
      <span className={styles.statLabel}>{label}</span>
      <strong className={styles.statValue}>{value}</strong>
      {hint && <span className={styles.statHint}>{hint}</span>}
    </div>
  );
}

/** Placeholder for lists and searches with no results. Shows the curious mascot (or `icon` when the guide is off). */
export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.empty, className)}>
      <MascotOr mood="curious" size="sm" fallback={icon && <IconTile tone="neutral" size="lg">{icon}</IconTile>} />
      <strong className={styles.emptyTitle}>{title}</strong>
      {description && <p className={styles.emptyDescription}>{description}</p>}
      {action}
    </div>
  );
}

/** Inline message. Use `tone="danger"` for validation errors (announced as an alert). */
export function Alert({ children, tone = "info", icon, className }: { children: ReactNode; tone?: "info" | "success" | "warning" | "danger"; icon?: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.alert, styles[`alert-${tone}`], className)} role={tone === "danger" ? "alert" : "status"}>
      {icon}
      <div>{children}</div>
    </div>
  );
}
