"use client";

import { productMasters } from "./mock-data";
import { STORAGE_KEYS, readJSON, useStoredJSON, writeJSON } from "./storage";

export type CatalogSettings = {
  hiddenProductIds: string[];
  hiddenDocumentIds: string[];
  hiddenCertificationIds: string[];
  /** Expert team by product master id or product id. */
  expertTeams: Record<string, string>;
};

const DEFAULT_TEAMS = Object.fromEntries(productMasters.map((master) => [master.id, master.expertTeam]));
const EMPTY: Partial<CatalogSettings> = {};

function normalize(saved: Partial<CatalogSettings>): CatalogSettings {
  return {
    hiddenProductIds: Array.isArray(saved.hiddenProductIds) ? saved.hiddenProductIds : [],
    hiddenDocumentIds: Array.isArray(saved.hiddenDocumentIds) ? saved.hiddenDocumentIds : [],
    hiddenCertificationIds: Array.isArray(saved.hiddenCertificationIds) ? saved.hiddenCertificationIds : [],
    expertTeams: { ...DEFAULT_TEAMS, ...(saved.expertTeams ?? {}) },
  };
}

export function readCatalogSettings(): CatalogSettings {
  return normalize(readJSON(STORAGE_KEYS.catalogSettings, EMPTY));
}

export function writeCatalogSettings(settings: CatalogSettings) {
  writeJSON(STORAGE_KEYS.catalogSettings, settings);
}

export function useCatalogSettings(): CatalogSettings {
  return normalize(useStoredJSON(STORAGE_KEYS.catalogSettings, EMPTY));
}

/** Toggles `id` in one of the hidden-id lists and persists the result. */
export function toggleHidden(list: "hiddenProductIds" | "hiddenDocumentIds" | "hiddenCertificationIds", id: string) {
  const settings = readCatalogSettings();
  const current = settings[list];
  writeCatalogSettings({ ...settings, [list]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
}
