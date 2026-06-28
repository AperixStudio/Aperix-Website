import {
  ACT3_IPHONE_VIDEO_SRC,
  ACT3_MONITOR_VIDEO_SRC,
} from "@/lib/act3ScreenContent";

export type HeroV3DeviceScreenRect = {
  left: string;
  top: string;
  width: string;
  height: string;
  borderRadius: string;
};

/** MP4 screen content while monitor + iPhone are visible in HeroAct1-3. */
export const HERO_V3_MONITOR_VIDEO_SRC = ACT3_MONITOR_VIDEO_SRC;
export const HERO_V3_IPHONE_VIDEO_SRC = ACT3_IPHONE_VIDEO_SRC;

/** Device screen videos visible while monitor + iPhone are on screen. */
export const HERO_V3_DEVICE_SCREEN_SCROLL = {
  fadeIn: 0.46,
  fadeInEnd: 0.52,
  fadeOut: 0.9,
  fadeOutEnd: 0.96,
} as const;

export function heroV3DeviceScreenOpacity(progress: number) {
  const { fadeIn, fadeInEnd, fadeOut, fadeOutEnd } = HERO_V3_DEVICE_SCREEN_SCROLL;

  if (progress < fadeIn || progress >= fadeOutEnd) {
    return 0;
  }

  if (progress < fadeInEnd) {
    const span = Math.max(fadeInEnd - fadeIn, 0.001);
    return (progress - fadeIn) / span;
  }

  if (progress < fadeOut) {
    return 1;
  }

  const span = Math.max(fadeOutEnd - fadeOut, 0.001);
  return 1 - (progress - fadeOut) / span;
}

/** Tune these % rects against the Unicorn artboard at Act 3 end pose. */
export const HERO_V3_MONITOR_SCREEN: HeroV3DeviceScreenRect = {
  left: "10.5%",
  top: "24%",
  width: "31%",
  height: "23%",
  borderRadius: "0.35rem",
};

export const HERO_V3_IPHONE_SCREEN: HeroV3DeviceScreenRect = {
  left: "69.5%",
  top: "29%",
  width: "8.5%",
  height: "15.5%",
  borderRadius: "0.45rem",
};
