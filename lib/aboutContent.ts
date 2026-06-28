/** Full-bleed about photo used on the /about page hero. */
export const ABOUT_HERO_IMAGE_SRC = "/WhoAreWe.jpeg";

/** About wall panel 03 — team portraits (left + right). Set `src` to null for a placeholder slot. */
export const ABOUT_TEAM_PANEL_PHOTOS = {
  left: {
    src: "/TomPhoto.webp",
    alt: "Tom — Aperix Studio",
  },
  right: {
    src: null,
    alt: "Team member — Aperix Studio",
  },
} as const;

/** Melbourne CBD — used on About panel 01 map + coordinates display. */
export const MELBOURNE_COORDINATES = {
  latitude: -37.8136,
  longitude: 144.9631,
  latLabel: "37.8136° S",
  lngLabel: "144.9631° E",
} as const;

/** Self-hosted Unicorn Studio export for About panel 01 (Melbourne / about us scene). */
export const ABOUT_PANEL1_UNICORN_JSON = "/unicorn/aperixaboutus1_scene.json";
/** Unicorn Studio scene for About panel 02 ("Small team, big care.") background. */
export const ABOUT_PANEL2_UNICORN_PROJECT_ID = "g10M7b69FA7AGjDRHdhR";
export const ABOUT_UNICORN_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";

export const ABOUT_UNICORN_RENDER = {
  desktop: { scale: 1, dpi: 1.5, fps: 60 as const },
  mobile: { scale: 0.68, dpi: 1, fps: 30 as const },
} as const;
