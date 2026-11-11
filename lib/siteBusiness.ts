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
    imageAlt: "Tom, Co-founder at Aperix Studio",
    phoneDisplay: "0466 584 549",
    phoneTel: "+61466584549",
  },
  {
    id: "harrison",
    name: "Harrison",
    jobTitle: "Co-founder & Developer",
    imagePath: "/HarriosnPhoto.webp",
    imageAlt: "Harrison, Co-founder at Aperix Studio",
    phoneDisplay: "0499 277 423",
    phoneTel: "+61499277423",
  },
] as const;

/** Live AI receptionist. The hero orb and /services both dial this line. */
export const RECEPTIONIST_LINE = {
  display: "+61 3 9962 4119",
  tel: "+61399624119",
} as const;

/** Indexable images for image sitemap generation. */
export const SITE_SITEMAP_IMAGES = [
  {
    pagePath: "/",
    loc: "/arrowhead-mark.svg",
    title: "Aperix Studio logo",
    caption: "Aperix Studio, custom web development Melbourne",
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
    title: "Tom | Aperix Studio",
    caption: "Tom, co-founder of Aperix Studio",
  },
  {
    pagePath: "/about",
    loc: "/HarriosnPhoto.webp",
    title: "Harrison | Aperix Studio",
    caption: "Harrison, co-founder of Aperix Studio",
  },
  {
    pagePath: "/",
    loc: "/NailsByAvyPreview.webp",
    title: "Nails by Avy case study preview",
    caption: "Nails by Avy nail studio website by Aperix Studio",
  },
  {
    pagePath: "/our-work",
    loc: "/POVSyncPreview.webp",
    title: "POV Sync case study preview",
    caption: "POV Sync SaaS landing page by Aperix Studio",
  },
  {
    pagePath: "/our-work",
    loc: "/MullyPreview.webp",
    title: "Mully case study preview",
    caption: "Mully golf companion app by Aperix Studio",
  },
] as const;
