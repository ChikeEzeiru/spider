/*
 * Shade functions for AsciiScene. Coordinates are in "half panel heights": the panel
 * spans v = -1..1 vertically (down is positive) and u grows to the right from the
 * centre. A shade returns < 0 for empty, 0..1 for a tone (brightness), or > 1 for an
 * accent cell drawn in the brand colour.
 */
export type Shade = (u: number, v: number, t: number) => number;

type Vec3 = [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const k = clamp01((x - edge0) / (edge1 - edge0));
  return k * k * (3 - 2 * k);
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const normalize = ([x, y, z]: Vec3): Vec3 => {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
};

// The viewer looks along +z; light comes from the upper left, slightly towards the viewer.
const TO_VIEWER: Vec3 = [0, 0, -1];
const TO_LIGHT = normalize([-0.45, -0.6, -0.65]);
const HALFWAY = normalize([TO_LIGHT[0], TO_LIGHT[1], TO_LIGHT[2] - 1]);

interface Material {
  albedo?: number;
  /** Highlight strength; 0 for matte surfaces. */
  shine?: number;
  /** Highlight tightness: higher is a smaller, sharper glint. */
  gloss?: number;
}

/** Ambient + diffuse + Blinn–Phong highlight + a rim light that separates edges from the dark. */
function surface(
  normal: Vec3,
  { albedo = 1, shine = 0.5, gloss = 28 }: Material = {},
) {
  const diffuse = Math.max(0, dot(normal, TO_LIGHT));
  const highlight = Math.pow(Math.max(0, dot(normal, HALFWAY)), gloss);
  const facing = Math.max(0, dot(normal, TO_VIEWER));
  const rim = Math.pow(1 - facing, 3);
  return clamp01(
    0.05 + diffuse * 0.62 * albedo + highlight * shine + rim * 0.22,
  );
}

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

/** Cheap smooth 3D value noise in 0..1, for globe landmasses. */
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise3(x: number, y: number, z: number) {
  const [ix, iy, iz] = [Math.floor(x), Math.floor(y), Math.floor(z)];
  const [fx, fy, fz] = [x - ix, y - iy, z - iz];
  const [sx, sy, sz] = [
    fx * fx * (3 - 2 * fx),
    fy * fy * (3 - 2 * fy),
    fz * fz * (3 - 2 * fz),
  ];
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const corner = (dx: number, dy: number, dz: number) =>
    hash(ix + dx, iy + dy, iz + dz);
  return lerp(
    lerp(
      lerp(corner(0, 0, 0), corner(1, 0, 0), sx),
      lerp(corner(0, 1, 0), corner(1, 1, 0), sx),
      sy,
    ),
    lerp(
      lerp(corner(0, 0, 1), corner(1, 0, 1), sx),
      lerp(corner(0, 1, 1), corner(1, 1, 1), sx),
      sy,
    ),
    sz,
  );
}
const fbm = (p: Vec3) =>
  noise3(p[0] * 2, p[1] * 2, p[2] * 2) * 0.55 +
  noise3(p[0] * 4, p[1] * 4, p[2] * 4) * 0.3 +
  noise3(p[0] * 8, p[1] * 8, p[2] * 8) * 0.15;

/** A contact shadow on the floor: centre, radii, and how dark at the core (0..1). */
type ShadowSpot = [
  cu: number,
  cv: number,
  ru: number,
  rv: number,
  strength: number,
];

/**
 * The floor as a lit stage: a soft pool of light centred under the subject, broken by
 * contact shadows. Outside the pool it's empty, so the backdrop shows through.
 */
function stage(
  u: number,
  v: number,
  [pu, pv, pr]: [number, number, number],
  shadows: ShadowSpot[],
) {
  const pool =
    1 -
    smoothstep(
      0.2,
      1,
      Math.hypot((u - pu) / (pr * 1.7), (v - pv) / (pr * 0.32)),
    );
  if (pool <= 0) return -1;
  let light = 1;
  for (const [cu, cv, ru, rv, strength] of shadows) {
    const d = Math.hypot((u - cu) / ru, (v - cv) / rv);
    light = Math.min(light, 1 - strength * (1 - smoothstep(0.15, 1, d)));
  }
  return 0.11 * pool * light;
}

/** A shaded sphere at (cu, cv), or -1 outside it. Returns the normal too, for callers that need it. */
function sphere(
  u: number,
  v: number,
  cu: number,
  cv: number,
  radius: number,
): Vec3 | null {
  const x = (u - cu) / radius;
  const y = (v - cv) / radius;
  const d2 = x * x + y * y;
  if (d2 > 1) return null;
  return [x, y, -Math.sqrt(1 - d2)];
}

/** Describe: a solid grows into place and turns, its faces catching the light. */
export const cubeScene: Shade = (u, v, t) => {
  const grow = easeOut(t / 0.9);
  const size = 0.4 * grow;
  const lift = -0.12;
  if (size > 0.01) {
    const tilt = 0.55;
    const spin = t * 0.5 + 0.6;
    // Orthographic ray towards +z, taken into the cube's own space.
    const origin = rotateY(rotateX([u, v - lift, -3], -tilt), -spin);
    const direction = rotateY(rotateX([0, 0, 1], -tilt), -spin);

    let near = -Infinity;
    let far = Infinity;
    let hitAxis = 0;
    let missed = false;
    for (let axis = 0; axis < 3; axis++) {
      if (Math.abs(direction[axis]) < 1e-6) {
        if (Math.abs(origin[axis]) > size) missed = true;
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

    if (!missed && near <= far) {
      const hit = origin.map((value, i) => value + direction[i] * near) as Vec3;
      const [edgeAxis] = [0, 1, 2]
        .filter((axis) => axis !== hitAxis)
        .sort((a, b) => Math.abs(hit[b]) - Math.abs(hit[a]));
      const onEdge = Math.abs(hit[edgeAxis]) / size > 0.9;
      // While it grows, its edges trace in brand.
      if (onEdge && t < 1.3) return 1.2;

      const localNormal: Vec3 = [0, 0, 0];
      localNormal[hitAxis] = Math.sign(hit[hitAxis]);
      // Bevelled edges: lit by the average of the two faces they join, so they catch the light.
      if (onEdge) localNormal[edgeAxis] = Math.sign(hit[edgeAxis]);
      const normal = normalize(rotateX(rotateY(localNormal, spin), tilt));
      // Faces dim towards the floor, a cheap ambient occlusion that keeps them from reading flat.
      const occlusion = 1 - 0.3 * smoothstep(-0.3, 0.45, v);
      return (
        surface(normal, {
          shine: onEdge ? 0.3 : 0.25,
          gloss: onEdge ? 10 : 16,
        }) * occlusion
      );
    }
  }
  return stage(
    u,
    v,
    [0, 0.66, 0.62],
    [[0, 0.66, 0.7 * grow, 0.13 * grow, 0.95]],
  );
};

const NODES: [number, number][] = [
  [-1.05, 0.12],
  [0, -0.38],
  [1.05, 0.12],
];
const NODE_RADIUS = 0.27;
const THREADS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

/** Connect: three layers (UI, server, data) stitched together by silk, with data flowing. */
export const connectScene: Shade = (u, v, t) => {
  const nodes = NODES.map(
    ([nu, nv], i) =>
      [nu, nv + Math.sin(t * 1.3 + i * 2) * 0.04] as [number, number],
  );

  for (let i = 0; i < nodes.length; i++) {
    const normal = sphere(u, v, nodes[i][0], nodes[i][1], NODE_RADIUS);
    if (!normal) continue;
    const linkedAt = 0.9 + i * 0.5;
    const rimCell = normal[2] > -0.38;
    if (rimCell && t > linkedAt && t - linkedAt < 0.5) return 1.2;
    return surface(normal, { shine: 0.75, gloss: 40 });
  }

  for (let i = 0; i < THREADS.length; i++) {
    const [from, to] = THREADS[i];
    const [au, av] = nodes[from];
    const [bu, bv] = nodes[to];
    const du = bu - au;
    const dv = bv - av;
    const along = ((u - au) * du + (v - av) * dv) / (du * du + dv * dv);
    if (along < 0 || along > 1) continue;
    if (Math.hypot(u - (au + along * du), v - (av + along * dv)) > 0.03)
      continue;

    const grow = clamp01((t - 0.4 - i * 0.5) / 0.6);
    if (along > grow) continue;
    if (grow < 1) return grow - along < 0.06 ? 1.3 : 0.7;
    const bead = (((t * 0.45 + i / 3) % 1) + 1) % 1;
    return Math.abs(along - bead) < 0.035 ? 1.3 : 0.7;
  }

  // Each sphere's shadow tightens and darkens as it bobs closer to the floor.
  const shadows = nodes.map(([nu, nv]): ShadowSpot => {
    const height = 0.82 - nv;
    return [
      nu,
      0.78,
      0.26 + height * 0.1,
      0.06 + height * 0.02,
      clamp01(1.15 - height * 0.5),
    ];
  });
  return stage(u, v, [0, 0.78, 0.85], shadows);
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

/** Build and deploy: a turning globe with real-looking land and sea, its deploy regions lighting up. */
export const globeScene: Shade = (u, v, t) => {
  const radius = 0.78;
  const lift = -0.1;
  const normal = sphere(u, v, 0, lift, radius);
  if (!normal) {
    // A thin atmosphere halo just outside the limb.
    const d = Math.hypot(u, v - lift) / radius;
    if (d < 1.06) return 0.3 * (1 - (d - 1) / 0.06);
    return stage(u, v, [0, 0.84, 0.6], [[0, 0.84, 0.62, 0.1, 0.9]]);
  }

  const spin = t * 0.3;
  const longitude = Math.atan2(normal[0], -normal[2]) + spin;
  const latitude = Math.asin(normal[1]);

  for (let i = 0; i < DEPLOY_REGIONS.length; i++) {
    const [lon, lat] = DEPLOY_REGIONS[i];
    const deltaLon = Math.atan2(
      Math.sin(longitude - lon),
      Math.cos(longitude - lon),
    );
    if (
      Math.hypot(deltaLon * Math.cos(latitude), latitude - lat) < 0.13 &&
      t > 0.8 + i * 0.35
    )
      return 1.4;
  }

  // Land is matte and bright; sea is darker but glints where the light catches it.
  const onSphere: Vec3 = [
    Math.cos(latitude) * Math.sin(longitude),
    latitude,
    Math.cos(latitude) * Math.cos(longitude),
  ];
  const land = smoothstep(0.5, 0.56, fbm(onSphere));
  const sea = surface(normal, { albedo: 0.22, shine: 0.6, gloss: 36 });
  const ground = surface(normal, { albedo: 1, shine: 0.05, gloss: 8 });
  return sea + (ground - sea) * land;
};

/** A faint orb web anchored at (au, av), its spiral drifting outwards: a backdrop, not a subject. */
const orbWeb =
  (au: number, av: number): Shade =>
  (u, v, t) => {
    const x = u - au;
    const y = v - av;
    const r = Math.hypot(x, y);
    const angle = Math.atan2(y, x);
    const fade = clamp01(1 - r / 6.5);
    const shimmer = 0.5 + 0.5 * Math.sin(u * 2.6 + v * 1.7 + t * 0.7);
    const onSpoke = (r * Math.abs(Math.sin(angle * 8))) / 8 < 0.035;
    const onSpiral = Math.abs(Math.sin(r * 2.6 - angle * 0.4 - t * 0.3)) < 0.1;
    if (onSpoke || onSpiral) return (0.2 + 0.1 * shimmer) * fade;
    return 0.05 * shimmer * fade;
  };

/** Anchored off the top left, for panels about twice as wide as they're tall. */
export const webScene = orbWeb(-2.4, -1.3);
/** Anchored above the middle, fanning down across a wide strip. */
const wideWebScene = orbWeb(0, -1.8);

/** Lays a scene over the web backdrop at a fraction of its strength. */
const overWeb =
  (shade: Shade, strength = 0.3): Shade =>
  (u, v, t) => {
    const tone = shade(u, v, t);
    return tone >= 0 ? tone : webScene(u, v, t) * strength;
  };

export const SCENES = {
  cube: overWeb(cubeScene),
  connect: overWeb(connectScene),
  globe: overWeb(globeScene),
  web: webScene,
  wideWeb: wideWebScene,
} satisfies Record<string, Shade>;
export type SceneName = keyof typeof SCENES;
