/** Apple platforms need H.264 MP4 — skip WebM to avoid Safari stall before fallback. */
export function prefersMp4BackgroundVideo(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return true;
  }

  // iPadOS desktop UA reports as Mac; touch + Safari without Chrome/Firefox/Edge.
  const isSafari =
    /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|OPR|Opera/.test(ua);

  return isSafari && navigator.maxTouchPoints > 1;
}
