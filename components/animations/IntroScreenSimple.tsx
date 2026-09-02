"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/agency/AnimatedLogo";
import { introHasPlayed, markIntroDone, releaseIntroGate } from "@/lib/introState";

/*
  Phase timeline
  ─────────────────────────────────────────────────────────────────
  holding       0 → HOLD_MS
    Full dark overlay + logo centred above "APERIX".

  overlayFading HOLD_MS → HOLD_MS + OVERLAY_MS
    • Dark overlay fades to transparent.
    • Logo flies from centre up to SiteLogoFixed position, stays opaque.
    • STUDIO slides in alongside APERIX — starts at the same instant (t0)
      as the logo's fly-up, so the wordmark completes as the mark moves.

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

// Long enough to watch the 3D mark finish assembling (last limb lands at
// ~2.2s into its own build) with a beat to admire it fully formed, before
// it starts flying up to the nav position.
const HOLD_MS         = 2800;
const OVERLAY_MS      = 650;
// Fires at t0, in lockstep with the logo starting its fly-up to the nav
// position — STUDIO wipes open at the exact moment the logo starts moving.
const STUDIO_DELAY_MS = 0;
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
const LOGO_INTRO_SIZE = 1056;
const LOGO_NAV_SIZE   = 352; // matches SiteLogoFixed's LOGO_SIZE — the fly-to target
const MOBILE_BREAKPOINT_PX = 767;
/** Max share of viewport width the intro mark may occupy on phones. */
const MOBILE_INTRO_VW = 0.88;
// arrowhead-mark.svg viewBox is 921.75 × 668.50 — height derives from this.
const LOGO_ASPECT = 668.5 / 921.75;
const LOGO_INTRO_H    = Math.round(LOGO_INTRO_SIZE * LOGO_ASPECT);
const LOGO_NAV_H      = Math.round(LOGO_NAV_SIZE   * LOGO_ASPECT);
const NAV_SCALE       = LOGO_NAV_SIZE / LOGO_INTRO_SIZE;
// How far above true centre the intro logo sits (and where its position is
// measured from for the fly-to-nav calc below) — raised a little more to
// give the much larger mark room above the "APERIX STUDIO" wordmark.
const LOGO_RAISE_REM  = 5.5;

function readIntroLogoSize() {
  if (typeof window === "undefined") {
    return LOGO_INTRO_SIZE;
  }

  if (window.innerWidth > MOBILE_BREAKPOINT_PX) {
    return LOGO_INTRO_SIZE;
  }

  return Math.min(LOGO_INTRO_SIZE, Math.floor(window.innerWidth * MOBILE_INTRO_VW));
}

function readFlyEndScale(introSize: number) {
  if (typeof window === "undefined") {
    return NAV_SCALE;
  }

  if (window.innerWidth > MOBILE_BREAKPOINT_PX) {
    return NAV_SCALE;
  }

  const navEl = document.getElementById("site-logo-fixed");
  if (navEl) {
    return navEl.getBoundingClientRect().width / introSize;
  }

  return LOGO_NAV_SIZE / introSize;
}

type Phase = "holding" | "overlayFading" | "settling" | "textFading";

export default function IntroScreenSimple() {
  const [phase, setPhase]          = useState<Phase>("holding");
  const [studioVisible, setStudio] = useState(false);
  const [flyToY, setFlyToY]        = useState<number>(-400);
  const [introLogoSize, setIntroLogoSize] = useState(readIntroLogoSize);
  const [flyEndScale, setFlyEndScale] = useState(() => readFlyEndScale(readIntroLogoSize()));

  // ── Measure the nav logo position once on mount ────────────────
  useEffect(() => {
    const introSize = readIntroLogoSize();
    const endScale = readFlyEndScale(introSize);

    setIntroLogoSize(introSize);
    setFlyEndScale(endScale);

    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const introCentreFromTop = window.innerHeight / 2 - LOGO_RAISE_REM * remPx;
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
              transform: `translateY(-${LOGO_RAISE_REM}rem)`,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={
                isFlying
                  ? { opacity: 1, y: flyToY, scale: flyEndScale }
                  : { opacity: 1, y: 0,      scale: 1 }
              }
              transition={
                isFlying
                  ? { duration: OVERLAY_MS / 1000, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
              }
            >
              {/* The same rotating mark as SiteLogoFixed and the footer, so
                  the logo that flies up to the nav is the logo that lands
                  there — not a still lookalike that swaps at the last frame. */}
              <AnimatedLogo
                size={introLogoSize}
                priority
                style={{ filter: "drop-shadow(0 0 20px rgba(14,165,233,0.55))" }}
              />
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
