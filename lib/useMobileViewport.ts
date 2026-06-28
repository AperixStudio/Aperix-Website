"use client";

import { useLayoutEffect, useState } from "react";
import { MOBILE_BREAKPOINT_PX } from "@/lib/webglQuality";

type MobileViewportState = {
  isMobile: boolean;
  /** False until matchMedia has run (always before first paint). */
  ready: boolean;
};

/** Viewports at or below this width use the pre-rendered background video (phone + tablet). */
export const NARROW_VIEWPORT_MAX_PX = 1024;

function readNarrowViewport(): MobileViewportState {
  if (typeof window === "undefined") {
    return { isMobile: false, ready: false };
  }

  return {
    isMobile: window.matchMedia(`(max-width: ${NARROW_VIEWPORT_MAX_PX - 1}px)`).matches,
    ready: true,
  };
}

/** Viewport width relative to the mobile breakpoint. */
export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>(() => {
    if (typeof window === "undefined") {
      return { isMobile: false, ready: false };
    }

    return {
      isMobile: window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches,
      ready: true,
    };
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const update = () => {
      setState({ isMobile: mq.matches, ready: true });
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return state;
}

export function useNarrowViewport(): MobileViewportState {
  const [state, setState] = useState(readNarrowViewport);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_VIEWPORT_MAX_PX - 1}px)`);
    const update = () => {
      setState({ isMobile: mq.matches, ready: true });
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return state;
}
