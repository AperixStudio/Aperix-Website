/**
 * Original ray-marched "liquid orb" shader for the hero AI-receptionist
 * teaser — a noise-displaced sphere SDF, studio three-point lighting, and a
 * fresnel-driven metallic response. Written from scratch for this feature:
 * a value-noise field (not simplex) drives the surface displacement, and
 * the lighting/tint model is its own thing, tuned around the two speaker
 * colors the React side feeds in via u_tint / u_tintMix.
 */

export const ORB_VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const ORB_FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_tint;
uniform float u_tintMix;
uniform float u_energy;

#define STEPS 64
#define MAX_DIST 12.0
#define SURF_EPS 0.0016

// Cheap hash-based value noise (own implementation, not a ported simplex
// noise) — good enough for a soft organic surface wobble at orb scale.
vec3 hash3(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
          dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
      mix(dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
          dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x),
      u.y),
    mix(
      mix(dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
          dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
      mix(dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
          dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x),
      u.y),
    u.z
  );
}

// Signed distance to the orb: a unit sphere displaced by two noise octaves.
// u_energy (a short pulse fired per spoken line on the React side) briefly
// livens up the high-frequency octave so the orb visibly reacts.
float sdOrb(vec3 p, float t) {
  float base = length(p) - 1.0;
  float slow = valueNoise(p * 1.5 + t * 0.14) * 0.15;
  float fast = valueNoise(p * 3.1 - t * 0.22) * 0.05 * (0.4 + u_energy * 1.1);
  return base + slow + fast;
}

vec3 orbNormal(vec3 p, float t) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    sdOrb(p + e.xyy, t) - sdOrb(p - e.xyy, t),
    sdOrb(p + e.yxy, t) - sdOrb(p - e.yxy, t),
    sdOrb(p + e.yyx, t) - sdOrb(p - e.yyx, t)
  ));
}

// Three-point studio rig sampled by reflection direction, same trick a real
// product-shot HDRI stand-in uses: a few directional "softboxes" instead of
// an environment texture.
vec3 studioLight(vec3 rd) {
  vec3 col = vec3(0.018);

  vec3 key = normalize(vec3(0.55, 0.85, 0.9));
  col += vec3(0.92, 0.94, 0.99) * pow(max(dot(rd, key), 0.0), 11.0) * 1.4;

  vec3 rim = normalize(vec3(-0.75, -0.35, -0.75));
  col += vec3(0.34, 0.4, 0.48) * pow(max(dot(rd, rim), 0.0), 5.0);

  vec3 fillL = normalize(vec3(-0.9, 0.35, 0.4));
  col += vec3(0.16, 0.18, 0.22) * pow(max(dot(rd, fillL), 0.0), 2.4);

  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time;
  vec2 drift = u_mouse * 0.22;

  vec3 ro = vec3(0.0, 0.0, 4.1);
  vec3 lookAt = vec3(drift.x, drift.y, 0.0);
  vec3 fwd = normalize(lookAt - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 rd = normalize(fwd + uv.x * right + uv.y * up);

  float d = 0.0;
  bool hit = false;
  for (int i = 0; i < STEPS; i++) {
    vec3 p = ro + rd * d;
    float ds = sdOrb(p, t);
    if (ds < SURF_EPS) { hit = true; break; }
    d += ds;
    if (d > MAX_DIST) break;
  }

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  if (hit) {
    vec3 p = ro + rd * d;
    vec3 n = orbNormal(p, t);
    vec3 ref = reflect(rd, n);

    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.4);
    vec3 base = studioLight(ref) * mix(0.62, 1.35, fresnel);

    // Silver at rest; the requested speaker colour rides in on u_tintMix
    // rather than replacing the metal look outright.
    vec3 tinted = mix(base, base * u_tint * 1.7, u_tintMix);

    float spec = pow(max(dot(ref, normalize(vec3(0.5, 1.0, 0.75))), 0.0), 72.0);
    tinted += vec3(1.0) * spec * (1.05 + u_energy * 0.7);

    col = tinted;
    alpha = 1.0;
  }

  float glow = exp(-length(uv) * 2.3) * (0.05 + u_energy * 0.05);
  col += mix(vec3(0.03), u_tint, u_tintMix) * glow;
  alpha = max(alpha, glow * 0.4);

  col = col / (col + 0.6);
  col = pow(col, vec3(1.0 / 2.2));

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;
