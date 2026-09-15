"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { motion } from "framer-motion";
import { onIntroDone } from "@/lib/introState";
import { INTRO_SETTLE_MS, INTRO_TEXT_FADE_MS } from "@/components/animations/IntroScreenSimple";
import HeroReceptionistOrb from "@/components/agency/HeroReceptionistOrb";
import "./HomeHero.css";

/*
  Position contract with IntroScreenSimple
  ─────────────────────────────────────────
  The intro floating text uses:
    position:fixed; inset:0; display:flex; align-items:flex-start;
    justify-content:center; padding-top:6vh

  The backdrop's .home-hero-backdrop__mark / __mover-layer use the
  IDENTICAL values (see HomeHero.css) so the browser resolves both to
  exactly the same pixel row — both are 100dvh boxes anchored at the top
  of the page at the moment the crossfade happens (scrollY is always 0
  then), so a page-relative box and a viewport-fixed box land identically.

  Framer-motion only touches the title wrapper, which starts at x:0 / y:0
  (no extra offset, i.e. exactly the intro's position) and animates to the
  slot's resting place once the crossfade is over — a short settle rather
  than a long flight, since the slot is centred the same way. Both the
  stand-in and the flying copy share the same tight line-height so that
  travel is measured centre-to-centre with nothing else to compensate for.
*/

const HERO_MOVE_DELAY_MS = INTRO_SETTLE_MS + INTRO_TEXT_FADE_MS; // 700 + 400 ms
// Match the intro STUDIO slide — same ease curve and similar pacing
const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_MOVE_DURATION_S = 0.95;
const HERO_COPY_DURATION_S = 0.55;
/** Beat after the copy has revealed before the blocks start drifting. */
const HERO_FLOAT_DELAY_MS = 900;

type Drift = { x: number[]; y: number[]; duration: number };

/** Smooth rounded easing — each segment flows into the next like water. */
const WATER_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1];

/**
 * The two copy blocks drift on independent organic loops once revealed.
 * The wordmark and its rule stay fixed — only the paragraphs breathe.
 *
 * Periods are deliberately coprime so the pair never lock back into step.
 * Every track opens and closes on 0 for a seamless loop.
 */
const DRIFT: Record<"lead" | "sub", Drift> = {
  lead: {
    x: [0, 18, 30, 14, -18, -32, -16, 10, 24, 0],
    y: [0, -14, -28, -38, -24, -8, 12, 28, 16, 0],
    duration: 26,
  },
  sub: {
    x: [0, -16, -28, -20, 8, 26, 32, 12, -22, 0],
    y: [0, -20, -10, 16, 30, 20, -6, -26, -14, 0],
    duration: 31,
  },
};

const MOBILE_HERO_QUERY = "(max-width: 820px)";

/** Softer on mobile — grid padding keeps copy on-screen without clipping. */
const MOBILE_DRIFT: Record<"lead" | "sub", Drift> = {
  lead: {
    x: [0, 8, 12, 6, -8, -12, -6, 4, 10, 0],
    y: [0, -6, -10, -12, -8, -3, 5, 10, 6, 0],
    duration: 26,
  },
  sub: {
    x: [0, -7, -11, -8, 3, 10, 12, 5, -9, 0],
    y: [0, -8, -4, 6, 12, 8, -2, -10, -5, 0],
    duration: 31,
  },
};

function subscribeMobileHero(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_HERO_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobileHeroSnapshot() {
  return window.matchMedia(MOBILE_HERO_QUERY).matches;
}

function getMobileHeroServerSnapshot() {
  return false;
}

function driftTransition(drift: Drift) {
  const segments = drift.x.length - 1;
  return {
    duration: drift.duration,
    ease: Array.from({ length: segments }, () => WATER_EASE),
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

/**
 * Shared by the stand-in (slotRef) and the flying copy (wordmarkRef) alike —
 * both need to be pixel-identical boxes (down to line-height) so the travel
 * between them is a plain centre-to-centre measurement with nothing else to
 * compensate for, and so the flying copy matches the intro's own tight
 * (line-height:1) spans at the crossfade instant.
 */
const WORDMARK_BOX: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 0,
  margin: 0,
  lineHeight: 1,
};

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
  const isMobileHero = useSyncExternalStore(
    subscribeMobileHero,
    getMobileHeroSnapshot,
    getMobileHeroServerSnapshot,
  );
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
      // Centres on both axes. The stand-in is a full-bleed box; the flying
      // copy shrink-wraps the glyphs. Aligning left edges would yank the
      // line into the backdrop's overflow clip.
      x: to.left + to.width / 2 - (from.left - dx + from.width / 2),
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
  const copyMotion = (key: "lead" | "sub", settled: object) => {
    const drift = isMobileHero ? MOBILE_DRIFT[key] : DRIFT[key];
    return floating
      ? { animate: { ...settled, opacity: 1, x: drift.x, y: drift.y },
          transition: driftTransition(drift) }
      : { animate: showCopy ? { ...settled, opacity: 1, x: 0, y: 0 } : undefined,
          transition: { duration: HERO_COPY_DURATION_S, ease: HERO_EASE } };
  };

  return (
    /*
      Outer wrapper: the whole hero's footprint (one 100dvh screen). It sets
      neither z-index nor any other stacking-context trigger (transform,
      opacity, filter), so its two children's own z-index values compete
      directly against SiteLogoFixed's fixed z-index:200 in the SAME
      stacking context rather than being capped by this wrapper's rank —
      that's what lets the backdrop sit behind the fixed logo (z:1) while
      the content section sits in front of it (z:201). Both children are
      absolutely positioned to the same inset:0 box so they overlap rather
      than stack — without that, the content (paragraphs) would sit a full
      viewport below the backdrop and need a scroll to reach.
    */
    <div id="home-hero" style={{ position: "relative", height: "100dvh" }}>
      {/* Backdrop layer — the giant "APERIX STUDIO" wordmark, plus the
          invisible slot SiteLogoFixed measures to know where the big hero
          logo belongs. */}
      <div className="home-hero-backdrop" aria-hidden="true">
        {/* Reserves the wordmark's box and marks where it has to land. */}
        <p ref={slotRef} className="home-hero-backdrop__mark" style={WORDMARK_BOX}>
          <WordmarkGlyphs />
        </p>

        {/* Invisible marker — SiteLogoFixed reads this rect to know where
            the big hero-scale logo should sit (most of the right side). */}
        <div id="home-hero-logo-slot" className="home-hero-backdrop__logo-slot" />

        {/* .home-hero-backdrop__mover-layer carries the exact same
            alignItems/paddingTop as the intro's text wrapper (see
            IntroScreenSimple.tsx) so the two resolve to the same pixel row
            when the crossfade happens. */}
        <div className="home-hero-backdrop__mover-layer">
          <motion.div
            ref={moverRef}
            className="home-hero-backdrop__mover"
            // The wordmark lands and stays put — only the copy blocks drift.
            animate={{ x: canMove ? travel.x : 0, y: canMove ? travel.y : 0 }}
            // Once it has landed, later measurements are corrections for a
            // resize — they must apply instantly rather than gliding across.
            transition={
              moved
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
      </div>

      <section
        className="home-hero"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 201,
        }}
      >
        {/* Soft colour fields over the video — site-atmosphere blobs sit behind SiteBackground. */}
        <div className="home-hero__orbs" aria-hidden="true">
          <div className="home-hero__orb home-hero__orb--sky" />
          <div className="home-hero__orb home-hero__orb--peach" />
          <div className="home-hero__orb home-hero__orb--coral" />
        </div>

        {/* ── The editorial composition ─────────────────────────── */}
        <div className="home-hero__grid">
          <motion.hr
            className="home-hero__rule"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              showCopy
                ? { scaleX: 1, opacity: 1 }
                : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 0.7, ease: HERO_EASE }}
          />

          <div className="home-hero__copy">
            <div className="home-hero__drift-wrap home-hero__drift-wrap--lead">
              <motion.h1
                className="home-hero__lead"
                initial={{ opacity: 0, y: 16 }}
                {...copyMotion("lead", {})}
              >
                A two-man team inspired by top creators and advancing technology,
                providing Melbourne with the finest care in web development and
                software solutions.
              </motion.h1>
            </div>

            <div className="home-hero__drift-wrap home-hero__drift-wrap--sub">
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
          </div>
        </div>

        <HeroReceptionistOrb show={showCopy} floating={floating} />

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
      </section>
    </div>
  );
}
