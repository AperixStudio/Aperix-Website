"use client";

import { useCallback, useEffect, useRef } from "react";
import UnicornScene from "unicornstudio-react/next";
import { useNarrowViewport } from "@/lib/useMobileViewport";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { signalIntroBackgroundReady } from "@/lib/introAssets";
import "./SiteBackground.css";

const BG_UNICORN_JSON = "/unicorn/aperixbg_scene.json";
const BG_MOBILE_VIDEO_SRC = "/aperixbg_scene.webm";
const BG_MOBILE_LOOP_SECONDS = 10;
const BG_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";
const BG_RENDER = {
  scale: 1,
  dpi: 1.5,
  fps: 60 as const,
} as const;

function SiteBackgroundUnicorn() {
  const handleReady = useCallback(() => {
    signalIntroBackgroundReady();
  }, []);

  return (
    <UnicornScene
      jsonFilePath={BG_UNICORN_JSON}
      sdkUrl={BG_SDK_URL}
      width="100%"
      height="100%"
      scale={BG_RENDER.scale}
      dpi={BG_RENDER.dpi}
      fps={BG_RENDER.fps}
      lazyLoad={false}
      altText=""
      ariaLabel=""
      className="site-bg__scene"
      onLoad={handleReady}
      onError={handleReady}
    />
  );
}

/** Pre-rendered background on mobile/tablet — ping-pong loop (forward 10s, reverse 10s). */
function SiteBackgroundMobileVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const loopEndRef = useRef(BG_MOBILE_LOOP_SECONDS);
  const readySignalledRef = useRef(false);

  const signalReadyOnce = useCallback(() => {
    if (readySignalledRef.current) {
      return;
    }
    readySignalledRef.current = true;
    signalIntroBackgroundReady();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    video.muted = true;
    video.playsInline = true;

    const ensurePlaying = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const syncLoop = () => {
      const loopEnd = loopEndRef.current;

      if (directionRef.current === 1 && video.currentTime >= loopEnd - 0.05) {
        directionRef.current = -1;
        video.playbackRate = -1;
        ensurePlaying();
        return;
      }

      if (directionRef.current === -1 && video.currentTime <= 0.05) {
        directionRef.current = 1;
        video.playbackRate = 1;
        video.currentTime = 0;
        ensurePlaying();
      }
    };

    const onReady = () => {
      loopEndRef.current = Math.min(
        BG_MOBILE_LOOP_SECONDS,
        Number.isFinite(video.duration) ? video.duration : BG_MOBILE_LOOP_SECONDS,
      );
      directionRef.current = 1;
      video.playbackRate = 1;
      video.currentTime = 0;
      ensurePlaying();
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplaythrough", signalReadyOnce, { once: true });
    video.addEventListener("error", signalReadyOnce, { once: true });
    video.addEventListener("canplay", ensurePlaying);
    video.addEventListener("timeupdate", syncLoop);
    video.addEventListener("ended", ensurePlaying);

    if (video.readyState >= 1) {
      onReady();
    }
    if (video.readyState >= 4) {
      signalReadyOnce();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplaythrough", signalReadyOnce);
      video.removeEventListener("error", signalReadyOnce);
      video.removeEventListener("canplay", ensurePlaying);
      video.removeEventListener("timeupdate", syncLoop);
      video.removeEventListener("ended", ensurePlaying);
    };
  }, [signalReadyOnce]);

  return (
    <video
      ref={videoRef}
      className="site-bg__video"
      src={BG_MOBILE_VIDEO_SRC}
      muted
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
    />
  );
}

export default function SiteBackground() {
  const { isMobile: isNarrowViewport, ready } = useNarrowViewport();
  const prefersReduced = useReducedMotion();

  const useVideoBackground = ready && isNarrowViewport && !prefersReduced;
  const useStaticBackground = ready && isNarrowViewport && prefersReduced;

  useEffect(() => {
    if (prefersReduced) {
      signalIntroBackgroundReady();
    }
  }, [prefersReduced]);

  return (
    <div className="site-bg" aria-hidden="true">
      {useVideoBackground ? <SiteBackgroundMobileVideo /> : null}
      {useStaticBackground ? (
        <video
          className="site-bg__video"
          src={BG_MOBILE_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => signalIntroBackgroundReady()}
          onError={() => signalIntroBackgroundReady()}
        />
      ) : null}
      {!useVideoBackground && !useStaticBackground && ready ? <SiteBackgroundUnicorn /> : null}
    </div>
  );
}
