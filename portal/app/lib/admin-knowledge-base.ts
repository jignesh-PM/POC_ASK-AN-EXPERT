"use client";

import type { IndexedResource } from "./site-index";
import { STORAGE_KEYS, useStoredJSON, writeJSON } from "./storage";

export type AdminKnowledgeResource = IndexedResource & { visible: boolean; uploadedAt: string };

const EMPTY: AdminKnowledgeResource[] = [];

export function useAdminKnowledgeBase(): AdminKnowledgeResource[] {
  return useStoredJSON(STORAGE_KEYS.knowledgeBase, EMPTY);
}

/** Admin-added sources that are published to customers. */
export function usePublishedKnowledge(): AdminKnowledgeResource[] {
  return useAdminKnowledgeBase().filter((resource) => resource.visible);
}

export function writeAdminKnowledgeBase(resources: AdminKnowledgeResource[]) {
  writeJSON(STORAGE_KEYS.knowledgeBase, resources);
}
