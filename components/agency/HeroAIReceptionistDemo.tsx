"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./HeroAIReceptionistDemo.css";

type Line = { from: "caller" | "ai"; text: string };

// Placeholder script — just enough to show the pitch (caller asks, bot
// checks availability, books it, confirms) without needing a real backend.
const SCRIPT: Line[] = [
  { from: "caller", text: "Hi, do you have anything free this Saturday?" },
  { from: "ai", text: "Let me check... I've got 10am or 2pm open — which suits you?" },
  { from: "caller", text: "2pm works great." },
  { from: "ai", text: "You're booked for 2pm Saturday. Confirmation is on its way." },
];

const STEP_MS = 2200; // gap between one line landing and the next starting
const TYPING_MS = 700; // how long the "..." shows before an AI line lands
const HOLD_MS = 2600; // pause on the finished transcript before it resets
const MAX_VISIBLE = 3; // older lines scroll off so the card stays compact

/**
 * Hero teaser for the AI call-receptionist feature — a small looping
 * "phone transcript" that sells the pitch at a glance (caller asks, bot
 * checks availability, books it) without needing a real call to happen.
 *
 * The CTA is a deliberate stub: no phone number or booking flow is wired
 * up yet, so the button is a visual placeholder only (see its onClick).
 * The UI is meant to ship as-is — swapping the handler for a real tel:
 * link / call-trigger is the only thing left to do once that exists.
 */
export default function HeroAIReceptionistDemo({ show }: { show: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(prefersReducedMotion ? SCRIPT.length : 0);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!show || prefersReducedMotion) return undefined;
    let cancelled = false;

    const tick = (next: number) => {
      if (cancelled) return;

      if (next > SCRIPT.length) {
        // Full script has played — hold it on screen, then clear and loop.
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setCount(0);
          timerRef.current = setTimeout(() => tick(1), 700);
        }, HOLD_MS);
        return;
      }

      const line = SCRIPT[next - 1];
      const isAi = line.from === "ai";
      if (isAi) setTyping(true);

      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        setTyping(false);
        setCount(next);
        timerRef.current = setTimeout(() => tick(next + 1), STEP_MS);
      }, isAi ? TYPING_MS : 250);
    };

    timerRef.current = setTimeout(() => tick(1), 900);
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [show, prefersReducedMotion]);

  const visible = SCRIPT.slice(0, count).slice(-MAX_VISIBLE);

  // TODO(partner): wire this up to the real AI receptionist demo — a
  // tel: link to the live demo line, or a "call me now" trigger. The UI
  // around it is ready; only this handler (and maybe the label) needs to
  // change once the backend exists.
  const handleTryDemo = () => {
    // Intentionally inert placeholder — see TODO above.
  };

  return (
    <motion.div
      className="home-hero__ai-demo hero-ai-demo"
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: show ? 0.2 : 0 }}
    >
      <div className="hero-ai-demo__head">
        <span className="hero-ai-demo__dot" aria-hidden="true" />
        <span className="hero-ai-demo__label">AI Receptionist — live demo</span>
      </div>

      <div className="hero-ai-demo__thread" aria-hidden="true">
        <AnimatePresence initial={false}>
          {visible.map((line, index) => (
            <motion.div
              key={`${count}-${index}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className={`hero-ai-demo__bubble hero-ai-demo__bubble--${line.from}`}
            >
              {line.text}
            </motion.div>
          ))}

          {typing && (
            <motion.div
              key={`typing-${count}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hero-ai-demo__bubble hero-ai-demo__bubble--ai hero-ai-demo__typing"
            >
              <span />
              <span />
              <span />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button type="button" className="hero-ai-demo__cta" onClick={handleTryDemo}>
        Try it live
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </motion.div>
  );
}
