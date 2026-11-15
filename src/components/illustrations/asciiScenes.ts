/*
 * Shade functions for AsciiScene. Coordinates are in "half panel heights": the panel
 * spans v = -1..1 vertically (down is positive) and u grows to the right from the
 * centre. A shade returns < 0 for empty, 0..1 for a tone, or > 1 for an accent cell.
 */
export type Shade = (u: number, v: number, t: number) => number;

type Vec3 = [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const normalize = ([x, y, z]: Vec3): Vec3 => {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
};

// Light from the upper left, slightly towards the viewer (who looks along +z).
const LIGHT = normalize([-0.45, -0.6, -0.65]);
const lambert = (normal: Vec3) => Math.max(0, dot(normal, LIGHT));

function rotateX([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
}

/** Tone of a lit sphere at (cu, cv), or -1 outside it. `sphere` is in screen units. */
function sphereTone(u: number, v: number, cu: number, cv: number, radius: number) {
  const x = (u - cu) / radius;
  const y = (v - cv) / radius;
  const d2 = x * x + y * y;
  if (d2 > 1) return -1;
  const normal: Vec3 = [x, y, -Math.sqrt(1 - d2)];
  return d2 > 0.86 ? 0.9 : 0.12 + lambert(normal) * 0.75;
}

/** Describe: a solid grows into place and turns, lit face by face with outlined edges. */
export const cubeScene: Shade = (u, v, t) => {
  const size = 0.52 * easeOut(t / 0.9);
  if (size < 0.01) return -1;
  const tilt = 0.55;
  const spin = t * 0.55 + 0.6;

  // Orthographic ray towards +z, taken into the cube's own space.
  const origin = rotateY(rotateX([u, v, -3], -tilt), -spin);
  const direction = rotateY(rotateX([0, 0, 1], -tilt), -spin);

  let near = -Infinity;
  let far = Infinity;
  let hitAxis = 0;
  for (let axis = 0; axis < 3; axis++) {
    if (Math.abs(direction[axis]) < 1e-6) {
      if (Math.abs(origin[axis]) > size) return -1;
      continue;
    }
    let t1 = (-size - origin[axis]) / direction[axis];
    let t2 = (size - origin[axis]) / direction[axis];
    if (t1 > t2) [t1, t2] = [t2, t1];
    if (t1 > near) {
      near = t1;
      hitAxis = axis;
    }
    far = Math.min(far, t2);
  }
  if (near > far) return -1;

  const hit = origin.map((value, i) => value + direction[i] * near) as Vec3;
  const others = [0, 1, 2].filter((axis) => axis !== hitAxis);
  if (others.some((axis) => Math.abs(hit[axis]) > size * 0.86)) {
    return t < 1.2 ? 1.2 : 0.95;
  }

  const localNormal: Vec3 = [0, 0, 0];
  localNormal[hitAxis] = Math.sign(hit[hitAxis]);
  const normal = rotateX(rotateY(localNormal, spin), tilt);
  return 0.08 + lambert(normal) * 0.6;
};

const NODES: [number, number][] = [
  [-1.0, 0.35],
  [0, -0.42],
  [1.0, 0.35],
];
const NODE_RADIUS = 0.3;
const THREADS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

/** Connect: three layers (UI, server, data) stitched together by silk, with data flowing. */
export const connectScene: Shade = (u, v, t) => {
  const nodes = NODES.map(([nu, nv], i) => [nu, nv + Math.sin(t * 1.3 + i * 2) * 0.04] as [number, number]);

  for (let i = 0; i < nodes.length; i++) {
    const tone = sphereTone(u, v, nodes[i][0], nodes[i][1], NODE_RADIUS);
    if (tone < 0) continue;
    const linkedAt = 0.9 + i * 0.5;
    if (tone === 0.9 && t > linkedAt && t - linkedAt < 0.5) return 1.2;
    return tone;
  }

  for (let i = 0; i < THREADS.length; i++) {
    const [from, to] = THREADS[i];
    const [au, av] = nodes[from];
    const [bu, bv] = nodes[to];
    const du = bu - au;
    const dv = bv - av;
    const along = ((u - au) * du + (v - av) * dv) / (du * du + dv * dv);
    if (along < 0 || along > 1) continue;
    if (Math.hypot(u - (au + along * du), v - (av + along * dv)) > 0.035) continue;

    const grow = clamp01((t - 0.4 - i * 0.5) / 0.6);
    if (along > grow) continue;
    if (grow < 1) return grow - along < 0.06 ? 1.3 : 0.5;
    const bead = (((t * 0.45 + i / 3) % 1) + 1) % 1;
    return Math.abs(along - bead) < 0.035 ? 1.3 : 0.5;
  }
  return -1;
};

const DEPLOY_REGIONS: [number, number][] = [
  [-0.9, 0.35],
  [0.2, 0.55],
  [1.4, 0.2],
  [2.3, -0.3],
  [3.4, 0.45],
  [4.6, -0.15],
  [5.5, 0.6],
];

/** Build and deploy: a turning globe whose deploy regions light up one by one. */
export const globeScene: Shade = (u, v, t) => {
  const radius = 0.86;
  const d2 = u * u + v * v;
  if (d2 > radius * radius) return -1;

  const nx = u / radius;
  const ny = v / radius;
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const light = lambert([nx, ny, -nz]);

  const longitude = Math.atan2(nx, nz) + t * 0.35;
  const latitude = Math.asin(ny);
  const graticule = Math.abs(Math.sin(longitude * 4)) < 0.09 || Math.abs(Math.sin(latitude * 5)) < 0.09 ? 0.18 : 0;

  for (let i = 0; i < DEPLOY_REGIONS.length; i++) {
    const [lon, lat] = DEPLOY_REGIONS[i];
    const deltaLon = Math.atan2(Math.sin(longitude - lon), Math.cos(longitude - lon));
    if (Math.hypot(deltaLon * Math.cos(latitude), latitude - lat) < 0.16 && t > 0.8 + i * 0.35) return 1.4;
  }
  return 0.1 + light * 0.7 + graticule;
};

/** A faint orb web anchored off the top left, its spiral drifting outwards: a backdrop, not a subject. */
export const webScene: Shade = (u, v, t) => {
  const x = u + 2.4;
  const y = v + 1.3;
  const r = Math.hypot(x, y);
  const angle = Math.atan2(y, x);
  const fade = clamp01(1 - r / 6.5);
  const shimmer = 0.5 + 0.5 * Math.sin(u * 2.6 + v * 1.7 + t * 0.7);
  const onSpoke = (r * Math.abs(Math.sin(angle * 8))) / 8 < 0.035;
  const onSpiral = Math.abs(Math.sin(r * 2.6 - angle * 0.4 - t * 0.3)) < 0.1;
  if (onSpoke || onSpiral) return (0.2 + 0.1 * shimmer) * fade;
  return 0.05 * shimmer * fade;
};

export const SCENES = { cube: cubeScene, connect: connectScene, globe: globeScene, web: webScene } satisfies Record<string, Shade>;
export type SceneName = keyof typeof SCENES;
