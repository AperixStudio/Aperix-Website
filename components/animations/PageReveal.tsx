"use client";

import { useEffect, useRef } from "react";
import { INTRO_FULL_MS, onIntroDone } from "./IntroScreen";

// Failsafe: reveal the page no later than the full intro duration + 2s, even
// if the intro animation never signals completion (e.g. a hydration hiccup or
// older mobile browser). This guarantees the site can never be left blank or
// blocked behind the invisible intro cover. The +2s buffer ensures a healthy
// intro is never cut off  the normal onIntroDone path fires well before this.
const REVEAL_FAILSAFE_MS = INTRO_FULL_MS + 2000;

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;

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

    // Hard failsafe  fires only if the normal intro-done signal never arrives.
    const failsafe = window.setTimeout(reveal, REVEAL_FAILSAFE_MS);

    return () => {
      unsubscribe();
      window.clearTimeout(failsafe);
    };
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
