/**
 * Intro loading gate — SiteBackground and HeroV4 signal when their assets are ready.
 * IntroScreen holds the glitch phase until both fire (with min/max bounds).
 */

let backgroundReady = false;
let heroReady = false;
let backgroundSubscribers: Array<() => void> = [];
let heroSubscribers: Array<() => void> = [];

export function isIntroBackgroundReady() {
  return backgroundReady;
}

export function isIntroHeroReady() {
  return heroReady;
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

export function signalIntroHeroReady() {
  if (heroReady) {
    return;
  }
  heroReady = true;
  heroSubscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      /* must not block intro exit */
    }
  });
  heroSubscribers = [];
}

export function whenIntroBackgroundReady(): Promise<void> {
  if (backgroundReady) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    backgroundSubscribers.push(resolve);
  });
}

export function whenIntroHeroReady(): Promise<void> {
  if (heroReady) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    heroSubscribers.push(resolve);
  });
}

/** Resolves when background + hero are both ready (hero skipped if already signalled). */
export function whenIntroSceneReady(): Promise<void> {
  return Promise.all([whenIntroBackgroundReady(), whenIntroHeroReady()]).then(() => undefined);
}

/** Failsafe so a broken asset never traps the intro forever. */
export const INTRO_BACKGROUND_FAILSAFE_MS = 5500;
