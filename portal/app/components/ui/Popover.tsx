"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Popover.module.css";

type PopoverProps = {
  /** Content of the trigger button (usually an icon). */
  trigger: ReactNode;
  /** Accessible name for the trigger. */
  label: string;
  triggerClassName?: string;
  panelClassName?: string;
  align?: "start" | "end";
  onOpenChange?: (open: boolean) => void;
  /** Panel content; receives `close` so items can dismiss the popover. */
  children: (close: () => void) => ReactNode;
};

/**
 * Button that toggles a floating panel. Closes on outside click, Escape and
 * route-changing clicks inside the panel; focus returns to the trigger.
 */
export function Popover({ trigger, label, triggerClassName, panelClassName, align = "end", onOpenChange, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const close = () => change(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      onOpenChange?.(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => change(!open)}
      >
        {trigger}
      </button>
      <div id={panelId} className={cx(styles.panel, styles[align], panelClassName)} hidden={!open}>
        {open && children(close)}
      </div>
    </div>
  );
}

/** Title row at the top of a popover panel. */
export function PopoverHeader({ icon, title, description }: { icon?: ReactNode; title: ReactNode; description?: ReactNode }) {
  return (
    <div className={styles.header}>
      {icon && <span className={styles.headerIcon}>{icon}</span>}
      <span className={styles.headerCopy}>
        <strong>{title}</strong>
        {description && <span>{description}</span>}
      </span>
    </div>
  );
}

/** Group of items inside a popover, separated from the previous group by a rule. */
export function PopoverSection({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.section}>
      {title && <p className={styles.sectionTitle}>{title}</p>}
      {children}
    </div>
  );
}

export const popoverItemClassName = styles.item;
