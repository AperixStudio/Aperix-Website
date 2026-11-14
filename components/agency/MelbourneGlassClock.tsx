"use client";

import { useEffect, useState } from "react";
import {
  getMelbourneClockFace,
  type MelbourneClockFace,
} from "@/lib/melbourneTime";
import "./MelbourneGlassClock.css";

const SEGMENT_POINTS: Record<string, string> = {
  a: "4.4,2.15 6.5,0.45 25.5,0.45 27.6,2.15 25.5,3.85 6.5,3.85",
  b: "28.55,4.7 30.15,6.15 30.15,24.35 28.55,25.9 26.95,24.35 26.95,6.15",
  c: "28.55,32.1 30.15,33.55 30.15,51.75 28.55,53.3 26.95,51.75 26.95,33.55",
  d: "4.4,55.85 6.5,54.15 25.5,54.15 27.6,55.85 25.5,57.55 6.5,57.55",
  e: "3.45,32.1 5.05,33.55 5.05,51.75 3.45,53.3 1.85,51.75 1.85,33.55",
  f: "3.45,4.7 5.05,6.15 5.05,24.35 3.45,25.9 1.85,24.35 1.85,6.15",
  g: "4.4,29 6.5,27.3 25.5,27.3 27.6,29 25.5,30.7 6.5,30.7",
};

const LIT_SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

function SegmentDigit({ value }: { value: string }) {
  const lit = LIT_SEGMENTS[value] ?? "";

  return (
    <svg
      className="glass-clock__digit"
      viewBox="0 0 32 58"
      aria-hidden="true"
    >
      {Object.entries(SEGMENT_POINTS).map(([id, points]) => (
        <polygon
          key={id}
          points={points}
          className={lit.includes(id) ? "seg is-on" : "seg"}
        />
      ))}
    </svg>
  );
}

function DigitPair({ value }: { value: string }) {
  const padded = value.padStart(2, "0").slice(-2);

  return (
    <span className="glass-clock__pair">
      <SegmentDigit value={padded[0] ?? "0"} />
      <SegmentDigit value={padded[1] ?? "0"} />
    </span>
  );
}

export default function MelbourneGlassClock() {
  const [face, setFace] = useState<MelbourneClockFace | null>(null);

  useEffect(() => {
    let timeoutId = 0;

    const tick = () => {
      setFace(getMelbourneClockFace());
      const delay = 1000 - (Date.now() % 1000) + 20;
      timeoutId = window.setTimeout(tick, delay);
    };

    tick();
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!face) return null;

  const spoken = `Melbourne time ${face.hours}:${face.minutes}, ${face.weekday} ${face.day} ${face.month}`;

  return (
    <div className="glass-clock">
      <svg aria-hidden="true" className="glass-clock__defs">
        <defs>
          <filter
            id="melbourne-glass-clock"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves={2}
              seed={4}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation={1.6} result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={16}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id="glass-clock-seg-on" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d5ecff" />
          </linearGradient>
        </defs>
      </svg>

      <time className="glass-clock__face" dateTime={`${face.hours}:${face.minutes}`} aria-label={spoken}>
        <span className="glass-clock__digits">
          <DigitPair value={face.hours} />
          <DigitPair value={face.minutes} />
        </span>

        <span className="glass-clock__side">
          <span className="glass-clock__meta">
            <span className="glass-clock__place">Melbourne</span>
            <span className="glass-clock__weekday">{face.weekday}</span>
          </span>
          <span className="glass-clock__date">
            {face.day}, {face.month}
          </span>
        </span>
      </time>
    </div>
  );
}
