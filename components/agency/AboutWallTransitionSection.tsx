"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import UnicornScene from "unicornstudio-react/next";
import MelbourneFlipClock from "@/components/agency/MelbourneFlipClock";
import AboutPanel2MergeLanes from "@/components/agency/AboutPanel2MergeLanes";
import {
  ABOUT_PANEL1_UNICORN_JSON,
  ABOUT_TEAM_PANEL_PHOTOS,
  ABOUT_UNICORN_RENDER,
  ABOUT_UNICORN_SDK_URL,
  MELBOURNE_COORDINATES,
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
    title: "Rooted in Melbourne. Open to the world.",
    lede: "Built in Melbourne — Happy for a video call from wherever you are in the world.",
  },
  {
    index: "02",
    title: "Small team, big care.",
    lede:
      "Just two mates who over time have worked on many projects — from app development to web design and want to help turn your ideas into a reality.",
  },
] as const;

function AboutPanel1UnicornField() {
  const { isMobile, ready } = useMobileViewport();

  if (!ready) {
    return null;
  }

  const renderQuality = isMobile ? ABOUT_UNICORN_RENDER.mobile : ABOUT_UNICORN_RENDER.desktop;

  return (
    <div className="about-wall-panel__unicorn-field about-wall-panel__unicorn-field--panel1" aria-hidden="true">
      <UnicornScene
        jsonFilePath={ABOUT_PANEL1_UNICORN_JSON}
        sdkUrl={ABOUT_UNICORN_SDK_URL}
        width="100%"
        height="100%"
        scale={renderQuality.scale}
        dpi={renderQuality.dpi}
        fps={renderQuality.fps}
        lazyLoad
        altText="Decorative Melbourne studio scene"
        ariaLabel="Decorative Melbourne studio scene"
        className="about-wall-panel__unicorn-scene"
      />
    </div>
  );
}

/** Panel 01 — Unicorn scene + Melbourne clock and coordinates overlay. */
function AboutPanel1Field() {
  return (
    <>
      <AboutPanel1UnicornField />
      <div className="about-wall-panel1-chrome" aria-hidden="true">
        <p className="about-wall-panel1-chrome__coords">
          <span>{MELBOURNE_COORDINATES.latLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{MELBOURNE_COORDINATES.lngLabel}</span>
        </p>
        <div className="about-wall-panel1-chrome__clock">
          <MelbourneFlipClock />
        </div>
      </div>
    </>
  );
}

function AboutPanel2Field() {
  return <AboutPanel2MergeLanes />;
}

function TransitionPanel({
  panel,
  showPanel1 = false,
  showPanel2 = false,
}: {
  panel: (typeof TRANSITION_PANELS)[number];
  showPanel1?: boolean;
  showPanel2?: boolean;
}) {
  return (
    <article
      className={`about-wall-panel about-wall-panel--transition${showPanel1 ? " about-wall-panel--panel1" : ""}${showPanel2 ? " about-wall-panel--panel2" : ""}`}
      aria-label={panel.title}
    >
      {showPanel1 ? <AboutPanel1Field /> : null}
      {showPanel2 ? <AboutPanel2Field /> : null}
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
  const { left, right } = ABOUT_TEAM_PANEL_PHOTOS;

  return (
    <div className="about-wall-about">
      <div className="about-wall-about__media">
        <div className="about-wall-about__photos">
          <div className="about-wall-about__photo about-wall-about__photo--left">
            {left.src ? (
              <Image
                src={left.src}
                alt={left.alt}
                fill
                priority={false}
                sizes="50vw"
                className="object-cover"
              />
            ) : (
              <div className="about-wall-about__photo-placeholder">
                <span className="about-wall-about__placeholder-label">Photo placeholder</span>
                <span>Team photo</span>
              </div>
            )}
          </div>

          <div className="about-wall-about__photo about-wall-about__photo--right">
            {right.src ? (
              <Image
                src={right.src}
                alt={right.alt}
                fill
                priority={false}
                sizes="50vw"
                className="object-cover"
              />
            ) : (
              <div className="about-wall-about__photo-placeholder">
                <span className="about-wall-about__placeholder-label">Photo placeholder</span>
                <span>Team photo</span>
              </div>
            )}
          </div>
        </div>

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

function scrollAboutSectionToStart(section: HTMLElement) {
  const top = section.offsetTop;
  window.scrollTo({ top, left: 0, behavior: "auto" });
}

export default function AboutWallTransitionSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    if (prefersReduced) {
      return undefined;
    }

    const syncAboutHashScroll = () => {
      if (window.location.hash !== "#about") {
        return;
      }

      const section = sectionRef.current;
      if (!section) {
        return;
      }

      scrollAboutSectionToStart(section);
    };

    syncAboutHashScroll();
    window.addEventListener("hashchange", syncAboutHashScroll);

    return () => {
      window.removeEventListener("hashchange", syncAboutHashScroll);
    };
  }, [prefersReduced]);

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
        className="about-wall-section about-wall-section--static"
        aria-label="About us"
      >
        <div id="about" className="about-wall-section__anchor" aria-hidden="true" />
        <AboutHeroPanel />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="about-wall-section"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      aria-label="About us"
    >
      <div id="about" className="about-wall-section__anchor" aria-hidden="true" />
      <div className="about-wall-stage">
        <motion.div className="about-wall-track" style={{ x: trackX }}>
          {TRANSITION_PANELS.map((panel, index) => (
            <TransitionPanel
              key={panel.index}
              panel={panel}
              showPanel1={index === 0}
              showPanel2={index === 1}
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
