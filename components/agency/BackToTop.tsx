"use client";

import { useCallback } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function BackToTop() {
  const prefersReduced = useReducedMotion();

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [prefersReduced]);

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-6 pb-3 pt-8">
      <button
        type="button"
        onClick={scrollToTop}
        className="text-[11px] font-bold uppercase tracking-[0.18em] text-agency-muted/50 transition hover:text-agency-muted"
        aria-label="Back to top"
      >
        Back to top
      </button>
    </div>
  );
}