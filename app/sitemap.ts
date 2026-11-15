import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/our-work", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ecommerce-websites", priority: 0.75, changeFrequency: "monthly" },
  { path: "/web-design-for-tradies", priority: 0.75, changeFrequency: "monthly" },
  { path: "/custom-software-development", priority: 0.75, changeFrequency: "monthly" },
  { path: "/app-development", priority: 0.75, changeFrequency: "monthly" },
];

/** Stable last-modified dates per route (update when page content changes). */
const ROUTE_LAST_MODIFIED: Record<string, string> = {
  "": "2026-11-14",
  "/services": "2026-11-14",
  "/our-work": "2026-11-14",
  "/about": "2026-11-14",
  "/contact": "2026-11-14",
  "/ecommerce-websites": "2026-11-14",
  "/web-design-for-tradies": "2026-11-14",
  "/custom-software-development": "2026-11-14",
  "/app-development": "2026-11-14",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: ROUTE_LAST_MODIFIED[path] ?? "2026-11-14",
    changeFrequency,
    priority,
  }));
}
