import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/our-work", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

/** Stable last-modified dates per route (update when page content changes). */
const ROUTE_LAST_MODIFIED: Record<string, string> = {
  "": "2026-06-29",
  "/services": "2026-06-15",
  "/our-work": "2026-06-15",
  "/about": "2026-06-15",
  "/contact": "2026-06-15",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: ROUTE_LAST_MODIFIED[path] ?? "2026-06-15",
    changeFrequency,
    priority,
  }));
}
