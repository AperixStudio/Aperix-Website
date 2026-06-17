import * as THREE from "three";
import { HOME_STORY_CLEAR_COLOR } from "@/lib/homeStoryTheme";
import {
  dissolveFragmentShader,
  dissolveVertexShader,
} from "@/lib/experience/transitions/dissolveShader.glsl.js";

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {{ useDissolve: boolean }} [options]
 */
export function createStoryCompositor(renderer, options = {}) {
  const useDissolve = options.useDissolve ?? true;

  const rtFrom = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
  });
  const rtTo = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
  });

  const compositeScene = new THREE.Scene();
  const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const compositeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tSceneFrom: { value: rtFrom.texture },
      tSceneTo: { value: rtTo.texture },
      uMix: { value: 0 },
      uEdgeSoftness: { value: 0.06 },
    },
    vertexShader: dissolveVertexShader,
    fragmentShader: dissolveFragmentShader,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });

  const compositeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial);
  compositeScene.add(compositeQuad);

  function renderSceneToTarget(target, sceneController) {
    renderer.setRenderTarget(target);
    renderer.setClearColor(HOME_STORY_CLEAR_COLOR, 0);
    renderer.clear();
    renderer.render(sceneController.scene, sceneController.camera);
  }

  /**
   * @param {object} params
   * @param {import("@/lib/experience/types").StorySceneController | null} params.fromScene PC scene
   * @param {import("@/lib/experience/types").StorySceneController | null} params.toScene Act 3 scene
   * @param {number} params.blend 0 = from only, 1 = to only
   */
  function render({ fromScene, toScene, blend }) {
    const clampedBlend = Math.min(1, Math.max(0, blend));

    // Hard swap (mobile / lite tier): no render targets, just show whichever
    // scene is active. Once blended in, render the destination scene — never
    // fall through to "render nothing" when the source scene has been disposed.
    if (!useDissolve) {
      const active = clampedBlend >= 1 ? toScene ?? fromScene : fromScene ?? toScene;
      if (active) {
        renderer.setRenderTarget(null);
        renderer.render(active.scene, active.camera);
      }
      return;
    }

    if (clampedBlend <= 0) {
      if (fromScene) {
        renderer.setRenderTarget(null);
        renderer.render(fromScene.scene, fromScene.camera);
      }
      return;
    }

    if (clampedBlend >= 1 || !fromScene) {
      if (toScene) {
        renderer.setRenderTarget(null);
        renderer.render(toScene.scene, toScene.camera);
        return;
      }

      if (fromScene) {
        renderer.setRenderTarget(null);
        renderer.render(fromScene.scene, fromScene.camera);
      }
      return;
    }

    if (!toScene) {
      renderer.setRenderTarget(null);
      renderer.render(fromScene.scene, fromScene.camera);
      return;
    }

    renderSceneToTarget(rtFrom, fromScene);
    renderSceneToTarget(rtTo, toScene);

    compositeMaterial.uniforms.uMix.value = clampedBlend;
    renderer.setRenderTarget(null);
    renderer.render(compositeScene, compositeCamera);
  }

  function resize(width, height) {
    rtFrom.setSize(width, height);
    rtTo.setSize(width, height);
  }

  function dispose() {
    rtFrom.dispose();
    rtTo.dispose();
    compositeQuad.geometry.dispose();
    compositeMaterial.dispose();
  }

  return { render, resize, dispose };
}
