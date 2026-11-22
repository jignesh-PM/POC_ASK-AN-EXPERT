import { categories, industries, products } from "./mock-data";
import { readCatalogSettings } from "./catalog-settings";

export const expertRoutingStorageKey = "morgan-search-routing-requests";

const expertTeams: Record<string, string> = {
  fibres: "Fibre Products team",
  refractories: "Refractories team",
  microporous: "Microporous team",
  pfp: "Passive Fire Protection team",
  "fire-assay": "Fire Assay team",
  engineering: "Engineering Services team",
};

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
    expertTeam: product ? assignedTeams[product.id] ?? assignedTeams[product.category] ?? expertTeams[product.category] ?? "Morgan technical support" : "Morgan technical support",
  };
}

export type SearchRoutingRequest = ReturnType<typeof getSearchContext> & {
  id: string;
  query: string;
  createdAt: string;
  status?: "Open" | "Search activity" | "Expert follow-up requested" | "In live chat" | "Resolved";
  publicFaq?: boolean;
  details?: string;
};

export function saveSearchRoutingRequest(query: string, industryId: string, productId: string): string {
  if (typeof window === "undefined") return "";
  const request: SearchRoutingRequest = {
    ...getSearchContext(industryId, productId),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    query: query.trim(),
    createdAt: new Date().toISOString(),
    status: "Open",
  };
  try {
    const existing = JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[];
    window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify([request, ...existing].slice(0, 50)));
  } catch {
    window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify([request]));
  }
  window.dispatchEvent(new Event("morgan-search-routing-updated"));
  return request.id;
}

export function submitExpertFollowUp(query: string, industryId: string, productId: string, details: string): string {
  if (typeof window === "undefined") return "";
  let requests: SearchRoutingRequest[] = [];
  try { requests = JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[]; } catch { requests = []; }
  const match = requests.find((request) => request.query === query.trim() && request.industryId === industryId && request.productId === productId);
  let requestId = match?.id ?? "";
  if (match) {
    match.status = "Expert follow-up requested";
    match.details = details.trim();
  } else {
    requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    requests.unshift({ ...getSearchContext(industryId, productId), id: requestId, query: query.trim(), createdAt: new Date().toISOString(), status: "Expert follow-up requested", details: details.trim() });
  }
  window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify(requests.slice(0, 50)));
  window.dispatchEvent(new Event("morgan-search-routing-updated"));
  return requestId;
}

export function appendConversationMessage(requestId: string, text: string, sender: "customer" | "expert"): boolean {
  if (typeof window === "undefined" || !text.trim()) return false;
  let requests: SearchRoutingRequest[] = [];
  let conversations: Record<string, { id: string; sender: "customer" | "expert"; text: string; createdAt: string }[]> = {};
  try { requests = JSON.parse(window.localStorage.getItem(expertRoutingStorageKey) || "[]") as SearchRoutingRequest[]; } catch { return false; }
  const request = requests.find((item) => item.id === requestId);
  if (!request) return false;
  try { conversations = JSON.parse(window.localStorage.getItem("morgan-expert-conversation-messages") || "{}"); } catch { conversations = {}; }
  const initialMessages = [
    { id: `${request.id}-question`, sender: "customer" as const, text: request.query, createdAt: request.createdAt },
    ...(request.details ? [{ id: `${request.id}-details`, sender: "customer" as const, text: request.details, createdAt: request.createdAt }] : []),
  ];
  const previous = conversations[requestId] ?? initialMessages;
  const message = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, sender, text: text.trim(), createdAt: new Date().toISOString() };
  conversations[requestId] = [...previous, message];
  window.localStorage.setItem("morgan-expert-conversation-messages", JSON.stringify(conversations));
  if (sender === "customer" && request.status !== "Resolved") request.status = "In live chat";
  window.localStorage.setItem(expertRoutingStorageKey, JSON.stringify(requests));
  window.dispatchEvent(new Event("morgan-chat-message-updated"));
  window.dispatchEvent(new Event("morgan-search-routing-updated"));
  return true;
}
