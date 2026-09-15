"use client";

import { useLayoutEffect, useState, type CSSProperties, MouseEvent } from "react";
import ArrowheadLogo3D from "@/components/agency/arrowhead/ArrowheadLogo3D";

// arrowhead-mark.svg viewBox is 921.75 × 668.50 — height derives from this.
const LOGO_ASPECT = 668.5 / 921.75;

/** Seconds. Matches arrowhead-logo-3d DEFAULTS.trackAt — limbs are assembled. */
export const ARROWHEAD_TRACK_AT_S = 3.4;

type AnimatedLogoProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  onMouseEnter?: (event: MouseEvent<HTMLSpanElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLSpanElement>) => void;
  /** Seek the 3D sequence here on mount (seconds). Skips the assemble at intro handoff. */
  startAt?: number;
};

/**
 * The Aperix arrowhead mark, animating through its three-act WebGL sequence
 * (reveal → track → orbit) — same module and tuning as the hero deliverable.
 * Shared here so every place the mark appears (nav, fixed top logo, footer,
 * intro) is the same logo, not a lookalike.
 */
export default function AnimatedLogo({
  size = 34,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  startAt,
}: AnimatedLogoProps) {
  const height = Math.round(size * LOGO_ASPECT);
  const [useWebGL, setUseWebGL] = useState(false);

  useLayoutEffect(() => {
    const mobile =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setUseWebGL(!mobile);
  }, []);

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height,
        overflow: "hidden",
        ...style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {useWebGL ? (
        <ArrowheadLogo3D
          options={{ tilt: 0 }}
          onReady={(handle) => {
            if (startAt != null) handle?.seek(startAt);
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/arrowhead-mark.svg"
          alt=""
          aria-hidden="true"
          width={size}
          height={height}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </span>
  );
}
