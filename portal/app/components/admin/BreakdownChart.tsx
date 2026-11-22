import styles from "./BreakdownChart.module.css";

type Row = { label: string; count: number };

/** Horizontal bar rows: label, proportional bar and count. */
export function BreakdownChart({ rows, label }: { rows: Row[]; label: string }) {
  const max = Math.max(0, ...rows.map((row) => row.count));
  return (
    <ul className={styles.chart} aria-label={label}>
      {rows.map((row) => (
        <li className={styles.row} key={row.label}>
          <span className={styles.label}>{row.label}</span>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.bar} style={{ width: max ? `${Math.max(3, (row.count / max) * 100)}%` : "0%" }} />
          </span>
          <strong className={styles.count}>{row.count}</strong>
        </li>
      ))}
    </ul>
  );
}
