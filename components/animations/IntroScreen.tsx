"use client";

import { useAnimate, AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { INTRO_STALL_FRACTION, markGlitchEpoch } from "@/lib/storyBus";
import {
  INTRO_BACKGROUND_FAILSAFE_MS,
  whenIntroSceneReady,
} from "@/lib/introAssets";

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
  if (introHasPlayed) {
    cb();
    return () => {};
  }
  doneSubscribers.push(cb);
  return () => {
    doneSubscribers = doneSubscribers.filter((fn) => fn !== cb);
  };
}

/* ── Timing ───────────────────────────────────────────────────
   load   — bar fills to 100%, dark sweep climbs to 90%
   glitch — sweep frozen at 90%; holds until background is ready
            (min glitch time + max failsafe so intro never traps)
   exit   — fast fade revealing the page behind it  */
const HOLD_MS = 200;
const LOAD_MS = 2000;
const GLITCH_MIN_MS = 900;
const EXIT_MS = 250;

/** Nominal wall-clock estimate (PageReveal failsafe adds its own margin). */
export const INTRO_FULL_MS =
  HOLD_MS + LOAD_MS + Math.max(GLITCH_MIN_MS, INTRO_BACKGROUND_FAILSAFE_MS) + EXIT_MS;

const STALL_PCT = Math.round(INTRO_STALL_FRACTION * 100);
const LOGO_SIZE = 96;
const LOGO_H = Math.round(LOGO_SIZE * (836 / 768));

type Phase = "load" | "glitch";

export default function IntroScreen() {
  const [scope, animate] = useAnimate();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("load");
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (introHasPlayed) {
      releaseIntroGate();
      return;
    }

    if (window.location.pathname.startsWith("/dev")) {
      introHasPlayed = true;
      releaseIntroGate();
      doneSubscribers.forEach((cb) => cb());
      doneSubscribers = [];
      return;
    }

    setVisible(true);

    let cancelled = false;
    let pctTimer: ReturnType<typeof setInterval> | null = null;

    const finish = () => {
      if (cancelled) {
        return;
      }
      setVisible(false);
      releaseIntroGate();
      introHasPlayed = true;
      doneSubscribers.forEach((fn) => fn());
      doneSubscribers = [];
    };

    const run = async () => {
      try {
        await new Promise<void>((r) => setTimeout(r, HOLD_MS));
        if (cancelled) return;

        /* logo builds while the bar fills */
        animate("#ix-outer", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });
        animate("#ix-inner-fill", { opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.45 });
        animate("#ix-inner-stroke", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.55, ease: "easeOut", delay: 0.55 });
        animate("#ix-line-v", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.85 });
        animate("#ix-line-d1", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.92 });
        animate("#ix-line-d2", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 0.99 });
        animate("#ix-line-h", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.28, ease: "easeOut", delay: 1.06 });

        /* percentage counter — tracks the sweep, lands on 90 */
        const pctStart = performance.now();
        pctTimer = setInterval(() => {
          const el = pctRef.current;
          if (!el) return;
          const t = Math.min(1, (performance.now() - pctStart) / LOAD_MS);
          const eased = 1 - Math.pow(1 - t, 2.2);
          el.textContent = `${Math.min(STALL_PCT, Math.round(eased * STALL_PCT + t * 2))}%`;
        }, 64);

        await new Promise<void>((r) => setTimeout(r, LOAD_MS));
        if (cancelled) return;

        /* ── freeze + glitch ── */
        if (pctTimer) {
          clearInterval(pctTimer);
          pctTimer = null;
        }
        markGlitchEpoch();
        setPhase("glitch");

        /* stutter the frozen counter: 89 / 90 / 91 */
        pctTimer = setInterval(() => {
          const el = pctRef.current;
          if (!el) return;
          const roll = Math.random();
          el.textContent = `${roll < 0.18 ? STALL_PCT - 1 : roll > 0.86 ? STALL_PCT + 1 : STALL_PCT}%`;
        }, 110);

        await Promise.race([
          Promise.all([
            new Promise<void>((r) => setTimeout(r, GLITCH_MIN_MS)),
            whenIntroSceneReady(),
          ]),
          new Promise<void>((r) => setTimeout(r, INTRO_BACKGROUND_FAILSAFE_MS)),
        ]);
        if (cancelled) return;
      } finally {
        if (pctTimer) {
          clearInterval(pctTimer);
        }
        finish();
      }
    };

    run();

    return () => {
      cancelled = true;
      if (pctTimer) {
        clearInterval(pctTimer);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSec = LOAD_MS / 1000;
  const glitching = phase === "glitch";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={scope}
          key="aperix-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            overflow: "hidden",
            background: "#F3F4F6",
          }}
        >
          {/* Jitter wrapper — everything inside shakes as one "screen" */}
          <div
            className={glitching ? "ix-glitch-frame" : undefined}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Near-black sweep — eases to 90% then freezes (with stutter) */}
            <div
              id="ix-sweep"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                background: "#171717",
                transformOrigin: "left center",
                animation: glitching
                  ? "ixSweepStutter 0.4s steps(3) infinite"
                  : `ixSlideStall ${loadSec}s cubic-bezier(0.55,0,0.45,1) forwards`,
              }}
            />

            {/* Scanlines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 1,
                background:
                  "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",
              }}
            />

            {/* Slice-tear overlay — only while glitching */}
            {glitching && <div className="ix-glitch-slices" aria-hidden="true" />}

            {/* Centred content */}
            <div
              className={
                glitching
                  ? "ix-glitch-rgb [--ix-scale:0.72] sm:[--ix-scale:1]"
                  : "[--ix-scale:0.72] sm:[--ix-scale:1]"
              }
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                transform: "scale(var(--ix-scale,1))",
                transformOrigin: "center center",
              }}
            >
              <svg
                width={LOGO_SIZE}
                height={LOGO_H}
                viewBox="0 0 768 836"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginBottom: "0.5rem",
                  filter: "drop-shadow(0 0 18px rgba(14,165,233,0.5))",
                }}
              >
                <defs>
                  <linearGradient id="ix-grad" x1="384" y1="106" x2="384" y2="730" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#DFF2FF" />
                    <stop offset="1" stopColor="#BFE5FF" />
                  </linearGradient>
                </defs>
                <path
                  id="ix-outer"
                  d="M384 76L660 236V556L384 716L108 556V236L384 76Z"
                  stroke="#0EA5E9"
                  strokeWidth="28"
                  strokeLinejoin="round"
                  opacity={0}
                />
                <path
                  id="ix-inner-fill"
                  d="M384 141L604 269V523L384 651L164 523V269L384 141Z"
                  fill="url(#ix-grad)"
                  opacity={0}
                />
                <path
                  id="ix-inner-stroke"
                  d="M384 273L516 349V503L384 579L252 503V349L384 273Z"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="28"
                  strokeLinejoin="round"
                  opacity={0}
                />
                <path id="ix-line-v" d="M384 303V548" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
                <path id="ix-line-d1" d="M278 364L490 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
                <path id="ix-line-d2" d="M490 364L278 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
                <path id="ix-line-h" d="M291 418H477" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" opacity={0} />
              </svg>

              <div
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(2.6rem, 6vw, 3.8rem)",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  color: "#FFFFFF",
                  lineHeight: 1,
                  textShadow:
                    "0 0 32px rgba(14,165,233,0.55), 2px 0 0 rgba(255,255,255,0.35), -2px 0 0 rgba(14,165,233,0.4)",
                }}
              >
                APERIX
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "clamp(200px,35vw,320px)",
                  height: 14,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  borderRadius: 2,
                  overflow: "hidden",
                  background: "rgba(0,40,100,0.25)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    background:
                      "repeating-linear-gradient(90deg,rgba(255,255,255,0.92) 0px,rgba(255,255,255,0.92) 10px,transparent 10px,transparent 14px)",
                    transformOrigin: "left center",
                    transform: "scaleX(0)",
                    animation: `ixBarGrow ${loadSec * 0.92}s cubic-bezier(0.4,0,0.6,1) 0.2s forwards`,
                  }}
                />
              </div>

              {/* Status line — counts up, stalls at 90%, stutters */}
              <div
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  fontSize: "clamp(0.6rem,1.3vw,0.75rem)",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.85)",
                  minHeight: "1.2em",
                }}
              >
                LOADING SYSTEM... <span ref={pctRef}>0%</span>
              </div>
            </div>

            {/* Copyright */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(1rem,3vw,1.75rem)",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 2,
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "clamp(0.55rem,1.1vw,0.68rem)",
                letterSpacing: "0.12em",
                color: "rgba(180,215,255,0.4)",
              }}
            >
              Copyright (c) Aperix Studio, 2026. All Rights Reserved.
            </div>
          </div>

          <style>{`
            @keyframes ixSlideStall {
              0%   { transform: scaleX(0); }
              15%  { transform: scaleX(0.05); }
              60%  { transform: scaleX(0.62); }
              92%  { transform: scaleX(${INTRO_STALL_FRACTION - 0.005}); }
              100% { transform: scaleX(${INTRO_STALL_FRACTION}); }
            }
            @keyframes ixSweepStutter {
              0%   { transform: scaleX(${INTRO_STALL_FRACTION}); }
              33%  { transform: scaleX(${INTRO_STALL_FRACTION - 0.006}); }
              66%  { transform: scaleX(${INTRO_STALL_FRACTION + 0.008}); }
              100% { transform: scaleX(${INTRO_STALL_FRACTION}); }
            }
            @keyframes ixBarGrow {
              0%   { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
            @keyframes ixJitter {
              0%, 86%, 100% { transform: translate(0, 0); }
              88% { transform: translate(-7px, 2px); }
              90% { transform: translate(5px, -1px); }
              92% { transform: translate(-3px, 1px); }
              94% { transform: translate(8px, 2px); }
              96% { transform: translate(-5px, -2px); }
              98% { transform: translate(2px, 1px); }
            }
            @keyframes ixRgb {
              0%, 78%, 100% { filter: none; }
              80% { filter: drop-shadow(3px 0 0 rgba(255,0,80,0.55)) drop-shadow(-3px 0 0 rgba(0,255,255,0.45)); }
              84% { filter: drop-shadow(-4px 0 0 rgba(255,0,80,0.5)) drop-shadow(4px 0 0 rgba(0,255,255,0.4)); }
              88% { filter: drop-shadow(2px 0 0 rgba(255,0,80,0.6)) drop-shadow(-2px 0 0 rgba(0,255,255,0.5)); }
              92% { filter: none; }
            }
            @keyframes ixSlices {
              0%, 100% { opacity: 0; background-position: 0 0; }
              10% { opacity: 0; }
              12% { opacity: 0.9; background-position: 14px 0; }
              14% { opacity: 0; }
              42% { opacity: 0; }
              44% { opacity: 0.85; background-position: -18px 6px; }
              47% { opacity: 0; }
              72% { opacity: 0; }
              74% { opacity: 0.9; background-position: 10px -4px; }
              77% { opacity: 0; }
            }
            .ix-glitch-frame {
              animation: ixJitter 0.62s steps(1) infinite;
            }
            .ix-glitch-rgb {
              animation: ixRgb 0.74s steps(1) infinite;
            }
            .ix-glitch-slices {
              position: absolute;
              inset: 0;
              z-index: 3;
              pointer-events: none;
              mix-blend-mode: screen;
              background-image: repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 38px,
                rgba(255, 255, 255, 0.45) 38px,
                rgba(255, 255, 255, 0.45) 42px,
                transparent 42px,
                transparent 96px,
                rgba(0, 0, 0, 0.55) 96px,
                rgba(0, 0, 0, 0.55) 101px
              );
              animation: ixSlices 0.9s steps(1) infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .ix-glitch-frame, .ix-glitch-rgb, .ix-glitch-slices { animation: none !important; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
