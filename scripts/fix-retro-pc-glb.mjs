/**
 * Repairs retro_pc_comp.glb when Draco export drops scenes + node children.
 * Run: node scripts/fix-retro-pc-glb.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const glbPath = join(root, "public/retro_pc_comp.glb");

function readGlbChunks(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "glTF") {
    throw new Error("Not a GLB file");
  }

  const chunks = [];
  let offset = 12;

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.toString("ascii", offset + 4, offset + 8);
    const chunkData = buffer.subarray(offset + 8, offset + 8 + chunkLength);
    chunks.push({ type: chunkType, data: chunkData });
    offset += 8 + chunkLength;
  }

  return chunks;
}

function writeGlb(jsonObject, binData) {
  let jsonText = JSON.stringify(jsonObject);
  let jsonBytes = Buffer.from(jsonText, "utf8");
  while (jsonBytes.length % 4 !== 0) {
    jsonBytes = Buffer.concat([jsonBytes, Buffer.from(" ")]);
  }

  const totalLength = 12 + 8 + jsonBytes.length + 8 + binData.length;
  const out = Buffer.alloc(totalLength);
  let offset = 0;

  out.write("glTF", offset);
  offset += 4;
  out.writeUInt32LE(2, offset);
  offset += 4;
  out.writeUInt32LE(totalLength, offset);
  offset += 4;

  out.writeUInt32LE(jsonBytes.length, offset);
  offset += 4;
  out.write("JSON", offset);
  offset += 4;
  jsonBytes.copy(out, offset);
  offset += jsonBytes.length;

  out.writeUInt32LE(binData.length, offset);
  offset += 4;
  out.write("BIN\u0000", offset);
  offset += 4;
  binData.copy(out, offset);

  return out;
}

const buffer = readFileSync(glbPath);
const chunks = readGlbChunks(buffer);
const jsonChunk = chunks.find((chunk) => chunk.type === "JSON");
const binChunk = chunks.find((chunk) => chunk.type.startsWith("BIN"));

if (!jsonChunk || !binChunk) {
  throw new Error("GLB missing JSON or BIN chunk");
}

const gltf = JSON.parse(jsonChunk.data.toString("utf8").trim());
const nodes = gltf.nodes ?? [];

if (!nodes.length) {
  throw new Error("GLB has no nodes");
}

if (!gltf.scenes?.length) {
  nodes[0] = { ...nodes[0], children: [1] };
  nodes[1] = { ...nodes[1], children: [2] };
  nodes[2] = { ...nodes[2], children: [3] };
  gltf.nodes = nodes;
  gltf.scenes = [{ name: "Scene", nodes: [0] }];
  gltf.scene = 0;

  const fixed = writeGlb(gltf, binChunk.data);
  writeFileSync(glbPath, fixed);
  console.log("Patched retro_pc_comp.glb — added scenes + node hierarchy.");
} else {
  console.log("retro_pc_comp.glb already has scenes — no patch needed.");
}
