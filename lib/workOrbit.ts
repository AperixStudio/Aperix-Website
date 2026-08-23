/**
 * Geometry for the Our Work orbit — a tilted ring of site cards seen in
 * perspective, adapted from the ThreeUI "Gradient Collection / Rising
 * Diagonal" study.
 *
 * The reference paints twelve gradient chips into a 2D canvas. Here the same
 * ring math drives real DOM cards instead, so each tile can stay a live
 * <video> of a site we shipped and keep its hover, focus and case-study
 * dialog. Everything below is pure: the component only feeds it a measured
 * box and a spin angle.
 *
 * Coordinates follow the reference: u/v span the ring plane, +z points at the
 * viewer, +y points DOWN (screen space).
 */

export type Vec3 = readonly [number, number, number];

export type OrbitRing = {
  /** Ring centre in frame units. */
  cx: number;
  cy: number;
  /** Projected semi-major axis, i.e. the ring radius, in frame units. */
  a: number;
  /** semi-minor / semi-major — 0.492 tilts the plane 60.5deg. */
  ratio: number;
  /** Screen angle of the major axis, degrees, y down. */
  axis: number;
  /** Card size in frame units. */
  tileW: number;
  tileH: number;
  /** Camera distance in ring radii. Lower = stronger near/far contrast. */
  dist: number;
  /** psi of tile 0 at t = 0, degrees. */
  phase: number;
  /** +1 rises, -1 falls. */
  direction: number;
};

export type OrbitFrame = { w: number; h: number };

export type OrbitPreset = {
  /** Design frame every length in `ring` is measured in. */
  frame: OrbitFrame;
  ring: OrbitRing;
  /** Cards on the ring. */
  count: number;
  /** Seconds for one full revolution — also the loop length. */
  durationS: number;
};

/**
 * Wide viewports.
 *
 * The reference's frame is 2962x2160 because it fills a viewport; ours is
 * tighter so the cards land at a size a website preview is actually readable
 * at. Ten cards carry the five projects twice, which puts each project
 * opposite its own repeat.
 */
export const WORK_ORBIT_WIDE: OrbitPreset = {
  frame: { w: 1800, h: 1150 },
  ring: {
    cx: 900,
    cy: 575,
    a: 560,
    ratio: 0.492,
    axis: 25.5,
    tileW: 330,
    tileH: 272,
    dist: 7,
    phase: 93,
    direction: 1,
  },
  count: 10,
  durationS: 30,
};

/**
 * Narrow viewports.
 *
 * Same ring, re-proportioned rather than merely scaled down: half the cards,
 * each far larger against the frame, so a phone shows a preview at a size
 * worth looking at instead of ten thumbnails. The ring is wider than the
 * frame on purpose — the cards it pushes past the edges are the ones already
 * turning edge-on, which the edge fade is taking out anyway.
 */
export const WORK_ORBIT_NARROW: OrbitPreset = {
  frame: { w: 860, h: 1000 },
  ring: {
    cx: 430,
    cy: 500,
    a: 380,
    // Opened up from the wide ring's 0.492 (a 60.5deg tilt) to a 44deg one.
    // The clear band the headline sits in is the ellipse's semi-minor axis
    // less half a card; at the wide ring's tilt, five cards this large close
    // that band to nothing and the type has cards across it at all times.
    ratio: 0.72,
    axis: 25.5,
    tileW: 400,
    tileH: 300,
    dist: 6,
    phase: 93,
    direction: 1,
  },
  count: 5,
  durationS: 22,
};

export type OrbitBasis = { u: Vec3; v: Vec3; axis: Vec3 };

/** The ring plane's basis, plus its own axis (u x v) which cards stand along. */
export function createOrbitBasis(axisDeg: number, ratio: number): OrbitBasis {
  const ax = (axisDeg * Math.PI) / 180;
  const cf = ratio;
  const sf = Math.sqrt(Math.max(0, 1 - cf * cf));
  const u: Vec3 = [Math.cos(ax), Math.sin(ax), 0];
  const v: Vec3 = [-Math.sin(ax) * cf, Math.cos(ax) * cf, sf];
  return {
    u,
    v,
    axis: [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ],
  };
}

export type OrbitFit = {
  /** frame units -> CSS px. */
  k: number;
  /** Offset of the frame's top-left inside the measured box, CSS px. */
  ox: number;
  oy: number;
};

/**
 * Letterbox the design frame inside the measured stage, the way the reference
 * does: scale to whichever of width/height binds first so the ring never
 * crops, and centre the remainder.
 */
export function fitOrbit(
  width: number,
  height: number,
  frame: OrbitFrame,
): OrbitFit {
  const aspect = frame.w / frame.h;
  const s = Math.min(width, height * aspect);
  const k = s / frame.w;
  return {
    k,
    ox: (width - frame.w * k) / 2,
    oy: (height - frame.h * k) / 2,
  };
}

/** Angle of tile `index` of `count` at ring rotation `spin` (radians). */
export function orbitTilePsi(
  ring: OrbitRing,
  index: number,
  count: number,
  spin: number,
): number {
  return (
    (ring.phase * Math.PI) / 180 -
    (index * 2 * Math.PI) / count +
    spin * ring.direction
  );
}

export type OrbitTileFrame = {
  /**
   * CSS `matrix()` arguments mapping a tileW x tileH box, centred on the
   * stage origin, onto the card's place in the ring.
   */
  matrix: [number, number, number, number, number, number];
  /** Ring-normal depth, -1 (far) to +1 (near). */
  depth: number;
  /** False once the card has turned its back to us. */
  facing: boolean;
  /**
   * True when the projected basis has flipped handedness, i.e. we are looking
   * at the card from behind and its contents come out reversed.
   */
  mirrored: boolean;
  /**
   * 0 to 1, dropping off as the card turns edge-on. The reference simply
   * culls at that point, which it can afford to when a tile is a small
   * abstract chip; a site preview squeezed to a two-pixel sliver is
   * conspicuous, so ours fades out through the turn instead.
   */
  edge: number;
  /** False when the card is edge-on and has no area to draw. */
  visible: boolean;
};

/**
 * Place one card. The reference builds the same three projected points and
 * feeds them to ctx.setTransform; a CSS matrix takes exactly the same basis,
 * only normalised by the element's own box instead of a 512px texture.
 */
export function orbitTileFrameAt(
  basis: OrbitBasis,
  ring: OrbitRing,
  fit: OrbitFit,
  psi: number,
): OrbitTileFrame {
  const { u, v, axis } = basis;
  const c = Math.cos(psi);
  const s = Math.sin(psi);

  // Centre (unit length), and the ring tangent the card's width runs along.
  const centre: Vec3 = [
    c * u[0] + s * v[0],
    c * u[1] + s * v[1],
    c * u[2] + s * v[2],
  ];
  const tangent: Vec3 = [
    -s * u[0] + c * v[0],
    -s * u[1] + c * v[1],
    -s * u[2] + c * v[2],
  ];

  const hw = ring.tileW / (2 * ring.a);
  const hh = ring.tileH / (2 * ring.a);
  const r = ring.a * fit.k;
  const originX = fit.ox + ring.cx * fit.k;
  const originY = fit.oy + ring.cy * fit.k;

  const project = (p: Vec3): [number, number] => {
    const scale = (r * ring.dist) / (ring.dist - p[2]);
    return [originX + scale * p[0], originY + scale * p[1]];
  };

  const p0 = project(centre);
  // Both basis vectors are negated against the raw ring frame. The reference
  // can take them as they come — its tiles are abstract gradients, so neither
  // a flip nor a mirror shows. A website preview shows both, so the card's
  // local +y is pinned to -axis (axis points up the screen, CSS y runs down)
  // and its local +x to -tangent, which is the choice that leaves the near
  // half of the ring reading the right way round.
  const pw = project([
    centre[0] - tangent[0] * hw,
    centre[1] - tangent[1] * hw,
    centre[2] - tangent[2] * hw,
  ]);
  const ph = project([
    centre[0] - axis[0] * hh,
    centre[1] - axis[1] * hh,
    centre[2] - axis[2] * hh,
  ]);

  const ex = pw[0] - p0[0];
  const ey = pw[1] - p0[1];
  const fx = ph[0] - p0[0];
  const fy = ph[1] - p0[1];

  const halfW = (ring.tileW * fit.k) / 2;
  const halfH = (ring.tileH * fit.k) / 2;
  const det = ex * fy - ey * fx;

  // Face on, |det| is about halfW * halfH; it falls to zero at the silhouette.
  const area = halfW * halfH;
  const edge = area > 0 ? Math.min(1, Math.abs(det) / (area * 0.22)) : 0;

  return {
    matrix: [ex / halfW, ey / halfW, fx / halfH, fy / halfH, p0[0], p0[1]],
    depth: centre[2],
    // The radial normal is the centre vector itself, as in the reference.
    facing: centre[2] > 0,
    mirrored: det < 0,
    edge,
    // Edge on: no area left to draw.
    visible: Math.abs(det) > 0.4 && area > 0,
  };
}
