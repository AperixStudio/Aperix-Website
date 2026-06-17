/** Global scroll timeline for the homepage hero + how-it-works story. */

/** Story scroll length — Act 1 + Act 2 + Act 3 reveal. */
export const HOME_STORY_SCROLL_VH = 450;

/** Shorter story on mobile — same beats, less thumb travel. */
export const HOME_STORY_SCROLL_VH_MOBILE = 300;

export const HOME_STORY_ACTS = {
  /** Start zoomed in on monitor (video) → pull back to reveal the machine → slight push-in */
  act1ZoomOut: { start: 0, end: 0.30 },
  /** Push into monitor — blueprint → wireframe → live on screen + step cards */
  act2Monitor: { start: 0.30, end: 0.72 },
  /** iPhone + monitor reveal — transparent WebGL over SiteAtmosphere */
  act3Reveal: { start: 0.72, end: 1 },
} as const;

/**
 * Act 1 camera beats (HeroCanvas progress: 0 = tight on monitor, 1 = fully pulled back).
 * Local 0 → PULLBACK_COMPLETE: zoom in → full pull-back.
 * PULLBACK_COMPLETE → 1: hold wide beat, then ease slightly back in before Act 2.
 */
export const ACT1_PULLBACK_COMPLETE = 0.62;
export const ACT1_END_CAMERA = 0.82;

/** Act 2 — camera holds Act 1 exit framing; model slides on its own track. */
export const ACT2_CAMERA_HOLD = ACT1_END_CAMERA;

/** Act 2 local progress when wireframe begins (synced with deskEvolutionScreen.js). */
export const ACT2_WIREFRAME_START = 0.38;

/** Act 2 local progress when wireframe fades out / live site takes over. */
export const ACT2_WIREFRAME_END = 0.66;

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
 * PC camera progress (0 = tight on monitor, 1 = pulled back).
 * Act 1: zoom out beats. Act 2: held — no push-in zoom.
 */
export function mapPcCameraProgress(global: number) {
  const { act1ZoomOut, act2Monitor } = HOME_STORY_ACTS;

  if (global <= act1ZoomOut.end) {
    const local = mapToActLocal(global, act1ZoomOut);

    if (local <= ACT1_PULLBACK_COMPLETE) {
      return mapRange(local, 0, ACT1_PULLBACK_COMPLETE, 0, 1);
    }

    return mapRange(local, ACT1_PULLBACK_COMPLETE, 1, 1, ACT1_END_CAMERA);
  }

  if (global <= act2Monitor.end) {
    return ACT2_CAMERA_HOLD;
  }

  return 0;
}

/**
 * Act 1 model + screen rig progress (0 = tight, 1 = pulled back).
 * During Act 2 this stays at ACT2_CAMERA_HOLD — use mapAct2SlideProgress for the slide.
 */
export function mapPcModelProgress(global: number) {
  const { act1ZoomOut } = HOME_STORY_ACTS;

  if (global <= act1ZoomOut.end) {
    return mapPcCameraProgress(global);
  }

  return ACT2_CAMERA_HOLD;
}

/** Act 2 local slide progress (0 = Act 1 exit pose, 1 = act2ModelOffsetEnd*). Null outside Act 2. */
export function mapAct2SlideProgress(global: number): number | null {
  const { act2Monitor } = HOME_STORY_ACTS;

  if (global < act2Monitor.start) {
    return null;
  }

  if (global >= act2Monitor.end) {
    return 1;
  }

  return mapToActLocal(global, act2Monitor);
}

/** Act 3 local progress (0 = tight, 1 = wide reveal) for iPhone + monitor scene. */
export function mapAct3RevealProgress(global: number) {
  const { act3Reveal } = HOME_STORY_ACTS;

  if (global <= act3Reveal.start) {
    return 0;
  }

  if (global >= act3Reveal.end) {
    return 1;
  }

  return mapToActLocal(global, act3Reveal);
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

/** Map full-story scroll progress to Act 2 local (0–1) for step cards. */
export function mapGlobalToAct2Progress(global: number) {
  const { act2Monitor } = HOME_STORY_ACTS;

  if (global <= act2Monitor.start) {
    return 0;
  }

  if (global >= act2Monitor.end) {
    return 1;
  }

  return mapToActLocal(global, act2Monitor);
}

/** Remap Act 1 local progress (0–1) to global scroll progress */
export function mapAct1ProgressToGlobal(localProgress: number) {
  const { act1ZoomOut } = HOME_STORY_ACTS;
  return mapRange(localProgress, 0, 1, act1ZoomOut.start, act1ZoomOut.end);
}

/** Global scroll when Act 1 pull-back finishes (camera at its widest). */
export const ACT1_PULLBACK_COMPLETE_GLOBAL = mapAct1ProgressToGlobal(ACT1_PULLBACK_COMPLETE);

/** Act 1 local progress when hero copy begins fading in during pull-back. */
export const ACT1_HERO_FADE_IN_START = 0.05;
export const ACT1_HERO_FADE_IN_START_GLOBAL = mapAct1ProgressToGlobal(ACT1_HERO_FADE_IN_START);

/** Act 1 local progress when hero copy starts fading out (default: when push-in begins). */
export const ACT1_HERO_FADE_OUT_START = ACT1_PULLBACK_COMPLETE + 0.02;

/** Act 1 local progress when hero copy is fully gone. Must be greater than ACT1_HERO_FADE_OUT_START. */
export const ACT1_HERO_FADE_OUT_END = 0.8;

/** Hero headline opacity across Act 1 — safe at any fade-out timing (no keyframe ordering crashes). */
export function mapHeroTextOpacity(global: number) {
  const fadeInStart = ACT1_HERO_FADE_IN_START_GLOBAL;
  const fadeInEnd = ACT1_PULLBACK_COMPLETE_GLOBAL;
  const fadeOutStart = mapAct1ProgressToGlobal(ACT1_HERO_FADE_OUT_START);
  const fadeOutEnd = mapAct1ProgressToGlobal(
    Math.max(ACT1_HERO_FADE_OUT_END, ACT1_HERO_FADE_OUT_START + 0.02),
  );

  if (global <= fadeInStart) {
    return 0;
  }

  if (global < fadeOutStart) {
    if (global < fadeInEnd) {
      return mapRange(global, fadeInStart, fadeInEnd, 0, 1);
    }
    return 1;
  }

  if (global >= fadeOutEnd) {
    return 0;
  }

  return mapRange(global, fadeOutStart, fadeOutEnd, 1, 0);
}

/** Global scroll progress when the wireframe era begins on the monitor. */
export const ACT2_WIREFRAME_START_GLOBAL = mapAct2ProgressToGlobal(ACT2_WIREFRAME_START);

/** Global scroll progress when wireframe yields to the live-site era. */
export const ACT2_WIREFRAME_END_GLOBAL = mapAct2ProgressToGlobal(ACT2_WIREFRAME_END);

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
