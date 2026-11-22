import Link from "next/link";
import styles from "./AskExpertButton.module.css";

/**
 * Animated "Ask an Expert" badge in the header: a speech bubble with a
 * question mark and typing dots, with a soft pulse ring. Opens the expert chat.
 */
export default function AskExpertButton() {
  return (
    <Link href="/questions?mode=expert" className={styles.button} aria-label="Ask an expert: start a chat with a Morgan specialist">
      <span className={styles.bubble} aria-hidden="true">
        <svg viewBox="0 0 40 40" className={styles.bubbleIcon}>
          <path className={styles.bubbleShape} d="M8 6h24a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5H18l-7 6v-6H8a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Z" />
          <text className={styles.question} x="20" y="22" textAnchor="middle">
            ?
          </text>
        </svg>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className={styles.copy} aria-hidden="true">
        <small>Ask an</small>
        <strong>Expert</strong>
      </span>
    </Link>
  );
}
