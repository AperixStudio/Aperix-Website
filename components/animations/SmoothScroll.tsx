"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SCROLL_EASE = 0.075;
const WHEEL_MULTIPLIER = 0.5;
const STOP_THRESHOLD = 0.4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getMaxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

function isEditableElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    element.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']"),
  );
}

function hasScrollableParent(element: Element | null, deltaY: number) {
  let current = element instanceof HTMLElement ? element : null;

  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      current.scrollHeight > current.clientHeight;

    if (canScrollY) {
      const atTop = current.scrollTop <= 0;
      const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 1;

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        return true;
      }
    }

    current = current.parentElement;
  }

  return false;
}

export default function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) {
      return undefined;
    }

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frameId: number | null = null;
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let isSmoothing = false;

    const jumpTo = (top: number) => {
      window.scrollTo({ top, left: 0, behavior: "auto" });
    };

    const stop = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      isSmoothing = false;
      currentY = window.scrollY;
      targetY = currentY;
    };

    const tick = () => {
      currentY += (targetY - currentY) * SCROLL_EASE;

      if (Math.abs(targetY - currentY) < STOP_THRESHOLD) {
        jumpTo(targetY);
        stop();
        return;
      }

      jumpTo(currentY);
      frameId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId === null) {
        isSmoothing = true;
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || isEditableElement(event.target as Element | null)) {
        return;
      }

      const deltaY = normalizeWheelDelta(event);
      if (hasScrollableParent(event.target as Element | null, deltaY)) {
        return;
      }

      event.preventDefault();
      currentY = window.scrollY;
      targetY = clamp(targetY + deltaY * WHEEL_MULTIPLIER, 0, getMaxScrollY());
      start();
    };

    const onScroll = () => {
      if (isSmoothing) {
        return;
      }
      currentY = window.scrollY;
      targetY = currentY;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        isEditableElement(event.target as Element | null) ||
        !["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)
      ) {
        return;
      }
      stop();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", stop);

    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", stop);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [prefersReducedMotion]);

  return null;
}
