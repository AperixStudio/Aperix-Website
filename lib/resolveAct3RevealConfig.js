import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import { MOBILE_ACT3_REVEAL_OVERRIDES } from "@/lib/act3RevealConfig.mobile";

/** Desktop defaults merged with optional mobile overrides and live/dev config. */
export function resolveAct3RevealConfig(isMobile = false, liveConfig = null) {
  const base = isMobile
    ? { ...DEFAULT_ACT3_REVEAL_CONFIG, ...MOBILE_ACT3_REVEAL_OVERRIDES }
    : DEFAULT_ACT3_REVEAL_CONFIG;

  if (!liveConfig) {
    return base;
  }

  return { ...base, ...liveConfig };
}
