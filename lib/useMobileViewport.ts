"use client";

import { useLayoutEffect, useState } from "react";
import { MOBILE_BREAKPOINT_PX } from "@/lib/webglQuality";

type MobileViewportState = {
  isMobile: boolean;
  /** False until matchMedia has run (always before first paint). */
  ready: boolean;
};

/** Viewport width relative to the mobile breakpoint. */
export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>({
    isMobile: false,
    ready: false,
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
