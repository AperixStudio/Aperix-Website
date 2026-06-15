/** Shared WebGL quality settings for scroll-story canvases. */

export const MOBILE_BREAKPOINT_PX = 768;

export function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches;
}

/** Lower DPR on mobile to reduce GPU heat and scroll jank. */
export function getRendererPixelRatio() {
  if (typeof window === "undefined") {
    return 1;
  }

  const dpr = window.devicePixelRatio || 1;
  return isMobileViewport() ? Math.min(dpr, 1.25) : Math.min(dpr, 2);
}
