"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Prototype persistence layer.
 *
 * Every piece of portal state lives in `localStorage`. Components never touch
 * `window.localStorage` directly: they read through the hooks below (which use
 * `useSyncExternalStore`, so there is no setState-in-effect and no hydration
 * mismatch) and write through `writeJSON` / `writeString`, which notify every
 * subscriber in this tab and, via the native `storage` event, in other tabs.
 */
export const STORAGE_KEYS = {
  role: "prototype-role",
  region: "morgan-region",
  language: "morgan-language",
  profile: "morgan-profile-details",
  profileEmail: "morgan-profile-email",
  adminSettings: "morgan-admin-settings",
  adminUsers: "morgan-admin-users",
  adminAudit: "morgan-admin-audit-log",
  adminAreaVisibility: "morgan-admin-main-area-visibility",
  teamRouting: "morgan-expert-team-routing",
  catalogSettings: "morgan-catalog-settings",
  knowledgeBase: "morgan-admin-knowledge-base",
  toolData: "morgan-admin-restricted-tool-data",
  routingRequests: "morgan-search-routing-requests",
  conversationMessages: "morgan-expert-conversation-messages",
  searchIndustry: "morgan-search-industry",
  searchProduct: "morgan-search-product",
  analytics: "morgan-analytics-events",
  welcomeRead: "morgan-welcome-notification-read",
  directionNote: "morgan-portal-direction-note",
  theme: "morgan-theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const CHANGE_EVENT = "morgan-storage-change";

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function notify(key: string) {
  window.dispatchEvent(new CustomEvent<string>(CHANGE_EVENT, { detail: key }));
}

export function readString(key: StorageKey): string | null {
  return storage()?.getItem(key) ?? null;
}

export function readJSON<T>(key: StorageKey, fallback: T): T {
  const raw = readString(key);
  if (raw === null) return fallback;
  try {
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key: StorageKey, value: string | null) {
  const store = storage();
  if (!store) return;
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    /* Storage can be full or blocked; the prototype keeps working without it. */
  }
  notify(key);
}

export function writeJSON<T>(key: StorageKey, value: T) {
  writeString(key, JSON.stringify(value));
}

/** Read-modify-write helper for list or record values. */
export function updateJSON<T>(key: StorageKey, fallback: T, update: (current: T) => T): T {
  const next = update(readJSON(key, fallback));
  writeJSON(key, next);
  return next;
}

function subscribe(key: string, callback: () => void) {
  const onCustom = (event: Event) => {
    if ((event as CustomEvent<string>).detail === key) callback();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key) callback();
  };
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

/** Subscribes to the raw stored string. Returns `null` during SSR and hydration. */
export function useStoredString(key: StorageKey): string | null {
  return useSyncExternalStore(
    (callback) => subscribe(key, callback),
    () => readString(key),
    () => null,
  );
}

/**
 * Subscribes to a JSON value. `fallback` should be a module-level constant (or
 * otherwise referentially stable) so consumers get a stable value.
 */
export function useStoredJSON<T>(key: StorageKey, fallback: T): T {
  const raw = useStoredString(key);
  return useMemo(() => {
    if (raw === null) return fallback;
    try {
      return (JSON.parse(raw) as T) ?? fallback;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
}

/** `true` once the component is running in the browser after hydration. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
