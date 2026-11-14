/**
 * Paints the work-section dither into public/work-pixel-fade.png.
 *
 * Uses the same cells as lib/pixelFade.ts. Re-run after changing the hash,
 * the grid size, the row opacity, or the navy.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  PIXEL_FADE_CELL,
  PIXEL_FADE_CELLS,
  PIXEL_FADE_HEIGHT,
  PIXEL_FADE_WIDTH,
  pixelFadeRowOpacity,
} from "../lib/pixelFade.ts";

const NAVY = [0x0d, 0x2d, 0x4c];
const pixels = Buffer.alloc(PIXEL_FADE_WIDTH * PIXEL_FADE_HEIGHT * 4);

for (const cell of PIXEL_FADE_CELLS) {
  const alpha = Math.round(pixelFadeRowOpacity(cell.row) * 255);
  for (let y = 0; y < PIXEL_FADE_CELL; y += 1) {
    const row = (cell.y + y) * PIXEL_FADE_WIDTH;
    for (let x = 0; x < PIXEL_FADE_CELL; x += 1) {
      const i = (row + cell.x + x) * 4;
      pixels[i] = NAVY[0];
      pixels[i + 1] = NAVY[1];
      pixels[i + 2] = NAVY[2];
      pixels[i + 3] = alpha;
    }
  }
}

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/work-pixel-fade.png",
);
const png = await sharp(pixels, {
  raw: {
    width: PIXEL_FADE_WIDTH,
    height: PIXEL_FADE_HEIGHT,
    channels: 4,
  },
})
  .png()
  .toBuffer();

writeFileSync(out, png);
console.log(
  `${PIXEL_FADE_CELLS.length} cells -> ${out} (${png.length} bytes, ${PIXEL_FADE_WIDTH}x${PIXEL_FADE_HEIGHT})`,
);
