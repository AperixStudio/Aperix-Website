"use client";

/**
 * ArrowheadLogo3D — React wrapper around arrowhead-logo-3d.js.
 *
 * Mounts the WebGL three-act sequence into a container that must have a
 * size (via `style`/`className` on the wrapper). Falls back to the flat
 * `/arrowhead-mark.svg` when WebGL is unavailable, so every call site gets a
 * mark either way.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
// arrowhead-logo-3d.js is the vendored deliverable (plain ES module, untyped);
// its return shape is asserted below via ArrowheadLogoHandle instead of relying
// on TS's structural inference from the JS file.
import { createArrowheadLogo as createArrowheadLogoUntyped } from "./arrowhead-logo-3d";

const createArrowheadLogo = createArrowheadLogoUntyped as unknown as (
  container: HTMLElement,
  options: Record<string, unknown>
) => ArrowheadLogoHandle;

export type ArrowheadLogoOptions = {
  theme?: "auto" | "light" | "dark";
  trackAt?: number;
  orbitAt?: number;
  buildDuration?: number;
  depth?: number;
  spinSpeed?: number;
  tilt?: number;
  autoplay?: boolean;
  loopAfter?: number;
  distance?: number;
  pauseOffscreen?: boolean;
  onPhase?: (phase: "reveal" | "track" | "orbit", index: number) => void;
};

export type ArrowheadLogoHandle = {
  replay: () => void;
  seek: (t: number) => void;
  play: () => void;
  pause: () => void;
  setTheme: (theme: "auto" | "light" | "dark") => void;
  phase: () => string;
  time: () => number;
  destroy: () => void;
};

type ArrowheadLogo3DProps = {
  className?: string;
  style?: CSSProperties;
  options?: ArrowheadLogoOptions;
  /** Called once the WebGL instance mounts (or fails) so a parent can grab the handle. */
  onReady?: (handle: ArrowheadLogoHandle | null) => void;
  /** Rendered over the container when WebGL is unavailable. Defaults to the flat SVG mark. */
  fallback?: ReactNode;
};

export default function ArrowheadLogo3D({ className, style, options, onReady, fallback }: ArrowheadLogo3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  // Serialised so a fresh object literal on every render doesn't remount the scene.
  const optionsKey = JSON.stringify(options ?? {});

  useEffect(() => {
    if (!hostRef.current) return undefined;
    let instance: ReturnType<typeof createArrowheadLogo> | undefined;
    try {
      const parsed = JSON.parse(optionsKey) as ArrowheadLogoOptions;
      instance = createArrowheadLogo(hostRef.current, { ...parsed, ...(options?.onPhase ? { onPhase: options.onPhase } : {}) });
    } catch (err) {
      // No WebGL: leave the container empty so the fallback can show through.
      console.warn(err);
      setFailed(true);
      onReady?.(null);
      return undefined;
    }
    onReady?.(instance);
    return () => {
      instance?.destroy();
      onReady?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-hidden={failed ? undefined : "true"} />
      {failed
        ? (fallback ?? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/arrowhead-mark.svg"
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
            />
          ))
        : null}
    </div>
  );
}
