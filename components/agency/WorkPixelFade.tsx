import {
  PIXEL_FADE_HEIGHT,
  PIXEL_FADE_SRC,
  PIXEL_FADE_WIDTH,
} from "@/lib/pixelFade";

/**
 * Reduced-motion stand-in for the dissolving grid along the bottom of the
 * Our Work slab. Same baked field the cursor lens paints, so the dither
 * matches without one DOM node per square.
 *
 * No viewBox, so the SVG's user units map 1:1 to CSS pixels and the squares
 * stay square at every viewport width. The image is wider than any real
 * viewport and simply overflows.
 */
export default function WorkPixelFade() {
  return (
    <svg
      className="home-work__pixel-fade"
      aria-hidden="true"
      width={PIXEL_FADE_WIDTH}
      height={PIXEL_FADE_HEIGHT}
    >
      <g>
        <image
          href={PIXEL_FADE_SRC}
          x={0}
          y={0}
          width={PIXEL_FADE_WIDTH}
          height={PIXEL_FADE_HEIGHT}
        />
      </g>
    </svg>
  );
}
