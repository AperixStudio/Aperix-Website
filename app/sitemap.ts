import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const routes = [
  "",
  "/contact",
  "/services",
  "/demo/starter",
  "/demo/essential",
  "/demo/business",
  "/demo/business/about",
  "/demo/business/contact",
  "/demo/business/services",
  "/demo/premium",
  "/demo/premium/about",
  "/demo/premium/book",
  "/demo/premium/faq",
  "/demo/premium/treatments",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
  }));
}
