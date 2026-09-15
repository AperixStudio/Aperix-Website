"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { HERO_PHONE_ICON } from "@/lib/heroPhoneIcon";
import SVGParticles from "@/components/ui/svg-particles";
import "./HeroReceptionistOrb.css";

type Speaker = "ai" | "booked";
type Line = { from: Speaker; text: string };

/** Dial string — display format +61-3-9962-4119 */
const APERIX_CALL_HREF = "tel:+61399624119";

const SCRIPT: Line[] = [
  {
    from: "ai",
    text: "Hi, welcome to Aperix — I'm Bec, our AI assistant. How can I help you today?",
  },
  { from: "ai", text: "Yes, we have available time tomorrow." },
  { from: "ai", text: "Would you like to book a call at 11am?" },
  { from: "booked", text: "Awesome, you are all booked in." },
];

const IDLE_CAPTION = "Hover to preview · Tap to call";

const LINE_HOLD_MS = 2600;
const MOBILE_ORB_QUERY = "(max-width: 820px)";

function subscribeMobileOrb(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_ORB_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobileOrbSnapshot() {
  return window.matchMedia(MOBILE_ORB_QUERY).matches;
}

function getMobileOrbServerSnapshot() {
  return false;
}

/** Same watery drift language as the hero copy blocks — coprime duration. */
const PHONE_DRIFT = {
  x: [0, 14, 26, 12, -14, -26, -12, 16, 22, 0],
  y: [0, -10, -22, -34, -22, -6, 14, 28, 16, 0],
  duration: 29,
};

const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WATER_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1];

function phoneDriftTransition() {
  const segments = PHONE_DRIFT.x.length - 1;
  return {
    duration: PHONE_DRIFT.duration,
    ease: Array.from({ length: segments }, () => WATER_EASE),
    repeat: Infinity,
    repeatType: "loop" as const,
  };
}

/** Particle orb — isolated so caption swaps never re-render the canvas. */
const HeroOrbParticles = memo(function HeroOrbParticles({
  formed,
  compact,
}: {
  formed: boolean;
  compact: boolean;
}) {
  return (
    <div className="hero-orb__visual" aria-hidden="true">
      <div className="hero-orb__particles-mount">
        <SVGParticles
          className="hero-orb__particles-canvas"
          svgPath={HERO_PHONE_ICON.paths}
          viewBoxWidth={HERO_PHONE_ICON.viewBoxWidth}
          viewBoxHeight={HERO_PHONE_ICON.viewBoxHeight}
          viewBoxMinX={HERO_PHONE_ICON.viewBoxMinX}
          viewBoxMinY={HERO_PHONE_ICON.viewBoxMinY}
          pathStyle="fill"
          fillRule={HERO_PHONE_ICON.fillRule}
          logoHeight={compact ? 200 : 248}
          mobileLogoHeight={compact ? 152 : 184}
          scatteredColor="#2d6488"
          particleColor="#8ec5e8"
          backgroundColor="transparent"
          particleDensity={compact ? 1.6 : 2.4}
          particleSizeMin={compact ? 1.2 : 1.4}
          particleSizeMax={compact ? 2.2 : 2.6}
          enableParticleDeath={false}
          revealOnHover
          formedOverride={formed}
          blobStyle="atom"
          blobSpread={compact ? 1.02 : 1.14}
          blobShimmerSpeed={3.2}
          blobShimmerAmplitude={compact ? 4 : 5}
          blobFollowSpeed={0.035}
          formReturnSpeed={0.035}
        />
      </div>
    </div>
  );
});

type CaptionLayer = "a" | "b";

function captionClass(line: Line | null) {
  if (!line) return "hero-orb__text hero-orb__text--prompt";
  return `hero-orb__text hero-orb__text--${line.from}`;
}

function writeCaption(el: HTMLSpanElement, line: Line | null) {
  el.textContent = line?.text ?? IDLE_CAPTION;
  el.className = captionClass(line);
}

function setCaptionLayerVisibility(
  el: HTMLSpanElement,
  visible: boolean,
  hiddenFromAssistiveTech: boolean,
) {
  el.classList.toggle("is-visible", visible);
  if (hiddenFromAssistiveTech) el.setAttribute("aria-hidden", "true");
  else el.removeAttribute("aria-hidden");
}

export default function HeroReceptionistOrb({
  show,
  floating,
}: {
  show: boolean;
  floating: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobileOrb = useSyncExternalStore(
    subscribeMobileOrb,
    getMobileOrbSnapshot,
    getMobileOrbServerSnapshot,
  );
  const previewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scriptIndexRef = useRef(0);
  const captionARef = useRef<HTMLSpanElement>(null);
  const captionBRef = useRef<HTMLSpanElement>(null);
  const activeCaptionRef = useRef<CaptionLayer>("a");
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  prefersReducedMotionRef.current = prefersReducedMotion;

  const [hovering, setHovering] = useState(false);

  const resetCaption = useCallback(() => {
    const a = captionARef.current;
    const b = captionBRef.current;
    if (!a || !b) return;

    writeCaption(a, null);
    writeCaption(b, null);
    setCaptionLayerVisibility(a, true, false);
    setCaptionLayerVisibility(b, false, true);
    activeCaptionRef.current = "a";
  }, []);

  const showCaption = useCallback((line: Line) => {
    const a = captionARef.current;
    const b = captionBRef.current;
    if (!a || !b) return;

    const activeKey = activeCaptionRef.current;
    const active = activeKey === "a" ? a : b;
    const next = activeKey === "a" ? b : a;

    if (prefersReducedMotionRef.current) {
      writeCaption(active, line);
      setCaptionLayerVisibility(active, true, false);
      setCaptionLayerVisibility(next, false, true);
      return;
    }

    writeCaption(next, line);
    setCaptionLayerVisibility(next, false, true);

    requestAnimationFrame(() => {
      setCaptionLayerVisibility(active, false, true);
      setCaptionLayerVisibility(next, true, false);
      activeCaptionRef.current = activeKey === "a" ? "b" : "a";
    });
  }, []);

  const stopPreview = useCallback(() => {
    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }
    setHovering(false);
    resetCaption();
  }, [resetCaption]);

  const startPreview = useCallback(() => {
    if (previewIntervalRef.current) return;

    setHovering(true);
    scriptIndexRef.current = 0;

    const showLine = () => {
      const line = SCRIPT[scriptIndexRef.current % SCRIPT.length];
      scriptIndexRef.current += 1;
      showCaption(line);
    };

    showLine();
    previewIntervalRef.current = setInterval(showLine, LINE_HOLD_MS);
  }, [showCaption]);

  useEffect(() => () => stopPreview(), [stopPreview]);

  const revealMotion = show
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 0, x: 0, y: 12 };

  const floatMotion = floating
    ? { opacity: 1, x: PHONE_DRIFT.x, y: PHONE_DRIFT.y }
    : revealMotion;

  return (
    <motion.div
      className="home-hero__ai-demo hero-orb"
      initial={{ opacity: 0, y: 12 }}
      animate={floatMotion}
      transition={
        floating
          ? phoneDriftTransition()
          : { duration: 0.55, ease: HERO_EASE, delay: show ? 0.2 : 0 }
      }
    >
      <a
        href={APERIX_CALL_HREF}
        className={`hero-orb__stage${hovering ? " is-preview" : " is-idle"}${prefersReducedMotion ? " no-motion" : ""}`}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        aria-label="Call Aperix on +61 3 9962 4119 — hover to preview Bec, our AI assistant"
      >
        <HeroOrbParticles formed={hovering} compact={isMobileOrb} />

        <span className="hero-orb__overlay" aria-live="polite">
          <span className="hero-orb__caption-stack">
            <span
              ref={captionARef}
              className="hero-orb__text hero-orb__text--prompt is-visible"
            >
              {IDLE_CAPTION}
            </span>
            <span
              ref={captionBRef}
              className="hero-orb__text hero-orb__text--prompt"
              aria-hidden="true"
            />
          </span>
        </span>
      </a>
    </motion.div>
  );
}
