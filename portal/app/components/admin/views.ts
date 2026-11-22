/** Admin workspace views, addressed as `/admin?view=<id>`. Shared by the server page and the client sidebar. */
export const ADMIN_VIEWS = [
  { id: "overview", label: "Overview", description: "Accounts, questions and recent admin activity at a glance." },
  { id: "users", label: "Users & alpha IDs", description: "Create customer access, assign roles, import alpha users and deactivate accounts." },
  { id: "experts", label: "Expert teams", description: "Assign product managers, team members, backup experts, service hours and response targets." },
  { id: "content", label: "Content & knowledge", description: "Control which areas, products, documents, sources and certificates customers can see." },
  { id: "analytics", label: "Analytics & reports", description: "Review product demand and portal activity captured in this prototype." },
  { id: "settings", label: "Settings & audit", description: "Configure registration, profile requirements and default locale, and review changes." },
] as const;

export type AdminView = (typeof ADMIN_VIEWS)[number]["id"];

/** Resolves a `?view=` value to a known view, falling back to the overview. */
export function findAdminView(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return ADMIN_VIEWS.find((view) => view.id === candidate) ?? ADMIN_VIEWS[0];
}

export function adminViewHref(view: AdminView) {
  return view === "overview" ? "/admin" : `/admin?view=${view}`;
}
