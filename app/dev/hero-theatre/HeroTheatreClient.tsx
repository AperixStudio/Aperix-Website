"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import HeroCanvas from "@/components/animations/HeroCanvas";
import { ensureHeroTheatreProject, getHeroTheatreSheet } from "@/lib/dev/heroTheatre/project";
import { readHeroTheatreRig } from "@/lib/dev/heroTheatre/readRig";
import {
  exportHeroTheatreState,
  initHeroTheatreStudio,
  showHeroTheatrePanel,
} from "@/lib/dev/heroTheatre/studio";
import { HERO_THEATRE_SEQUENCE_LENGTH } from "@/lib/dev/heroTheatre/types";
import {
  mapPlaygroundScrub,
  type StoryPlaygroundAct,
} from "@/lib/dev/storyPlaygroundProgress";
import {
  HERO_VIDEO_OFFSCREEN_CLASS,
  HERO_VIDEO_SRC,
} from "@/lib/heroVideo";
import StoryPlaygroundToolbar from "../hero-canvas/StoryPlaygroundToolbar";
import "../hero-canvas/playground.css";
import "./theatre.css";
import "@/components/animations/HeroCanvas.css";

export default function HeroTheatreClient() {
  const [act, setAct] = useState<StoryPlaygroundAct>(1);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [scrub, setScrub] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(Boolean(HERO_VIDEO_SRC));
  const [studioReady, setStudioReady] = useState(false);
  const actRef = useRef<StoryPlaygroundAct>(1);

  const heroProgress = useMotionValue(0);
  const screenEvolution = useMotionValue(0);

  actRef.current = act;

  useEffect(() => {
    document.body.classList.add("dev-hero-theatre-active");
    return () => document.body.classList.remove("dev-hero-theatre-active");
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      // Objects must exist before Studio initialises so they appear in the outline.
      ensureHeroTheatreProject();
      await initHeroTheatreStudio();
      if (!cancelled) {
        setStudioReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const mapped = mapPlaygroundScrub(actRef.current, scrub);
    heroProgress.set(mapped.heroProgress);
    screenEvolution.set(mapped.screenEvolution);
  }, [act, scrub, heroProgress, screenEvolution]);

  useEffect(() => {
    if (!studioReady) {
      return;
    }

    const sheetAct = actRef.current === 2 ? 2 : 1;
    const { sheet } =
      sheetAct === 2 ? getHeroTheatreSheet(2) : getHeroTheatreSheet(1);
    sheet.sequence.position = scrub * HERO_THEATRE_SEQUENCE_LENGTH;
  }, [act, scrub, studioReady]);

  useEffect(() => {
    if (!videoElement || !videoEnabled) {
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
  }, [videoElement, videoEnabled]);

  const getTheatreRig = useCallback(() => {
    if (!studioReady) {
      return null;
    }
    return readHeroTheatreRig(actRef.current === 2 ? 2 : 1);
  }, [studioReady]);

  const handleShowPanel = useCallback(() => {
    void showHeroTheatrePanel();
  }, []);

  const handleExportState = useCallback(async () => {
    const state = await exportHeroTheatreState();
    const text = JSON.stringify(state, null, 2);
    void navigator.clipboard.writeText(text);
    console.log("Theatre state copied — save as lib/dev/heroTheatre/hero.theatre-state.json:\n", text);
  }, []);

  return (
    <div className="dev-hero-theatre-page min-h-screen">
      {videoEnabled && HERO_VIDEO_SRC ? (
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
        editor="theatre"
        theatreReady={studioReady}
        onShowTheatrePanel={handleShowPanel}
        onExportTheatre={() => void handleExportState()}
      />

      {studioReady ? (
        <p className="dev-hero-theatre-hint" aria-hidden="true">
          Theatre timeline is below this area. Open the left outline → Aperix Hero → Act {act}.
        </p>
      ) : null}

      <div
        className={
          mobilePreview
            ? "dev-story-scene-host dev-story-scene-host--theatre dev-story-scene-host--mobile-preview"
            : "dev-story-scene-host dev-story-scene-host--theatre"
        }
      >
        <div className={mobilePreview ? "dev-story-mobile-shell" : "h-full w-full"}>
          <div className="h-full w-full">
            {studioReady ? (
              <HeroCanvas
                scrollProgress={heroProgress}
                screenEvolutionProgress={act === 2 ? screenEvolution : null}
                getTheatreRig={getTheatreRig}
                liveConfig={{}}
                videoElement={videoElement}
                showIntroLabel={act === 1}
                simulateMobileViewport={mobilePreview}
                className="hero-canvas--scroll h-full min-h-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-sm text-white/70">
                Loading Theatre.js…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
