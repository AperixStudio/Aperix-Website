"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { Leva, button, useControls } from "leva";
import Rocket from "@/components/animations/Rocket";
import { DEFAULT_ROCKET_CONFIG } from "@/lib/RocketConfig";
import { degToRad, radToDeg } from "@/lib/threeAnimation";

const D = DEFAULT_ROCKET_CONFIG;

type PoseValues = {
  x: number;
  y: number;
  z: number;
  rotXDeg: number;
  rotYDeg: number;
  rotZDeg: number;
};

function mapPose(values: PoseValues, prefix: "Start" | "Middle" | "End") {
  const key = prefix.toLowerCase();
  return {
    [`modelOffset${prefix}X`]: values.x,
    [`modelOffset${prefix}Y`]: values.y,
    [`modelOffset${prefix}Z`]: values.z,
    [`modelRotation${prefix}X`]: degToRad(values.rotXDeg),
    [`modelRotation${prefix}Y`]: degToRad(values.rotYDeg),
    [`modelRotation${prefix}Z`]: degToRad(values.rotZDeg),
  };
}

function mapLevaToConfig(
  start: PoseValues,
  middle: PoseValues,
  end: PoseValues,
  camera: {
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    lookAtX: number;
    lookAtY: number;
    lookAtZ: number;
  },
) {
  return {
    ...DEFAULT_ROCKET_CONFIG,
    ...mapPose(start, "Start"),
    ...mapPose(middle, "Middle"),
    ...mapPose(end, "End"),
    ...camera,
  };
}

export default function PlaygroundClient() {
  const progress = useMotionValue(0);
  const [scrub, setScrub] = useState(0);

  const start = useControls("Model start", {
    x: { value: D.modelOffsetStartX, min: -2, max: 2, step: 0.01, label: "x" },
    y: { value: D.modelOffsetStartY, min: -2, max: 2, step: 0.01, label: "y" },
    z: { value: D.modelOffsetStartZ, min: -2, max: 2, step: 0.01, label: "z" },
    rotXDeg: {
      value: radToDeg(D.modelRotationStartX),
      min: -180,
      max: 180,
      step: 1,
      label: "rot X°",
    },
    rotYDeg: {
      value: radToDeg(D.modelRotationStartY),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Y°",
    },
    rotZDeg: {
      value: radToDeg(D.modelRotationStartZ),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Z°",
    },
  });

  const middle = useControls("Model middle", {
    x: { value: D.modelOffsetMiddleX, min: -2, max: 2, step: 0.01, label: "x" },
    y: { value: D.modelOffsetMiddleY, min: -2, max: 2, step: 0.01, label: "y" },
    z: { value: D.modelOffsetMiddleZ, min: -2, max: 2, step: 0.01, label: "z" },
    rotXDeg: {
      value: radToDeg(D.modelRotationMiddleX),
      min: -180,
      max: 180,
      step: 1,
      label: "rot X°",
    },
    rotYDeg: {
      value: radToDeg(D.modelRotationMiddleY),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Y°",
    },
    rotZDeg: {
      value: radToDeg(D.modelRotationMiddleZ),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Z°",
    },
  });

  const end = useControls("Model end", {
    x: { value: D.modelOffsetEndX, min: -2, max: 2, step: 0.01, label: "x" },
    y: { value: D.modelOffsetEndY, min: -2, max: 2, step: 0.01, label: "y" },
    z: { value: D.modelOffsetEndZ, min: -2, max: 2, step: 0.01, label: "z" },
    rotXDeg: {
      value: radToDeg(D.modelRotationEndX),
      min: -180,
      max: 180,
      step: 1,
      label: "rot X°",
    },
    rotYDeg: {
      value: radToDeg(D.modelRotationEndY),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Y°",
    },
    rotZDeg: {
      value: radToDeg(D.modelRotationEndZ),
      min: -180,
      max: 180,
      step: 1,
      label: "rot Z°",
    },
  });

  const camera = useControls("Camera", {
    cameraX: { value: D.cameraX, min: -5, max: 5, step: 0.01 },
    cameraY: { value: D.cameraY, min: -5, max: 5, step: 0.01 },
    cameraZ: { value: D.cameraZ, min: 0.5, max: 10, step: 0.01 },
    lookAtX: { value: D.lookAtX, min: -2, max: 2, step: 0.01 },
    lookAtY: { value: D.lookAtY, min: -2, max: 2, step: 0.01 },
    lookAtZ: { value: D.lookAtZ, min: -2, max: 2, step: 0.01 },
  });

  const liveConfig = mapLevaToConfig(start, middle, end, camera);
  const liveConfigForExport = useRef(liveConfig);
  liveConfigForExport.current = liveConfig;

  useControls("Export", {
    "Copy config": button(() => {
      const text = JSON.stringify(liveConfigForExport.current, null, 2);
      void navigator.clipboard.writeText(text);
      console.log("Rocket config copied:\n", text);
    }),
    "Reset page": button(() => window.location.reload()),
  });

  useEffect(() => {
    progress.set(scrub);
  }, [progress, scrub]);

  return (
    <div className="min-h-screen">
      <Leva collapsed={false} titleBar={{ title: "Rocket" }} />

      <div className="fixed inset-x-0 top-0 z-50 border-b border-agency-border/40 bg-agency-glass-bg/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            Scroll progress {(scrub * 100).toFixed(1)}%
          </label>
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
        <Rocket scrollProgress={progress} liveConfig={liveConfig} className="h-full" />
      </div>
    </div>
  );
}
