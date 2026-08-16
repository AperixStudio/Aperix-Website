"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { onIntroDone } from "@/lib/introState";
import { INTRO_SETTLE_MS, INTRO_TEXT_FADE_MS } from "@/components/animations/IntroScreenSimple";

/*
  Position contract with IntroScreenSimple
  ─────────────────────────────────────────
  The intro floating text uses:
    position:fixed; inset:0; display:flex; align-items:center;
    justify-content:center; transform:translateY(2.8rem)

  The outer wrapper div here uses the IDENTICAL CSS string so the
  browser resolves both to exactly the same pixel offset — no
  framer-motion rem-parsing involved.

  Framer-motion only touches the title wrapper, which starts at
  y:0 (no extra offset) and animates to y:-moveUpPx when canMove,
  producing a final visual position of 2.8rem − 6.8rem = −4rem
  from viewport centre.
*/

const HERO_MOVE_DELAY_MS = INTRO_SETTLE_MS + INTRO_TEXT_FADE_MS; // 700 + 400 ms
// Intro crossfade start (must match IntroScreenSimple inner translateY)
const HERO_TITLE_INTRO_OFFSET_REM = 2.8;
// Final resting position above viewport centre (negative = higher on screen)
const HERO_TITLE_FINAL_OFFSET_REM =-18.4;
const HERO_TITLE_MOVE_REM =
  HERO_TITLE_INTRO_OFFSET_REM - HERO_TITLE_FINAL_OFFSET_REM; // 6.8rem travel
// Match the intro STUDIO slide — same ease curve and similar pacing
const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_MOVE_DURATION_S = 0.95;
const HERO_COPY_DURATION_S = 0.55;

/** Breathing room kept between the fixed site logo and the top of the wordmark. */
const LOGO_CLEARANCE_REM = 1.1;
/** Cap-height of the wordmark as a fraction of its font-size (Hubot Sans, uppercase). */
const WORDMARK_CAP_RATIO = 0.72;
/** Fallback logo box when SiteLogoFixed has not painted yet: top 1.5rem + 48px tall. */
const LOGO_FALLBACK_BOTTOM_PX = 24 + 48;

function getRemPx() {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

/**
 * How far the wordmark may travel upward.
 *
 * The design target is a flat HERO_TITLE_MOVE_REM, which is what tall
 * viewports get. On a short screen that constant would carry the wordmark
 * off the top of the viewport and through the fixed logo, so the travel is
 * additionally capped at "just below the logo". Recomputed on resize and
 * orientation change, so it is correct at any screen size rather than only
 * at the sizes we happened to test.
 */
function computeMoveUpPx(titleEl: HTMLElement | null): number {
  if (typeof window === "undefined") return HERO_TITLE_MOVE_REM * 16;

  const rem = getRemPx();
  const desired = HERO_TITLE_MOVE_REM * rem;

  // Untransformed visual centre: section is centred in the viewport and the
  // wrapper adds HERO_TITLE_INTRO_OFFSET_REM. Line-height is symmetric, so
  // the box centre is the glyph centre.
  const naturalCentre =
    window.innerHeight / 2 + HERO_TITLE_INTRO_OFFSET_REM * rem;

  const logoRect = document.getElementById("site-logo-fixed")?.getBoundingClientRect();
  const logoBottom = logoRect?.height ? logoRect.bottom : LOGO_FALLBACK_BOTTOM_PX;

  // The wordmark size lives on the spans — the <h1> itself inherits 16px.
  const glyphEl = titleEl?.querySelector("span") ?? titleEl;
  const fontSize = glyphEl
    ? parseFloat(getComputedStyle(glyphEl).fontSize) || rem * 2.4
    : rem * 2.4;
  const capHalf = (fontSize * WORDMARK_CAP_RATIO) / 2;

  // Highest the glyph centre may sit without touching the logo.
  const minCentre = logoBottom + LOGO_CLEARANCE_REM * rem + capHalf;
  const maxTravel = naturalCentre - minCentre;

  return Math.max(0, Math.min(desired, maxTravel));
}

export default function HomeHero() {
  const [canMove, setCanMove] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [moveUpPx, setMoveUpPx] = useState(() => HERO_TITLE_MOVE_REM * getRemPx());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const unsub = onIntroDone(() => {
      timerRef.current = setTimeout(() => {
        // Re-measure immediately before the move: at mount the logo SVG and
        // the webfont may not have settled, and a stale reading here is what
        // decides whether the wordmark clears the logo.
        setMoveUpPx(computeMoveUpPx(titleRef.current));
        setCanMove(true);
      }, HERO_MOVE_DELAY_MS);
    });
    return () => { unsub(); clearTimeout(timerRef.current); };
  }, []);

  // Keep the resting position correct for the live viewport, not just for the
  // size the page happened to load at (rotation, browser-chrome collapse,
  // desktop window resize, text-size preference changes).
  useEffect(() => {
    const measure = () => setMoveUpPx(computeMoveUpPx(titleRef.current));

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    const observer =
      typeof ResizeObserver !== "undefined" && titleRef.current
        ? new ResizeObserver(measure)
        : null;
    if (titleRef.current) observer?.observe(titleRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      observer?.disconnect();
    };
  }, []);

  return (
    <section
      id="home-hero"
      style={{
        position: "relative",
        minHeight: "100dvh",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      {/*
        Outer div: pure CSS translateY(2.8rem) — identical to the intro
        overlay's wrapper. Browser resolves both the same way, so the
        text sits at exactly the same pixel row when the crossfade happens.
      */}
      <div style={{ transform: "translateY(2.8rem)", width: "100%" }}>
        {/*
          Title wrapper only — description is absolutely positioned so it
          never reflows the flex layout while the title is moving up.
        */}
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: "54rem",
            margin: "0 auto",
            padding: "0 var(--wordmark-gutter, 1.5rem)",
            position: "relative",
          }}
          animate={{ y: canMove ? -moveUpPx : 0 }}
          transition={{ duration: HERO_MOVE_DURATION_S, ease: HERO_EASE }}
          onAnimationComplete={() => {
            if (canMove) setShowCopy(true);
          }}
        >
          <h1
            ref={titleRef}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 0,
              margin: 0,
              lineHeight: 4,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
                fontWeight: 800,
                letterSpacing: "var(--wordmark-track-aperix, 0.22em)",
                color: "#ffffff",
                textShadow: "0 0 32px rgba(14,165,233,0.55)",
                whiteSpace: "nowrap",
              }}
            >
              APERIX
            </span>
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
                fontWeight: 300,
                letterSpacing: "var(--wordmark-track-studio, 0.34em)",
                color: "rgba(255,255,255,0.75)",
                textShadow: "0 0 24px rgba(14,165,233,0.3)",
                whiteSpace: "nowrap",
                paddingLeft: "var(--wordmark-gap, 0.5em)",
              }}
            >
              STUDIO
            </span>
          </h1>

          {showCopy && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "2rem",
                width: "min(40rem, calc(100vw - 3rem))",
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: HERO_COPY_DURATION_S, ease: HERO_EASE }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
              <p
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                }}
              >
                A two-man team inspired by top creators and advancing technology,
                providing Melbourne with the finest care in web development and
                software solutions.
              </p>

              <p
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                }}
              >
                Driven by the desire to provide AI-supported, customised
                projects, we give you the structure and strategy to build{" "}
                <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  your
                </span>{" "}
                iconic brand and business.
              </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
