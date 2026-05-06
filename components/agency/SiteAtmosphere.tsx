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

    const onPointerMove = (event: PointerEvent) => {
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
