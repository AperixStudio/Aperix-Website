"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef, useState } from "react";
import { useMeasure } from "./use-measure";

export type InfiniteSliderProps = {
  children: React.ReactNode;
  /** Space between items, in px. */
  gap?: number;
  /** Seconds for one full loop of the track. */
  duration?: number;
  /** Loop duration while hovered — larger is slower. Omit to keep speed. */
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  /** Run the loop the other way. */
  reverse?: boolean;
  className?: string;
};

/** Time constant, in ms, for easing between the idle and hover speeds. */
const SPEED_EASE_MS = 260;

/**
 * Seamless marquee: the children are rendered twice back to back and the
 * track is translated by exactly one copy's width, so the second copy lands
 * where the first started and the loop point is invisible.
 *
 * The position is advanced per frame and wrapped with a modulo rather than
 * being driven by a keyframe animation. That matters: a keyframed version has
 * to restart whenever the measured size changes, and each restart snaps the
 * track back to the start — which is visible as tiles jumping or dropping out
 * the moment lazily-loaded media settles and nudges the width by a fraction
 * of a pixel. Wrapping never restarts, so the loop survives any re-measure.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const translation = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  // Eased rather than swapped, so hovering slows the row down instead of
  // stepping its speed.
  const activeDuration = useRef(duration);

  useAnimationFrame((_, delta) => {
    const size = direction === "horizontal" ? width : height;
    if (!size) return;

    // `size` spans both copies plus the gap between them, so one copy's worth
    // of travel — the exact distance that makes the loop seamless — is half.
    const span = (size + gap) / 2;

    const target = isHovered && durationOnHover ? durationOnHover : duration;
    activeDuration.current +=
      (target - activeDuration.current) * Math.min(1, delta / SPEED_EASE_MS);

    // Clamp delta so a backgrounded tab returning doesn't teleport the track.
    const step =
      (span / (activeDuration.current * 1000)) * Math.min(delta, 64);

    let next = translation.get() + (reverse ? step : -step);
    if (next <= -span) next += span;
    if (next >= 0) next -= span;

    translation.set(next);
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className={cn("flex", direction === "horizontal" ? "w-max" : "h-max")}
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        onHoverStart={durationOnHover ? () => setIsHovered(true) : undefined}
        onHoverEnd={durationOnHover ? () => setIsHovered(false) : undefined}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
