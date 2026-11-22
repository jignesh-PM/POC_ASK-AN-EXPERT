import { categories, mainAreas, tools } from "./mock-data";

export type FeatureBehavior = "Dynamic" | "Static";

export type PortalFeature = {
  id: string;
  name: string;
  area: string;
  route: string;
  behavior: FeatureBehavior;
  usp: boolean;
  detail: string;
  deliveryNote: string;
};
/** Mirrors `app/styles/tokens.css`. `token` is the CSS custom property; `inverse` marks swatches that need light text. */
export const designTokens = {
  colors: [
    { name: "Morgan Blue", token: "--color-brand", value: "#002F5F", inverse: true, use: "Headings, navigation, primary actions" },
    { name: "Brand soft", token: "--color-brand-soft", value: "#E9F0F7", inverse: false, use: "Selected states, tinted surfaces, chart tracks" },
    { name: "Morgan Orange", token: "--color-accent", value: "#EF6400", inverse: true, use: "Single clear accent, focus ring, active indicators" },
    { name: "Accent text", token: "--color-accent-text", value: "#B84D00", inverse: true, use: "Orange text that meets AA contrast on white" },
    { name: "Text", token: "--color-text", value: "#132231", inverse: true, use: "Body copy and high-contrast labels" },
    { name: "Muted text", token: "--color-text-muted", value: "#4F6273", inverse: true, use: "Descriptions and secondary copy" },
    { name: "Page background", token: "--color-bg", value: "#F4F6F9", inverse: false, use: "Behind cards and sections" },
    { name: "Surface", token: "--color-surface", value: "#FFFFFF", inverse: false, use: "Cards, panels and controls" },
    { name: "Border", token: "--color-border", value: "#DFE6EC", inverse: false, use: "Dividers and card outlines" },
    { name: "Success", token: "--color-success", value: "#1D7A4B", inverse: true, use: "Saved, published and resolved states" },
    { name: "Warning", token: "--color-warning", value: "#9A5B00", inverse: true, use: "Pending or unsaved states" },
    { name: "Danger", token: "--color-danger", value: "#B42318", inverse: true, use: "Errors and destructive actions" },
  ],
  spacing: ["--space-1 · 4px", "--space-2 · 8px", "--space-3 · 12px", "--space-4 · 16px", "--space-5 · 20px", "--space-6 · 24px", "--space-8 · 32px", "--space-10 · 40px", "--space-12 · 48px", "--space-16 · 64px"],
  radii: ["--radius-sm · 6px controls", "--radius-md · 10px inputs, buttons", "--radius-lg · 14px cards", "--radius-xl · 20px hero panels", "--radius-pill · badges"],
  elevation: ["--shadow-xs resting cards", "--shadow-sm menus", "--shadow-md hover lift", "--shadow-lg overlays", "--focus-ring keyboard focus"],
};

/** Mirrors the `--text-*` and `--weight-*` tokens. Nothing in the portal is smaller than `--text-xs`. */
export const typographyScale = [
  { name: "Page title", token: "--text-3xl", size: "30–40px (fluid)", weight: "700", use: "The single h1 in PageHeader" },
  { name: "Heading", token: "--text-2xl", size: "28px", weight: "700", use: "Stat values and large figures" },
  { name: "Section title", token: "--text-xl", size: "22px", weight: "700", use: "SectionHeader h2" },
  { name: "Subsection title", token: "--text-lg", size: "18px", weight: "700", use: "SectionHeader h3, card titles" },
  { name: "Body large", token: "--text-base", size: "16px", weight: "400", use: "Lead paragraphs and large buttons" },
  { name: "Body", token: "--text-md", size: "14px", weight: "400 / 500", use: "Default body copy, controls, tables" },
  { name: "Small", token: "--text-sm", size: "13px", weight: "400 / 700", use: "Labels, hints, secondary lines" },
  { name: "Caption", token: "--text-xs", size: "12px", weight: "500 / 700", use: "Badges, table headers (minimum size)" },
];

export const technologyStack = [
  { layer: "Framework", technology: "Next.js 16 App Router", role: "Routing, layouts, metadata, loading and error boundaries, with Cache Components and partial prefetching enabled" },
  { layer: "UI runtime", technology: "React 19 + TypeScript", role: "Typed Server and Client Components" },
  { layer: "Component library", technology: "In-house (app/components/ui)", role: "Page, headers, Card, Button, Badge, Stat, Tabs, form fields, Alert and EmptyState shared by every route" },
  { layer: "Styling", technology: "CSS Modules + design tokens", role: "Co-located modules that reference only the custom properties in app/styles/tokens.css" },
  { layer: "Icons", technology: "In-house SVG icon set (app/components/Icon.tsx)", role: "One consistent stroke icon table; no third-party icon package" },
  { layer: "Typography", technology: "next/font (Roboto)", role: "Self-hosted Roboto 400/500/700 exposed as --font-roboto" },
  { layer: "Motion", technology: "CSS transitions and keyframes", role: "Short entrance and hover feedback; disabled under prefers-reduced-motion" },
  { layer: "Persistence", technology: "Browser localStorage via useSyncExternalStore", role: "Prototype-only state (roles, admin settings, questions) without hydration mismatches; production needs real services" },
];

export const portalFeatures: PortalFeature[] = [
  { id: "discovery", name: "Guided product discovery", area: "Products", route: "/categories", behavior: "Dynamic", usp: true, detail: "Connect product families and application areas to a clearer path to the right material.", deliveryNote: "Prototype navigation is dynamic; production needs approved product data and search." },
  { id: "expert", name: "Ask a Morgan expert", area: "Support", route: "/questions", behavior: "Dynamic", usp: true, detail: "A direct route from a technical question to Morgan expertise.", deliveryNote: "Production needs identity, case routing, notifications, and confirmation." },
  { id: "library", name: "Technical resource library", area: "Content", route: "/documents", behavior: "Dynamic", usp: true, detail: "Make product documentation easier to find by material and application.", deliveryNote: "Connect metadata, content ownership, search, and secure file delivery." },
  { id: "tools", name: "Product tools and calculators", area: "Tools", route: "/tools", behavior: "Dynamic", usp: true, detail: "Help customers compare options and work through technical decisions.", deliveryNote: "Calculation validation and product-engineering sign-off are needed." },
  { id: "account", name: "Personal profile and preferences", area: "Account", route: "/profile", behavior: "Dynamic", usp: false, detail: "Keep profile, region, language, and appearance controls together.", deliveryNote: "Current interactions are demo state; production needs identity and preference storage." },
  { id: "notifications", name: "Contextual notifications", area: "Account", route: "Header", behavior: "Dynamic", usp: false, detail: "Surface useful account and support updates in the portal shell.", deliveryNote: "Current welcome notice is local demo state; production needs a notification service." },
  { id: "navigation", name: "Responsive portal navigation", area: "Experience", route: "All pages", behavior: "Dynamic", usp: false, detail: "Keep routes, profile tools, and support actions available across screen sizes.", deliveryNote: "Connect final access rules and approved information architecture." },
  { id: "brand-content", name: "Brand, policies, and reference content", area: "Foundation", route: "/legal", behavior: "Static", usp: false, detail: "Provide consistent brand styling and clear, stable reference pages.", deliveryNote: "Content ownership, review, and localization need defined owners." },
  { id: "direction-board", name: "Visual sitemap and direction board", area: "Governance", route: "/sitemap", behavior: "Dynamic", usp: false, detail: "See how the portal is organized and capture local planning notes.", deliveryNote: "Current note is browser-local; team collaboration needs shared storage." },
  { id: "admin", name: "Super Admin workspace", area: "Governance", route: "/admin", behavior: "Dynamic", usp: false, detail: "Manage users, expert routing, content visibility, analytics and portal settings with an audit trail.", deliveryNote: "Prototype state is browser-local; production needs identity, role-based access and a shared database." },
];

export const releaseHistory = [
  { version: "0.1.0", date: "Current package baseline", title: "Portal foundation", detail: "App Router structure, shared navigation, Morgan brand colors, and initial product areas." },
  { version: "0.1.1", date: "Prototype iteration", title: "Account and responsive experience", detail: "Profile preferences, responsive navigation, accessible menus, notifications, and loading states." },
  { version: "0.2.0", date: "November 2026", title: "Design-system refactor", detail: "Replaced global CSS classes with an in-house component library (app/components/ui), CSS Modules and design tokens; moved persistence behind useSyncExternalStore hooks; split the admin workspace into per-view components; raised minimum text size to 12px and added visible focus states." },
  { version: "Next", date: "Production direction", title: "Connect portal services", detail: "Integrate identity, product and document search, expert case routing, notifications, and shared preference storage." },
];

export const portalMap = [
  {
    id: "discover",
    name: "Discover",
    description: "Start with products and technical resources.",
    nodes: [
      { title: "Overview", href: "/", type: "Page" },
      { title: "Product categories", href: "/categories", type: "Collection" },
      ...categories.map((category) => ({ title: category.name, href: `/category/${category.slug}`, type: "Product" })),
      ...mainAreas.map((area) => ({ title: area.title, href: `/main-area/${area.slug}`, type: "Support area" })),
      { title: "Documents", href: "/documents", type: "Library" },
    ],
  },
  {
    id: "support",
    name: "Get support",
    description: "Use a tool or connect with an expert.",
    nodes: [
      { title: "Tools", href: "/tools", type: "Workspace" },
      ...tools.map((tool) => ({ title: tool.title, href: `/tools/${tool.slug}`, type: "Tool" })),
      { title: "Ask an expert", href: "/questions", type: "Support" },
      { title: "Expert desk", href: "/expert", type: "Workspace" },
    ],
  },
  {
    id: "account",
    name: "Account",
    description: "Profile, preferences, and project documentation.",
    nodes: [
      { title: "Sign in", href: "/sign-in", type: "Account" },
      { title: "My profile", href: "/profile", type: "Account" },
      { title: "Technical Documents", href: "/technical-documents", type: "Reference" },
    ],
  },
  {
    id: "governance",
    name: "Governance",
    description: "Product direction, administration and published policies.",
    nodes: [
      { title: "Direction board", href: "/sitemap", type: "Board" },
      { title: "Admin workspace", href: "/admin", type: "Workspace" },
      { title: "Legal", href: "/legal", type: "Information" },
      { title: "Privacy policy", href: "/privacy", type: "Policy" },
      { title: "Terms of use", href: "/terms", type: "Policy" },
    ],
  },
];

