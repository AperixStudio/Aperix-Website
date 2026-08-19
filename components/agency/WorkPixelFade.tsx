import {
  PIXEL_FADE_CELL,
  PIXEL_FADE_CELLS,
  PIXEL_FADE_HEIGHT,
  PIXEL_FADE_WIDTH,
  PIXEL_FADE_ROWS,
} from "@/lib/pixelFade";

/**
 * The dissolving grid along the bottom edge of the Our Work slab.
 *
 * No viewBox, so the SVG's user units map 1:1 to CSS pixels — the squares
 * stay square at every viewport width instead of stretching, exactly like
 * the backdrop SVG the cursor lens draws. The grid is wider than any real
 * viewport and simply overflows.
 *
 * A single flat colour, matching the slab. The dissolve comes entirely from
 * falling density plus a gentle opacity ramp, so the grid reads as the slab
 * itself breaking up rather than as a separate coloured band.
 */
export default function WorkPixelFade() {
  return (
    <svg
      className="home-work__pixel-fade"
      aria-hidden="true"
      width={PIXEL_FADE_WIDTH}
      height={PIXEL_FADE_HEIGHT}
    >
      <g fill="var(--work-navy-deep)">
        {PIXEL_FADE_CELLS.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width={PIXEL_FADE_CELL}
            height={PIXEL_FADE_CELL}
            // Density alone leaves the tail looking like scattered confetti;
            // dimming the lower rows as well makes it recede.
            opacity={0.4 + 0.6 * (1 - cell.row / (PIXEL_FADE_ROWS - 1))}
          />
        ))}
      </g>
    </svg>
  );
}
