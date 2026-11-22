import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "link" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square button that only shows an icon. Requires `aria-label`. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Icon or element rendered before the label. */
  leading?: ReactNode;
  /** Icon or element rendered after the label. */
  trailing?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Opens in a new tab with safe `rel`. Use for links that leave the portal. */
  external?: boolean;
};

export type ButtonProps = AsButton | AsLink;

export function buttonClassName({ variant = "primary", size = "md", iconOnly, fullWidth, className }: CommonProps = {}) {
  return cx(styles.button, styles[variant], styles[size], iconOnly && styles.iconOnly, fullWidth && styles.fullWidth, className);
}

/** Primary action component. Renders a `<button>`, or a link when `href` is set. */
export function Button(props: ButtonProps) {
  const { variant, size, iconOnly, fullWidth, leading, trailing, className, children, ...rest } = props;
  const classes = buttonClassName({ variant, size, iconOnly, fullWidth, className });
  const content = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest as AsLink;
    if (external || /^(https?:|mailto:|tel:|data:)/.test(href)) {
      return (
        <a className={classes} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...anchor}>
          {content}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as AsButton;
  return (
    <button className={classes} type={type} {...button}>
      {content}
    </button>
  );
}
