"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Radius of the round "blob" head of the reveal once the cursor has settled.
const LENS_RADIUS_PX = 155;
// Per-frame pull toward the pointer's target position/radius (0–1, higher = snappier).
const LENS_EASE = 0.16;
// Below this radius the reveal is functionally invisible — skip work and hide it.
const LENS_MIN_VISIBLE_PX = 1;

// The reveal is a single tapered ribbon: a round head at the cursor trailing
// into a long tail, built from a chain of lagging points. Each point eases
// toward the one ahead of it, so the shape stretches out behind fast
// movement and gathers back into just the round head once the cursor stops.
const RIBBON_LINKS = 26;
const RIBBON_EASE = 0.34;
// >1 narrows sharply just behind the head and then thins slowly, which is
// what reads as a comet; nearer 1 the whole shape stays fat and reads as a
// blob being dragged rather than a tail.
const RIBBON_TAPER_POWER = 1.8;

// The colour sits in a band hugging the *outside* of the reveal's edge: a
// wide soft glow, plus a tight bright core line right against the boundary.
const GLOW_SPREAD_PX = 30;
const CORE_SPREAD_PX = 5;
const GLOW_OPACITY = 0.85;
const CORE_OPACITY = 0.9;

// Light-blue wash over the revealed background. Painted as a screen-blended
// fill rather than a `backdrop-filter: invert()` layer: the filter has to be
// clipped to the ribbon, and Chromium silently drops a backdrop filter when
// the element (or any ancestor) also carries a clip-path. Screening a light
// blue over the dark revealed background lands on effectively the same
// colour, with none of that fragility.
const REVEAL_FILL = "#7dd3fc";
const REVEAL_FILL_OPACITY = 0.8;

// Head-to-tail colour sweep: cool at the head, warming through orange and
// yellow and burning out to near-white at the tip of the tail.
const RIBBON_COLOR_STOPS = [
  "#22d3ee",
  "#f472b6",
  "#fb7185",
  "#fb923c",
  "#fbbf24",
  "#fde047",
  "#fef08a",
  "#fffbeb",
];

const HOLE_MASK_ID = "home-work-hole-mask";
const RIM_MASK_ID = "home-work-rim-mask";
const GLOW_FILTER_ID = "home-work-glow-blur";
const CORE_FILTER_ID = "home-work-core-blur";

type Point = { x: number; y: number };

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function sampleRibbonColor(t: number): string {
  const stops = RIBBON_COLOR_STOPS;
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const localT = scaled - i;
  const [r1, g1, b1] = hexToRgb(stops[i]);
  const [r2, g2, b2] = hexToRgb(stops[i + 1]);
  return `rgb(${Math.round(r1 + (r2 - r1) * localT)}, ${Math.round(
    g1 + (g2 - g1) * localT,
  )}, ${Math.round(b1 + (b2 - b1) * localT)})`;
}

// Colour only depends on a segment's position in the chain, never on live
// pointer state, so there's no reason to recompute it every frame.
const SEGMENT_COLORS = Array.from({ length: RIBBON_LINKS }, (_, i) =>
  sampleRibbonColor(i / RIBBON_LINKS),
);

/** Perpendicular offset points either side of every vertex, tapering to nothing at the tail. */
function buildEdges(vertices: Point[], headWidth: number) {
  const left: Point[] = [];
  const right: Point[] = [];
  const last = vertices.length - 1;

  for (let i = 0; i <= last; i += 1) {
    const p = vertices[i];
    const prev = vertices[Math.max(0, i - 1)];
    const next = vertices[Math.min(last, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    // Normal to the direction of travel.
    const nx = -dy / len;
    const ny = dx / len;
    const halfWidth = headWidth * (1 - i / last) ** RIBBON_TAPER_POWER;

    left.push({ x: p.x + nx * halfWidth, y: p.y + ny * halfWidth });
    right.push({ x: p.x - nx * halfWidth, y: p.y - ny * halfWidth });
  }

  return { left, right };
}

/**
 * Closed outline of the ribbon: the round head, plus the tapering body from
 * one edge down to the tail and back up the other. `ox`/`oy` shift the whole
 * path so the same geometry can be expressed relative to a smaller box.
 *
 * The head is emitted as its own full-circle subpath rather than relying on
 * a cap arc between the two body edges. When the cursor stops, every trail
 * point converges on the head, the edge normals go to zero, and a cap arc
 * would collapse — leaving a crescent instead of a blob. Both subpaths wind
 * counter-clockwise so the default nonzero fill rule unions them.
 */
function buildOutlinePath(
  vertices: Point[],
  left: Point[],
  right: Point[],
  headWidth: number,
  ox = 0,
  oy = 0,
): string {
  if (headWidth <= LENS_MIN_VISIBLE_PX) {
    return "M 0 0";
  }

  const f = (n: number) => n.toFixed(1);
  const last = left.length - 1;
  const w = f(headWidth);
  const hx = vertices[0].x - ox;
  const hy = vertices[0].y - oy;

  // Body: forward cap arc, down the left edge, back up the right edge.
  let d = `M ${f(right[0].x - ox)} ${f(right[0].y - oy)}`;
  d += ` A ${w} ${w} 0 0 0 ${f(left[0].x - ox)} ${f(left[0].y - oy)}`;
  for (let i = 1; i <= last; i += 1) {
    d += ` L ${f(left[i].x - ox)} ${f(left[i].y - oy)}`;
  }
  for (let i = last; i >= 1; i -= 1) {
    d += ` L ${f(right[i].x - ox)} ${f(right[i].y - oy)}`;
  }
  d += " Z";

  // Head: two half-arcs, same counter-clockwise winding as the body.
  d += ` M ${f(hx - headWidth)} ${f(hy)}`;
  d += ` A ${w} ${w} 0 1 0 ${f(hx + headWidth)} ${f(hy)}`;
  d += ` A ${w} ${w} 0 1 0 ${f(hx - headWidth)} ${f(hy)} Z`;

  return d;
}

function quad(a: Point, b: Point, c: Point, d: Point) {
  return `${a.x.toFixed(1)},${a.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)} ${c.x.toFixed(
    1,
  )},${c.y.toFixed(1)} ${d.x.toFixed(1)},${d.y.toFixed(1)}`;
}

/**
 * Mouse-driven reveal for the Our Work section.
 *
 * A single tapered ribbon — round blob head at the cursor, trailing into a
 * long tail — is punched clean out of the section's opaque backdrop, so the
 * site's real animated background shows through the cut-out, washed with a
 * screen-blended light blue.
 *
 * Hugging the *outside* of that cut-out's edge is a colour band: a wide
 * soft glow behind a tight bright core line. Both are drawn oversized and
 * then masked by the reveal shape itself, which is what gives the crisp
 * inner boundary and soft outward bleed.
 *
 * Renders the backdrop and the ribbon overlay as absolutely-positioned
 * children; the caller is responsible for giving the container
 * `position: relative` and stacking its own content above both (see
 * HomeWorkSection.css z-index order).
 */
export default function WorkCursorLens({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const holePathRef = useRef<SVGPathElement>(null);
  const holeHeadRef = useRef<SVGCircleElement>(null);
  const rimMaskPathRef = useRef<SVGPathElement>(null);
  const rimMaskHeadRef = useRef<SVGCircleElement>(null);
  const fillGroupRef = useRef<SVGGElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const fillHeadRef = useRef<SVGCircleElement>(null);
  const glowGroupRef = useRef<SVGGElement>(null);
  const coreGroupRef = useRef<SVGGElement>(null);
  const glowHeadRef = useRef<SVGCircleElement>(null);
  const coreHeadRef = useRef<SVGCircleElement>(null);
  const glowSegmentRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const coreSegmentRefs = useRef<(SVGPolygonElement | null)[]>([]);

  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });
  const trail = useRef<Point[]>(
    Array.from({ length: RIBBON_LINKS }, () => ({ x: 0, y: 0 })),
  );
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const section = containerRef.current;
    if (!section || prefersReducedMotion) {
      return;
    }

    // Skip entirely on touch/coarse pointers — this is a hover-only effect.
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const tick = () => {
      const t = target.current;
      const c = current.current;
      c.x += (t.x - c.x) * LENS_EASE;
      c.y += (t.y - c.y) * LENS_EASE;
      c.r += (t.r - c.r) * LENS_EASE;

      // Cascade the chain: each point eases toward the one ahead of it (the
      // first toward the cursor), so the ribbon stretches out behind fast
      // movement and gathers back to the head once it slows.
      let leadX = c.x;
      let leadY = c.y;
      let maxTrailStep = 0;
      for (const p of trail.current) {
        const stepX = (leadX - p.x) * RIBBON_EASE;
        const stepY = (leadY - p.y) * RIBBON_EASE;
        p.x += stepX;
        p.y += stepY;
        maxTrailStep = Math.max(maxTrailStep, Math.abs(stepX), Math.abs(stepY));
        leadX = p.x;
        leadY = p.y;
      }

      const visible = c.r > LENS_MIN_VISIBLE_PX;
      const vertices: Point[] = [{ x: c.x, y: c.y }, ...trail.current];
      const inner = buildEdges(vertices, c.r);
      const glow = buildEdges(vertices, c.r + GLOW_SPREAD_PX);
      const core = buildEdges(vertices, c.r + CORE_SPREAD_PX);
      const innerPath = buildOutlinePath(vertices, inner.left, inner.right, c.r);

      // Same shape drives the hole in the backdrop and the mask that keeps
      // the colour band strictly outside the reveal. The head also goes in
      // as its own <circle> — inside a mask, overlapping shapes union
      // unconditionally, with no dependence on subpath winding.
      const headR = visible ? c.r.toFixed(1) : "0";
      holePathRef.current?.setAttribute("d", innerPath);
      rimMaskPathRef.current?.setAttribute("d", innerPath);
      fillPathRef.current?.setAttribute("d", innerPath);
      for (const head of [holeHeadRef.current, rimMaskHeadRef.current, fillHeadRef.current]) {
        head?.setAttribute("cx", c.x.toFixed(1));
        head?.setAttribute("cy", c.y.toFixed(1));
        head?.setAttribute("r", headR);
      }

      if (fillGroupRef.current) {
        fillGroupRef.current.style.opacity = visible ? String(REVEAL_FILL_OPACITY) : "0";
      }
      if (glowGroupRef.current) {
        glowGroupRef.current.style.opacity = visible ? String(GLOW_OPACITY) : "0";
      }
      if (coreGroupRef.current) {
        coreGroupRef.current.style.opacity = visible ? String(CORE_OPACITY) : "0";
      }

      // Round caps over the head so the colour band wraps the blob, not just
      // the straight sides.
      const glowHead = glowHeadRef.current;
      if (glowHead) {
        glowHead.setAttribute("cx", c.x.toFixed(1));
        glowHead.setAttribute("cy", c.y.toFixed(1));
        glowHead.setAttribute("r", Math.max(0, c.r + GLOW_SPREAD_PX).toFixed(1));
      }
      const coreHead = coreHeadRef.current;
      if (coreHead) {
        coreHead.setAttribute("cx", c.x.toFixed(1));
        coreHead.setAttribute("cy", c.y.toFixed(1));
        coreHead.setAttribute("r", Math.max(0, c.r + CORE_SPREAD_PX).toFixed(1));
      }

      for (let i = 0; i < RIBBON_LINKS; i += 1) {
        glowSegmentRefs.current[i]?.setAttribute(
          "points",
          quad(glow.left[i], glow.left[i + 1], glow.right[i + 1], glow.right[i]),
        );
        coreSegmentRefs.current[i]?.setAttribute(
          "points",
          quad(core.left[i], core.left[i + 1], core.right[i + 1], core.right[i]),
        );
      }

      // The trail has to be settled too, not just the head — otherwise the
      // loop halts the moment the head arrives and leaves the tail frozen
      // part-way through collapsing back into the blob.
      const settled =
        Math.abs(t.x - c.x) < 0.4 &&
        Math.abs(t.y - c.y) < 0.4 &&
        Math.abs(t.r - c.r) < 0.4 &&
        maxTrailStep < 0.3;

      rafRef.current = settled ? null : requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = section.getBoundingClientRect();
      target.current.x = event.clientX - rect.left;
      target.current.y = event.clientY - rect.top;
      target.current.r = LENS_RADIUS_PX;
      ensureLoop();
    };

    const handleLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      target.current.r = 0;
      ensureLoop();
    };

    section.addEventListener("pointermove", handleMove);
    section.addEventListener("pointerleave", handleLeave);

    return () => {
      section.removeEventListener("pointermove", handleMove);
      section.removeEventListener("pointerleave", handleLeave);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Opaque section fill, with the ribbon cut clean out of it. */}
      <svg className="home-work__backdrop" aria-hidden="true">
        <defs>
          <mask id={HOLE_MASK_ID} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
            <path ref={holePathRef} d="M 0 0" fill="#000000" />
            <circle ref={holeHeadRef} r={0} fill="#000000" />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          className="home-work__backdrop-fill"
          mask={`url(#${HOLE_MASK_ID})`}
        />
      </svg>

      {/* Colour band hugging the outside of the cut-out's edge. */}
      <svg className="home-work__ribbon" aria-hidden="true">
        <defs>
          <filter id={GLOW_FILTER_ID} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id={CORE_FILTER_ID} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          {/* Filters run before masks in SVG, so the band ends up soft on its
              outer edge and crisp where it meets the reveal. */}
          <mask id={RIM_MASK_ID} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
            <path ref={rimMaskPathRef} d="M 0 0" fill="#000000" />
            <circle ref={rimMaskHeadRef} r={0} fill="#000000" />
          </mask>
        </defs>

        {/* Light-blue wash across the revealed background. Sits outside the
            rim mask — that mask exists to keep the colour band *out* of the
            reveal, which is exactly where this belongs. */}
        <g ref={fillGroupRef} opacity={0}>
          <path ref={fillPathRef} d="M 0 0" fill={REVEAL_FILL} />
          <circle ref={fillHeadRef} r={0} fill={REVEAL_FILL} />
        </g>

        <g mask={`url(#${RIM_MASK_ID})`}>
          <g ref={glowGroupRef} filter={`url(#${GLOW_FILTER_ID})`} opacity={0}>
            <circle ref={glowHeadRef} r={0} fill={SEGMENT_COLORS[0]} />
            {SEGMENT_COLORS.map((color, i) => (
              <polygon
                key={`glow-${i}`}
                ref={(el) => {
                  glowSegmentRefs.current[i] = el;
                }}
                fill={color}
              />
            ))}
          </g>

          <g ref={coreGroupRef} filter={`url(#${CORE_FILTER_ID})`} opacity={0}>
            <circle ref={coreHeadRef} r={0} fill="#ffffff" />
            {SEGMENT_COLORS.map((_, i) => (
              <polygon
                key={`core-${i}`}
                ref={(el) => {
                  coreSegmentRefs.current[i] = el;
                }}
                fill="#ffffff"
              />
            ))}
          </g>
        </g>
      </svg>

    </>
  );
}
