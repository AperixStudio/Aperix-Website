"use client";

import { useEffect, useRef } from "react";
import { onIntroDone } from "./IntroScreen";

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => {
      // Remove the blocking cover div injected by the introCoverScript in layout.tsx
      const cover = document.getElementById('aperix-intro-cover');
      if (cover) {
        cover.style.transition = 'opacity 0.25s ease';
        cover.style.opacity = '0';
        setTimeout(() => cover.remove(), 280);
      }

      // 2. Fade the wrapper in
      const el = wrapRef.current;
      if (!el) return;
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = "1";
      el.style.visibility = "visible";
    };

    const unsubscribe = onIntroDone(reveal);
    return unsubscribe;
  }, []);

  // opacity:0 + visibility:hidden are static inline styles — SSR renders them
  // directly in the HTML so the page is invisible from byte-one, before any JS.
  // The reveal() function above overrides them when the intro finishes.
  return (
    <div
      id="aperix-page"
      ref={wrapRef}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {children}
    </div>
  );
}
