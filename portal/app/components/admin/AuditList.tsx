import { ClipboardList } from "@/app/components/Icon";
import { EmptyState } from "@/app/components/ui";
import type { AuditEvent } from "@/app/lib/session";
import { formatDateTime } from "./admin-store";
import styles from "./AuditList.module.css";

/** Chronological list of Super Admin changes. */
export function AuditList({ events, limit }: { events: AuditEvent[]; limit?: number }) {
  if (!events.length) {
    return <EmptyState icon={<ClipboardList size={22} />} title="No changes yet" description="Admin changes appear here." />;
  }
  return (
    <ol className={styles.list}>
      {events.slice(0, limit).map((event, index) => (
        <li className={styles.item} key={`${event.at}-${index}`}>
          <strong className={styles.action}>{event.action}</strong>
          <span className={styles.detail}>{event.detail}</span>
          <time className={styles.time} dateTime={event.at}>
            {formatDateTime(event.at)}
          </time>
        </li>
      ))}
    </ol>
  );
}
