import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import { MOBILE_HERO_CANVAS_OVERRIDES } from "@/lib/heroCanvasConfig.mobile";

/** Desktop defaults merged with optional mobile overrides and live/dev config. */
export function resolveHeroCanvasConfig(isMobile = false, liveConfig = null) {
  const base = isMobile
    ? { ...DEFAULT_HERO_CANVAS_CONFIG, ...MOBILE_HERO_CANVAS_OVERRIDES }
    : DEFAULT_HERO_CANVAS_CONFIG;

  if (!liveConfig) {
    return base;
  }

  return { ...base, ...liveConfig };
}
