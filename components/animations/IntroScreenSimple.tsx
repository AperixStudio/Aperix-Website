"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { introHasPlayed, markIntroDone, releaseIntroGate } from "@/lib/introState";

/*
  Phase timeline
  ─────────────────────────────────────────────────────────────────
  holding       0 → HOLD_MS
    Full dark overlay + logo centred above "APERIX".

  overlayFading HOLD_MS → HOLD_MS + OVERLAY_MS
    • Dark overlay fades to transparent.
    • Logo flies from centre up to SiteLogoFixed position, stays opaque.
    • STUDIO slides in alongside APERIX.

  settling      HOLD_MS + OVERLAY_MS → … + SETTLE_MS
    "APERIX STUDIO" floats on the live background (fixed center + inner
    translateY(2.8rem) — same stack as HomeHero).
    releaseIntroGate() + markIntroDone() BOTH fire at the START of this
    phase → PageReveal fades the page in over 500 ms while the intro
    text is still fully visible on top of it.
    By the end of SETTLE_MS the home page "APERIX STUDIO" is fully
    rendered underneath the intro text.

  textFading    settling end → + TEXT_FADE_MS
    The intro floating text fades out. Because the matching home page
    text is already fully visible behind it, there is no jump or gap —
    the text simply appears to stay there as one continuous element.
    HomeHero's upward movement is deliberately delayed until this phase
    is complete so both copies are always at the same position.
*/

export const INTRO_SETTLE_MS   = 700;   // exported so HomeHero can sync its delay
export const INTRO_TEXT_FADE_MS = 400;  // exported so HomeHero can sync its delay

const HOLD_MS         = 1100;
const OVERLAY_MS      = 650;
const STUDIO_DELAY_MS = 180;
// How long STUDIO takes to wipe open. The settling phase waits for this to
// finish (see t2 below) — once the page fades in, HomeHero's identically
// positioned wordmark is on screen too, and a still-forming STUDIO would
// break the alignment that makes that crossfade invisible.
const STUDIO_REVEAL_MS = 1000;
// Beat between the wordmark finishing and the page starting to fade in.
const STUDIO_HOLD_MS   = 120;
// Even acceleration in and out. The old ease-out-quint put most of the wipe
// in the first fifth of its duration, which read as a snap however long the
// duration was.
const STUDIO_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

// Sizes
const LOGO_INTRO_SIZE = 88;
const LOGO_NAV_SIZE   = 44;
const LOGO_INTRO_H    = Math.round(LOGO_INTRO_SIZE * (836 / 768));
const LOGO_NAV_H      = Math.round(LOGO_NAV_SIZE   * (836 / 768));
const NAV_SCALE       = LOGO_NAV_SIZE / LOGO_INTRO_SIZE;

type Phase = "holding" | "overlayFading" | "settling" | "textFading";

export default function IntroScreenSimple() {
  const [phase, setPhase]          = useState<Phase>("holding");
  const [studioVisible, setStudio] = useState(false);
  const [flyToY, setFlyToY]        = useState<number>(-400);

  // ── Measure the nav logo position once on mount ────────────────
  useEffect(() => {
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const introCentreFromTop = window.innerHeight / 2 - 3.8 * remPx;
    const navEl = document.getElementById("site-logo-fixed");
    const navCentreFromTop = navEl
      ? navEl.getBoundingClientRect().top + navEl.getBoundingClientRect().height / 2
      : 1.5 * remPx + LOGO_NAV_H / 2;
    setFlyToY(navCentreFromTop - introCentreFromTop);
  }, []);

  // ── Phase sequencer ────────────────────────────────────────────
  useEffect(() => {
    if (introHasPlayed) { releaseIntroGate(); return; }
    if (window.location.pathname.startsWith("/dev")) {
      markIntroDone(); releaseIntroGate(); return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const t0 = HOLD_MS;
    const t1 = t0 + STUDIO_DELAY_MS;
    // Settling waits for whichever finishes last: the overlay/logo flight, or
    // the STUDIO reveal plus its hold.
    const t2 =
      t0 + Math.max(OVERLAY_MS, STUDIO_DELAY_MS + STUDIO_REVEAL_MS + STUDIO_HOLD_MS);
    const t3 = t2 + INTRO_SETTLE_MS;         // textFading begins

    at(t0, () => setPhase("overlayFading"));
    at(t1, () => setStudio(true));
    at(t2, () => {
      setPhase("settling");
      releaseIntroGate();   // remove the cover div
      markIntroDone();      // PageReveal starts fading the page in (500 ms)
                            // — home page "APERIX STUDIO" will be fully visible
                            //   before textFading begins
    });
    at(t3, () => setPhase("textFading"));

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const overlayOn = phase === "holding" || phase === "overlayFading";
  const logoOn    = phase === "holding" || phase === "overlayFading";
  const textOn    = phase !== "textFading";
  const isFlying  = phase === "overlayFading";

  return (
    <>
      {/* ── Dark overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {overlayOn && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFlying ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_MS / 1000, ease: "easeOut" }}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 9997,
              background: "#0c1017", pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Logo — flies to nav position during overlay fade ──── */}
      <AnimatePresence>
        {logoOn && (
          <motion.div
            key="intro-logo"
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: "translateY(-3.8rem)",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={
                isFlying
                  ? { opacity: 1, y: flyToY, scale: NAV_SCALE }
                  : { opacity: 1, y: 0,      scale: 1 }
              }
              transition={
                isFlying
                  ? { duration: OVERLAY_MS / 1000, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
              }
            >
              <svg
                width={LOGO_INTRO_SIZE} height={LOGO_INTRO_H}
                viewBox="0 0 768 836" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 20px rgba(14,165,233,0.55))", display: "block" }}
              >
                <defs>
                  <linearGradient id="ixs-grad" x1="384" y1="106" x2="384" y2="730" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#DFF2FF" />
                    <stop offset="1" stopColor="#BFE5FF" />
                  </linearGradient>
                </defs>
                <path d="M384 76L660 236V556L384 716L108 556V236L384 76Z" stroke="#0EA5E9" strokeWidth="28" strokeLinejoin="round" />
                <path d="M384 141L604 269V523L384 651L164 523V269L384 141Z" fill="url(#ixs-grad)" />
                <path d="M384 273L516 349V503L384 579L252 503V349L384 273Z" stroke="rgba(255,255,255,0.85)" strokeWidth="28" strokeLinejoin="round" />
                <path d="M384 303V548" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
                <path d="M278 364L490 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
                <path d="M490 364L278 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
                <path d="M291 418H477" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── "APERIX STUDIO" text — fades out once page is loaded ─ */}
      <AnimatePresence>
        {textOn && (
          <motion.div
            key="intro-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: [0.33, 0, 0.2, 1], delay: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: INTRO_TEXT_FADE_MS / 1000, ease: "easeOut" } }}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {/*
              Outer motion.div: fixed viewport centering + opacity only (no FM y).
              Inner div: pure CSS translateY(2.8rem) — mirrors HomeHero exactly so
              Framer Motion never overwrites the vertical offset.
            */}
            <div style={{ transform: "translateY(2.8rem)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
                    fontWeight: 800, letterSpacing: "var(--wordmark-track-aperix, 0.22em)",
                    color: "#ffffff", lineHeight: 1,
                    textShadow: "0 0 32px rgba(14,165,233,0.55)",
                    whiteSpace: "nowrap",
                  }}
                >
                  APERIX
                </span>

                <AnimatePresence>
                  {studioVisible && (
                    <motion.span
                      initial={{ opacity: 0, x: 18, maxWidth: 0 }}
                      animate={{ opacity: 1, x: 0, maxWidth: 400 }}
                      transition={{
                        duration: STUDIO_REVEAL_MS / 1000,
                        ease: STUDIO_EASE,
                      }}
                      style={{
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
                        fontWeight: 300, letterSpacing: "var(--wordmark-track-studio, 0.34em)",
                        color: "rgba(255,255,255,0.75)", lineHeight: 1,
                        textShadow: "0 0 24px rgba(14,165,233,0.3)",
                        whiteSpace: "nowrap",
                        paddingLeft: "var(--wordmark-gap, 0.5em)", overflow: "hidden",
                      }}
                    >
                      STUDIO
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
