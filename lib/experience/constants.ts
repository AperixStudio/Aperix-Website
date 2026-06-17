/** Global scroll when Act 3 logically begins (DOM heading, timeline act boundary). */
export const ACT3_SCENE_START = 0.72;

/** Dissolve begins — both scenes render to RTs, no white fade. */
export const ACT3_TRANSITION_START = 0.705;

/** Dissolve complete — PC scene disposed, Act 3 only. */
export const ACT3_TRANSITION_END = 0.735;

/** Begin preloading Act 3 assets before the swap. */
export const ACT3_PRELOAD_START = 0.62;

/** Tighter preload on mobile — less time with both scenes in memory. */
export const ACT3_PRELOAD_START_MOBILE = 0.7;

/** Feature flag — unified single-canvas story on the homepage. */
export const USE_UNIFIED_STORY_EXPERIENCE =
  process.env.NEXT_PUBLIC_UNIFIED_STORY_EXPERIENCE !== "false";
