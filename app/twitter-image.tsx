import { ImageResponse } from "next/og";
import { AperixOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og/AperixOgImage";

export const runtime = "edge";
export const alt = "Aperix Studio — Custom Web Development Melbourne";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function TwitterImage() {
  return new ImageResponse(
    <AperixOgImage
      title="Custom Web Development Melbourne"
      subtitle="Hand-coded websites & software"
    />,
    { ...size },
  );
}
