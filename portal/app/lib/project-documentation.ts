import { categories, mainAreas, tools } from "./mock-data";

export type FeatureBehavior = "Dynamic" | "Static";

export type FeatureRecord = {
  id: string;
  feature: string;
  area: string;
  route: string;
  behavior: FeatureBehavior;
  usp: boolean;
  effort: string;
  cost: string;
  deliveryNote: string;
};

export type PortalFeature = Omit<FeatureRecord, "feature"> & { name: string; detail: string };

export const designTokens = {
  colors: [
    { name: "Morgan Blue", value: "#002F5F", use: "Primary navigation, headings, primary actions" },
    { name: "Morgan Orange", value: "#EF6400", use: "Focus, highlights, active states" },
    { name: "White", value: "#FFFFFF", use: "Page and card surfaces" },
    { name: "Black", value: "#111820", use: "High contrast text and footer details" },
  ],
  spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "48px"],
  radii: ["6px control", "10px card", "14px panel", "999px pill"],
};

export const typographyScale = [
  { name: "Display", size: "36–48px", weight: "700", use: "Landing page hero" },
  { name: "Page title", size: "24–32px", weight: "700", use: "Primary page headings" },
  { name: "Section title", size: "18–22px", weight: "700", use: "Cards and content groups" },
  { name: "Body", size: "14–16px", weight: "400 / 500", use: "Reading and form content" },
  { name: "Utility", size: "12–13px", weight: "500 / 700", use: "Tables, breadcrumbs, labels" },
];

export const technologyStack = [
  { layer: "Framework", technology: "Next.js 16 App Router", role: "Routing, layouts, metadata, loading and error boundaries" },
  { layer: "UI runtime", technology: "React 19 + TypeScript", role: "Typed, component-based portal interface" },
  { layer: "Motion", technology: "GSAP 3", role: "Interface transitions and the Ask the Expert chip animation" },
  { layer: "3D graphics", technology: "Three.js", role: "Optional lightweight WebGL hero background" },
  { layer: "Accessible controls", technology: "Radix UI", role: "Dropdown menus and select controls with keyboard support" },
  { layer: "Icons", technology: "Lucide React", role: "Consistent interface icon set" },
  { layer: "Styling", technology: "CSS", role: "Morgan design tokens, responsive layouts, and motion states" },
];

export const portalFeatures: PortalFeature[] = [
  { id: "discovery", name: "Guided product discovery", area: "Products", route: "/categories", behavior: "Dynamic", usp: true, effort: "6-10 days", cost: "$3,600-$10,000", detail: "Connect product families and application areas to a clearer path to the right material.", deliveryNote: "Prototype navigation is dynamic; production needs approved product data and search." },
  { id: "expert", name: "Ask a Morgan expert", area: "Support", route: "/questions", behavior: "Dynamic", usp: true, effort: "12-20 days", cost: "$7,200-$20,000", detail: "A direct route from a technical question to Morgan expertise.", deliveryNote: "Production estimate includes identity, case routing, notifications, and confirmation." },
  { id: "library", name: "Technical resource library", area: "Content", route: "/documents", behavior: "Dynamic", usp: true, effort: "8-14 days", cost: "$4,800-$14,000", detail: "Make product documentation easier to find by material and application.", deliveryNote: "Connect metadata, content ownership, search, and secure file delivery." },
  { id: "tools", name: "Product tools and calculators", area: "Tools", route: "/tools", behavior: "Dynamic", usp: true, effort: "10-18 days", cost: "$6,000-$18,000", detail: "Help customers compare options and work through technical decisions.", deliveryNote: "Effort depends on calculation validation and product-engineering sign-off." },
  { id: "account", name: "Personal profile and preferences", area: "Account", route: "/profile", behavior: "Dynamic", usp: false, effort: "4-8 days", cost: "$2,400-$8,000", detail: "Keep profile, region, language, and appearance controls together.", deliveryNote: "Current interactions are demo state; production needs identity and preference storage." },
  { id: "notifications", name: "Contextual notifications", area: "Account", route: "Header", behavior: "Dynamic", usp: false, effort: "4-7 days", cost: "$2,400-$7,000", detail: "Surface useful account and support updates in the portal shell.", deliveryNote: "Current welcome notice is local demo state; production needs a notification service." },
  { id: "navigation", name: "Responsive portal navigation", area: "Experience", route: "All pages", behavior: "Dynamic", usp: false, effort: "4-7 days", cost: "$2,400-$7,000", detail: "Keep routes, profile tools, and support actions available across screen sizes.", deliveryNote: "Connect final access rules and approved information architecture." },
  { id: "brand-content", name: "Brand, policies, and reference content", area: "Foundation", route: "/privacy", behavior: "Static", usp: false, effort: "2-4 days", cost: "$1,200-$4,000", detail: "Provide consistent brand styling and clear, stable reference pages.", deliveryNote: "Content ownership, review, and localization are outside this estimate." },
  { id: "direction-board", name: "Visual sitemap and direction board", area: "Governance", route: "/sitemap", behavior: "Dynamic", usp: false, effort: "3-6 days", cost: "$1,800-$6,000", detail: "See how the portal is organized and capture local planning notes.", deliveryNote: "Current note is browser-local; team collaboration would need shared storage." },
];

export const initialFeatureTracker: FeatureRecord[] = portalFeatures.map((feature) => ({
  id: feature.id,
  feature: feature.name,
  area: feature.area,
  route: feature.route,
  behavior: feature.behavior,
  usp: feature.usp,
  effort: feature.effort,
  cost: feature.cost,
  deliveryNote: feature.deliveryNote,
}));

export const estimateAssumptions = {
  rate: "$75-$125 USD per hour",
  day: "8-hour delivery day",
  scope: "Indicative build effort across design, engineering, integration, and basic QA.",
  excludes: "Excludes taxes, hosting, licenses, major content migration, and third-party vendor fees.",
};

export const releaseHistory = [
  { version: "0.1.0", date: "Current package baseline", title: "Portal foundation", detail: "App Router structure, shared navigation, Morgan brand colors, and initial product areas." },
  { version: "Current", date: "Prototype iteration", title: "Account and responsive experience", detail: "Profile preferences, responsive navigation, accessible menus, notifications, and loading states." },
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
      { title: "Ask the Expert", href: "/questions", type: "Support" },
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
    description: "Product direction and published policies.",
    nodes: [
      { title: "Direction board", href: "/sitemap", type: "Board" },
      { title: "Privacy policy", href: "/privacy", type: "Policy" },
      { title: "Terms of use", href: "/terms", type: "Policy" },
    ],
  },
];

