"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import {
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import UnicornScene from "unicornstudio-react/next";
import { useIntroDone } from "@/lib/useIntroDone";
import { useMobileViewport } from "@/lib/useMobileViewport";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./HeroV4.css";

const HERO_V4_SCROLL_HEIGHT_VH = 280;
const HERO_V4_UNICORN_JSON = "/unicorn/untitled_project_scene.json";
const HERO_V4_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";
const HERO_V4_RENDER = {
  desktop: { scale: 1, dpi: 1.5, fps: 60 as const },
  mobile: { scale: 1, dpi: 1.25, fps: 60 as const },
} as const;
const HERO_V4_APPEAR_DURATION_MS = 1100;
const HERO_V4_SCROLL_ENGAGE_THRESHOLD = 0.008;
const HERO_V4_MODEL_REST_POS = { x: 0.5, y: 0.83, z: 0 } as const;
const HERO_V4_MODEL_REST_ROTATION = {
  x: 0.5,
  y: 0.8666666666666667,
  z: 0.5,
} as const;

type UnicornVec3 = {
  _x?: number;
  _y?: number;
  _z?: number;
  x?: number;
  y?: number;
  z?: number;
};

type HeroV4UnicornLayer = {
  isModel?: boolean;
  opacity?: number;
  pos?: UnicornVec3;
  modelRotation?: UnicornVec3;
  local?: { stateEffectProps?: Record<string, unknown> };
  data?: {
    uniforms?: {
      opacity?: { value?: number };
    };
  };
  states?: {
    scroll?: Array<{
      prop: string;
      lastTick?: number;
      progress?: number;
      _velocity?: number;
    }>;
  };
};

type HeroV4UnicornSceneInstance = {
  destroy?: () => void;
  element?: HTMLElement;
  isFixed?: boolean;
  layers?: HeroV4UnicornLayer[];
  resize?: () => void;
};

type UnicornScrollApi = {
  scenes?: HeroV4UnicornSceneInstance[];
  setScroll?: (scrollY: number) => void;
  useNativeScroll?: () => void;
};

function getUnicornScrollApi(): UnicornScrollApi | undefined {
  return window.UnicornStudio as unknown as UnicornScrollApi | undefined;
}

function readSceneMetrics() {
  const viewportHeight = window.innerHeight;
  const scene = document.querySelector<HTMLElement>(".hero-v4__unicorn-scene");
  const sceneHalfHeight = scene
    ? scene.getBoundingClientRect().height / 2
    : viewportHeight / 2;
  return { viewportHeight, sceneHalfHeight };
}

function mapScrollY(progress: number, viewportHeight: number, sceneHalfHeight: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  const startY = -viewportHeight;
  const endY = sceneHalfHeight;
  return startY + clamped * (endY - startY);
}

function applyHeroScrollStart() {
  const { viewportHeight, sceneHalfHeight } = readSceneMetrics();
  getUnicornScrollApi()?.setScroll?.(mapScrollY(0, viewportHeight, sceneHalfHeight));
}

function resolveHeroV4Scene(
  sceneRef: HeroV4UnicornSceneInstance | null,
): HeroV4UnicornSceneInstance | null {
  if (sceneRef?.layers?.length) {
    return sceneRef;
  }

  const root = document.querySelector<HTMLElement>(".hero-v4__unicorn-scene");
  if (!root) {
    return sceneRef;
  }

  const scenes = getUnicornScrollApi()?.scenes ?? [];
  return (
    scenes.find((scene) => {
      const element = scene.element;
      return element === root || Boolean(element && (element.contains(root) || root.contains(element)));
    }) ?? sceneRef
  );
}

function requestHeroV4Resize(sceneRef: HeroV4UnicornSceneInstance | null) {
  resolveHeroV4Scene(sceneRef)?.resize?.();
}

function writeVec3(vec: UnicornVec3 | undefined, value: { x: number; y: number; z: number }) {
  if (!vec) {
    return;
  }

  vec._x = value.x;
  vec._y = value.y;
  vec._z = value.z;
  vec.x = value.x;
  vec.y = value.y;
  vec.z = value.z;
}

function commitHeroV4ModelRestPose(sceneRef: HeroV4UnicornSceneInstance | null) {
  const scene = resolveHeroV4Scene(sceneRef);
  const model = scene?.layers?.find((layer) => layer.isModel);
  if (!model) {
    return;
  }

  writeVec3(model.pos, HERO_V4_MODEL_REST_POS);
  writeVec3(model.modelRotation, HERO_V4_MODEL_REST_ROTATION);
  model.opacity = 1;
  if (model.data?.uniforms?.opacity) {
    model.data.uniforms.opacity.value = 1;
  }

  if (model.local?.stateEffectProps) {
    delete model.local.stateEffectProps.pos;
    delete model.local.stateEffectProps.modelRotation;
  }

  for (const state of model.states?.scroll ?? []) {
    if (state.prop === "pos" || state.prop === "modelRotation") {
      state.lastTick = undefined;
      state.progress = 0;
      state._velocity = 0;
    }
  }
}

function holdHeroV4ScrollOnly(sceneRef: HeroV4UnicornSceneInstance | null) {
  const scene = resolveHeroV4Scene(sceneRef);
  if (scene) {
    scene.isFixed = true;
  }
  applyHeroScrollStart();
}

export default function HeroV4() {
  const { isMobile, ready } = useMobileViewport();
  const introDone = useIntroDone();
  const prefersReduced = useReducedMotion();
  const sceneRef = useRef<HeroV4UnicornSceneInstance | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneReadyRef = useRef(false);
  const scrollEngagedRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const appearCompleteRef = useRef(false);
  const appearTimerRef = useRef<number | null>(null);
  const scrollHoldFrameRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const applyHeroScroll = useCallback((progress: number) => {
    try {
      const { viewportHeight, sceneHalfHeight } = readSceneMetrics();
      getUnicornScrollApi()?.setScroll?.(mapScrollY(progress, viewportHeight, sceneHalfHeight));
    } catch {
      // Unicorn SDK not yet available
    }
  }, []);

  const holdScrollAtStart = useCallback(() => {
    holdHeroV4ScrollOnly(sceneRef.current);

    if (appearCompleteRef.current) {
      commitHeroV4ModelRestPose(sceneRef.current);
    }
  }, []);

  const syncHeroScroll = useCallback(
    (progress: number) => {
      if (progress < HERO_V4_SCROLL_ENGAGE_THRESHOLD) {
        holdScrollAtStart();
        return;
      }

      scrollEngagedRef.current = true;
      applyHeroScroll(progress);
    },
    [applyHeroScroll, holdScrollAtStart],
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

      if (scrollProgressRef.current >= HERO_V4_SCROLL_ENGAGE_THRESHOLD) {
        scrollEngagedRef.current = true;
        applyHeroScroll(scrollProgressRef.current);
        scrollHoldFrameRef.current = null;
        return;
      }

      holdScrollAtStart();
      scrollHoldFrameRef.current = window.requestAnimationFrame(tick);
    };

    scrollHoldFrameRef.current = window.requestAnimationFrame(tick);
  }, [applyHeroScroll, holdScrollAtStart]);

  useLayoutEffect(() => {
    holdScrollAtStart();
  }, [holdScrollAtStart]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollProgressRef.current = value;
    if (sceneReadyRef.current) {
      syncHeroScroll(value);
    }
  });

  useEffect(() => {
    scrollProgressRef.current = scrollYProgress.get();

    const container = document.querySelector<HTMLElement>(".hero-v4__unicorn-scene");
    const resizeObserver =
      container && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!sceneReadyRef.current) {
              return;
            }
            requestHeroV4Resize(sceneRef.current);
            syncHeroScroll(scrollYProgress.get());
          })
        : null;
    resizeObserver?.observe(container!);

    const onResize = () => {
      if (!sceneReadyRef.current) {
        return;
      }
      requestHeroV4Resize(sceneRef.current);
      syncHeroScroll(scrollYProgress.get());
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

  const handleLoad = useCallback(() => {
    sceneReadyRef.current = true;
    scrollEngagedRef.current = false;
    appearCompleteRef.current = false;
    scrollProgressRef.current = scrollYProgress.get();

    if (appearTimerRef.current !== null) {
      window.clearTimeout(appearTimerRef.current);
    }

    holdScrollAtStart();
    startScrollHoldLoop();
    requestHeroV4Resize(sceneRef.current);
    syncHeroScroll(scrollProgressRef.current);

    const relayout = () => {
      requestHeroV4Resize(sceneRef.current);
      syncHeroScroll(scrollYProgress.get());
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
    }, HERO_V4_APPEAR_DURATION_MS);
  }, [holdScrollAtStart, scrollYProgress, startScrollHoldLoop, syncHeroScroll]);

  const renderQuality = ready
    ? isMobile
      ? HERO_V4_RENDER.mobile
      : HERO_V4_RENDER.desktop
    : HERO_V4_RENDER.desktop;

  return (
    <section
      ref={sectionRef}
      id="home-hero"
      style={{ height: `${HERO_V4_SCROLL_HEIGHT_VH}vh` }}
      className="relative isolate"
      aria-label="Hero"
    >
      <div className="hero-v4">
        {ready && !prefersReduced && introDone ? (
          <UnicornScene
            jsonFilePath={HERO_V4_UNICORN_JSON}
            sdkUrl={HERO_V4_SDK_URL}
            width="100%"
            height="100%"
            scale={renderQuality.scale}
            dpi={renderQuality.dpi}
            fps={renderQuality.fps}
            lazyLoad
            altText="3D animation scene"
            ariaLabel="3D animation scene"
            className="hero-v4__unicorn-scene"
            sceneRef={sceneRef as unknown as RefObject<{ element: HTMLElement; destroy: () => void } | null>}
            onLoad={handleLoad}
          />
        ) : null}
      </div>
    </section>
  );
}
