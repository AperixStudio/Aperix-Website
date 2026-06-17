import * as THREE from "three";

const ROUNDED_SCREEN_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ROUNDED_SCREEN_FRAGMENT_SHADER = `
  uniform sampler2D map;
  uniform float uAspect;
  uniform float uCornerRadius;
  uniform vec3 uGuideColor;
  uniform float uGuideMode;
  uniform float uOpacity;
  varying vec2 vUv;

  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 p = vec2(vUv.x - 0.5, (vUv.y - 0.5) * uAspect);
    vec2 halfSize = vec2(0.5, 0.5 * uAspect);
    float dist = sdRoundedBox(p, halfSize, uCornerRadius);
    float alpha = (1.0 - smoothstep(0.0, 0.003, dist)) * uOpacity;
    if (alpha < 0.004) {
      discard;
    }

    vec3 color = uGuideMode > 0.5 ? uGuideColor : texture2D(map, vUv).rgb;
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * @param {object} [options]
 * @param {THREE.Texture | null} [options.map]
 * @param {number} [options.cornerRadius] Fraction of screen width (0.04 ≈ subtle CRT rounding).
 * @param {number} [options.opacity]
 * @param {number} [options.guideColor]
 * @param {boolean} [options.depthTest]
 * @param {number} [options.polygonOffsetFactor]
 */
export function createRoundedScreenMaterial({
  map = null,
  cornerRadius = 0.04,
  opacity = 1,
  guideColor = 0xffffff,
  depthTest = false,
  polygonOffsetFactor = -1,
} = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      uAspect: { value: 1 },
      uCornerRadius: { value: cornerRadius },
      uGuideColor: { value: new THREE.Color(guideColor) },
      uGuideMode: { value: 0 },
      uOpacity: { value: opacity },
    },
    vertexShader: ROUNDED_SCREEN_VERTEX_SHADER,
    fragmentShader: ROUNDED_SCREEN_FRAGMENT_SHADER,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor,
    polygonOffsetUnits: 1,
  });
}

/** @param {THREE.ShaderMaterial | null | undefined} material */
export function isRoundedScreenMaterial(material) {
  return Boolean(material?.uniforms?.uCornerRadius);
}

/**
 * @param {THREE.ShaderMaterial} material
 * @param {object} values
 * @param {number} [values.aspect] height / width
 * @param {number} [values.cornerRadius]
 * @param {number} [values.opacity]
 * @param {THREE.Texture | null} [values.map]
 * @param {boolean} [values.guideMode]
 */
export function applyRoundedScreenUniforms(material, values) {
  if (!isRoundedScreenMaterial(material)) {
    return;
  }

  const { uniforms } = material;

  if (values.aspect !== undefined) {
    uniforms.uAspect.value = values.aspect;
  }
  if (values.cornerRadius !== undefined) {
    uniforms.uCornerRadius.value = values.cornerRadius;
  }
  if (values.opacity !== undefined) {
    uniforms.uOpacity.value = values.opacity;
  }
  if (values.map !== undefined) {
    uniforms.map.value = values.map;
  }
  if (values.guideMode !== undefined) {
    uniforms.uGuideMode.value = values.guideMode ? 1 : 0;
  }
}

/** @param {THREE.Mesh} mesh @param {number} cornerRadius */
export function applyRoundedScreenAspect(mesh, cornerRadius) {
  if (!mesh) {
    return;
  }

  applyRoundedScreenUniforms(mesh.material, {
    aspect: mesh.scale.y / Math.max(mesh.scale.x, 0.0001),
    cornerRadius,
  });
}
