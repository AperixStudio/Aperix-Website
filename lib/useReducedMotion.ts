"use client";

import { useEffect, useState } from "react";

/**
 * PRD §3.4 — Respect `prefers-reduced-motion`.
 * Returns `true` when the user prefers reduced motion.
 * All Framer Motion animations should be conditional on this value.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
