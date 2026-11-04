import { ImageResponse } from "next/og";
import { AperixOgImage, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/og/AperixOgImage";

export const runtime = "edge";
export const alt = "Services | Aperix Studio";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function ServicesOpenGraphImage() {
  return new ImageResponse(
    <AperixOgImage title="Services" subtitle="Web design, software, web apps and SaaS" />,
    { ...size },
  );
}
