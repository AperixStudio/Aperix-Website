"use client";

/**
 * Act3RevealCanvas — scroll-driven iPhone + monitor reveal scene.
 * Transparent renderer so SiteAtmosphere shows through (same as HeroCanvas).
 * Screen content is MP4 video textures on the 3D planes (no DOM iframe projection).
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
import {
  ACT3_IPHONE_VIDEO_SRC,
  ACT3_MONITOR_VIDEO_SRC,
} from "@/lib/act3ScreenContent";
import { applyScreenSpec, computeAutoScreenSpec } from "@/lib/act3ScreenPlanes";
import { easeInOutCubic, lerp } from "@/lib/threeAnimation";
import "./Act3RevealCanvas.css";

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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import("framer-motion").MotionValue<number>} [props.scrollProgress]
 * @param {typeof DEFAULT_ACT3_REVEAL_CONFIG} [props.liveConfig]
 * @param {boolean} [props.showScreenGuides] Dev-only overlay showing screen plane rects.
 */
export default function Act3RevealCanvas({
  className = "",
  scrollProgress = null,
  liveConfig = null,
  showScreenGuides = false,
}) {
  const containerRef = useRef(null);
  const latestConfigRef = useRef(DEFAULT_ACT3_REVEAL_CONFIG);
  latestConfigRef.current = resolveConfig(liveConfig);
  const showScreenGuidesRef = useRef(showScreenGuides);
  showScreenGuidesRef.current = showScreenGuides;

  const progressRef = useRef(scrollProgress?.get() ?? 0);
  const fallbackProgress = useMotionValue(0);
  const activeProgress = scrollProgress ?? fallbackProgress;

  useMotionValueEvent(activeProgress, "change", (value) => {
    progressRef.current = value;
  });

  useEffect(() => {
    progressRef.current = activeProgress.get();
  }, [activeProgress]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const config = latestConfigRef.current;
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd8ecff, 0.45);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    let iphoneRoot = null;
    let monitorRoot = null;
    let iphoneScreenPlane = null;
    let monitorScreenPlane = null;
    let pendingLoads = 2;
    let disposed = false;

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
      const liveConfig = latestConfigRef.current;
      const showGuides = showScreenGuidesRef.current;

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
        setLoading(false);
      }
    }

    function applyConfig() {
      const liveConfig = latestConfigRef.current;
      const scrollProgressValue = Math.min(1, Math.max(0, progressRef.current));
      const cameraProgress = mapCameraProgress(scrollProgressValue);

      scene.children.forEach((child) => {
        if (child.isAmbientLight) {
          child.intensity = liveConfig.ambientIntensity;
        }
      });
      keyLight.intensity = liveConfig.keyLightIntensity;
      fillLight.intensity = liveConfig.fillLightIntensity;

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

    function resize() {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      applyConfig();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    requestAnimationFrame(resize);

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      applyConfig();
      renderer.render(scene, camera);
    }
    animate();

    const loader = new GLTFLoader();

    function loadModel(path, onLoaded) {
      loader.load(
        path,
        (gltf) => {
          if (disposed) {
            return;
          }

          const root = gltf.scene;
          root.userData.baseFitScale = fitAndCenter(root, latestConfigRef.current.modelTargetSize);
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
            setError(`Failed to load ${path}`);
            setLoading(false);
          }
        },
      );
    }

    loadModel(latestConfigRef.current.iphonePath, (root) => {
      iphoneRoot = root;
    });
    loadModel(latestConfigRef.current.monitorPath, (root) => {
      monitorRoot = root;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
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
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`act3-reveal-scene ${className}`.trim()}>
      {(loading || error) && (
        <div className={`act3-reveal-scene__overlay ${error ? "act3-reveal-scene__overlay--error" : ""}`}>
          {error ?? "Loading models…"}
        </div>
      )}
      <div ref={containerRef} className="act3-reveal-scene__container" />
    </div>
  );
}
