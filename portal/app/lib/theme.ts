"use client";

import { useEffect } from "react";
import { STORAGE_KEYS, useHydrated, useStoredString, writeString } from "./storage";

export type Theme = "light" | "dark";

/** The active theme: the saved choice, light by default. */
export function useTheme(): Theme {
  return useStoredString(STORAGE_KEYS.theme) === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  writeString(STORAGE_KEYS.theme, theme);
}

/** Keeps `<html data-theme>` in step with the store (e.g. changes from another tab). */
export function useApplyTheme() {
  const theme = useTheme();
  // Skip the hydration render: it sees the server snapshot, while the init script already set the right theme.
  const hydrated = useHydrated();
  useEffect(() => {
    if (hydrated) document.documentElement.dataset.theme = theme;
  }, [hydrated, theme]);
}
