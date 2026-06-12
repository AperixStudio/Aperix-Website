/** Shared scroll / pose interpolation helpers for raw Three.js scenes. */

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function sampleThreePoint(t, start, middle, end) {
  if (t <= 0.5) {
    return lerp(start, middle, easeInOutCubic(t / 0.5));
  }
  return lerp(middle, end, easeInOutCubic((t - 0.5) / 0.5));
}

export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}
