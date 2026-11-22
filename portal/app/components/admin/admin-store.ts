"use client";

import { readCatalogSettings, writeCatalogSettings } from "@/app/lib/catalog-settings";
import type { SearchRoutingRequest } from "@/app/lib/expert-routing";
import { categories } from "@/app/lib/mock-data";
import { ROLES, type Role } from "@/app/lib/session";
import { STORAGE_KEYS, updateJSON, useStoredJSON, writeJSON } from "@/app/lib/storage";

/* ---------- Managed user accounts ---------- */

export type ManagedRole = Exclude<Role, "Visitor">;
export const MANAGED_ROLES = ROLES.filter((role): role is ManagedRole => role !== "Visitor");

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  role: ManagedRole;
  /** Category slugs a Morgan User answers for. */
  productLines: string[];
  active: boolean;
  createdAt: string;
};

const NO_USERS: AdminUser[] = [];

export function useAdminUsers(): AdminUser[] {
  return useStoredJSON(STORAGE_KEYS.adminUsers, NO_USERS);
}

export function writeAdminUsers(users: AdminUser[]) {
  writeJSON(STORAGE_KEYS.adminUsers, users);
}

export function isManagedRole(value: string | undefined): value is ManagedRole {
  return MANAGED_ROLES.includes(value as ManagedRole);
}

/* ---------- Expert team routing per product line ---------- */

export type TeamRoute = { manager: string; members: string; backup: string; hours: string; responseHours: number; region: string };
export const DEFAULT_ROUTE: TeamRoute = { manager: "", members: "", backup: "", hours: "Mon–Fri, 09:00–17:00", responseHours: 24, region: "Global" };

const NO_ROUTES: Record<string, Partial<TeamRoute>> = {};

export function useTeamRouting(): Record<string, Partial<TeamRoute>> {
  return useStoredJSON(STORAGE_KEYS.teamRouting, NO_ROUTES);
}

/** Saves a product line's routing and publishes the team label to the catalog so questions route to it. */
export function saveTeamRoute(categorySlug: string, route: TeamRoute) {
  updateJSON(STORAGE_KEYS.teamRouting, NO_ROUTES, (current) => ({ ...current, [categorySlug]: route }));
  const teamLabel = [route.manager && `Product manager: ${route.manager}`, route.members && `Team: ${route.members}`, route.backup && `Backup: ${route.backup}`]
    .filter(Boolean)
    .join(" · ");
  if (!teamLabel) return;
  const settings = readCatalogSettings();
  writeCatalogSettings({ ...settings, expertTeams: { ...settings.expertTeams, [categorySlug]: teamLabel } });
}

/* ---------- Main area visibility ---------- */

const NO_HIDDEN_AREAS: string[] = [];

export function useHiddenAreas(): string[] {
  return useStoredJSON(STORAGE_KEYS.adminAreaVisibility, NO_HIDDEN_AREAS);
}

export function toggleAreaVisibility(slug: string) {
  updateJSON(STORAGE_KEYS.adminAreaVisibility, NO_HIDDEN_AREAS, (hidden) => (hidden.includes(slug) ? hidden.filter((item) => item !== slug) : [...hidden, slug]));
}

/* ---------- Restricted tool data ---------- */

export type ToolCertificate = { id: string; name: string; product: string; region: string; uploadedAt: string; dataUrl?: string };
export type ToolData = { gasFactor: string; electricityFactor: string; certificates: ToolCertificate[] };

export const DEFAULT_TOOL_DATA: ToolData = { gasFactor: "0.202", electricityFactor: "0.40", certificates: [] };
const NO_TOOL_DATA: Partial<ToolData> = {};

export function useToolData(): ToolData {
  return { ...DEFAULT_TOOL_DATA, ...useStoredJSON(STORAGE_KEYS.toolData, NO_TOOL_DATA) };
}

/** Read-modify-write so async uploads never overwrite newer changes. */
export function updateToolData(update: (current: ToolData) => ToolData) {
  updateJSON(STORAGE_KEYS.toolData, NO_TOOL_DATA, (saved) => update({ ...DEFAULT_TOOL_DATA, ...saved }));
}

/* ---------- Reporting helpers ---------- */

export function questionsByProductLine(requests: SearchRoutingRequest[]) {
  return categories
    .map((category) => ({ label: category.name, count: requests.filter((request) => request.category === category.name).length }))
    .sort((a, b) => b.count - a.count);
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString();
}
