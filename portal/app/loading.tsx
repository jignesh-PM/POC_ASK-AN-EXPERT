import Mascot from "./components/mascot/Mascot";
import styles from "./components/shell/StatusPage.module.css";

export default function Loading() {
  return (
    <main className={styles.page} role="status" aria-live="polite">
      <Mascot mood="think" size="sm" />
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.loadingText}>Loading…</p>
    </main>
  );
}
