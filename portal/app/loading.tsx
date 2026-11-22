import styles from "./components/shell/StatusPage.module.css";

export default function Loading() {
  return (
    <main className={styles.page} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.loadingText}>Loading…</p>
    </main>
  );
}
