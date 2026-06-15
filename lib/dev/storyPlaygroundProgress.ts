import {
  HOME_STORY_ACTS,
  mapAct3RevealProgress,
  mapPcCameraProgress,
  mapScreenEvolutionProgress,
} from "@/lib/homeStoryTimeline";

export type StoryPlaygroundAct = 1 | 2 | 3;

export type StoryPlaygroundProgress = {
  heroProgress: number;
  screenEvolution: number;
  act3Progress: number;
};

/** Map act scrubber (0–1) to the same progress values the homepage uses. */
export function mapPlaygroundScrub(act: StoryPlaygroundAct, scrub: number): StoryPlaygroundProgress {
  const t = Math.min(1, Math.max(0, scrub));

  if (act === 1) {
    const global = t * HOME_STORY_ACTS.act1ZoomOut.end;
    return {
      heroProgress: mapPcCameraProgress(global),
      screenEvolution: 0,
      act3Progress: 0,
    };
  }

  if (act === 2) {
    const { start, end } = HOME_STORY_ACTS.act2Monitor;
    const global = start + t * (end - start);
    return {
      heroProgress: mapPcCameraProgress(global),
      screenEvolution: mapScreenEvolutionProgress(global),
      act3Progress: 0,
    };
  }

  return {
    heroProgress: 0,
    screenEvolution: 1,
    act3Progress: t,
  };
}

export const STORY_PLAYGROUND_ACT_LABELS: Record<StoryPlaygroundAct, string> = {
  1: "Act 1 · PC zoom out",
  2: "Act 2 · Monitor evolution",
  3: "Act 3 · iPhone + monitor",
};
