"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { Leva, button, useControls } from "leva";
import Act3RevealCanvas from "@/components/animations/Act3RevealCanvas";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import { degToRad, radToDeg } from "@/lib/threeAnimation";

const D = DEFAULT_ACT3_REVEAL_CONFIG;

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

function poseControls(prefix: "iphone" | "monitor", phase: "Start" | "End", defaults: PoseValues) {
  return {
    x: {
      value: defaults.x,
      min: -3,
      max: 3,
      step: 0.01,
      label: "x",
    },
    y: {
      value: defaults.y,
      min: -3,
      max: 3,
      step: 0.01,
      label: "y",
    },
    z: {
      value: defaults.z,
      min: -3,
      max: 3,
      step: 0.01,
      label: "z",
    },
    rotXDeg: {
      value: defaults.rotXDeg,
      min: -180,
      max: 180,
      step: 1,
      label: "rot X°",
    },
    rotYDeg: {
      value: defaults.rotYDeg,
      min: -180,
      max: 180,
      step: 1,
      label: "rot Y°",
    },
    rotZDeg: {
      value: defaults.rotZDeg,
      min: -180,
      max: 180,
      step: 1,
      label: "rot Z°",
    },
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

function getPoseDefaults(prefix: "iphone" | "monitor", phase: "Start" | "End"): PoseValues {
  return {
    x: D[`${prefix}${phase}X`],
    y: D[`${prefix}${phase}Y`],
    z: D[`${prefix}${phase}Z`],
    rotXDeg: radToDeg(D[`${prefix}Rotation${phase}X`]),
    rotYDeg: radToDeg(D[`${prefix}Rotation${phase}Y`]),
    rotZDeg: radToDeg(D[`${prefix}Rotation${phase}Z`]),
  };
}

function getCameraDefaults(phase: "Start" | "End"): CameraValues {
  return {
    cameraX: D[`camera${phase}X`],
    cameraY: D[`camera${phase}Y`],
    cameraZ: D[`camera${phase}Z`],
    lookAtX: D[`lookAt${phase}X`],
    lookAtY: D[`lookAt${phase}Y`],
    lookAtZ: D[`lookAt${phase}Z`],
  };
}

type ScreenValues = {
  widthRatio: number;
  heightRatio: number;
  normalOffset: number;
  localX: number;
  localY: number;
  localZ: number;
  rootX: number;
  rootY: number;
  rootZ: number;
  rotXDeg: number;
  rotYDeg: number;
  rotZDeg: number;
};

function screenControls(prefix: "iphone" | "monitor") {
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
    localX: {
      value: D[`${prefix}ScreenLocalX`],
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "nudge ↔",
    },
    localY: {
      value: D[`${prefix}ScreenLocalY`],
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "nudge ↕",
    },
    localZ: {
      value: D[`${prefix}ScreenLocalZ`],
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "nudge depth",
    },
    rootX: {
      value: D[`${prefix}ScreenRootX`] ?? 0,
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "model x",
    },
    rootY: {
      value: D[`${prefix}ScreenRootY`] ?? 0,
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "model y ↑",
    },
    rootZ: {
      value: D[`${prefix}ScreenRootZ`] ?? 0,
      min: -nudgeMax,
      max: nudgeMax,
      step: 0.002,
      label: "model z",
    },
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

function mapScreenToConfig(prefix: "iphone" | "monitor", values: ScreenValues) {
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

export default function PlaygroundClient() {
  const progress = useMotionValue(0);
  const [scrub, setScrub] = useState(1);

  const preview = useControls("Screen video", {
    showScreenGuides: { value: true, label: "Show alignment guides" },
  });

  const scene = useControls("Scene", {
    modelTargetSize: { value: D.modelTargetSize, min: 0.2, max: 4, step: 0.01 },
    iphoneScale: { value: D.iphoneScale, min: 0.1, max: 3, step: 0.01 },
    monitorScale: { value: D.monitorScale, min: 0.1, max: 3, step: 0.01 },
    ambientIntensity: { value: D.ambientIntensity, min: 0, max: 2, step: 0.01 },
    keyLightIntensity: { value: D.keyLightIntensity, min: 0, max: 3, step: 0.01 },
    fillLightIntensity: { value: D.fillLightIntensity, min: 0, max: 2, step: 0.01 },
  });

  const iphoneStart = useControls(
    "iPhone · start (progress 0)",
    poseControls("iphone", "Start", getPoseDefaults("iphone", "Start")),
  );
  const iphoneEnd = useControls(
    "iPhone · end (progress 1)",
    poseControls("iphone", "End", getPoseDefaults("iphone", "End")),
  );
  const monitorStart = useControls(
    "Monitor · start (progress 0)",
    poseControls("monitor", "Start", getPoseDefaults("monitor", "Start")),
  );
  const monitorEnd = useControls(
    "Monitor · end (progress 1)",
    poseControls("monitor", "End", getPoseDefaults("monitor", "End")),
  );
  const cameraStart = useControls("Camera · start (progress 0)", {
    cameraX: { value: D.cameraStartX, min: -8, max: 8, step: 0.01 },
    cameraY: { value: D.cameraStartY, min: -8, max: 8, step: 0.01 },
    cameraZ: { value: D.cameraStartZ, min: 0.2, max: 12, step: 0.01 },
    lookAtX: { value: D.lookAtStartX, min: -4, max: 4, step: 0.01 },
    lookAtY: { value: D.lookAtStartY, min: -4, max: 4, step: 0.01 },
    lookAtZ: { value: D.lookAtStartZ, min: -4, max: 4, step: 0.01 },
  });
  const cameraEnd = useControls("Camera · end (progress 1)", {
    cameraX: { value: D.cameraEndX, min: -8, max: 8, step: 0.01 },
    cameraY: { value: D.cameraEndY, min: -8, max: 8, step: 0.01 },
    cameraZ: { value: D.cameraEndZ, min: 0.2, max: 12, step: 0.01 },
    lookAtX: { value: D.lookAtEndX, min: -4, max: 4, step: 0.01 },
    lookAtY: { value: D.lookAtEndY, min: -4, max: 4, step: 0.01 },
    lookAtZ: { value: D.lookAtEndZ, min: -4, max: 4, step: 0.01 },
  });
  const iphoneScreen = useControls("iPhone · video screen", screenControls("iphone"));
  const monitorScreen = useControls("Monitor · video screen", screenControls("monitor"));

  const liveConfig = {
    ...DEFAULT_ACT3_REVEAL_CONFIG,
    ...scene,
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

  useControls("Export", {
    "Copy config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("Act 3 reveal config copied:\n", text);
    }),
    "Reset page": button(() => window.location.reload()),
  });

  useEffect(() => {
    progress.set(scrub);
  }, [progress, scrub]);

  return (
    <div className="min-h-screen">
      <Leva collapsed={false} titleBar={{ title: "Act 3 reveal" }} />

      <div className="fixed inset-x-0 top-0 z-50 border-b border-agency-border/40 bg-agency-glass-bg/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-agency-muted">
              Act 3 reveal scrubber
            </p>
            <p className="font-mono text-xs text-agency-ink">
              {(scrub * 100).toFixed(1)}% · 0 = tight · 1 = wide
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={scrub}
            onChange={(event) => setScrub(Number(event.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="fixed inset-0 pt-24">
        <div className="relative h-full w-full">
        <Act3RevealCanvas
          scrollProgress={progress}
          liveConfig={liveConfig}
          showScreenGuides={preview.showScreenGuides}
          className="h-full act3-reveal-scene--scroll"
        />
        </div>
      </div>
    </div>
  );
}
