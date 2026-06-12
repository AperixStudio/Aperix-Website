/** Production defaults for the Rocket scroll scene. Tune via /dev/rocket → Copy config. */
export const DEFAULT_ROCKET_CONFIG = {
  modelPath: "/Rocketship.glb",

  modelOffsetStartX: 0.8,
  modelOffsetStartY: 1.7,
  modelOffsetStartZ: 0.07,

  modelOffsetMiddleX: -0.93,
  modelOffsetMiddleY: 1.03,
  modelOffsetMiddleZ: -0.2,

  modelOffsetEndX: 0.6,
  modelOffsetEndY: 0.6,
  modelOffsetEndZ: 0.8,

  modelRotationStartX: 0,
  modelRotationStartY: -Math.PI,
  modelRotationStartZ: -Math.PI,

  modelRotationMiddleX: -0.017453292519943295,
  modelRotationMiddleY: 0,
  modelRotationMiddleZ: -Math.PI,

  modelRotationEndX: -0.5410520681182421,
  modelRotationEndY: Math.PI,
  modelRotationEndZ: -Math.PI,

  cameraX: 0,
  cameraY: 0.4,
  cameraZ: 2.8,
  lookAtX: 0,
  lookAtY: 0.35,
  lookAtZ: 0,
};
