"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import AnimatedLogo from "@/components/agency/AnimatedLogo";

const LOGO_SIZE = 352; // px — the nav logo size

// Mobile-only scroll shrink: scales down toward MIN_SCALE over the first
// SHRINK_RANGE_PX of scroll, then holds there — smaller, never gone.
// Desktop is unaffected (the logo sits comfortably at full size there).
const MOBILE_QUERY   = "(max-width: 767px)";
const MIN_SCALE      = 0.45;
const SHRINK_RANGE_PX = 220;

/**
 * Fixed centred logo at the top of every page.
 *
 * Lives in layout.tsx OUTSIDE <PageReveal> so it is always in the DOM —
 * IntroScreenSimple reads its bounding rect on mount to compute the fly-to position.
 *
 * During the intro the overlay (z-index 9997) covers this logo entirely,
 * so there is no visual conflict. After the intro logo animates up and
 * fades out, this element is already in place at the correct position.
 */
export default function SiteLogoFixed() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // ── Mobile scroll shrink ─────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    let isMobile = mq.matches;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      if (!isMobile) {
        el.style.transform = "translateX(-50%)";
        return;
      }
      const t = Math.min(1, window.scrollY / SHRINK_RANGE_PX);
      const scale = 1 - t * (1 - MIN_SCALE);
      el.style.transform = `translateX(-50%) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    const onMqChange = () => {
      isMobile = mq.matches;
      apply();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(onMqChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      (mq.removeEventListener ? mq.removeEventListener.bind(mq, "change") : mq.removeListener.bind(mq))(onMqChange);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
        top: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        transformOrigin: "top center",
        zIndex: 200,
      }}
    >
      <Link href="/" onClick={handleClick} aria-label="Aperix — back to home">
        <AnimatedLogo
          size={LOGO_SIZE}
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
      </Link>
    </div>
  );
}
