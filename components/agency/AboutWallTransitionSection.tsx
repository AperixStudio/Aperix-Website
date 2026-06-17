"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import UnicornScene from "unicornstudio-react/next";
import {
  ABOUT_HERO_IMAGE_SRC,
  ABOUT_PANEL2_UNICORN_PROJECT_ID,
  ABOUT_UNICORN_PROJECT_ID,
  ABOUT_UNICORN_RENDER,
  ABOUT_UNICORN_SDK_URL,
} from "@/lib/aboutContent";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMobileViewport } from "@/lib/useMobileViewport";
import "./AboutWallTransitionSection.css";

const PANEL_COUNT = 3;
/** Vertical scroll runway while the viewport stays pinned (one panel per 100vh). */
const SCROLL_HEIGHT_VH = PANEL_COUNT * 100;

const TRANSITION_PANELS = [
  {
    index: "01",
    title: "Melbourne based studio.",
    lede: "Built in Melbourne — Open to all types of projects no matter the size.",
  },
  {
    index: "02",
    title: "Small team, big care.",
    lede:
      "Just two mates who over time have worked on many projects — from app development to web design and want to help turn your ideas into a reality.",
  },
] as const;

function AboutPanelUnicornField() {
  const { isMobile, ready } = useMobileViewport();

  if (!ready) {
    return null;
  }

  const renderQuality = isMobile ? ABOUT_UNICORN_RENDER.mobile : ABOUT_UNICORN_RENDER.desktop;

  return (
    <div className="about-wall-panel__unicorn-field" aria-hidden="true">
      <UnicornScene
        projectId={ABOUT_UNICORN_PROJECT_ID}
        sdkUrl={ABOUT_UNICORN_SDK_URL}
        width="100%"
        height="100%"
        scale={renderQuality.scale}
        dpi={renderQuality.dpi}
        fps={renderQuality.fps}
        lazyLoad
        production
        altText="Decorative studio animation"
        ariaLabel="Decorative studio animation"
        className="about-wall-panel__unicorn-scene"
      />
    </div>
  );
}

function AboutPanel2UnicornField() {
  const { isMobile, ready } = useMobileViewport();

  if (!ready) {
    return null;
  }

  const renderQuality = isMobile ? ABOUT_UNICORN_RENDER.mobile : ABOUT_UNICORN_RENDER.desktop;

  return (
    <div className="about-wall-panel__unicorn-field" aria-hidden="true">
      <UnicornScene
        projectId={ABOUT_PANEL2_UNICORN_PROJECT_ID}
        sdkUrl={ABOUT_UNICORN_SDK_URL}
        width="100%"
        height="100%"
        scale={renderQuality.scale}
        dpi={renderQuality.dpi}
        fps={renderQuality.fps}
        lazyLoad
        production
        altText="Decorative studio animation"
        ariaLabel="Decorative studio animation"
        className="about-wall-panel__unicorn-scene"
      />
    </div>
  );
}

function TransitionPanel({
  panel,
  showUnicorn = false,
  showUnicorn2 = false,
}: {
  panel: (typeof TRANSITION_PANELS)[number];
  showUnicorn?: boolean;
  showUnicorn2?: boolean;
}) {
  return (
    <article
      className="about-wall-panel about-wall-panel--transition"
      aria-label={panel.title}
    >
      {showUnicorn ? <AboutPanelUnicornField /> : null}
      {showUnicorn2 ? <AboutPanel2UnicornField /> : null}
      <div className="about-wall-panel__inner">
        <p className="about-wall-panel__index">Panel {panel.index}</p>
        <h2 className="about-wall-panel__title">{panel.title}</h2>
        <p className="about-wall-panel__lede">{panel.lede}</p>
      </div>
    </article>
  );
}

function ProgressDots({ activePanel }: { activePanel: number }) {
  return (
    <div className="about-wall-progress" aria-hidden="true">
      {Array.from({ length: PANEL_COUNT }, (_, index) => (
        <span
          key={index}
          className={`about-wall-progress__dot${activePanel === index ? " about-wall-progress__dot--active" : ""}`}
        />
      ))}
    </div>
  );
}

function AboutHeroPanel({ showLink = true }: { showLink?: boolean }) {
  return (
    <div className="about-wall-about">
      <div className="about-wall-about__media">
        {ABOUT_HERO_IMAGE_SRC ? (
          <Image
            src={ABOUT_HERO_IMAGE_SRC}
            alt="About Aperix Studio"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="about-wall-about__placeholder">
            <span className="about-wall-about__placeholder-label">Photo placeholder</span>
            <span>Full-page about image goes here</span>
          </div>
        )}
        <div className="about-wall-about__overlay">
          <p className="about-wall-about__kicker">About us</p>
          <h2 className="about-wall-about__heading">The people behind the pixels.</h2>
          {showLink ? (
            <Link href="/about" className="about-wall-about__cta">
              Meet the studio
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AboutWallTransitionSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(PANEL_COUNT - 1) * 100}vw`],
  );

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 0.14], [1, 1, 0]);

  const activePanelMotion = useTransform(scrollYProgress, (value) =>
    Math.min(PANEL_COUNT - 1, Math.max(0, Math.round(value * (PANEL_COUNT - 1)))),
  );

  useMotionValueEvent(activePanelMotion, "change", (value) => {
    setActivePanel(value);
  });

  if (prefersReduced) {
    return (
      <section
        id="about"
        className="about-wall-section about-wall-section--static"
        aria-label="About us"
      >
        <AboutHeroPanel />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-wall-section"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      aria-label="About us"
    >
      <div className="about-wall-stage">
        <motion.div className="about-wall-track" style={{ x: trackX }}>
          {TRANSITION_PANELS.map((panel, index) => (
            <TransitionPanel
              key={panel.index}
              panel={panel}
              showUnicorn={index === 0}
              showUnicorn2={index === 1}
            />
          ))}

          <article className="about-wall-panel about-wall-panel--about" aria-label="About us">
            <AboutHeroPanel />
          </article>
        </motion.div>

        <motion.p className="about-wall-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
          Keep scrolling
        </motion.p>
        <ProgressDots activePanel={activePanel} />
      </div>
    </section>
  );
}
