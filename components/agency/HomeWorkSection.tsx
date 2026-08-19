"use client";

import { useRef } from "react";
import { LIVE_SITES, type LiveSite } from "@/lib/liveSites";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import WorkPixelFade from "@/components/agency/WorkPixelFade";
import { InfiniteSlider } from "@/components/core/infinite-slider";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogImage,
  MorphingDialogVideo,
} from "@/components/core/morphing-dialog";
import "./HomeWorkSection.css";

/**
 * Our Work — opaque dark blue slab.
 *
 * Two horizontal marquee rows running in opposite directions carry the live
 * sites past the viewer. Both rows show all five projects; the second row
 * starts from a different offset so the two never line up. Hovering a row
 * slows it down, and clicking a tile morphs it open into a full case-study
 * dialog rather than jumping straight off-site.
 */

function mediaFor(site: LiveSite) {
  const video = "previewVideo" in site ? site.previewVideo : undefined;
  const videoMp4 = "previewVideoMp4" in site ? site.previewVideoMp4 : undefined;
  const image = "preview" in site ? site.preview : undefined;
  return { video, videoMp4, image };
}

function WorkTile({ site, playing }: { site: LiveSite; playing: boolean }) {
  const { video, videoMp4, image } = mediaFor(site);

  return (
    <MorphingDialog
      transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
    >
      <MorphingDialogTrigger
        style={{ borderRadius: "14px" }}
        className="home-work__tile"
      >
        <div className="home-work__tile-media">
          {video ? (
            <MorphingDialogVideo
              src={video}
              fallbackSrc={videoMp4}
              playing={playing}
              className="home-work__tile-el"
            />
          ) : image ? (
            <MorphingDialogImage
              src={image}
              alt={`Preview of the ${site.name} website`}
              className="home-work__tile-el"
            />
          ) : (
            <div className="home-work__tile-placeholder" aria-hidden="true">
              Live site
            </div>
          )}
        </div>

        <div className="home-work__tile-body">
          <div className="home-work__tile-text">
            <MorphingDialogTitle className="home-work__tile-name">
              {site.name}
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="home-work__tile-label">
              {site.label}
            </MorphingDialogSubtitle>
          </div>
          <span className="home-work__tile-plus" aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer backdropClassName="home-work__scrim">
        <MorphingDialogContent
          style={{ borderRadius: "22px" }}
          className="home-work__dialog"
        >
          {/* The preview is the link out to the live site — which is why
              there is no separate CTA below the copy. */}
          <a
            className="home-work__dialog-media"
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the live ${site.name} site in a new tab`}
          >
            {video ? (
              <MorphingDialogVideo
                src={video}
                fallbackSrc={videoMp4}
                className="home-work__dialog-el"
              />
            ) : image ? (
              <MorphingDialogImage
                src={image}
                alt={`Preview of the ${site.name} website`}
                className="home-work__dialog-el"
              />
            ) : null}
            <span className="home-work__dialog-grid" aria-hidden="true" />
            <span className="home-work__dialog-visit" aria-hidden="true">
              Visit live site
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </span>
          </a>

          <div className="home-work__dialog-body">
            <MorphingDialogTitle className="home-work__dialog-name">
              {site.name}
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="home-work__dialog-label">
              {site.label} · {site.location}
            </MorphingDialogSubtitle>

            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.96, y: 40 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.96, y: 40 },
              }}
            >
              {/* The standalone summary is dropped: it restates the same
                  ground these three cover, and cutting it is what lets the
                  panel fit without scrolling. */}
              <dl className="home-work__dialog-case">
                <dt>Problem</dt>
                <dd>{site.problem}</dd>
                <dt>What we did</dt>
                <dd>{site.solution}</dd>
                <dt>Result</dt>
                <dd>{site.result}</dd>
              </dl>
            </MorphingDialogDescription>
          </div>

          <MorphingDialogClose className="home-work__dialog-close" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

/** Row two starts two projects in, so the rows never sit in step. */
const ROW_TWO = [...LIVE_SITES.slice(2), ...LIVE_SITES.slice(0, 2)];

export default function HomeWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // The two rows duplicate their children for the seamless loop, so a full
  // marquee is ~20 <video> elements. Keep them all paused until the section
  // is actually on screen.
  const sectionInView = useInView(sectionRef, { rootMargin: "15% 0px", threshold: 0 });
  const playing = sectionInView && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="home-work"
      aria-labelledby="home-work-heading"
    >
      {/* The band above renders the slab, the pixel grid and the lens for
          everyone else — the lens bails out under reduced motion, so this is
          the static stand-in for that case only. */}
      {prefersReducedMotion ? (
        <>
          <div className="home-work__slab" aria-hidden="true" />
          <WorkPixelFade />
        </>
      ) : null}

      <div className="home-work__inner">
        <header className="home-work__header">
          <p className="home-work__eyebrow">Live work</p>
          <h2 id="home-work-heading" className="home-work__heading">
            Recent projects we&apos;ve shipped
          </h2>
          <p className="home-work__lede">
            Every site below is live and running in production. Tap any one to
            see the full story.
          </p>
        </header>
      </div>

      <div className="home-work__marquee">
        {prefersReducedMotion ? (
          // No auto-scroll for reduced motion — the same tiles, laid out as a
          // plain horizontally scrollable strip the user drives themselves.
          <div className="home-work__static-rows">
            {LIVE_SITES.map((site) => (
              <WorkTile key={site.name} site={site} playing={playing} />
            ))}
          </div>
        ) : (
          <>
            <InfiniteSlider gap={24} duration={45} durationOnHover={140}>
              {LIVE_SITES.map((site) => (
                <WorkTile key={site.name} site={site} playing={playing} />
              ))}
            </InfiniteSlider>

            <InfiniteSlider gap={24} duration={52} durationOnHover={160} reverse>
              {ROW_TWO.map((site) => (
                <WorkTile key={site.name} site={site} playing={playing} />
              ))}
            </InfiniteSlider>
          </>
        )}
      </div>
    </section>
  );
}
