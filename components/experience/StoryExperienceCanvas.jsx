"use client";

/**
 * Single WebGL canvas for Acts 1–3. One renderer, shader dissolve at Act 2→3 handoff.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { createPcStoryScene } from "@/lib/experience/scenes/pcStoryScene";
import { createAct3RevealScene } from "@/lib/experience/scenes/act3RevealScene";
import { createStoryCompositor } from "@/lib/experience/transitions/createStoryCompositor";
import { getStoryScrollFrame } from "@/lib/experience/scrollState";
import {
  ACT3_PRELOAD_START,
  ACT3_PRELOAD_START_MOBILE,
} from "@/lib/experience/constants";
import { resolveAct3RevealConfig } from "@/lib/resolveAct3RevealConfig";
import { resolveExperienceTier } from "@/lib/experience/mobileTier";
import { getRendererPixelRatio } from "@/lib/webglQuality";
import "@/components/animations/HeroCanvas.css";
import "@/components/animations/Act3RevealCanvas.css";
import "./StoryExperience.css";

/**
 * @param {object} props
 * @param {import("framer-motion").MotionValue<number>} props.globalScrollProgress
 * @param {HTMLVideoElement | null} [props.videoElement]
 * @param {Record<string, unknown> | null | undefined} [props.heroLiveConfig]
 * @param {boolean} [props.showIntroLabel]
 * @param {boolean} [props.renderActive]
 * @param {boolean} [props.isMobile]
 * @param {boolean} [props.prefersReducedMotion]
 * @param {string} [props.className]
 */
export default function StoryExperienceCanvas({
  globalScrollProgress,
  videoElement = null,
  heroLiveConfig,
  showIntroLabel = false,
  renderActive = true,
  isMobile = false,
  prefersReducedMotion = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasHostRef = useRef(null);
  const globalRef = useRef(globalScrollProgress.get());
  const videoRef = useRef(videoElement);
  const renderActiveRef = useRef(renderActive);
  const showIntroLabelRef = useRef(showIntroLabel);
  const heroLiveConfigRef = useRef(heroLiveConfig);
  const isMobileRef = useRef(isMobile);
  const tierRef = useRef(resolveExperienceTier(isMobile, prefersReducedMotion));

  const pcProgressRef = useRef(0);
  const screenEvolutionRef = useRef(0);
  const act3ProgressRef = useRef(0);

  const [overlayMessage, setOverlayMessage] = useState("Loading story…");

  videoRef.current = videoElement;
  renderActiveRef.current = renderActive;
  showIntroLabelRef.current = showIntroLabel;
  heroLiveConfigRef.current = heroLiveConfig;
  isMobileRef.current = isMobile;
  tierRef.current = resolveExperienceTier(isMobile, prefersReducedMotion);

  useMotionValueEvent(globalScrollProgress, "change", (value) => {
    globalRef.current = value;
    const frame = getStoryScrollFrame(value);
    pcProgressRef.current = frame.pcCameraProgress;
    screenEvolutionRef.current = frame.screenEvolutionProgress;
    act3ProgressRef.current = frame.act3RevealProgress;
  });

  useEffect(() => {
    const value = globalScrollProgress.get();
    globalRef.current = value;
    const frame = getStoryScrollFrame(value);
    pcProgressRef.current = frame.pcCameraProgress;
    screenEvolutionRef.current = frame.screenEvolutionProgress;
    act3ProgressRef.current = frame.act3RevealProgress;
  }, [globalScrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    const canvasHost = canvasHostRef.current;
    if (!container || !canvasHost) {
      return undefined;
    }

    let disposed = false;
    let animationId = 0;
    /** @type {ReturnType<typeof createPcStoryScene> | null} */
    let pcScene = null;
    /** @type {ReturnType<typeof createAct3RevealScene> | null} */
    let act3Scene = null;
    let act3InitStarted = false;

    const mobileAtMount = isMobileRef.current;
    const useDissolve = tierRef.current === "full";
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobileAtMount,
      powerPreference: mobileAtMount ? "low-power" : "default",
    });
    renderer.setPixelRatio(getRendererPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.className = "story-experience__canvas";
    canvasHost.appendChild(renderer.domElement);

    const compositor = createStoryCompositor(renderer, { useDissolve });

    function getPreloadStart() {
      return isMobileRef.current ? ACT3_PRELOAD_START_MOBILE : ACT3_PRELOAD_START;
    }

    function updateOverlay() {
      if (disposed) {
        return;
      }

      const frame = getStoryScrollFrame(globalRef.current);
      const blend = resolveBlend(frame);
      const showingPc = pcScene && blend < 1;
      const showingAct3 = act3Scene && (blend > 0 || frame.showAct3Scene);

      const pcStatus = showingPc ? pcScene?.getStatus() : null;
      const act3Status = showingAct3 ? act3Scene?.getStatus() : null;
      const message = act3Status ?? pcStatus;

      if (message) {
        setOverlayMessage(message);
        return;
      }

      if (frame.showAct3Scene && act3Scene && !act3Scene.isReady()) {
        setOverlayMessage("Loading models…");
        return;
      }

      if (showingPc && pcScene && !pcScene.isReady()) {
        setOverlayMessage("Loading model…");
        return;
      }

      setOverlayMessage(null);
    }

    function ensureAct3Scene() {
      if (act3Scene || act3InitStarted || disposed) {
        return;
      }

      act3InitStarted = true;
      act3Scene = createAct3RevealScene({
        container,
        renderer,
        ownRenderer: false,
        ownRenderLoop: false,
        getScrollProgress: () => act3ProgressRef.current,
        getLiveConfig: () => resolveAct3RevealConfig(isMobileRef.current),
        getRenderActive: () =>
          renderActiveRef.current && globalRef.current >= getPreloadStart(),
        onStatusChange: updateOverlay,
      });
      act3Scene.resize(container.clientWidth || 1, container.clientHeight || 1);
      updateOverlay();
    }

    function disposePcScene() {
      if (!pcScene) {
        return;
      }

      pcScene.dispose();
      pcScene = null;
    }

    pcScene = createPcStoryScene({
      container,
      renderer,
      ownRenderer: false,
      ownRenderLoop: false,
      canvasClassName: "story-experience__canvas",
      getScrollProgress: () => pcProgressRef.current,
      getScreenEvolutionProgress: () => screenEvolutionRef.current,
      getLiveConfig: () => heroLiveConfigRef.current ?? undefined,
      getVideoElement: () => videoRef.current,
      getShowIntroLabel: () => showIntroLabelRef.current,
      getRenderActive: () => renderActiveRef.current,
      onStatusChange: updateOverlay,
    });

    function resize() {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setPixelRatio(getRendererPixelRatio());
      renderer.setSize(width, height, false);
      compositor.resize(width, height);
      pcScene?.resize(width, height);
      act3Scene?.resize(width, height);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    function resolveBlend(frame) {
      const act3Ready = act3Scene?.isReady() ?? false;

      if (!useDissolve) {
        if (!frame.showAct3Scene || !act3Ready) {
          return 0;
        }
        return 1;
      }

      if (!act3Ready) {
        return 0;
      }

      return frame.act3TransitionBlend;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (!renderActiveRef.current || document.hidden) {
        return;
      }

      const frame = getStoryScrollFrame(globalRef.current);
      const preloadStart = getPreloadStart();

      if (frame.global >= preloadStart) {
        ensureAct3Scene();
      }

      const blend = resolveBlend(frame);

      if (pcScene && blend < 1) {
        pcScene.tick();
      }

      if (act3Scene && (blend > 0 || frame.global >= preloadStart)) {
        act3Scene.tick();
      }

      compositor.render({
        fromScene: pcScene,
        toScene: act3Scene,
        blend,
      });

      if (blend >= 1 && act3Scene?.isReady()) {
        disposePcScene();
      }

      updateOverlay();
    }

    animate();
    updateOverlay();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      pcScene?.dispose();
      act3Scene?.dispose();
      compositor.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoElement;
    if (!video) {
      return undefined;
    }

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const onReady = () => {
      void video.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    if (video.readyState >= 2) {
      onReady();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [videoElement]);

  return (
    <div className={`story-experience ${className}`.trim()} ref={containerRef}>
      {overlayMessage ? (
        <div className="story-experience__overlay">{overlayMessage}</div>
      ) : null}
      <div ref={canvasHostRef} className="story-experience__canvas-host" />
    </div>
  );
}
