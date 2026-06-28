/**
 * Intro loading gate — SiteBackground signals when its asset is ready.
 * IntroScreen holds the glitch phase until this fires (with min/max bounds).
 */

let backgroundReady = false;
let backgroundSubscribers: Array<() => void> = [];

export function isIntroBackgroundReady() {
  return backgroundReady;
}

export function signalIntroBackgroundReady() {
  if (backgroundReady) {
    return;
  }
  backgroundReady = true;
  backgroundSubscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      /* must not block intro exit */
    }
  });
  backgroundSubscribers = [];
}

export function whenIntroBackgroundReady(): Promise<void> {
  if (backgroundReady) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    backgroundSubscribers.push(resolve);
  });
}

/** Failsafe so a broken asset never traps the intro forever. */
export const INTRO_BACKGROUND_FAILSAFE_MS = 5500;
