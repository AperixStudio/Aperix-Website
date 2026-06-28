/**
 * Patch hero-act1-2.json: replace retro PC with Monitor + iPhone from Unicorn export.
 * Run: node scripts/patch-hero-unicorn-devices.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const jsonPath = path.join(root, "public/unicorn/hero-act1-2.json");
const scene = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const templateIdx = scene.history.findIndex(
  (layer) => layer.isModel && layer.modelUrl?.includes("retro_pc_comp"),
);
if (templateIdx === -1) {
  throw new Error("retro PC model layer not found");
}

const template = structuredClone(scene.history[templateIdx]);

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

function makeModelLayer({
  layerName,
  modelUrl,
  scale,
  pos,
  modelRotation,
  opacity,
  scrollStates,
}) {
  const layer = structuredClone(template);
  layer.id = randomUUID();
  layer.publicId = "model";
  layer.layerName = layerName;
  layer.locked = false;
  layer.states = { appear: [], scroll: scrollStates, hover: [], mousemove: [] };
  layer.modelUrl = modelUrl;
  layer.scale = scale;
  layer.pos = { type: "Vec3", ...pos };
  layer.modelRotation = { type: "Vec3", ...modelRotation };
  layer.opacity = opacity;
  layer.trackAxes = "xy";
  layer.data = {
    uniforms: {
      opacity: { name: "uOpacity", type: "1f", value: opacity },
    },
  };
  return layer;
}

const monitor = makeModelLayer({
  layerName: "Monitor",
  modelUrl:
    "https://assets.unicorn.studio/models/2Aut9osmKiM8joJ4vQuhvSoegQj2/monitor_crossover_v1.glb",
  scale: 0.35,
  opacity: 0,
  pos: { _x: 0.7431292001114229, _y: 0.5082281600205704, _z: 0 },
  modelRotation: { _x: 0.03333333333333333, _y: 0.5, _z: 0 },
  scrollStates: [
    scrollState("opacity", 1, {
      range: 0.25,
      offset: 0.55,
      uniformData: { type: "1f", name: "uOpacity" },
    }),
    scrollState("pos", { type: "Vec3", _x: 0.25, _y: 0.5, _z: 0 }, {
      range: 0.6,
      offset: 0.1,
    }),
    scrollState(
      "modelRotation",
      { type: "Vec3", _x: -0.041666666666666664, _y: 0.5, _z: 0 },
      { range: 0.6, offset: 0.1 },
    ),
  ],
});

const iphone = makeModelLayer({
  layerName: "Iphone",
  modelUrl:
    "https://assets.unicorn.studio/models/2Aut9osmKiM8joJ4vQuhvSoegQj2/iphone_16_-_free-compressed_v1.glb",
  scale: 0.25,
  opacity: 0,
  pos: { _x: 0.777700400694251, _y: 0.5178276800445692, _z: 0 },
  modelRotation: {
    _x: 0.44167106534837214,
    _y: 0.9979542782225737,
    _z: 0.4992668964759642,
  },
  scrollStates: [
    scrollState("opacity", 1, {
      range: 0.25,
      offset: -0.1,
      uniformData: { type: "1f", name: "uOpacity" },
    }),
  ],
});

scene.history.splice(templateIdx, 1, monitor, iphone);

fs.writeFileSync(jsonPath, JSON.stringify(scene, null, 2));
console.log("Patched", jsonPath);
console.log(
  "Models:",
  scene.history.filter((l) => l.isModel).map((l) => l.layerName),
);
