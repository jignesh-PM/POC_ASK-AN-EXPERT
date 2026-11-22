import type { ReactNode } from "react";
import styles from "./AdminTable.module.css";

/**
 * Data table that scrolls horizontally on narrow screens. The scroll region is
 * focusable so keyboard users can scroll it.
 */
export function AdminTable({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className={styles.scroller} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

/** Secondary line of text inside a table cell. */
export function CellNote({ children }: { children: ReactNode }) {
  return <span className={styles.note}>{children}</span>;
}
