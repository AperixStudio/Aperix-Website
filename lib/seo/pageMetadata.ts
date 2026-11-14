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
  /** Link-preview title. The document title stays `title`. */
  socialTitle?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
  socialTitle,
}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
  const pageUrl = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const shareTitle = socialTitle ?? title;
  const shareImage = {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Aperix Studio",
  };

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
      title: shareTitle,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALITY.openGraphLocale,
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [shareImage],
    },
    other: buildGeoMetaTags(),
  };
}
