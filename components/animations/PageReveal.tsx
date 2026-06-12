"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { INTRO_FULL_MS, onIntroDone } from "./IntroScreen";

const REVEAL_FAILSAFE_MS = INTRO_FULL_MS + 2000;

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDevRoute = pathname.startsWith("/dev");

  useEffect(() => {
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;

      const cover = document.getElementById("aperix-intro-cover");
      if (cover) {
        cover.style.transition = "opacity 0.25s ease";
        cover.style.opacity = "0";
        setTimeout(() => cover.remove(), 280);
      }

      const el = wrapRef.current;
      if (!el) return;
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = "1";
      el.style.visibility = "visible";
    };

    if (isDevRoute) {
      requestAnimationFrame(reveal);
      return;
    }

    const unsubscribe = onIntroDone(reveal);

    const failsafe = window.setTimeout(reveal, REVEAL_FAILSAFE_MS);

    return () => {
      unsubscribe();
      window.clearTimeout(failsafe);
    };
  }, [isDevRoute]);

  return (
    <div
      id="aperix-page"
      ref={wrapRef}
      style={isDevRoute ? undefined : { opacity: 0, visibility: "hidden" }}
    >
      {children}
    </div>
  );
}
