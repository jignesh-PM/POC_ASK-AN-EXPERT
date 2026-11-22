"use client";

import { useId, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Tabs.module.css";

export type TabItem<T extends string> = { id: T; label: ReactNode; icon?: ReactNode };

/**
 * Accessible tab list (arrow keys move between tabs). Render the active panel
 * yourself with `<TabPanel>` using the same `id`.
 */
export function Tabs<T extends string>({ items, value, onChange, label, className }: { items: TabItem<T>[]; value: T; onChange: (id: T) => void; label: string; className?: string }) {
  const base = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === value);
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = items[(index + delta + items.length) % items.length];
    onChange(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <div className={cx(styles.list, className)} role="tablist" aria-label={label} onKeyDown={onKeyDown} data-tabs={base}>
      {items.map((item) => (
        <button
          key={item.id}
          id={`${base}-tab-${item.id}`}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          tabIndex={item.id === value ? 0 : -1}
          className={styles.tab}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
