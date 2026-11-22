import type { ReactNode } from "react";
import { Headset, Sparkles, UserRound } from "../Icon";
import { cx } from "../ui";
import { MascotOr } from "../mascot/Mascot";
import type { MascotMood } from "@/app/lib/mascot";
import styles from "./Chat.module.css";

export type ChatAuthor = "customer" | "expert" | "ai";

const AVATARS = { customer: UserRound, expert: Headset, ai: Sparkles } as const;

type ChatBubbleProps = {
  author: ChatAuthor;
  /** Display name shown above the bubble. */
  name: ReactNode;
  /** ISO timestamp; rendered as a `<time>` with the formatted `timeLabel`. */
  dateTime?: string;
  timeLabel?: string;
  /** `end` puts the bubble on the right (the viewer's own messages). */
  align?: "start" | "end";
  /** Mascot mood for Morgan AI messages (the mascot is the face of Morgan AI). */
  mood?: MascotMood;
  children: ReactNode;
};

/** One message in a conversation: avatar, byline with timestamp, and the bubble. */
export function ChatBubble({ author, name, dateTime, timeLabel, align = "start", mood = "idle", children }: ChatBubbleProps) {
  const Avatar = AVATARS[author];
  const avatar = (
    <span className={cx(styles.avatar, styles[`avatar-${author}`])} aria-hidden="true">
      <Avatar size={16} />
    </span>
  );
  return (
    <article className={cx(styles.message, align === "end" && styles.end, author === "ai" && styles.wide)}>
      {author === "ai" ? <MascotOr mood={mood} size="xs" fallback={avatar} className={styles.mascotAvatar} /> : avatar}
      <div className={styles.body}>
        <p className={styles.byline}>
          <strong>{name}</strong>
          {timeLabel && <time dateTime={dateTime}>{timeLabel}</time>}
        </p>
        <div className={cx(styles.bubble, styles[`bubble-${author}`], align === "end" && styles.bubbleEnd)}>{children}</div>
      </div>
    </article>
  );
}
