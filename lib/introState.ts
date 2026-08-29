/**
 * introState — shared mutable gate between intro screens and the rest of the app.
 *
 * Extracted so IntroScreen (original) and IntroScreenSimple (new) can both
 * drive the same subscribers without duplicating state.
 */

export let introHasPlayed = false;
export let doneSubscribers: Array<() => void> = [];

/** Fade out and remove the opaque cover div that blocks flash-of-content. */
export function releaseIntroGate() {
  const cover = document.getElementById("aperix-intro-cover");
  if (cover) {
    cover.style.transition = "opacity 0.25s ease";
    cover.style.opacity = "0";
    setTimeout(() => cover.remove(), 280);
  }
  document.documentElement.removeAttribute("data-aperix-intro");
  document.getElementById("aperix-intro-gate")?.remove();
}

/** Mark intro as done and fire all waiting subscribers. */
export function markIntroDone() {
  introHasPlayed = true;
  const subs = [...doneSubscribers];
  doneSubscribers = [];
  subs.forEach((fn) => fn());
}

/**
 * Subscribe to intro completion.
 * Fires immediately if the intro has already played (e.g. SPA navigation).
 * Returns an unsubscribe function.
 */
export function onIntroDone(cb: () => void): () => void {
  if (introHasPlayed) {
    cb();
    return () => {};
  }
  doneSubscribers.push(cb);
  return () => {
    doneSubscribers = doneSubscribers.filter((fn) => fn !== cb);
  };
}
