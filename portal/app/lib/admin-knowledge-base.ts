import type { IndexedResource } from "./site-index";

export const adminKnowledgeBaseStorageKey = "morgan-admin-knowledge-base";
export const adminKnowledgeBaseUpdatedEvent = "morgan-admin-knowledge-base-updated";

export type AdminKnowledgeResource = IndexedResource & { visible: boolean; uploadedAt: string };

export function readAdminKnowledgeBase(): AdminKnowledgeResource[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(adminKnowledgeBaseStorageKey) || "[]") as AdminKnowledgeResource[]; }
  catch { return []; }
}

export function writeAdminKnowledgeBase(resources: AdminKnowledgeResource[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(adminKnowledgeBaseStorageKey, JSON.stringify(resources));
  window.dispatchEvent(new Event(adminKnowledgeBaseUpdatedEvent));
}
