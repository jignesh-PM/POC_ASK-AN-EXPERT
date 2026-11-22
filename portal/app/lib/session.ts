"use client";

import { STORAGE_KEYS, readJSON, updateJSON, useStoredJSON, useStoredString, writeString } from "./storage";
import { DEFAULT_LANGUAGE, DEFAULT_REGION } from "./locale";

/* ---------- Roles ---------- */

export const ROLES = ["Visitor", "Customer", "Morgan User", "Super Admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  Visitor: "Visitor",
  Customer: "Customer",
  "Morgan User": "Morgan",
  "Super Admin": "Admin",
};

export function isRole(value: string | null): value is Role {
  return ROLES.includes(value as Role);
}

/** Morgan staff answer customer questions and see the expert inbox. */
export function isStaff(role: Role) {
  return role === "Morgan User" || role === "Super Admin";
}

export function roleHome(role: Role) {
  return role === "Morgan User" ? "/expert" : role === "Super Admin" ? "/admin" : "/";
}

export function useRole(): Role {
  const raw = useStoredString(STORAGE_KEYS.role);
  return isRole(raw) ? raw : "Visitor";
}

export function readRole(): Role {
  if (typeof window === "undefined") return "Visitor";
  const raw = window.localStorage.getItem(STORAGE_KEYS.role);
  return isRole(raw) ? raw : "Visitor";
}

export function setRole(role: Role) {
  writeString(STORAGE_KEYS.role, role === "Visitor" ? null : role);
}

/* ---------- Admin portal settings ---------- */

export type AdminSettings = {
  signupEnabled: boolean;
  requireProfile: boolean;
  defaultRegion: string;
  defaultLanguage: string;
};

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  signupEnabled: true,
  requireProfile: false,
  defaultRegion: DEFAULT_REGION,
  defaultLanguage: DEFAULT_LANGUAGE,
};

const EMPTY_SETTINGS: Partial<AdminSettings> = {};

export function useAdminSettings(): AdminSettings {
  const saved = useStoredJSON(STORAGE_KEYS.adminSettings, EMPTY_SETTINGS);
  return { ...DEFAULT_ADMIN_SETTINGS, ...saved };
}

export function readAdminSettings(): AdminSettings {
  return { ...DEFAULT_ADMIN_SETTINGS, ...readJSON(STORAGE_KEYS.adminSettings, EMPTY_SETTINGS) };
}

/* ---------- Region and language preferences ---------- */

export function useRegion(): string {
  const stored = useStoredString(STORAGE_KEYS.region);
  const { defaultRegion } = useAdminSettings();
  return stored || defaultRegion;
}

export function setRegion(region: string) {
  writeString(STORAGE_KEYS.region, region);
}

export function useLanguage(): string {
  const stored = useStoredString(STORAGE_KEYS.language);
  const { defaultLanguage } = useAdminSettings();
  return stored || defaultLanguage;
}

export function setLanguage(language: string) {
  writeString(STORAGE_KEYS.language, language);
}

/* ---------- Audit log (Super Admin changes) ---------- */

export type AuditEvent = { action: string; detail: string; at: string };
const EMPTY_AUDIT: AuditEvent[] = [];

export function appendAudit(action: string, detail: string) {
  updateJSON(STORAGE_KEYS.adminAudit, EMPTY_AUDIT, (current) =>
    [{ action, detail, at: new Date().toISOString() }, ...current].slice(0, 100),
  );
}

export function useAuditLog(): AuditEvent[] {
  return useStoredJSON(STORAGE_KEYS.adminAudit, EMPTY_AUDIT);
}

/* ---------- Usage analytics ---------- */

export type PortalEvent = {
  type: "page_view" | "tool_view" | "product_view" | "official_link" | "download";
  path: string;
  target?: string;
  role: string;
  region: string;
  language: string;
  at: string;
};
const EMPTY_EVENTS: PortalEvent[] = [];

export function trackEvent(event: Omit<PortalEvent, "at">) {
  updateJSON(STORAGE_KEYS.analytics, EMPTY_EVENTS, (current) =>
    [{ ...event, at: new Date().toISOString() }, ...current].slice(0, 1000),
  );
}

export function useAnalyticsEvents(): PortalEvent[] {
  return useStoredJSON(STORAGE_KEYS.analytics, EMPTY_EVENTS);
}
