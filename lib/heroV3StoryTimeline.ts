import type { RocketTextProgress } from "@/lib/howItWorksContent";

/** Hero headline fades out once the user begins scrolling the pinned hero. */
export const HERO_V3_TEXT_FADE_OUT = {
  start: 0.02,
  end: 0.13,
} as const;

/** How-it-works step cards span this portion of hero scroll progress. */
export const HERO_V3_STORY_SCROLL = {
  start: 0.05,
  end: 0.82,
} as const;

/** Act 3 — iPhone + monitor reveal (matches legacy `ACT3_SCENE_START`). */
export const HERO_V3_ACT3_SCROLL = {
  start: 0.72,
  fadeInEnd: 0.77,
  fadeOutStart: 0.98,
  end: 1,
} as const;

export const HERO_V3_ACT3_HEADING = "Optimised for desktop and mobile from day 1";

/** Remap step card windows (Act 2 local 0–1) onto HeroV3 scroll progress. */
export function remapHeroV3StepProgress(local: RocketTextProgress): RocketTextProgress {
  const { start, end } = HERO_V3_STORY_SCROLL;
  const span = end - start;

  return {
    in: start + local.in * span,
    holdStart: start + local.holdStart * span,
    holdEnd: start + local.holdEnd * span,
    out: start + local.out * span,
  };
}
