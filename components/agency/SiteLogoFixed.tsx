"use client";

import Link from "next/link";
import AnimatedLogo from "@/components/agency/AnimatedLogo";

const LOGO_SIZE = 44; // px — the nav logo size

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
      style={{
        position: "fixed",
        top: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
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
