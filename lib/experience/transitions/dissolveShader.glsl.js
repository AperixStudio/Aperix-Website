/** Fullscreen dissolve composite — blends two scene RTs without fading to white. */

export const dissolveVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const dissolveFragmentShader = /* glsl */ `
  uniform sampler2D tSceneFrom;
  uniform sampler2D tSceneTo;
  uniform float uMix;
  uniform float uEdgeSoftness;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec4 fromColor = texture2D(tSceneFrom, vUv);
    vec4 toColor = texture2D(tSceneTo, vUv);
    float n = noise(vUv * vec2(140.0, 90.0));
    float edge = uEdgeSoftness;
    float mask = smoothstep(uMix - edge, uMix + edge, n);
    gl_FragColor = mix(toColor, fromColor, mask);
  }
`;
