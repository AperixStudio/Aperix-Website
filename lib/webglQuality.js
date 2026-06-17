/** Shared WebGL quality settings for scroll-story canvases. */

export const MOBILE_BREAKPOINT_PX = 768;

/** Max device pixel ratio on mobile renderers (lower = lighter GPU load). */
export const MOBILE_MAX_PIXEL_RATIO = 1;

/** Max device pixel ratio on desktop renderers. */
export const DESKTOP_MAX_PIXEL_RATIO = 2;

/** Target FPS for unified hero canvas on mobile. */
export const MOBILE_HERO_TARGET_FPS = 60;

export function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches;
}

/**
 * Lower DPR on mobile to reduce GPU heat and scroll jank.
 * @param {{ simulateMobile?: boolean }} [options] Dev playground mobile preview uses mobile DPR on desktop.
 */
export function getRendererPixelRatio(options = {}) {
  if (typeof window === "undefined") {
    return 1;
  }

  const simulateMobile = options.simulateMobile === true;
  const dpr = window.devicePixelRatio || 1;
  const mobile = simulateMobile || isMobileViewport();
  return mobile ? Math.min(dpr, MOBILE_MAX_PIXEL_RATIO) : Math.min(dpr, DESKTOP_MAX_PIXEL_RATIO);
}

/**
 * Skip render frames on mobile to cap hero WebGL at MOBILE_HERO_TARGET_FPS.
 * @param {number} time - requestAnimationFrame timestamp (ms)
 * @param {number} lastRenderTime - previous rendered frame time (ms)
 * @param {boolean} isMobile
 */
export function shouldRenderMobileHeroFrame(time, lastRenderTime, isMobile) {
  if (!isMobile) {
    return true;
  }

  const frameIntervalMs = 1000 / MOBILE_HERO_TARGET_FPS;
  return time - lastRenderTime >= frameIntervalMs;
}
