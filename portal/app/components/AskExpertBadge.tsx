"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import gsap from "gsap";

export default function AskExpertBadge() {
  const chipRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".expert-chip-icon, .expert-chip-copy, .expert-chip-underline", { clearProps: "all" });
        return;
      }

      gsap.fromTo(chip, { autoAlpha: 0, y: -4 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(".expert-chip-icon", { scale: 0.82, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.45, delay: 0.12, ease: "back.out(1.8)" });
      gsap.fromTo(".expert-chip-copy", { autoAlpha: 0, x: 6 }, { autoAlpha: 1, x: 0, duration: 0.42, delay: 0.18, ease: "power2.out" });
      gsap.fromTo(".expert-chip-underline", { scaleX: 0 }, { scaleX: 1, duration: 0.7, delay: 0.4, repeat: -1, repeatDelay: 1.25, ease: "power2.inOut", transformOrigin: "left center" });
      gsap.to(".expert-chip-icon", { y: -1.5, duration: 1.15, delay: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".expert-chip-dot", { scale: 1.18, duration: 0.9, delay: 0.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, chip);

    return () => context.revert();
  }, []);

  return (
    <Link ref={chipRef} className="ask-expert-chip" href="/questions" aria-label="Ask the Expert" title="Ask the Expert">
      <span className="expert-chip-icon"><MessageCircle size={18} strokeWidth={2} aria-hidden="true" /><span className="expert-chip-dot" aria-hidden="true" /></span>
      <span className="expert-chip-copy"><span>ASK THE</span><strong>EXPERT</strong></span>
      <span className="expert-chip-underline" aria-hidden="true" />
    </Link>
  );
}
