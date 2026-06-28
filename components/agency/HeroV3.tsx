"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import HashLink from "@/components/agency/HashLink";
import RocketTextBlock from "@/components/agency/RocketTextBlock";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import UnicornScene from "unicornstudio-react/next";
import {
  applyHeroV3MonitorScrollEnd,
  commitHeroV3ModelRestPose,
  HERO_V3_APPEAR_DURATION_MS,
  HERO_V3_MODEL_APPEAR_MS,
  HERO_V3_SCROLL_ENGAGE_THRESHOLD,
  HERO_V3_SCROLL_HEIGHT_VH,
  HERO_V3_UNICORN_JSON,
  HERO_V3_UNICORN_RENDER,
  HERO_V3_UNICORN_SDK_URL,
  heroV3UnicornScrollStart,
  mapHeroV3UnicornScrollY,
  type HeroV3UnicornSceneInstance,
} from "@/lib/heroUnicornContent";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIntroDone } from "@/lib/useIntroDone";
import { useInView } from "@/lib/useInView";
import { useMobileViewport } from "@/lib/useMobileViewport";
import { HOW_IT_WORKS_BLOCKS } from "@/lib/howItWorksContent";
import {
  HERO_V3_ACT3_HEADING,
  HERO_V3_ACT3_SCROLL,
  HERO_V3_TEXT_FADE_OUT,
  remapHeroV3StepProgress,
} from "@/lib/heroV3StoryTimeline";
import "./HeroV3.css";
import "./HomeStorySection.css";

type UnicornScrollApi = {
  setScroll?: (scrollY: number) => void;
  useNativeScroll?: () => void;
  scenes?: HeroV3UnicornSceneInstance[];
};

function getUnicornScrollApi(): UnicornScrollApi | undefined {
  return window.UnicornStudio as unknown as UnicornScrollApi | undefined;
}

const HERO_KICKER = "Two-person team · Melbourne";
const HERO_TITLE_LINES = ["Web developer", "& SaaS", "studio."];
const HERO_TITLE = HERO_TITLE_LINES.join(" ");
const HERO_BODY =
  "We're two developers in Melbourne — hand-coding websites, web apps, and SaaS products. Landing page or full platform, side project or serious build — if it's worth making well, we're in.";
const HERO_META = ["Melbourne", "2-person team", "Any size project"];

function readHeroScrollMetrics() {
  const viewportHeight = window.innerHeight;
  const canvas = document.querySelector<HTMLElement>(".hero-v3__unicorn-scene");
  const sceneHalfHeight = canvas
    ? canvas.getBoundingClientRect().height / 2
    : viewportHeight / 2;
  return { viewportHeight, sceneHalfHeight };
}

function applyHeroScroll(progress: number) {
  const { viewportHeight, sceneHalfHeight } = readHeroScrollMetrics();
  getUnicornScrollApi()?.setScroll?.(mapHeroV3UnicornScrollY(progress, viewportHeight, sceneHalfHeight));
}

function applyHeroScrollStart() {
  const { viewportHeight, sceneHalfHeight } = readHeroScrollMetrics();
  getUnicornScrollApi()?.setScroll?.(heroV3UnicornScrollStart(viewportHeight, sceneHalfHeight));
}

function resolveHeroUnicornScene(
  sceneRef: HeroV3UnicornSceneInstance | null,
): HeroV3UnicornSceneInstance | null {
  if (sceneRef?.layers?.length) {
    return sceneRef;
  }

  const root = document.querySelector<HTMLElement>(".hero-v3__unicorn-scene");
  if (!root) {
    return sceneRef;
  }

  const scenes = getUnicornScrollApi()?.scenes ?? [];
  return (
    scenes.find((scene) => {
      const element = scene.element;
      return element === root || element?.contains(root) || root.contains(element ?? null);
    }) ?? sceneRef
  );
}

function requestHeroUnicornResize(sceneRef: HeroV3UnicornSceneInstance | null) {
  const scene = resolveHeroUnicornScene(sceneRef);
  const element = scene?.element;
  if (!element) {
    return;
  }

  const unicornScene = getUnicornScrollApi()?.scenes?.find(
    (candidate) => candidate.element === element || element.contains(candidate.element ?? null),
  ) as { resize?: () => void } | undefined;

  unicornScene?.resize?.();
}

function syncHeroScrollAfterLayout(
  scrollYProgress: MotionValue<number>,
  syncHeroScroll: (progress: number) => void,
  sceneRef: HeroV3UnicornSceneInstance | null,
) {
  requestHeroUnicornResize(sceneRef);
  syncHeroScroll(scrollYProgress.get());
}

function holdHeroUnicornScrollOnly(sceneRef: HeroV3UnicornSceneInstance | null) {
  const scene = resolveHeroUnicornScene(sceneRef);
  if (scene) {
    scene.isFixed = true;
    applyHeroV3MonitorScrollEnd(scene);
  }
  applyHeroScrollStart();
}

function holdHeroUnicornAtRest(sceneRef: HeroV3UnicornSceneInstance | null) {
  holdHeroUnicornScrollOnly(sceneRef);
  commitHeroV3ModelRestPose(resolveHeroUnicornScene(sceneRef));
}

function HeroV3UnicornScene({
  scrollYProgress,
  renderActive,
  onAppearStart,
}: {
  scrollYProgress: MotionValue<number>;
  renderActive: boolean;
  onAppearStart?: () => void;
}) {
  const scrollRef = useRef(0);
  const sceneReadyRef = useRef(false);
  const scrollEngagedRef = useRef(false);
  const appearCompleteRef = useRef(false);
  const appearTimerRef = useRef<number | null>(null);
  const scrollHoldFrameRef = useRef<number | null>(null);
  const unicornSceneRef = useRef<HeroV3UnicornSceneInstance | null>(null);
  const { isMobile, ready } = useMobileViewport();

  const holdScrollAtStart = useCallback(() => {
    if (!appearCompleteRef.current) {
      holdHeroUnicornScrollOnly(unicornSceneRef.current);
      return;
    }
    holdHeroUnicornAtRest(unicornSceneRef.current);
  }, []);

  const syncHeroScroll = useCallback(
    (progress: number) => {
      if (progress < HERO_V3_SCROLL_ENGAGE_THRESHOLD) {
        holdScrollAtStart();
        return;
      }

      scrollEngagedRef.current = true;
      applyHeroScroll(progress);
    },
    [holdScrollAtStart],
  );

  const startScrollHoldLoop = useCallback(() => {
    if (scrollHoldFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollHoldFrameRef.current);
    }

    const tick = () => {
      if (scrollEngagedRef.current) {
        scrollHoldFrameRef.current = null;
        return;
      }

      if (scrollRef.current >= HERO_V3_SCROLL_ENGAGE_THRESHOLD) {
        scrollEngagedRef.current = true;
        applyHeroScroll(scrollRef.current);
        scrollHoldFrameRef.current = null;
        return;
      }

      holdScrollAtStart();
      scrollHoldFrameRef.current = window.requestAnimationFrame(tick);
    };

    scrollHoldFrameRef.current = window.requestAnimationFrame(tick);
  }, [holdScrollAtStart]);

  useLayoutEffect(() => {
    holdScrollAtStart();
  }, [holdScrollAtStart]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollRef.current = value;
    if (sceneReadyRef.current) {
      syncHeroScroll(value);
    }
  });

  useEffect(() => {
    scrollRef.current = scrollYProgress.get();

    const container = document.querySelector<HTMLElement>(".hero-v3__unicorn-scene");
    const resizeObserver =
      container && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!sceneReadyRef.current) {
              return;
            }
            syncHeroScrollAfterLayout(scrollYProgress, syncHeroScroll, unicornSceneRef.current);
          })
        : null;
    resizeObserver?.observe(container!);

    const onResize = () => {
      if (sceneReadyRef.current) {
        syncHeroScrollAfterLayout(scrollYProgress, syncHeroScroll, unicornSceneRef.current);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", onResize);
      if (appearTimerRef.current !== null) {
        window.clearTimeout(appearTimerRef.current);
      }
      if (scrollHoldFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollHoldFrameRef.current);
      }
      getUnicornScrollApi()?.useNativeScroll?.();
    };
  }, [scrollYProgress, syncHeroScroll]);

  const handleLoad = () => {
    sceneReadyRef.current = true;
    scrollEngagedRef.current = false;
    appearCompleteRef.current = false;
    scrollRef.current = scrollYProgress.get();
    onAppearStart?.();

    if (appearTimerRef.current !== null) {
      window.clearTimeout(appearTimerRef.current);
    }

    holdScrollAtStart();
    startScrollHoldLoop();
    syncHeroScrollAfterLayout(scrollYProgress, syncHeroScroll, unicornSceneRef.current);

    const relayout = () => {
      syncHeroScrollAfterLayout(scrollYProgress, syncHeroScroll, unicornSceneRef.current);
    };
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(relayout);
    });
    window.setTimeout(relayout, 120);
    window.setTimeout(relayout, 400);

    appearTimerRef.current = window.setTimeout(() => {
      appearCompleteRef.current = true;
      if (!scrollEngagedRef.current) {
        holdScrollAtStart();
      } else {
        relayout();
      }
    }, HERO_V3_APPEAR_DURATION_MS);
  };

  if (!ready) {
    return null;
  }

  const renderQuality = isMobile ? HERO_V3_UNICORN_RENDER.mobile : HERO_V3_UNICORN_RENDER.desktop;

  return (
    <div className="hero-v3__unicorn-stage">
      <UnicornScene
        key={HERO_V3_UNICORN_JSON}
        jsonFilePath={HERO_V3_UNICORN_JSON}
        sdkUrl={HERO_V3_UNICORN_SDK_URL}
        width="100%"
        height="100%"
        scale={renderQuality.scale}
        dpi={renderQuality.dpi}
        fps={renderQuality.fps}
        lazyLoad={false}
        paused={!renderActive}
        altText="Retro computer, monitor, and phone animation"
        ariaLabel="Retro computer, monitor, and phone animation"
        className="hero-v3__unicorn-scene"
        sceneRef={unicornSceneRef as unknown as RefObject<{ element: HTMLElement; destroy: () => void } | null>}
        onLoad={handleLoad}
      />

    </div>
  );
}

export default function HeroV3() {
  const prefersReduced = useReducedMotion();
  const introDone = useIntroDone();
  const [heroTextRevealed, setHeroTextRevealed] = useState(false);
  const [appearAnimationDone, setAppearAnimationDone] = useState(false);
  const [scrollHasStarted, setScrollHasStarted] = useState(false);
  const heroCopyDismissedRef = useRef(false);
  const scrollHasStartedRef = useRef(false);
  const staticZero = useMotionValue(0);
  const scrollRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(scrollRef);
  const renderActive = sectionInView && !prefersReduced;

  const storyStepBlocks = useMemo(
    () =>
      HOW_IT_WORKS_BLOCKS.map((block) => ({
        ...block,
        progress: remapHeroV3StepProgress(block.progress),
      })),
    [],
  );

  const handleUnicornAppearStart = useCallback(() => {
    setHeroTextRevealed(true);
  }, []);

  useEffect(() => {
    if (!heroTextRevealed || prefersReduced) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setAppearAnimationDone(true);
    }, HERO_V3_MODEL_APPEAR_MS);

    return () => window.clearTimeout(timer);
  }, [heroTextRevealed, prefersReduced]);

  const showHeroText = prefersReduced || heroTextRevealed;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value >= HERO_V3_TEXT_FADE_OUT.start) {
      scrollHasStartedRef.current = true;
      setScrollHasStarted(true);
    }
    if (scrollHasStartedRef.current && value >= HERO_V3_TEXT_FADE_OUT.end) {
      heroCopyDismissedRef.current = true;
    }
  });

  const scrollCopyOpacity = useTransform(scrollYProgress, (progress) => {
    if (heroCopyDismissedRef.current) {
      return 0;
    }

    if (progress <= HERO_V3_TEXT_FADE_OUT.start) {
      return 1;
    }

    if (progress >= HERO_V3_TEXT_FADE_OUT.end) {
      return 0;
    }

    const span = HERO_V3_TEXT_FADE_OUT.end - HERO_V3_TEXT_FADE_OUT.start;
    return 1 - (progress - HERO_V3_TEXT_FADE_OUT.start) / span;
  });

  const scrollCopyY = useTransform(scrollYProgress, (progress) => {
    if (heroCopyDismissedRef.current || progress >= HERO_V3_TEXT_FADE_OUT.end) {
      return 28;
    }

    if (progress <= HERO_V3_TEXT_FADE_OUT.start) {
      return 0;
    }

    const span = HERO_V3_TEXT_FADE_OUT.end - HERO_V3_TEXT_FADE_OUT.start;
    return (28 * (progress - HERO_V3_TEXT_FADE_OUT.start)) / span;
  });

  const heroCopyVisibility = useTransform(scrollCopyOpacity, (opacity) =>
    opacity <= 0 ? "hidden" : "visible",
  );
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scrollCopyActive = appearAnimationDone && scrollHasStarted;
  const act3HeadingOpacity = useTransform(
    scrollYProgress,
    [
      HERO_V3_ACT3_SCROLL.start,
      HERO_V3_ACT3_SCROLL.fadeInEnd,
      HERO_V3_ACT3_SCROLL.fadeOutStart,
      HERO_V3_ACT3_SCROLL.end,
    ],
    [0, 1, 1, 0],
  );
  const act3HeadingY = useTransform(
    scrollYProgress,
    [HERO_V3_ACT3_SCROLL.start, HERO_V3_ACT3_SCROLL.fadeInEnd],
    [20, 0],
  );

  return (
    <section
      ref={scrollRef}
      id="home-hero"
      style={{ height: prefersReduced ? undefined : `${HERO_V3_SCROLL_HEIGHT_VH}vh` }}
      className="relative isolate"
      aria-label="Hero"
    >
      <div
        className={
          prefersReduced
            ? "relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pt-32 pb-20 sm:px-10 lg:px-16 2xl:px-24"
            : "home-story-sticky sticky top-0 h-screen w-full overflow-hidden"
        }
      >
        {!prefersReduced ? (
          <>
            <div className="home-story-atmosphere pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
            <div className="home-story-glow pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
            <div className="home-story-noise pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
          </>
        ) : null}

        {!prefersReduced && introDone ? (
          <div className="hero-v3__unicorn" aria-hidden="true">
            <HeroV3UnicornScene
              scrollYProgress={scrollYProgress}
              renderActive={renderActive && introDone}
              onAppearStart={handleUnicornAppearStart}
            />
          </div>
        ) : null}

        {!prefersReduced ? (
          <div className="hero-v3__scrim pointer-events-none absolute inset-x-0 bottom-0 z-4 h-[72%]" aria-hidden="true" />
        ) : null}

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 28 }}
          animate={
            scrollCopyActive || prefersReduced
              ? undefined
              : showHeroText || appearAnimationDone
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 28 }
          }
          style={
            scrollCopyActive && !prefersReduced
              ? {
                  opacity: scrollCopyOpacity,
                  y: scrollCopyY,
                  visibility: heroCopyVisibility,
                }
              : undefined
          }
          transition={
            prefersReduced
              ? undefined
              : {
                  duration: HERO_V3_MODEL_APPEAR_MS / 1000,
                  ease: [0.445, 0.05, 0.55, 0.95],
                }
          }
          className="hero-v3__copy home-story-copy relative z-10 mx-auto flex h-full w-full max-w-450 flex-col justify-end px-6 pt-32 pb-2 sm:px-10 sm:pb-6 lg:justify-center lg:px-16 lg:pb-0 2xl:px-24"
        >
          <div className="min-w-0 max-w-2xl lg:max-w-3xl">
            <p className="hero-v3__kicker mb-6 sm:mb-7">{HERO_KICKER}</p>

            <h1 className="hero-v3__title" aria-label={HERO_TITLE}>
              {HERO_TITLE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="hero-v3__body mt-7 max-w-lg text-base leading-relaxed text-white/65 sm:mt-8 sm:text-lg">
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

            <p className="hero-v3__meta mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100/50 sm:text-xs">
              {HERO_META.join(" · ")}
            </p>
          </div>
        </motion.div>

        {!prefersReduced ? (
          <motion.div
            style={{ opacity: scrollCueOpacity }}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
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
        ) : null}

        {!prefersReduced ? (
          <motion.h2
            style={{ opacity: act3HeadingOpacity, y: act3HeadingY }}
            className="home-story-act3-heading pointer-events-none absolute inset-x-0 bottom-[clamp(5.5rem,14vh,8.5rem)] z-10 mx-auto max-w-3xl px-6 text-center font-display text-[clamp(1.35rem,3.8vw,2.5rem)] font-bold leading-[1.08] tracking-tight text-white sm:px-10 lg:px-16"
          >
            {HERO_V3_ACT3_HEADING}
          </motion.h2>
        ) : null}

        {prefersReduced ? (
          <div
            id="how-it-works"
            className="pointer-events-none relative z-10 mt-12 flex flex-col gap-6 px-6 py-8 lg:px-16"
          >
            {storyStepBlocks.map((block) => (
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
          <div id="how-it-works" className="pointer-events-none absolute inset-0 z-20">
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
