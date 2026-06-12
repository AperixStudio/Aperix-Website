"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  HERO_VIDEO_OFFSCREEN_CLASS,
  HERO_VIDEO_SRC,
} from "@/lib/heroVideo";
import "@/components/animations/HeroCanvas.css";

const HeroCanvas = dynamic(() => import("@/components/animations/HeroCanvas"), {
  ssr: false,
});

const SCROLL_HEIGHT_VH = 300;

const HEADLINE_WORDS = [
  "Custom Websites and",
  "Software Solutions",
  "built for",
  "Melbourne businesses.",
];
const HEADLINE_TEXT = HEADLINE_WORDS.join("\n");

const SECONDARY_HEADLINE_WORDS = [
  "Hand coded,",
  "Fast turnaround,",
  "Tailored solutions.",
];
const SECONDARY_HEADLINE_TEXT = SECONDARY_HEADLINE_WORDS.join("\n");
const HEADLINE_SEQUENCE = [HEADLINE_TEXT, SECONDARY_HEADLINE_TEXT];

const TRUST_PILLS = [
  "Custom code, no templates",
  "Melbourne-based",
  "Fast turnaround",
  "Hosted & maintained",
];

export default function HeroV2() {
  const prefersReduced = useReducedMotion();
  const scrollTrackRef = useRef<HTMLElement>(null);
  const finalProgress = useMotionValue(1);
  const staticTextOpacity = useMotionValue(1);
  const staticTextY = useMotionValue(0);
  const [headlineText, setHeadlineText] = useState(HEADLINE_TEXT);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(Boolean(HERO_VIDEO_SRC));

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"],
  });

  const zoomProgress = useTransform(scrollYProgress, [0, 0.78], [0, 1]);
  const textOpacity = useTransform(zoomProgress, [0.45, 0.55], [0, 1]);
  const textY = useTransform(zoomProgress, [0.45, 0.55], [48, 0]);
  const scrollHintOpacity = useTransform(zoomProgress, [0, 0.4, 0.45], [1, 1, 0]);

  const cameraProgress = prefersReduced ? finalProgress : zoomProgress;
  const copyOpacity = prefersReduced ? staticTextOpacity : textOpacity;
  const copyY = prefersReduced ? staticTextY : textY;

  useEffect(() => {
    if (prefersReduced) {
      setHeadlineText(HEADLINE_TEXT);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) {
        return;
      }

      const currentPhrase = HEADLINE_SEQUENCE[phraseIndex] ?? HEADLINE_TEXT;

      if (!deleting) {
        charIndex += 1;
        setHeadlineText(currentPhrase.slice(0, charIndex));

        if (charIndex >= currentPhrase.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }

        timeoutId = setTimeout(tick, 65);
        return;
      }

      charIndex -= 1;
      setHeadlineText(currentPhrase.slice(0, Math.max(charIndex, 0)));

      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % HEADLINE_SEQUENCE.length;
        timeoutId = setTimeout(tick, 450);
        return;
      }

      timeoutId = setTimeout(tick, 32);
    };

    setHeadlineText("");
    timeoutId = setTimeout(tick, 150);

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (!videoElement || !videoEnabled) {
      return;
    }

    videoElement.muted = true;
    videoElement.playsInline = true;

    const onReady = () => {
      void videoElement.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    };

    videoElement.addEventListener("loadeddata", onReady);
    onReady();

    return () => videoElement.removeEventListener("loadeddata", onReady);
  }, [videoElement, videoEnabled]);

  return (
    <section
      ref={scrollTrackRef}
      className="relative"
      style={{ height: prefersReduced ? undefined : `${SCROLL_HEIGHT_VH}vh` }}
      aria-label="Hero"
    >
      {videoEnabled && HERO_VIDEO_SRC ? (
        <video
          ref={setVideoElement}
          className={HERO_VIDEO_OFFSCREEN_CLASS}
          src={HERO_VIDEO_SRC}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          onError={(event) => {
            const mediaError = event.currentTarget.error;
            console.warn(
              "[HeroV2] Monitor video failed to load:",
              HERO_VIDEO_SRC,
              mediaError?.message ?? "unknown error",
            );
            setVideoEnabled(false);
          }}
        />
      ) : null}

      <div className={prefersReduced ? "relative min-h-screen" : "hero-v2-sticky"}>
        <div className="hero-v2-canvas">
          <HeroCanvas
            scrollProgress={cameraProgress}
            videoElement={videoElement}
            showIntroLabel={!prefersReduced}
            className="hero-canvas--scroll h-full min-h-0"
          />
        </div>

        <motion.div className="hero-v2-copy" style={{ opacity: copyOpacity, y: copyY }}>
          <div className="relative z-10 mx-auto grid h-full w-full max-w-450 items-end px-6 pb-2 pt-28 sm:px-10 sm:pb-6 sm:pt-32 lg:grid-cols-[minmax(0,0.46fr)_minmax(360px,0.54fr)] lg:items-center lg:px-16 lg:pb-0 lg:pt-32 2xl:px-24">
            <div className="min-w-0 max-w-xl lg:col-start-1">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-agency-muted sm:text-xs">
                <span className="inline-block h-px w-6 bg-agency-muted sm:w-8" />
                Melbourne Web Design and Software Studio
              </p>

              <h1
                className="font-display font-bold leading-[0.94] tracking-tight"
                aria-label={HEADLINE_WORDS.join(" ")}
              >
                <span className="block min-h-[4.1lh]">
                  <span className="block whitespace-pre-line text-[clamp(2.15rem,6vw,4.8rem)] text-agency-ink lg:text-[clamp(2.35rem,4.1vw,4.4rem)]">
                    {headlineText}
                    {!prefersReduced ? (
                      <span aria-hidden="true" className="agency-type-caret" />
                    ) : null}
                  </span>
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-relaxed text-agency-muted sm:text-base">
                Hand-coded websites and software for Melbourne businesses — fast
                turnaround, no templates, ongoing support.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="agency-button-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-80 active:scale-[0.98]"
                >
                  Start your project
                </Link>
                <Link
                  href="/our-work"
                  className="agency-button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-60 active:scale-[0.98]"
                >
                  See proof of work
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {TRUST_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-agency-border/80 bg-agency-surface/80 px-3 py-1 text-[0.68rem] font-medium text-agency-muted backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {!prefersReduced ? (
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5 lg:flex"
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M5 8l5 5 5-5"
                  stroke="var(--agency-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
