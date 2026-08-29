"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { onIntroDone } from "@/lib/introState";
import { INTRO_SETTLE_MS, INTRO_TEXT_FADE_MS } from "@/components/animations/IntroScreenSimple";
import "./HomeHero.css";

/*
  Position contract with IntroScreenSimple
  ─────────────────────────────────────────
  The intro floating text uses:
    position:fixed; inset:0; display:flex; align-items:center;
    justify-content:center; transform:translateY(2.8rem)

  The outer wrapper div here uses the IDENTICAL CSS string so the
  browser resolves both to exactly the same pixel offset — no
  framer-motion rem-parsing involved.

  Framer-motion only touches the title wrapper, which starts at x:0 / y:0
  (no extra offset, i.e. exactly the intro's position) and animates to the
  editorial resting place once the crossfade is over. Nothing about the
  resting layout is allowed to disturb that starting state, which is why the
  wordmark is overlaid on the grid rather than laid out inside it.
*/

const HERO_MOVE_DELAY_MS = INTRO_SETTLE_MS + INTRO_TEXT_FADE_MS; // 700 + 400 ms
// Match the intro STUDIO slide — same ease curve and similar pacing
const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_MOVE_DURATION_S = 0.95;
const HERO_COPY_DURATION_S = 0.55;
/** Beat after the copy has revealed before the blocks start drifting. */
const HERO_FLOAT_DELAY_MS = 900;

type Drift = { x: number[]; y: number[]; duration: number };

/**
 * Once everything has landed the blocks drift, each on its own track.
 *
 * The periods are deliberately coprime-ish and none of them divide into
 * another, so the four never come back into step — the moment they do, the
 * whole hero reads as one sliding sheet instead of four things breathing
 * independently. Every track opens and closes on 0 so the loop is seamless
 * without a repeatType that would run it backwards.
 */
const MARK_DRIFT: Drift = {
  x: [0, 7, -5, 3, 0],
  y: [0, -9, -4, -11, 0],
  duration: 14,
};

const DRIFT: Record<"mark" | "rule" | "lead" | "sub", Drift> = {
  mark: MARK_DRIFT,
  // The rule reads as the wordmark's underline, so it rides the same track.
  // On one of its own it drifts out of register with the glyphs above it,
  // which looks like a misalignment rather than like the pair breathing.
  rule: MARK_DRIFT,
  lead: { x: [0, -6, 5, -3, 0], y: [0, -7, -12, -4, 0], duration: 19 },
  sub: { x: [0, 6, -4, 8, 0], y: [0, -11, -4, -8, 0], duration: 23 },
};

function driftTransition(drift: Drift) {
  return {
    duration: drift.duration,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  };
}

type Travel = { x: number; y: number };

const NO_TRAVEL: Travel = { x: 0, y: 0 };

const WORDMARK_APERIX: CSSProperties = {
  fontFamily: "var(--font-display), sans-serif",
  fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
  fontWeight: 800,
  letterSpacing: "var(--wordmark-track-aperix, 0.22em)",
  color: "#ffffff",
  textShadow: "0 0 32px rgba(14,165,233,0.55)",
  whiteSpace: "nowrap",
};

const WORDMARK_STUDIO: CSSProperties = {
  fontFamily: "var(--font-display), sans-serif",
  fontSize: "var(--wordmark-size, clamp(2.4rem, 5.5vw, 3.6rem))",
  fontWeight: 300,
  letterSpacing: "var(--wordmark-track-studio, 0.34em)",
  color: "rgba(255,255,255,0.75)",
  textShadow: "0 0 24px rgba(14,165,233,0.3)",
  whiteSpace: "nowrap",
  paddingLeft: "var(--wordmark-gap, 0.5em)",
};

const WORDMARK_BOX: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 0,
  margin: 0,
  lineHeight: 4,
};

/**
 * The stand-in's box, trimmed to the glyphs.
 *
 * The flying copy keeps its very tall line box, because that box is half of
 * what makes the intro crossfade land — but reserving 230px of leading in the
 * grid would blow a hole between the wordmark and the rule under it. Both
 * boxes are symmetric about the glyphs, so the flight is measured centre to
 * centre and the two line-heights never have to agree.
 */
const WORDMARK_BOX_TIGHT: CSSProperties = { ...WORDMARK_BOX, lineHeight: 1 };

/** The wordmark's glyphs, shared by the flying copy and the hidden stand-in. */
function WordmarkGlyphs({ interactive }: { interactive?: boolean }) {
  const hit: CSSProperties = interactive ? { pointerEvents: "auto" } : {};
  return (
    <>
      <span style={{ ...WORDMARK_APERIX, ...hit }}>APERIX</span>
      <span style={{ ...WORDMARK_STUDIO, ...hit }}>STUDIO</span>
    </>
  );
}

export default function HomeHero() {
  const [canMove, setCanMove] = useState(false);
  const [moved, setMoved] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [floating, setFloating] = useState(false);
  const [travel, setTravel] = useState<Travel>(NO_TRAVEL);

  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const slotRef = useRef<HTMLParagraphElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const floatTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * How far the wordmark has to fly to land on its slot in the grid.
   *
   * Measured rather than computed: the grid owns the resting position, so a
   * change to its columns or padding moves the target without needing a
   * matching constant here.
   *
   * The flying copy's rect already includes however much of the flight is
   * applied, so the mover's own matrix is subtracted back out to recover the
   * untransformed origin. Reading the live matrix rather than remembering
   * what we asked for is what makes this correct mid-animation as well as at
   * rest — measuring against a stale idea of the offset is how this ends up
   * adding one flight's worth of travel per remeasure.
   */
  const measure = useCallback((): Travel => {
    const flying = wordmarkRef.current;
    const slot = slotRef.current;
    const mover = moverRef.current;
    if (!flying || !slot || !mover) return NO_TRAVEL;

    const raw = getComputedStyle(mover).transform;
    const applied = raw && raw !== "none" ? new DOMMatrixReadOnly(raw) : null;
    const dx = applied?.e ?? 0;
    const dy = applied?.f ?? 0;

    const from = flying.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    return {
      // Left edges align directly; the two boxes differ only in leading.
      x: to.left - (from.left - dx),
      // Centres, so the stand-in's tighter line box does not shift the target.
      y:
        to.top + to.height / 2 - (from.top - dy + from.height / 2),
    };
  }, []);

  const remeasure = useCallback(() => {
    setTravel(measure());
  }, [measure]);

  useEffect(() => {
    const unsub = onIntroDone(() => {
      timerRef.current = setTimeout(() => {
        // Re-measure immediately before the move: at mount the logo SVG and
        // the webfont may not have settled, and a stale reading here is what
        // decides where the wordmark comes to rest.
        remeasure();
        setCanMove(true);
      }, HERO_MOVE_DELAY_MS);
    });
    return () => {
      unsub();
      clearTimeout(timerRef.current);
    };
  }, [remeasure]);

  // Keep the resting position correct for the live viewport, not just for the
  // size the page happened to load at (rotation, browser-chrome collapse,
  // desktop window resize, text-size preference changes).
  useEffect(() => {
    // After paint, so the grid has been laid out and the target is real.
    const raf = requestAnimationFrame(remeasure);
    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);

    // The wordmark is set in a webfont at a fluid size; both settle after
    // first paint, and both move the target.
    void document.fonts?.ready.then(remeasure).catch(() => {});

    const observer =
      typeof ResizeObserver !== "undefined" && slotRef.current
        ? new ResizeObserver(remeasure)
        : null;
    if (slotRef.current) observer?.observe(slotRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
      observer?.disconnect();
    };
  }, [remeasure]);

  // Held back until the copy has finished arriving: starting the drift on top
  // of the reveal would have two animations fighting over the same y.
  useEffect(() => {
    if (!showCopy) return undefined;
    floatTimerRef.current = setTimeout(() => setFloating(true), HERO_FLOAT_DELAY_MS);
    return () => clearTimeout(floatTimerRef.current);
  }, [showCopy]);

  /** Reveal, then drift — the two never overlap, so they never conflict. */
  const copyMotion = (key: "rule" | "lead" | "sub", settled: object) => {
    const drift = DRIFT[key];
    return floating
      ? { animate: { ...settled, opacity: 1, x: drift.x, y: drift.y },
          transition: driftTransition(drift) }
      : { animate: showCopy ? { ...settled, opacity: 1, x: 0, y: 0 } : undefined,
          transition: { duration: HERO_COPY_DURATION_S, ease: HERO_EASE } };
  };

  return (
    <section
      id="home-hero"
      className="home-hero"
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
      {/* ── The editorial composition ─────────────────────────── */}
      <div className="home-hero__grid">
        {/* Reserves the wordmark's box and marks where it has to land. */}
        <p ref={slotRef} className="home-hero__mark" style={WORDMARK_BOX_TIGHT} aria-hidden="true">
          <WordmarkGlyphs />
        </p>

        <motion.hr
          className="home-hero__rule"
          initial={{ scaleX: 0, opacity: 0, x: 0, y: 0 }}
          {...(floating
            ? copyMotion("rule", { scaleX: 1 })
            : {
                animate: showCopy
                  ? { scaleX: 1, opacity: 1, x: 0, y: 0 }
                  : { scaleX: 0, opacity: 0, x: 0, y: 0 },
                transition: { duration: 0.7, ease: HERO_EASE },
              })}
        />

        <motion.h1
          className="home-hero__lead"
          initial={{ opacity: 0, y: 16 }}
          {...copyMotion("lead", {})}
        >
          A two-man team inspired by top creators and advancing technology,
          providing Melbourne with the finest care in web development and
          software solutions.
        </motion.h1>

        <motion.p
          className="home-hero__sub"
          initial={{ opacity: 0, y: 16 }}
          {...copyMotion("sub", {})}
        >
          Driven by the desire to provide AI-supported, customised projects, we
          give you the structure and strategy to build{" "}
          <span className="home-hero__you">your</span> iconic brand and business.
        </motion.p>
      </div>

      <motion.div
        className="home-hero__base"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={showCopy ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: HERO_EASE, delay: 0.28 }}
      >
        <span className="home-hero__base-line" />
        <svg
          className="home-hero__cue"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </motion.div>

      {/*
        Outer div: pure CSS translateY(2.8rem) — identical to the intro
        overlay's wrapper. Browser resolves both the same way, so the
        text sits at exactly the same pixel row when the crossfade happens.
      */}
      <div
        style={{
          transform: "translateY(2.8rem)",
          width: "100%",
          // The wordmark's line box is deliberately tall; left as-is it would
          // sit over the copy and swallow selection. The glyph spans opt back
          // in, so the wordmark itself is still selectable.
          pointerEvents: "none",
        }}
      >
        <motion.div
          ref={moverRef}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: "54rem",
            margin: "0 auto",
            padding: "0 var(--wordmark-gutter, 1.5rem)",
            position: "relative",
          }}
          // The drift is expressed as an offset from wherever the flight left
          // the wordmark, so a resize that moves the landing point carries the
          // whole track with it rather than dragging the wordmark off station.
          animate={
            floating
              ? {
                  x: DRIFT.mark.x.map((d) => d + travel.x),
                  y: DRIFT.mark.y.map((d) => d + travel.y),
                }
              : { x: canMove ? travel.x : 0, y: canMove ? travel.y : 0 }
          }
          // Once it has landed, later measurements are corrections for a
          // resize — they must apply instantly rather than gliding across.
          transition={
            floating
              ? driftTransition(DRIFT.mark)
              : moved
                ? { duration: 0 }
                : { duration: HERO_MOVE_DURATION_S, ease: HERO_EASE }
          }
          onAnimationComplete={() => {
            if (!canMove) return;
            setMoved(true);
            setShowCopy(true);
          }}
        >
          <p ref={wordmarkRef} style={WORDMARK_BOX}>
            <WordmarkGlyphs interactive />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
