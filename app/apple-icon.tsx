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
        <svg width="150" height="109" viewBox="0 0 921.75 668.50" fill="none">
          <g fill="#00A2E8">
            <path d="M639.75 209.25 L443.25 0.00 L166.00 289.50 L304.50 266.75 L402.25 100.75 L489.00 187.50 L381.25 253.75 Z"/>
            <path d="M319.00 314.25 L660.50 407.75 L921.75 668.50 L712.50 343.00 Z"/>
            <path d="M0.00 292.25 L170.25 510.75 L279.75 316.50 L270.50 310.00 L149.25 306.00 L126.50 333.00 L114.25 337.00 Z"/>
          </g>
        </svg>
      </div>
    ),
    { width: 180, height: 180 },
  );
}
