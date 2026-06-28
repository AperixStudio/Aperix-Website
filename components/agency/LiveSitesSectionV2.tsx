"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { LIVE_SITES, type LiveSite } from "@/lib/liveSites";
import {
  LIVE_SITES_CAROUSEL_DRAG_THRESHOLD,
  LIVE_SITES_CAROUSEL_MOVE_MS,
  LIVE_SITES_CAROUSEL_STEP_MS,
} from "@/lib/liveSitesCarouselConfig";
import { LIVE_SITES_CARD_THEMES, type LiveSitesCardTheme } from "@/lib/liveSitesCardThemes";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "./LiveSitesSectionV2.css";

type TilePoint = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

function easeInOutSine(progress: number) {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function createSlots(count: number): TilePoint[] {
  if (count <= 1) {
    return [{ x: 58, y: 55, z: 0, rotateX: 7, rotateY: 25, scale: 1, opacity: 1, zIndex: 10 }];
  }

  const center = (count - 1) / 2;
  const overlapStep = Math.max(5.4, Math.min(7.8, 34 / count));

  return Array.from({ length: count }, (_, index) => {
    const distanceFromFront = count - 1 - index;
    const centerOffset = index - center;

    return {
      x: 50 + centerOffset * overlapStep + Math.min(0, centerOffset) * 0.65,
      y: 55 + distanceFromFront * 0.28,
      z: -distanceFromFront * 11,
      rotateX: 8,
      rotateY: 28,
      scale: 1 - distanceFromFront * 0.02,
      opacity: 1 - distanceFromFront * 0.06,
      zIndex: 40 + index,
    };
  });
}

/** Rightmost card arcs behind the stack into the back-left slot. */
function getWrappedPoint(from: TilePoint, to: TilePoint, progress: number): TilePoint {
  const backArc = Math.sin(Math.PI * progress);

  return {
    x: lerp(from.x, to.x, progress) + backArc * -5,
    y: lerp(from.y, to.y, progress) + backArc * 11,
    z: lerp(from.z, to.z, progress) - backArc * 148,
    rotateX: lerp(from.rotateX, to.rotateX, progress) + backArc * 7,
    rotateY: lerp(from.rotateY, to.rotateY - 16, progress) + backArc * -10,
    scale: lerp(from.scale, to.scale, progress) - backArc * 0.15,
    opacity: lerp(from.opacity, Math.max(to.opacity - 0.06, 0.38), progress) - backArc * 0.3,
    zIndex: 6,
  };
}

function getTilePoint(
  tileIndex: number,
  count: number,
  cycleIndex: number,
  cycleProgress: number,
): TilePoint {
  const slots = createSlots(count);
  const fromSlot = (tileIndex + cycleIndex) % count;
  const toSlot = (fromSlot + 1) % count;
  const moveProgress = easeInOutSine(Math.min(1, cycleProgress));
  const from = slots[fromSlot] ?? slots[0];
  const to = slots[toSlot] ?? slots[0];

  if (!from || !to) {
    return { x: 58, y: 55, z: 0, rotateX: 8, rotateY: 28, scale: 1, opacity: 1, zIndex: 1 };
  }

  if (fromSlot === count - 1 && toSlot === 0) {
    return getWrappedPoint(from, to, moveProgress);
  }

  return {
    x: lerp(from.x, to.x, moveProgress),
    y: lerp(from.y, to.y, moveProgress),
    z: lerp(from.z, to.z, moveProgress),
    rotateX: lerp(from.rotateX, to.rotateX, moveProgress),
    rotateY: lerp(from.rotateY, to.rotateY, moveProgress),
    scale: lerp(from.scale, to.scale, moveProgress),
    opacity: lerp(from.opacity, to.opacity, moveProgress),
    zIndex: Math.round(lerp(from.zIndex, to.zIndex, moveProgress)),
  };
}

function getCycleProgress(timeInCycleMs: number) {
  return timeInCycleMs / LIVE_SITES_CAROUSEL_MOVE_MS;
}

function getFrontTileIndex(tileCount: number, cycleIndex: number, cycleProgress: number) {
  if (tileCount <= 1) {
    return 0;
  }

  let frontIndex = 0;
  let maxZ = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < tileCount; index += 1) {
    const point = getTilePoint(index, tileCount, cycleIndex, cycleProgress);
    if (point.zIndex > maxZ) {
      maxZ = point.zIndex;
      frontIndex = index;
    }
  }

  return frontIndex;
}

function findHoveredTileIndex(
  clientX: number,
  clientY: number,
  tileCount: number,
  cycleIndex: number,
  cycleProgress: number,
  carouselElement: HTMLDivElement,
  tileWidth: number,
  tileHeight: number,
): number | null {
  const carouselRect = carouselElement.getBoundingClientRect();
  const halfWidth = tileWidth * 0.44;
  const halfHeight = tileHeight * 0.44;

  type Candidate = { index: number; zIndex: number };
  const candidates: Candidate[] = [];

  for (let index = 0; index < tileCount; index += 1) {
    const point = getTilePoint(index, tileCount, cycleIndex, cycleProgress);
    const centerX = carouselRect.left + (point.x / 100) * carouselRect.width;
    const centerY = carouselRect.top + (point.y / 100) * carouselRect.height;

    if (
      clientX < centerX - halfWidth ||
      clientX > centerX + halfWidth ||
      clientY < centerY - halfHeight ||
      clientY > centerY + halfHeight
    ) {
      continue;
    }

    candidates.push({ index, zIndex: point.zIndex });
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((left, right) => right.zIndex - left.zIndex);
  return candidates[0]?.index ?? null;
}

function getSpotlightPoint(point: TilePoint): TilePoint {
  return {
    ...point,
    y: point.y - 4.5,
    z: point.z + 210,
    rotateX: point.rotateX * 0.42,
    rotateY: point.rotateY * 0.26,
    scale: point.scale + 0.14,
    opacity: 1,
    zIndex: 320,
  };
}

function LiveSitesCarouselTile({
  site,
  theme,
  point,
  isSpotlight,
  isActivePreview,
  hasMounted,
  onTileClick,
  onHoverStart,
  onHoverEnd,
  registerTileRef,
}: {
  site: LiveSite;
  theme: LiveSitesCardTheme;
  point: TilePoint;
  isSpotlight: boolean;
  isActivePreview: boolean;
  hasMounted: boolean;
  onTileClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  registerTileRef: (element: HTMLAnchorElement | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPreviewVideo = "previewVideo" in site && Boolean(site.previewVideo);
  const hasPreviewImage = "preview" in site && Boolean(site.preview);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasPreviewVideo) {
      return;
    }

    if (isActivePreview) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hasPreviewVideo, isActivePreview]);

  return (
    <Link
      ref={registerTileRef}
      href={site.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`live-sites-v2__tile${isSpotlight ? " live-sites-v2__tile--spotlight" : ""}`}
      aria-label={`Open ${site.name}`}
      aria-hidden={!isSpotlight && !isActivePreview}
      onClick={onTileClick}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      style={
        {
          "--tile-x": `${point.x}%`,
          "--tile-y": `${point.y}%`,
          "--tile-z": `${point.z}px`,
          "--tile-rotate-x": `${point.rotateX}deg`,
          "--tile-rotate-y": `${point.rotateY}deg`,
          "--tile-scale": point.scale,
          "--tile-opacity": point.opacity,
          zIndex: point.zIndex,
        } as CSSProperties
      }
    >
      <span className="live-sites-v2__tile-back" aria-hidden="true" />
      <span className="live-sites-v2__tile-side live-sites-v2__tile-side--left" aria-hidden="true" />
      <div className="live-sites-v2__tile-front">
        <header className={`live-sites-v2__tile-header bg-linear-to-br ${theme.darkGradient}`}>
          <span className={`live-sites-v2__tile-status ${theme.badgeBg}`}>{site.status}</span>
          <p className="live-sites-v2__tile-location">{site.location}</p>
          <strong className="live-sites-v2__tile-title">{site.name}</strong>
          <p className={`live-sites-v2__tile-label ${theme.accent}`}>{site.label}</p>
        </header>

        <div className="live-sites-v2__tile-preview">
          {hasPreviewVideo ? (
            <video
              ref={videoRef}
              src={site.previewVideo}
              className="live-sites-v2__tile-preview-video"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : hasPreviewImage ? (
            <Image
              src={site.preview}
              alt=""
              className="live-sites-v2__tile-preview-image"
              fill
              sizes="(max-width: 560px) 72vw, (max-width: 900px) 44vw, 21vw"
              aria-hidden
            />
          ) : (
            <>
              <div className="live-sites-v2__tile-preview-placeholder" aria-hidden="true">
                Live preview
              </div>
              {hasMounted ? (
                <iframe
                  src={site.href}
                  title={`Preview of ${site.name}`}
                  className="live-sites-v2__tile-preview-frame"
                  style={{ visibility: isActivePreview ? "visible" : "hidden" }}
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden="true"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

type CarouselAnimState = {
  cycleIndex: number;
  timeInCycle: number;
};

export default function LiveSitesSectionV2() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef);
  const tiles = useMemo(() => [...LIVE_SITES], []);

  const [animState, setAnimState] = useState<CarouselAnimState>({
    cycleIndex: 0,
    timeInCycle: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTileIndex, setHoveredTileIndex] = useState<number | null>(null);
  const [mountedFrames, setMountedFrames] = useState<Set<number>>(() => new Set([0]));
  const [mountedFrameCursor, setMountedFrameCursor] = useState({
    front: 0,
    hovered: null as number | null,
  });

  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const suppressClickRef = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isPaused =
    prefersReducedMotion ||
    hoveredTileIndex !== null ||
    !sectionInView ||
    tiles.length <= 1;

  const advanceCarousel = useCallback(
    (direction: 1 | -1) => {
      if (tiles.length <= 1) {
        return;
      }

      setAnimState((current) => ({
        cycleIndex: current.cycleIndex + direction,
        timeInCycle: 0,
      }));
    },
    [tiles.length],
  );

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    let frameId = 0;
    let lastNow = performance.now();

    const tick = (now: number) => {
      const delta = now - lastNow;
      lastNow = now;

      setAnimState((current) => {
        let timeInCycle = current.timeInCycle + delta;
        let cycleIndex = current.cycleIndex;

        while (timeInCycle >= LIVE_SITES_CAROUSEL_STEP_MS) {
          timeInCycle -= LIVE_SITES_CAROUSEL_STEP_MS;
          cycleIndex += 1;
        }

        return { cycleIndex, timeInCycle };
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused]);

  const { cycleIndex, timeInCycle } = animState;
  const cycleProgress = prefersReducedMotion ? 0 : getCycleProgress(timeInCycle);
  const frontTileIndex = getFrontTileIndex(tiles.length, cycleIndex, cycleProgress);
  const activePreviewIndex =
    hoveredTileIndex !== null && !prefersReducedMotion ? hoveredTileIndex : frontTileIndex;

  if (
    mountedFrameCursor.front !== frontTileIndex ||
    mountedFrameCursor.hovered !== hoveredTileIndex
  ) {
    setMountedFrameCursor({ front: frontTileIndex, hovered: hoveredTileIndex });
    setMountedFrames((previous) => {
      if (
        previous.has(frontTileIndex) &&
        (hoveredTileIndex === null || previous.has(hoveredTileIndex))
      ) {
        return previous;
      }

      const next = new Set(previous);
      next.add(frontTileIndex);
      if (hoveredTileIndex !== null) {
        next.add(hoveredTileIndex);
      }
      return next;
    });
  }

  const updateHoveredFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (prefersReducedMotion || isDragging) {
        return;
      }

      const carouselElement = carouselRef.current;
      if (!carouselElement) {
        return;
      }

      const sampleTile = tileRefs.current.find(Boolean);
      const tileWidth = sampleTile?.offsetWidth ?? 320;
      const tileHeight = sampleTile?.offsetHeight ?? 352;
      const nextIndex = findHoveredTileIndex(
        clientX,
        clientY,
        tiles.length,
        cycleIndex,
        cycleProgress,
        carouselElement,
        tileWidth,
        tileHeight,
      );

      setHoveredTileIndex((current) => {
        if (nextIndex === null) {
          return current === null ? current : null;
        }

        return current === nextIndex ? current : nextIndex;
      });
    },
    [cycleIndex, cycleProgress, isDragging, prefersReducedMotion, tiles.length],
  );

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || tiles.length <= 1) {
      return;
    }

    dragStartX.current = event.clientX;
    dragMoved.current = false;
    suppressClickRef.current = false;
    setHoveredTileIndex(null);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [prefersReducedMotion, tiles.length]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (Math.abs(event.clientX - dragStartX.current) > 8) {
      dragMoved.current = true;
    }
  }, []);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);

      if (prefersReducedMotion || tiles.length <= 1) {
        return;
      }

      const delta = event.clientX - dragStartX.current;

      if (Math.abs(delta) >= LIVE_SITES_CAROUSEL_DRAG_THRESHOLD) {
        suppressClickRef.current = true;
        advanceCarousel(delta < 0 ? 1 : -1);
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }

      dragMoved.current = false;
    },
    [advanceCarousel, prefersReducedMotion, tiles.length],
  );

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
    dragMoved.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || tiles.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        advanceCarousel(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        advanceCarousel(-1);
      }
    },
    [advanceCarousel, prefersReducedMotion, tiles.length],
  );

  const handleTileClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (suppressClickRef.current || dragMoved.current) {
      event.preventDefault();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="live-sites-v2"
      aria-label="Our work"
    >
      <div className="live-sites-v2__inner">
        <div className="live-sites-v2__copy">
          <p className="live-sites-v2__eyebrow">Live work</p>
          <h2 className="live-sites-v2__heading">
            <span className="live-sites-v2__heading-line">Recent Projects</span>
            <span className="live-sites-v2__heading-line">We&apos;ve Shipped</span>
          </h2>
          {!prefersReducedMotion && tiles.length > 1 ? (
            <p className="live-sites-v2__hint">Hover a card to preview - Click card to visit site</p>
          ) : null}
        </div>

        <div
          ref={carouselRef}
          className={`live-sites-v2__carousel${isDragging ? " live-sites-v2__carousel--dragging" : ""}${hoveredTileIndex !== null ? " live-sites-v2__carousel--spotlight-active" : ""}`}
          aria-label="Live website carousel"
          tabIndex={prefersReducedMotion || tiles.length <= 1 ? -1 : 0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onMouseEnter={(event) => updateHoveredFromPointer(event.clientX, event.clientY)}
          onMouseMove={(event) => updateHoveredFromPointer(event.clientX, event.clientY)}
          onMouseLeave={() => setHoveredTileIndex(null)}
          onKeyDown={handleKeyDown}
        >
          {tiles.map((site, tileIndex) => {
            const basePoint = getTilePoint(tileIndex, tiles.length, cycleIndex, cycleProgress);
            const isSpotlight = !prefersReducedMotion && hoveredTileIndex === tileIndex;
            const point = isSpotlight ? getSpotlightPoint(basePoint) : basePoint;
            const isDimmed =
              hoveredTileIndex !== null && hoveredTileIndex !== tileIndex && !prefersReducedMotion;

            return (
              <LiveSitesCarouselTile
                key={site.name}
                site={site}
                theme={LIVE_SITES_CARD_THEMES[tileIndex % LIVE_SITES_CARD_THEMES.length]}
                point={
                  isDimmed
                    ? { ...point, opacity: Math.min(point.opacity, basePoint.opacity * 0.62) }
                    : point
                }
                isSpotlight={isSpotlight}
                isActivePreview={tileIndex === activePreviewIndex}
                hasMounted={mountedFrames.has(tileIndex)}
                onTileClick={handleTileClick}
                onHoverStart={() => setHoveredTileIndex(tileIndex)}
                onHoverEnd={() =>
                  setHoveredTileIndex((current) => (current === tileIndex ? null : current))
                }
                registerTileRef={(element) => {
                  tileRefs.current[tileIndex] = element;
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
