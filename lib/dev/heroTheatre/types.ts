/** Dev-only rig values read from Theatre.js and applied directly to the PC scene. */

export type HeroTheatreRig = {
  act: 1 | 2;
  model: {
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
  };
  /** Act 1 camera lerp progress (0 = tight, 1 = pulled back). */
  cameraProgress: number;
  screenScale: {
    width: number;
    height: number;
  };
};

export const HERO_THEATRE_PROJECT_ID = "Aperix Hero";
export const HERO_THEATRE_ACT1_SHEET = "Act 1";
export const HERO_THEATRE_ACT2_SHEET = "Act 2";
export const HERO_THEATRE_SEQUENCE_LENGTH = 10;
