import type { ExperienceTier } from "@/lib/experience/types";

/** Resolve WebGL quality tier for the homepage story. Lite path ships in a later phase. */
export function resolveExperienceTier(
  isMobile: boolean,
  prefersReducedMotion: boolean,
): ExperienceTier {
  if (prefersReducedMotion) {
    return "lite";
  }

  if (isMobile) {
    return "lite";
  }

  return "full";
}
