import type * as THREE from "three";

export type ExperienceTier = "full" | "lite";

export type StoryActId = "act1ZoomOut" | "act2Monitor" | "act3Reveal";

export type StoryScrollFrame = {
  global: number;
  act: StoryActId;
  pcCameraProgress: number;
  pcModelProgress: number;
  /** 0–1 slide within Act 2; null outside Act 2. */
  act2SlideProgress: number | null;
  screenEvolutionProgress: number;
  act3RevealProgress: number;
  /** 0 = PC only, 1 = Act 3 only — drives shader dissolve. */
  act3TransitionBlend: number;
  showPcScene: boolean;
  showAct3Scene: boolean;
  /** True while both scenes may be rendered for the dissolve pass. */
  isAct3Transitioning: boolean;
};

/** Imperative Three.js scene owned by the unified experience orchestrator. */
export type StorySceneController = {
  id: "pc" | "act3";
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tick: () => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
  isReady: () => boolean;
  getStatus: () => string | null;
};
