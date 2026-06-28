"use client";

import { useEffect, useState, type RefObject } from "react";

type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  /** When true, assume in-view until IntersectionObserver runs (legacy canvas sections). */
  initialInView?: boolean;
};

/**
 * Tracks whether a target element intersects the viewport.
 * Defaults to false until measured so off-screen sections stay idle.
 */
export function useInView(
  targetRef: RefObject<Element | null>,
  { rootMargin = "80px 0px", threshold = 0, initialInView = false }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(initialInView);

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
