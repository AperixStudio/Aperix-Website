/**
 * storyBus — tiny handshake between IntroScreen (DOM loading screen) and
 * StoryCanvas (three.js scene).
 *
 * The intro's "frozen at 90%" glitch doubles as a REAL loading screen:
 * IntroScreen holds the glitch loop until the 3D scene reports ready
 * (or a failsafe expires), so the zoom-out reveal never shows a half
 * loaded scene.
 */

let sceneExpected = false;
let sceneReady = false;
let readySubscribers: Array<() => void> = [];

/** StoryCanvas calls this on mount, before models finish loading. */
export function expectScene() {
  sceneExpected = true;
}

/** True if a StoryCanvas has mounted on this page. */
export function isSceneExpected() {
  return sceneExpected;
}

/** StoryCanvas calls this once all models are loaded and the first frame rendered. */
export function signalSceneReady() {
  if (sceneReady) {
    return;
  }
  sceneReady = true;
  readySubscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      /* subscriber errors must not block the intro */
    }
  });
  readySubscribers = [];
}

export function isSceneReady() {
  return sceneReady;
}

/**
 * Subscribe to scene-ready. Fires immediately if already ready.
 * Returns an unsubscribe function.
 */
export function onSceneReady(cb: () => void): () => void {
  if (sceneReady) {
    cb();
    return () => {};
  }
  readySubscribers.push(cb);
  return () => {
    readySubscribers = readySubscribers.filter((fn) => fn !== cb);
  };
}

/* ── Intro → scene visual handoff ─────────────────────────────
   The DOM intro freezes at a known visual state (sweep at 90%,
   glitching). The CRT screen texture replicates that exact state,
   so when the intro fades the scene behind it looks identical.
   These values are shared so both sides stay in sync. */

/** Fraction where the dark sweep freezes. */
export const INTRO_STALL_FRACTION = 0.9;

/** Wall-clock origin for the glitch noise so DOM + canvas jitter match. */
let glitchEpoch = -1;

export function markGlitchEpoch() {
  glitchEpoch = performance.now();
}

/** Returns seconds since glitch started, or -1 if glitch hasn't started yet. */
export function glitchTime(): number {
  if (glitchEpoch < 0) return -1;
  return (performance.now() - glitchEpoch) / 1000;
}
