/** Regional + geo constants for SEO metadata and schema.org. */
export const SITE_LOCALITY = {
  city: "Melbourne",
  region: "VIC",
  country: "AU",
  countryName: "Australia",
  latitude: -37.8136,
  longitude: 144.9631,
  geoRegion: "AU-VIC",
  geoPlacename: "Melbourne",
  icbm: "-37.8136, 144.9631",
  htmlLang: "en-AU",
  openGraphLocale: "en_AU",
} as const;

export const SITE_TEAM = [
  {
    id: "tom",
    name: "Tom",
    jobTitle: "Co-founder & Developer",
    imagePath: "/TomPhoto.webp",
    imageAlt: "Tom — Co-founder at Aperix Studio",
  },
  {
    id: "harrison",
    name: "Harrison",
    jobTitle: "Co-founder & Developer",
    imagePath: "/HarriosnPhoto.webp",
    imageAlt: "Harrison — Co-founder at Aperix Studio",
  },
] as const;

/** Indexable images for image sitemap generation. */
export const SITE_SITEMAP_IMAGES = [
  {
    pagePath: "/",
    loc: "/aperix-logo.svg",
    title: "Aperix Studio logo",
    caption: "Aperix Studio — custom web development Melbourne",
  },
  {
    pagePath: "/about",
    loc: "/WhoAreWe.jpeg",
    title: "About Aperix Studio",
    caption: "The Aperix Studio team in Melbourne",
  },
  {
    pagePath: "/about",
    loc: "/TomPhoto.webp",
    title: "Tom — Aperix Studio",
    caption: "Tom, co-founder of Aperix Studio",
  },
  {
    pagePath: "/about",
    loc: "/HarriosnPhoto.webp",
    title: "Harrison — Aperix Studio",
    caption: "Harrison, co-founder of Aperix Studio",
  },
  {
    pagePath: "/our-work",
    loc: "/POVSyncPreview.png",
    title: "POV Sync case study preview",
    caption: "POV Sync SaaS landing page by Aperix Studio",
  },
] as const;
