"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import HashLink from "@/components/agency/HashLink";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import RocketTextBlock from "@/components/agency/RocketTextBlock";
import { HERO_VIDEO_OFFSCREEN_CLASS, HERO_VIDEO_SRC } from "@/lib/heroVideo";
import { resolveHeroCanvasConfig } from "@/lib/resolveHeroCanvasConfig";
import {
  ACT1_HERO_FADE_IN_START_GLOBAL,
  ACT1_PULLBACK_COMPLETE_GLOBAL,
  mapHeroTextOpacity,
  ACT2_WIREFRAME_END_GLOBAL,
  ACT2_WIREFRAME_START_GLOBAL,
  HOME_STORY_ACTS,
  HOME_STORY_SCROLL_VH,
  HOME_STORY_SCROLL_VH_MOBILE,
  mapAct3RevealProgress,
  mapPcCameraProgress,
  mapScreenEvolutionProgress,
  remapBlockProgressForGlobalStory,
} from "@/lib/homeStoryTimeline";
import { HOW_IT_WORKS_BLOCKS } from "@/lib/howItWorksContent";
import { ACT3_TRANSITION_START, USE_UNIFIED_STORY_EXPERIENCE } from "@/lib/experience/constants";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useInView } from "@/lib/useInView";
import { useMobileViewport } from "@/lib/useMobileViewport";
import "@/components/animations/HeroCanvas.css";
import "@/components/animations/Act3RevealCanvas.css";
import "@/components/animations/DeskEvolutionCanvas.css";
import "./HomeStorySection.css";

const HeroCanvas = dynamic(() => import("@/components/animations/HeroCanvas"), {
  ssr: false,
});

const Act3RevealCanvas = dynamic(() => import("@/components/animations/Act3RevealCanvas"), {
  ssr: false,
});

const StoryExperienceCanvas = dynamic(() => import("@/components/experience/StoryExperienceCanvas"), {
  ssr: false,
});

/** Hard swap — PC off, Act 3 on (no overlapping transparent canvases). */
const ACT3_START_GLOBAL = HOME_STORY_ACTS.act3Reveal.start;

const HERO_KICKER = "Two-person team · Melbourne";
const HERO_TITLE_LINES = ["Web developer", "& SaaS", "studio."];
const HERO_TITLE = HERO_TITLE_LINES.join(" ");
const HERO_BODY =
  "We're two developers in Melbourne — hand-coding websites, web apps, and SaaS products. Landing page or full platform, side project or serious build — if it's worth making well, we're in.";
const HERO_META = ["Melbourne", "2-person team", "Any size project"];

const ERA_LABELS = ["Blueprint", "Wireframe", "Live site"];

const ACT3_HEADING = "Designed and built for every screen";

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
  const { isMobile, ready: viewportReady } = useMobileViewport();
  const scrollRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroVideo, setHeroVideo] = useState<HTMLVideoElement | null>(null);
  const [showAct3Scene, setShowAct3Scene] = useState(false);
  const [pauseHeroVideo, setPauseHeroVideo] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const storyInView = useInView(scrollRef);
  const storyScrollVh = isMobile ? HOME_STORY_SCROLL_VH_MOBILE : HOME_STORY_SCROLL_VH;
  const renderActive = storyInView && tabVisible && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const staticZero = useMotionValue(0);

  const pcCameraProgress = useMotionValue(mapPcCameraProgress(0));
  const act3RevealProgress = useMotionValue(mapAct3RevealProgress(0));
  const screenEvolutionProgress = useTransform(scrollYProgress, mapScreenEvolutionProgress);
  const showPcScene = !showAct3Scene;
  const heroLiveConfig = viewportReady && isMobile ? resolveHeroCanvasConfig(true) : undefined;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    pcCameraProgress.set(mapPcCameraProgress(value));
    act3RevealProgress.set(mapAct3RevealProgress(value));

    const showAct3 = value >= ACT3_START_GLOBAL;
    setShowAct3Scene((prev) => (prev === showAct3 ? prev : showAct3));

    if (USE_UNIFIED_STORY_EXPERIENCE) {
      const pauseVideo = value >= ACT3_TRANSITION_START;
      setPauseHeroVideo((prev) => (prev === pauseVideo ? prev : pauseVideo));
    }
  });

  useLayoutEffect(() => {
    const value = scrollYProgress.get();
    pcCameraProgress.set(mapPcCameraProgress(value));
    act3RevealProgress.set(mapAct3RevealProgress(value));
    setShowAct3Scene(value >= ACT3_START_GLOBAL);
    if (USE_UNIFIED_STORY_EXPERIENCE) {
      setPauseHeroVideo(value >= ACT3_TRANSITION_START);
    }
  }, [scrollYProgress, pcCameraProgress, act3RevealProgress, isMobile]);

  useEffect(() => {
    const onVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      return undefined;
    }
    if (USE_UNIFIED_STORY_EXPERIENCE) {
      void import("@/components/experience/StoryExperienceCanvas");
      void import("@/lib/experience/scenes/act3RevealScene");
    } else {
      void import("@/components/animations/Act3RevealCanvas");
    }
    return undefined;
  }, [prefersReduced]);

  const storyStepBlocks = useMemo(
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
  const act3HeadingOpacity = useTransform(
    scrollYProgress,
    [ACT3_START_GLOBAL, ACT3_START_GLOBAL + 0.05, 0.98, 1],
    [0, 1, 1, 0],
  );
  const act3HeadingY = useTransform(
    scrollYProgress,
    [ACT3_START_GLOBAL, ACT3_START_GLOBAL + 0.06],
    [20, 0],
  );
  const progressForHero = prefersReduced ? staticZero : pcCameraProgress;
  const progressForScreen = prefersReduced ? staticZero : screenEvolutionProgress;
  const progressForAct3 = prefersReduced ? staticZero : act3RevealProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReduced) {
      return undefined;
    }

    const shouldPauseVideo = USE_UNIFIED_STORY_EXPERIENCE ? pauseHeroVideo : !showPcScene;

    if (!renderActive || shouldPauseVideo) {
      video.pause();
      return undefined;
    }

    const play = () => {
      video.play().catch(() => {});
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [prefersReduced, heroVideo, renderActive, showPcScene, pauseHeroVideo]);

  return (
    <section
      ref={scrollRef}
      id="home-story"
      style={{ height: prefersReduced ? undefined : `${storyScrollVh}vh` }}
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
          <>
            <div
              className="home-story-atmosphere pointer-events-none absolute inset-0 z-0"
              aria-hidden="true"
            />
            <div
              className="home-story-noise pointer-events-none absolute inset-0 z-0"
              aria-hidden="true"
            />
          </>
        )}

        {!prefersReduced && (
          <motion.div
            style={{ opacity: blueprintOpacity }}
            className="desk-evolution-blueprint pointer-events-none absolute inset-0 z-1"
            aria-hidden="true"
          />
        )}

        {!prefersReduced && USE_UNIFIED_STORY_EXPERIENCE ? (
          <div className="pointer-events-none absolute inset-0 z-2" aria-hidden="true">
            {heroVideo && viewportReady ? (
              <StoryExperienceCanvas
                key="story-experience"
                globalScrollProgress={scrollYProgress}
                videoElement={heroVideo}
                heroLiveConfig={heroLiveConfig}
                showIntroLabel={!prefersReduced}
                renderActive={renderActive}
                isMobile={isMobile}
                prefersReducedMotion={prefersReduced}
                className="h-full w-full"
              />
            ) : null}
          </div>
        ) : (
          <>
            {showPcScene && (
              <div className="pointer-events-none absolute inset-0 z-2" aria-hidden="true">
                {heroVideo ? (
                  <HeroCanvas
                    scrollProgress={progressForHero}
                    screenEvolutionProgress={progressForScreen}
                    showIntroLabel={!prefersReduced}
                    videoElement={heroVideo}
                    liveConfig={heroLiveConfig}
                    renderActive={renderActive}
                    className="hero-canvas--scroll h-full w-full"
                  />
                ) : null}
              </div>
            )}

            {showAct3Scene && (
              <div className="pointer-events-none absolute inset-0 z-2" aria-hidden="true">
                <Act3RevealCanvas
                  scrollProgress={progressForAct3}
                  renderActive={renderActive}
                  className="act3-reveal-scene--scroll h-full w-full"
                />
              </div>
            )}
          </>
        )}

        {!prefersReduced && (
          <div
            className="home-story-glow pointer-events-none absolute inset-0 z-3"
            aria-hidden="true"
          />
        )}

        {!prefersReduced && (
          <div
            className="home-story-scrim pointer-events-none absolute inset-x-0 bottom-0 z-4 h-[68%] lg:hidden"
            aria-hidden="true"
          />
        )}

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
          className={
            prefersReduced
              ? "home-story-copy relative z-10 mx-auto flex h-full w-full max-w-450 flex-col justify-end px-6 pt-32 pb-2 sm:px-10 sm:pb-6 lg:justify-center lg:px-16 lg:pb-0 2xl:px-24"
              : "home-story-copy relative z-10 mx-auto flex h-full w-full max-w-450 flex-col justify-end px-6 pt-32 pb-2 sm:px-10 sm:pb-6 lg:justify-center lg:px-16 lg:pb-0 2xl:px-24"
          }
        >
          <div className="min-w-0 max-w-2xl lg:max-w-3xl">
            <p className="home-story-hero-kicker mb-6 sm:mb-7">{HERO_KICKER}</p>

            <h1 className="home-story-hero-title" aria-label={HERO_TITLE}>
              {HERO_TITLE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="home-story-hero-body mt-7 max-w-lg text-base leading-relaxed text-white/65 sm:mt-8 sm:text-lg">
              {HERO_BODY}
            </p>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
              <HashLink
                href="/#our-work"
                className="agency-button-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-80 active:scale-[0.98] sm:px-7 sm:py-3.5"
              >
                View work
              </HashLink>
              <Link
                href="/contact"
                className="agency-button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-60 active:scale-[0.98] sm:px-7 sm:py-3.5"
              >
                Say hello
              </Link>
            </div>

            <p className="home-story-hero-meta mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100/50 sm:text-xs">
              {HERO_META.join(" · ")}
            </p>
          </div>
        </motion.div>

        {!prefersReduced && showAct3Scene && (
          <motion.h2
            style={{ opacity: act3HeadingOpacity, y: act3HeadingY }}
            className="home-story-act3-heading pointer-events-none absolute inset-x-0 bottom-[clamp(5.5rem,14vh,8.5rem)] z-10 mx-auto max-w-3xl px-6 text-center font-display text-[clamp(1.35rem,3.8vw,2.5rem)] font-bold leading-[1.08] tracking-tight text-white sm:px-10 lg:px-16"
          >
            {ACT3_HEADING}
          </motion.h2>
        )}

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
            {HOW_IT_WORKS_BLOCKS.map((block) => (
              <RocketTextBlock
                key={block.id}
                block={block}
                scrollYProgress={staticZero}
                prefersReduced
                tone="dark"
              />
            ))}
          </div>
        ) : (
          <div id="how-it-works" className="pointer-events-none absolute inset-0 z-45">
            {storyStepBlocks.map((block) => (
              <RocketTextBlock
                key={block.id}
                block={block}
                scrollYProgress={scrollYProgress}
                prefersReduced={false}
                tone="dark"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
