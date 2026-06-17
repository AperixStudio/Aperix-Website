"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  formatMelbourneFlipClock,
  getMelbourneTimeParts,
  type MelbourneTimeParts,
} from "@/lib/melbourneTime";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./MelbourneFlipClock.css";

const DIGIT_TRANSITION = {
  y: { type: "spring" as const, visualDuration: 0.38, bounce: 0.14 },
  opacity: { duration: 0.16, ease: "easeOut" as const },
  filter: { duration: 0.16, ease: "easeOut" as const },
};

function AnimatedDigit({ value }: { value: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flip-digit" aria-hidden="true">
      <div className="flip-digit__card">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="flip-digit__tick"
            initial={
              prefersReduced
                ? false
                : { y: "100%", opacity: 0, filter: "blur(3px)" }
            }
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={
              prefersReduced
                ? undefined
                : { y: "-100%", opacity: 0, filter: "blur(3px)" }
            }
            transition={prefersReduced ? { duration: 0 } : DIGIT_TRANSITION}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DigitPair({ value }: { value: string }) {
  const padded = value.padStart(2, "0").slice(-2);
  const tens = padded[0] ?? "0";
  const ones = padded[1] ?? "0";

  return (
    <div className="flip-clock__group">
      <AnimatedDigit value={tens} />
      <AnimatedDigit value={ones} />
    </div>
  );
}

function FlipSeparator() {
  return (
    <span className="flip-clock__separator" aria-hidden="true">
      :
    </span>
  );
}

export default function MelbourneFlipClock() {
  const [time, setTime] = useState<MelbourneTimeParts>(() => getMelbourneTimeParts());

  useEffect(() => {
    const tick = () => setTime(getMelbourneTimeParts());
    tick();

    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const clockLabel = formatMelbourneFlipClock(time);

  return (
    <div className="flip-clock">
      <div className="flip-clock__meta">
        <span>Melbourne</span>
        <span aria-hidden="true">·</span>
        <span>{time.timeZoneName}</span>
      </div>

      <time
        className="flip-clock__face"
        dateTime={clockLabel}
        aria-label={`Melbourne time ${clockLabel} ${time.timeZoneName}`}
      >
        <DigitPair value={time.hours} />
        <FlipSeparator />
        <DigitPair value={time.minutes} />
        <FlipSeparator />
        <DigitPair value={time.seconds} />
      </time>
    </div>
  );
}
