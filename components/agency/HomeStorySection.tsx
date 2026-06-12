"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import RocketTextBlock from "@/components/agency/RocketTextBlock";
import { HERO_VIDEO_OFFSCREEN_CLASS, HERO_VIDEO_SRC } from "@/lib/heroVideo";
import {
  ACT1_HERO_FADE_IN_START_GLOBAL,
  ACT1_PULLBACK_COMPLETE_GLOBAL,
  mapHeroTextOpacity,
  ACT2_WIREFRAME_END_GLOBAL,
  ACT2_WIREFRAME_START_GLOBAL,
  HOME_STORY_ACTS,
  HOME_STORY_SCROLL_VH,
  mapPcCameraProgress,
  mapScreenEvolutionProgress,
  remapBlockProgressForGlobalStory,
} from "@/lib/homeStoryTimeline";
import { HOW_IT_WORKS_BLOCKS } from "@/lib/howItWorksContent";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "@/components/animations/HeroCanvas.css";
import "@/components/animations/DeskEvolutionCanvas.css";
import "./HomeStorySection.css";

const HeroCanvas = dynamic(() => import("@/components/animations/HeroCanvas"), {
  ssr: false,
});

const HEADLINE_WORDS = ["Custom Websites and", "Software Solutions", "built for", "Melbourne businesses."];
const HEADLINE_TEXT = HEADLINE_WORDS.join("\n");
const SECONDARY_HEADLINE_WORDS = ["Hand coded,", "Fast turnaround,", "Tailored solutions."];
const SECONDARY_HEADLINE_TEXT = SECONDARY_HEADLINE_WORDS.join("\n");
const HEADLINE_SEQUENCE = [HEADLINE_TEXT, SECONDARY_HEADLINE_TEXT];

const TRUST_PILLS = [
  "Custom code, no templates",
  "Melbourne-based",
  "Fast turnaround",
  "Hosted & maintained",
];

const ERA_LABELS = ["Blueprint", "Wireframe", "Live site"];

function EraLabel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const act2End = HOME_STORY_ACTS.act2Monitor.end;

  const era0Opacity = useTransform(
    scrollYProgress,
    [
      HOME_STORY_ACTS.act2Monitor.start,
      HOME_STORY_ACTS.act2Monitor.start + 0.04,
      ACT2_WIREFRAME_START_GLOBAL - 0.02,
      ACT2_WIREFRAME_START_GLOBAL,
    ],
    [0, 1, 1, 0],
  );
  const era1Opacity = useTransform(
    scrollYProgress,
    [
      ACT2_WIREFRAME_START_GLOBAL,
      ACT2_WIREFRAME_START_GLOBAL + 0.04,
      ACT2_WIREFRAME_END_GLOBAL,
      ACT2_WIREFRAME_END_GLOBAL + 0.06,
    ],
    [0, 1, 1, 0],
  );
  const era2Opacity = useTransform(
    scrollYProgress,
    [ACT2_WIREFRAME_END_GLOBAL + 0.02, ACT2_WIREFRAME_END_GLOBAL + 0.08, act2End - 0.04, act2End],
    [0, 1, 1, 0],
  );
  const containerOpacity = useTransform(
    scrollYProgress,
    [HOME_STORY_ACTS.act2Monitor.start, ACT2_WIREFRAME_START_GLOBAL, act2End - 0.02, act2End + 0.02],
    [0, 1, 1, 0],
  );

  return (
    <motion.div style={{ opacity: containerOpacity }} className="desk-evolution-era" aria-hidden="true">
      <motion.span style={{ opacity: era0Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[0]}</motion.span>
      <motion.span style={{ opacity: era1Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[1]}</motion.span>
      <motion.span style={{ opacity: era2Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[2]}</motion.span>
    </motion.div>
  );
}

export default function HomeStorySection() {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroVideo, setHeroVideo] = useState<HTMLVideoElement | null>(null);
  const [headlineText, setHeadlineText] = useState("");

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const staticZero = useMotionValue(0);

  // HeroCanvas: progress 0 = zoomed in (matches /dev/hero-canvas scrub at 0).
  const pcCameraProgress = useMotionValue(mapPcCameraProgress(0));
  const screenEvolutionProgress = useTransform(scrollYProgress, mapScreenEvolutionProgress);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    pcCameraProgress.set(mapPcCameraProgress(value));
  });

  useLayoutEffect(() => {
    pcCameraProgress.set(mapPcCameraProgress(scrollYProgress.get()));
  }, [scrollYProgress, pcCameraProgress]);

  const storyBlocks = useMemo(
    () =>
      HOW_IT_WORKS_BLOCKS.map((block) => ({
        ...block,
        progress: remapBlockProgressForGlobalStory(block.progress),
      })),
    [],
  );

  const heroTextOpacity = useTransform(scrollYProgress, mapHeroTextOpacity);
  const heroTextY = useTransform(
    scrollYProgress,
    [ACT1_HERO_FADE_IN_START_GLOBAL, ACT1_PULLBACK_COMPLETE_GLOBAL],
    [24, 0],
  );
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const sceneOpacity = useTransform(
    scrollYProgress,
    [HOME_STORY_ACTS.act3ZoomOut.start + 0.15, 1],
    [1, 0],
  );
  const blueprintOpacity = useTransform(
    scrollYProgress,
    [
      HOME_STORY_ACTS.act2Monitor.start,
      HOME_STORY_ACTS.act2Monitor.start + 0.06,
      HOME_STORY_ACTS.act2Monitor.end - 0.06,
      HOME_STORY_ACTS.act2Monitor.end,
    ],
    [0, 0.75, 0.25, 0],
  );
  const cardsLayerOpacity = useTransform(
    scrollYProgress,
    [
      ACT2_WIREFRAME_START_GLOBAL - 0.01,
      ACT2_WIREFRAME_START_GLOBAL + 0.03,
      HOME_STORY_ACTS.act2Monitor.end - 0.02,
      HOME_STORY_ACTS.act2Monitor.end + 0.03,
    ],
    [0, 1, 1, 0],
  );

  const visibleHeadlineText = prefersReduced ? HEADLINE_TEXT : headlineText;
  const progressForHero = prefersReduced ? staticZero : pcCameraProgress;
  const progressForScreen = prefersReduced ? staticZero : screenEvolutionProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReduced) {
      return undefined;
    }

    const play = () => {
      video.play().catch(() => {});
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [prefersReduced, heroVideo]);

  useEffect(() => {
    if (prefersReduced) {
      return undefined;
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

    timeoutId = setTimeout(tick, 150);

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [prefersReduced]);

  return (
    <section
      ref={scrollRef}
      id="home-story"
      style={{ height: prefersReduced ? undefined : `${HOME_STORY_SCROLL_VH}vh` }}
      className="relative isolate"
      aria-label="Hero and how it works"
    >
      <div
        className={
          prefersReduced
            ? "relative flex min-h-screen flex-col justify-center overflow-hidden bg-transparent px-6 pt-32 pb-20 sm:px-10 lg:px-16 2xl:px-24"
            : "home-story-sticky sticky top-0 h-screen w-full overflow-hidden"
        }
      >
        <video
          ref={(node) => {
            videoRef.current = node;
            setHeroVideo(node);
          }}
          className={HERO_VIDEO_OFFSCREEN_CLASS}
          src={HERO_VIDEO_SRC}
          autoPlay={!prefersReduced}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {!prefersReduced && (
          <motion.div
            style={{ opacity: blueprintOpacity }}
            className="desk-evolution-blueprint pointer-events-none absolute inset-0 z-[1]"
            aria-hidden="true"
          />
        )}

        <motion.div
          style={{ opacity: prefersReduced ? 1 : sceneOpacity }}
          className="pointer-events-none absolute inset-0 z-[2]"
          aria-hidden="true"
        >
          {heroVideo ? (
            <HeroCanvas
              scrollProgress={progressForHero}
              screenEvolutionProgress={progressForScreen}
              showIntroLabel={!prefersReduced}
              videoElement={heroVideo}
              className="hero-canvas--scroll h-full w-full"
            />
          ) : null}
        </motion.div>

        {!prefersReduced && <EraLabel scrollYProgress={scrollYProgress} />}

        <motion.div
          style={
            prefersReduced
              ? undefined
              : {
                  opacity: heroTextOpacity,
                  y: heroTextY,
                }
          }
          className="home-story-copy relative z-10 mx-auto flex h-full w-full max-w-450 flex-col justify-end px-6 pt-32 pb-2 sm:px-10 sm:pb-6 lg:justify-center lg:px-16 lg:pb-0 2xl:px-24"
        >
          <div className="min-w-0 max-w-xl">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-agency-muted sm:text-xs">
              <span className="inline-block h-px w-7 bg-agency-muted" />
              Melbourne Web Design and Software Studio
            </p>

            <p className="font-display font-bold leading-[0.94] tracking-tight" aria-label={HEADLINE_WORDS.join(" ")}>
              <span className="block min-h-[4.1lh]">
                <span className="block whitespace-pre-line text-[clamp(2.15rem,6vw,4.8rem)] text-agency-ink lg:text-[clamp(2.35rem,4.1vw,4.4rem)]">
                  {visibleHeadlineText}
                  {!prefersReduced ? <span aria-hidden="true" className="agency-type-caret" /> : null}
                </span>
              </span>
            </p>

            <div className="mt-7 max-w-lg">
              <p className="text-base leading-relaxed text-agency-muted sm:text-lg">
                Aperix Studio builds hand-coded custom websites and software for Melbourne businesses that want faster
                pages, greater presence and better support.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="agency-button-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-80 active:scale-[0.98] sm:px-7 sm:py-3.5"
              >
                Start your project
              </Link>
              <Link
                href="/our-work"
                className="agency-button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-60 active:scale-[0.98] sm:px-7 sm:py-3.5"
              >
                See proof of work
              </Link>
            </div>

            <div className="mt-6 flex max-w-lg flex-wrap gap-2">
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-agency-border bg-agency-surface/80 px-3 py-1.5 text-[11px] font-medium text-agency-muted backdrop-blur-sm sm:px-4 sm:text-xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {!prefersReduced && (
          <motion.div style={{ opacity: scrollCueOpacity }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Scroll</span>
              <svg width="28" height="44" viewBox="0 0 28 44" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="26" height="42" rx="13" stroke="#ffffff" strokeWidth="2" />
                <motion.rect
                  x="12"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#ffffff"
                  animate={{ y: [10, 20, 10] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </motion.div>
        )}

        {prefersReduced ? (
          <div
            id="how-it-works"
            className="pointer-events-none relative z-10 mt-12 flex flex-col gap-6 px-6 py-8 lg:px-16"
          >
            {storyBlocks.map((block) => (
              <RocketTextBlock
                key={block.id}
                block={block}
                scrollYProgress={staticZero}
                prefersReduced
              />
            ))}
          </div>
        ) : (
          <motion.div style={{ opacity: cardsLayerOpacity }} className="pointer-events-none absolute inset-0 z-[11]">
            <div id="how-it-works" className="absolute inset-0">
              {storyBlocks.map((block) => (
                <RocketTextBlock
                  key={block.id}
                  block={block}
                  scrollYProgress={scrollYProgress}
                  prefersReduced={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
