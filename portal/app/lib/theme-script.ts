/**
 * Inline script for <head> that sets `<html data-theme>` before first paint, so
 * the page never flashes the wrong theme. Server-safe (no "use client"), because
 * the root layout embeds it as a string. Mirrors `useTheme` in ./theme.ts:
 * the saved choice ("morgan-theme" in localStorage), otherwise light.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("morgan-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})();`;
