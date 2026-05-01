"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CursorFollower = dynamic(() => import("@/components/animations/CursorFollower"), {
  ssr: false,
});

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export default function LazyCursorFollower() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const win = window as IdleWindow;
    const isCoarsePointer = win.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isCoarsePointer || prefersReduced) return;

    const enable = () => setEnabled(true);

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(enable, { timeout: 2000 });
      return () => win.cancelIdleCallback?.(id);
    }

    const id = win.setTimeout(enable, 1200);
    return () => win.clearTimeout(id);
  }, []);

  return enabled ? <CursorFollower /> : null;
}