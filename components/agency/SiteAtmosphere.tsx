"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

function InteractiveGrid() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      return;
    }

    const media = window.matchMedia("(pointer: coarse)");
    if (media.matches) {
      return;
    }

    let frame = 0;
    let lastX = -1;
    let lastY = -1;
    const THRESHOLD = 4; // px — skip update if pointer barely moved

    const onPointerMove = (event: PointerEvent) => {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      lastX = event.clientX;
      lastY = event.clientY;

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = `${Math.round((event.clientX / window.innerWidth) * 100)}%`;
        const y = `${Math.round((event.clientY / window.innerHeight) * 100)}%`;
        document.documentElement.style.setProperty("--agency-pointer-x", x);
        document.documentElement.style.setProperty("--agency-pointer-y", y);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [prefersReduced]);

  return <div aria-hidden="true" className="agency-interactive-bg" />;
}

export default function SiteAtmosphere() {
  return <InteractiveGrid />;
}
