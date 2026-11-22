const motionTargets = [
  ".home-conversation-card",
  ".home-product-card",
  ".home-resource-row",
  ".overview-card",
  ".simple-card",
  ".category-card",
  ".document-row",
  ".tool-card",
  ".compliance-cert-card",
  ".expert-thread-option",
  ".chat-recommended-card",
].join(",");

/** Adds small, viewport-aware transitions using browser APIs only. */
export function observePortalMotion(root: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const targets = Array.from(root.querySelectorAll<HTMLElement>(motionTargets));
  if (!targets.length) return () => {};

  const reveal = (element: HTMLElement, index: number) => {
    if (element.dataset.motionShown === "true") return;
    element.dataset.motionShown = "true";

    if (element.matches(".home-conversation-card, .home-product-card, .home-resource-row")) {
      element.classList.add("is-revealed");
      return;
    }

    if (getComputedStyle(element).animationName !== "none") return;
    element.animate(
      [
        { opacity: 0, transform: "translate3d(0, 12px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 380,
        delay: Math.min(index % 4, 3) * 45,
        easing: "cubic-bezier(.2,.7,.25,1)",
        fill: "none",
      },
    );
  };

  if (!("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return () => {};
  }

  const indexByElement = new Map(targets.map((element, index) => [element, index]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      reveal(element, indexByElement.get(element) ?? 0);
      observer.unobserve(element);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

  targets.forEach((target) => observer.observe(target));
  return () => observer.disconnect();
}
