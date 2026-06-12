"use client";

import { useEffect, useRef, useState } from "react";
import {
  MotionValue,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Leva, button, useControls } from "leva";
import HeroCanvas from "@/components/animations/HeroCanvas";
import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import {
  HERO_VIDEO_OFFSCREEN_CLASS,
  HERO_VIDEO_SRC,
} from "@/lib/heroVideo";
import { degToRad, radToDeg } from "@/lib/threeAnimation";
import "@/components/animations/HeroCanvas.css";

const D = DEFAULT_HERO_CANVAS_CONFIG;

function mapLevaToConfig(values: {
  modelStartX: number;
  modelStartY: number;
  modelStartZ: number;
  endX: number;
  endY: number;
  endZ: number;
  rotationYDeg: number;
  screenFillMargin: number;
  cameraStartBackoff: number;
  cameraStartAzimuthDeg: number;
  cameraStartElevationDeg: number;
  cameraStartZRatio: number;
  cameraTargetYRatio: number;
  cameraOrbitPivotYRatio: number;
  cameraDistanceX: number;
  cameraDistanceY: number;
  cameraDistanceZ: number;
  screenPlaneOffsetStart: number;
  screenPlaneOffsetEnd: number;
  screenPlaneLocalStartX: number;
  screenPlaneLocalStartY: number;
  screenPlaneLocalEndX: number;
  screenPlaneLocalEndY: number;
  screenPlaneScaleWidthStart: number;
  screenPlaneScaleWidthEnd: number;
  screenPlaneScaleHeightStart: number;
  screenPlaneScaleHeightEnd: number;
  screenPlaneRotStartXDeg: number;
  screenPlaneRotStartYDeg: number;
  screenPlaneRotStartZDeg: number;
  screenPlaneRotEndXDeg: number;
  screenPlaneRotEndYDeg: number;
  screenPlaneRotEndZDeg: number;
  screenPlanePolygonOffset: number;
  introLabelGapStart: number;
  introLabelGapEnd: number;
  introLabelOffsetStartX: number;
  introLabelOffsetStartY: number;
  introLabelOffsetStartZ: number;
  introLabelOffsetEndX: number;
  introLabelOffsetEndY: number;
  introLabelOffsetEndZ: number;
  introLabelOffsetNormalStart: number;
  introLabelOffsetNormalEnd: number;
  introLabelWidthRatio: number;
  introLabelHeightRatio: number;
  introLabelTextFill: string;
  introLabelRotStartXDeg: number;
  introLabelRotStartYDeg: number;
  introLabelRotStartZDeg: number;
  introLabelRotEndXDeg: number;
  introLabelRotEndYDeg: number;
  introLabelRotEndZDeg: number;
}) {
  return {
    ...DEFAULT_HERO_CANVAS_CONFIG,
    modelOffsetStartX: values.modelStartX,
    modelOffsetStartY: values.modelStartY,
    modelOffsetStartZ: values.modelStartZ,
    modelOffsetEndX: values.endX,
    modelOffsetEndY: values.endY,
    modelOffsetEndZ: values.endZ,
    modelRotationY: degToRad(values.rotationYDeg),
    screenFillMargin: values.screenFillMargin,
    cameraStartBackoff: values.cameraStartBackoff,
    cameraStartAzimuth: degToRad(values.cameraStartAzimuthDeg),
    cameraStartElevation: degToRad(values.cameraStartElevationDeg),
    cameraStartZRatio: values.cameraStartZRatio,
    cameraTargetYRatio: values.cameraTargetYRatio,
    cameraOrbitPivotYRatio: values.cameraOrbitPivotYRatio,
    cameraDistanceX: values.cameraDistanceX,
    cameraDistanceY: values.cameraDistanceY,
    cameraDistanceZ: values.cameraDistanceZ,
    screenPlaneOffsetStart: values.screenPlaneOffsetStart,
    screenPlaneOffsetEnd: values.screenPlaneOffsetEnd,
    screenPlaneLocalStartX: values.screenPlaneLocalStartX,
    screenPlaneLocalStartY: values.screenPlaneLocalStartY,
    screenPlaneLocalEndX: values.screenPlaneLocalEndX,
    screenPlaneLocalEndY: values.screenPlaneLocalEndY,
    screenPlaneScaleWidthStart: values.screenPlaneScaleWidthStart,
    screenPlaneScaleWidthEnd: values.screenPlaneScaleWidthEnd,
    screenPlaneScaleHeightStart: values.screenPlaneScaleHeightStart,
    screenPlaneScaleHeightEnd: values.screenPlaneScaleHeightEnd,
    screenPlaneRotationStartX: degToRad(values.screenPlaneRotStartXDeg),
    screenPlaneRotationStartY: degToRad(values.screenPlaneRotStartYDeg),
    screenPlaneRotationStartZ: degToRad(values.screenPlaneRotStartZDeg),
    screenPlaneRotationEndX: degToRad(values.screenPlaneRotEndXDeg),
    screenPlaneRotationEndY: degToRad(values.screenPlaneRotEndYDeg),
    screenPlaneRotationEndZ: degToRad(values.screenPlaneRotEndZDeg),
    screenPlanePolygonOffset: values.screenPlanePolygonOffset,
    introLabelGapStart: values.introLabelGapStart,
    introLabelGapEnd: values.introLabelGapEnd,
    introLabelOffsetStartX: values.introLabelOffsetStartX,
    introLabelOffsetStartY: values.introLabelOffsetStartY,
    introLabelOffsetStartZ: values.introLabelOffsetStartZ,
    introLabelOffsetEndX: values.introLabelOffsetEndX,
    introLabelOffsetEndY: values.introLabelOffsetEndY,
    introLabelOffsetEndZ: values.introLabelOffsetEndZ,
    introLabelOffsetNormalStart: values.introLabelOffsetNormalStart,
    introLabelOffsetNormalEnd: values.introLabelOffsetNormalEnd,
    introLabelWidthRatio: values.introLabelWidthRatio,
    introLabelHeightRatio: values.introLabelHeightRatio,
    introLabelTextFill: values.introLabelTextFill,
    introLabelRotationStartX: degToRad(values.introLabelRotStartXDeg),
    introLabelRotationStartY: degToRad(values.introLabelRotStartYDeg),
    introLabelRotationStartZ: degToRad(values.introLabelRotStartZDeg),
    introLabelRotationEndX: degToRad(values.introLabelRotEndXDeg),
    introLabelRotationEndY: degToRad(values.introLabelRotEndYDeg),
    introLabelRotationEndZ: degToRad(values.introLabelRotEndZDeg),
  };
}

function HeroScenePanel({
  progress,
  liveConfig,
  videoElement,
  className,
}: {
  progress: MotionValue<number>;
  liveConfig: ReturnType<typeof mapLevaToConfig>;
  videoElement: HTMLVideoElement | null;
  className?: string;
}) {
  return (
    <HeroCanvas
      scrollProgress={progress}
      liveConfig={liveConfig}
      videoElement={videoElement}
      showIntroLabel
      className={className}
    />
  );
}

function StickyScrollScene({
  liveConfig,
  videoElement,
}: {
  liveConfig: ReturnType<typeof mapLevaToConfig>;
  videoElement: HTMLVideoElement | null;
}) {
  const progress = useMotionValue(0);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"],
  });
  const scrollMappedProgress = useTransform(scrollYProgress, [0, 0.78], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollMappedProgress.on("change", (value) => {
      progress.set(value);
    });
    return unsubscribe;
  }, [progress, scrollMappedProgress]);

  return (
    <div ref={scrollTrackRef} className="hero-canvas-playground-scroll pt-24">
      <div className="hero-canvas-playground-sticky">
        <HeroScenePanel
          progress={progress}
          liveConfig={liveConfig}
          videoElement={videoElement}
          className="hero-canvas--scroll h-full min-h-0"
        />
      </div>
    </div>
  );
}

export default function PlaygroundClient() {
  const progress = useMotionValue(0);
  const [scrub, setScrub] = useState(0);
  const [stickyScroll, setStickyScroll] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(Boolean(HERO_VIDEO_SRC));

  const modelStart = useControls("Model start", {
    modelStartX: { value: D.modelOffsetStartX, min: -2, max: 2, step: 0.01, label: "x" },
    modelStartY: { value: D.modelOffsetStartY, min: -2, max: 2, step: 0.01, label: "y" },
    modelStartZ: { value: D.modelOffsetStartZ, min: -2, max: 2, step: 0.01, label: "z" },
  });

  const modelEnd = useControls("Model end", {
    endX: { value: D.modelOffsetEndX, min: -2, max: 2, step: 0.01, label: "x" },
    endY: { value: D.modelOffsetEndY, min: -2, max: 2, step: 0.01, label: "y" },
    endZ: { value: D.modelOffsetEndZ, min: -2, max: 2, step: 0.01, label: "z" },
    rotationYDeg: {
      value: radToDeg(D.modelRotationY),
      min: -180,
      max: 180,
      step: 1,
      label: "spin Y°",
    },
  });

  const cameraStart = useControls("Camera start", {
    screenFillMargin: { value: D.screenFillMargin, min: 0, max: 0.5, step: 0.01 },
    cameraStartBackoff: { value: D.cameraStartBackoff, min: 0.5, max: 4, step: 0.01 },
    cameraStartAzimuthDeg: {
      value: radToDeg(D.cameraStartAzimuth),
      min: -180,
      max: 180,
      step: 1,
      label: "azimuth°",
    },
    cameraStartElevationDeg: {
      value: radToDeg(D.cameraStartElevation),
      min: -89,
      max: 89,
      step: 1,
      label: "elevation°",
    },
    cameraStartZRatio: { value: D.cameraStartZRatio, min: 0.2, max: 2, step: 0.01 },
  });

  const cameraEnd = useControls("Camera end", {
    cameraTargetYRatio: { value: D.cameraTargetYRatio, min: 0, max: 1, step: 0.01 },
    cameraOrbitPivotYRatio: { value: D.cameraOrbitPivotYRatio, min: 0, max: 1, step: 0.01 },
    cameraDistanceX: { value: D.cameraDistanceX, min: -3, max: 3, step: 0.01 },
    cameraDistanceY: { value: D.cameraDistanceY, min: -3, max: 3, step: 0.01 },
    cameraDistanceZ: { value: D.cameraDistanceZ, min: 0.5, max: 6, step: 0.01 },
  });

  const screenStart = useControls("Screen start", {
    screenPlaneOffsetStart: {
      value: D.screenPlaneOffsetStart,
      min: -0.1,
      max: 0.1,
      step: 0.001,
      label: "push forward",
    },
    screenPlaneLocalStartX: {
      value: D.screenPlaneLocalStartX,
      min: -1,
      max: 1,
      step: 0.01,
      label: "slide X",
    },
    screenPlaneLocalStartY: {
      value: D.screenPlaneLocalStartY,
      min: -1,
      max: 1,
      step: 0.01,
      label: "slide Y",
    },
    screenPlaneScaleWidthStart: {
      value: D.screenPlaneScaleWidthStart,
      min: 0.05,
      max: 1.5,
      step: 0.01,
      label: "width",
    },
    screenPlaneScaleHeightStart: {
      value: D.screenPlaneScaleHeightStart,
      min: 0.05,
      max: 1.5,
      step: 0.01,
      label: "height",
    },
    screenPlanePolygonOffset: { value: D.screenPlanePolygonOffset, min: -10, max: 10, step: 1 },
  });

  const screenEnd = useControls("Screen end", {
    screenPlaneOffsetEnd: {
      value: D.screenPlaneOffsetEnd,
      min: -0.1,
      max: 0.1,
      step: 0.001,
      label: "push forward",
    },
    screenPlaneLocalEndX: {
      value: D.screenPlaneLocalEndX,
      min: -1,
      max: 1,
      step: 0.01,
      label: "slide X",
    },
    screenPlaneLocalEndY: {
      value: D.screenPlaneLocalEndY,
      min: -1,
      max: 1,
      step: 0.01,
      label: "slide Y",
    },
    screenPlaneScaleWidthEnd: {
      value: D.screenPlaneScaleWidthEnd,
      min: 0.05,
      max: 1.5,
      step: 0.01,
      label: "width",
    },
    screenPlaneScaleHeightEnd: {
      value: D.screenPlaneScaleHeightEnd,
      min: 0.05,
      max: 1.5,
      step: 0.01,
      label: "height",
    },
  });

  const screenRotStart = useControls("Screen rotation start", {
    screenPlaneRotStartXDeg: {
      value: radToDeg(D.screenPlaneRotationStartX),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt X°",
    },
    screenPlaneRotStartYDeg: {
      value: radToDeg(D.screenPlaneRotationStartY),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Y°",
    },
    screenPlaneRotStartZDeg: {
      value: radToDeg(D.screenPlaneRotationStartZ),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Z°",
    },
  });

  const screenRotEnd = useControls("Screen rotation end", {
    screenPlaneRotEndXDeg: {
      value: radToDeg(D.screenPlaneRotationEndX),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt X°",
    },
    screenPlaneRotEndYDeg: {
      value: radToDeg(D.screenPlaneRotationEndY),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Y°",
    },
    screenPlaneRotEndZDeg: {
      value: radToDeg(D.screenPlaneRotationEndZ),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Z°",
    },
  });

  const introLabelStart = useControls("Intro label start", {
    introLabelGapStart: { value: D.introLabelGapStart, min: -1, max: 1, step: 0.01, label: "gap" },
    introLabelOffsetStartX: { value: D.introLabelOffsetStartX, min: -2, max: 2, step: 0.01, label: "offset X" },
    introLabelOffsetStartY: { value: D.introLabelOffsetStartY, min: -2, max: 2, step: 0.01, label: "offset Y" },
    introLabelOffsetStartZ: { value: D.introLabelOffsetStartZ, min: -2, max: 2, step: 0.01, label: "offset Z" },
    introLabelOffsetNormalStart: {
      value: D.introLabelOffsetNormalStart,
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: "offset normal",
    },
  });

  const introLabelEnd = useControls("Intro label end", {
    introLabelGapEnd: { value: D.introLabelGapEnd, min: -1, max: 1, step: 0.01, label: "gap" },
    introLabelOffsetEndX: { value: D.introLabelOffsetEndX, min: -2, max: 2, step: 0.01, label: "offset X" },
    introLabelOffsetEndY: { value: D.introLabelOffsetEndY, min: -2, max: 2, step: 0.01, label: "offset Y" },
    introLabelOffsetEndZ: { value: D.introLabelOffsetEndZ, min: -2, max: 2, step: 0.01, label: "offset Z" },
    introLabelOffsetNormalEnd: {
      value: D.introLabelOffsetNormalEnd,
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: "offset normal",
    },
  });

  const introLabel = useControls("Intro label size", {
    introLabelWidthRatio: { value: D.introLabelWidthRatio, min: 0.2, max: 1.5, step: 0.01 },
    introLabelHeightRatio: { value: D.introLabelHeightRatio, min: 0.05, max: 1, step: 0.01 },
    introLabelTextFill: { value: D.introLabelTextFill },
  });

  const introLabelRotStart = useControls("Intro label rotation start", {
    introLabelRotStartXDeg: {
      value: radToDeg(D.introLabelRotationStartX),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt X°",
    },
    introLabelRotStartYDeg: {
      value: radToDeg(D.introLabelRotationStartY),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Y°",
    },
    introLabelRotStartZDeg: {
      value: radToDeg(D.introLabelRotationStartZ),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Z°",
    },
  });

  const introLabelRotEnd = useControls("Intro label rotation end", {
    introLabelRotEndXDeg: {
      value: radToDeg(D.introLabelRotationEndX),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt X°",
    },
    introLabelRotEndYDeg: {
      value: radToDeg(D.introLabelRotationEndY),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Y°",
    },
    introLabelRotEndZDeg: {
      value: radToDeg(D.introLabelRotationEndZ),
      min: -180,
      max: 180,
      step: 1,
      label: "tilt Z°",
    },
  });

  useControls("Playground", {
    stickyScroll: {
      value: false,
      label: "Sticky scroll mode",
      onChange: (value: boolean) => setStickyScroll(value),
    },
  });

  const liveConfig = mapLevaToConfig({
    ...modelStart,
    ...modelEnd,
    ...cameraStart,
    ...cameraEnd,
    ...screenStart,
    ...screenEnd,
    ...screenRotStart,
    ...screenRotEnd,
    ...introLabelStart,
    ...introLabelEnd,
    ...introLabel,
    ...introLabelRotStart,
    ...introLabelRotEnd,
  });

  const liveConfigForExport = useRef(liveConfig);
  liveConfigForExport.current = liveConfig;

  useControls("Export", {
    "Copy config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("HeroCanvas config copied:\n", text);
    }),
    "Reset page": button(() => window.location.reload()),
  });

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

  useEffect(() => {
    if (stickyScroll) {
      return;
    }
    progress.set(scrub);
  }, [progress, scrub, stickyScroll]);

  return (
    <div className="min-h-screen">
      <Leva collapsed={false} titleBar={{ title: "HeroCanvas" }} />

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

      <div className="fixed inset-x-0 top-0 z-50 border-b border-agency-border/40 bg-agency-glass-bg/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            {stickyScroll
              ? "Sticky scroll active — scroll the page"
              : `Scroll progress ${(scrub * 100).toFixed(1)}%`}
          </label>
          {!stickyScroll ? (
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={scrub}
              onChange={(event) => setScrub(Number(event.target.value))}
              className="w-full"
            />
          ) : null}
          {!videoEnabled ? (
            <p className="font-mono text-[10px] text-white/50">
              No monitor video — add /public/badreception.mp4 to enable the screen texture.
            </p>
          ) : null}
        </div>
      </div>

      {stickyScroll ? (
        <StickyScrollScene liveConfig={liveConfig} videoElement={videoElement} />
      ) : (
        <div className="fixed inset-0 pt-24">
          <HeroScenePanel
            progress={progress}
            liveConfig={liveConfig}
            videoElement={videoElement}
            className="hero-canvas--scroll h-full min-h-0"
          />
        </div>
      )}
    </div>
  );
}
