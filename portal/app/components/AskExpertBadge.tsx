"use client";

import Link from "next/link";
import { MessageCircle } from "@/app/components/Icon";
import { useEffect, useRef } from "react";

export default function AskExpertBadge() {
  const badgeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;
    badge.classList.add("is-mounted");
    return () => badge.classList.remove("is-mounted");
  }, []);

  return (
    <Link ref={badgeRef} className="ask-expert-chip subheader-ask-expert-chip" href="/questions?mode=expert" onClick={() => window.dispatchEvent(new CustomEvent("morgan-support-mode-change", { detail: "expert" }))} aria-label="Start a chat with a Morgan subject matter expert" title="Talk to a Morgan expert">
      <span className="expert-chip-icon"><MessageCircle size={18} strokeWidth={2} aria-hidden="true" /></span>
      <span className="expert-chip-copy"><span>TALK TO</span><strong>EXPERT</strong></span>
      <span className="expert-chip-underline" aria-hidden="true" />
    </Link>
  );
}
