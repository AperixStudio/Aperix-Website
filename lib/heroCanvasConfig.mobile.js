/**
 * Mobile overrides — tune via /dev/hero-canvas (mobile preview + Copy mobile overrides).
 *
 * Step 1 workflow:
 * 1. Open /dev/hero-canvas?act=1 and enable Mobile preview
 * 2. Scrub Acts 1–2; adjust camera + model offsets until framing looks right
 * 3. Click "Copy mobile overrides" → paste values below
 * 4. Repeat on act=3 tab for Act 3 → lib/act3RevealConfig.mobile.js
 */
export const MOBILE_HERO_CANVAS_OVERRIDES = {
  modelOffsetStartY: -0.05,
  modelOffsetStartZ: -1.15,
  modelOffsetEndX: -0.05,
  modelOffsetEndY: 1.35,
  cameraStartElevation: 0.36434609527920614,
  cameraTargetYRatio: 1,
  cameraOrbitPivotYRatio: 1,
  cameraDistanceX: 0.05,
  cameraDistanceY: 3,
  cameraDistanceZ: 5.4,
  cameraFov: 46,
};
