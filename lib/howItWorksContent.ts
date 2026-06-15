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
    title: "Start the Conversation",
    body:
      "You send through a brief and we talk through the business, the goals, and what the site needs to do. You get a direct point of contact, a clear scope, and a straightforward next step before any work begins.",
    progress: {
      in: 0.02,
      holdStart: 0.06,
      holdEnd: ACT2_WIREFRAME_START - 0.02,
      out: ACT2_WIREFRAME_START + 0.02,
    },
    placement: { x: 20, y: 28, anchor: "top-left", mobile: { x: 50, y: 82, anchor: "center" } },
  },
  {
    id: "step-2",
    number: "02",
    title: "Shape the Direction",
    body:
      "We map out the page structure, content flow, and visual direction with you before the build gets underway. Depending on the project, that might be a Figma concept or a working draft in code so we can test the ideas properly.",
    progress: {
      in: ACT2_WIREFRAME_START - 0.04,
      holdStart: ACT2_WIREFRAME_START + 0.04,
      holdEnd: ACT2_WIREFRAME_END - 0.04,
      out: ACT2_WIREFRAME_END + 0.02,
    },
    placement: { x: 20, y: 50, anchor: "center-left", mobile: { x: 50, y: 82, anchor: "center" } },
  },
  {
    id: "step-3",
    number: "03",
    title: "Build, Refine & Launch",
    body:
      "Once the direction feels right, we build the site, test it across devices, refine the details, and get it live. You also get handover support so the launch feels smooth and the site is ready to use from day one.",
    progress: {
      in: ACT2_WIREFRAME_END - 0.04,
      holdStart: ACT2_WIREFRAME_END + 0.04,
      holdEnd: 0.94,
      out: 0.98,
    },
    placement: { x: 20, y: 72, anchor: "bottom-left", mobile: { x: 50, y: 82, anchor: "center" } },
  },
];

/** @deprecated Use HOW_IT_WORKS_BLOCKS */
export const ROCKET_TEXT_BLOCKS = HOW_IT_WORKS_BLOCKS;
