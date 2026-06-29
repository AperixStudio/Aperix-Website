import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/demo/", "/dev/"],
    },
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/image-sitemap.xml`],
    host: siteUrl,
  };
}
