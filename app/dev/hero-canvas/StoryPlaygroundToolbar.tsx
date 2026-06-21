"use client";

import Link from "next/link";
import type { StoryPlaygroundAct } from "@/lib/dev/storyPlaygroundProgress";
import { STORY_PLAYGROUND_ACT_LABELS } from "@/lib/dev/storyPlaygroundProgress";
import {
  MOBILE_PREVIEW_HEIGHT,
  MOBILE_PREVIEW_WIDTH,
} from "@/lib/dev/mobilePreviewViewport";

type StoryPlaygroundToolbarProps = {
  act: StoryPlaygroundAct;
  onActChange: (act: StoryPlaygroundAct) => void;
  mobilePreview: boolean;
  onMobilePreviewChange: (value: boolean) => void;
  scrub: number;
  onScrubChange: (value: number) => void;
  stickyScroll?: boolean;
  onStickyScrollChange?: (value: boolean) => void;
  showStickyToggle?: boolean;
  /** Leva playground (default) vs Theatre.js editor */
  editor?: "leva" | "theatre";
  theatreReady?: boolean;
  onShowTheatrePanel?: () => void;
  onExportTheatre?: () => void;
};

export default function StoryPlaygroundToolbar({
  act,
  onActChange,
  mobilePreview,
  onMobilePreviewChange,
  scrub,
  onScrubChange,
  stickyScroll = false,
  onStickyScrollChange,
  showStickyToggle = false,
  editor = "leva",
  theatreReady = false,
  onShowTheatrePanel,
  onExportTheatre,
}: StoryPlaygroundToolbarProps) {
  const acts: StoryPlaygroundAct[] = editor === "theatre" ? [1, 2] : [1, 2, 3];

  return (
    <div className="dev-story-toolbar">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {acts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onActChange(value)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                act === value
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              Act {value}
            </button>
          ))}

          {editor === "theatre" ? (
            <>
              <Link
                href="/dev/hero-canvas"
                className="ml-auto rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/80 hover:bg-white/20"
              >
                Leva playground
              </Link>
              <button
                type="button"
                onClick={onShowTheatrePanel}
                disabled={!theatreReady}
                className="rounded-full bg-violet-500/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-violet-100 hover:bg-violet-500/40 disabled:opacity-40"
              >
                Show timeline
              </button>
              <button
                type="button"
                onClick={onExportTheatre}
                disabled={!theatreReady}
                className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/80 hover:bg-white/20 disabled:opacity-40"
              >
                Copy state
              </button>
            </>
          ) : (
            <Link
              href="/dev/hero-theatre"
              className="ml-auto rounded-full bg-violet-500/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-violet-200 hover:bg-violet-500/30"
            >
              Theatre.js
            </Link>
          )}

          <label
            className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/80 ${
              editor === "leva" ? "" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={mobilePreview}
              onChange={(event) => onMobilePreviewChange(event.target.checked)}
            />
            Mobile preview
          </label>
        </div>

        <p className="font-mono text-xs text-white/70">{STORY_PLAYGROUND_ACT_LABELS[act]}</p>

        {editor === "theatre" ? (
          <p className="font-mono text-[10px] leading-relaxed text-white/50">
            Theatre timeline sits in the <strong className="text-white/70">bottom ~40%</strong> of the
            window. Expand <strong className="text-white/70">Aperix Hero → Act 1/Act 2</strong> in the
            left outline, then keyframe Model / Camera / Screen. If you don&apos;t see it, click{" "}
            <strong className="text-white/70">Show timeline</strong>.
          </p>
        ) : null}

        {showStickyToggle && onStickyScrollChange ? (
          <label className="flex items-center gap-2 font-mono text-[11px] text-white/70">
            <input
              type="checkbox"
              checked={stickyScroll}
              onChange={(event) => onStickyScrollChange(event.target.checked)}
            />
            Sticky scroll mode
          </label>
        ) : null}

        {!stickyScroll ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
                Scrub
              </span>
              <span className="font-mono text-xs text-white">{(scrub * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={scrub}
              onChange={(event) => onScrubChange(Number(event.target.value))}
              className="w-full"
            />

            {editor === "leva" && act === 2 ? (
              <p className="font-mono text-[10px] leading-relaxed text-white/50">
                Scrub drives the PC slide + monitor evolution together. Tune endpoints with Leva{" "}
                <strong className="text-white/70">Model start (Act 2)</strong> /{" "}
                <strong className="text-white/70">Model end (Act 2)</strong> — fully independent of Act 1.
              </p>
            ) : null}
          </>
        ) : (
          <p className="font-mono text-[11px] text-white/60">Sticky scroll active — scroll the page</p>
        )}

        {mobilePreview ? (
          <p className="font-mono text-[10px] leading-relaxed text-white/50">
            Mobile preview — {MOBILE_PREVIEW_WIDTH}×{MOBILE_PREVIEW_HEIGHT}px phone frame (matches
            homepage mobile aspect). Export with{" "}
            <strong className="text-white/70">
              {editor === "theatre" ? "Copy state" : "Copy mobile overrides"}
            </strong>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
