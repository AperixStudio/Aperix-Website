"use client";

import Link from "next/link";

const LOGO_SIZE = 44; // px — the nav logo size
const LOGO_H = Math.round(LOGO_SIZE * (836 / 768));

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
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <svg
          width={LOGO_SIZE}
          height={LOGO_H}
          viewBox="0 0 768 836"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "block",
            filter: "drop-shadow(0 0 8px rgba(14,165,233,0.4))",
            transition: "filter 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as SVGSVGElement).style.filter =
              "drop-shadow(0 0 16px rgba(14,165,233,0.7))")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as SVGSVGElement).style.filter =
              "drop-shadow(0 0 8px rgba(14,165,233,0.4))")
          }
        >
          <defs>
            <linearGradient
              id="logo-nav-grad"
              x1="384" y1="106" x2="384" y2="730"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#DFF2FF" />
              <stop offset="1" stopColor="#BFE5FF" />
            </linearGradient>
          </defs>
          <path d="M384 76L660 236V556L384 716L108 556V236L384 76Z" stroke="#0EA5E9" strokeWidth="28" strokeLinejoin="round" />
          <path d="M384 141L604 269V523L384 651L164 523V269L384 141Z" fill="url(#logo-nav-grad)" />
          <path d="M384 273L516 349V503L384 579L252 503V349L384 273Z" stroke="rgba(255,255,255,0.85)" strokeWidth="28" strokeLinejoin="round" />
          <path d="M384 303V548" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
          <path d="M278 364L490 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
          <path d="M490 364L278 487" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
          <path d="M291 418H477" stroke="#CFCFCF" strokeWidth="24" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}
