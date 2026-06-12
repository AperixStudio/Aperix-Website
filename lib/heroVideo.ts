/** Hero monitor video — real dimensions required; avoid display:none or 0×0. */
export const HERO_VIDEO_SRC = "/badreception.mp4";

/** Kept in-layout (not far off-screen) so browsers still decode frames for WebGL. */
export const HERO_VIDEO_OFFSCREEN_CLASS =
  "pointer-events-none fixed top-0 left-0 -z-50 h-[360px] w-[640px] opacity-[0.001] [clip-path:inset(50%)]";
