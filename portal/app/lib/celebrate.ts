"use client";

/**
 * A small burst of brand-coloured sparks from an element — used for success
 * moments (profile saved, expert chat started). Pure DOM + Web Animations, no
 * library; does nothing when the user prefers reduced motion.
 */
export function celebrate(origin: Element | null | undefined, count = 16) {
  if (!origin || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const colours = ["var(--color-accent)", "var(--color-brand-fill)", "var(--color-accent-on-fill)", "var(--color-success)"];

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    const size = 5 + Math.random() * 5;
    Object.assign(spark.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * (Math.random() > 0.5 ? 1 : 0.45)}px`,
      borderRadius: "2px",
      background: colours[index % colours.length],
      pointerEvents: "none",
      zIndex: "200",
    });
    document.body.appendChild(spark);

    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.4;
    const distance = 50 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30;
    spark
      .animate(
        [
          { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 40}px)) scale(0.6) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration: 800 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.25,1)" },
      )
      .finished.finally(() => spark.remove());
  }
}
