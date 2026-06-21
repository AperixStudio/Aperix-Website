"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import { createPcStoryScene } from "@/lib/experience/scenes/pcStoryScene";
import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import "./HeroCanvas.css";

function resolveConfig(liveConfig) {
  if (!liveConfig) {
    return DEFAULT_HERO_CANVAS_CONFIG;
  }
  return { ...DEFAULT_HERO_CANVAS_CONFIG, ...liveConfig };
}

/**
 * @param {{
 *   scrollProgress: import("framer-motion").MotionValue<number>,
 *   modelProgress?: import("framer-motion").MotionValue<number> | null,
 *   act2SlideProgress?: import("framer-motion").MotionValue<number> | null,
 *   screenEvolutionProgress?: import("framer-motion").MotionValue<number> | null,
 *   liveConfig?: Record<string, unknown> | null,
 *   getTheatreRig?: () => import("@/lib/dev/heroTheatre/types").HeroTheatreRig | null,
 *   videoElement?: HTMLVideoElement | null,
 *   showIntroLabel?: boolean,
 *   className?: string,
 *   renderActive?: boolean,
 *   simulateMobileViewport?: boolean,
 *   onSceneStatusChange?: (message: string | null) => void,
 * }} props
 */
export default function HeroCanvas({
  scrollProgress,
  modelProgress = null,
  act2SlideProgress = null,
  screenEvolutionProgress = null,
  liveConfig,
  getTheatreRig = null,
  videoElement = null,
  showIntroLabel = false,
  className = "",
  renderActive = true,
  simulateMobileViewport = false,
  onSceneStatusChange = null,
}) {
  const containerRef = useRef(null);
  const progressRef = useRef(scrollProgress?.get() ?? 0);
  const modelProgressRef = useRef(scrollProgress?.get() ?? 0);
  const act2SlideRef = useRef(null);
  const evolutionProgressRef = useRef(0);
  const fallbackEvolutionProgress = useMotionValue(0);
  const videoRef = useRef(videoElement);
  const theatreRigRef = useRef(getTheatreRig);
  const tryAttachVideoRef = useRef(() => {});
  const latestConfigRef = useRef(resolveConfig(liveConfig));
  const scrollProgressRef = useRef(scrollProgress);
  const screenEvolutionProgressRef = useRef(screenEvolutionProgress);
  const isDevPlaygroundRef = useRef(liveConfig != null);
  const renderActiveRef = useRef(renderActive);
  const showIntroLabelRef = useRef(showIntroLabel);
  const simulateMobileViewportRef = useRef(simulateMobileViewport);
  const onSceneStatusChangeRef = useRef(onSceneStatusChange);
  const [status, setStatus] = useState("Loading model…");

  const handleStatusChange = (message) => {
    setStatus(message);
    onSceneStatusChangeRef.current?.(message);
  };

  latestConfigRef.current = resolveConfig(liveConfig);
  scrollProgressRef.current = scrollProgress;
  screenEvolutionProgressRef.current = screenEvolutionProgress;
  isDevPlaygroundRef.current = liveConfig != null;
  renderActiveRef.current = renderActive;
  showIntroLabelRef.current = showIntroLabel;
  simulateMobileViewportRef.current = simulateMobileViewport;
  onSceneStatusChangeRef.current = onSceneStatusChange;
  videoRef.current = videoElement;

  useMotionValueEvent(scrollProgress, "change", (value) => {
    progressRef.current = value;
  });

  const modelProgressSource = modelProgress ?? scrollProgress;

  useMotionValueEvent(modelProgressSource, "change", (value) => {
    modelProgressRef.current = value;
  });

  useEffect(() => {
    if (!act2SlideProgress) {
      act2SlideRef.current = null;
      return undefined;
    }

    const syncSlide = (value) => {
      act2SlideRef.current = value;
    };

    syncSlide(act2SlideProgress.get());
    return act2SlideProgress.on("change", syncSlide);
  }, [act2SlideProgress]);

  const evolutionSource = screenEvolutionProgress ?? fallbackEvolutionProgress;

  useMotionValueEvent(evolutionSource, "change", (value) => {
    if (screenEvolutionProgress) {
      evolutionProgressRef.current = value;
    }
  });

  useEffect(() => {
    progressRef.current = scrollProgress.get();
    modelProgressRef.current = modelProgressSource.get();
    act2SlideRef.current = act2SlideProgress?.get() ?? null;
    if (screenEvolutionProgress) {
      evolutionProgressRef.current = screenEvolutionProgress.get();
    } else {
      evolutionProgressRef.current = 0;
    }
  }, [scrollProgress, modelProgressSource, act2SlideProgress, screenEvolutionProgress]);

  theatreRigRef.current = getTheatreRig;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const scene = createPcStoryScene({
      container,
      getScrollProgress: () => progressRef.current,
      getModelProgress: () => modelProgressRef.current,
      getAct2SlideProgress: () => act2SlideRef.current,
      getScreenEvolutionProgress: () => evolutionProgressRef.current,
      getLiveConfig: () => latestConfigRef.current,
      getTheatreRig: () => (theatreRigRef.current ? theatreRigRef.current() : null),
      getVideoElement: () => videoRef.current,
      getShowIntroLabel: () => showIntroLabelRef.current,
      getIsDevPlayground: () => isDevPlaygroundRef.current,
      getSimulateMobileViewport: () => simulateMobileViewportRef.current,
      getRenderActive: () => renderActiveRef.current,
      onStatusChange: handleStatusChange,
    });

    tryAttachVideoRef.current = scene.tryAttachVideo;

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      scene.resize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      tryAttachVideoRef.current = () => {};
      resizeObserver.disconnect();
      scene.dispose();
    };
  }, [showIntroLabel]);

  useEffect(() => {
    const video = videoElement;
    if (!video) {
      return undefined;
    }

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const onReady = () => {
      tryAttachVideoRef.current();
      void video.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    if (video.readyState >= 2) {
      onReady();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [videoElement]);

  return (
    <div className={`hero-canvas ${className}`.trim()} ref={containerRef}>
      {status ? (
        <div className="hero-canvas__overlay hero-canvas__overlay--error">{status}</div>
      ) : null}
    </div>
  );
}
