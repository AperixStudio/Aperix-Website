/**
 * PC hero scene — retro monitor, video screen, Act 2 blueprint/wireframe/live evolution.
 * Used by HeroCanvas (dev) and StoryExperienceCanvas (production).
 */

import * as THREE from "three";
import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import { createGltfLoader, resolveGltfRoot } from "@/lib/experience/gltfLoader";
import {
  applyRoundedScreenUniforms,
  applyRoundedScreenAspect,
  createRoundedScreenMaterial,
  isRoundedScreenMaterial,
} from "@/lib/experience/roundedScreenMaterial";
import { drawDeskScreen } from "@/lib/deskEvolutionScreen";
import { HOME_STORY_CLEAR_COLOR } from "@/lib/homeStoryTheme";
import { getRendererPixelRatio } from "@/lib/webglQuality";
import { lerp } from "@/lib/threeAnimation";

const MODEL_ASSET_VERSION = 4;
const MODEL_PATHS = [
  `/retro_pc_comp.glb?v=${MODEL_ASSET_VERSION}`,
  `/retro_electronics_retro_pc.glb?v=${MODEL_ASSET_VERSION}`,
];
const SCREEN_MATERIAL_NAMES = ["grid", "mat16"];
const INTRO_LABEL_TEXT = "APERIX STUDIOS";
const MODEL_TARGET_SIZE = 2.2;

function resolveConfig(liveConfig) {
  if (!liveConfig) {
    return DEFAULT_HERO_CANVAS_CONFIG;
  }
  return { ...DEFAULT_HERO_CANVAS_CONFIG, ...liveConfig };
}

function resolveLabelFill(value) {
  if (typeof value === "number") {
    return `rgba(255,255,255,${value})`;
  }
  return value;
}

function modelHasMeshes(root) {
  let hasMesh = false;
  root.traverse((child) => {
    if (child.isMesh) {
      hasMesh = true;
    }
  });
  return hasMesh;
}

function findScreenMesh(root) {
  if (!root?.traverse) {
    return null;
  }

  let match = null;

  root.traverse((child) => {
    if (!child.isMesh || match) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (SCREEN_MATERIAL_NAMES.includes(material?.name)) {
        match = { mesh: child, material };
      }
    });
  });

  return match;
}

function computeScreenFillDistance(size, aspect, fovDeg, margin) {
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const distY = (size.y * margin) / (2 * Math.tan(vFov / 2));
  const distX = (size.x * margin) / (2 * Math.tan(hFov / 2));
  return Math.max(distX, distY, 0.01);
}

function computeMonitorFaceFrame(screenMesh, camera, box, target) {
  const center = box.getCenter(target.center);

  screenMesh.updateWorldMatrix(true, true);
  const meshQuat = screenMesh.getWorldQuaternion(target.quaternion);

  const toCamera = target.toCamera.subVectors(camera.position, center);
  if (toCamera.lengthSq() < 1e-6) {
    toCamera.set(0, 0, 1);
  }
  toCamera.normalize();

  const localAxes = target.localAxes;
  localAxes[0].set(1, 0, 0);
  localAxes[1].set(-1, 0, 0);
  localAxes[2].set(0, 1, 0);
  localAxes[3].set(0, -1, 0);
  localAxes[4].set(0, 0, 1);
  localAxes[5].set(0, 0, -1);

  let bestDot = -Infinity;
  let bestNormal = target.normal.set(0, 0, 1);

  for (let i = 0; i < localAxes.length; i += 1) {
    const worldAxis = target.axis.copy(localAxes[i]).applyQuaternion(meshQuat).normalize();
    const dot = worldAxis.dot(toCamera);
    if (dot > bestDot) {
      bestDot = dot;
      bestNormal.copy(worldAxis);
    }
  }

  let worldUp = target.up.set(0, 1, 0).applyQuaternion(meshQuat);
  if (Math.abs(worldUp.dot(bestNormal)) > 0.92) {
    worldUp = target.up.set(1, 0, 0).applyQuaternion(meshQuat);
  }

  target.right.crossVectors(worldUp, bestNormal);
  if (target.right.lengthSq() < 1e-6) {
    target.right.set(1, 0, 0);
  }
  target.right.normalize();
  target.up.crossVectors(bestNormal, target.right).normalize();

  target.basis.makeBasis(target.right, target.up, bestNormal);
  target.quaternion.setFromRotationMatrix(target.basis);
  target.normal.copy(bestNormal);
  setMonitorPlaneExtents(box, center, target.right, target.up, target);

  return target;
}

function setMonitorPlaneExtents(box, center, right, up, target) {
  let minRight = Infinity;
  let maxRight = -Infinity;
  let minUp = Infinity;
  let maxUp = -Infinity;
  const corner = target.axis;

  for (let xi = 0; xi < 2; xi += 1) {
    for (let yi = 0; yi < 2; yi += 1) {
      for (let zi = 0; zi < 2; zi += 1) {
        corner.set(
          xi ? box.max.x : box.min.x,
          yi ? box.max.y : box.min.y,
          zi ? box.max.z : box.min.z,
        );
        const relRight = corner.clone().sub(center).dot(right);
        const relUp = corner.clone().sub(center).dot(up);
        minRight = Math.min(minRight, relRight);
        maxRight = Math.max(maxRight, relRight);
        minUp = Math.min(minUp, relUp);
        maxUp = Math.max(maxUp, relUp);
      }
    }
  }

  target.planeWidth = Math.max(maxRight - minRight, 0.001);
  target.planeHeight = Math.max(maxUp - minUp, 0.001);
}

function computeMonitorFaceFrameFromLockedLocal(screenMesh, box, localNormal, localUp, localRight, target) {
  const center = box.getCenter(target.center);

  screenMesh.updateWorldMatrix(true, true);
  const meshQuat = screenMesh.getWorldQuaternion(target.quaternion);

  target.normal.copy(localNormal).applyQuaternion(meshQuat).normalize();
  target.up.copy(localUp).applyQuaternion(meshQuat).normalize();
  target.right.copy(localRight).applyQuaternion(meshQuat).normalize();

  target.right.crossVectors(target.up, target.normal);
  if (target.right.lengthSq() < 1e-6) {
    target.right.set(1, 0, 0);
  }
  target.right.normalize();
  target.up.crossVectors(target.normal, target.right).normalize();

  target.basis.makeBasis(target.right, target.up, target.normal);
  target.quaternion.setFromRotationMatrix(target.basis);
  setMonitorPlaneExtents(box, center, target.right, target.up, target);

  return target;
}

function lockMonitorFaceToMesh(screenMesh, camera, box, frame, storage, scratchQuat, scratchInvQuat) {
  computeMonitorFaceFrame(screenMesh, camera, box, frame);
  screenMesh.getWorldQuaternion(scratchQuat);
  scratchInvQuat.copy(scratchQuat).invert();
  storage.normal.copy(frame.normal).applyQuaternion(scratchInvQuat).normalize();
  storage.up.copy(frame.up).applyQuaternion(scratchInvQuat).normalize();
  storage.right.copy(frame.right).applyQuaternion(scratchInvQuat).normalize();
  storage.locked = true;
}

function createIntroLabelTexture(text, fill) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = resolveLabelFill(fill);
  ctx.font = "700 72px Syne, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * @param {object} options
 * @param {HTMLElement} options.container
 * @param {THREE.WebGLRenderer | null} [options.renderer]
 * @param {boolean} [options.ownRenderer=true]
 * @param {boolean} [options.ownRenderLoop=true]
 * @param {string} [options.canvasClassName]
 * @param {() => number} options.getScrollProgress PC camera progress (0–1).
 * @param {() => number} [options.getScreenEvolutionProgress] Act 2 screen evolution (0–1).
 * @param {() => Record<string, unknown>} [options.getLiveConfig]
 * @param {() => HTMLVideoElement | null} [options.getVideoElement]
 * @param {() => boolean} [options.getShowIntroLabel]
 * @param {() => boolean} [options.getIsDevPlayground]
 * @param {() => boolean} [options.getRenderActive]
 * @param {(message: string | null) => void} [options.onStatusChange]
 */
export function createPcStoryScene({
  container,
  renderer: externalRenderer = null,
  ownRenderer = externalRenderer == null,
  ownRenderLoop = true,
  canvasClassName = "hero-canvas__container",
  getScrollProgress,
  getScreenEvolutionProgress = () => 0,
  getLiveConfig = () => DEFAULT_HERO_CANVAS_CONFIG,
  getVideoElement = () => null,
  getShowIntroLabel = () => false,
  getIsDevPlayground = () => false,
  getSimulateMobileViewport = () => false,
  getRenderActive = () => true,
  onStatusChange,
}) {
  let disposed = false;
  let animationFrame = 0;
  let status = "Loading model…";
  let ready = false;

  let modelRoot = null;
  let screenPlane = null;
  let evolutionScreenPlane = null;
  let evolutionCanvas = null;
  let evolutionCtx = null;
  let evolutionTexture = null;
  let introLabelMesh = null;
  let introLabelTexture = null;
  let videoTexture = null;
  let screenMaterial = null;
  let screenMesh = null;
  let modelLoaded = false;
  let screenPlaneAttached = false;
  let videoAttached = false;

  let originCenter = new THREE.Vector3();
  const labelSpin = new THREE.Quaternion();
  const labelEuler = new THREE.Euler();
  const monitorBox = new THREE.Box3();
  const monitorFrame = {
    center: new THREE.Vector3(),
    size: new THREE.Vector3(),
    normal: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    toCamera: new THREE.Vector3(),
    up: new THREE.Vector3(),
    right: new THREE.Vector3(),
    axis: new THREE.Vector3(),
    basis: new THREE.Matrix4(),
    localAxes: Array.from({ length: 6 }, () => new THREE.Vector3()),
    planeWidth: 1,
    planeHeight: 1,
  };
  const labelLocalOffset = new THREE.Vector3();
  const screenPlaneLocalOffset = new THREE.Vector3();
  const screenPlaneSpin = new THREE.Quaternion();
  const screenPlaneEuler = new THREE.Euler();
  const monitorFaceLock = {
    locked: false,
    normal: new THREE.Vector3(),
    up: new THREE.Vector3(),
    right: new THREE.Vector3(),
  };
  const meshWorldQuat = new THREE.Quaternion();
  const meshWorldQuatInv = new THREE.Quaternion();

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const renderer =
    externalRenderer ??
    new THREE.WebGLRenderer({ alpha: true, antialias: true });

  if (ownRenderer) {
    renderer.setPixelRatio(getRendererPixelRatio({ simulateMobile: getSimulateMobileViewport() }));
    renderer.setClearColor(HOME_STORY_CLEAR_COLOR, 1);
    renderer.domElement.className = canvasClassName;
    container.appendChild(renderer.domElement);
  }

  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(2, 3, 4);
  const rim = new THREE.DirectionalLight(0xc8d8e4, 0.45);
  rim.position.set(-2, 1, -3);
  scene.add(ambient, key, rim);

  function setStatus(next) {
    status = next;
    onStatusChange?.(next);
  }

  function getCameraStartPosition(config) {
    const az = config.cameraStartAzimuth;
    const el = config.cameraStartElevation;
    let dist = config.cameraStartBackoff;

    if (screenMesh && config.screenFillMargin) {
      screenMesh.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(screenMesh);
      const size = box.getSize(new THREE.Vector3());
      const fillDist = computeScreenFillDistance(
        size,
        camera.aspect,
        camera.fov,
        config.screenFillMargin,
      );
      dist = Math.max(dist, fillDist);
    }

    return new THREE.Vector3(
      dist * Math.sin(az) * Math.cos(el),
      dist * Math.sin(el),
      dist * Math.cos(az) * Math.cos(el) * config.cameraStartZRatio,
    );
  }

  function getCameraEndPosition(config) {
    return new THREE.Vector3(
      config.cameraDistanceX,
      config.cameraDistanceY + originCenter.y * config.cameraTargetYRatio,
      config.cameraDistanceZ,
    );
  }

  function getMonitorFrame() {
    if (!screenMesh) {
      return null;
    }

    screenMesh.updateWorldMatrix(true, true);
    monitorBox.setFromObject(screenMesh);

    if (monitorFaceLock.locked) {
      return computeMonitorFaceFrameFromLockedLocal(
        screenMesh,
        monitorBox,
        monitorFaceLock.normal,
        monitorFaceLock.up,
        monitorFaceLock.right,
        monitorFrame,
      );
    }

    return computeMonitorFaceFrame(screenMesh, camera, monitorBox, monitorFrame);
  }

  function updateScreenPlaneTransform(config, progress) {
    const frame = getMonitorFrame();
    if (!frame) {
      return;
    }

    const applyToPlane = (plane) => {
      if (!plane) {
        return;
      }

      const normalOffset = lerp(
        config.screenPlaneOffsetStart ?? 0,
        config.screenPlaneOffsetEnd ?? 0,
        progress,
      );

      plane.position.copy(frame.center);
      plane.position.addScaledVector(frame.normal, normalOffset);
      plane.quaternion.copy(frame.quaternion);

      screenPlaneEuler.set(
        lerp(config.screenPlaneRotationStartX ?? 0, config.screenPlaneRotationEndX ?? 0, progress),
        lerp(config.screenPlaneRotationStartY ?? 0, config.screenPlaneRotationEndY ?? 0, progress),
        lerp(config.screenPlaneRotationStartZ ?? 0, config.screenPlaneRotationEndZ ?? 0, progress),
        "XYZ",
      );
      screenPlaneSpin.setFromEuler(screenPlaneEuler);
      plane.quaternion.multiply(screenPlaneSpin);

      screenPlaneLocalOffset.set(
        lerp(config.screenPlaneLocalStartX ?? 0, config.screenPlaneLocalEndX ?? 0, progress),
        lerp(config.screenPlaneLocalStartY ?? 0, config.screenPlaneLocalEndY ?? 0, progress),
        lerp(config.screenPlaneLocalStartZ ?? 0, config.screenPlaneLocalEndZ ?? 0, progress),
      );
      screenPlaneLocalOffset.applyQuaternion(frame.quaternion);
      plane.position.add(screenPlaneLocalOffset);

      plane.scale.set(
        frame.planeWidth *
          lerp(config.screenPlaneScaleWidthStart ?? 1, config.screenPlaneScaleWidthEnd ?? 1, progress),
        frame.planeHeight *
          lerp(config.screenPlaneScaleHeightStart ?? 1, config.screenPlaneScaleHeightEnd ?? 1, progress),
        1,
      );
    };

    applyToPlane(screenPlane);
    applyToPlane(evolutionScreenPlane);

    const cornerRadius = config.screenPlaneCornerRadius ?? 0.04;
    applyRoundedScreenAspect(screenPlane, cornerRadius);
    applyRoundedScreenAspect(evolutionScreenPlane, cornerRadius);

    if (screenPlane?.material) {
      screenPlane.material.polygonOffset = true;
      screenPlane.material.polygonOffsetFactor = config.screenPlanePolygonOffset;
      screenPlane.material.polygonOffsetUnits = 1;
    }

    if (evolutionScreenPlane?.material) {
      evolutionScreenPlane.material.polygonOffset = true;
      evolutionScreenPlane.material.polygonOffsetFactor = config.screenPlanePolygonOffset - 1;
      evolutionScreenPlane.material.polygonOffsetUnits = 1;
    }
  }

  function updateIntroLabelTransform(config, progress) {
    const frame = getMonitorFrame();
    if (!introLabelMesh || !frame) {
      return;
    }

    labelLocalOffset.set(
      lerp(config.introLabelOffsetStartX, config.introLabelOffsetEndX, progress),
      lerp(config.introLabelGapStart, config.introLabelGapEnd, progress) +
        lerp(config.introLabelOffsetStartY, config.introLabelOffsetEndY, progress),
      lerp(config.introLabelOffsetNormalStart, config.introLabelOffsetNormalEnd, progress) +
        lerp(config.introLabelOffsetStartZ, config.introLabelOffsetEndZ, progress),
    );
    labelLocalOffset.applyQuaternion(frame.quaternion);

    introLabelMesh.position.copy(frame.center).add(labelLocalOffset);
    introLabelMesh.quaternion.copy(frame.quaternion);

    labelEuler.set(
      lerp(config.introLabelRotationStartX ?? 0, config.introLabelRotationEndX ?? 0, progress),
      lerp(config.introLabelRotationStartY ?? 0, config.introLabelRotationEndY ?? 0, progress),
      lerp(config.introLabelRotationStartZ ?? 0, config.introLabelRotationEndZ ?? 0, progress),
      "XYZ",
    );
    labelSpin.setFromEuler(labelEuler);
    introLabelMesh.quaternion.multiply(labelSpin);

    introLabelMesh.scale.set(
      frame.planeWidth * config.introLabelWidthRatio,
      frame.planeWidth * config.introLabelHeightRatio,
      1,
    );
    introLabelMesh.visible =
      getShowIntroLabel() &&
      getScreenEvolutionProgress() < 0.04 &&
      getScrollProgress() <= 0.92;
  }

  function applyLighting(config) {
    if (config.ambientColor) ambient.color.set(config.ambientColor);
    ambient.intensity = config.ambientIntensity ?? 0.9;
    if (config.keyLightColor) key.color.set(config.keyLightColor);
    key.intensity = config.keyLightIntensity ?? 1.1;
    key.position.set(config.keyLightX ?? 2, config.keyLightY ?? 3, config.keyLightZ ?? 4);
    if (config.rimLightColor) rim.color.set(config.rimLightColor);
    rim.intensity = config.rimLightIntensity ?? 0.45;
    rim.position.set(config.rimLightX ?? -2, config.rimLightY ?? 1, config.rimLightZ ?? -3);
  }

  let lightingInitialized = false;

  function applyLiveConfig(config) {
    if (getIsDevPlayground() || !lightingInitialized) {
      applyLighting(config);
      lightingInitialized = true;
    }

    if (!modelRoot) {
      return;
    }

    const progress = getScrollProgress();

    modelRoot.position.set(
      lerp(config.modelOffsetStartX, config.modelOffsetEndX, progress),
      lerp(config.modelOffsetStartY, config.modelOffsetEndY, progress),
      lerp(config.modelOffsetStartZ, config.modelOffsetEndZ, progress),
    );

    modelRoot.rotation.set(
      lerp(0, config.modelRotationX ?? 0, progress),
      lerp(0, config.modelRotationY, progress),
      lerp(0, config.modelRotationZ ?? 0, progress),
    );

    const startCam = getCameraStartPosition(config);
    const endCam = getCameraEndPosition(config);
    camera.position.lerpVectors(startCam, endCam, progress);

    const pivotY = originCenter.y * config.cameraOrbitPivotYRatio;
    camera.lookAt(0, pivotY, 0);

    updateScreenPlaneTransform(config, progress);
    updateIntroLabelTransform(config, progress);
  }

  function attachVideoTexture(video) {
    if (!video || video.readyState < 2) {
      return false;
    }

    if (videoTexture?.image === video) {
      return true;
    }

    if (videoTexture) {
      videoTexture.dispose();
    }

    videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    if (screenPlane?.material) {
      if (isRoundedScreenMaterial(screenPlane.material)) {
        applyRoundedScreenUniforms(screenPlane.material, { map: videoTexture });
        screenPlane.material.depthTest = false;
      } else {
        screenPlane.material.map = videoTexture;
        screenPlane.material.color.set(0xffffff);
        screenPlane.material.opacity = 1;
        screenPlane.material.transparent = true;
        screenPlane.material.depthWrite = false;
        screenPlane.material.depthTest = false;
        screenPlane.material.toneMapped = false;
        screenPlane.material.needsUpdate = true;
      }
    }

    return true;
  }

  function tryAttachVideo() {
    const video = getVideoElement();
    if (!video || !screenPlaneAttached) {
      return;
    }

    if (attachVideoTexture(video)) {
      videoAttached = true;
    }
  }

  function setupEvolutionScreenPlane(config) {
    evolutionCanvas = document.createElement("canvas");
    evolutionCanvas.width = 960;
    evolutionCanvas.height = 600;
    evolutionCtx = evolutionCanvas.getContext("2d");
    if (evolutionCtx) {
      drawDeskScreen(evolutionCtx, 0);
    }

    evolutionTexture = new THREE.CanvasTexture(evolutionCanvas);
    evolutionTexture.colorSpace = THREE.SRGBColorSpace;
    evolutionTexture.minFilter = THREE.LinearFilter;
    evolutionTexture.magFilter = THREE.LinearFilter;

    evolutionScreenPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      createRoundedScreenMaterial({
        map: evolutionTexture,
        cornerRadius: config.screenPlaneCornerRadius ?? 0.04,
        opacity: 0,
        depthTest: false,
        polygonOffsetFactor: (config.screenPlanePolygonOffset ?? -1) - 1,
      }),
    );
    evolutionScreenPlane.renderOrder = 12;
    scene.add(evolutionScreenPlane);
  }

  function setScreenPlaneOpacity(plane, opacity) {
    if (!plane?.material) {
      return;
    }

    if (isRoundedScreenMaterial(plane.material)) {
      applyRoundedScreenUniforms(plane.material, { opacity });
      return;
    }

    plane.material.opacity = opacity;
  }

  let lastEvolutionDrawn = -1;

  function updateScreenContent() {
    const evolution = getScreenEvolutionProgress();
    const crossfade = Math.min(1, Math.max(0, evolution / 0.14));

    if (evolutionScreenPlane?.material) {
      if (evolutionCtx && evolutionTexture) {
        const evolutionStep = Math.round(evolution * 400) / 400;
        if (evolutionStep !== lastEvolutionDrawn) {
          drawDeskScreen(evolutionCtx, evolution);
          evolutionTexture.needsUpdate = true;
          lastEvolutionDrawn = evolutionStep;
        }
      }
      setScreenPlaneOpacity(evolutionScreenPlane, crossfade);
    }

    if (screenPlane?.material) {
      setScreenPlaneOpacity(screenPlane, 1 - crossfade);
      screenPlane.renderOrder = 10;
    }
  }

  function setupScreenPlane(config) {
    if (!screenMesh || !screenMaterial) {
      return;
    }

    screenMaterial.visible = true;

    screenPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      createRoundedScreenMaterial({
        cornerRadius: config.screenPlaneCornerRadius ?? 0.04,
        opacity: 0,
        depthTest: false,
        polygonOffsetFactor: config.screenPlanePolygonOffset ?? -1,
      }),
    );

    scene.add(screenPlane);
    setupEvolutionScreenPlane(config);
    updateScreenPlaneTransform(config, 0);
    screenPlaneAttached = true;
  }

  function setupIntroLabel(config) {
    if (introLabelMesh) {
      scene.remove(introLabelMesh);
      introLabelMesh.geometry.dispose();
      introLabelMesh.material.dispose();
      introLabelTexture?.dispose();
    }

    introLabelTexture = createIntroLabelTexture(
      INTRO_LABEL_TEXT,
      config.introLabelTextFill,
    );
    if (!introLabelTexture) {
      return;
    }

    introLabelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: introLabelTexture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    );
    introLabelMesh.visible = getShowIntroLabel();
    introLabelMesh.renderOrder = 15;
    scene.add(introLabelMesh);
  }

  function resize(width, height) {
    const config = resolveConfig(getLiveConfig());
    if (config.cameraFov) {
      camera.fov = config.cameraFov;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (ownRenderer) {
      renderer.setPixelRatio(getRendererPixelRatio({ simulateMobile: getSimulateMobileViewport() }));
      renderer.setSize(width, height, false);
    }
  }

  function tick() {
    if (!getRenderActive() || document.hidden) {
      return;
    }

    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }

    if (!videoAttached && modelLoaded && getVideoElement()) {
      tryAttachVideo();
    }

    if (getIsDevPlayground() || modelRoot) {
      applyLiveConfig(resolveConfig(getLiveConfig()));
      updateScreenContent();
    }

    if (ownRenderLoop) {
      renderer.render(scene, camera);
    }
  }

  if (ownRenderLoop) {
    function loop() {
      animationFrame = requestAnimationFrame(loop);
      tick();
    }
    loop();
  }

  const loader = createGltfLoader();

  function onModelLoaded(gltf, pathIndex, modelPath) {
    if (disposed) {
      return;
    }

    const root = resolveGltfRoot(gltf);
    const hasFallback = pathIndex + 1 < MODEL_PATHS.length;

    if (!root || !modelHasMeshes(root)) {
      const reason = !root ? "no scene root" : "no mesh content";
      const log = hasFallback ? console.warn : console.error;
      log(`PC model rejected (${modelPath}): ${reason}`, gltf);

      if (hasFallback) {
        loadPcModel(pathIndex + 1);
        return;
      }

      setStatus(`Failed to parse PC model: ${modelPath}`);
      return;
    }

    modelRoot = root;
    const screenTarget = findScreenMesh(modelRoot);
    if (screenTarget) {
      screenMesh = screenTarget.mesh;
      screenMaterial = screenTarget.material;
    } else {
      console.warn(
        "No screen material found. Expected one of:",
        SCREEN_MATERIAL_NAMES.join(", "),
      );
    }

    modelRoot.traverse((child) => {
      if (!child.isMesh) {
        return;
      }
      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!material) {
          return;
        }
        material.visible = true;
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
    });

    scene.add(modelRoot);

    const modelBox = new THREE.Box3().setFromObject(modelRoot);
    const modelSize = modelBox.getSize(new THREE.Vector3());
    modelBox.getCenter(originCenter);

    const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.001);
    const fitScale = MODEL_TARGET_SIZE / maxDim;
    modelRoot.scale.setScalar(fitScale);

    modelBox.setFromObject(modelRoot);
    modelBox.getCenter(originCenter);
    modelRoot.position.sub(originCenter);

    const config = resolveConfig(getLiveConfig());
    setupScreenPlane(config);
    setupIntroLabel(config);
    applyLiveConfig(config);

    if (screenMesh) {
      lockMonitorFaceToMesh(
        screenMesh,
        camera,
        monitorBox.setFromObject(screenMesh),
        monitorFrame,
        monitorFaceLock,
        meshWorldQuat,
        meshWorldQuatInv,
      );
    }

    modelLoaded = true;
    ready = Boolean(screenMesh);
    tryAttachVideo();
    setStatus(screenMesh ? null : "Screen mesh not found on PC model");
  }

  function loadPcModel(pathIndex = 0) {
    const modelPath = MODEL_PATHS[pathIndex];
    if (!modelPath) {
      return;
    }

    loader.load(
      modelPath,
      (gltf) => onModelLoaded(gltf, pathIndex, modelPath),
      undefined,
      (error) => {
        if (disposed) {
          return;
        }

        console.error(`PC model load failed (${modelPath}):`, error);

        if (pathIndex + 1 < MODEL_PATHS.length) {
          console.warn(`Trying fallback model: ${MODEL_PATHS[pathIndex + 1]}`);
          loadPcModel(pathIndex + 1);
          return;
        }

        const detail = error?.message ? `: ${error.message}` : "";
        setStatus(
          `Failed to load PC model${detail}. Add retro_pc_comp.glb and /public/draco/gltf/ to the deploy.`,
        );
      },
    );
  }

  loadPcModel();

  function dispose() {
    disposed = true;
    cancelAnimationFrame(animationFrame);
    videoTexture?.dispose();
    evolutionTexture?.dispose();
    introLabelTexture?.dispose();
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });

    if (ownRenderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
  }

  return {
    id: "pc",
    scene,
    camera,
    renderer,
    tick,
    resize,
    dispose,
    tryAttachVideo,
    isReady: () => ready,
    getStatus: () => status,
  };
}
