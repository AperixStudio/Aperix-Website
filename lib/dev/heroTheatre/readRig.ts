import { val } from "@theatre/core";
import { ACT2_CAMERA_HOLD } from "@/lib/homeStoryTimeline";
import { getHeroTheatreSheet } from "./project";
import type { HeroTheatreRig } from "./types";

/** Read the current Theatre playhead values as a direct scene rig override. */
export function readHeroTheatreRig(act: 1 | 2): HeroTheatreRig {
  if (act === 1) {
    const { model, camera, screen } = getHeroTheatreSheet(1);
    return {
      act: 1,
      model: {
        x: val(model.props.x),
        y: val(model.props.y),
        z: val(model.props.z),
        rotX: 0,
        rotY: val(model.props.rotY),
        rotZ: 0,
      },
      cameraProgress: camera ? val(camera.props.progress) : 0,
      screenScale: {
        width: val(screen.props.scaleWidth),
        height: val(screen.props.scaleHeight),
      },
    };
  }

  const { model, screen } = getHeroTheatreSheet(2);
  return {
    act: 2,
    model: {
      x: val(model.props.x),
      y: val(model.props.y),
      z: val(model.props.z),
      rotX: 0,
      rotY: val(model.props.rotY),
      rotZ: 0,
    },
    cameraProgress: ACT2_CAMERA_HOLD,
    screenScale: {
      width: val(screen.props.scaleWidth),
      height: val(screen.props.scaleHeight),
    },
  };
}
