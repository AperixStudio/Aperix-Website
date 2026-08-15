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

  Framer-motion only touches the INNER motion.div, which starts at
  y:0 (no extra offset) and animates to y:"-4.8rem" when canMove,
  producing a final visual position of 2.8rem + (-4.8rem) = -2rem
  from viewport centre.
*/

const HERO_MOVE_DELAY_MS = INTRO_SETTLE_MS + INTRO_TEXT_FADE_MS; // 700 + 400 ms

/*
  moveUpPx: how far (in px) the motion.div travels upward when canMove fires.
  The outer div already applies CSS translateY(2.8rem), so this value equals
  (2.8rem + 2rem) in px — moving from the intro-matching position to -2rem
  above viewport centre.
  We compute it in px because framer-motion's `y` prop does not reliably
  handle rem units.
*/
function getRemPx() {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

export default function HomeHero() {
  const [canMove, setCanMove] = useState(false);
  const [moveUpPx, setMoveUpPx] = useState(0); // computed in px: (2.8 + 2) * remPx
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Compute px value once on mount (before introDone ever fires)
  useEffect(() => { setMoveUpPx(4.8 * getRemPx()); }, []);

  useEffect(() => {
    const unsub = onIntroDone(() => {
      timerRef.current = setTimeout(() => setCanMove(true), HERO_MOVE_DELAY_MS);
    });
    return () => { unsub(); clearTimeout(timerRef.current); };
  }, []);

  return (
    <section
      id="home-hero"
      style={{
        position: "relative",
        height: "100vh",
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
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            width: "100%",
            maxWidth: "54rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
          /*
            Starts at y:0 — the outer div already applies the 2.8rem offset.
            When canMove, animates up by 4.8rem so the net visual position
            becomes 2.8rem - 4.8rem = -2rem from viewport centre.
          */
          animate={{ y: canMove ? -moveUpPx : 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* APERIX STUDIO — must match intro text pixel-for-pixel */}
          <h1
            style={{
              display: "flex",
              alignItems: "baseline",   // matches intro's alignItems: baseline
              gap: 0,
              margin: 0,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(2.4rem, 5.5vw, 3.6rem)",
                fontWeight: 800,
                letterSpacing: "0.22em",
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
                fontSize: "clamp(2.4rem, 5.5vw, 3.6rem)",
                fontWeight: 300,
                letterSpacing: "0.34em",
                color: "rgba(255,255,255,0.75)",
                textShadow: "0 0 24px rgba(14,165,233,0.3)",
                whiteSpace: "nowrap",
                paddingLeft: "0.5em",
              }}
            >
              STUDIO
            </span>
          </h1>

          {/* Description — only mounted after title has moved up,
              so it has zero layout impact during the intro crossfade */}
          {canMove && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "40rem",
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
                  color: "rgba(255,255,255,0.42)",
                  margin: 0,
                }}
              >
                Driven by the desire to provide AI-supported, customised
                projects — we give you the structure and strategy to build{" "}
                <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  your
                </span>{" "}
                iconic brand and business.
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>
    </section>
  );
}
