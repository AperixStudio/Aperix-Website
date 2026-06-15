/**
 * Shared GLTF loader with Draco support for compressed .glb assets.
 * Decoder WASM lives in /public/draco/gltf/ (from three.js examples).
 */

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const DRACO_DECODER_PATH = "/draco/gltf/";

/** @type {DRACOLoader | null} */
let sharedDracoLoader = null;

/** GLTF root — some Draco exports omit `scene` / `scenes`. */
export function resolveGltfRoot(gltf) {
  if (gltf?.scene?.traverse) {
    return gltf.scene;
  }

  if (gltf?.scenes?.[0]?.traverse) {
    return gltf.scenes[0];
  }

  return null;
}

export function createGltfLoader() {
  const loader = new GLTFLoader();

  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    sharedDracoLoader.preload();
  }

  loader.setDRACOLoader(sharedDracoLoader);
  return loader;
}
