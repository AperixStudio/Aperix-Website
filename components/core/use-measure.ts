"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Minimal stand-in for `react-use-measure` — tracks an element's border-box
 * size via ResizeObserver so we don't pull in another dependency just to
 * measure a marquee track.
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setBounds((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, bounds] as const;
}
