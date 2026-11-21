"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".morgan-home");
    if (!root) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const heroText = gsap.utils.toArray<HTMLElement>(
        ".hero-kicker, .search-focus h1, .search-focus > p, .index-search, .search-suggestions",
        root,
      );
      gsap.fromTo(
        heroText,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.09, ease: "power3.out", clearProps: "opacity,visibility,transform" },
      );

      const navItems = gsap.utils.toArray<HTMLElement>(".engineering-nav > *", root);
      gsap.fromTo(
        navItems,
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.055, delay: 0.12, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );

      const revealItems = gsap.utils.toArray<HTMLElement>(".overview-heading, .overview-card", root);
      revealItems.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            delay: index > 0 && element.classList.contains("overview-card") ? (index % 3) * 0.07 : 0,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => media.revert();
  }, [pathname]);

  return null;
}
