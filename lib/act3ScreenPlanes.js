import * as THREE from "three";

const AXES = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _centroid = new THREE.Vector3();
const _toRoot = new THREE.Matrix4();
const _rootInv = new THREE.Matrix4();
const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();
const _tangentX = new THREE.Vector3();
const _tangentY = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _euler = new THREE.Euler();
const _quaternion = new THREE.Quaternion();

function quantizeAxisIndex(normal) {
  let bestIndex = 0;
  let bestDot = -1;

  for (let index = 0; index < AXES.length; index += 1) {
    const dot = Math.abs(normal.dot(AXES[index]));
    if (dot > bestDot) {
      bestDot = dot;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function buildFaceBasis(faceNormal, tangentX, tangentY) {
  const up =
    Math.abs(faceNormal.y) > 0.85
      ? new THREE.Vector3(0, 0, 1)
      : new THREE.Vector3(0, 1, 0);
  tangentX.crossVectors(up, faceNormal).normalize();
  tangentY.crossVectors(faceNormal, tangentX).normalize();
}

function getModelBounds(root) {
  _box.makeEmpty();
  root.traverse((child) => {
    if (!child.isMesh || child.name === "screen-projection") {
      return;
    }
    _box.expandByObject(child);
  });

  if (_box.isEmpty()) {
    _box.setFromObject(root);
  }

  return _box;
}

/** Sum triangle area bucketed by dominant normal direction. */
function bucketMeshFaces(root) {
  root.updateWorldMatrix(true, true);
  _rootInv.copy(root.matrixWorld).invert();

  /** @type {{ area: number, points: THREE.Vector3[] }[]} */
  const buckets = AXES.map(() => ({ area: 0, points: [] }));

  root.traverse((child) => {
    if (!child.isMesh || child.name === "screen-projection") {
      return;
    }

    child.updateWorldMatrix(true, true);
    _toRoot.multiplyMatrices(_rootInv, child.matrixWorld);

    const geometry = child.geometry;
    const position = geometry.attributes.position;
    const index = geometry.index;
    const triCount = index ? index.count / 3 : position.count / 3;

    for (let tri = 0; tri < triCount; tri += 1) {
      const ia = index ? index.getX(tri * 3) : tri * 3;
      const ib = index ? index.getX(tri * 3 + 1) : tri * 3 + 1;
      const ic = index ? index.getX(tri * 3 + 2) : tri * 3 + 2;

      _a.fromBufferAttribute(position, ia).applyMatrix4(_toRoot);
      _b.fromBufferAttribute(position, ib).applyMatrix4(_toRoot);
      _c.fromBufferAttribute(position, ic).applyMatrix4(_toRoot);

      _ab.subVectors(_b, _a);
      _ac.subVectors(_c, _a);
      _normal.crossVectors(_ab, _ac);

      const area = _normal.length() * 0.5;
      if (area <= 0) {
        continue;
      }

      _normal.normalize();
      const bucketIndex = quantizeAxisIndex(_normal);
      buckets[bucketIndex].area += area;

      _centroid.copy(_a).add(_b).add(_c).multiplyScalar(1 / 3);
      buckets[bucketIndex].points.push(_centroid.clone());
    }
  });

  return buckets;
}

function measurePointsOnFace(points, faceNormal, center) {
  buildFaceBasis(faceNormal, _tangentX, _tangentY);

  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;

  for (const point of points) {
    _delta.subVectors(point, center);
    const u = _delta.dot(_tangentX);
    const v = _delta.dot(_tangentY);
    minU = Math.min(minU, u);
    maxU = Math.max(maxU, u);
    minV = Math.min(minV, v);
    maxV = Math.max(maxV, v);
  }

  return {
    width: Math.max(maxU - minU, 0.01),
    height: Math.max(maxV - minV, 0.01),
  };
}

function pickBucketIndex(buckets, preferredIndices) {
  let bestIndex = preferredIndices[0];
  let bestArea = -1;

  for (const index of preferredIndices) {
    if (buckets[index].area > bestArea) {
      bestArea = buckets[index].area;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function centerFromBucketPoints(bucket) {
  if (bucket.points.length === 0) {
    return null;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const point of bucket.points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
  }

  return new THREE.Vector3(
    (minX + maxX) * 0.5,
    (minY + maxY) * 0.5,
    (minZ + maxZ) * 0.5,
  );
}

function faceSpecFromBucket(buckets, bucketIndex, fallbackWidth, fallbackHeight, fallbackCenter) {
  const faceNormal = AXES[bucketIndex].clone();
  const bucket = buckets[bucketIndex];
  const bucketCenter = centerFromBucketPoints(bucket);

  if (bucket.points.length > 0 && bucketCenter) {
    const measured = measurePointsOnFace(bucket.points, faceNormal, bucketCenter);
    return {
      baseWidth: Math.max(measured.width, fallbackWidth * 0.75),
      baseHeight: Math.max(measured.height, fallbackHeight * 0.75),
      center: bucketCenter,
      faceNormal,
    };
  }

  return {
    baseWidth: fallbackWidth,
    baseHeight: fallbackHeight,
    center: fallbackCenter.clone(),
    faceNormal,
  };
}

function analyzeMonitorScreen(root) {
  const box = getModelBounds(root);
  box.getSize(_size);
  box.getCenter(_center);

  const buckets = bucketMeshFaces(root);
  const bucketIndex = pickBucketIndex(buckets, [4, 5]);

  const fallbackWidth = _size.x * 0.92;
  const fallbackHeight = _size.y * 0.92;
  const face = faceSpecFromBucket(
    buckets,
    bucketIndex,
    fallbackWidth,
    fallbackHeight,
    _center,
  );

  return finalizeFaceSpec(face);
}

function analyzeIphoneScreen(root) {
  const box = getModelBounds(root);
  box.getSize(_size);
  box.getCenter(_center);

  const dims = [
    { axis: "x", value: _size.x },
    { axis: "y", value: _size.y },
    { axis: "z", value: _size.z },
  ].sort((left, right) => left.value - right.value);

  const thinAxis = dims[0].axis;
  const preferredIndices =
    thinAxis === "x"
      ? [0, 1]
      : thinAxis === "y"
        ? [2, 3]
        : [4, 5];

  const buckets = bucketMeshFaces(root);
  const bucketIndex = pickBucketIndex(buckets, preferredIndices);

  const longSide = dims[2].value * 0.9;
  const fallbackHeight = longSide;
  const fallbackWidth = longSide * (9 / 19.5);

  const face = faceSpecFromBucket(
    buckets,
    bucketIndex,
    fallbackWidth,
    fallbackHeight,
    _center,
  );

  return finalizeFaceSpec(face);
}

function finalizeFaceSpec(face) {
  _quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.faceNormal);
  _euler.setFromQuaternion(_quaternion);

  return {
    baseWidth: face.baseWidth,
    baseHeight: face.baseHeight,
    center: face.center,
    faceNormal: face.faceNormal,
    localRotX: _euler.x,
    localRotY: _euler.y,
    localRotZ: _euler.z,
  };
}

/**
 * Find the display glass face on the model mesh.
 * @param {THREE.Object3D} root
 * @param {"iphone"|"monitor"} prefix
 */
export function analyzeScreenFaceBase(root, prefix = "monitor") {
  if (prefix === "iphone") {
    return analyzeIphoneScreen(root);
  }
  return analyzeMonitorScreen(root);
}

/**
 * @param {THREE.Object3D} root
 * @param {"iphone"|"monitor"} prefix
 * @param {Record<string, number>} config
 */
export function computeAutoScreenSpec(root, prefix, config) {
  if (!root.userData.screenFaceBase || root.userData.screenFacePrefix !== prefix) {
    root.userData.screenFaceBase = analyzeScreenFaceBase(root, prefix);
    root.userData.screenFacePrefix = prefix;
  }

  const base = root.userData.screenFaceBase;
  if (!base) {
    return {
      width: 1,
      height: 1,
      localX: 0,
      localY: 0,
      localZ: 0,
      localRotX: 0,
      localRotY: 0,
      localRotZ: 0,
    };
  }

  const widthRatio = config[`${prefix}ScreenWidthRatio`] ?? 0.96;
  const heightRatio = config[`${prefix}ScreenHeightRatio`] ?? 0.96;
  const normalOffset = config[`${prefix}ScreenNormalOffset`] ?? 0.012;

  const width = base.baseWidth * widthRatio;
  const height = base.baseHeight * heightRatio;

  buildFaceBasis(base.faceNormal, _tangentX, _tangentY);

  const position = base.center.clone();
  position.add(base.faceNormal.clone().multiplyScalar(normalOffset));
  position.add(_tangentX.clone().multiplyScalar(config[`${prefix}ScreenLocalX`] ?? 0));
  position.add(_tangentY.clone().multiplyScalar(config[`${prefix}ScreenLocalY`] ?? 0));
  position.add(base.faceNormal.clone().multiplyScalar(config[`${prefix}ScreenLocalZ`] ?? 0));
  position.x += config[`${prefix}ScreenRootX`] ?? 0;
  position.y += config[`${prefix}ScreenRootY`] ?? 0;
  position.z += config[`${prefix}ScreenRootZ`] ?? 0;

  return {
    width,
    height,
    localX: position.x,
    localY: position.y,
    localZ: position.z,
    localRotX: base.localRotX + (config[`${prefix}ScreenLocalRotX`] ?? 0),
    localRotY: base.localRotY + (config[`${prefix}ScreenLocalRotY`] ?? 0),
    localRotZ: base.localRotZ + (config[`${prefix}ScreenLocalRotZ`] ?? 0),
  };
}

/** @param {THREE.Mesh} mesh @param {ReturnType<typeof computeAutoScreenSpec>} spec */
export function applyScreenSpec(mesh, spec) {
  mesh.position.set(spec.localX, spec.localY, spec.localZ);
  mesh.rotation.set(spec.localRotX, spec.localRotY, spec.localRotZ);
  mesh.scale.set(spec.width, spec.height, 1);
}
