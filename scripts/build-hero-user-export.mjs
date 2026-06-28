/**
 * Build hero-act1-2.json from the user's Unicorn export (partial history + iPhone)
 * and the appear-on-load fix from the original retro-PC hero.
 *
 * Run: node scripts/build-hero-user-export.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const partialPath = path.join(root, "scripts/hero-export-partial-history.json");
const outPath = path.join(root, "public/unicorn/hero-act1-2.json");

const history = JSON.parse(fs.readFileSync(partialPath, "utf8"));
const monitor = history.find((layer) => layer.isModel && layer.layerName === "Monitor");
if (!monitor) {
  throw new Error("Monitor layer missing from partial export");
}

function appearOpacity({ delay = 0 } = {}) {
  return {
    local: { pendingChanges: {}, changeDebouncer: null, dragSession: null },
    type: "appear",
    id: randomUUID(),
    prop: "opacity",
    transition: { ease: "easeInOutSine", duration: 1000, delay },
    complete: false,
    progress: 0,
    value: 0,
    endValue: 1,
    responsiveProps: {},
    initialized: false,
    breakpoints: [],
    loop: "none",
    loopDelay: 0,
    uniformData: { type: "1f", name: "uOpacity" },
  };
}

function scrollState(prop, value, { range, offset, momentum = 0.25, uniformData } = {}) {
  return {
    local: { pendingChanges: {}, changeDebouncer: null, dragSession: null },
    type: "scroll",
    id: randomUUID(),
    prop,
    progress: 0,
    momentum,
    spring: 0,
    _velocity: 0,
    range,
    offset,
    mode: "scrollIntoView",
    delta: 0.01,
    sceneTop: 0,
    startScroll: 0,
    endScroll: 0,
    lastScrollTop: 0,
    absScrollValue: true,
    value,
    responsiveProps: {},
    breakpoints: [],
    ...(uniformData ? { uniformData } : {}),
  };
}

function cloneModelTemplate() {
  return structuredClone(monitor);
}

monitor.states.appear = [appearOpacity()];
monitor.opacity = 0;
monitor.data.uniforms.opacity.value = 0;

const iphone = cloneModelTemplate();
iphone.id = randomUUID();
iphone.publicId = "model";
iphone.layerName = "Iphone";
iphone.locked = false;
iphone.modelUrl =
  "https://assets.unicorn.studio/models/2Aut9osmKiM8joJ4vQuhvSoegQj2/iphone_16_-_free-compressed_v1.glb";
iphone.scale = 0.25;
iphone.pos = {
  type: "Vec3",
  _x: 0.777700400694251,
  _y: 0.5178276800445692,
  _z: 0,
};
iphone.modelRotation = {
  type: "Vec3",
  _x: 0.44167106534837214,
  _y: 0.9979542782225737,
  _z: 0.4992668964759642,
};
iphone.opacity = 0;
iphone.states = {
  appear: [appearOpacity({ delay: 150 })],
  scroll: [
    scrollState("opacity", 1, {
      range: 0.25,
      offset: -0.1,
      uniformData: { type: "1f", name: "uOpacity" },
    }),
  ],
  hover: [],
  mousemove: [],
};
iphone.data = {
  uniforms: {
    opacity: { name: "uOpacity", type: "1f", value: 0 },
  },
};

const scene = {
  history: [...history, iphone],
  options: {
    name: "Untitled project",
    fps: 60,
    dpi: 1.5,
    scale: 1,
    includeLogo: false,
    isProduction: false,
    flatten: false,
  },
  version: "2.2.5",
  id: "TJnkio6NrM3HG3FZyh2o",
  modules: {
    model_renderer: {
      type: "cdn-import",
      url: "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/extensions/model-renderer.js",
      version: "v2.2.5",
    },
  },
};

fs.writeFileSync(outPath, JSON.stringify(scene, null, 2));
console.log("Built", outPath);
console.log(
  "Layers:",
  scene.history.map((l) => l.layerName || l.publicId || l.type),
);
