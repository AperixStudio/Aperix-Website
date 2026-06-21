import type { StoryPlaygroundAct } from "@/lib/dev/storyPlaygroundProgress";

export type HeroCaptureProgressInput = {
  /** Act to render (1 or 2). */
  act?: StoryPlaygroundAct;
  /** Local act progress 0–1. */
  scrub?: number;
  /** Use mobile hero config + viewport sizing. */
  mobile?: boolean;
};

export type HeroCaptureState = {
  ready: boolean;
  act: StoryPlaygroundAct;
  scrub: number;
  mobile: boolean;
  frame: number;
  error: string | null;
};

export type HeroCaptureApi = {
  /** Wait until the WebGL scene has loaded. */
  waitForReady: (timeoutMs?: number) => Promise<void>;
  /** Set act + scrub and wait for WebGL to settle. */
  setProgress: (input: HeroCaptureProgressInput) => Promise<void>;
  /** Current capture state (for Puppeteer polling). */
  getState: () => HeroCaptureState;
  /** rAF settle — call after setProgress before screenshot. */
  waitForFrameSettle: (frames?: number) => Promise<void>;
};

declare global {
  interface Window {
    __HERO_CAPTURE__?: HeroCaptureApi;
  }
}

/** Wait N animation frames so WebGL finishes applying the new pose. */
export function waitForFrameSettle(frames = 3): Promise<void> {
  return new Promise((resolve) => {
    let remaining = frames;

    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

export function waitForCaptureReady(timeoutMs = 120_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    const check = () => {
      if (window.__HERO_CAPTURE__?.getState().ready) {
        resolve();
        return;
      }
      if (performance.now() - start > timeoutMs) {
        reject(new Error("Hero capture scene did not become ready in time"));
        return;
      }
      requestAnimationFrame(check);
    };

    check();
  });
}
