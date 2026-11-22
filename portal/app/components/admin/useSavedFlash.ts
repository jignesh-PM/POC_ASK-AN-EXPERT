"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appendAudit } from "@/app/lib/session";

/**
 * Records an admin change in the audit log and shows a brief "Saved" confirmation.
 * Call `record(action, detail)` right after writing through a lib function.
 */
export function useSavedFlash(duration = 2000) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const record = useCallback(
    (action: string, detail: string) => {
      appendAudit(action, detail);
      setSaved(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setSaved(false), duration);
    },
    [duration],
  );

  return { saved, record };
}
