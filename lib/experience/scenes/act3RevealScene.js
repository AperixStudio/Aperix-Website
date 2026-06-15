/**
 * Act 3 reveal scene — iPhone + monitor with MP4 screen textures.
 * Used by Act3RevealCanvas (dev) and StoryExperienceCanvas (production).
 */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import {
  ACT3_IPHONE_VIDEO_SRC,
  ACT3_MONITOR_VIDEO_SRC,
} from "@/lib/act3ScreenContent";
import { applyScreenSpec, computeAutoScreenSpec } from "@/lib/act3ScreenPlanes";
import { easeInOutCubic, lerp } from "@/lib/threeAnimation";
import { getRendererPixelRatio } from "@/lib/webglQuality";

function resolveConfig(liveConfig) {
  return liveConfig ?? DEFAULT_ACT3_REVEAL_CONFIG;
}

function fitAndCenter(object, targetSize) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const fitScale = targetSize / maxDim;
  object.scale.setScalar(fitScale);

  box.setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);

  return fitScale;
}

function applyModelPose(root, config, prefix, progress, scaleKey) {
  const t = easeInOutCubic(Math.min(1, Math.max(0, progress)));
  const scale = config[scaleKey] ?? 1;

  root.scale.setScalar(root.userData.baseFitScale * scale);
  root.position.set(
    lerp(config[`${prefix}StartX`], config[`${prefix}EndX`], t),
    lerp(config[`${prefix}StartY`], config[`${prefix}EndY`], t),
    lerp(config[`${prefix}StartZ`], config[`${prefix}EndZ`], t),
  );
  root.rotation.set(
    lerp(config[`${prefix}RotationStartX`], config[`${prefix}RotationEndX`], t),
    lerp(config[`${prefix}RotationStartY`], config[`${prefix}RotationEndY`], t),
    lerp(config[`${prefix}RotationStartZ`], config[`${prefix}RotationEndZ`], t),
  );
}

function mapCameraProgress(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped >= 0.88) {
    return 1;
  }
  return easeInOutCubic(clamped / 0.88);
}

function createHiddenVideo(src) {
  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.tabIndex = -1;
  video.style.cssText =
    "pointer-events:none;position:fixed;top:0;left:0;width:640px;height:360px;opacity:0.001;z-index:-1";
  document.body.appendChild(video);
  return video;
}

function tryPlayVideo(video) {
  if (!video) {
    return;
  }
  video.muted = true;
  video.playsInline = true;
  void video.play().catch(() => {
    /* autoplay may wait for user gesture */
  });
}

function createVideoTexture(video) {
  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createScreenPlane(video, guideColor) {
  const texture = createVideoTexture(video);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.name = "screen-projection";
  mesh.renderOrder = 12;
  mesh.userData.videoTexture = texture;
  mesh.userData.guideColor = guideColor;
  return mesh;
}

function applyScreenMaterialMode(mesh, showGuides) {
  const material = mesh.material;
  const texture = mesh.userData.videoTexture;

  if (showGuides) {
    material.map = null;
    material.color.set(mesh.userData.guideColor);
    material.transparent = true;
    material.opacity = 0.35;
    material.visible = true;
  } else {
    material.map = texture;
    material.color.set(0xffffff);
    material.transparent = false;
    material.opacity = 1;
    material.visible = Boolean(texture?.image?.readyState >= 2);
  }

  material.needsUpdate = true;
}

function createFloorPoolTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, "rgba(255,255,255,0.55)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.12)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFloorPoolMesh() {
  const texture = createFloorPoolTexture();
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 64), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = 1;
  mesh.name = "act3-floor-pool";
  mesh.userData.poolTexture = texture;
  return mesh;
}

/**
 * @param {object} options
 * @param {HTMLElement} options.container Size source when owning the renderer.
 * @param {THREE.WebGLRenderer | null} [options.renderer] Shared renderer from StoryExperienceCanvas.
 * @param {boolean} [options.ownRenderer=true] Create and append a canvas when renderer is omitted.
 * @param {boolean} [options.ownRenderLoop=true] Run requestAnimationFrame internally.
 * @param {() => number} options.getScrollProgress Act 3 local progress (0–1).
 * @param {() => typeof DEFAULT_ACT3_REVEAL_CONFIG} [options.getLiveConfig]
 * @param {() => boolean} [options.getShowScreenGuides]
 * @param {() => boolean} [options.getRenderActive]
 * @param {(message: string | null) => void} [options.onStatusChange]
 */
export function createAct3RevealScene({
  container,
  renderer: externalRenderer = null,
  ownRenderer = externalRenderer == null,
  ownRenderLoop = true,
  getScrollProgress,
  getLiveConfig = () => DEFAULT_ACT3_REVEAL_CONFIG,
  getShowScreenGuides = () => false,
  getRenderActive = () => true,
  onStatusChange,
}) {
  let disposed = false;
  let animationId = 0;
  let status = "Loading models…";
  let ready = false;

  const config = resolveConfig(getLiveConfig());
  const monitorVideo = createHiddenVideo(config.monitorScreenVideo ?? ACT3_MONITOR_VIDEO_SRC);
  const iphoneVideo = createHiddenVideo(config.iphoneScreenVideo ?? ACT3_IPHONE_VIDEO_SRC);

  const onMonitorReady = () => tryPlayVideo(monitorVideo);
  const onIphoneReady = () => tryPlayVideo(iphoneVideo);
  monitorVideo.addEventListener("loadeddata", onMonitorReady);
  iphoneVideo.addEventListener("loadeddata", onIphoneReady);
  tryPlayVideo(monitorVideo);
  tryPlayVideo(iphoneVideo);

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const lookAt = new THREE.Vector3();

  const renderer =
    externalRenderer ??
    new THREE.WebGLRenderer({ antialias: true, alpha: true });

  if (ownRenderer) {
    renderer.setPixelRatio(getRendererPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(3.5, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd8ecff, 0.45);
  fillLight.position.set(-4, 2, 2);
  scene.add(fillLight);

  const spotLight = new THREE.SpotLight(0xffffff, 2.4, 24, 0.52, 0.65, 1);
  spotLight.position.set(0.2, 7.5, 1.2);
  spotLight.target.position.set(0, 0.15, 0);
  scene.add(spotLight);
  scene.add(spotLight.target);

  const floorPool = createFloorPoolMesh();
  scene.add(floorPool);

  let iphoneRoot = null;
  let monitorRoot = null;
  let iphoneScreenPlane = null;
  let monitorScreenPlane = null;
  let pendingLoads = 2;

  function setStatus(next) {
    status = next;
    onStatusChange?.(next);
  }

  function attachScreenPlanes() {
    if (iphoneRoot && !iphoneScreenPlane) {
      iphoneScreenPlane = createScreenPlane(iphoneVideo, 0x22c55e);
      iphoneRoot.add(iphoneScreenPlane);
    }

    if (monitorRoot && !monitorScreenPlane) {
      monitorScreenPlane = createScreenPlane(monitorVideo, 0x38bdf8);
      monitorRoot.add(monitorScreenPlane);
    }
  }

  function updateScreenPlanes() {
    const liveConfig = resolveConfig(getLiveConfig());
    const showGuides = getShowScreenGuides();

    if (iphoneScreenPlane && iphoneRoot) {
      applyScreenSpec(iphoneScreenPlane, computeAutoScreenSpec(iphoneRoot, "iphone", liveConfig));
      applyScreenMaterialMode(iphoneScreenPlane, showGuides);
    }

    if (monitorScreenPlane && monitorRoot) {
      applyScreenSpec(monitorScreenPlane, computeAutoScreenSpec(monitorRoot, "monitor", liveConfig));
      applyScreenMaterialMode(monitorScreenPlane, showGuides);
    }
  }

  function finishLoad() {
    pendingLoads -= 1;
    if (pendingLoads <= 0 && !disposed) {
      attachScreenPlanes();
      applyConfig();
      ready = true;
      setStatus(null);
    }
  }

  function applyConfig() {
    const liveConfig = resolveConfig(getLiveConfig());
    const scrollProgressValue = Math.min(1, Math.max(0, getScrollProgress()));
    const cameraProgress = mapCameraProgress(scrollProgressValue);

    scene.children.forEach((child) => {
      if (child.isAmbientLight) {
        child.intensity = liveConfig.ambientIntensity;
      }
    });
    keyLight.intensity = liveConfig.keyLightIntensity;
    keyLight.position.set(
      liveConfig.keyLightX ?? 3.5,
      liveConfig.keyLightY ?? 5,
      liveConfig.keyLightZ ?? 4,
    );
    fillLight.intensity = liveConfig.fillLightIntensity;
    fillLight.position.set(
      liveConfig.fillLightX ?? -4,
      liveConfig.fillLightY ?? 2,
      liveConfig.fillLightZ ?? 2,
    );

    const spotEnabled = liveConfig.spotLightEnabled !== false;
    spotLight.visible = spotEnabled;
    spotLight.intensity = liveConfig.spotLightIntensity ?? 2.4;
    spotLight.position.set(
      liveConfig.spotLightX ?? 0.2,
      liveConfig.spotLightY ?? 7.5,
      liveConfig.spotLightZ ?? 1.2,
    );
    spotLight.target.position.set(
      liveConfig.spotLightTargetX ?? 0,
      liveConfig.spotLightTargetY ?? 0.15,
      liveConfig.spotLightTargetZ ?? 0,
    );
    spotLight.angle = liveConfig.spotLightAngle ?? 0.52;
    spotLight.penumbra = liveConfig.spotLightPenumbra ?? 0.65;

    const poolEnabled = liveConfig.floorPoolEnabled !== false;
    floorPool.visible = poolEnabled;
    floorPool.position.y = liveConfig.floorPoolY ?? -0.42;
    const poolScale = liveConfig.floorPoolScale ?? 5.5;
    floorPool.scale.set(poolScale, poolScale, 1);
    floorPool.material.opacity = liveConfig.floorPoolOpacity ?? 0.55;

    if (iphoneRoot) {
      applyModelPose(iphoneRoot, liveConfig, "iphone", scrollProgressValue, "iphoneScale");
    }
    if (monitorRoot) {
      applyModelPose(monitorRoot, liveConfig, "monitor", scrollProgressValue, "monitorScale");
    }

    updateScreenPlanes();

    camera.position.set(
      lerp(liveConfig.cameraStartX, liveConfig.cameraEndX, cameraProgress),
      lerp(liveConfig.cameraStartY, liveConfig.cameraEndY, cameraProgress),
      lerp(liveConfig.cameraStartZ, liveConfig.cameraEndZ, cameraProgress),
    );
    lookAt.set(
      lerp(liveConfig.lookAtStartX, liveConfig.lookAtEndX, cameraProgress),
      lerp(liveConfig.lookAtStartY, liveConfig.lookAtEndY, cameraProgress),
      lerp(liveConfig.lookAtStartZ, liveConfig.lookAtEndZ, cameraProgress),
    );
    camera.lookAt(lookAt);
  }

  function resize(width, height) {
    if (width === 0 || height === 0) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (ownRenderer) {
      renderer.setPixelRatio(getRendererPixelRatio());
      renderer.setSize(width, height);
    }

    applyConfig();
  }

  function tick() {
    const isActive = getRenderActive() && !document.hidden;
    if (!isActive) {
      monitorVideo.pause();
      iphoneVideo.pause();
      return;
    }

    tryPlayVideo(monitorVideo);
    tryPlayVideo(iphoneVideo);
    applyConfig();

    if (ownRenderLoop) {
      renderer.render(scene, camera);
    }
  }

  if (ownRenderLoop) {
    function animate() {
      animationId = requestAnimationFrame(animate);
      tick();
    }
    animate();
  }

  const loader = new GLTFLoader();

  function loadModel(path, onLoaded) {
    loader.load(
      path,
      (gltf) => {
        if (disposed) {
          return;
        }

        const root = gltf.scene;
        root.userData.baseFitScale = fitAndCenter(root, resolveConfig(getLiveConfig()).modelTargetSize);
        root.userData.boundsBox = new THREE.Box3().setFromObject(root);
        root.userData.screenFaceBase = null;
        scene.add(root);
        onLoaded(root);
        finishLoad();
      },
      undefined,
      (loadError) => {
        console.error("[Act3Reveal] Failed to load model:", path, loadError);
        if (!disposed) {
          setStatus(`Failed to load ${path}`);
        }
      },
    );
  }

  loadModel(resolveConfig(getLiveConfig()).iphonePath, (root) => {
    iphoneRoot = root;
  });
  loadModel(resolveConfig(getLiveConfig()).monitorPath, (root) => {
    monitorRoot = root;
  });

  function dispose() {
    disposed = true;
    cancelAnimationFrame(animationId);
    monitorVideo.removeEventListener("loadeddata", onMonitorReady);
    iphoneVideo.removeEventListener("loadeddata", onIphoneReady);
    monitorVideo.pause();
    iphoneVideo.pause();
    if (monitorVideo.parentNode) {
      monitorVideo.parentNode.removeChild(monitorVideo);
    }
    if (iphoneVideo.parentNode) {
      iphoneVideo.parentNode.removeChild(iphoneVideo);
    }
    iphoneScreenPlane?.userData.videoTexture?.dispose();
    monitorScreenPlane?.userData.videoTexture?.dispose();
    floorPool.userData.poolTexture?.dispose();
    floorPool.geometry.dispose();
    floorPool.material.dispose();

    if (ownRenderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
  }

  return {
    id: "act3",
    scene,
    camera,
    renderer,
    tick,
    resize,
    dispose,
    isReady: () => ready,
    getStatus: () => status,
  };
}
