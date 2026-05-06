"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type PillRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !window.matchMedia("(pointer: coarse)").matches;
  });
  const [pillRect, setPillRect] = useState<PillRect | null>(null);
  const hoveredPillRef = useRef<HTMLElement | null>(null);
  const enabled = !prefersReduced && isFinePointer;

  const mainX = useMotionValue(-100);
  const mainY = useMotionValue(-100);

  const mainXSoft = useSpring(mainX, { stiffness: 380, damping: 34, mass: 0.32 });
  const mainYSoft = useSpring(mainY, { stiffness: 380, damping: 34, mass: 0.32 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsFinePointer(!event.matches);
    };

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const setFromPill = (pill: HTMLElement | null) => {
      hoveredPillRef.current = pill;

      if (!pill) {
        setPillRect(null);
        return;
      }

      const rect = pill.getBoundingClientRect();
      const nextRect = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + 20,
        height: rect.height + 10,
      };

      setPillRect(nextRect);
      mainX.set(nextRect.x);
      mainY.set(nextRect.y);
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const pill = target?.closest("[data-cursor-pill]") as HTMLElement | null;

      if (pill !== hoveredPillRef.current) {
        setFromPill(pill);
      } else if (pill) {
        const rect = pill.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mainX.set(cx);
        mainY.set(cy);
      }
    };

    const onLeave = () => setFromPill(null);
    const onViewportChange = () => {
      if (!hoveredPillRef.current) return;
      setFromPill(hoveredPillRef.current);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [enabled, mainX, mainY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-45">
      <motion.div
        style={{ x: mainXSoft, y: mainYSoft }}
        animate={{
          opacity: pillRect ? 1 : 0,
          width: pillRect?.width ?? 0,
          height: pillRect?.height ?? 0,
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.45 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-agency-ink/45 bg-transparent"
      />
    </div>
  );
}
