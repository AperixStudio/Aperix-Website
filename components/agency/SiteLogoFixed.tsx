"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useLayoutEffect, useRef, useState } from "react";
import AnimatedLogo, {
  ARROWHEAD_SPINNING_AT_S,
  ARROWHEAD_TRACK_AT_S,
} from "@/components/agency/AnimatedLogo";
import { introHasPlayed } from "@/lib/introState";
import { useIntroDone } from "@/lib/useIntroDone";

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

// ---- Display size knobs (px-equivalent visual height via scale; desktop vs mobile) ----
// Docked / non-home / end-of-scroll target. Raise = taller logo on screen.
const LOGO_NAV_SIZE = 352;
const LOGO_NAV_SIZE_MOBILE = 352; // ≤767px only — tune independently from desktop

// Phone homepage mark. Width matches --hero-logo-width in HomeHero.css.
// 1 = that slot; 0.85 smaller; 1.1 larger. Used on every phone page, not
// only home. Tablet (768–820px) and desktop do not use it.
const MOBILE_COMPACT_HERO_SCALE = 1;
const MOBILE_HOME_LOGO_WIDTH_REM = 13.5;

// Fixed anchor for the docked mark. The homepage phone pose does not use
// this as its on-screen position — the hero slot does, plus NAV_TOP_REM_MOBILE.
const NAV_TOP_REM = -2.25;
// Phone homepage only. 0 sits in the hero slot. Negative moves up, positive
// moves down. Not applied on other pages, or the mark gets pushed off screen.
const NAV_TOP_REM_MOBILE = -3;

// Mobile-only extra shrink once fully docked: scales down toward MIN_SCALE
// over the first SHRINK_RANGE_PX of scroll *past the docking point* (or,
// where there's no hero section on the page at all, past the top of the
// page) — then holds there, smaller but never gone. Desktop is unaffected.
const MOBILE_QUERY           = "(max-width: 767px)";
const COMPACT_QUERY          = "(max-width: 820px)";

/**
 * Fixed centred logo. Desktop: hero scale on load, docks to nav as the
 * hero scrolls out. Compact home: one pose at the hero slot — no scroll
 * travel, no size change.
 *
 * Lives in layout.tsx OUTSIDE <PageReveal> so it is always in the DOM —
 * IntroScreenSimple reads its bounding rect on mount (before any scroll) to
 * compute the fly-to position, which is why that rect must already be the
 * *hero* rect at mount, not the nav rect.
 *
 * During the intro the overlay (z-index 9997) covers this logo entirely,
 * so there is no visual conflict. The 2000px WebGL mark is not created until
 * intro-done — the wrapper stays as a sized placeholder so fly-to
 * measurement still works. After the intro logo animates up and fades out,
 * this element is already in place at the correct (hero) position.
 *
 * Phones (≤767px) keep the homepage loaded size and position on every
 * page, including while scrolling. Desktop still docks smaller as the hero
 * scrolls away. Tablet keeps the compact homepage slot and the nav dock
 * everywhere else.
 *
 * The pose is remeasured on every route change. This component stays mounted
 * across navigations, so without that the last transform would stick: the
 * hero mark would stay giant on an inner page, and the docked mark would
 * stay small after a click back to the top of home.
 *
 * `transform` is deliberately owned ENTIRELY by the imperative effect below
 * (`el.style.transform = ...`), never by React's `style` prop — if it were
 * also set there, any re-render of this component (a route change, a parent
 * re-render, React Fast Refresh) would reset it back to that static value
 * until the next scroll/resize event fired, snapping the logo back to a
 * wrong size.
 */
function SiteLogoFixed() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gpuSizeRef = useRef(LOGO_HERO_SIZE);
  const [gpuSize, setGpuSize] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();
  const introDone = useIntroDone();
  // First-visit cinematic: skip the 2.2s assemble so the page mark matches
  // the intro logo that just landed. SPA / already-played: mount with default autoplay.
  const [skipAssemble] = useState(!introHasPlayed);
  const mountMark = introDone;
  const startAt = !mountMark
    ? undefined
    : compact
      ? ARROWHEAD_SPINNING_AT_S
      : skipAssemble
        ? ARROWHEAD_TRACK_AT_S
        : undefined;

  useLayoutEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY).matches;
    const size = mobile ? LOGO_GPU_MOBILE : LOGO_HERO_SIZE;
    gpuSizeRef.current = size;
    setGpuSize(size);
    setCompact(window.matchMedia(COMPACT_QUERY).matches);
  }, []);

  // Layout effect (not a plain effect) so the very first transform is set
  // synchronously before the browser paints — with no `transform` in the
  // style prop below, a plain effect would let one frame paint with the
  // logo untransformed (default position, no centring) first.
  useLayoutEffect(() => {
    if (gpuSize == null) return undefined;

    const mq = window.matchMedia(MOBILE_QUERY);
    const compactMq = window.matchMedia(COMPACT_QUERY);
    let isMobile = mq.matches;
    let isCompact = compactMq.matches;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;

      const size = gpuSizeRef.current;
      const navScale = (isMobile ? LOGO_NAV_SIZE_MOBILE : LOGO_NAV_SIZE) / size;
      const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const navTopRem = NAV_TOP_REM;
      const phoneShift = isMobile && isCompact ? NAV_TOP_REM_MOBILE * remPx : 0;
      el.style.top = `${navTopRem}rem`;
      const navTopY = navTopRem * remPx;
      const heroSlot = document.getElementById("home-hero-logo-slot");
      const heroSection = document.getElementById("home-hero");
      const slotRect = heroSlot?.getBoundingClientRect();

      // Phones: one pose, the homepage mark. No scroll shrink. The slot
      // measurement wins on home so it stays under the wordmark; other
      // pages rebuild that same box from the same CSS numbers.
      if (isMobile) {
        const phoneShift = NAV_TOP_REM_MOBILE * remPx;
        if (slotRect && slotRect.width > 1 && heroSection) {
          const sectionRect = heroSection.getBoundingClientRect();
          const heroCenterX = slotRect.left + slotRect.width / 2;
          const restCenterY =
            slotRect.top - sectionRect.top + slotRect.height / 2;
          const heroTopY = restCenterY - (slotRect.width * LOGO_ASPECT) / 2;
          const dx = heroCenterX - window.innerWidth / 2;
          const dy = heroTopY - navTopY + phoneShift;
          const scale = (slotRect.width / size) * MOBILE_COMPACT_HERO_SCALE;
          el.style.transform =
            `translateX(-50%) translate(${dx}px, ${dy}px) scale(${scale})`;
          return;
        }

        const slotWidth = MOBILE_HOME_LOGO_WIDTH_REM * remPx * MOBILE_COMPACT_HERO_SCALE;
        const dy = mobileHomeLogoTopPx(remPx) - navTopY + phoneShift;
        el.style.transform =
          `translateX(-50%) translate(0px, ${dy}px) scale(${slotWidth / size})`;
        return;
      }

      if (!slotRect || slotRect.width <= 1 || !heroSection) {
        el.style.transform = `translateX(-50%) scale(${navScale})`;
        return;
      }

      const heroRect = slotRect;
      const sectionRect = heroSection.getBoundingClientRect();

      // transform-origin is "top center" on the wrapper, so translating and
      // then scaling always leaves the wrapper's own top-centre point at
      // exactly (naturalX + dx, naturalY + dy) — scale shrinks toward that
      // point, it doesn't move it.
      const heroCenterX = heroRect.left + heroRect.width / 2;

      if (isCompact) {
        // Pin to the hero slot. Slot top is viewport-relative, so subtract
        // the hero's scroll offset and the pose stays put at one size.
        const restCenterY =
          heroRect.top - sectionRect.top + heroRect.height / 2;
        const heroTopY = restCenterY - (heroRect.width * LOGO_ASPECT) / 2;
        const dx = heroCenterX - window.innerWidth / 2;
        const dy = heroTopY - navTopY + phoneShift;
        const scale =
          (heroRect.width / size) * (isMobile ? MOBILE_COMPACT_HERO_SCALE : 1);
        el.style.transform =
          `translateX(-50%) translate(${dx}px, ${dy}px) scale(${scale})`;
        return;
      }

      const progress = Math.min(1, Math.max(0, -sectionRect.top / sectionRect.height));
      const heroCenterY = heroRect.top + heroRect.height / 2;
      const heroTopY = heroCenterY - (heroRect.width * LOGO_ASPECT) / 2;
      const heroScale = heroRect.width / size;

      const dx = lerp(heroCenterX - window.innerWidth / 2, 0, progress);
      const dy = lerp(heroTopY - navTopY, 0, progress);
      const scale = lerp(heroScale, navScale, progress);

      el.style.transform =
        `translateX(-50%) translate(${dx}px, ${dy}px) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    const onMqChange = () => {
      isMobile = mq.matches;
      isCompact = compactMq.matches;
      setCompact(isCompact);
      apply();
    };

    // Synchronous, then again on the next frame. A route change can still be
    // resetting scroll when this effect starts; the frame callback reads the
    // settled position before paint. Fonts can reflow the hero slot later.
    apply();
    const initialRaf = requestAnimationFrame(apply);
    void document.fonts?.ready.then(apply).catch(() => {});
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(onMqChange);
    (compactMq.addEventListener ? compactMq.addEventListener.bind(compactMq, "change") : compactMq.addListener.bind(compactMq))(onMqChange);

    let observer: ResizeObserver | null = null;
    const heroSlot = document.getElementById("home-hero-logo-slot");
    const heroSection = document.getElementById("home-hero");
    if (typeof ResizeObserver !== "undefined" && (heroSlot || heroSection)) {
      observer = new ResizeObserver(apply);
      if (heroSlot) observer.observe(heroSlot);
      if (heroSection) observer.observe(heroSection);
    }

    return () => {
      cancelAnimationFrame(initialRaf);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      (mq.removeEventListener ? mq.removeEventListener.bind(mq, "change") : mq.removeListener.bind(mq))(onMqChange);
      (compactMq.removeEventListener ? compactMq.removeEventListener.bind(compactMq, "change") : compactMq.removeListener.bind(compactMq))(onMqChange);
      observer?.disconnect();
    };
  }, [gpuSize, introDone, pathname, NAV_TOP_REM_MOBILE]);

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
        left: "50%",
        transformOrigin: "top center",
        // No `top` / `transform` here — the layout effect sets both imperatively.
        zIndex: 200,
      }}
    >
      <Link href="/" onClick={handleClick} aria-label="Aperix, back to home">
        {gpuSize != null ? (
          <span
            style={{
              position: "relative",
              display: "inline-block",
              width: gpuSize,
              height: Math.round(gpuSize * LOGO_ASPECT),
              overflow: "hidden",
              filter: "drop-shadow(0 0 8px rgba(14,165,233,0.4))",
              transition: "filter 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "drop-shadow(0 0 16px rgba(14,165,233,0.7))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(14,165,233,0.4))")
            }
          >
            {mountMark ? (
              <AnimatedLogo
                size={gpuSize}
                priority
                maxDpr={1}
                startAt={startAt}
              />
            ) : null}
          </span>
        ) : null}
      </Link>
    </div>
  );
}

export default memo(SiteLogoFixed);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Matches :root --wordmark-size, including the ≤640px override in globals.css. */
function mobileWordmarkPx(remPx: number) {
  const width = window.innerWidth;
  if (width <= 640) {
    return Math.min(2.4 * remPx, Math.max(1.3 * remPx, width * 0.0833));
  }
  return Math.min(3.6 * remPx, Math.max(2.4 * remPx, width * 0.055));
}

/** Top of the phone hero logo slot: 5.5vh + wordmark + 0.55rem. */
function mobileHomeLogoTopPx(remPx: number) {
  return window.innerHeight * 0.055 + mobileWordmarkPx(remPx) + 0.55 * remPx;
}
