import { ImageResponse } from "next/og";
import { AperixOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og/AperixOgImage";

export const runtime = "edge";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1017",
        }}
      >
        <svg width="140" height="153" viewBox="0 0 768 836" fill="none">
          <defs>
            <linearGradient id="apple-fill" x1="384" y1="106" x2="384" y2="730" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#DFF2FF" />
              <stop offset="1" stopColor="#BFE5FF" />
            </linearGradient>
          </defs>
          <path
            d="M384 76L660 236V556L384 716L108 556V236L384 76Z"
            stroke="#0EA5E9"
            strokeWidth="28"
            strokeLinejoin="round"
          />
          <path d="M384 141L604 269V523L384 651L164 523V269L384 141Z" fill="url(#apple-fill)" />
          <path
            d="M384 273L516 349V503L384 579L252 503V349L384 273Z"
            stroke="#050505"
            strokeWidth="28"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: 180, height: 180 },
  );
}
