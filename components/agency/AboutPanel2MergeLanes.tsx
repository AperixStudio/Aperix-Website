"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./AboutPanel2MergeLanes.css";

const CYCLE_S = 9;

const DESIGN_PATH =
  "M 28 78 C 88 78, 128 92, 168 118 C 198 136, 218 138, 238 138";
const BUILD_PATH =
  "M 28 162 C 88 162, 128 148, 168 122 C 198 104, 218 102, 238 102";

const FLOW_TRANSITION = {
  duration: CYCLE_S,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

function MergeGraphic({ animated }: { animated: boolean }) {
  const pulse = animated
    ? {
        opacity: [0.35, 0.35, 1, 1, 0.55, 0.35],
        scale: [0.96, 0.96, 1, 1.02, 1, 0.96],
      }
    : { opacity: 1, scale: 1 };

  const pulseTransition = animated
    ? { ...FLOW_TRANSITION, times: [0, 0.42, 0.52, 0.62, 0.74, 1] }
    : { duration: 0 };

  const laneStroke = animated
    ? { opacity: [0.28, 0.55, 0.72, 0.72, 0.4, 0.28] }
    : { opacity: 0.65 };

  const laneTransition = animated
    ? { ...FLOW_TRANSITION, times: [0, 0.28, 0.48, 0.62, 0.78, 1] }
    : { duration: 0 };

  const checkOpacity = animated
    ? { opacity: [0, 0, 0, 1, 1, 0] }
    : { opacity: 0.85 };

  const checkTransition = animated
    ? { ...FLOW_TRANSITION, times: [0, 0.48, 0.54, 0.58, 0.72, 0.88] }
    : { duration: 0 };

  return (
    <svg
      className="about-panel2-merge__graphic"
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="about-panel2-design-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(186, 230, 253, 0.15)" />
          <stop offset="100%" stopColor="rgba(56, 189, 248, 0.85)" />
        </linearGradient>
        <linearGradient id="about-panel2-build-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(148, 163, 184, 0.12)" />
          <stop offset="100%" stopColor="rgba(56, 189, 248, 0.55)" />
        </linearGradient>
        <filter id="about-panel2-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text className="about-panel2-merge__lane-label" x="28" y="62">
        Design
      </text>
      <text className="about-panel2-merge__lane-label" x="28" y="182">
        Build
      </text>

      <motion.path
        className="about-panel2-merge__lane about-panel2-merge__lane--design"
        d={DESIGN_PATH}
        animate={laneStroke}
        transition={laneTransition}
      />
      <motion.path
        className="about-panel2-merge__lane about-panel2-merge__lane--build"
        d={BUILD_PATH}
        animate={laneStroke}
        transition={laneTransition}
      />

      {animated ? (
        <>
          <motion.circle
            className="about-panel2-merge__particle about-panel2-merge__particle--design"
            r="4"
            animate={{ offsetDistance: ["0%", "100%", "100%"] }}
            transition={{ ...FLOW_TRANSITION, times: [0, 0.48, 1] }}
            style={{ offsetPath: `path("${DESIGN_PATH}")` }}
          />
          <motion.circle
            className="about-panel2-merge__particle about-panel2-merge__particle--build"
            r="4"
            animate={{ offsetDistance: ["0%", "100%", "100%"] }}
            transition={{ ...FLOW_TRANSITION, times: [0.06, 0.5, 1] }}
            style={{ offsetPath: `path("${BUILD_PATH}")` }}
          />
          <motion.circle
            className="about-panel2-merge__particle about-panel2-merge__particle--design about-panel2-merge__particle--trail"
            r="2.5"
            animate={{ offsetDistance: ["0%", "100%", "100%"], opacity: [0, 0.7, 0] }}
            transition={{ ...FLOW_TRANSITION, times: [0, 0.46, 0.52] }}
            style={{ offsetPath: `path("${DESIGN_PATH}")` }}
          />
          <motion.circle
            className="about-panel2-merge__particle about-panel2-merge__particle--build about-panel2-merge__particle--trail"
            r="2.5"
            animate={{ offsetDistance: ["0%", "100%", "100%"], opacity: [0, 0.7, 0] }}
            transition={{ ...FLOW_TRANSITION, times: [0.06, 0.48, 0.54] }}
            style={{ offsetPath: `path("${BUILD_PATH}")` }}
          />
        </>
      ) : null}

      <motion.g
        className="about-panel2-merge__junction"
        animate={
          animated
            ? { opacity: [0.2, 0.2, 0.95, 0.95, 0.35, 0.2], scale: [0.85, 0.85, 1, 1.15, 1, 0.85] }
            : { opacity: 0.75, scale: 1 }
        }
        transition={
          animated
            ? { ...FLOW_TRANSITION, times: [0, 0.44, 0.52, 0.58, 0.7, 1] }
            : { duration: 0 }
        }
        style={{ transformOrigin: "238px 120px" }}
      >
        <circle cx="238" cy="120" r="10" fill="rgba(56, 189, 248, 0.22)" />
        <circle cx="238" cy="120" r="4" fill="rgba(186, 230, 253, 0.95)" />
      </motion.g>

      <motion.g
        className="about-panel2-merge__output"
        animate={pulse}
        transition={pulseTransition}
        style={{ transformOrigin: "292px 120px" }}
      >
        <rect
          className="about-panel2-merge__browser"
          x="252"
          y="82"
          width="108"
          height="76"
          rx="10"
        />
        <rect className="about-panel2-merge__browser-bar" x="252" y="82" width="108" height="18" rx="10" />
        <rect className="about-panel2-merge__browser-bar-fill" x="252" y="92" width="108" height="8" />
        <circle className="about-panel2-merge__browser-dot" cx="264" cy="91" r="2.2" />
        <circle className="about-panel2-merge__browser-dot about-panel2-merge__browser-dot--mid" cx="272" cy="91" r="2.2" />
        <circle className="about-panel2-merge__browser-dot about-panel2-merge__browser-dot--dim" cx="280" cy="91" r="2.2" />
        <rect className="about-panel2-merge__browser-url" x="288" y="87" width="58" height="7" rx="3.5" />
        <rect className="about-panel2-merge__browser-content" x="260" y="108" width="92" height="42" rx="4" />

        <motion.path
          className="about-panel2-merge__check"
          d="M 278 129 L 288 139 L 308 115"
          animate={checkOpacity}
          transition={checkTransition}
        />

        <motion.rect
          className="about-panel2-merge__browser-glow"
          x="252"
          y="82"
          width="108"
          height="76"
          rx="10"
          animate={
            animated
              ? { opacity: [0, 0, 0.55, 0.35, 0, 0] }
              : { opacity: 0.25 }
          }
          transition={
            animated
              ? { ...FLOW_TRANSITION, times: [0, 0.5, 0.58, 0.66, 0.78, 1] }
              : { duration: 0 }
          }
        />
      </motion.g>

      <path className="about-panel2-merge__connector" d="M 238 120 H 252" />
    </svg>
  );
}

export default function AboutPanel2MergeLanes() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="about-panel2-merge" aria-hidden="true">
      <div className="about-panel2-merge__stage">
        <MergeGraphic animated={!prefersReduced} />
        <p className="about-panel2-merge__caption">One team · one ship</p>
      </div>

      <p className="about-panel2-merge__stats">
        <span>Team · 02</span>
        <span aria-hidden="true">·</span>
        <span>Hand-offs · 00</span>
      </p>
    </div>
  );
}
