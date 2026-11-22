"use client";

import type { ReactNode } from "react";
import { mascotConfig, type MascotMood } from "@/app/lib/mascot";
import { useAdminSettings } from "@/app/lib/session";
import { cx } from "../ui/cx";
import MascotArt from "./MascotArt";
import styles from "./Mascot.module.css";

type MascotProps = {
  mood?: MascotMood;
  size?: "xs" | "sm" | "md" | "lg";
  /** Speech bubble text. `true` uses the mood's default line from the config. */
  say?: ReactNode | true;
  /** Where the speech bubble sits relative to the character. */
  bubble?: "right" | "top";
  className?: string;
};

/** Whether the guide is switched on (config master switch and admin setting). */
export function useMascotEnabled() {
  const { mascotEnabled } = useAdminSettings();
  return mascotConfig.enabled && mascotEnabled;
}

/**
 * The portal guide. Purely decorative for assistive tech: any message it says is
 * also rendered as text, so meaning never depends on the illustration.
 */
export default function Mascot({ mood = "wave", size = "md", say, bubble = "right", className }: MascotProps) {
  const enabled = useMascotEnabled();
  if (!enabled) return null;
  const message = say === true ? mascotConfig.lines[mood][0] : say;

  return (
    <div className={cx(styles.mascot, styles[size], message ? styles[`bubble-${bubble}`] : undefined, className)}>
      <div className={styles.character}>
        <MascotArt mood={mood} />
      </div>
      {message && (
        <p className={styles.bubble} role="status">
          <span className="visually-hidden">{mascotConfig.name}: </span>
          {message}
        </p>
      )}
    </div>
  );
}

/** Shows the mascot in `mood`, or `fallback` (usually an icon) when the guide is switched off. */
export function MascotOr({ fallback, ...props }: MascotProps & { fallback?: ReactNode }) {
  const enabled = useMascotEnabled();
  return enabled ? <Mascot {...props} /> : <>{fallback}</>;
}
