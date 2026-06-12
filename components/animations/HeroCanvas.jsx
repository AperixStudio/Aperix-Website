"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEFAULT_HERO_CANVAS_CONFIG } from "@/lib/heroCanvasConfig";
import { drawDeskScreen } from "@/lib/deskEvolutionScreen";
import { lerp } from "@/lib/threeAnimation";
import "./HeroCanvas.css";

const MODEL_PATH = "/retro_electronics_retro_pc.glb";
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

function findScreenMesh(root) {
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

/** Build a plane frame on the mesh face that most faces the camera (monitor surface). */
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

/** Build frame from mesh-local axes locked at load — keeps the video plane on the monitor during scroll. */
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
 * @param {{
 *   scrollProgress: import("framer-motion").MotionValue<number>,
 *   screenEvolutionProgress?: import("framer-motion").MotionValue<number> | null,
 *   liveConfig?: Record<string, unknown> | null,
 *   videoElement?: HTMLVideoElement | null,
 *   showIntroLabel?: boolean,
 *   className?: string,
 * }} props
 */
export default function HeroCanvas({
  scrollProgress,
  screenEvolutionProgress = null,
  liveConfig,
  videoElement = null,
  showIntroLabel = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const progressRef = useRef(scrollProgress?.get() ?? 0);
  const evolutionProgressRef = useRef(0);
  const fallbackEvolutionProgress = useMotionValue(0);
  const videoRef = useRef(videoElement);
  const tryAttachVideoRef = useRef(() => {});
  const latestConfigRef = useRef(resolveConfig(liveConfig));
  const scrollProgressRef = useRef(scrollProgress);
  const screenEvolutionProgressRef = useRef(screenEvolutionProgress);
  const isDevPlaygroundRef = useRef(liveConfig != null);
  const [status, setStatus] = useState("Loading model…");

  latestConfigRef.current = resolveConfig(liveConfig);
  scrollProgressRef.current = scrollProgress;
  screenEvolutionProgressRef.current = screenEvolutionProgress;
  isDevPlaygroundRef.current = liveConfig != null;
  videoRef.current = videoElement;

  useMotionValueEvent(scrollProgress, "change", (value) => {
    progressRef.current = value;
  });

  const evolutionSource = screenEvolutionProgress ?? fallbackEvolutionProgress;

  useMotionValueEvent(evolutionSource, "change", (value) => {
    if (screenEvolutionProgress) {
      evolutionProgressRef.current = value;
    }
  });

  useEffect(() => {
    progressRef.current = scrollProgress.get();
    if (screenEvolutionProgress) {
      evolutionProgressRef.current = screenEvolutionProgress.get();
    } else {
      evolutionProgressRef.current = 0;
    }
  }, [scrollProgress, screenEvolutionProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let disposed = false;
    let animationFrame = 0;
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
    /** Pre-center bounding-box center — kept for camera lookAt math (user-tuned ratios). */
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
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "hero-canvas__container";
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 3, 4);
    const rim = new THREE.DirectionalLight(0xc8d8e4, 0.45);
    rim.position.set(-2, 1, -3);
    scene.add(ambient, key, rim);

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
          0,
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

      // Offsets in the monitor plane's local X/Y/Z (flat on screen at progress 0).
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
      introLabelMesh.visible = showIntroLabel && evolutionProgressRef.current < 0.04;
    }

    function applyLiveConfig(config) {
      if (!modelRoot) {
        return;
      }

      const progress = progressRef.current;

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
        screenPlane.material.map = videoTexture;
        screenPlane.material.color.set(0xffffff);
        screenPlane.material.opacity = 1;
        screenPlane.material.transparent = true;
        screenPlane.material.depthWrite = false;
        screenPlane.material.depthTest = false;
        screenPlane.material.toneMapped = false;
        screenPlane.material.needsUpdate = true;
      }

      console.log("[HeroCanvas] Video texture attached to screen plane", {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
      return true;
    }

    function tryAttachVideo() {
      const video = videoRef.current;
      if (!video || !screenPlaneAttached) {
        return;
      }

      if (attachVideoTexture(video)) {
        videoAttached = true;
      }
    }

    tryAttachVideoRef.current = tryAttachVideo;

    function setupEvolutionScreenPlane() {
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
        new THREE.MeshBasicMaterial({
          map: evolutionTexture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: false,
          toneMapped: false,
        }),
      );
      evolutionScreenPlane.renderOrder = 12;
      scene.add(evolutionScreenPlane);
    }

    function updateScreenContent() {
      const evolution = evolutionProgressRef.current;
      const crossfade = Math.min(1, Math.max(0, evolution / 0.14));

      if (evolutionScreenPlane?.material) {
        if (evolutionCtx && evolutionTexture) {
          drawDeskScreen(evolutionCtx, evolution);
          evolutionTexture.needsUpdate = true;
        }
        evolutionScreenPlane.material.opacity = crossfade;
      }

      if (screenPlane?.material) {
        screenPlane.material.opacity = 1 - crossfade;
        screenPlane.renderOrder = 10;
      }
    }

    function setupScreenPlane(config) {
      if (!screenMesh || !screenMaterial) {
        return;
      }

      // Floating video plane only — never texture the whole model material.
      screenMaterial.visible = true;

      screenPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          color: 0x040404,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        }),
      );

      scene.add(screenPlane);
      setupEvolutionScreenPlane();
      updateScreenPlaneTransform(config, 0);
      screenPlaneAttached = true;
      console.log("[HeroCanvas] Floating screen plane ready — tune via Screen controls in /dev/hero-canvas");
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
      introLabelMesh.visible = showIntroLabel;
      introLabelMesh.renderOrder = 11;
      scene.add(introLabelMesh);
    }

    function resize() {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const loader = new GLTFLoader();
    loader.load(
      MODEL_PATH,
      (gltf) => {
        if (disposed) {
          return;
        }

        modelRoot = gltf.scene;
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

        setupScreenPlane(latestConfigRef.current);
        setupIntroLabel(latestConfigRef.current);

        progressRef.current = scrollProgress.get();
        applyLiveConfig(latestConfigRef.current);
        lockMonitorFaceToMesh(
          screenMesh,
          camera,
          monitorBox.setFromObject(screenMesh),
          monitorFrame,
          monitorFaceLock,
          meshWorldQuat,
          meshWorldQuatInv,
        );

        modelLoaded = true;
        tryAttachVideo();
        setStatus("");
      },
      undefined,
      () => {
        if (!disposed) {
          setStatus(
            `Model not found: ${MODEL_PATH}. Add retro_electronics_retro_pc.glb to /public.`,
          );
        }
      },
    );

    const tick = () => {
      animationFrame = requestAnimationFrame(tick);

      progressRef.current = scrollProgressRef.current.get();

      if (screenEvolutionProgressRef.current) {
        evolutionProgressRef.current = screenEvolutionProgressRef.current.get();
      }

      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }

      if (!videoAttached && modelLoaded && videoRef.current) {
        tryAttachVideo();
      }

      if (isDevPlaygroundRef.current || modelRoot) {
        applyLiveConfig(latestConfigRef.current);
        updateScreenContent();
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      tryAttachVideoRef.current = () => {};
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
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
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [showIntroLabel]);

  useEffect(() => {
    const video = videoElement;
    if (!video) {
      return undefined;
    }

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const onReady = () => {
      tryAttachVideoRef.current();
      void video.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    if (video.readyState >= 2) {
      onReady();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [videoElement]);

  return (
    <div className={`hero-canvas ${className}`.trim()} ref={containerRef}>
      {status ? (
        <div className="hero-canvas__overlay hero-canvas__overlay--error">{status}</div>
      ) : null}
    </div>
  );
}
