"use client";

import { useEffect, useState, type RefObject } from "react";

type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Tracks whether a target element intersects the viewport.
 * Defaults to true until measured so canvases render on first paint.
 */
export function useInView(
  targetRef: RefObject<Element | null>,
  { rootMargin = "80px 0px", threshold = 0 }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin, threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, rootMargin, threshold]);

  return inView;
}
