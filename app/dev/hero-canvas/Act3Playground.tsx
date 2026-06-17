"use client";

import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";
import { button, useControls } from "leva";
import Act3RevealCanvas from "@/components/animations/Act3RevealCanvas";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import { MOBILE_ACT3_REVEAL_OVERRIDES } from "@/lib/act3RevealConfig.mobile";
import {
  formatMobileConfigModule,
  pickConfigOverrides,
} from "@/lib/dev/exportConfigOverrides";
import { mapPlaygroundScrub } from "@/lib/dev/storyPlaygroundProgress";
import { degToRad, radToDeg } from "@/lib/threeAnimation";
import "@/components/animations/Act3RevealCanvas.css";

type Act3Defaults = typeof DEFAULT_ACT3_REVEAL_CONFIG;

function getAct3Defaults(mobilePreview: boolean): Act3Defaults {
  return mobilePreview
    ? { ...DEFAULT_ACT3_REVEAL_CONFIG, ...MOBILE_ACT3_REVEAL_OVERRIDES }
    : DEFAULT_ACT3_REVEAL_CONFIG;
}

type PoseValues = {
  x: number;
  y: number;
  z: number;
  rotXDeg: number;
  rotYDeg: number;
  rotZDeg: number;
};

type CameraValues = {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
};

function poseControls(defaults: PoseValues) {
  return {
    x: { value: defaults.x, min: -3, max: 3, step: 0.01, label: "x" },
    y: { value: defaults.y, min: -3, max: 3, step: 0.01, label: "y" },
    z: { value: defaults.z, min: -3, max: 3, step: 0.01, label: "z" },
    rotXDeg: { value: defaults.rotXDeg, min: -180, max: 180, step: 1, label: "rot X°" },
    rotYDeg: { value: defaults.rotYDeg, min: -180, max: 180, step: 1, label: "rot Y°" },
    rotZDeg: { value: defaults.rotZDeg, min: -180, max: 180, step: 1, label: "rot Z°" },
  };
}

function mapPoseToConfig(prefix: "iphone" | "monitor", phase: "Start" | "End", values: PoseValues) {
  return {
    [`${prefix}${phase}X`]: values.x,
    [`${prefix}${phase}Y`]: values.y,
    [`${prefix}${phase}Z`]: values.z,
    [`${prefix}Rotation${phase}X`]: degToRad(values.rotXDeg),
    [`${prefix}Rotation${phase}Y`]: degToRad(values.rotYDeg),
    [`${prefix}Rotation${phase}Z`]: degToRad(values.rotZDeg),
  };
}

function mapCameraToConfig(phase: "Start" | "End", values: CameraValues) {
  return {
    [`camera${phase}X`]: values.cameraX,
    [`camera${phase}Y`]: values.cameraY,
    [`camera${phase}Z`]: values.cameraZ,
    [`lookAt${phase}X`]: values.lookAtX,
    [`lookAt${phase}Y`]: values.lookAtY,
    [`lookAt${phase}Z`]: values.lookAtZ,
  };
}

function getPoseDefaults(D: Act3Defaults, prefix: "iphone" | "monitor", phase: "Start" | "End"): PoseValues {
  return {
    x: D[`${prefix}${phase}X`],
    y: D[`${prefix}${phase}Y`],
    z: D[`${prefix}${phase}Z`],
    rotXDeg: radToDeg(D[`${prefix}Rotation${phase}X`]),
    rotYDeg: radToDeg(D[`${prefix}Rotation${phase}Y`]),
    rotZDeg: radToDeg(D[`${prefix}Rotation${phase}Z`]),
  };
}

function getCameraDefaults(D: Act3Defaults, phase: "Start" | "End"): CameraValues {
  return {
    cameraX: D[`camera${phase}X`],
    cameraY: D[`camera${phase}Y`],
    cameraZ: D[`camera${phase}Z`],
    lookAtX: D[`lookAt${phase}X`],
    lookAtY: D[`lookAt${phase}Y`],
    lookAtZ: D[`lookAt${phase}Z`],
  };
}

function screenControls(D: Act3Defaults, prefix: "iphone" | "monitor") {
  const nudgeMax = prefix === "monitor" ? 12 : 8;

  return {
    widthRatio: {
      value: D[`${prefix}ScreenWidthRatio`],
      min: 0.4,
      max: 1.4,
      step: 0.005,
      label: "width %",
    },
    heightRatio: {
      value: D[`${prefix}ScreenHeightRatio`],
      min: 0.4,
      max: 1.4,
      step: 0.005,
      label: "height %",
    },
    normalOffset: {
      value: D[`${prefix}ScreenNormalOffset`],
      min: -0.05,
      max: 0.12,
      step: 0.001,
      label: "face depth",
    },
    localX: { value: D[`${prefix}ScreenLocalX`], min: -nudgeMax, max: nudgeMax, step: 0.002, label: "nudge ↔" },
    localY: { value: D[`${prefix}ScreenLocalY`], min: -nudgeMax, max: nudgeMax, step: 0.002, label: "nudge ↕" },
    localZ: { value: D[`${prefix}ScreenLocalZ`], min: -nudgeMax, max: nudgeMax, step: 0.002, label: "nudge depth" },
    rootX: { value: D[`${prefix}ScreenRootX`] ?? 0, min: -nudgeMax, max: nudgeMax, step: 0.002, label: "model x" },
    rootY: { value: D[`${prefix}ScreenRootY`] ?? 0, min: -nudgeMax, max: nudgeMax, step: 0.002, label: "model y ↑" },
    rootZ: { value: D[`${prefix}ScreenRootZ`] ?? 0, min: -nudgeMax, max: nudgeMax, step: 0.002, label: "model z" },
    rotXDeg: {
      value: radToDeg(D[`${prefix}ScreenLocalRotX`] ?? 0),
      min: -180,
      max: 180,
      step: 1,
      label: "rot X° offset",
    },
    rotYDeg: {
      value: radToDeg(D[`${prefix}ScreenLocalRotY`]),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Y° offset",
    },
    rotZDeg: {
      value: radToDeg(D[`${prefix}ScreenLocalRotZ`]),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Z° offset",
    },
  };
}

function mapScreenToConfig(prefix: "iphone" | "monitor", values: Record<string, number>) {
  return {
    [`${prefix}ScreenWidthRatio`]: values.widthRatio,
    [`${prefix}ScreenHeightRatio`]: values.heightRatio,
    [`${prefix}ScreenNormalOffset`]: values.normalOffset,
    [`${prefix}ScreenLocalX`]: values.localX,
    [`${prefix}ScreenLocalY`]: values.localY,
    [`${prefix}ScreenLocalZ`]: values.localZ,
    [`${prefix}ScreenRootX`]: values.rootX,
    [`${prefix}ScreenRootY`]: values.rootY,
    [`${prefix}ScreenRootZ`]: values.rootZ,
    [`${prefix}ScreenLocalRotX`]: degToRad(values.rotXDeg),
    [`${prefix}ScreenLocalRotY`]: degToRad(values.rotYDeg),
    [`${prefix}ScreenLocalRotZ`]: degToRad(values.rotZDeg),
  };
}

type Act3PlaygroundProps = {
  mobilePreview: boolean;
  scrub: number;
};

export default function Act3Playground({ mobilePreview, scrub }: Act3PlaygroundProps) {
  const D = getAct3Defaults(mobilePreview);
  const progress = useMotionValue(0);

  const preview = useControls("Screen video", {
    showScreenGuides: { value: true, label: "Show alignment guides" },
  });

  const scene = useControls("Scene", {
    modelTargetSize: { value: D.modelTargetSize, min: 0.2, max: 4, step: 0.01 },
    iphoneScale: { value: D.iphoneScale, min: 0.1, max: 3, step: 0.01 },
    monitorScale: { value: D.monitorScale, min: 0.1, max: 3, step: 0.01 },
  });

  const lighting = useControls("Lighting", {
    ambientIntensity: { value: D.ambientIntensity, min: 0, max: 2, step: 0.01, label: "ambient" },
    keyLightIntensity: { value: D.keyLightIntensity, min: 0, max: 3, step: 0.01, label: "key" },
    keyLightX: { value: D.keyLightX, min: -10, max: 10, step: 0.1, label: "key X" },
    keyLightY: { value: D.keyLightY, min: -10, max: 10, step: 0.1, label: "key Y" },
    keyLightZ: { value: D.keyLightZ, min: -10, max: 10, step: 0.1, label: "key Z" },
    fillLightIntensity: { value: D.fillLightIntensity, min: 0, max: 2, step: 0.01, label: "fill" },
    fillLightX: { value: D.fillLightX, min: -10, max: 10, step: 0.1, label: "fill X" },
    fillLightY: { value: D.fillLightY, min: -10, max: 10, step: 0.1, label: "fill Y" },
    fillLightZ: { value: D.fillLightZ, min: -10, max: 10, step: 0.1, label: "fill Z" },
  });

  const spotlight = useControls("Spotlight · overhead", {
    spotLightEnabled: { value: D.spotLightEnabled ?? true, label: "enabled" },
    spotLightIntensity: { value: D.spotLightIntensity, min: 0, max: 6, step: 0.01, label: "intensity" },
    spotLightX: { value: D.spotLightX, min: -12, max: 12, step: 0.1, label: "position X" },
    spotLightY: { value: D.spotLightY, min: 0, max: 16, step: 0.1, label: "position Y ↑" },
    spotLightZ: { value: D.spotLightZ, min: -12, max: 12, step: 0.1, label: "position Z" },
    spotLightTargetX: { value: D.spotLightTargetX, min: -4, max: 4, step: 0.01, label: "aim X" },
    spotLightTargetY: { value: D.spotLightTargetY, min: -2, max: 4, step: 0.01, label: "aim Y" },
    spotLightTargetZ: { value: D.spotLightTargetZ, min: -4, max: 4, step: 0.01, label: "aim Z" },
    spotLightAngle: { value: D.spotLightAngle, min: 0.1, max: 1.2, step: 0.01, label: "cone angle" },
    spotLightPenumbra: { value: D.spotLightPenumbra, min: 0, max: 1, step: 0.01, label: "soft edge" },
  });

  const floorPool = useControls("Floor pool", {
    floorPoolEnabled: { value: D.floorPoolEnabled ?? true, label: "show pool" },
    floorPoolY: { value: D.floorPoolY, min: -2, max: 2, step: 0.01, label: "height Y" },
    floorPoolScale: { value: D.floorPoolScale, min: 1, max: 14, step: 0.1, label: "radius" },
    floorPoolOpacity: { value: D.floorPoolOpacity, min: 0, max: 1, step: 0.01, label: "brightness" },
  });

  const iphoneStart = useControls("iPhone · start", poseControls(getPoseDefaults(D, "iphone", "Start")));
  const iphoneEnd = useControls("iPhone · end", poseControls(getPoseDefaults(D, "iphone", "End")));
  const monitorStart = useControls("Monitor · start", poseControls(getPoseDefaults(D, "monitor", "Start")));
  const monitorEnd = useControls("Monitor · end", poseControls(getPoseDefaults(D, "monitor", "End")));
  const cameraStart = useControls("Camera · start", {
    cameraX: { value: D.cameraStartX, min: -8, max: 8, step: 0.01 },
    cameraY: { value: D.cameraStartY, min: -8, max: 8, step: 0.01 },
    cameraZ: { value: D.cameraStartZ, min: 0.2, max: 12, step: 0.01 },
    lookAtX: { value: D.lookAtStartX, min: -4, max: 4, step: 0.01 },
    lookAtY: { value: D.lookAtStartY, min: -4, max: 4, step: 0.01 },
    lookAtZ: { value: D.lookAtStartZ, min: -4, max: 4, step: 0.01 },
  });
  const cameraEnd = useControls("Camera · end", {
    cameraX: { value: D.cameraEndX, min: -8, max: 8, step: 0.01 },
    cameraY: { value: D.cameraEndY, min: -8, max: 8, step: 0.01 },
    cameraZ: { value: D.cameraEndZ, min: 0.2, max: 12, step: 0.01 },
    lookAtX: { value: D.lookAtEndX, min: -4, max: 4, step: 0.01 },
    lookAtY: { value: D.lookAtEndY, min: -4, max: 4, step: 0.01 },
    lookAtZ: { value: D.lookAtEndZ, min: -4, max: 4, step: 0.01 },
  });
  const iphoneScreen = useControls("iPhone · video screen", screenControls(D, "iphone"));
  const monitorScreen = useControls("Monitor · video screen", screenControls(D, "monitor"));

  const liveConfig = {
    ...D,
    ...scene,
    ...lighting,
    ...spotlight,
    ...floorPool,
    ...mapPoseToConfig("iphone", "Start", iphoneStart),
    ...mapPoseToConfig("iphone", "End", iphoneEnd),
    ...mapPoseToConfig("monitor", "Start", monitorStart),
    ...mapPoseToConfig("monitor", "End", monitorEnd),
    ...mapCameraToConfig("Start", cameraStart),
    ...mapCameraToConfig("End", cameraEnd),
    ...mapScreenToConfig("iphone", iphoneScreen),
    ...mapScreenToConfig("monitor", monitorScreen),
  };

  const liveConfigForExport = useRef(liveConfig);
  liveConfigForExport.current = liveConfig;

  useControls("Export · Act 3", {
    "Copy desktop config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("Paste into lib/act3RevealConfig.js:\n", text);
    }),
    "Copy mobile overrides": button(() => {
      const overrides = pickConfigOverrides(liveConfigForExport.current, DEFAULT_ACT3_REVEAL_CONFIG);
      const text = formatMobileConfigModule("MOBILE_ACT3_REVEAL_OVERRIDES", overrides);
      void navigator.clipboard.writeText(text);
      console.log("Paste into lib/act3RevealConfig.mobile.js:\n", text);
    }),
    "Reset panel": button(() => window.location.reload()),
  });

  useEffect(() => {
    progress.set(mapPlaygroundScrub(3, scrub).act3Progress);
  }, [progress, scrub]);

  return (
    <div className={mobilePreview ? "dev-story-mobile-shell" : "h-full w-full"}>
      <Act3RevealCanvas
        scrollProgress={progress}
        liveConfig={liveConfig}
        showScreenGuides={preview.showScreenGuides}
        simulateMobileViewport={mobilePreview}
        className="h-full act3-reveal-scene--scroll"
      />
    </div>
  );
}
