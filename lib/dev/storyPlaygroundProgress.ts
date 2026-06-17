import {
  ACT2_CAMERA_HOLD,
  HOME_STORY_ACTS,
  mapPcCameraProgress,
  mapScreenEvolutionProgress,
} from "@/lib/homeStoryTimeline";

export type StoryPlaygroundAct = 1 | 2 | 3;

export type StoryPlaygroundProgress = {
  heroProgress: number;
  modelProgress: number;
  act2Slide: number | null;
  screenEvolution: number;
  act3Progress: number;
};

/** Map act scrubber (0–1) to the same progress values the homepage uses. */
export function mapPlaygroundScrub(act: StoryPlaygroundAct, scrub: number): StoryPlaygroundProgress {
  const t = Math.min(1, Math.max(0, scrub));

  if (act === 1) {
    const global = t * HOME_STORY_ACTS.act1ZoomOut.end;
    const progress = mapPcCameraProgress(global);
    return {
      heroProgress: progress,
      modelProgress: progress,
      act2Slide: null,
      screenEvolution: 0,
      act3Progress: 0,
    };
  }

  if (act === 2) {
    // Main scrub drives BOTH the PC slide and the monitor evolution (mirrors homepage scroll).
    // Camera + Act 1 model are held, so Act 2 is fully independent of Act 1.
    const { start, end } = HOME_STORY_ACTS.act2Monitor;
    const global = start + t * (end - start);
    return {
      heroProgress: ACT2_CAMERA_HOLD,
      modelProgress: ACT2_CAMERA_HOLD,
      act2Slide: t,
      screenEvolution: mapScreenEvolutionProgress(global),
      act3Progress: 0,
    };
  }

  return {
    heroProgress: 0,
    modelProgress: 0,
    act2Slide: null,
    screenEvolution: 1,
    act3Progress: t,
  };
}

export const STORY_PLAYGROUND_ACT_LABELS: Record<StoryPlaygroundAct, string> = {
  1: "Act 1 · PC zoom out",
  2: "Act 2 · PC slide left + monitor evolution",
  3: "Act 3 · iPhone + monitor",
};
