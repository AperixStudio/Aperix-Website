/**
 * Restore retro PC model (with appear) as the hero Unicorn scene device.
 * Run: node scripts/restore-hero-retro-pc.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const jsonPath = path.join(root, "public/unicorn/hero-act1-2.json");
const layerPath = path.join(root, "scripts/_retro_pc_layer.json");

const scene = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const retroPc = JSON.parse(fs.readFileSync(layerPath, "utf8"));

const modelIndexes = scene.history
  .map((layer, index) => (layer.isModel ? index : -1))
  .filter((index) => index >= 0);

if (modelIndexes.length === 0) {
  scene.history.push(retroPc);
} else {
  scene.history.splice(modelIndexes[0], modelIndexes.length, retroPc);
}

fs.writeFileSync(jsonPath, JSON.stringify(scene, null, 2));
console.log("Restored retro PC in", jsonPath);
