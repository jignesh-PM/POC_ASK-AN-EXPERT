/** Admin workspace views, addressed as `/admin?view=<id>`. Shared by the server page and the client sidebar. */
export const ADMIN_VIEWS = [
  { id: "overview", label: "Overview", description: "Accounts, questions and recent activity." },
  { id: "users", label: "Users & alpha IDs", description: "Add users, assign roles and manage access." },
  { id: "experts", label: "Expert teams", description: "Set experts, service hours and response targets for each product line." },
  { id: "content", label: "Content & knowledge", description: "Choose what customers can see." },
  { id: "analytics", label: "Analytics & reports", description: "Product demand and portal activity." },
  { id: "settings", label: "Settings & audit", description: "Registration, profile rules, default region and the audit log." },
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
