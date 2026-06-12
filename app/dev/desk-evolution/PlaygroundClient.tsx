"use client";

import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";
import DeskEvolutionCanvas from "@/components/animations/DeskEvolutionCanvas";

export default function PlaygroundClient() {
  const progress = useMotionValue(0);
  const [scrub, setScrub] = useState(0);

  useEffect(() => {
    progress.set(scrub);
  }, [progress, scrub]);

  return (
    <div className="min-h-screen bg-agency-bg">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-agency-border/40 bg-agency-glass-bg/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-agency-muted">
            Site evolution progress {(scrub * 100).toFixed(1)}%
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
        <div className="desk-evolution-blueprint absolute inset-0" aria-hidden="true" />
        <DeskEvolutionCanvas scrollProgress={progress} className="h-full" />
      </div>
    </div>
  );
}
