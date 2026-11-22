"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowDownToLine, BadgeCheck, Boxes, Check, FileText, Plus, Settings, Shield, Users } from "@/app/components/Icon";
import IndexedCatalogManager from "./IndexedCatalogManager";
import RegionalComplianceManager from "./RegionalComplianceManager";
import AdminToolDataManager from "./AdminToolDataManager";
import AdminKnowledgeBaseManager from "./AdminKnowledgeBaseManager";
import { categories, mainAreas } from "../lib/mock-data";
import { expertRoutingStorageKey, type SearchRoutingRequest } from "../lib/expert-routing";
import { readCatalogSettings, writeCatalogSettings } from "../lib/catalog-settings";

type AdminUser = { id: string; name: string; email: string; company: string; country: string; role: "Customer" | "Morgan User" | "Super Admin"; productLines: string[]; active: boolean; createdAt: string };
type TeamRoute = { manager: string; members: string; backup: string; hours: string; responseHours: number; region: string };
type AdminEvent = { action: string; detail: string; at: string };
type PortalEvent = { type: string; path: string; role: string; region: string; language: string; at: string };
const USERS_KEY = "morgan-admin-users";
const ROUTES_KEY = "morgan-expert-team-routing";
const AUDIT_KEY = "morgan-admin-audit-log";
const SETTINGS_KEY = "morgan-admin-settings";
const AREAS_KEY = "morgan-admin-main-area-visibility";
const FALLBACK_ROUTE: TeamRoute = { manager: "", members: "", backup: "", hours: "Monâ€“Fri, 09:00â€“17:00", responseHours: 24, region: "Global" };

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

export default function AdminWorkspace({ view }: { view: string }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<SearchRoutingRequest[]>([]);
  const [portalEvents, setPortalEvents] = useState<PortalEvent[]>([]);
  const [routes, setRoutes] = useState<Record<string, TeamRoute>>({});
  const [audit, setAudit] = useState<AdminEvent[]>([]);
  const [settings, setSettings] = useState({ signupEnabled: true, requireProfile: false, defaultRegion: "EMEA", defaultLanguage: "English" });
  const [hiddenAreas, setHiddenAreas] = useState<string[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", company: "", country: "", role: "Customer" as AdminUser["role"] });
  const [csvText, setCsvText] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = window.localStorage.getItem("prototype-role") || "Visitor";
    setAuthorized(role === "Super Admin");
    setUsers(load(USERS_KEY, []));
    setRequests(load(expertRoutingStorageKey, []));
    setPortalEvents(load("morgan-analytics-events", []));
    setRoutes(load(ROUTES_KEY, {}));
    setAudit(load(AUDIT_KEY, []));
    setSettings(load(SETTINGS_KEY, settings));
    setHiddenAreas(load(AREAS_KEY, []));
    setReady(true);
    const sync = () => { setRequests(load(expertRoutingStorageKey, [])); setPortalEvents(load("morgan-analytics-events", [])); setAudit(load(AUDIT_KEY, [])); };
    window.addEventListener("morgan-search-routing-updated", sync);
    window.addEventListener("morgan-analytics-updated", sync);
    window.addEventListener("morgan-admin-audit-updated", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("morgan-search-routing-updated", sync); window.removeEventListener("morgan-analytics-updated", sync); window.removeEventListener("morgan-admin-audit-updated", sync); window.removeEventListener("storage", sync); };
  // Initial state is read once from the prototype session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const writeAndLog = (action: string, detail: string, update: () => void) => {
    update();
    const next = [{ action, detail, at: new Date().toISOString() }, ...load<AdminEvent[]>(AUDIT_KEY, [])].slice(0, 100);
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
    setAudit(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const saveUserList = (next: AdminUser[]) => writeAndLog("Users updated", `${next.length} managed accounts`, () => { setUsers(next); window.localStorage.setItem(USERS_KEY, JSON.stringify(next)); });
  const updateRoute = (categoryId: string, field: keyof TeamRoute, value: string | number) => setRoutes((current) => ({ ...current, [categoryId]: { ...FALLBACK_ROUTE, ...current[categoryId], [field]: value } }));
  const saveRoute = (categoryId: string) => {
    const next = { ...routes, [categoryId]: { ...FALLBACK_ROUTE, ...routes[categoryId] } };
    const route = next[categoryId];
    const assignedTeam = [route.manager && `Product manager: ${route.manager}`, route.members && `Team: ${route.members}`, route.backup && `Backup: ${route.backup}`].filter(Boolean).join(" Â· ");
    const catalogSettings = readCatalogSettings();
    if (assignedTeam) catalogSettings.expertTeams[categoryId] = assignedTeam;
    writeAndLog("Expert routing updated", categories.find((item) => item.slug === categoryId)?.name ?? categoryId, () => { setRoutes(next); window.localStorage.setItem(ROUTES_KEY, JSON.stringify(next)); writeCatalogSettings(catalogSettings); });
  };
  const createUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) { setError("Name and email are required."); return; }
    if (users.some((user) => user.email.toLowerCase() === newUser.email.trim().toLowerCase())) { setError("An account already uses that email address."); return; }
    const account: AdminUser = { ...newUser, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, productLines: [], active: true, createdAt: new Date().toISOString() };
    saveUserList([account, ...users]);
    setNewUser({ name: "", email: "", company: "", country: "", role: "Customer" });
    setError("");
  };
  const importCsv = () => {
    const rows = csvText.split(/\r?\n/).map((row) => row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))).filter((row) => row.length >= 2 && row.some(Boolean));
    const start = rows[0]?.[0]?.toLowerCase().includes("name") ? 1 : 0;
    const imported = rows.slice(start).filter((row) => row[0] && row[1]).map((row, index): AdminUser => ({ id: `csv-${Date.now()}-${index}`, name: row[0], email: row[1], company: row[2] ?? "", country: row[3] ?? "", role: row[4] === "Morgan User" || row[4] === "Super Admin" ? row[4] : "Customer", productLines: [], active: true, createdAt: new Date().toISOString() }));
    const newAccounts = imported.filter((candidate) => !users.some((user) => user.email.toLowerCase() === candidate.email.toLowerCase()));
    if (!newAccounts.length) { setError("No new accounts were found. Use name,email,company,country,role columns."); return; }
    saveUserList([...newAccounts, ...users]);
    setCsvText(""); setError("");
  };
  const updateUser = (id: string, update: Partial<AdminUser>) => saveUserList(users.map((user) => user.id === id ? { ...user, ...update } : user));
  const saveSettings = (next: typeof settings) => writeAndLog("Portal settings updated", "Registration, profile and locale preferences", () => { setSettings(next); window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event("morgan-admin-settings-updated")); });
  const visibleRequestCount = requests.length;
  const openRequests = requests.filter((request) => request.status !== "Resolved").length;
  const productBreakdown = useMemo(() => categories.map((category) => ({ name: category.name, count: requests.filter((request) => request.category === category.name).length })).sort((a, b) => b.count - a.count), [requests]);

  if (!ready) return <main className="admin-access-state">Loading admin workspaceâ€¦</main>;
  if (!authorized) return <main className="admin-access-state"><span><Shield size={22} /></span><h1>Super Admin access required</h1><p>Use the account menu to select the Super Admin preview, then return to this page.</p><button type="button" onClick={() => router.push("/")}>Return to home</button></main>;

  const navItems = [
    ["overview", "Overview", Activity], ["users", "Users & alpha IDs", Users], ["experts", "Expert teams", Boxes], ["content", "Content & knowledge", FileText], ["analytics", "Analytics & reports", Activity], ["settings", "Settings & audit", Settings],
  ] as const;
  const activeView = navItems.some(([id]) => id === view) ? view : "overview";

  return <main className="workspace-shell admin-workspace-shell"><div className="admin-layout admin-functional-layout">
    <aside className="admin-sidebar admin-functional-sidebar"><p>ADMINISTRATION</p>{navItems.map(([id, label, Icon]) => <Link className={activeView === id ? "active" : ""} href={id === "overview" ? "/admin" : `/admin?view=${id}`} key={id}><Icon size={16} aria-hidden="true" />{label}</Link>)}</aside>
    <section className="admin-main admin-functional-main"><header className="admin-workspace-heading"><div><p>SUPER ADMIN WORKSPACE</p><h1>{navItems.find(([id]) => id === activeView)?.[1]}</h1></div><span role="status">{saved ? <><Check size={14} /> Changes saved</> : "Morgan Ask the Expert"}</span></header>
      {activeView === "overview" && <><div className="metric-grid"><article className="metric-card"><span>Managed accounts</span><h2>{users.length}</h2><p>{users.filter((user) => user.active).length} active</p></article><article className="metric-card"><span>Product questions</span><h2>{visibleRequestCount}</h2><p>Across {productBreakdown.filter((item) => item.count).length} product lines</p></article><article className="metric-card"><span>Open conversations</span><h2>{openRequests}</h2><p>Awaiting expert resolution</p></article><article className="metric-card"><span>Portal activity</span><h2>{portalEvents.length}</h2><p>{portalEvents.filter((event) => event.type === "tool_view").length} tool visits recorded</p></article></div><div className="admin-overview-actions"><Link href="/admin?view=users"><Users size={17} /> Manage users</Link><Link href="/admin?view=experts"><Boxes size={17} /> Route expert teams</Link><Link href="/admin?view=content"><FileText size={17} /> Review indexed content</Link></div><div className="admin-overview-grid"><article><h2>Questions by product line</h2>{productBreakdown.map((item) => <div className="admin-breakdown-row" key={item.name}><span>{item.name}</span><strong>{item.count}</strong></div>)}</article><article><h2>Recent admin actions</h2>{audit.slice(0, 5).map((item, index) => <div className="admin-audit-row" key={`${item.at}-${index}`}><strong>{item.action}</strong><span>{item.detail}</span><time>{new Date(item.at).toLocaleString()}</time></div>)}{!audit.length && <p>No changes have been recorded yet.</p>}</article></div></>}

      {activeView === "users" && <section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Users and alpha IDs</h2><p>Create customer access, assign roles, import alpha users, and deactivate accounts.</p></div><span>{users.length} accounts</span></div><form className="admin-user-create" onSubmit={createUser}><label>Full name<input value={newUser.name} onChange={(event) => setNewUser({ ...newUser, name: event.target.value })} placeholder="Full name" /></label><label>Email address<input type="email" value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} placeholder="name@company.com" /></label><label>Company<input value={newUser.company} onChange={(event) => setNewUser({ ...newUser, company: event.target.value })} placeholder="Organization" /></label><label>Country<input value={newUser.country} onChange={(event) => setNewUser({ ...newUser, country: event.target.value })} placeholder="Country" /></label><label>Role<select value={newUser.role} onChange={(event) => setNewUser({ ...newUser, role: event.target.value as AdminUser["role"] })}><option>Customer</option><option>Morgan User</option><option>Super Admin</option></select></label><button type="submit"><Plus size={15} />Create account</button></form>{error && <p className="admin-form-error" role="alert">{error}</p>}<details className="admin-csv-import"><summary>Import alpha users from CSV</summary><p>Columns: name,email,company,country,role</p><textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} rows={4} placeholder={'name,email,company,country,role\nAlex Morgan,alex@example.com,Acme,United Kingdom,Customer'} /><button type="button" onClick={importCsv}>Import accounts</button></details><div className="admin-user-table-wrap"><table className="admin-user-table"><thead><tr><th>Name</th><th>Email / company</th><th>Role</th><th>Product line access</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}<small>{user.country || "Country not set"}</small></td><td>{user.email}<small>{user.company || "No company"}</small></td><td><select aria-label={`Role for ${user.name}`} value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value as AdminUser["role"] })}><option>Customer</option><option>Morgan User</option><option>Super Admin</option></select></td><td>{user.role === "Morgan User" ? <select multiple aria-label={`Product lines for ${user.name}`} value={user.productLines} onChange={(event) => updateUser(user.id, { productLines: Array.from(event.target.selectedOptions, (option) => option.value) })}>{categories.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select> : <small>Not applicable</small>}</td><td><span className={user.active ? "admin-user-active" : "admin-user-inactive"}>{user.active ? "Active" : "Deactivated"}</span></td><td><button type="button" onClick={() => updateUser(user.id, { active: !user.active })}>{user.active ? "Deactivate" : "Reactivate"}</button></td></tr>)}</tbody></table>{!users.length && <p className="admin-empty-note">No managed accounts yet. Create an alpha ID above or import a CSV.</p>}</div></section>}

      {activeView === "experts" && <section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Product line ownership and routing</h2><p>Assign product managers, team members, backup experts, service hours and response targets.</p></div></div>{categories.map((category) => { const route = { ...FALLBACK_ROUTE, ...routes[category.slug] }; return <article className="admin-team-route" key={category.slug}><header><div><small>PRODUCT LINE</small><h3>{category.name}</h3></div><span><BadgeCheck size={14} />{route.region}</span></header><div className="admin-team-route-fields"><label>Product manager<input value={route.manager} onChange={(event) => updateRoute(category.slug, "manager", event.target.value)} placeholder="Name or Morgan email" /></label><label>Team members<input value={route.members} onChange={(event) => updateRoute(category.slug, "members", event.target.value)} placeholder="Separate multiple experts with commas" /></label><label>Backup expert<input value={route.backup} onChange={(event) => updateRoute(category.slug, "backup", event.target.value)} placeholder="Name or Morgan email" /></label><label>Working hours<input value={route.hours} onChange={(event) => updateRoute(category.slug, "hours", event.target.value)} /></label><label>Response target (hours)<input type="number" min={1} max={240} value={route.responseHours} onChange={(event) => updateRoute(category.slug, "responseHours", Number(event.target.value))} /></label><label>Routing region<select value={route.region} onChange={(event) => updateRoute(category.slug, "region", event.target.value)}><option>Global</option><option>EMEA</option><option>Americas</option><option>Asia Pacific</option><option>Australia</option></select></label><button className="admin-save-route" type="button" onClick={() => saveRoute(category.slug)}>Save routing</button></div></article>; })}</section>}

      {activeView === "content" && <><section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Main areas and access</h2><p>Choose which main area pages are available in the portal.</p></div></div><div className="admin-area-list">{mainAreas.map((area) => { const visible = !hiddenAreas.includes(area.slug); return <label key={area.slug}><span><strong>{area.title}</strong><small>{area.description}</small></span><input type="checkbox" checked={visible} onChange={() => { const next = visible ? [...hiddenAreas, area.slug] : hiddenAreas.filter((id) => id !== area.slug); writeAndLog("Main area visibility changed", area.title, () => { setHiddenAreas(next); window.localStorage.setItem(AREAS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event("morgan-admin-content-updated")); }); }} /><b>{visible ? "Visible" : "Restricted"}</b></label>; })}</div></section><IndexedCatalogManager /><AdminKnowledgeBaseManager /><AdminToolDataManager /><RegionalComplianceManager /></>}

      {activeView === "analytics" && <section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Question and usage report</h2><p>Review product demand and portal activity captured in this prototype.</p></div><button className="admin-export-button" type="button" onClick={() => { const rows = [["Question", "Product line", "Product", "Industry", "Status", "Created"], ...requests.map((request) => [request.query, request.category, request.product, request.industry, request.status ?? "Open", request.createdAt])]; const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "morgan-question-report.csv"; anchor.click(); URL.revokeObjectURL(url); }}><ArrowDownToLine size={15} />Export questions CSV</button></div><div className="admin-analytics-metrics"><div><span>Questions received</span><strong>{requests.length}</strong></div><div><span>Waiting for expert</span><strong>{requests.filter((request) => request.status !== "Resolved").length}</strong></div><div><span>Resolved</span><strong>{requests.filter((request) => request.status === "Resolved").length}</strong></div><div><span>Portal events</span><strong>{portalEvents.length}</strong></div></div><div className="admin-analytics-table">{productBreakdown.map((item) => <div className="admin-breakdown-row" key={item.name}><span>{item.name}</span><div><i style={{ width: `${requests.length ? Math.max(3, item.count / requests.length * 100) : 0}%` }} /></div><strong>{item.count}</strong></div>)}</div><h3>Recent questions</h3><div className="admin-recent-questions">{requests.slice(0, 30).map((request) => <article key={request.id}><strong>{request.query}</strong><span>{request.category} Â· {request.product} Â· {request.industry}</span><time>{new Date(request.createdAt).toLocaleDateString()}</time></article>)}{!requests.length && <p className="admin-empty-note">Question activity will appear here when customers start a thread.</p>}</div><h3>Recent page and tool activity</h3><div className="admin-recent-questions">{portalEvents.slice(0, 30).map((event, index) => <article key={`${event.at}-${index}`}><strong>{event.type === "tool_view" ? "Tool visit" : "Page view"}: {event.path}</strong><span>{event.role} Â· {event.region} Â· {event.language}</span><time>{new Date(event.at).toLocaleString()}</time></article>)}{!portalEvents.length && <p className="admin-empty-note">Usage activity appears here as portal pages are visited.</p>}</div></section>}

      {activeView === "settings" && <><section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Portal settings</h2><p>Configure registration, completion requirements, and default locale.</p></div></div><div className="admin-settings-list"><label><span><strong>Self-service customer registration</strong><small>Allow customer and visitor accounts to sign up.</small></span><input type="checkbox" checked={settings.signupEnabled} onChange={(event) => saveSettings({ ...settings, signupEnabled: event.target.checked })} /></label><label><span><strong>Require profile before expert chat and restricted tools</strong><small>Prompt users to complete their profile before using gated features.</small></span><input type="checkbox" checked={settings.requireProfile} onChange={(event) => saveSettings({ ...settings, requireProfile: event.target.checked })} /></label><label><span><strong>Default region</strong><small>Initial region for new portal sessions.</small></span><select value={settings.defaultRegion} onChange={(event) => saveSettings({ ...settings, defaultRegion: event.target.value })}><option>EMEA</option><option>Americas</option><option>Asia Pacific</option><option>Australia</option></select></label><label><span><strong>Default language</strong><small>Initial language for new portal sessions.</small></span><select value={settings.defaultLanguage} onChange={(event) => saveSettings({ ...settings, defaultLanguage: event.target.value })}><option>English</option><option>German</option><option>French</option><option>Spanish</option><option>Chinese</option><option>Japanese</option></select></label></div></section><section className="admin-feature-section"><div className="admin-feature-heading"><div><h2>Audit log</h2><p>Recent Super Admin changes recorded in this browser.</p></div></div><div className="admin-audit-list">{audit.map((item, index) => <article key={`${item.at}-${index}`}><span>{item.action}</span><strong>{item.detail}</strong><time>{new Date(item.at).toLocaleString()}</time></article>)}{!audit.length && <p className="admin-empty-note">Admin changes will be recorded here.</p>}</div></section></>}
    </section>
  </div></main>;
}