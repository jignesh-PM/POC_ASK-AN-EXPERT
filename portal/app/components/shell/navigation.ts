import { categories, mainAreas, tools } from "../../lib/mock-data";
import type { IconName } from "../Icon";

export type NavItem = { href: string; label: string; description: string; icon: IconName; match: (path: string) => boolean };

export const NAV_ITEMS: NavItem[] = [
  { href: "/categories", label: "Products", description: "Product ranges and applications", icon: "package", match: (p) => p.startsWith("/categories") || p.startsWith("/category/") || p.startsWith("/main-area/") },
  { href: "/documents", label: "Documents", description: "Datasheets, manuals and certificates", icon: "file", match: (p) => p.startsWith("/documents") },
  { href: "/tools", label: "Tools", description: "Calculators and certificate finders", icon: "calculator", match: (p) => p.startsWith("/tools") },
  { href: "/questions", label: "Ask an expert", description: "Product community and expert chat", icon: "headset", match: (p) => p.startsWith("/questions") || p.startsWith("/search") },
  { href: "/legal", label: "Legal", description: "Privacy policy and terms of use", icon: "info", match: (p) => p === "/legal" || p === "/privacy" || p === "/terms" },
];

const STATIC_TITLES: Record<string, string> = {
  "/": "Home",
  "/categories": "Products",
  "/documents": "Documents",
  "/tools": "Tools",
  "/questions": "Ask an expert",
  "/search": "Morgan AI",
  "/expert": "Expert desk",
  "/admin": "Admin",
  "/profile": "My profile",
  "/sign-in": "Sign in",
  "/legal": "Legal",
  "/privacy": "Privacy policy",
  "/terms": "Terms of use",
  "/technical-documents": "Technical documents",
  "/sitemap": "Site map",
};

/** Parent crumb for nested or grouped routes. */
const PARENTS: Record<string, { label: string; href: string }> = {
  category: { label: "Products", href: "/categories" },
  "main-area": { label: "Products", href: "/categories" },
  tools: { label: "Tools", href: "/tools" },
  privacy: { label: "Legal", href: "/legal" },
  terms: { label: "Legal", href: "/legal" },
};

function dynamicTitle(section: string, slug: string) {
  if (section === "category") return categories.find((item) => item.slug === slug)?.name;
  if (section === "main-area") return mainAreas.find((item) => item.slug === slug)?.title;
  if (section === "tools") return tools.find((item) => item.slug === slug)?.title;
  return undefined;
}

export type Crumb = { label: string; href?: string };

export function getBreadcrumbs(pathname: string): Crumb[] {
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (!section) return [{ label: "Home" }];
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  const parent = PARENTS[section];
  if (parent && (slug || section === "privacy" || section === "terms")) crumbs.push(parent);
  const title = slug ? dynamicTitle(section, slug) : STATIC_TITLES[`/${section}`];
  crumbs.push({ label: title ?? section.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase()) });
  return crumbs;
}
