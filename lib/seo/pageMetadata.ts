import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import { buildGeoMetaTags } from "@/lib/schema/siteSchema";
import { SITE_LOCALITY } from "@/lib/siteBusiness";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  /** Set false for placeholders, drafts, and comparison routes. */
  index?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
  const pageUrl = path === "/" ? siteUrl : `${siteUrl}${path}`;

  return {
    title,
    description,
    robots: index
      ? undefined
      : {
          index: false,
          follow: true,
        },
    alternates: {
      canonical: canonicalPath,
      languages: {
        [SITE_LOCALITY.htmlLang]: pageUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALITY.openGraphLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: buildGeoMetaTags(),
  };
}
