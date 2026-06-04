"use client";

import { useAnimate, AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export let introHasPlayed = false;
let doneSubscribers: Array<() => void> = [];

function releaseIntroGate() {
  const cover = document.getElementById("aperix-intro-cover");
  if (cover) {
    cover.style.transition = "opacity 0.25s ease";
    cover.style.opacity = "0";
    setTimeout(() => cover.remove(), 280);
  }
  document.documentElement.removeAttribute("data-aperix-intro");
  document.getElementById("aperix-intro-gate")?.remove();
}

export function onIntroDone(cb: () => void): () => void {
  if (introHasPlayed) { cb(); return () => {}; }
  doneSubscribers.push(cb);
  return () => { doneSubscribers = doneSubscribers.filter((fn) => fn !== cb); };
}

// Total animation duration in ms  used to sync the CSS bar & bg transition
const TOTAL_MS = 3800;

// Initial hold before anything moves + the exit fade duration.
const HOLD_MS = 200;
const EXIT_MS = 300;

// Full wall-clock time the intro occupies, from mount to fully gone.
// Consumers (e.g. PageReveal failsafe) use this so timings stay in sync.
export const INTRO_FULL_MS = HOLD_MS + TOTAL_MS + EXIT_MS;

const LOGO_SIZE = 96;
const LOGO_H = Math.round(LOGO_SIZE * (836 / 768));

export default function IntroScreen() {
  const [scope, animate] = useAnimate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (introHasPlayed) {
      releaseIntroGate();
      return;
    }

    // Show intro client-side only — avoids hydration mismatch with the
    // script-injected cover div in layout.tsx which has different styles.
    setVisible(true);

    const run = async () => {
      try {
      // Short hold so the bg colour is seen before anything moves
      await new Promise<void>((r) => setTimeout(r, HOLD_MS));

      // --- Logo builds while bar fills (all parallel) ---

      // Outer hex draws
      animate("#ix-outer", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });

      // Inner fill fades in slightly after
      animate("#ix-inner-fill", { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.45 });

      // Inner ring draws
      animate("#ix-inner-stroke", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.55 });

      // Grid lines fan in
      animate("#ix-line-v",  { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.85 });
      animate("#ix-line-d1", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.92 });
      animate("#ix-line-d2", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.99 });
      animate("#ix-line-h",  { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 1.06 });

      // Wait for everything to settle
      await new Promise<void>((r) => setTimeout(r, TOTAL_MS));
      } finally {
        // Always run completion  even if an animate() call throws partway
        // through  so the page is never left permanently gated/blocked.
        setVisible(false);
        releaseIntroGate();
        introHasPlayed = true;
        doneSubscribers.forEach((fn) => fn());
        doneSubscribers = [];
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSec = TOTAL_MS / 1000;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={scope}
          key="aperix-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "#7ec8f0",
          }}
        >
          {/* Dark-blue slide overlay — sweeps left→right over the light blue base */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            background: "#1428a0",
            transformOrigin: "left center",
            animation: `ixSlide ${totalSec}s cubic-bezier(0.55,0,0.45,1) forwards`,
          }} />

          {/* Scanline overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",
          }} />

          {/* Main centred content */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "0.6rem",
            transform: "scale(var(--ix-scale,1))", transformOrigin: "center center",
          }} className="[--ix-scale:0.72] sm:[--ix-scale:1]">

            {/* Animated SVG logo */}
            <svg
              width={LOGO_SIZE}
              height={LOGO_H}
              viewBox="0 0 768 836"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginBottom: "0.5rem", filter: "drop-shadow(0 0 18px rgba(14,165,233,0.5))" }}
            >
              <defs>
                <linearGradient id="ix-grad" x1="384" y1="106" x2="384" y2="730" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#DFF2FF" />
                  <stop offset="1" stopColor="#BFE5FF" />
                </linearGradient>
              </defs>
              <path id="ix-outer" d="M384 76L660 236V556L384 716L108 556V236L384 76Z"
                stroke="#0EA5E9" strokeWidth="28" strokeLinejoin="round" opacity={0} />
              <path id="ix-inner-fill" d="M384 141L604 269V523L384 651L164 523V269L384 141Z"
                fill="url(#ix-grad)" opacity={0} />
              <path id="ix-inner-stroke" d="M384 273L516 349V503L384 579L252 503V349L384 273Z"
                stroke="rgba(255,255,255,0.85)" strokeWidth="28" strokeLinejoin="round" opacity={0} />
              <path id="ix-line-v"  d="M384 303V548"     stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
              <path id="ix-line-d1" d="M278 364L490 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
              <path id="ix-line-d2" d="M490 364L278 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
              <path id="ix-line-h"  d="M291 418H477"     stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
            </svg>

            {/* APERIX wordmark */}
            <div style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "clamp(2.6rem, 6vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "0.22em",
              color: "#ffffff",
              lineHeight: 1,
              textShadow: "0 0 32px rgba(14,165,233,0.55), 2px 0 0 rgba(255,255,255,0.35), -2px 0 0 rgba(14,165,233,0.4)",
            }}>
              APERIX
            </div>

            {/* Progress bar */}
            <div style={{
              width: "clamp(200px,35vw,320px)",
              height: 14,
              border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: 2,
              overflow: "hidden",
              background: "rgba(0,40,100,0.25)",
            }}>
              <div style={{
                height: "100%",
                width: "100%",
                background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.92) 0px,rgba(255,255,255,0.92) 10px,transparent 10px,transparent 14px)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
                animation: `ixBarGrow ${totalSec}s cubic-bezier(0.4,0,0.6,1) 0.2s forwards`,
              }} />
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            position: "absolute", bottom: "clamp(1rem,3vw,1.75rem)",
            left: 0, right: 0, textAlign: "center",
            zIndex: 2,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "clamp(0.55rem,1.1vw,0.68rem)",
            letterSpacing: "0.12em",
            color: "rgba(180,215,255,0.4)",
          }}>
            Copyright (c) Aperix Studio, 2026. All Rights Reserved.
          </div>

          <style>{`
            @keyframes ixSlide {
              0%   { transform: scaleX(0); }
              15%  { transform: scaleX(0.05); }
              60%  { transform: scaleX(0.65); }
              100% { transform: scaleX(1); }
            }
            @keyframes ixBarGrow {
              0%   { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
