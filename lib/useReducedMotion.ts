"use client";

import { useSyncExternalStore } from "react";

/**
 * PRD §3.4 originally called for respecting `prefers-reduced-motion`.
 *
 * That accommodation is now disabled by product decision: the site plays its
 * full animation for everyone, including users whose OS asks for reduced
 * motion. This constant is the single switch for the JS side — flipping it
 * back to `true` restores the original behaviour across all ~34 call sites at
 * once, with no other edits.
 *
 * The CSS side lives in commented-out `@media (prefers-reduced-motion:
 * reduce)` blocks; grep for "Reduced-motion accommodation disabled" to find
 * them if you restore this.
 */
const RESPECT_REDUCED_MOTION = false;

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (!RESPECT_REDUCED_MOTION) return () => {};

  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return RESPECT_REDUCED_MOTION && window.matchMedia(QUERY).matches;
}

/** Always false on the server, so SSR and the initial client HTML agree. */
function getServerSnapshot(): boolean {
  return false;
}

/** Returns `true` when the user prefers reduced motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
