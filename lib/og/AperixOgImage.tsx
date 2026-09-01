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
        height="70"
        viewBox="0 0 921.75 668.50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#4db8f0">
          <path d="M639.75 209.25 L443.25 0.00 L166.00 289.50 L304.50 266.75 L402.25 100.75 L489.00 187.50 L381.25 253.75 Z"/>
          <path d="M319.00 314.25 L660.50 407.75 L921.75 668.50 L712.50 343.00 Z"/>
          <path d="M0.00 292.25 L170.25 510.75 L279.75 316.50 L270.50 310.00 L149.25 306.00 L126.50 333.00 L114.25 337.00 Z"/>
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
