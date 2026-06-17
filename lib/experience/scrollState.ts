import {
  HOME_STORY_ACTS,
  mapAct3RevealProgress,
  mapAct2SlideProgress,
  mapPcCameraProgress,
  mapPcModelProgress,
  mapScreenEvolutionProgress,
} from "@/lib/homeStoryTimeline";
import {
  ACT3_SCENE_START,
  ACT3_TRANSITION_END,
  ACT3_TRANSITION_START,
} from "@/lib/experience/constants";
import type { StoryActId, StoryScrollFrame } from "@/lib/experience/types";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Scroll-driven dissolve mix — direct scene-to-scene, no white haze. */
export function getAct3TransitionBlend(global: number) {
  if (global <= ACT3_TRANSITION_START) {
    return 0;
  }

  if (global >= ACT3_TRANSITION_END) {
    return 1;
  }

  return clamp01((global - ACT3_TRANSITION_START) / (ACT3_TRANSITION_END - ACT3_TRANSITION_START));
}

function resolveAct(global: number): StoryActId {
  if (global >= HOME_STORY_ACTS.act3Reveal.start) {
    return "act3Reveal";
  }
  if (global >= HOME_STORY_ACTS.act2Monitor.start) {
    return "act2Monitor";
  }
  return "act1ZoomOut";
}

/** Derive all scene-relevant scroll values from one global progress (0–1). */
export function getStoryScrollFrame(global: number): StoryScrollFrame {
  const clamped = Math.min(1, Math.max(0, global));

  const act3TransitionBlend = getAct3TransitionBlend(clamped);

  return {
    global: clamped,
    act: resolveAct(clamped),
    pcCameraProgress: mapPcCameraProgress(clamped),
    pcModelProgress: mapPcModelProgress(clamped),
    act2SlideProgress: mapAct2SlideProgress(clamped),
    screenEvolutionProgress: mapScreenEvolutionProgress(clamped),
    act3RevealProgress: mapAct3RevealProgress(clamped),
    act3TransitionBlend,
    showPcScene: clamped < ACT3_SCENE_START,
    showAct3Scene: clamped >= ACT3_SCENE_START,
    isAct3Transitioning: act3TransitionBlend > 0 && act3TransitionBlend < 1,
  };
}
