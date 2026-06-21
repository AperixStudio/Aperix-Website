"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { useSearchParams } from "next/navigation";
import HeroCanvas from "@/components/animations/HeroCanvas";
import type { HeroCaptureApi, HeroCaptureState } from "@/lib/dev/heroCapture/api";
import { waitForFrameSettle } from "@/lib/dev/heroCapture/api";
import {
  mapPlaygroundScrub,
  type StoryPlaygroundAct,
} from "@/lib/dev/storyPlaygroundProgress";
import {
  HERO_VIDEO_OFFSCREEN_CLASS,
  HERO_VIDEO_SRC,
} from "@/lib/heroVideo";
import { resolveHeroCanvasConfig } from "@/lib/resolveHeroCanvasConfig";
import { onSceneReady } from "@/lib/storyBus";
import "@/components/animations/HeroCanvas.css";
import "./capture.css";

function parseAct(value: string | null): StoryPlaygroundAct {
  if (value === "2") {
    return 2;
  }
  if (value === "3") {
    return 3;
  }
  return 1;
}

export default function HeroCaptureClient() {
  const searchParams = useSearchParams();
  const initialAct = parseAct(searchParams.get("act"));
  const initialMobile = searchParams.get("mobile") === "1";
  const initialScrub = Number(searchParams.get("scrub") ?? "0");

  const [act, setAct] = useState<StoryPlaygroundAct>(initialAct === 3 ? 2 : initialAct);
  const [mobile, setMobile] = useState(initialMobile);
  const [scrub, setScrub] = useState(
    Number.isFinite(initialScrub) ? Math.min(1, Math.max(0, initialScrub)) : 0,
  );
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneError, setSceneError] = useState<string | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(Boolean(HERO_VIDEO_SRC));

  const actRef = useRef(act);
  const scrubRef = useRef(scrub);
  const mobileRef = useRef(mobile);
  const frameRef = useRef(0);

  const heroProgress = useMotionValue(0);
  const modelProgress = useMotionValue(0);
  const act2Slide = useMotionValue(0);
  const screenEvolution = useMotionValue(0);

  actRef.current = act;
  scrubRef.current = scrub;
  mobileRef.current = mobile;

  const applyMappedProgress = useCallback(
    (nextAct: StoryPlaygroundAct, nextScrub: number) => {
      const mapped = mapPlaygroundScrub(nextAct, nextScrub);
      heroProgress.set(mapped.heroProgress);
      modelProgress.set(mapped.modelProgress);
      act2Slide.set(mapped.act2Slide ?? 0);
      screenEvolution.set(mapped.screenEvolution);
    },
    [heroProgress, modelProgress, act2Slide, screenEvolution],
  );

  useEffect(() => {
    applyMappedProgress(act, scrub);
  }, [act, scrub, applyMappedProgress]);

  useEffect(() => {
    const unsubscribe = onSceneReady(() => {
      setSceneReady(true);
    });
    return unsubscribe;
  }, []);

  const handleSceneStatus = useCallback((message: string | null) => {
    if (!message) {
      setSceneReady(true);
      setSceneError(null);
      return;
    }
    if (message !== "Loading model…") {
      setSceneError(message);
    }
  }, []);

  useEffect(() => {
    if (!videoElement || !videoEnabled) {
      return undefined;
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

  useEffect(() => {
    const getState = (): HeroCaptureState => ({
      ready: sceneReady && !sceneError,
      act: actRef.current,
      scrub: scrubRef.current,
      mobile: mobileRef.current,
      frame: frameRef.current,
      error: sceneError,
    });

    const api: HeroCaptureApi = {
      getState,
      waitForFrameSettle,
      waitForReady: async (timeoutMs = 120_000) => {
        const start = performance.now();
        while (!getState().ready) {
          if (getState().error) {
            throw new Error(getState().error ?? "Hero capture scene failed");
          }
          if (performance.now() - start > timeoutMs) {
            throw new Error("Hero capture scene did not become ready in time");
          }
          await waitForFrameSettle(1);
        }
      },
      setProgress: async (input) => {
        if (input.act != null) {
          const nextAct = input.act === 3 ? 2 : input.act;
          setAct(nextAct);
          actRef.current = nextAct;
        }
        if (input.mobile != null) {
          setMobile(input.mobile);
          mobileRef.current = input.mobile;
        }
        if (input.scrub != null) {
          const nextScrub = Math.min(1, Math.max(0, input.scrub));
          setScrub(nextScrub);
          scrubRef.current = nextScrub;
        }

        applyMappedProgress(actRef.current, scrubRef.current);
        frameRef.current += 1;
        await waitForFrameSettle(3);
      },
    };

    window.__HERO_CAPTURE__ = api;
    return () => {
      delete window.__HERO_CAPTURE__;
    };
  }, [applyMappedProgress, sceneReady, sceneError]);

  const liveConfig = mobile ? resolveHeroCanvasConfig(true) : undefined;
  const captureAct = act === 3 ? 2 : act;

  return (
    <div
      className={
        mobile
          ? "hero-capture-host hero-capture-host--mobile"
          : "hero-capture-host"
      }
      data-hero-capture-ready={sceneReady ? "true" : "false"}
      data-hero-capture-act={captureAct}
      data-hero-capture-scrub={scrub.toFixed(4)}
    >
      {videoEnabled && HERO_VIDEO_SRC ? (
        <video
          ref={setVideoElement}
          className={HERO_VIDEO_OFFSCREEN_CLASS}
          src={HERO_VIDEO_SRC}
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoEnabled(false)}
        />
      ) : null}

      <HeroCanvas
        scrollProgress={heroProgress}
        modelProgress={captureAct === 2 ? modelProgress : null}
        act2SlideProgress={captureAct === 2 ? act2Slide : null}
        screenEvolutionProgress={captureAct === 2 ? screenEvolution : null}
        liveConfig={liveConfig}
        videoElement={videoElement}
        showIntroLabel={captureAct === 1}
        simulateMobileViewport={mobile}
        onSceneStatusChange={handleSceneStatus}
        className="hero-canvas--scroll h-full min-h-0"
      />

      {!sceneReady ? (
        <div className="hero-capture-status">Loading hero scene…</div>
      ) : null}
      {sceneError ? (
        <div className="hero-capture-status hero-capture-status--error">{sceneError}</div>
      ) : null}
    </div>
  );
}
