import type { ReactNode } from "react";

type AperixOgImageProps = {
  /** Primary line — page or brand title */
  title: string;
  /** Secondary line under the wordmark */
  subtitle?: string;
};

export function AperixOgImage({ title, subtitle }: AperixOgImageProps): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #1a3fc4 0%, #1230a8 60%, #0e2490 100%)",
        gap: 28,
        padding: "48px 64px",
      }}
    >
      <svg
        width="96"
        height="105"
        viewBox="0 0 768 836"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="og-fill" x1="384" y1="106" x2="384" y2="730" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#DFF2FF" />
            <stop offset="1" stopColor="#BFE5FF" />
          </linearGradient>
        </defs>
        <path
          d="M384 76L660 236V556L384 716L108 556V236L384 76Z"
          stroke="#4db8f0"
          strokeWidth="28"
          strokeLinejoin="round"
        />
        <path d="M384 141L604 269V523L384 651L164 523V269L384 141Z" fill="url(#og-fill)" />
        <path
          d="M384 273L516 349V503L384 579L252 503V349L384 273Z"
          stroke="#1a1a2e"
          strokeWidth="28"
          strokeLinejoin="round"
        />
        <g stroke="#b0c8e0" strokeWidth="24" strokeLinecap="round">
          <path d="M384 303V548" />
          <path d="M278 364L490 487" />
          <path d="M490 364L278 487" />
          <path d="M291 418H477" />
        </g>
      </svg>

      <div
        style={{
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 88,
          letterSpacing: "0.18em",
          color: "#ffffff",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        APERIX
      </div>

      <div
        style={{
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.04em",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.25,
          maxWidth: "960px",
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.82)",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = "image/png";
