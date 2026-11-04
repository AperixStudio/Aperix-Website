import { ABOUT_HERO_IMAGE_SRC } from "@/lib/aboutContent";
import { FAQ_ITEMS, STUDIO_SERVICES } from "@/lib/services-content";
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

function buildContactPoints() {
  return SITE_TEAM.map((member) => ({
    "@type": "ContactPoint" as const,
    telephone: member.phoneTel,
    contactType: "customer support",
    name: member.name,
    areaServed: SITE_LOCALITY.country,
    availableLanguage: "English",
  }));
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
    telephone: SITE_TEAM.map((member) => member.phoneTel),
    contactPoint: buildContactPoints(),
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
    telephone: SITE_TEAM.map((member) => member.phoneTel),
    contactPoint: buildContactPoints(),
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
    telephone: member.phoneTel,
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
          "Meet Aperix Studio, a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
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

export function buildHomePageSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: "Web Design & Software Studio Melbourne | Aperix Studio",
        description:
          "Aperix Studio is a two-man Melbourne web design and software studio. We build custom websites for service-based and e-commerce businesses, plus apps and software.",
        inLanguage: SITE_LOCALITY.htmlLang,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        mainEntity: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: `${siteUrl}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function buildServicesPageSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/services#webpage`,
        url: `${siteUrl}/services`,
        name: "Services | Aperix Studio",
        description:
          "Web design, web apps and SaaS, software development, and app development from Aperix Studio in Melbourne.",
        inLanguage: SITE_LOCALITY.htmlLang,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        mainEntity: { "@id": `${siteUrl}/services#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/services#list`,
        itemListElement: STUDIO_SERVICES.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            "@id": `${siteUrl}/services#${service.id}`,
            name: service.name,
            description: service.summary,
            provider: { "@id": `${siteUrl}/#organization` },
            areaServed: {
              "@type": "City",
              name: SITE_LOCALITY.city,
            },
          },
        })),
      },
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
