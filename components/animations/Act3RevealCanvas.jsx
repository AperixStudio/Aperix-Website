"use client";

/**
 * Act3RevealCanvas — scroll-driven iPhone + monitor reveal scene.
 * Dev playground wrapper around the shared act3RevealScene factory.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import { createAct3RevealScene } from "@/lib/experience/scenes/act3RevealScene";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import "./Act3RevealCanvas.css";

function resolveConfig(liveConfig) {
  return liveConfig ?? DEFAULT_ACT3_REVEAL_CONFIG;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import("framer-motion").MotionValue<number>} [props.scrollProgress]
 * @param {typeof DEFAULT_ACT3_REVEAL_CONFIG} [props.liveConfig]
 * @param {boolean} [props.showScreenGuides] Dev-only overlay showing screen plane rects.
 * @param {boolean} [props.renderActive] Pause WebGL + video when off-screen.
 */
export default function Act3RevealCanvas({
  className = "",
  scrollProgress = null,
  liveConfig = null,
  showScreenGuides = false,
  renderActive = true,
}) {
  const containerRef = useRef(null);
  const latestConfigRef = useRef(DEFAULT_ACT3_REVEAL_CONFIG);
  latestConfigRef.current = resolveConfig(liveConfig);
  const showScreenGuidesRef = useRef(showScreenGuides);
  showScreenGuidesRef.current = showScreenGuides;
  const renderActiveRef = useRef(renderActive);
  renderActiveRef.current = renderActive;

  const progressRef = useRef(scrollProgress?.get() ?? 0);
  const fallbackProgress = useMotionValue(0);
  const activeProgress = scrollProgress ?? fallbackProgress;

  useMotionValueEvent(activeProgress, "change", (value) => {
    progressRef.current = value;
  });

  useEffect(() => {
    progressRef.current = activeProgress.get();
  }, [activeProgress]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const scene = createAct3RevealScene({
      container,
      getScrollProgress: () => progressRef.current,
      getLiveConfig: () => latestConfigRef.current,
      getShowScreenGuides: () => showScreenGuidesRef.current,
      getRenderActive: () => renderActiveRef.current,
      onStatusChange: (message) => {
        if (message?.startsWith("Failed")) {
          setError(message);
          setLoading(false);
          return;
        }

        setError(null);
        setLoading(message != null);
      },
    });

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      scene.resize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      scene.dispose();
    };
  }, []);

  return (
    <div className={`act3-reveal-scene ${className}`.trim()}>
      {(loading || error) && (
        <div className={`act3-reveal-scene__overlay ${error ? "act3-reveal-scene__overlay--error" : ""}`}>
          {error ?? "Loading models…"}
        </div>
      )}
      <div ref={containerRef} className="act3-reveal-scene__container" />
    </div>
  );
}
