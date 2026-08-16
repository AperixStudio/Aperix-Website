"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Resting radius of the revealed circle once the cursor has settled.
const LENS_RADIUS_PX = 170;
// Soft edge width between "fully see-through" and "fully opaque backdrop".
const LENS_FEATHER_PX = 22;
// Per-frame pull toward the pointer's target position/radius (0–1, higher = snappier).
const LENS_EASE = 0.16;
// Below this radius the lens is functionally invisible — skip work and hide it.
const LENS_MIN_VISIBLE_PX = 1;

// Comet tail — a chain of glowing dots, each easing toward the one ahead of
// it, so the whole chain lags further behind the lens the faster it moves
// (the up.com.au-style trailing smear). Purely decorative: unlike the lens
// itself these don't punch a hole in the backdrop, they just glow over it.
const TRAIL_LENGTH = 6;
const TRAIL_EASE = 0.26;
const TRAIL_BASE_SIZE_PX = 130;
// Kept modest — these nodes overlap and screen-blend as the trail bunches
// up when the cursor slows down, and a high ceiling turns that overlap
// into a flat, muddy blob instead of a soft glow.
const TRAIL_MAX_OPACITY = 0.4;
// Head-to-tail colour sweep — Aperix's own sky-blue and lime accents at
// either end, so the comet reads as on-brand rather than a generic rainbow.
const TRAIL_COLORS = ["#7dd3fc", "#38bdf8", "#22d3ee", "#2dd4bf", "#4ade80", "#a3e635"];

function buildHoleMask(x: number, y: number, r: number) {
  if (r <= LENS_MIN_VISIBLE_PX) {
    return "none";
  }
  const inner = Math.max(0, r - LENS_FEATHER_PX);
  return `radial-gradient(circle at ${x}px ${y}px, transparent 0px, transparent ${inner}px, black ${r}px, black 100%)`;
}

/**
 * Mouse-driven "invert lens" for the Our Work section, with a trailing
 * comet of colour behind it.
 *
 * The lens punches a circular hole through the section's opaque backdrop
 * (revealing the site's real animated background underneath) and layers a
 * matching circle with `backdrop-filter: invert()` + a light-blue tint on
 * top of that hole, so what shows through is the true global background,
 * colour-inverted and tinted — not just a flat fill of this section's own
 * navy.
 *
 * Trailing it is a short chain of glowing dots (TRAIL_LENGTH), each easing
 * toward the one ahead of it, so the chain stretches out behind the lens
 * as it moves and gathers back in when it slows — the soft, colourful
 * comet-smear effect.
 *
 * Renders the backdrop, lens, and trail nodes as absolutely-positioned
 * children; the caller is responsible for giving the container
 * `position: relative` and stacking its own content above all of them
 * (see HomeWorkSection.css z-index order).
 */
export default function WorkCursorLens({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });
  const trail = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 })),
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

    // Set directly via style.* rather than a CSS rule: the build's CSS
    // minifier collapses "backdrop-filter" + "-webkit-backdrop-filter"
    // declarations that share a value down to just the prefixed one,
    // which silently drops support for browsers that only understand the
    // unprefixed property (Firefox). Inline styles bypass that pass.
    //
    // The colour itself is two layers: invert(1) still colour-inverts the
    // real background showing through the hole (keeps the "negative"
    // structure/detail), then a translucent light-blue fill is alpha-
    // blended on top of that inverted result — without the tint, invert()
    // alone lands on whatever's complementary to the source (often warm
    // orange/cream), which isn't a reliable "light blue".
    const lensEl = lensRef.current;
    if (lensEl) {
      lensEl.style.setProperty("backdrop-filter", "invert(1) saturate(1.3)");
      lensEl.style.setProperty("-webkit-backdrop-filter", "invert(1) saturate(1.3)");
      lensEl.style.background = "rgba(125, 211, 252, 0.5)";
    }

    const tick = () => {
      const t = target.current;
      const c = current.current;
      c.x += (t.x - c.x) * LENS_EASE;
      c.y += (t.y - c.y) * LENS_EASE;
      c.r += (t.r - c.r) * LENS_EASE;

      const backdrop = backdropRef.current;
      const lens = lensRef.current;
      const mask = buildHoleMask(c.x, c.y, c.r);

      if (backdrop) {
        backdrop.style.maskImage = mask;
        backdrop.style.webkitMaskImage = mask;
      }

      if (lens) {
        const d = c.r * 2;
        lens.style.width = `${d}px`;
        lens.style.height = `${d}px`;
        lens.style.transform = `translate3d(${c.x - c.r}px, ${c.y - c.r}px, 0)`;
        lens.style.opacity = c.r > LENS_MIN_VISIBLE_PX ? "1" : "0";
      }

      // Cascade the trail: each node eases toward the node ahead of it
      // (the first eases toward the lens itself), so the chain stretches
      // out behind fast movement and closes up again once it slows.
      const visible = c.r > LENS_MIN_VISIBLE_PX;
      let leadX = c.x;
      let leadY = c.y;
      for (let i = 0; i < TRAIL_LENGTH; i += 1) {
        const node = trail.current[i];
        node.x += (leadX - node.x) * TRAIL_EASE;
        node.y += (leadY - node.y) * TRAIL_EASE;
        leadX = node.x;
        leadY = node.y;

        const el = trailRefs.current[i];
        if (!el) {
          continue;
        }
        const shrink = 1 - i / (TRAIL_LENGTH + 1);
        const size = TRAIL_BASE_SIZE_PX * shrink;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${node.x - size / 2}px, ${node.y - size / 2}px, 0)`;
        el.style.opacity = visible
          ? String(TRAIL_MAX_OPACITY * (1 - i / TRAIL_LENGTH))
          : "0";
      }

      const settled =
        Math.abs(t.x - c.x) < 0.4 && Math.abs(t.y - c.y) < 0.4 && Math.abs(t.r - c.r) < 0.4;

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
      <div ref={backdropRef} className="home-work__backdrop" aria-hidden="true" />
      {TRAIL_COLORS.map((color, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="home-work__comet-node"
          aria-hidden="true"
          style={{
            background: color,
            filter: `blur(${10 + i * 3}px)`,
          }}
        />
      ))}
      <div ref={lensRef} className="home-work__lens" aria-hidden="true" />
    </>
  );
}
