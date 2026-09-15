"use client";

import Link from "next/link";
import { memo, useLayoutEffect, useRef, useState } from "react";
import AnimatedLogo from "@/components/agency/AnimatedLogo";

// arrowhead-mark.svg viewBox is 921.75 × 668.50 — same constant AnimatedLogo
// derives its own height from, kept in sync here for the vertical-centring
// math below.
const LOGO_ASPECT = 668.5 / 921.75;

// The logo renders at a single constant pixel size always — every state
// change (hero-big → nav-small, plus the mobile extra-shrink) is a CSS
// `transform: scale()` on the wrapper, never a change to this prop. That
// keeps the WebGL canvas itself untouched across the whole journey (no
// resize-driven redraw thrash), matching how IntroScreenSimple already flies
// its own copy in via scale rather than by resizing it.
const LOGO_HERO_SIZE = 2000; // px — desktop GPU buffer; wrapper scales this down to the slot
const LOGO_GPU_MOBILE = 480; // iOS Safari OOMs on a 2000px WebGL canvas × devicePixelRatio
const LOGO_NAV_SIZE  = 352; // px-equivalent — docked nav size (unchanged from before)

// Raised close to the very top of the viewport.
const NAV_TOP_REM = 0.25;

// Mobile-only extra shrink once fully docked: scales down toward MIN_SCALE
// over the first SHRINK_RANGE_PX of scroll *past the docking point* (or,
// where there's no hero section on the page at all, past the top of the
// page) — then holds there, smaller but never gone. Desktop is unaffected.
const MOBILE_QUERY           = "(max-width: 767px)";
const MOBILE_MIN_SCALE       = 0.45;
const MOBILE_SHRINK_RANGE_PX = 220;

/**
 * Fixed centred logo, living at hero scale on load and docking down to the
 * small nav position/size as the hero scrolls out of view.
 *
 * Lives in layout.tsx OUTSIDE <PageReveal> so it is always in the DOM —
 * IntroScreenSimple reads its bounding rect on mount (before any scroll) to
 * compute the fly-to position, which is why that rect must already be the
 * *hero* rect at mount, not the nav rect.
 *
 * During the intro the overlay (z-index 9997) covers this logo entirely,
 * so there is no visual conflict. After the intro logo animates up and
 * fades out, this element is already in place at the correct (hero) position.
 *
 * On any page without a `#home-hero-logo-slot` marker (every page but the
 * home page, or the home page below the 820px breakpoint where the big-logo
 * hero treatment doesn't run — see HomeHero.css) this behaves exactly as it
 * always has: docked at nav size/position, with the old mobile scroll-shrink.
 *
 * `transform` is deliberately owned ENTIRELY by the imperative effect below
 * (`el.style.transform = ...`), never by React's `style` prop — if it were
 * also set there, any re-render of this component (a route change, a parent
 * re-render, React Fast Refresh) would reset it back to that static value
 * until the next scroll/resize event fired, snapping the logo back to a
 * wrong size. Wrapped in `memo` (zero props, so it never re-renders after
 * mount) as a second line of defence against that.
 */
function SiteLogoFixed() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gpuSizeRef = useRef(LOGO_HERO_SIZE);
  const [gpuSize, setGpuSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY).matches;
    const size = mobile ? LOGO_GPU_MOBILE : LOGO_HERO_SIZE;
    gpuSizeRef.current = size;
    setGpuSize(size);
  }, []);

  // Layout effect (not a plain effect) so the very first transform is set
  // synchronously before the browser paints — with no `transform` in the
  // style prop below, a plain effect would let one frame paint with the
  // logo untransformed (default position, no centring) first.
  useLayoutEffect(() => {
    if (gpuSize == null) return undefined;

    const mq = window.matchMedia(MOBILE_QUERY);
    let isMobile = mq.matches;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;

      const size = gpuSizeRef.current;
      const navScale = LOGO_NAV_SIZE / size;
      const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const navTopY = NAV_TOP_REM * remPx;
      const heroSlot = document.getElementById("home-hero-logo-slot");
      const heroSection = document.getElementById("home-hero");

      if (!heroSlot || !heroSection) {
        // No hero on this page/breakpoint — docked at rest, same as before
        // this redesign, with the original scrollY-based mobile shrink.
        let scale = navScale;
        if (isMobile) {
          const t = Math.min(1, window.scrollY / MOBILE_SHRINK_RANGE_PX);
          scale *= 1 - t * (1 - MOBILE_MIN_SCALE);
        }
        el.style.transform = `translateX(-50%) scale(${scale})`;
        return;
      }

      const heroRect = heroSlot.getBoundingClientRect();
      const sectionRect = heroSection.getBoundingClientRect();

      // How far through the hero the user has scrolled: 0 at the top of the
      // page, 1 once the hero has fully scrolled past. Measured off the hero
      // section itself so it stays correct regardless of its height.
      const progress = Math.min(1, Math.max(0, -sectionRect.top / sectionRect.height));

      // transform-origin is "top center" on the wrapper, so translating and
      // then scaling always leaves the wrapper's own top-centre point at
      // exactly (naturalX + dx, naturalY + dy) — scale shrinks toward that
      // point, it doesn't move it. So the two states below only need to
      // agree on where that one point should be, plus a width-derived scale.
      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top + heroRect.height / 2;
      const heroTopY = heroCenterY - (heroRect.width * LOGO_ASPECT) / 2;
      const heroScale = heroRect.width / size;

      const dx = lerp(heroCenterX - window.innerWidth / 2, 0, progress);
      const dy = lerp(heroTopY - navTopY, 0, progress);
      let scale = lerp(heroScale, navScale, progress);

      // Layer the original mobile extra-shrink on top, once fully docked.
      if (progress >= 1 && isMobile) {
        const pastDock = Math.max(0, -sectionRect.top - sectionRect.height);
        const t = Math.min(1, pastDock / MOBILE_SHRINK_RANGE_PX);
        scale *= 1 - t * (1 - MOBILE_MIN_SCALE);
      }

      el.style.transform =
        `translateX(-50%) translate(${dx}px, ${dy}px) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    const onMqChange = () => {
      isMobile = mq.matches;
      apply();
    };

    // After paint, so slot/section rects are real; also once fonts settle
    // (the logo's own metrics don't depend on a webfont, but the hero
    // wordmark sharing this layout does, so a font swap can still reflow
    // the slot) and on resize/orientation change.
    const initialRaf = requestAnimationFrame(apply);
    void document.fonts?.ready.then(apply).catch(() => {});
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(onMqChange);

    const heroSlot = document.getElementById("home-hero-logo-slot");
    const observer =
      typeof ResizeObserver !== "undefined" && heroSlot ? new ResizeObserver(apply) : null;
    if (heroSlot) observer?.observe(heroSlot);

    return () => {
      cancelAnimationFrame(initialRaf);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      (mq.removeEventListener ? mq.removeEventListener.bind(mq, "change") : mq.removeListener.bind(mq))(onMqChange);
      observer?.disconnect();
    };
  }, [gpuSize]);

  const handleClick = (e: React.MouseEvent) => {
    if (window.location.pathname !== "/") {
      // Not home yet — let Link navigate normally, it lands hash-free.
      return;
    }

    // Already home: scroll manually and skip Link's navigation so the page
    // doesn't jump. Link's navigation is what would normally clear a
    // leftover "#section" hash (e.g. left behind after visiting #contact
    // via HashLink) from the address bar — since we preventDefault() it
    // below, do that clearing ourselves. Otherwise the hash silently stays
    // in the URL and a reload jumps straight back to that section instead
    // of the top of the page.
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <div
      id="site-logo-fixed"
      ref={wrapRef}
      style={{
        position: "fixed",
        top: `${NAV_TOP_REM}rem`,
        left: "50%",
        transformOrigin: "top center",
        // No `transform` here — see the component doc comment. The layout
        // effect sets it synchronously before first paint.
        zIndex: 200,
      }}
    >
      <Link href="/" onClick={handleClick} aria-label="Aperix — back to home">
        {gpuSize != null ? (
          <AnimatedLogo
            size={gpuSize}
            priority
            style={{
              filter: "drop-shadow(0 0 8px rgba(14,165,233,0.4))",
              transition: "filter 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "drop-shadow(0 0 16px rgba(14,165,233,0.7))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(14,165,233,0.4))")
            }
          />
        ) : null}
      </Link>
    </div>
  );
}

export default memo(SiteLogoFixed);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
