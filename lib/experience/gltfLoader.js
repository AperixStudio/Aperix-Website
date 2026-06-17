/**
 * Shared GLTF loader with Draco support for compressed .glb assets.
 * Decoder WASM lives in /public/draco/gltf/ (from three.js examples).
 */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const DRACO_DECODER_PATH = "/draco/gltf/";

/** @type {DRACOLoader | null} */
let sharedDracoLoader = null;

/** GLTF root — some Draco / transform exports omit `scene` / `scenes`. */
export function resolveGltfRoot(gltf) {
  if (gltf?.scene?.traverse) {
    return gltf.scene;
  }

  if (gltf?.scenes?.[0]?.traverse) {
    return gltf.scenes[0];
  }

  // Last resort: rebuild a root from parsed node objects (flat/broken exports).
  const nodeObjects = gltf?.parser?.nodes;
  if (Array.isArray(nodeObjects) && nodeObjects.length > 0) {
    const referenced = new Set();
    nodeObjects.forEach((node) => {
      node.children?.forEach((childIndex) => referenced.add(childIndex));
    });

    const rootIndices = nodeObjects
      .map((_, index) => index)
      .filter((index) => !referenced.has(index));

    if (rootIndices.length === 1) {
      return nodeObjects[rootIndices[0]];
    }

    if (rootIndices.length > 1) {
      const group = new THREE.Group();
      group.name = "GltfFallbackRoot";
      rootIndices.forEach((index) => {
        group.add(nodeObjects[index]);
      });
      return group;
    }

    if (nodeObjects.length === 1) {
      return nodeObjects[0];
    }
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
