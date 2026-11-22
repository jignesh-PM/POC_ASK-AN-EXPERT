"use client";

/** Id of the shell's sticky search input, so pages can send users to it. */
export const SUPPORT_COMPOSER_ID = "morgan-ai-prompt";

/** Scrolls to and focuses the shell's search input. */
export function focusSupportComposer() {
  const input = document.getElementById(SUPPORT_COMPOSER_ID);
  input?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  input?.focus({ preventScroll: true });
}
