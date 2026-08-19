"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LIVE_SITES, type LiveSite } from "@/lib/liveSites";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import WorkCursorLens from "@/components/agency/WorkCursorLens";
import "./HomeWorkSection.css";

/**
 * Our Work — opaque dark blue slab.
 *
 * Cards are stacked vertically, alternating sides: card 1 rests on the
 * left, card 2 on the right, and so on. Each spins in from off-screen on
 * the side opposite where it comes to rest — a left-resting card enters
 * from the right, a right-resting card enters from the left — driven by
 * the same scroll-triggered useInView() used for its fade.
 */

function WorkCard({ site, side }: { site: LiveSite; side: "left" | "right" }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(cardRef, { rootMargin: "10% 0px", threshold: 0.25 });
  const prefersReducedMotion = useReducedMotion();

  const previewVideo = "previewVideo" in site ? site.previewVideo : undefined;
  const previewImage = "preview" in site ? site.preview : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !previewVideo) {
      return;
    }

    if (inView && !prefersReducedMotion) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, prefersReducedMotion, previewVideo]);

  return (
    <article
      ref={cardRef}
      className={`home-work__card home-work__card--${side}${inView ? " is-visible" : ""}`}
    >
      <Link
        href={site.href}
        target="_blank"
        rel="noopener noreferrer"
        className="home-work__card-link"
        aria-label={`Open ${site.name} in a new tab`}
      >
        <div className="home-work__media">
          {previewVideo ? (
            <video
              ref={videoRef}
              src={previewVideo}
              className="home-work__media-el"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : previewImage ? (
            <Image
              src={previewImage}
              alt={`Preview of the ${site.name} website`}
              className="home-work__media-el"
              fill
              sizes="(max-width: 900px) 92vw, 46vw"
            />
          ) : (
            <div className="home-work__media-placeholder" aria-hidden="true">
              Live site
            </div>
          )}
        </div>

        <div className="home-work__body">
          <p className="home-work__label">{site.label}</p>
          <h3 className="home-work__name">{site.name}</h3>
          <p className="home-work__location">{site.location}</p>
          <p className="home-work__summary">{site.summary}</p>

          <ul className="home-work__scope" role="list">
            {site.scope.slice(0, 4).map((item) => (
              <li key={item} className="home-work__scope-item">
                {item}
              </li>
            ))}
          </ul>

          <span className="home-work__cta">
            Visit live site
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function HomeWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="home-work"
      aria-labelledby="home-work-heading"
    >
      <WorkCursorLens containerRef={sectionRef} />

      <div className="home-work__inner">
        <header className="home-work__header">
          <p className="home-work__eyebrow">Live work</p>
          <h2 id="home-work-heading" className="home-work__heading">
            Recent projects we&apos;ve shipped
          </h2>
          <p className="home-work__lede">
            Every site below is live and running in production. Click through to see them in
            the wild.
          </p>
        </header>

        <div className="home-work__stack">
          {LIVE_SITES.map((site, index) => {
            const side = index % 2 === 0 ? "left" : "right";

            return (
              <div key={site.name} className="home-work__stack-item">
                <WorkCard site={site} side={side} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
