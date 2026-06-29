/**
 * SocialProofBoard — airport-style split-flap departure board for homepage social proof.
 *
 * Three rows show random departure times, cycling studio phrases, and random destination
 * cities — refreshed together on each cycle. Flip animation mirrors MelbourneFlipClock.
 *
 * @see SOCIAL_PROOF_BOARD_IMPLEMENTATION_BRIEF.md
 * @see lib/socialProofContent.ts
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  generateDepartureRowMeta,
  getVisibleSocialProofPhrases,
  SOCIAL_PROOF_PHRASES,
  SOCIAL_PROOF_VISIBLE_ROWS,
  type DepartureRowMeta,
} from "@/lib/socialProofContent";
import { useInView } from "@/lib/useInView";
import { useMobileViewport } from "@/lib/useMobileViewport";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./SocialProofBoard.css";

/** Milliseconds between board refreshes (phrases, times, and cities shift together). */
const CYCLE_MS = 4000;
const TOUCH_CYCLE_MS = 4000;

/** Stagger flip start per row so lines update top → bottom like a real board. */
const ROW_FLIP_STAGGER_S = 0.1;

const FLIP_TRANSITION = {
  y: { type: "spring" as const, visualDuration: 0.42, bounce: 0.12 },
  opacity: { duration: 0.14, ease: "easeOut" as const },
  filter: { duration: 0.14, ease: "easeOut" as const },
};

function PlaneIcon() {
  return (
    <svg
      className="social-proof-board__plane"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.5 12.5 9 11l8.5-5.5a1 1 0 0 1 1.4.35l1.1 1.9a1 1 0 0 1-.25 1.25L14 11.5l6.5 1.5a1 1 0 0 1 .65 1.55l-1.75 2.5a1 1 0 0 1-.9.45H14l-2.5 4.5a1 1 0 0 1-1.74 0L7.5 17.5H4.5a1 1 0 0 1-.95-.68l-1-3a1 1 0 0 1 .65-1.24l3.3-.58Z" />
    </svg>
  );
}

function AnimatedFlapChar({
  value,
  flipDelay = 0,
}: {
  value: string;
  flipDelay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const display = value === " " ? "\u00A0" : value;

  return (
    <div className="board-flap" aria-hidden="true">
      <div className="board-flap__card">
        <span className="board-flap__hinge board-flap__hinge--left" />
        <span className="board-flap__hinge board-flap__hinge--right" />
        <span className="board-flap__split" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="board-flap__tick"
            initial={
              prefersReduced
                ? false
                : { y: "100%", opacity: 0, filter: "blur(2px)" }
            }
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={
              prefersReduced
                ? undefined
                : { y: "-100%", opacity: 0, filter: "blur(2px)" }
            }
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    y: { ...FLIP_TRANSITION.y, delay: flipDelay },
                    opacity: { ...FLIP_TRANSITION.opacity, delay: flipDelay },
                    filter: { ...FLIP_TRANSITION.filter, delay: flipDelay },
                  }
            }
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FlapRow({
  text,
  flipDelay = 0,
  variant,
}: {
  text: string;
  flipDelay?: number;
  variant?: "desktop" | "mobile";
}) {
  const variantClass = variant
    ? ` social-proof-board__flap-row--${variant}`
    : "";

  return (
    <div
      className={`social-proof-board__flap-row${variantClass}`}
      aria-hidden="true"
    >
      {text.split("").map((char, index) => (
        <AnimatedFlapChar key={index} value={char} flipDelay={flipDelay} />
      ))}
    </div>
  );
}

function TouchBoardRow({
  time,
  message,
  cityCode,
  rowIndex,
}: {
  time: string;
  message: string;
  cityCode: string;
  rowIndex: number;
}) {
  return (
    <div
      className="social-proof-board__row social-proof-board__row--touch"
      style={{ animationDelay: `${rowIndex * 0.08}s` }}
    >
      <div className="social-proof-board__cell social-proof-board__cell--time">
        <span className="social-proof-board__touch-text">{time.trim()}</span>
      </div>
      <div className="social-proof-board__cell social-proof-board__cell--message">
        <span className="social-proof-board__touch-text">{message.trim()}</span>
      </div>
      <div className="social-proof-board__cell social-proof-board__cell--destination">
        <span className="social-proof-board__touch-text">{cityCode.trim()}</span>
      </div>
    </div>
  );
}

/** One departure line: Time | Message | Destination. */
function BoardRow({
  time,
  message,
  city,
  cityCode,
  rowIndex,
}: {
  time: string;
  message: string;
  city: string;
  cityCode: string;
  rowIndex: number;
}) {
  const flipDelay = rowIndex * ROW_FLIP_STAGGER_S;

  return (
    <div className="social-proof-board__row">
      <div className="social-proof-board__cell social-proof-board__cell--time">
        <FlapRow text={time} flipDelay={flipDelay} />
      </div>

      <div className="social-proof-board__cell social-proof-board__cell--message">
        <FlapRow text={message} flipDelay={flipDelay} />
      </div>

      <div className="social-proof-board__cell social-proof-board__cell--destination">
        <FlapRow text={city} flipDelay={flipDelay} variant="desktop" />
        <FlapRow text={cityCode} flipDelay={flipDelay} variant="mobile" />
      </div>
    </div>
  );
}

export default function SocialProofBoard() {
  const prefersReduced = useReducedMotion();
  const { isMobile } = useMobileViewport();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { rootMargin: "60px 0px" });
  const touchBoard = isMobile;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [departureRows, setDepartureRows] = useState<DepartureRowMeta[]>(() =>
    generateDepartureRowMeta(SOCIAL_PROOF_VISIBLE_ROWS),
  );

  useEffect(() => {
    if (prefersReduced || !inView) {
      return undefined;
    }

    const cycleMs = touchBoard ? TOUCH_CYCLE_MS : CYCLE_MS;
    const intervalId = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % SOCIAL_PROOF_PHRASES.length);
      setDepartureRows(generateDepartureRowMeta(SOCIAL_PROOF_VISIBLE_ROWS));
    }, cycleMs);

    return () => window.clearInterval(intervalId);
  }, [prefersReduced, inView, touchBoard]);

  const visiblePhrases = getVisibleSocialProofPhrases(phraseIndex);

  return (
    <section
      ref={sectionRef}
      aria-label="Studio departures board"
      className={`social-proof-board${touchBoard ? " social-proof-board--touch" : ""}`}
    >
      <div className="social-proof-board__frame">
        <header className="social-proof-board__header">
          <PlaneIcon />
          <h2 className="social-proof-board__title">Studio Services Board</h2>
          <PlaneIcon />
        </header>

        <div className="social-proof-board__columns" aria-hidden="true">
          <span>Time</span>
          <span>
            <span className="social-proof-board__columns-label social-proof-board__columns-label--desktop">
              Message
            </span>
            <span className="social-proof-board__columns-label social-proof-board__columns-label--mobile">
              Message
            </span>
          </span>
          <span>
            <span className="social-proof-board__columns-label social-proof-board__columns-label--desktop">
              Destination
            </span>
            <span className="social-proof-board__columns-label social-proof-board__columns-label--mobile">
              Dest
            </span>
          </span>
        </div>

        <div
          className="social-proof-board__body"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">
            {visiblePhrases
              .map((phrase, rowIndex) => {
                const departure = departureRows[rowIndex];
                if (!departure) {
                  return phrase.plain;
                }

                return `${departure.time} to ${departure.city}: ${phrase.plain}`;
              })
              .join(". ")}
          </span>

          {visiblePhrases.map((phrase, rowIndex) => {
            const departure = departureRows[rowIndex];
            if (!departure) {
              return null;
            }

            if (touchBoard) {
              return (
                <TouchBoardRow
                  key={`${phraseIndex}-${rowIndex}-${departure.time}-${departure.cityCode}`}
                  time={departure.timeFormatted}
                  message={phrase.formatted}
                  cityCode={departure.cityCodeFormatted}
                  rowIndex={rowIndex}
                />
              );
            }

            return (
              <BoardRow
                key={rowIndex}
                time={departure.timeFormatted}
                message={phrase.formatted}
                city={departure.cityFormatted}
                cityCode={departure.cityCodeFormatted}
                rowIndex={rowIndex}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
