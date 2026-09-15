/**
 * arrowhead-logo-3d.js
 * ---------------------------------------------------------------------------
 * An animated 3D version of the Arrowhead mark, as a framework-agnostic ES
 * module. Mounts a WebGL canvas into any container element and runs a
 * three-act sequence:
 *
 *   1. REVEAL  the three limbs fly in from scattered positions and assemble,
 *              rendered as translucent glass
 *   2. TRACK   the material morphs to polished chrome; the mark tilts to
 *              follow the pointer
 *   3. ORBIT   the material settles into glossy brand blue and the mark spins
 *              continuously, still picking up pointer tilt
 *
 * Peer dependency: three (>= 0.128; tested on 0.128 and 0.185).
 *
 * Usage:
 *   import { createArrowheadLogo } from './arrowhead-logo-3d';
 *   const logo = createArrowheadLogo(document.querySelector('#logo'));
 *   // later: logo.replay(); logo.seek(9); logo.setTheme('dark'); logo.destroy();
 *
 * The geometry below is traced directly from the source artwork, normalised so
 * the mark's bounding box is 1 unit across and centred on the origin, Y up.
 *
 * NOTE: this file is the vendored deliverable from HANDOFF.md, unmodified —
 * animation timings, easing, material tuning and traced geometry are signed
 * off and must not change here. Integration lives in ArrowheadLogo3D.tsx.
 * ---------------------------------------------------------------------------
 */

import * as THREE from 'three';

/* -- traced geometry: the three separate limbs of the mark -------------- */
export const LIMBS = [
  { name: 'crest', pts: [[0.1941, 0.1356], [-0.0191, 0.3626], [-0.3199, 0.0485], [-0.1697, 0.0732], [-0.0636, 0.2533], [0.0305, 0.1592], [-0.0864, 0.0873]] },
  { name: 'tail',  pts: [[-0.1539, 0.0217], [0.2166, -0.0797], [0.5000, -0.3626], [0.2730, -0.0095]] },
  { name: 'wing',  pts: [[-0.5000, 0.0456], [-0.3153, -0.1915], [-0.1965, 0.0193], [-0.2065, 0.0263], [-0.3381, 0.0306], [-0.3628, 0.0014], [-0.3761, -0.0030]] }
];

/* -- where each limb flies in from during the reveal -------------------- */
const ENTRY = [
  { off: [0.15, 1.90, 0.85],   rot: [1.05, 0.45, 0.95],   delay: 0.30 },  // crest, from above
  { off: [2.00, -0.60, -1.35], rot: [-0.48, 1.35, -0.70], delay: 0.14 },  // tail, from the right
  { off: [-1.85, 0.30, 1.15],  rot: [0.55, -1.15, 0.62],  delay: 0.00 }   // wing, from the left
];

export const BRAND_HEX = '#00A2E8';

const DEFAULTS = {
  /** 'auto' follows the document's data-theme / prefers-color-scheme. */
  theme: 'auto',
  /** Seconds. When the sequence enters each act. */
  trackAt: 3.4,
  orbitAt: 9.0,
  /** Seconds each limb takes to fly in. */
  buildDuration: 1.9,
  /** Extrusion depth, in the same units as the geometry (mark is 1 wide). */
  depth: 0.15,
  /** Radians per second once orbiting. */
  spinSpeed: 0.62,
  /** 0 disables pointer tilt. 1 is the tuned default. */
  tilt: 1,
  /** Start the sequence immediately on mount. */
  autoplay: true,
  /** Restart the whole sequence every N seconds while orbiting. 0 = never. */
  loopAfter: 0,
  /** Camera distance. Larger = smaller mark. */
  distance: 3.05,
  /** Pause rendering while the container is scrolled out of view. */
  pauseOffscreen: true,
  /** Called with 'reveal' | 'track' | 'orbit' whenever the act changes. */
  onPhase: null
};

/* -- easing ------------------------------------------------------------- */
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const outQuint = t => 1 - Math.pow(1 - t, 5);
const outCubic = t => 1 - Math.pow(1 - t, 3);
const inOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function polygonCentroid(p) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;
    const f = p[i][0] * p[j][1] - p[j][0] * p[i][1];
    a += f; cx += (p[i][0] + p[j][0]) * f; cy += (p[i][1] + p[j][1]) * f;
  }
  a *= 0.5;
  return [cx / (6 * a), cy / (6 * a)];
}

/*
 * three r152+ turned on colour management, so `new Color(0x00a2e8)` is read as
 * sRGB and converted into the linear working space — which renders these
 * hand-tuned material colours noticeably darker than they were authored. Every
 * colour below is authored in linear space, so feed them in as linear on new
 * three and unchanged on old three. This is what keeps the look identical
 * across versions.
 */
const LINEAR = THREE.LinearSRGBColorSpace;
/*
 * Colour-managed three (r152+) also reworked ACES tone mapping, which lands
 * dimmer than the original tuning. CM_* nudge exposure, environment weight and
 * the brand hue back onto the approved look. On old three they are all 1:1.
 */
const CM = LINEAR !== undefined;
const CM_EXPOSURE = CM ? 1.42 : 1;
const CM_ENV = CM ? 1.55 : 1;
function linearHex(color, hex) {
  if (LINEAR !== undefined) color.setHex(hex, LINEAR);
  else color.setHex(hex);
  return color;
}
function linearColor(hex) { return linearHex(new THREE.Color(), hex); }

/*
 * Bridges the three.js colour-management rename (r152). `sRGBEncoding` was
 * removed from three's exports entirely in later releases (it's absent from
 * 0.184, which this project ships) — bracket-accessed so bundlers that
 * statically validate `THREE.<name>` against the module's export list (e.g.
 * Turbopack) don't fail the build over a branch that only runs on old three.
 */
function setSRGB(renderer, texture) {
  const legacySRGB = THREE['sRGBEncoding'];
  if (renderer) {
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if ('outputEncoding' in renderer) renderer.outputEncoding = legacySRGB;
  }
  if (texture) {
    if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace;
    else if ('encoding' in texture) texture.encoding = legacySRGB;
  }
}

/**
 * @param {HTMLElement} container
 * @param {Partial<typeof DEFAULTS>} [options]
 * @returns {{replay:Function, seek:Function, play:Function, pause:Function,
 *            setTheme:Function, phase:Function, time:Function, destroy:Function}}
 */
export function createArrowheadLogo(container, options = {}) {
  if (!container) throw new Error('createArrowheadLogo: container element is required');
  const opt = Object.assign({}, DEFAULTS, options);

  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  let reduce = reduceMQ.matches;

  /* ---- canvas ---- */
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    display: 'block', touchAction: 'none'
  });
  canvas.setAttribute('aria-label', 'Animated three-dimensional Arrowhead logo');
  container.appendChild(canvas);

  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const maxDpr = isCoarse ? 1 : 2;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isCoarse,
      alpha: true,
      powerPreference: isCoarse ? "low-power" : "high-performance",
    });
  } catch (err) {
    canvas.remove();
    throw new Error("createArrowheadLogo: WebGL is unavailable in this browser");
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  setSRGB(renderer, null);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.05, opt.distance);

  const group = new THREE.Group();
  scene.add(group);

  /* ---- one material, morphed across the three acts ---- */
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe6fa, metalness: 0, roughness: 0.04,
    clearcoat: 1, clearcoatRoughness: 0.03,
    transparent: true, opacity: 0.5, side: THREE.DoubleSide
  });
  const HAS_TRANSMISSION = 'transmission' in mat;

  const LOOKS = {
    glass:  { c: linearColor(0xbfe6fa), metal: 0.00, rough: 0.04, op: 0.52, cc: 1.00, ccr: 0.03, env: 3.00, tr: 0.9 },
    chrome: { c: linearColor(0x9dc6e6), metal: 1.00, rough: 0.11, op: 1.00, cc: 0.45, ccr: 0.10, env: 2.00, tr: 0.0 },
    gloss:  { c: linearColor(0x0079c4), metal: 0.12, rough: 0.30, op: 1.00, cc: 1.00, ccr: 0.07, env: 0.62, tr: 0.0 }
  };
  let envScale = 1;
  function tuneLooks(dark) {
    linearHex(LOOKS.glass.c, dark ? 0xbfe6fa : 0x6fb2d6);
    LOOKS.glass.op = dark ? 0.52 : 0.66;
    linearHex(LOOKS.chrome.c, dark ? 0x9dc6e6 : 0x6f9dbe);
    linearHex(LOOKS.gloss.c, CM ? (dark ? 0x2eb2e8 : 0x1f9fd6) : (dark ? 0x0079c4 : 0x0070b4));
    envScale = (dark ? 1 : 0.42) * CM_ENV;
  }

  /* ---- meshes ---- */
  const meshes = LIMBS.map((limb, i) => {
    const shape = new THREE.Shape();
    shape.moveTo(limb.pts[0][0], limb.pts[0][1]);
    for (let k = 1; k < limb.pts.length; k++) shape.lineTo(limb.pts[k][0], limb.pts[k][1]);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, { depth: opt.depth, bevelEnabled: false, curveSegments: 1, steps: 1 });
    const [cx, cy] = polygonCentroid(limb.pts);
    geo.translate(-cx, -cy, -opt.depth / 2);
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = limb.name;
    mesh.userData.rest = new THREE.Vector3(cx, cy, 0);
    mesh.userData.entry = ENTRY[i];
    group.add(mesh);
    return mesh;
  });

  /* ---- studio environment, painted on a canvas so it can follow the theme ---- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  let envRT = null;

  function buildEnv(dark) {
    const c = document.createElement('canvas');
    c.width = isCoarse ? 256 : 1024;
    c.height = isCoarse ? 128 : 512;
    const g = c.getContext('2d');
    g.save();
    g.scale(c.width / 1024, c.height / 512);
    const sky = g.createLinearGradient(0, 0, 0, 512);
    if (dark) {
      sky.addColorStop(0, '#243444'); sky.addColorStop(0.48, '#0d151e');
      sky.addColorStop(0.52, '#05080c'); sky.addColorStop(1, '#010306');
    } else {
      sky.addColorStop(0, '#f2f6fa'); sky.addColorStop(0.46, '#b6c6d5');
      sky.addColorStop(0.54, '#6d8095'); sky.addColorStop(1, '#2c3a48');
    }
    g.fillStyle = sky; g.fillRect(0, 0, 1024, 512);

    const box = (x, y, rx, ry, col, a) => {
      const rg = g.createRadialGradient(x, y, 0, x, y, rx);
      rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.save();
      g.globalAlpha = a; g.globalCompositeOperation = 'lighter';
      g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, rx, 0, Math.PI * 2); g.fill();
      g.restore();
    };
    box(300, 120, 300, 190, '#ffffff', dark ? 0.95 : 0.55);                 // key softbox
    box(790, 200, 250, 250, '#4fc3f7', dark ? 0.75 : 0.40);                 // blue rim
    box(560, 430, 320, 140, dark ? '#1b2a3a' : '#8fa3b6', 0.5);             // floor bounce
    box(60, 300, 180, 200, dark ? '#0d2233' : '#7d93a8', 0.45);             // fill
    g.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    if (envRT) envRT.dispose();
    if (isCoarse) {
      scene.environment = tex;
      envRT = null;
    } else {
      envRT = pmrem.fromEquirectangular(tex);
      scene.environment = envRT.texture;
      tex.dispose();
    }
  }

  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(-2.2, 2.6, 3.2); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 2.2);  rim.position.set(2.6, -0.8, -2.4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35); fill.position.set(2.0, 0.4, 2.0); scene.add(fill);
  const amb = new THREE.AmbientLight(0xffffff, 0.18); scene.add(amb);
  linearHex(rim.color, 0x0f7cbb);
  linearHex(fill.color, 0xdfefff);

  function resolveDark() {
    if (opt.theme === 'dark') return true;
    if (opt.theme === 'light') return false;
    const stamped = document.documentElement.getAttribute('data-theme');
    if (stamped === 'dark') return true;
    if (stamped === 'light') return false;
    return darkMQ.matches;
  }
  function applyTheme() {
    const dark = resolveDark();
    buildEnv(dark);
    tuneLooks(dark);
    renderer.toneMappingExposure = (dark ? 1.02 : 0.92) * CM_EXPOSURE;
    key.intensity = 0.95;
    amb.intensity = dark ? 0.14 : 0.10;
    rim.intensity = dark ? 1.55 : 1.15;
  }
  applyTheme();

  /* ---- pointer, measured against the container ---- */
  let px = 0, py = 0, tx = 0, ty = 0;
  function onPointerMove(e) {
    const r = container.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ty = ((e.clientY - r.top) / r.height) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* ---- sizing ---- */
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    // Cap the drawing buffer so a huge CSS box (or high DPR) cannot
    // overflow the GPU and paint the mark into a corner of the canvas.
    const pr = renderer.getPixelRatio();
    const maxDim = Math.min(
      renderer.capabilities.maxTextureSize || 8192,
      isCoarse ? 1024 : 4096,
    );
    const cap = maxDim / pr;
    const k = Math.min(1, cap / Math.max(w, h));
    renderer.setSize(Math.max(1, Math.floor(w * k)), Math.max(1, Math.floor(h * k)), false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.9 ? 40 : 30;
    camera.updateProjectionMatrix();
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', resize);
  resize();

  /* ---- visibility ---- */
  let onScreen = true;
  const io = (opt.pauseOffscreen && typeof IntersectionObserver !== 'undefined')
    ? new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; }, { threshold: 0 })
    : null;
  if (io) io.observe(container);
  let tabVisible = document.visibilityState !== 'hidden';
  const onVisibility = () => { tabVisible = document.visibilityState !== 'hidden'; };
  document.addEventListener('visibilitychange', onVisibility);

  /* ---- timeline ---- */
  const now = () => performance.now() / 1000;
  let t0 = now();
  let elapsed = 0, spin = 0, running = opt.autoplay, pausedAt = 0, lastPhase = -1;
  let prev = now(), raf = 0, disposed = false;

  function seek(t) {
    t0 = now() - t;
    if (t < opt.orbitAt) spin = 0;
    elapsed = t;
  }
  if (!opt.autoplay) { pausedAt = 0; }

  const tmpC = new THREE.Color();
  function mixLook(a, b, k) {
    tmpC.copy(a.c).lerp(b.c, k);
    mat.color.copy(tmpC);
    mat.metalness = a.metal + (b.metal - a.metal) * k;
    mat.roughness = a.rough + (b.rough - a.rough) * k;
    mat.opacity = a.op + (b.op - a.op) * k;
    mat.clearcoat = a.cc + (b.cc - a.cc) * k;
    mat.clearcoatRoughness = a.ccr + (b.ccr - a.ccr) * k;
    mat.envMapIntensity = (a.env + (b.env - a.env) * k) * envScale;
    if (HAS_TRANSMISSION) mat.transmission = a.tr + (b.tr - a.tr) * k;
    mat.depthWrite = mat.opacity > 0.92;
  }

  function reportPhase(i) {
    if (i === lastPhase) return;
    lastPhase = i;
    if (typeof opt.onPhase === 'function') opt.onPhase(['reveal', 'track', 'orbit'][i], i);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (disposed) return;

    const t = now();
    const dt = Math.min(t - prev, 0.05);
    prev = t;

    if (!onScreen || !tabVisible) return;      // skip work while hidden
    const pageLogo = container.closest && container.closest('#site-logo-fixed');
    if (pageLogo && pageLogo.style.opacity === '0') return;
    if (running) elapsed = t - t0;
    if (reduce) elapsed = opt.orbitAt + 2;

    if (opt.loopAfter && running && elapsed > opt.orbitAt + opt.loopAfter) seek(0);

    /* limbs assemble */
    for (const m of meshes) {
      const e = m.userData.entry;
      const p = clamp01((elapsed - e.delay) / opt.buildDuration);
      const q = outQuint(p);
      const z = outCubic(clamp01((elapsed - e.delay) / (opt.buildDuration * 0.75)));
      const inv = 1 - q;
      m.position.set(
        m.userData.rest.x + e.off[0] * inv,
        m.userData.rest.y + e.off[1] * inv,
        m.userData.rest.z + e.off[2] * inv
      );
      m.rotation.set(e.rot[0] * inv, e.rot[1] * inv, e.rot[2] * inv);
      const s = 0.62 + 0.38 * q;
      m.scale.set(s, s, (0.06 + 0.94 * z) * s);
    }

    /* acts */
    const phase = elapsed < opt.trackAt ? 0 : elapsed < opt.orbitAt ? 1 : 2;
    reportPhase(phase);

    const k1 = clamp01((elapsed - (opt.trackAt - 0.5)) / 1.6);
    const k2 = clamp01((elapsed - (opt.orbitAt - 0.6)) / 1.7);
    if (k2 > 0) mixLook(LOOKS.chrome, LOOKS.gloss, inOut(k2));
    else mixLook(LOOKS.glass, LOOKS.chrome, inOut(k1));

    /* orientation: entry swing, then pointer tilt, then orbit */
    const swing = 1 - inOut(clamp01(elapsed / (opt.buildDuration + 0.5)));
    px += (tx - px) * Math.min(1, dt * 3.4);
    py += (ty - py) * Math.min(1, dt * 3.4);
    const gain = opt.tilt * (reduce ? 0.5 : 0.22 + 0.78 * clamp01((elapsed - opt.trackAt + 0.6) / 1.2));
    const breathe = Math.sin(elapsed * 0.85) * 0.045;

    if (!reduce && running && elapsed > opt.orbitAt) {
      spin += dt * opt.spinSpeed * clamp01((elapsed - opt.orbitAt) / 1.4);
    }

    group.rotation.y = -0.95 * swing + spin + px * 0.62 * gain;
    group.rotation.x = 0.38 * swing + (-py * 0.34 * gain) + breathe;
    group.rotation.z = -0.18 * swing + px * 0.05 * gain;
    group.position.y = Math.sin(elapsed * 0.7) * 0.018;

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  /* ---- react to theme / motion preference changes ---- */
  const listen = (mq, fn) => {
    if (mq.addEventListener) { mq.addEventListener('change', fn); return () => mq.removeEventListener('change', fn); }
    mq.addListener(fn); return () => mq.removeListener(fn);
  };
  const unlistenDark = listen(darkMQ, applyTheme);
  const unlistenReduce = listen(reduceMQ, () => { reduce = reduceMQ.matches; });
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---- public API ---- */
  return {
    replay() { seek(0); running = true; },
    seek(t) { seek(t); },
    play() { if (!running) { t0 = now() - pausedAt; running = true; } },
    pause() { if (running) { pausedAt = elapsed; running = false; } },
    setTheme(theme) { opt.theme = theme; applyTheme(); },
    phase() { return ['reveal', 'track', 'orbit'][lastPhase] || 'reveal'; },
    time() { return elapsed; },
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      mo.disconnect();
      unlistenDark(); unlistenReduce();
      meshes.forEach(m => m.geometry.dispose());
      mat.dispose();
      if (envRT) envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    }
  };
}

export default createArrowheadLogo;
