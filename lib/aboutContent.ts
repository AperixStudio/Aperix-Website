/** Full-bleed about photo used on the homepage wall + /about page hero. */
export const ABOUT_HERO_IMAGE_SRC = "/WhoAreWe.jpeg";

/** Unicorn Studio scene for About panel 01 background. */
export const ABOUT_UNICORN_PROJECT_ID = "3wflPuwU1t035BL8lRns";
/** Unicorn Studio scene for About panel 02 ("Small team, big care.") background. */
export const ABOUT_PANEL2_UNICORN_PROJECT_ID = "g10M7b69FA7AGjDRHdhR";
export const ABOUT_UNICORN_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";

export const ABOUT_UNICORN_RENDER = {
  desktop: { scale: 1, dpi: 1.5, fps: 60 as const },
  mobile: { scale: 0.68, dpi: 1, fps: 30 as const },
} as const;
