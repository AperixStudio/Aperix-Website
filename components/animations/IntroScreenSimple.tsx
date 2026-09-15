"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import AnimatedLogo from "@/components/agency/AnimatedLogo";
import { introHasPlayed, markIntroDone, releaseIntroGate } from "@/lib/introState";

/*
  Phase timeline
  ─────────────────────────────────────────────────────────────────
  holding       0 → HOLD_MS
    Full dark overlay + logo centred above "APERIX" (STUDIO takes no
    layout width yet, so the name sits under the mark).

  morphing      HOLD_MS → HOLD_MS + STUDIO_REVEAL_MS + STUDIO_HOLD_MS
    STUDIO wipes open and the centred lockup grows with it, so APERIX
    eases left in the same motion. The logo stays put.

  flying        morph end → + OVERLAY_MS
    Logo flies from centre to the hero-scale slot and grows. Overlay
    stays opaque (the HTML cover is still up) so SiteLogoFixed cannot
    ghost in at the destination.

  settling      fly end → + SETTLE_MS
    releaseIntroGate() + markIntroDone() fire at the START of this
    phase → cover fades, PageReveal fades the page in. The intro logo
    holds its landing pose until the cover is gone, then unmounts so
    SiteLogoFixed (now visible, same rect) is the only mark.

  textFading    settling end → + TEXT_FADE_MS
    Intro floating text fades out. HomeHero's matching copy is already
    visible behind it. HomeHero then eases the wordmark up to rest.
*/

export const INTRO_SETTLE_MS   = 700;   // exported so HomeHero can sync its delay
export const INTRO_TEXT_FADE_MS = 400;  // exported so HomeHero can sync its delay

// Long enough to watch the 3D mark finish assembling (last limb lands at
// ~2.2s into its own build) with a beat to admire it fully formed.
const HOLD_MS         = 2800;
const OVERLAY_MS      = 650;
// How long STUDIO takes to wipe open. Runs BEFORE the logo flies, so the
// lockup is complete while the mark is still centred above it.
const STUDIO_REVEAL_MS = 800;
// Beat between the wordmark finishing and the logo starting its flight.
const STUDIO_HOLD_MS   = 120;
const STUDIO_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
// Animation bound only — must exceed STUDIO's natural glyph width at the
// 10rem wordmark cap, or the intro lockup would be narrower than HomeHero's
// copy and jump sideways at the crossfade.
const STUDIO_REVEAL_MAX_WIDTH = 1200;
const FLY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Cover fade in releaseIntroGate — intro logo stays up this long so the
// page logo can take its place without a gap on the dark field.
const LOGO_HANDOFF_MS = 280;

// Sizes
const LOGO_INTRO_SIZE = 1056;
const LOGO_INTRO_MOBILE = 400;
const INTRO_COMPACT_QUERY = "(max-width: 820px)";
// Fallback only. The hero logo's real on-screen width is the width of
// #home-hero-logo-slot, which is viewport-proportional (HomeHero.css), so the
// scale is measured from that slot at mount and this is used only when the
// slot isn't laid out — i.e. mobile, where the logo docks to the nav instead.
const LOGO_HERO_SIZE  = 1150;
const HERO_SCALE      = LOGO_HERO_SIZE / LOGO_INTRO_SIZE;
const LOGO_RAISE_REM  = 5.5;

// How far BELOW true viewport centre the intro wordmark sits — it holds this
// one line for the whole intro, directly under the logo. HomeHero's
// .home-hero-backdrop__mover-layer must use the identical value so the
// crossfade from the intro copy to the hero's own copy is invisible.
const INTRO_LINE_OFFSET_REM = 2.8;
// Matches SiteLogoFixed's rest filter so the last frames of the flight
// and the page logo are the same mark, not a heavier-glow lookalike.
const LOGO_FILTER = "drop-shadow(0 0 8px rgba(14,165,233,0.4))";

type Phase = "holding" | "morphing" | "flying" | "settling" | "textFading";

function hidePageLogo() {
  const el = document.getElementById("site-logo-fixed");
  if (el) el.style.opacity = "0";
}

function showPageLogo() {
  const el = document.getElementById("site-logo-fixed");
  if (el) el.style.opacity = "1";
}

export default function IntroScreenSimple() {
  const [phase, setPhase]          = useState<Phase>("holding");
  const [studioVisible, setStudio] = useState(false);
  const [logoOn, setLogoOn]        = useState(true);
  const [flyTo, setFlyTo]          = useState<{ x: number; y: number }>({ x: 0, y: -400 });
  const [heroScale, setHeroScale]  = useState(HERO_SCALE);
  const [introLogoSize, setIntroLogoSize] = useState(LOGO_INTRO_SIZE);
  const [introMarkReady, setIntroMarkReady] = useState(false);

  // Hide the page logo before first paint so it cannot ghost through the
  // overlay while the intro copy is still assembling or flying.
  useLayoutEffect(() => {
    if (introHasPlayed || window.location.pathname.startsWith("/dev")) {
      showPageLogo();
      return;
    }
    hidePageLogo();
  }, []);

  useLayoutEffect(() => {
    const compact = window.matchMedia(INTRO_COMPACT_QUERY).matches;
    setIntroLogoSize(compact ? LOGO_INTRO_MOBILE : LOGO_INTRO_SIZE);
    setIntroMarkReady(true);
  }, []);

  // ── Measure the hero logo slot (fallback: the docked page logo) ────
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const introCentreX = window.innerWidth / 2;
      const introCentreY = window.innerHeight / 2 - LOGO_RAISE_REM * remPx;

      const slot = document.getElementById("home-hero-logo-slot");
      const slotRect = slot?.getBoundingClientRect();
      const slotW = slotRect?.width ?? 0;

      if (slotW > 1 && slotRect) {
        setFlyTo({
          x: slotRect.left + slotRect.width / 2 - introCentreX,
          y: slotRect.top + slotRect.height / 2 - introCentreY,
        });
        setHeroScale(slotW / introLogoSize);
        return;
      }

      // Mobile / non-home: slot is display:none. Fly to the docked mark.
      const navEl = document.getElementById("site-logo-fixed");
      const rect = navEl?.getBoundingClientRect();
      if (rect && rect.width > 1) {
        setFlyTo({
          x: rect.left + rect.width / 2 - introCentreX,
          y: rect.top + rect.height / 2 - introCentreY,
        });
        setHeroScale(rect.width / introLogoSize);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [introLogoSize]);

  // ── Phase sequencer: morph, then fly, then settle ──────────────
  useEffect(() => {
    if (introHasPlayed) { releaseIntroGate(); showPageLogo(); return; }
    if (window.location.pathname.startsWith("/dev")) {
      markIntroDone(); releaseIntroGate(); showPageLogo(); return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const tMorph  = HOLD_MS;
    const tFly    = tMorph + STUDIO_REVEAL_MS + STUDIO_HOLD_MS;
    const tSettle = tFly + OVERLAY_MS;
    const tHandoff = tSettle + LOGO_HANDOFF_MS;
    const tText   = tSettle + INTRO_SETTLE_MS;

    at(tMorph, () => {
      setPhase("morphing");
      setStudio(true);
    });
    at(tFly, () => setPhase("flying"));
    at(tSettle, () => {
      setPhase("settling");
      showPageLogo();
      releaseIntroGate();
      markIntroDone();
    });
    at(tHandoff, () => setLogoOn(false));
    at(tText, () => setPhase("textFading"));

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const overlayOn = phase === "holding" || phase === "morphing" || phase === "flying";
  const textOn    = phase !== "textFading";
  const isFlying  = phase === "flying" || phase === "settling";

  return (
    <>
      {/* ── Dark overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {overlayOn && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: LOGO_HANDOFF_MS / 1000, ease: "easeOut" }}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 9997,
              background: "#0c1017", pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Logo — holds through morph, then flies to the hero slot ─ */}
      <AnimatePresence>
        {logoOn && introMarkReady && (
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
                  ? { opacity: 1, x: flyTo.x, y: flyTo.y, scale: heroScale }
                  : { opacity: 1, x: 0,       y: 0,        scale: 1 }
              }
              transition={
                isFlying
                  ? { duration: OVERLAY_MS / 1000, ease: FLY_EASE }
                  : { duration: 0.55, ease: FLY_EASE, delay: 0.15 }
              }
            >
              <AnimatedLogo
                size={introLogoSize}
                priority
                style={{ filter: LOGO_FILTER }}
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
            {/* Centred flex row. STUDIO's maxWidth is 0 on hold so APERIX sits
                under the logo; opening it grows the row and APERIX eases left
                in the same beat. Vertical travel happens afterwards, in HomeHero. */}
            <div
              style={{
                display: "flex", alignItems: "baseline", gap: 0,
                transform: `translateY(${INTRO_LINE_OFFSET_REM}rem)`,
              }}
            >
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

              <motion.span
                initial={{ opacity: 0, maxWidth: 0 }}
                animate={
                  studioVisible
                    ? { opacity: 1, maxWidth: STUDIO_REVEAL_MAX_WIDTH }
                    : { opacity: 0, maxWidth: 0 }
                }
                transition={{
                  duration: STUDIO_REVEAL_MS / 1000,
                  ease: STUDIO_EASE,
                }}
                style={{
                  overflow: "hidden",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  verticalAlign: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
                    fontWeight: 300, letterSpacing: "var(--wordmark-track-studio, 0.34em)",
                    color: "rgba(255,255,255,0.75)", lineHeight: 1,
                    textShadow: "0 0 24px rgba(14,165,233,0.3)",
                    paddingLeft: "var(--wordmark-gap, 0.5em)",
                    whiteSpace: "nowrap",
                  }}
                >
                  STUDIO
                </span>
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
