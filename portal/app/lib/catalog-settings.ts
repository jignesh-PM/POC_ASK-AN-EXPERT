import { productMasters } from "./mock-data";

export const catalogSettingsStorageKey = "morgan-catalog-settings";
export const catalogSettingsUpdatedEvent = "morgan-catalog-settings-updated";

export type CatalogSettings = {
  hiddenProductIds: string[];
  hiddenDocumentIds: string[];
  hiddenCertificationIds: string[];
  expertTeams: Record<string, string>;
};

export function getDefaultCatalogSettings(): CatalogSettings {
  return {
    hiddenProductIds: [],
    hiddenDocumentIds: [],
    hiddenCertificationIds: [],
    expertTeams: Object.fromEntries(productMasters.map((master) => [master.id, master.expertTeam])),
  };
}

export function readCatalogSettings(): CatalogSettings {
  const defaults = getDefaultCatalogSettings();
  if (typeof window === "undefined") return defaults;
  try {
    const saved = JSON.parse(window.localStorage.getItem(catalogSettingsStorageKey) || "{}") as Partial<CatalogSettings>;
    return {
      hiddenProductIds: Array.isArray(saved.hiddenProductIds) ? saved.hiddenProductIds : defaults.hiddenProductIds,
      hiddenDocumentIds: Array.isArray(saved.hiddenDocumentIds) ? saved.hiddenDocumentIds : defaults.hiddenDocumentIds,
      hiddenCertificationIds: Array.isArray(saved.hiddenCertificationIds) ? saved.hiddenCertificationIds : defaults.hiddenCertificationIds,
      expertTeams: { ...defaults.expertTeams, ...(saved.expertTeams ?? {}) },
    };
  } catch {
    return defaults;
  }
}

export function writeCatalogSettings(settings: CatalogSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(catalogSettingsStorageKey, JSON.stringify(settings));
  window.dispatchEvent(new Event(catalogSettingsUpdatedEvent));
}
