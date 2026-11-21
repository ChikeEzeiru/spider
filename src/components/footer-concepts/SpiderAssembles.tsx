"use client";

import { useEffect, useRef } from "react";
import SpiderRig from "@/components/mascot/SpiderRig";

/*
 * Concept J: the spider builds the app by webbing its pieces and reeling them in.
 *
 * The finished app (a Tasks screen, light) is painted once, off screen, at full quality.
 * The build only ever reveals pieces of that picture:
 * - the app is tiled into squares of three sizes (seeded, so the same each time), the
 *   tiling a little larger than the app so the outer edges land just outside it;
 * - the spider drops in on its line and hangs at the app's centre, the hub of the web;
 * - one after another, a dashed wireframe cube drifts in outside the app, slowly turning.
 *   The spider shoots a thread out to it, catches it, and reels it in along the thread:
 *   the cube squares up and folds flat as it lands in its place, the thread lets go, and
 *   the square fills with its piece of the app. Several threads are out at once, so the
 *   web fans out from the spider while the pieces come in;
 * - each pull tugs the spider a little toward the piece it's reeling;
 * - when the last piece is in, the spider climbs its line to the app's top edge and sits.
 *   From then on it only blinks.
 * Everything is a function of one clock (draw(t)), so it can pause off screen, resume, and
 * be seeked to any moment. With reduced motion the finished app shows, still.
 */

// ---- the scene, in its own units
export const SW = 1216;
export const SH = 560;
export const PHONE_W = 720; // on phones, the middle 720 units are shown
const DESIGN = { w: 440, h: 272 }; // the app is laid out at this size, then scaled up
const APP_W = 580;
const APP_H = (APP_W * DESIGN.h) / DESIGN.w;
export const APP = { x: (SW - APP_W) / 2, y: (SH - APP_H) / 2, w: APP_W, h: APP_H, r: 16 };
const HUB = { x: APP.x + APP.w / 2, y: APP.y + APP.h / 2 };

const SEQ = {
  drop: 800, // ms the spider takes to drop in to the hub
  start: 900, // ms after it starts that the first cube shows
  stagger: 165, // ms from one cube to the next
  fadeIn: 320, // ms a cube takes to fade in where it starts
  shoot: 240, // ms the thread takes to reach it
  catch: 120, // ms between the thread arriving and the pull starting
  reel: 1050, // ms to reel it in and fold it flat onto its square
  letGo: 220, // ms the thread takes to fade once it's landed
  fill: 380, // ms a square takes to fill with its piece of the app
  out: [60, 120] as const, // units out from its square that a cube starts
  drift: 10, // units it drifts while waiting to be caught
  spin: [8, 38] as const, // degrees turned about each tumbling axis as it starts
  roll: [0, 20] as const, // …and about the axis facing you
  tug: 7, // degrees the spider leans into a pull
  climb: 900, // ms to climb from the hub to the app's top edge
};
export const LOOK = {
  cube: "rgba(79, 86, 84, 0.55)", // the cubes' dashed lines (aztec-600)
  width: 0.75,
  dash: [2.5, 4],
  focal: 560,
  silk: "rgba(28, 33, 31, 0.6)", // threads (aztec-900)
  silkWidth: 0.75,
};

const SPIDER_W = 26;
const SPIDER_H = SPIDER_W / 2;

// ---- seeded randomness, so the tiling and starting places are the same every time
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Tile {
  x: number; // in app coordinates
  y: number;
  s: number;
  from: { x: number; y: number }; // scene coordinates
  to: { x: number; y: number };
  drift: { x: number; y: number };
  order: number;
  spin: [number, number, number];
  t0: number; // fades in
  caught: number; // thread reaches it
  pull: number; // reeling starts
  land: number;
}

// ---- the tiling: a grid a little larger than the app; each free cell starts the largest
// square that fits, sometimes stepping down a size
function tileApp(): Tile[] {
  const rand = seeded(11);
  const range = (r: readonly [number, number]) => r[0] + rand() * (r[1] - r[0]);
  const CELL = 48;
  const COLS = 13;
  const ROWS = 8;
  const off = { x: (APP.w - COLS * CELL) / 2, y: (APP.h - ROWS * CELL) / 2 };
  const taken = Array.from({ length: ROWS }, () => new Array<boolean>(COLS).fill(false));
  const fits = (c: number, r: number, n: number) => {
    if (c + n > COLS || r + n > ROWS) return false;
    for (let y = r; y < r + n; y++) for (let x = c; x < c + n; x++) if (taken[y][x]) return false;
    return true;
  };
  const tiles: Tile[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (taken[r][c]) continue;
      let n = 1;
      if (fits(c, r, 3) && rand() < 0.6) n = 3;
      else if (fits(c, r, 2) && rand() < 0.75) n = 2;
      for (let y = r; y < r + n; y++) for (let x = c; x < c + n; x++) taken[y][x] = true;
      const s = n * CELL;
      const x = off.x + c * CELL;
      const y = off.y + r * CELL;
      const to = { x: APP.x + x + s / 2, y: APP.y + y + s / 2 };
      // out along the line from the hub through the square, so the thread pulls it straight in
      let dx = to.x - HUB.x;
      let dy = to.y - HUB.y;
      let len = Math.hypot(dx, dy);
      if (len < 30) {
        const a = rand() * Math.PI * 2;
        dx = Math.cos(a);
        dy = Math.sin(a);
        len = 1;
      }
      const out = range(SEQ.out) + s / 2;
      const ux = dx / len;
      const uy = dy / len;
      const jitter = (rand() - 0.5) * 0.35;
      const da = rand() * Math.PI * 2;
      // kept inside the frame, so every piece is seen before it's caught
      const inset = s / 2 + 16;
      const from = {
        x: Math.max(inset, Math.min(SW - inset, to.x + (ux - uy * jitter) * out)),
        y: Math.max(inset, Math.min(SH - inset, to.y + (uy + ux * jitter) * out)),
      };
      tiles.push({
        x,
        y,
        s,
        from,
        to,
        drift: { x: Math.cos(da) * SEQ.drift, y: Math.sin(da) * SEQ.drift },
        order: rand(),
        spin: [0, 0, 0],
        t0: 0,
        caught: 0,
        pull: 0,
        land: 0,
      });
    }
  tiles.sort((a, b) => a.order - b.order);
  tiles.forEach((k, i) => {
    k.t0 = SEQ.start + i * SEQ.stagger;
    k.caught = k.t0 + SEQ.fadeIn * 0.6 + SEQ.shoot;
    k.pull = k.caught + SEQ.catch;
    k.land = k.pull + SEQ.reel;
  });
  return tiles;
}

// ---- small drawing helpers
export const clamp = (p: number) => Math.max(0, Math.min(1, p));
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
// reeling: a firm start (the tug), then it glides in and settles
const reelEase = (p: number) => 1 - Math.pow(1 - p, 2.6);

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// A cube: eight corners turned (x, then y, then z) and seen with perspective. depth 1 is a
// cube, 0 a flat square. Only edges of faces turned toward you draw, fading as they turn away.
const FACES = [
  [0, 1, 3, 2, 0, 0, -1],
  [4, 5, 7, 6, 0, 0, 1],
  [0, 2, 6, 4, -1, 0, 0],
  [1, 3, 7, 5, 1, 0, 0],
  [0, 1, 5, 4, 0, -1, 0],
  [2, 3, 7, 6, 0, 1, 0],
];
const EDGES = [
  [0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7],
];
const EDGE_FACES = EDGES.map(([a, b]) =>
  FACES.map((f, i) => (f.slice(0, 4).includes(a) && f.slice(0, 4).includes(b) ? i : -1)).filter((i) => i >= 0),
);
function turn([x0, y0, z0]: number[], ax: number, ay: number, az: number) {
  let x = x0;
  let y = y0;
  let z = z0;
  let c = Math.cos(ax);
  let s = Math.sin(ax);
  let n = y * c - z * s;
  z = y * s + z * c;
  y = n;
  c = Math.cos(ay);
  s = Math.sin(ay);
  n = x * c + z * s;
  z = -x * s + z * c;
  x = n;
  c = Math.cos(az);
  s = Math.sin(az);
  n = x * c - y * s;
  y = x * s + y * c;
  x = n;
  return [x, y, z];
}
/** Turned about its own z axis first: for a rolling cube, so a quarter turn looks the same as none. */
function turnRollFirst(p: number[], ax: number, ay: number, az: number) {
  const [x, y, z] = turn(p, 0, 0, az);
  return turn([x, y, z], ax, ay, 0);
}
export function drawCube(g: CanvasRenderingContext2D, cx: number, cy: number, size: number, depth: number, ax: number, ay: number, az: number, alpha: number, rollFirst = false) {
  const rot = rollFirst ? turnRollFirst : turn;
  const h = size / 2;
  const d = (Math.max(0.0001, depth) * size) / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const [x, y, z] = rot([i & 1 ? h : -h, i & 2 ? h : -h, i & 4 ? d : -d], ax, ay, az);
    const k = LOOK.focal / (LOOK.focal + z);
    pts.push([cx + x * k, cy + y * k]);
  }
  const facing = FACES.map((f) => clamp(-rot([f[4], f[5], f[6]], ax, ay, az)[2] * 3));
  g.lineWidth = LOOK.width;
  g.strokeStyle = LOOK.cube;
  g.setLineDash(LOOK.dash);
  EDGES.forEach(([a, b], i) => {
    const v = Math.max(...EDGE_FACES[i].map((f) => facing[f])) * alpha;
    if (v < 0.02) return;
    g.globalAlpha = v;
    g.beginPath();
    g.moveTo(pts[a][0], pts[a][1]);
    g.lineTo(pts[b][0], pts[b][1]);
    g.stroke();
  });
  g.globalAlpha = 1;
  g.setLineDash([]);
}

// ---- the finished app, light, painted once (laid out at DESIGN size, drawn at APP size)
export function paintApp(dpr: number, sans: string, mono: string) {
  const W = DESIGN.w;
  const H = DESIGN.h;
  const k = APP.w / W;
  const c = document.createElement("canvas");
  c.width = Math.round(APP.w * dpr);
  c.height = Math.round(APP.h * dpr);
  const g = c.getContext("2d")!;
  g.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
  const R = APP.r / k;
  const text = (t: string, x: number, y: number, size: number, color: string, weight = 400, align: CanvasTextAlign = "left", font = sans) => {
    g.font = `${weight} ${size}px ${font}`;
    g.fillStyle = color;
    g.textAlign = align;
    g.textBaseline = "alphabetic";
    g.fillText(t, x, y);
  };
  const ink = (a: number) => `rgba(28, 33, 31, ${a})`;

  g.save();
  roundRect(g, 0, 0, W, H, R);
  g.clip();
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, W, H);

  // header: breadcrumb and status
  text("lumen", 16, 24, 11.5, "#6d7773");
  text("›", 52, 24, 11.5, "#d1d6d4");
  text("tasks-app", 64, 24, 11.5, "#1c211f", 500);
  text("Deployed", W - 16, 24, 11, "#6d7773", 400, "right");
  g.font = `400 11px ${sans}`;
  const dx = W - 16 - g.measureText("Deployed").width - 9;
  g.fillStyle = "#eb6248";
  g.beginPath();
  g.arc(dx, 20.5, 2.6, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = ink(0.07);
  g.fillRect(0, 38, W, 1);

  // sidebar
  g.fillStyle = "#f9fafa";
  g.fillRect(0, 39, 120, H - 39);
  g.fillStyle = ink(0.07);
  g.fillRect(120, 39, 1, H - 39);
  g.fillStyle = ink(0.05);
  roundRect(g, 8, 47, 104, 24, 6);
  g.fill();
  ["Tasks", "Projects", "Team", "Settings"].forEach((label, i) => {
    const on = i === 0;
    text(label, 18, 63 + i * 28, 12, on ? "#1c211f" : "#6d7773", on ? 500 : 400);
  });

  // main: title, count, primary action
  const M = 136;
  text("Tasks", M, 64, 15, "#1c211f", 500);
  text("12 open · 3 due today", M, 82, 11, "#9fa7a4");
  g.fillStyle = "#eb6248";
  roundRect(g, W - 16 - 78, 50, 78, 26, 7);
  g.fill();
  text("New task", W - 16 - 39, 67, 11.5, "#ffffff", 500, "center");

  // rows
  const rows = [
    { t: "Ship the onboarding flow", tag: "typed", done: true },
    { t: "Weekly digest email", tag: "@weekly", done: false },
    { t: "Invite the design team", tag: "auth", done: false },
    { t: "Archive old projects", tag: "Prisma", done: false },
  ];
  rows.forEach((r, i) => {
    const y = 98 + i * 40;
    g.fillStyle = ink(0.07);
    g.fillRect(M, y, W - 16 - M, 1);
    if (r.done) {
      g.fillStyle = "#1c211f";
      roundRect(g, M, y + 13, 14, 14, 4);
      g.fill();
      g.strokeStyle = "#ffffff";
      g.lineWidth = 1.6;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.beginPath();
      g.moveTo(M + 3.8, y + 20.2);
      g.lineTo(M + 6.2, y + 22.6);
      g.lineTo(M + 10.4, y + 17.4);
      g.stroke();
    } else {
      g.strokeStyle = "#d1d6d4";
      g.lineWidth = 1;
      roundRect(g, M + 0.5, y + 13.5, 13, 13, 4);
      g.stroke();
    }
    text(r.t, M + 24, y + 24.5, 12.5, r.done ? "#9fa7a4" : "#3d4341");
    g.font = `400 10.5px ${mono}`;
    const tw = g.measureText(r.tag).width + 12;
    g.fillStyle = ink(0.05);
    roundRect(g, W - 16 - tw, y + 11, tw, 18, 4);
    g.fill();
    text(r.tag, W - 16 - tw / 2, y + 23.5, 10.5, "#6d7773", 400, "center", mono);
  });
  g.restore();

  // its edge
  roundRect(g, 0.375, 0.375, W - 0.75, H - 0.75, R - 0.375);
  g.lineWidth = 0.75;
  g.strokeStyle = "#d1d6d4";
  g.stroke();
  return c;
}

export default function SpiderAssembles() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const spiderRef = useRef<SVGGElement>(null);
  const dropRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const spider = spiderRef.current;
    const drop = dropRef.current;
    if (!root || !canvas || !stage || !spider || !drop) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const eyes = spider.querySelector<SVGGElement>("[data-part='eyes']");

    const tiles = tileApp();
    const lastLand = Math.max(...tiles.map((k) => k.land));
    const whole = lastLand + SEQ.fill; // every square filled: the app is drawn whole from here
    const climbAt = whole + 150;
    const END = climbAt + SEQ.climb;
    const pick = (r: readonly [number, number]) => (Math.random() < 0.5 ? -1 : 1) * (r[0] + Math.random() * (r[1] - r[0])) * (Math.PI / 180);
    const spins = () => tiles.forEach((k) => (k.spin = [pick(SEQ.spin), pick(SEQ.spin), pick(SEQ.roll)]));
    spins();

    // ---- sizing: the canvas at the screen's density, the scene scaled to fit
    let scale = 1;
    let offX = 0;
    let dpr = 1;
    let app: HTMLCanvasElement | null = null;
    const fit = () => {
      const phone = window.matchMedia("(max-width: 639px)").matches;
      const viewW = phone ? PHONE_W : SW;
      offX = (SW - viewW) / 2;
      const cssW = root.clientWidth;
      scale = cssW / viewW;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      root.style.height = `${SH * scale}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(SH * scale * dpr);
      stage.style.transform = `scale(${scale}) translateX(${-offX}px)`;
    };

    // where a cube is at a moment: drifting while it waits, then reeled in along the thread
    const cubeAt = (k: Tile, t: number) => {
      const wait = clamp((t - k.t0) / (k.pull - k.t0));
      const sx = k.from.x + k.drift.x * easeOut(wait);
      const sy = k.from.y + k.drift.y * easeOut(wait);
      const p = clamp((t - k.pull) / SEQ.reel);
      const e = reelEase(p);
      return { x: sx + (k.to.x - sx) * e, y: sy + (k.to.y - sy) * e, p };
    };

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!app) return;
      const k0 = dpr * scale;
      ctx.setTransform(k0, 0, 0, k0, -offX * k0, 0);

      // the app: whole once every piece is in, otherwise the pieces that have filled
      if (t >= whole) {
        ctx.drawImage(app, APP.x, APP.y, APP.w, APP.h);
      } else {
        tiles.forEach((k) => {
          const f = clamp((t - k.land) / SEQ.fill);
          if (f <= 0) return;
          ctx.save();
          ctx.beginPath();
          ctx.rect(APP.x + k.x, APP.y + k.y, k.s, k.s);
          ctx.clip();
          ctx.globalAlpha = easeOut(f);
          ctx.drawImage(app!, APP.x, APP.y, APP.w, APP.h);
          ctx.restore();
        });
      }

      // threads from the hub: shot out, held while reeling, let go once landed
      ctx.lineWidth = LOOK.silkWidth;
      ctx.strokeStyle = LOOK.silk;
      ctx.lineCap = "round";
      tiles.forEach((k) => {
        const shotAt = k.caught - SEQ.shoot;
        if (t < shotAt || t > k.land + SEQ.letGo) return;
        const c = cubeAt(k, t);
        const reach = easeOut(clamp((t - shotAt) / SEQ.shoot));
        const x = HUB.x + (c.x - HUB.x) * reach;
        const y = HUB.y + (c.y - HUB.y) * reach;
        ctx.globalAlpha = t > k.land ? 1 - clamp((t - k.land) / SEQ.letGo) : 1;
        ctx.beginPath();
        ctx.moveTo(HUB.x, HUB.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        // a small knot where it holds the piece
        if (reach >= 1 && t <= k.land) {
          ctx.fillStyle = LOOK.silk;
          ctx.beginPath();
          ctx.arc(c.x, c.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // the cubes: drifting in, then reeled, squaring up and folding flat as they land
      tiles.forEach((k) => {
        if (t < k.t0) return;
        const f = clamp((t - k.land) / SEQ.fill);
        if (f >= 1) return;
        const c = cubeAt(k, t);
        const fade = clamp((t - k.t0) / SEQ.fadeIn);
        if (c.p < 1) {
          const square = 1 - easeInOut(clamp(c.p * 1.05));
          const fold = 1 - easeInOut(clamp((c.p - 0.4) / 0.6));
          drawCube(ctx, c.x, c.y, k.s, fold, k.spin[0] * square, k.spin[1] * square, k.spin[2] * square, fade);
        } else {
          drawCube(ctx, k.to.x, k.to.y, k.s, 0, 0, 0, 0, 1 - f);
        }
      });

      // the spider: drops in, hangs at the hub leaning into each pull, then climbs to the edge
      const dropP = easeInOut(clamp(t / SEQ.drop));
      const climbP = easeInOut(clamp((t - climbAt) / SEQ.climb));
      let sy = -SPIDER_H + (HUB.y + SPIDER_H) * dropP;
      sy += (APP.y - SPIDER_H / 2 - HUB.y) * climbP;
      let lean = 0;
      tiles.forEach((k) => {
        const p = (t - k.pull) / 320;
        if (p > 0 && p < 1) lean += Math.sign(k.from.x - HUB.x || 1) * SEQ.tug * Math.sin(Math.PI * p);
      });
      lean = Math.max(-SEQ.tug, Math.min(SEQ.tug, lean));
      spider.style.opacity = "1";
      spider.setAttribute("transform", `translate(${HUB.x} ${sy}) rotate(${lean}) translate(${-SPIDER_W / 2} ${-SPIDER_H / 2})`);
      drop.setAttribute("x1", `${HUB.x}`);
      drop.setAttribute("x2", `${HUB.x}`);
      drop.setAttribute("y2", `${sy - SPIDER_H * 0.3}`);
      // once it's sat on the edge, its line has done its job
      drop.style.opacity = `${1 - clamp((t - climbAt - SEQ.climb) / 500)}`;
    };

    // ---- the clock
    let t = 0;
    let frame = 0;
    let last = 0;
    let started = false;
    let done = false;
    let onScreen = false;
    let blinkTimer = 0;
    const blink = () => {
      eyes?.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], { duration: 160, easing: "ease-in-out" });
      blinkTimer = window.setTimeout(blink, 3200 + Math.random() * 3600);
    };
    if (eyes) {
      eyes.style.transformBox = "fill-box";
      eyes.style.transformOrigin = "50% 50%";
    }

    const finishLine = END + 500; // the drop line's fade
    const tick = (now: number) => {
      t += Math.min(64, now - last);
      last = now;
      draw(t);
      if (t >= finishLine) {
        done = true;
        frame = 0;
        draw(finishLine);
        blinkTimer = window.setTimeout(blink, 1200);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const go = () => {
      if (!frame && !done && started && onScreen && !document.hidden && app) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const halt = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const play = () => {
      halt();
      window.clearTimeout(blinkTimer);
      t = 0;
      done = false;
      started = true;
      spins();
      if (reduce.matches) {
        done = true;
        draw(finishLine);
        return;
      }
      draw(0);
      go();
    };

    fit();
    const resize = new ResizeObserver(() => {
      fit();
      draw(done ? finishLine : t);
    });
    resize.observe(root);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !started) play();
        else if (onScreen) go();
        else halt();
      },
      { threshold: 0.4 },
    );
    const onVisibility = () => (document.hidden ? halt() : go());
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("assemble:replay", play);

    // paint the app once the fonts are in
    const body = getComputedStyle(document.body).fontFamily;
    const probe = document.createElement("span");
    probe.className = "font-mono";
    document.body.appendChild(probe);
    const mono = getComputedStyle(probe).fontFamily;
    probe.remove();
    let disposed = false;
    document.fonts.ready.then(() => {
      // A torn-down instance (React's dev double-mount) must not come back and draw.
      if (disposed) return;
      app = paintApp(3, body, mono);
      io.observe(root);
      draw(done ? finishLine : t);
    });

    // for checking a frame
    (window as unknown as { __spiderJ?: unknown }).__spiderJ = {
      seek: (ms: number) => {
        halt();
        t = ms;
        draw(ms);
      },
      tiles: tiles.length,
      end: finishLine,
    };

    return () => {
      disposed = true;
      halt();
      window.clearTimeout(blinkTimer);
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("assemble:replay", play);
    };
  }, []);

  return (
    <div className="border-t border-secondary">
      <div ref={rootRef} data-assemble className="relative w-full overflow-hidden" aria-label="The spider builds a Tasks app by webbing its pieces and reeling them into place." role="img">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        {/* The stage: scene units, scaled to fit. The spider and its line live here. */}
        <div ref={stageRef} className="pointer-events-none absolute top-0 left-0 origin-top-left" style={{ width: SW, height: SH }}>
          <svg width={SW} height={SH} className="absolute inset-0 overflow-visible">
            <line ref={dropRef} y1={0} className="stroke-aztec-700" strokeWidth={0.75} />
            <g ref={spiderRef} style={{ opacity: 0 }}>
              <SpiderRig width={SPIDER_W} height={SPIDER_H} className="text-aztec-900" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
