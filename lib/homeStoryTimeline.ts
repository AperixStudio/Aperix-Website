/** Global scroll timeline for the homepage hero + how-it-works story. */

export const HOME_STORY_SCROLL_VH = 450;

export const HOME_STORY_ACTS = {
  /** Start zoomed in on monitor (video) → pull back to reveal the machine */
  act1ZoomOut: { start: 0, end: 0.22 },
  /** Push into monitor — blueprint → wireframe → live on screen + step cards */
  act2Monitor: { start: 0.22, end: 0.72 },
  /** Pull back from the PC and exit the sequence */
  act3ZoomOut: { start: 0.72, end: 1 },
} as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function mapRange(
  value: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  if (inEnd <= inStart) {
    return outStart;
  }
  const t = clamp01((value - inStart) / (inEnd - inStart));
  return outStart + t * (outEnd - outStart);
}

export function mapToActLocal(
  global: number,
  act: { start: number; end: number },
) {
  return mapRange(global, act.start, act.end, 0, 1);
}

/**
 * PC camera mapped to HeroCanvas scrollProgress (same as /dev/hero-canvas scrubber):
 * 0 = zoomed in on monitor, 1 = pulled back / wide.
 * Homepage story: in → out → in → out.
 */
export function mapPcCameraProgress(global: number) {
  const { act1ZoomOut, act2Monitor, act3ZoomOut } = HOME_STORY_ACTS;

  if (global <= act1ZoomOut.end) {
    return mapRange(global, act1ZoomOut.start, act1ZoomOut.end, 0, 1);
  }

  if (global <= act2Monitor.end) {
    return mapRange(global, act2Monitor.start, act2Monitor.end, 1, 0);
  }

  if (global <= act3ZoomOut.end) {
    return mapRange(global, act3ZoomOut.start, act3ZoomOut.end, 0, 1);
  }

  return 1;
}

/** Blueprint / wireframe / live progression on the monitor (Act 2 only) */
export function mapScreenEvolutionProgress(global: number) {
  const { act2Monitor } = HOME_STORY_ACTS;

  if (global <= act2Monitor.start) {
    return 0;
  }

  if (global >= act2Monitor.end) {
    return 1;
  }

  return mapToActLocal(global, act2Monitor);
}

/** Remap card timing windows from Act 2 local (0–1) to global scroll progress */
export function mapAct2ProgressToGlobal(localProgress: number) {
  const { act2Monitor } = HOME_STORY_ACTS;
  return mapRange(localProgress, 0, 1, act2Monitor.start, act2Monitor.end);
}

export function remapBlockProgressForGlobalStory(local: {
  in: number;
  holdStart: number;
  holdEnd: number;
  out: number;
}) {
  return {
    in: mapAct2ProgressToGlobal(local.in),
    holdStart: mapAct2ProgressToGlobal(local.holdStart),
    holdEnd: mapAct2ProgressToGlobal(local.holdEnd),
    out: mapAct2ProgressToGlobal(local.out),
  };
}
