/** Scroll-synced copy for the How It Works desk evolution section */

import { ACT2_WIREFRAME_END, ACT2_WIREFRAME_START } from "./homeStoryTimeline";

export type RocketTextAnchor =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "center-left"
  | "center-right";

export type RocketTextProgress = {
  in: number;
  holdStart: number;
  holdEnd: number;
  out: number;
};

export type RocketTextPlacement = {
  x: number;
  y: number;
  anchor?: RocketTextAnchor;
  /** Overrides placement below md breakpoint (cards centered, clear of hero copy). */
  mobile?: {
    x: number;
    y: number;
    anchor?: RocketTextAnchor;
  };
};

export type RocketTextBlock = {
  id: string;
  number: string;
  title: string;
  body: string;
  progress: RocketTextProgress;
  placement: RocketTextPlacement;
};

/**
 * Card windows are Act 2 local (0–1). Slight overlap at boundaries so cards
 * crossfade instead of leaving dead zones. Era alignment:
 *   step 1 · blueprint  → through ~WIREFRAME_START
 *   step 2 · wireframe  → through ~WIREFRAME_END
 *   step 3 · live site  → end of Act 2
 */
export const HOW_IT_WORKS_BLOCKS: RocketTextBlock[] = [
  {
    id: "step-1",
    number: "01",
    title: "Say hello",
    body:
      "Send us a note with whatever you have — a rough idea, a half-finished brief, or just a problem you want fixed. It's always us two on the other end. No forms maze, no account manager.",
    progress: {
      in: 0.02,
      holdStart: 0.08,
      holdEnd: ACT2_WIREFRAME_START - 0.06,
      out: ACT2_WIREFRAME_START - 0.02,
    },
    placement: { x: 20, y: 50, anchor: "center-left", mobile: { x: 50, y: 78, anchor: "center" } },
  },
  {
    id: "step-2",
    number: "02",
    title: "Sketch it out",
    body:
      "We figure out structure, flow, and feel together before the heavy build. Might be a wireframe on screen, might be a quick coded draft — whatever helps us both see if it's heading the right way.",
    progress: {
      in: ACT2_WIREFRAME_START + 0.01,
      holdStart: ACT2_WIREFRAME_START + 0.06,
      holdEnd: ACT2_WIREFRAME_END - 0.06,
      out: ACT2_WIREFRAME_END - 0.01,
    },
    placement: { x: 20, y: 50, anchor: "center-left", mobile: { x: 50, y: 78, anchor: "center" } },
  },
  {
    id: "step-3",
    number: "03",
    title: "Build & ship",
    body:
      "Then we hand-code it, test it on real devices, and get it live. We stay through launch — small team, so the people who built it are the ones answering your messages.",
    progress: {
      in: ACT2_WIREFRAME_END + 0.01,
      holdStart: ACT2_WIREFRAME_END + 0.06,
      holdEnd: 0.93,
      out: 0.99,
    },
    placement: { x: 20, y: 50, anchor: "center-left", mobile: { x: 50, y: 78, anchor: "center" } },
  },
];

/** @deprecated Use HOW_IT_WORKS_BLOCKS */
export const ROCKET_TEXT_BLOCKS = HOW_IT_WORKS_BLOCKS;
