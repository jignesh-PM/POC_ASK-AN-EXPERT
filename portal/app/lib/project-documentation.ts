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
  { layer: "Motion", technology: "CSS transitions", role: "Subtle interaction feedback with reduced-motion support" },
  { layer: "Accessible controls", technology: "Radix UI", role: "Dropdown menus and select controls with keyboard support" },
  { layer: "Icons", technology: "Lucide React", role: "Consistent interface icon set" },
  { layer: "Styling", technology: "CSS", role: "Morgan design tokens, responsive layouts, and motion states" },
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
];

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
      { title: "Legal", href: "/legal", type: "Information" },
      { title: "Privacy policy", href: "/privacy", type: "Policy" },
      { title: "Terms of use", href: "/terms", type: "Policy" },
    ],
  },
];

