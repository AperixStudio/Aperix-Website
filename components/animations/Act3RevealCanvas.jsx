"use client";

/**
 * Act3RevealCanvas — scroll-driven iPhone + monitor reveal scene.
 * Transparent renderer so SiteAtmosphere shows through (same as HeroCanvas).
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEFAULT_ACT3_REVEAL_CONFIG } from "@/lib/act3RevealConfig";
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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import("framer-motion").MotionValue<number>} [props.scrollProgress]
 * @param {typeof DEFAULT_ACT3_REVEAL_CONFIG} [props.liveConfig]
 */
export default function Act3RevealCanvas({
  className = "",
  scrollProgress = null,
  liveConfig = null,
}) {
  const containerRef = useRef(null);
  const latestConfigRef = useRef(DEFAULT_ACT3_REVEAL_CONFIG);
  latestConfigRef.current = resolveConfig(liveConfig);

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
    let pendingLoads = 2;
    let disposed = false;

    function finishLoad() {
      pendingLoads -= 1;
      if (pendingLoads <= 0 && !disposed) {
        applyConfig();
        setLoading(false);
      }
    }

    function applyConfig() {
      const config = latestConfigRef.current;
      const scrollProgressValue = Math.min(1, Math.max(0, progressRef.current));
      const cameraProgress = mapCameraProgress(scrollProgressValue);

      scene.children.forEach((child) => {
        if (child.isAmbientLight) {
          child.intensity = config.ambientIntensity;
        }
      });
      keyLight.intensity = config.keyLightIntensity;
      fillLight.intensity = config.fillLightIntensity;

      if (iphoneRoot) {
        applyModelPose(iphoneRoot, config, "iphone", scrollProgressValue, "iphoneScale");
      }
      if (monitorRoot) {
        applyModelPose(monitorRoot, config, "monitor", scrollProgressValue, "monitorScale");
      }

      camera.position.set(
        lerp(config.cameraStartX, config.cameraEndX, cameraProgress),
        lerp(config.cameraStartY, config.cameraEndY, cameraProgress),
        lerp(config.cameraStartZ, config.cameraEndZ, cameraProgress),
      );
      lookAt.set(
        lerp(config.lookAtStartX, config.lookAtEndX, cameraProgress),
        lerp(config.lookAtStartY, config.lookAtEndY, cameraProgress),
        lerp(config.lookAtStartZ, config.lookAtEndZ, cameraProgress),
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
