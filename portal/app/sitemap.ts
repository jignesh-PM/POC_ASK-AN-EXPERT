import type { MetadataRoute } from "next";
import { categories, mainAreas, tools } from "./lib/mock-data";

const lastModified = new Date("2026-11-21T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const paths = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/categories", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/documents", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/technical-documents", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/tools", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/questions", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/expert", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/profile", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/sign-in", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/legal", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/sitemap", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    ...categories.map(({ slug }) => ({ path: `/category/${slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
    ...mainAreas.map(({ slug }) => ({ path: `/main-area/${slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...tools.map(({ slug }) => ({ path: `/tools/${slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
  ];

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
