/**
 * Deterministic pixel-dither field for the bottom edge of a section.
 *
 * The slab's solid fill stops short of the section's bottom edge and this
 * grid of squares carries it the rest of the way, thinning out row by row so
 * the colour dissolves into whatever sits below instead of ending on a hard
 * line.
 *
 * Generated once at module load from a seeded PRNG rather than Math.random,
 * so the server and the hydrating client produce byte-identical markup.
 */

export const PIXEL_FADE_CELL = 18;
export const PIXEL_FADE_ROWS = 24;
/** Wide enough to cover ultrawide viewports without tiling seams. */
export const PIXEL_FADE_COLS = 224;
export const PIXEL_FADE_HEIGHT = PIXEL_FADE_CELL * PIXEL_FADE_ROWS;
export const PIXEL_FADE_WIDTH = PIXEL_FADE_CELL * PIXEL_FADE_COLS;

/** Cheap 32-bit integer hash — stable across runtimes, unlike Math.random. */
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export type PixelFadeCell = { x: number; y: number; row: number };

function buildCells(): PixelFadeCell[] {
  const cells: PixelFadeCell[] = [];

  for (let row = 0; row < PIXEL_FADE_ROWS; row++) {
    // Row 0 is solid so the grid joins the slab above it invisibly; density
    // then falls away on a curve, which reads as a dissolve rather than a
    // linear ramp.
    const t = row / (PIXEL_FADE_ROWS - 1);
    // The +0.05 floor keeps a scattering of squares alive all the way to the
    // last row; a bare power curve dies out early and wastes the tail.
    const density = Math.pow(1 - t, 2.4) + 0.05;

    for (let col = 0; col < PIXEL_FADE_COLS; col++) {
      if (hash(col, row) < density) {
        cells.push({
          x: col * PIXEL_FADE_CELL,
          y: row * PIXEL_FADE_CELL,
          row,
        });
      }
    }
  }

  return cells;
}

export const PIXEL_FADE_CELLS = buildCells();
