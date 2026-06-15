"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { button, useControls } from "leva";
import HeroCanvas from "@/components/animations/HeroCanvas";
import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import { MOBILE_HERO_CANVAS_OVERRIDES } from "@/lib/heroCanvasConfig.mobile";
import {
  formatMobileConfigModule,
  pickConfigOverrides,
} from "@/lib/dev/exportConfigOverrides";
import { mapPlaygroundScrub, type StoryPlaygroundAct } from "@/lib/dev/storyPlaygroundProgress";
import { degToRad, radToDeg } from "@/lib/threeAnimation";
import "@/components/animations/HeroCanvas.css";

function getHeroDefaults(mobilePreview: boolean) {
  return mobilePreview
    ? { ...DEFAULT_HERO_CANVAS_CONFIG, ...MOBILE_HERO_CANVAS_OVERRIDES }
    : DEFAULT_HERO_CANVAS_CONFIG;
}

function mapLevaToConfig(
  values: Record<string, number | string>,
  defaults: typeof DEFAULT_HERO_CANVAS_CONFIG,
) {
  return {
    ...defaults,
    modelOffsetStartX: values.modelStartX as number,
    modelOffsetStartY: values.modelStartY as number,
    modelOffsetStartZ: values.modelStartZ as number,
    modelOffsetEndX: values.endX as number,
    modelOffsetEndY: values.endY as number,
    modelOffsetEndZ: values.endZ as number,
    modelRotationY: degToRad(values.rotationYDeg as number),
    screenFillMargin: values.screenFillMargin as number,
    cameraStartBackoff: values.cameraStartBackoff as number,
    cameraStartAzimuth: degToRad(values.cameraStartAzimuthDeg as number),
    cameraStartElevation: degToRad(values.cameraStartElevationDeg as number),
    cameraStartZRatio: values.cameraStartZRatio as number,
    cameraTargetYRatio: values.cameraTargetYRatio as number,
    cameraOrbitPivotYRatio: values.cameraOrbitPivotYRatio as number,
    cameraDistanceX: values.cameraDistanceX as number,
    cameraDistanceY: values.cameraDistanceY as number,
    cameraDistanceZ: values.cameraDistanceZ as number,
    cameraFov: values.cameraFov as number,
    screenPlaneOffsetStart: values.screenPlaneOffsetStart as number,
    screenPlaneOffsetEnd: values.screenPlaneOffsetEnd as number,
    screenPlaneLocalStartX: values.screenPlaneLocalStartX as number,
    screenPlaneLocalStartY: values.screenPlaneLocalStartY as number,
    screenPlaneLocalEndX: values.screenPlaneLocalEndX as number,
    screenPlaneLocalEndY: values.screenPlaneLocalEndY as number,
    screenPlaneScaleWidthStart: values.screenPlaneScaleWidthStart as number,
    screenPlaneScaleWidthEnd: values.screenPlaneScaleWidthEnd as number,
    screenPlaneScaleHeightStart: values.screenPlaneScaleHeightStart as number,
    screenPlaneScaleHeightEnd: values.screenPlaneScaleHeightEnd as number,
    screenPlaneRotationStartX: degToRad(values.screenPlaneRotStartXDeg as number),
    screenPlaneRotationStartY: degToRad(values.screenPlaneRotStartYDeg as number),
    screenPlaneRotationStartZ: degToRad(values.screenPlaneRotStartZDeg as number),
    screenPlaneRotationEndX: degToRad(values.screenPlaneRotEndXDeg as number),
    screenPlaneRotationEndY: degToRad(values.screenPlaneRotEndYDeg as number),
    screenPlaneRotationEndZ: degToRad(values.screenPlaneRotEndZDeg as number),
    screenPlanePolygonOffset: values.screenPlanePolygonOffset as number,
    introLabelGapStart: values.introLabelGapStart as number,
    introLabelGapEnd: values.introLabelGapEnd as number,
    introLabelOffsetStartX: values.introLabelOffsetStartX as number,
    introLabelOffsetStartY: values.introLabelOffsetStartY as number,
    introLabelOffsetStartZ: values.introLabelOffsetStartZ as number,
    introLabelOffsetEndX: values.introLabelOffsetEndX as number,
    introLabelOffsetEndY: values.introLabelOffsetEndY as number,
    introLabelOffsetEndZ: values.introLabelOffsetEndZ as number,
    introLabelOffsetNormalStart: values.introLabelOffsetNormalStart as number,
    introLabelOffsetNormalEnd: values.introLabelOffsetNormalEnd as number,
    introLabelWidthRatio: values.introLabelWidthRatio as number,
    introLabelHeightRatio: values.introLabelHeightRatio as number,
    introLabelTextFill: values.introLabelTextFill as string,
    introLabelRotationStartX: degToRad(values.introLabelRotStartXDeg as number),
    introLabelRotationStartY: degToRad(values.introLabelRotStartYDeg as number),
    introLabelRotationStartZ: degToRad(values.introLabelRotStartZDeg as number),
    introLabelRotationEndX: degToRad(values.introLabelRotEndXDeg as number),
    introLabelRotationEndY: degToRad(values.introLabelRotEndYDeg as number),
    introLabelRotationEndZ: degToRad(values.introLabelRotEndZDeg as number),
    ambientIntensity: values.ambientIntensity as number,
    keyLightIntensity: values.keyLightIntensity as number,
    keyLightX: values.keyLightX as number,
    keyLightY: values.keyLightY as number,
    keyLightZ: values.keyLightZ as number,
    rimLightIntensity: values.rimLightIntensity as number,
    rimLightX: values.rimLightX as number,
    rimLightY: values.rimLightY as number,
    rimLightZ: values.rimLightZ as number,
  };
}

type HeroActPlaygroundProps = {
  act: StoryPlaygroundAct;
  mobilePreview: boolean;
  scrub: number;
  videoElement: HTMLVideoElement | null;
};

function HeroScene({
  heroProgress,
  screenEvolution,
  act,
  mobilePreview,
  liveConfig,
  videoElement,
}: {
  heroProgress: MotionValue<number>;
  screenEvolution: MotionValue<number>;
  act: StoryPlaygroundAct;
  mobilePreview: boolean;
  liveConfig: ReturnType<typeof mapLevaToConfig>;
  videoElement: HTMLVideoElement | null;
}) {
  const canvasClass = "h-full w-full";

  return (
    <div className={mobilePreview ? "dev-story-mobile-shell h-full" : "h-full w-full"}>
      <div className={canvasClass}>
        <HeroCanvas
          scrollProgress={heroProgress}
          screenEvolutionProgress={act === 2 ? screenEvolution : null}
          liveConfig={liveConfig}
          videoElement={videoElement}
          showIntroLabel={!mobilePreview && act === 1}
          className="hero-canvas--scroll h-full min-h-0"
        />
      </div>
    </div>
  );
}

export default function HeroActPlayground({
  act,
  mobilePreview,
  scrub,
  videoElement,
}: HeroActPlaygroundProps) {
  const D = getHeroDefaults(mobilePreview);
  const heroProgress = useMotionValue(0);
  const screenEvolution = useMotionValue(0);

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
    cameraFov: {
      value: "cameraFov" in D ? (D.cameraFov as number) : 35,
      min: 24,
      max: 70,
      step: 1,
      label: "FOV°",
    },
  });

  const cameraEnd = useControls("Camera end", {
    cameraTargetYRatio: { value: D.cameraTargetYRatio, min: 0, max: 1, step: 0.01 },
    cameraOrbitPivotYRatio: { value: D.cameraOrbitPivotYRatio, min: 0, max: 1, step: 0.01 },
    cameraDistanceX: { value: D.cameraDistanceX, min: -3, max: 3, step: 0.01 },
    cameraDistanceY: { value: D.cameraDistanceY, min: -3, max: 3, step: 0.01 },
    cameraDistanceZ: { value: D.cameraDistanceZ, min: 0.5, max: 6, step: 0.01 },
  });

  const lighting = useControls("Lighting", {
    ambientIntensity: { value: D.ambientIntensity, min: 0, max: 2, step: 0.01, label: "ambient" },
    keyLightIntensity: { value: D.keyLightIntensity, min: 0, max: 3, step: 0.01, label: "key" },
    keyLightX: { value: D.keyLightX, min: -10, max: 10, step: 0.1, label: "key X" },
    keyLightY: { value: D.keyLightY, min: -10, max: 10, step: 0.1, label: "key Y" },
    keyLightZ: { value: D.keyLightZ, min: -10, max: 10, step: 0.1, label: "key Z" },
    rimLightIntensity: { value: D.rimLightIntensity, min: 0, max: 2, step: 0.01, label: "rim" },
    rimLightX: { value: D.rimLightX, min: -10, max: 10, step: 0.1, label: "rim X" },
    rimLightY: { value: D.rimLightY, min: -10, max: 10, step: 0.1, label: "rim Y" },
    rimLightZ: { value: D.rimLightZ, min: -10, max: 10, step: 0.1, label: "rim Z" },
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
      min: -3,
      max: 3,
      step: 0.01,
      label: "slide X",
    },
    screenPlaneLocalStartY: {
      value: D.screenPlaneLocalStartY,
      min: -4,
      max: 4,
      step: 0.01,
      label: "slide Y (face up)",
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
      min: -3,
      max: 3,
      step: 0.01,
      label: "slide X",
    },
    screenPlaneLocalEndY: {
      value: D.screenPlaneLocalEndY,
      min: -4,
      max: 4,
      step: 0.01,
      label: "slide Y (face up)",
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

  const liveConfig = mapLevaToConfig(
    {
      ...modelStart,
      ...modelEnd,
      ...cameraStart,
      ...cameraEnd,
      ...lighting,
      ...screenStart,
      ...screenEnd,
      ...screenRotStart,
      ...screenRotEnd,
      ...introLabelStart,
      ...introLabelEnd,
      ...introLabel,
      ...introLabelRotStart,
      ...introLabelRotEnd,
    },
    D,
  );

  const liveConfigForExport = useRef(liveConfig);
  liveConfigForExport.current = liveConfig;

  useControls("Export · Acts 1–2", {
    "Copy desktop config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("Paste into lib/heroCanvasConfig.js:\n", text);
    }),
    "Copy mobile overrides": button(() => {
      const overrides = pickConfigOverrides(liveConfigForExport.current, DEFAULT_HERO_CANVAS_CONFIG);
      const text = formatMobileConfigModule("MOBILE_HERO_CANVAS_OVERRIDES", overrides);
      void navigator.clipboard.writeText(text);
      console.log("Paste into lib/heroCanvasConfig.mobile.js:\n", text);
    }),
    "Reset panel": button(() => window.location.reload()),
  });

  useEffect(() => {
    const mapped = mapPlaygroundScrub(act, scrub);
    heroProgress.set(mapped.heroProgress);
    screenEvolution.set(mapped.screenEvolution);
  }, [act, scrub, heroProgress, screenEvolution]);

  return (
    <HeroScene
      heroProgress={heroProgress}
      screenEvolution={screenEvolution}
      act={act}
      mobilePreview={mobilePreview}
      liveConfig={liveConfig}
      videoElement={videoElement}
    />
  );
}
