"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import {
  DESK_SCREEN_HEIGHT,
  DESK_SCREEN_WIDTH,
  drawDeskScreen,
} from "@/lib/deskEvolutionScreen";
import "./DeskEvolutionCanvas.css";

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import("framer-motion").MotionValue<number>} [props.scrollProgress]
 */
export default function DeskEvolutionCanvas({ className = "", scrollProgress = null }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(scrollProgress?.get() ?? 0);
  const fallbackProgress = useMotionValue(0);
  const activeProgress = scrollProgress ?? fallbackProgress;

  useMotionValueEvent(activeProgress, "change", (value) => {
    progressRef.current = value;
  });

  useEffect(() => {
    progressRef.current = activeProgress.get();
  }, [activeProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = DESK_SCREEN_WIDTH * dpr;
    canvas.height = DESK_SCREEN_HEIGHT * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animationId = 0;
    const render = () => {
      drawDeskScreen(ctx, progressRef.current);
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={`site-evolution-stage ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="site-evolution-stage__canvas"
        width={DESK_SCREEN_WIDTH}
        height={DESK_SCREEN_HEIGHT}
        aria-hidden="true"
      />
    </div>
  );
}
