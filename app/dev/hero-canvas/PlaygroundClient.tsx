"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Leva } from "leva";
import {
  HERO_VIDEO_OFFSCREEN_CLASS,
  HERO_VIDEO_SRC,
} from "@/lib/heroVideo";
import type { StoryPlaygroundAct } from "@/lib/dev/storyPlaygroundProgress";
import HeroActPlayground from "./HeroActPlayground";
import Act3Playground from "./Act3Playground";
import StoryPlaygroundToolbar from "./StoryPlaygroundToolbar";
import "./playground.css";

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const [act, setAct] = useState<StoryPlaygroundAct>(1);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [scrub, setScrub] = useState(act === 3 ? 1 : 0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(Boolean(HERO_VIDEO_SRC));

  useEffect(() => {
    if (searchParams.get("mobile") === "1") {
      setMobilePreview(true);
    }
    const actParam = searchParams.get("act");
    if (actParam === "2" || actParam === "3") {
      setAct(Number(actParam) as StoryPlaygroundAct);
    }
  }, [searchParams]);

  useEffect(() => {
    if (act === 3 && scrub === 0) {
      setScrub(1);
    }
  }, [act, scrub]);

  useEffect(() => {
    if (!videoElement || !videoEnabled || act === 3) {
      return undefined;
    }

    videoElement.muted = true;
    videoElement.playsInline = true;
    const onReady = () => {
      void videoElement.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    };
    videoElement.addEventListener("loadeddata", onReady);
    onReady();
    return () => videoElement.removeEventListener("loadeddata", onReady);
  }, [videoElement, videoEnabled, act]);

  const panelKey = `${act}-${mobilePreview ? "mobile" : "desktop"}`;

  return (
    <div className="min-h-screen">
      <Leva
        collapsed={false}
        titleBar={{
          title: mobilePreview ? "Story · mobile tuning" : "Story · desktop tuning",
        }}
      />

      {videoEnabled && HERO_VIDEO_SRC && act !== 3 ? (
        <video
          ref={setVideoElement}
          className={HERO_VIDEO_OFFSCREEN_CLASS}
          src={HERO_VIDEO_SRC}
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoEnabled(false)}
        />
      ) : null}

      <StoryPlaygroundToolbar
        act={act}
        onActChange={setAct}
        mobilePreview={mobilePreview}
        onMobilePreviewChange={setMobilePreview}
        scrub={scrub}
        onScrubChange={setScrub}
      />

      <div
        className={
          mobilePreview
            ? "dev-story-scene-host dev-story-scene-host--mobile-preview"
            : "dev-story-scene-host"
        }
      >
        {act === 3 ? (
          <Act3Playground key={panelKey} mobilePreview={mobilePreview} scrub={scrub} />
        ) : (
          <HeroActPlayground
            key={panelKey}
            act={act}
            mobilePreview={mobilePreview}
            scrub={scrub}
            videoElement={videoElement}
          />
        )}
      </div>
    </div>
  );
}

export default function PlaygroundClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-agency-ink">
          Loading story playground…
        </div>
      }
    >
      <PlaygroundInner />
    </Suspense>
  );
}
