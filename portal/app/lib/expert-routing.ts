"use client";

import { categories, industries, products } from "./mock-data";
import { readCatalogSettings } from "./catalog-settings";
import { STORAGE_KEYS, createId, readJSON, useStoredJSON, writeJSON } from "./storage";

const FALLBACK_TEAM = "Morgan technical support";

export function getSearchContext(industryId: string, productId: string) {
  const industry = industries.find((item) => item.id === industryId);
  const product = products.find((item) => item.id === productId);
  const category = product ? categories.find((item) => item.slug === product.category) : undefined;
  const assignedTeams = readCatalogSettings().expertTeams;
  return {
    industryId: industry?.id ?? "",
    industry: industry?.name ?? "",
    productId: product?.id ?? "",
    product: product?.name ?? "",
    category: category?.name ?? "",
    expertTeam: product ? assignedTeams[product.id] ?? assignedTeams[product.category] ?? product.expertTeam : FALLBACK_TEAM,
  };
}

export type RequestStatus = "Open" | "Expert follow-up requested" | "In live chat" | "Resolved";

export type SearchRoutingRequest = ReturnType<typeof getSearchContext> & {
  id: string;
  query: string;
  createdAt: string;
  status?: RequestStatus;
  details?: string;
};

export type ChatMessage = { id: string; sender: "customer" | "expert"; text: string; createdAt: string };

const EMPTY_REQUESTS: SearchRoutingRequest[] = [];
const EMPTY_MESSAGES: Record<string, ChatMessage[]> = {};

/** True once a human expert conversation exists for the request. */
export function isExpertThread(request: Pick<SearchRoutingRequest, "status">) {
  return request.status === "Expert follow-up requested" || request.status === "In live chat" || request.status === "Resolved";
}

export function threadHref(request: SearchRoutingRequest) {
  if (isExpertThread(request)) return `/expert?request=${encodeURIComponent(request.id)}`;
  return `/search?${new URLSearchParams({ q: request.query, industry: request.industryId, product: request.productId, team: request.expertTeam })}`;
}

export function useRoutingRequests(): SearchRoutingRequest[] {
  return useStoredJSON(STORAGE_KEYS.routingRequests, EMPTY_REQUESTS);
}

export function useConversationMessages(): Record<string, ChatMessage[]> {
  return useStoredJSON(STORAGE_KEYS.conversationMessages, EMPTY_MESSAGES);
}

function readRequests() {
  return readJSON(STORAGE_KEYS.routingRequests, EMPTY_REQUESTS);
}

function writeRequests(requests: SearchRoutingRequest[]) {
  writeJSON(STORAGE_KEYS.routingRequests, requests.slice(0, 50));
}

/** Records a Morgan AI question and returns its id. */
export function saveSearchRoutingRequest(query: string, industryId: string, productId: string): string {
  const request: SearchRoutingRequest = {
    ...getSearchContext(industryId, productId),
    id: createId("q"),
    query: query.trim(),
    createdAt: new Date().toISOString(),
    status: "Open",
  };
  writeRequests([request, ...readRequests()]);
  return request.id;
}

/** Escalates a question to the product's expert team, creating it if needed. */
export function submitExpertFollowUp(query: string, industryId: string, productId: string, details: string): string {
  const requests = readRequests();
  const match = requests.find((request) => request.query === query.trim() && request.industryId === industryId && request.productId === productId);
  if (match) {
    writeRequests(requests.map((request) => (request.id === match.id ? { ...request, status: "Expert follow-up requested", details: details.trim() } : request)));
    return match.id;
  }
  const id = createId("q");
  writeRequests([
    { ...getSearchContext(industryId, productId), id, query: query.trim(), createdAt: new Date().toISOString(), status: "Expert follow-up requested", details: details.trim() },
    ...requests,
  ]);
  return id;
}

export function setRequestStatus(requestId: string, status: RequestStatus) {
  writeRequests(readRequests().map((request) => (request.id === requestId ? { ...request, status } : request)));
}

/** The opening messages of a thread before anyone replies. */
export function initialMessages(request: Pick<SearchRoutingRequest, "id" | "query" | "details" | "createdAt">): ChatMessage[] {
  return [
    { id: `${request.id}-question`, sender: "customer", text: request.query, createdAt: request.createdAt },
    ...(request.details ? [{ id: `${request.id}-details`, sender: "customer" as const, text: request.details, createdAt: request.createdAt }] : []),
  ];
}

export function appendConversationMessage(requestId: string, text: string, sender: ChatMessage["sender"]): boolean {
  const request = readRequests().find((item) => item.id === requestId);
  if (!request || !text.trim()) return false;
  const conversations = readJSON(STORAGE_KEYS.conversationMessages, EMPTY_MESSAGES);
  const previous = conversations[requestId] ?? initialMessages(request);
  const message: ChatMessage = { id: createId("m"), sender, text: text.trim(), createdAt: new Date().toISOString() };
  writeJSON(STORAGE_KEYS.conversationMessages, { ...conversations, [requestId]: [...previous, message] });
  if (request.status !== "Resolved") setRequestStatus(requestId, sender === "customer" ? "Expert follow-up requested" : "In live chat");
  return true;
}
