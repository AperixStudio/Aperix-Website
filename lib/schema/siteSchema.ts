import { ABOUT_HERO_IMAGE_SRC } from "@/lib/aboutContent";
import { getSiteUrl, SITE_EMAIL, SITE_LOGO_PATH, SITE_NAME, SITE_SOCIAL_LINKS } from "@/lib/site";
import { SITE_LOCALITY, SITE_TEAM } from "@/lib/siteBusiness";

export function getSiteLogoUrl() {
  return `${getSiteUrl()}${SITE_LOGO_PATH}`;
}

export function buildPostalAddress() {
  return {
    "@type": "PostalAddress" as const,
    addressLocality: SITE_LOCALITY.city,
    addressRegion: SITE_LOCALITY.region,
    addressCountry: SITE_LOCALITY.country,
  };
}

export function buildGeoCoordinates() {
  return {
    "@type": "GeoCoordinates" as const,
    latitude: SITE_LOCALITY.latitude,
    longitude: SITE_LOCALITY.longitude,
  };
}

export function buildOrganizationSchema(options?: { includeGeo?: boolean }) {
  const siteUrl = getSiteUrl();

  return {
    "@type": "Organization" as const,
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: getSiteLogoUrl(),
    email: SITE_EMAIL,
    sameAs: SITE_SOCIAL_LINKS,
    ...(options?.includeGeo
      ? {
          address: buildPostalAddress(),
          geo: buildGeoCoordinates(),
          areaServed: {
            "@type": "City" as const,
            name: SITE_LOCALITY.city,
          },
        }
      : {}),
  };
}

export function buildWebSiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@type": "WebSite" as const,
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: SITE_LOCALITY.htmlLang,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildLocalBusinessSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/contact#localbusiness`,
    name: SITE_NAME,
    url: siteUrl,
    logo: getSiteLogoUrl(),
    email: SITE_EMAIL,
    sameAs: SITE_SOCIAL_LINKS,
    address: buildPostalAddress(),
    geo: buildGeoCoordinates(),
    areaServed: {
      "@type": "City",
      name: SITE_LOCALITY.city,
    },
  };
}

export function buildPersonSchemas() {
  const siteUrl = getSiteUrl();

  return SITE_TEAM.map((member) => ({
    "@type": "Person" as const,
    "@id": `${siteUrl}/about#${member.id}`,
    name: member.name,
    jobTitle: member.jobTitle,
    image: `${siteUrl}${member.imagePath}`,
    worksFor: {
      "@id": `${siteUrl}/#organization`,
    },
  }));
}

export function buildAboutPageSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema({ includeGeo: true }),
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about#webpage`,
        url: `${siteUrl}/about`,
        name: "About Us | Aperix Studio",
        description:
          "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
        inLanguage: SITE_LOCALITY.htmlLang,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}${ABOUT_HERO_IMAGE_SRC}`,
        },
      },
      ...buildPersonSchemas(),
    ],
  };
}

export function buildGeoMetaTags() {
  return {
    "geo.region": SITE_LOCALITY.geoRegion,
    "geo.placename": SITE_LOCALITY.geoPlacename,
    ICBM: SITE_LOCALITY.icbm,
  };
}
