"use client";

/**
 * Rocket.jsx — scroll-driven Three.js rocket scene.
 * scrollProgress (0 → 1) lerps model through start → middle → end poses in RocketConfig.
 * Tune lib/RocketConfig.js — or use Leva on /dev/rocket.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DEFAULT_ROCKET_CONFIG } from "@/lib/RocketConfig";
import "./Rocket.css";

function resolveConfig(liveConfig) {
  return liveConfig ?? DEFAULT_ROCKET_CONFIG;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function sampleThreePoint(t, start, middle, end) {
  const clamped = Math.min(1, Math.max(0, t));

  if (clamped <= 0.5) {
    const local = easeInOutCubic(clamped / 0.5);
    return THREE.MathUtils.lerp(start, middle, local);
  }

  const local = easeInOutCubic((clamped - 0.5) / 0.5);
  return THREE.MathUtils.lerp(middle, end, local);
}

function sampleThreePointVector(t, start, middle, end, target) {
  const clamped = Math.min(1, Math.max(0, t));

  if (clamped <= 0.5) {
    const local = easeInOutCubic(clamped / 0.5);
    return target.copy(start).lerp(middle, local);
  }

  const local = easeInOutCubic((clamped - 0.5) / 0.5);
  return target.copy(middle).lerp(end, local);
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import("framer-motion").MotionValue<number>} [props.scrollProgress]
 * @param {typeof DEFAULT_ROCKET_CONFIG} [props.liveConfig]
 */
export default function Rocket({ className = "", scrollProgress = null, liveConfig = null }) {
  const containerRef = useRef(null);
  const latestConfigRef = useRef(DEFAULT_ROCKET_CONFIG);
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

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const lookAt = new THREE.Vector3();
    const offsetStart = new THREE.Vector3();
    const offsetMiddle = new THREE.Vector3();
    const offsetEnd = new THREE.Vector3();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    let model = null;

    function applyConfig() {
      const config = latestConfigRef.current;
      const t = easeInOutCubic(Math.min(1, Math.max(0, progressRef.current)));

      camera.position.set(config.cameraX, config.cameraY, config.cameraZ);
      lookAt.set(config.lookAtX, config.lookAtY, config.lookAtZ);
      camera.lookAt(lookAt);

      if (!model) {
        return;
      }

      offsetStart.set(config.modelOffsetStartX, config.modelOffsetStartY, config.modelOffsetStartZ);
      offsetMiddle.set(config.modelOffsetMiddleX, config.modelOffsetMiddleY, config.modelOffsetMiddleZ);
      offsetEnd.set(config.modelOffsetEndX, config.modelOffsetEndY, config.modelOffsetEndZ);
      sampleThreePointVector(t, offsetStart, offsetMiddle, offsetEnd, model.position);

      model.rotation.set(
        sampleThreePoint(t, config.modelRotationStartX, config.modelRotationMiddleX, config.modelRotationEndX),
        sampleThreePoint(t, config.modelRotationStartY, config.modelRotationMiddleY, config.modelRotationEndY),
        sampleThreePoint(t, config.modelRotationStartZ, config.modelRotationMiddleZ, config.modelRotationEndZ),
      );
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
    loader.load(
      latestConfigRef.current.modelPath,
      (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        scene.add(model);
        applyConfig();
        resize();
        setLoading(false);
      },
      undefined,
      (loadError) => {
        console.error("[Rocket] Failed to load model:", loadError);
        setError("Failed to load model");
        setLoading(false);
      },
    );

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`rocket-scene ${className}`.trim()}>
      {(loading || error) && (
        <div className={`rocket-scene__overlay ${error ? "rocket-scene__overlay--error" : ""}`}>
          {error ?? "Loading model…"}
        </div>
      )}
      <div ref={containerRef} className="rocket-scene__container" />
    </div>
  );
}
