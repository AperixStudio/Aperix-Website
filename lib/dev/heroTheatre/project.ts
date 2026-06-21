import { getProject, types, type ISheet, type ISheetObject } from "@theatre/core";
import { DEFAULT_HERO_CANVAS_CONFIG as C } from "@/lib/heroCanvasConfig";
import {
  HERO_THEATRE_ACT1_SHEET,
  HERO_THEATRE_ACT2_SHEET,
  HERO_THEATRE_PROJECT_ID,
} from "./types";

type Act1Objects = {
  sheet: ISheet;
  model: ISheetObject<{
    x: number;
    y: number;
    z: number;
    rotY: number;
  }>;
  camera: ISheetObject<{ progress: number }>;
  screen: ISheetObject<{ scaleWidth: number; scaleHeight: number }>;
};

type Act2Objects = {
  sheet: ISheet;
  model: ISheetObject<{
    x: number;
    y: number;
    z: number;
    rotY: number;
  }>;
  screen: ISheetObject<{ scaleWidth: number; scaleHeight: number }>;
};

let act1Objects: Act1Objects | null = null;
let act2Objects: Act2Objects | null = null;

/** Lazily create Theatre objects once — safe to call multiple times. */
export function ensureHeroTheatreProject() {
  const project = getProject(HERO_THEATRE_PROJECT_ID);

  if (!act1Objects) {
    const sheet = project.sheet(HERO_THEATRE_ACT1_SHEET, "default");
    act1Objects = {
      sheet,
      model: sheet.object("Model", {
        x: types.number(C.modelOffsetStartX, { range: [-4, 4] }),
        y: types.number(C.modelOffsetStartY, { range: [-4, 4] }),
        z: types.number(C.modelOffsetStartZ, { range: [-4, 4] }),
        rotY: types.number(C.modelRotationY, { range: [-Math.PI, Math.PI] }),
      }),
      camera: sheet.object("Camera", {
        progress: types.number(0, { range: [0, 1] }),
      }),
      screen: sheet.object("Screen", {
        scaleWidth: types.number(C.screenPlaneScaleWidthStart, { range: [0.05, 1.5] }),
        scaleHeight: types.number(C.screenPlaneScaleHeightStart, { range: [0.05, 1.5] }),
      }),
    };
  }

  if (!act2Objects) {
    const sheet = project.sheet(HERO_THEATRE_ACT2_SHEET, "default");
    act2Objects = {
      sheet,
      model: sheet.object("Model", {
        x: types.number(C.act2ModelOffsetStartX, { range: [-4, 4] }),
        y: types.number(C.act2ModelOffsetStartY, { range: [-4, 4] }),
        z: types.number(C.act2ModelOffsetStartZ, { range: [-4, 4] }),
        rotY: types.number(C.act2ModelRotationStartY, { range: [-Math.PI, Math.PI] }),
      }),
      screen: sheet.object("Screen", {
        scaleWidth: types.number(C.act2ScreenPlaneScaleWidth, { range: [0.05, 1.5] }),
        scaleHeight: types.number(C.act2ScreenPlaneScaleHeight, { range: [0.05, 1.5] }),
      }),
    };
  }

  return project;
}

export function getHeroTheatreSheet(act: 1): Act1Objects;
export function getHeroTheatreSheet(act: 2): Act2Objects;
export function getHeroTheatreSheet(act: 1 | 2): Act1Objects | Act2Objects {
  ensureHeroTheatreProject();
  return act === 1 ? act1Objects! : act2Objects!;
}
