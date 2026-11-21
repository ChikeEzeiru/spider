"use client";

import { useEffect, useRef } from "react";
import SpiderRig from "@/components/mascot/SpiderRig";
import { BODY, EYES, LEGS, VARIANTS } from "@/components/ui/SpiderIcon";
import { SW, clamp, drawCube, easeInOut, easeOut, seeded } from "./SpiderAssembles";

/*
 * Concept K: spiders roll in the logo and wordmark.
 *
 * The finished lockup (the header's logo tile and "spider") is painted once and revealed
 * piece by piece. Each piece is a dashed wireframe cube that starts outside the lockup,
 * level with its row, with a small spider behind it. The spider pushes; the cube tips over
 * its leading edge, a quarter turn at a time, along a faint guide line to its place. It lands
 * square, folds flat, and fills with its part of the lockup, and its spider backs away and
 * fades. The starting place is a whole number of turns away, so every cube lands exactly
 * square. Squares with nothing of the lockup in them are left out.
 * When the lockup is whole, the logo blinks: the header's double blink, then now and then
 * (every 7–12 s, sometimes a double), only while it's on screen.
 * Everything is a function of one clock (draw(t)), so it can pause, resume and be seeked.
 */

const SEQ = {
  start: 300, // ms before the first cube shows
  stagger: 260, // ms at least from one cube to the next…
  atOnce: 3, // …and never more than this many spiders on screen at once
  fadeIn: 260, // ms a cube and its spider take to fade in
  wait: 120, // ms before the first push
  turn: 530, // ms each quarter turn takes on average: one continuous roll, easing only at its ends
  fold: 320, // ms to fold flat once it's in place
  fill: 380, // ms a square takes to fill with its piece of the lockup
  leave: 420, // ms the spider takes to back away and fade
  margin: 20, // units clear of the lockup's side where a cube starts (at least)
  blinkAfter: 250, // ms after it's whole that the logo blinks
};
const BLINK = { duration: 1100, delay: 350 }; // the header's double blink (brand.css)
// After that, now and then: every 7–12 s at random, about one in four a double blink. Only while
// the footer is on screen (and the tab is showing).
const IDLE = { every: [7000, 12000] as const, doubles: 0.25, single: 180 };

// The lockup: three rows of the same 64-unit cells as before, as wide as it needs.
const CELL = 64;
const COLS = 12;
const ROWS = 3;
// The lockup takes the band's full height; the scene reaches above and below it only so a
// rolling cube can tip up (into the band's padding, clipped at its edge) without adding
// empty space at rest.
const ROOM = { top: 48, bottom: 16 };
const SCENE_H = ROWS * CELL + ROOM.top + ROOM.bottom;
const PIC = { w: COLS * CELL, h: ROWS * CELL, x: (SW - COLS * CELL) / 2, y: ROOM.top };
const PHONE_W = PIC.w + 48; // on phones, the lockup and a little either side
// the cubes are seen from a little above and to the side as they roll, flat once placed
const TILT = { x: -0.16, y: 0.15 };
const SPIDER_W = 22;
const SPIDER_H = SPIDER_W / 2;

interface Tile {
  id: number; // its place in the full tiling (and its spider's)
  x: number; // in lockup coordinates
  y: number;
  s: number;
  dir: 1 | -1; // rolls rightward (from the left) or leftward
  rolls: number;
  start: number; // centre x where it starts
  to: { x: number; y: number }; // centre, scene coordinates
  t0: number;
  push: number;
  land: number;
  order: number; // seeded: the order the pieces come in
}

// Eight cubes cover the lockup: three large, one medium and four small (cells: column, row, size).
// The bottom-right cell has none of the lockup in it, so it's left out.
const LAYOUT: [number, number, number][] = [
  [0, 0, 3],
  [3, 0, 2],
  [3, 2, 1],
  [4, 2, 1],
  [5, 0, 3],
  [8, 0, 3],
  [11, 0, 1],
  [11, 1, 1],
];

function tilePic(): Tile[] {
  const rand = seeded(2);
  return LAYOUT.map(([c, r, n], id) => {
    const s = n * CELL;
    const x = c * CELL;
    const y = r * CELL;
    const to = { x: PIC.x + x + s / 2, y: PIC.y + y + s / 2 };
    const dir: 1 | -1 = to.x < PIC.x + PIC.w / 2 ? 1 : -1;
    // whole turns from just outside the lockup's near side
    const edge = dir === 1 ? PIC.x - SEQ.margin - s / 2 : PIC.x + PIC.w + SEQ.margin + s / 2;
    const rolls = Math.max(1, Math.ceil(Math.abs(to.x - edge) / s));
    return { id, x, y, s, dir, rolls, start: to.x - dir * rolls * s, to, t0: 0, push: 0, land: 0, order: rand() };
  });
}

/** Times for the pieces that are used, in their (seeded) order. */
function schedule(tiles: Tile[]) {
  tiles.sort((a, b) => a.order - b.order);
  // each spider is on screen from its fade-in until it has backed away; a new one starts only
  // once fewer than SEQ.atOnce are out
  const gone: number[] = [];
  let prev = SEQ.start - SEQ.stagger;
  tiles.forEach((k) => {
    let t0 = prev + SEQ.stagger;
    for (;;) {
      const out = gone.filter((g) => g > t0);
      if (out.length < SEQ.atOnce) break;
      t0 = Math.min(...out);
    }
    k.t0 = t0;
    k.push = t0 + SEQ.fadeIn + SEQ.wait;
    k.land = k.push + k.rolls * SEQ.turn;
    gone.push(k.land + SEQ.leave);
    prev = t0;
  });
  return tiles;
}

/** Eases only the ends of the whole roll: it gathers speed, rolls steadily, and slows to rest. */
const rollEase = (p: number) => (1 - Math.cos(Math.PI * p)) / 2;

/** How far through its roll a piece is, in quarter turns (0…rolls), at a moment. */
const turnsAt = (k: Tile, t: number) => rollEase(clamp((t - k.push) / (k.land - k.push))) * k.rolls;

/** A rolling cube's centre and turn at a moment: quarter turns about its leading bottom edge. */
function rolling(k: Tile, t: number) {
  const turns = turnsAt(k, t);
  if (turns >= k.rolls) return { x: k.to.x, y: k.to.y, a: 0, moving: false, turns };
  const done = Math.floor(turns);
  const p = turns - done;
  const h = k.s / 2;
  const cx = k.start + k.dir * done * k.s; // centre at the start of this turn
  const pivot = { x: cx + k.dir * h, y: k.to.y + h };
  const th = (k.dir * p * Math.PI) / 2;
  const vx = -k.dir * h;
  const vy = -h;
  return {
    x: pivot.x + vx * Math.cos(th) - vy * Math.sin(th),
    y: pivot.y + vx * Math.sin(th) + vy * Math.cos(th),
    a: th,
    moving: t > k.push && t < k.land,
    turns,
  };
}

// Seeded, so the same every time: worked out once. Which pieces are used is known once the
// lockup is painted (squares with none of it in are left out).
const allTiles = tilePic();

// ---- the logo tile, drawn from the header's own shapes (a 36-unit square)
const LOGO = VARIANTS.dark;
const EYE_Y = 24.14;
let logoPaths: { legs: Path2D[]; body: Path2D; eyes: Path2D[] } | null = null;
function drawLogo(g: CanvasRenderingContext2D, lid: number) {
  logoPaths ??= { legs: LEGS.map((d) => new Path2D(d)), body: new Path2D(BODY), eyes: EYES.map((d) => new Path2D(d)) };
  g.save();
  g.beginPath();
  g.roundRect(0, 0, 36, 36, 6);
  g.clip();
  g.fillStyle = LOGO.tile;
  g.fillRect(0, 0, 36, 36);
  g.strokeStyle = LOGO.spider;
  g.lineWidth = 6;
  g.lineCap = "round";
  g.lineJoin = "round";
  logoPaths.legs.forEach((p) => g.stroke(p));
  g.fillStyle = LOGO.spider;
  g.fill(logoPaths.body);
  // the eyes are the tile showing through; a blink squashes them shut
  g.translate(0, EYE_Y);
  g.scale(1, Math.max(0.08, lid));
  g.translate(0, -EYE_Y);
  g.fillStyle = LOGO.tile;
  logoPaths.eyes.forEach((p) => g.fill(p));
  g.restore();
}

/** The header's double blink: eye openness (1 open … 0.1 shut) at ms into it. */
function doubleBlink(ms: number) {
  const p = clamp((ms - BLINK.delay) / BLINK.duration);
  const keys: [number, number][] = [[0, 1], [0.09, 0.1], [0.18, 1], [0.26, 0.1], [0.34, 1], [1, 1]];
  for (let i = 1; i < keys.length; i++) {
    const [a, va] = keys[i - 1];
    const [b, vb] = keys[i];
    if (p <= b) return va + (vb - va) * easeInOut((p - a) / (b - a));
  }
  return 1;
}

// ---- outlines, as AccessGrid draws its footer logo: one fine line round each shape. Taken from
// the shape's filled silhouette (the fill, less the fill shrunk by the line's width), so the
// font's overlapping contours and the logo's crossing strokes never show inside.
// The line is 1.25 units, but never thinner than about a screen pixel (phones scale the scene down).
const LINE = 1.25;
const lineFor = (scale: number) => Math.max(LINE, 1.1 / scale);
const INK = "#9fa7a4"; // aztec-400
// Outlined, the word needs more body than it has set solid, so it's set bold.
const WEIGHT = 700;

function outline(w: number, h: number, dpr: number, line: number, fill: (g: CanvasRenderingContext2D) => void) {
  const make = () => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const g = c.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { c, g };
  };
  const mask = make();
  mask.g.fillStyle = "#000";
  mask.g.strokeStyle = "#000";
  fill(mask.g);
  // shrink it: keep only what's still covered when nudged the line's width every way
  const inner = make();
  inner.g.setTransform(1, 0, 0, 1, 0, 0);
  inner.g.drawImage(mask.c, 0, 0);
  inner.g.globalCompositeOperation = "destination-in";
  const r = line * dpr;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    inner.g.drawImage(mask.c, Math.cos(a) * r, Math.sin(a) * r);
  }
  // the ring between them, in the line colour
  const ring = make();
  ring.g.setTransform(1, 0, 0, 1, 0, 0);
  ring.g.drawImage(mask.c, 0, 0);
  ring.g.globalCompositeOperation = "destination-out";
  ring.g.drawImage(inner.c, 0, 0);
  ring.g.globalCompositeOperation = "source-in";
  ring.g.fillStyle = INK;
  ring.g.fillRect(0, 0, ring.c.width, ring.c.height);
  return ring.c;
}

/** The logo's outline at a size: its tile, and the spider (with its eyes) inside it. */
function logoOutline(size: number, dpr: number, line: number, lid: number) {
  const k = size / 36;
  const tile = outline(size, size, dpr, line, (g) => {
    g.beginPath();
    g.roundRect(0, 0, size, size, 6 * k);
    g.fill();
  });
  logoPaths ??= { legs: LEGS.map((d) => new Path2D(d)), body: new Path2D(BODY), eyes: EYES.map((d) => new Path2D(d)) };
  const paths = logoPaths;
  const spider = outline(size, size, dpr, line, (g) => {
    g.scale(k, k);
    g.beginPath();
    g.roundRect(0, 0, 36, 36, 6);
    g.clip();
    g.lineWidth = 6;
    g.lineCap = "round";
    g.lineJoin = "round";
    paths.legs.forEach((p) => g.stroke(p));
    g.fill(paths.body);
    // the eyes are holes in the body; a blink squashes them shut
    g.globalCompositeOperation = "destination-out";
    g.translate(0, EYE_Y);
    g.scale(1, Math.max(0.08, lid));
    g.translate(0, -EYE_Y);
    paths.eyes.forEach((p) => g.fill(p));
  });
  const c = document.createElement("canvas");
  c.width = tile.width;
  c.height = tile.height;
  const g = c.getContext("2d")!;
  g.drawImage(tile, 0, 0);
  g.drawImage(spider, 0, 0);
  return c;
}

/** The lockup, painted once: the logo tile as tall as the d, then "spider", centred in PIC.
 *  `canvas` is the outlined lockup the pieces fill with; `word` is the outlined word alone (so
 *  the logo can be redrawn over it as it blinks); `solid` is the filled lockup, for telling
 *  which squares have any of it in. */
function paintLockup(dpr: number, sans: string, line: number) {
  const solid = document.createElement("canvas");
  solid.width = Math.round(PIC.w * dpr);
  solid.height = Math.round(PIC.h * dpr);
  const g = solid.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const word = "spider";
  const at = (size: number) => {
    g.font = `${WEIGHT} ${size}px ${sans}`;
    const track = -0.012 * size; // letter spacing: a touch tighter than the font, opened up slightly from -0.03
    const widths = [...word].map((ch) => g.measureText(ch).width + track);
    const asc = g.measureText("d").actualBoundingBoxAscent; // the logo stands as tall as the d
    const top = Math.max(...[...word].map((ch) => g.measureText(ch).actualBoundingBoxAscent)); // the i's dot reaches a touch higher
    const desc = g.measureText("p").actualBoundingBoxDescent;
    const gap = 0.2 * size;
    return { widths, asc, top, desc, gap, total: asc + gap + widths.reduce((a, b) => a + b, 0) - track };
  };
  const m100 = at(100);
  const size = Math.min(PIC.h / ((m100.top + m100.desc) / 100), PIC.w / (m100.total / 100));
  const m = at(size);
  const x0 = (PIC.w - m.total) / 2;
  const baseline = (PIC.h - (m.top + m.desc)) / 2 + m.top;
  const logo = { x: x0, y: baseline - m.asc, size: m.asc };
  const font = `${WEIGHT} ${size}px ${sans}`;
  const setWord = (c: CanvasRenderingContext2D) => {
    c.font = font;
    c.textBaseline = "alphabetic";
    let x = x0 + m.asc + m.gap;
    [...word].forEach((ch, i) => {
      c.fillText(ch, x, baseline);
      x += m.widths[i];
    });
  };

  // the filled version, only for finding the inked squares
  g.save();
  g.translate(logo.x, logo.y);
  g.scale(logo.size / 36, logo.size / 36);
  drawLogo(g, 1);
  g.restore();
  g.fillStyle = "#1c211f";
  setWord(g);

  const wordLine = outline(PIC.w, PIC.h, dpr, line, setWord);
  const logoLine = logoOutline(logo.size, dpr, line, 1);
  const canvas = document.createElement("canvas");
  canvas.width = wordLine.width;
  canvas.height = wordLine.height;
  const cg = canvas.getContext("2d")!;
  cg.drawImage(wordLine, 0, 0);
  cg.drawImage(logoLine, Math.round(logo.x * dpr), Math.round(logo.y * dpr));
  return { canvas, word: wordLine, solid, logo, line };
}

/** Whether a square of the painted lockup has any of it in. */
function inked(pic: HTMLCanvasElement, dpr: number, k: Tile) {
  const g = pic.getContext("2d")!;
  const data = g.getImageData(Math.round(k.x * dpr), Math.round(k.y * dpr), Math.round(k.s * dpr), Math.round(k.s * dpr)).data;
  for (let i = 3; i < data.length; i += 4 * 7) if (data[i] > 24) return true;
  return false;
}

export default function SpiderRolls() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!root || !canvas || !stage) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pushers = Array.from(stage.querySelectorAll<SVGGElement>("[data-pusher]"));

    // set once the lockup is painted
    let tiles: Tile[] = [];
    let whole = 0;
    let blinkAt = 0;
    let END = 0;
    const sans = getComputedStyle(document.body).fontFamily;
    let pic: ReturnType<typeof paintLockup> | null = null;
    const blinkFrames = new Map<number, HTMLCanvasElement>(); // the logo's outline by eye openness
    const PIC_DPR = 3;

    let scale = 1;
    let offX = 0;
    let dpr = 1;
    const fit = () => {
      const phone = window.matchMedia("(max-width: 639px)").matches;
      const viewW = phone ? PHONE_W : SW;
      offX = (SW - viewW) / 2;
      const cssW = root.clientWidth;
      scale = cssW / viewW;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      // the band is as tall as the lockup; the scene overhangs it above and below
      root.style.height = `${PIC.h * scale}px`;
      canvas.style.top = `${-PIC.y * scale}px`;
      canvas.style.height = `${SCENE_H * scale}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(SCENE_H * scale * dpr);
      stage.style.transform = `translateY(${-PIC.y * scale}px) scale(${scale}) translateX(${-offX}px)`;
      // a new width can need a thicker or thinner line: repaint the lockup (the pieces stay)
      if (pic && Math.abs(lineFor(scale) - pic.line) > 0.05) {
        pic = paintLockup(PIC_DPR, sans, lineFor(scale));
        blinkFrames.clear();
      }
    };

    let idleLid = 1; // set by the occasional blink after the build
    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!pic) return;
      const k0 = dpr * scale;
      ctx.setTransform(k0, 0, 0, k0, -offX * k0, 0);
      const image = pic.canvas;

      // the lockup: whole once every piece is in (the logo blinking), otherwise the pieces that have filled
      if (t >= whole) {
        ctx.drawImage(pic.word, PIC.x, PIC.y, PIC.w, PIC.h);
        const lid = (t >= blinkAt ? doubleBlink(t - blinkAt) : 1) * idleLid;
        // a handful of eye openings is plenty for a blink; each is drawn once and kept
        const key = Math.round(lid * 20) / 20;
        let frame = blinkFrames.get(key);
        if (!frame) {
          frame = logoOutline(pic.logo.size, PIC_DPR, pic.line, key);
          blinkFrames.set(key, frame);
        }
        ctx.drawImage(frame, PIC.x + pic.logo.x, PIC.y + pic.logo.y, pic.logo.size, pic.logo.size);
      } else
        tiles.forEach((k) => {
          const f = clamp((t - k.land - SEQ.fold) / SEQ.fill);
          if (f <= 0) return;
          ctx.save();
          ctx.beginPath();
          ctx.rect(PIC.x + k.x, PIC.y + k.y, k.s, k.s);
          ctx.clip();
          ctx.globalAlpha = easeOut(f);
          ctx.drawImage(image, PIC.x, PIC.y, PIC.w, PIC.h);
          ctx.restore();
        });

      tiles.forEach((k) => {
        const el = pushers[k.id];
        if (t < k.t0) {
          el.style.opacity = "0";
          return;
        }
        const fade = clamp((t - k.t0) / SEQ.fadeIn);
        const fold = clamp((t - k.land) / SEQ.fold);
        const fill = clamp((t - k.land - SEQ.fold) / SEQ.fill);
        const r = rolling(k, t);
        const floor = k.to.y + k.s / 2;

        // the guide line it rolls along, fading as it lands
        if (fill < 1) {
          const from = k.start - k.dir * (k.s / 2 + SPIDER_W);
          const toX = k.to.x + k.dir * (k.s / 2);
          ctx.strokeStyle = "rgba(28, 33, 31, 0.14)";
          ctx.lineWidth = 0.75;
          ctx.setLineDash([2, 4]);
          ctx.globalAlpha = fade * (1 - fold);
          ctx.beginPath();
          ctx.moveTo(from, floor + 0.5);
          ctx.lineTo(toX, floor + 0.5);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }

        // the cube: tilted to show its depth as it rolls, squaring up and folding flat once in
        if (fill < 1) {
          const settle = 1 - easeInOut(fold);
          drawCube(ctx, r.x, r.y, k.s, settle, TILT.x * settle, k.dir * TILT.y * settle, r.a, fade * (1 - fill), true);
        }

        // its spider: braced against the cube's back, stepping in after each turn, then backing off
        const settledX = k.to.x - k.dir * (k.s / 2 + SPIDER_W / 2 - 3);
        const leave = clamp((t - k.land) / SEQ.leave);
        // the spider walks evenly with the distance rolled, a little back from it: the cube's back
        // edge lifts and lags mid-turn, and this keeps the spider just behind it all the way
        const q = clamp((t - k.push) / (k.land - k.push));
        const gap = 0.22 * k.s * easeInOut(Math.min(1, q / 0.2, (1 - q) / 0.2));
        const behind = k.start + k.dir * r.turns * k.s - k.dir * (k.s / 2 + gap + SPIDER_W / 2 - 3);
        const sx = t >= k.land ? settledX - k.dir * 40 * easeOut(leave) : behind;
        // it leans into the push, easing in and out with the roll's speed
        const effort = r.moving ? Math.sin(Math.PI * clamp((t - k.push) / (k.land - k.push))) : 0;
        const lean = k.dir * (3 + 7 * effort) * (t >= k.land ? 1 - easeOut(leave) : 1);
        el.style.opacity = `${fade * (1 - leave)}`;
        el.setAttribute("transform", `translate(${sx} ${floor}) rotate(${lean}) translate(${-SPIDER_W / 2} ${-SPIDER_H + 1})`);
      });

    };

    let t = 0;
    let frame = 0;
    let last = 0;
    let started = false;
    let done = false;
    let onScreen = false;
    let blinkTimer = 0;
    let blinkFrame = 0;
    // after the build: a blink now and then, sometimes the header's double blink
    const blink = () => {
      blinkTimer = 0;
      const double = Math.random() < IDLE.doubles;
      // the double is the header's own two closes (the first third of its keyframes)
      const length = double ? BLINK.duration * 0.34 : IDLE.single;
      const t0 = performance.now();
      const step = (now: number) => {
        const ms = now - t0;
        const p = clamp(ms / length);
        idleLid = double
          ? doubleBlink(BLINK.delay + Math.min(ms, length))
          : p < 0.5
            ? 1 - 0.9 * easeInOut(p * 2)
            : 0.1 + 0.9 * easeInOut((p - 0.5) * 2);
        draw(END);
        if (p < 1) blinkFrame = requestAnimationFrame(step);
        else {
          idleLid = 1;
          blinkFrame = 0;
          draw(END);
          scheduleBlink();
        }
      };
      blinkFrame = requestAnimationFrame(step);
    };
    const scheduleBlink = () => {
      if (!done || !onScreen || document.hidden || reduce.matches || blinkTimer || blinkFrame) return;
      const [lo, hi] = IDLE.every;
      blinkTimer = window.setTimeout(blink, lo + Math.random() * (hi - lo));
    };
    const stopBlink = () => {
      window.clearTimeout(blinkTimer);
      cancelAnimationFrame(blinkFrame);
      blinkTimer = 0;
      blinkFrame = 0;
      if (idleLid !== 1) {
        idleLid = 1;
        if (done) draw(END);
      }
    };
    const tick = (now: number) => {
      t += Math.min(64, now - last);
      last = now;
      draw(t);
      if (t >= END) {
        done = true;
        frame = 0;
        draw(END);
        scheduleBlink();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const go = () => {
      if (!frame && !done && started && onScreen && !document.hidden && pic) {
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
      stopBlink();
      t = 0;
      done = false;
      started = true;
      if (reduce.matches) {
        done = true;
        draw(END);
        return;
      }
      draw(0);
      go();
    };

    fit();
    const resize = new ResizeObserver(() => {
      fit();
      draw(done ? END : t);
    });
    resize.observe(root);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !started) play();
        else if (onScreen) {
          go();
          scheduleBlink();
        } else {
          halt();
          stopBlink(); // nobody's watching: no blinking in the background
        }
      },
      { threshold: 0.4 },
    );
    const onVisibility = () => {
      if (document.hidden) {
        halt();
        stopBlink();
      } else {
        go();
        scheduleBlink();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("roll:replay", play);

    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return; // a torn-down instance (React's dev double-mount) stays down
      pic = paintLockup(PIC_DPR, sans, lineFor(scale));
      tiles = allTiles.filter((k) => inked(pic!.solid, PIC_DPR, k)).map((k) => ({ ...k }));
      schedule(tiles);
      const lastLand = Math.max(...tiles.map((k) => k.land));
      whole = lastLand + SEQ.fold + SEQ.fill;
      blinkAt = whole + SEQ.blinkAfter;
      END = Math.max(blinkAt + BLINK.delay + BLINK.duration, lastLand + SEQ.leave);
      io.observe(root);
      draw(done ? END : t);
    });

    // for checking a frame while developing
    if (process.env.NODE_ENV !== "production") (window as unknown as { __spiderK?: unknown }).__spiderK = {
      atOnce: (ms: number) => tiles.filter((k) => ms >= k.t0 && ms < k.land + SEQ.leave).length,
      seek: (ms: number) => {
        halt();
        stopBlink();
        t = ms;
        draw(ms);
      },
      get tiles() {
        return tiles.length;
      },
      get end() {
        return END;
      },
      get blinkAt() {
        return blinkAt;
      },
      get idle() {
        return { timer: !!blinkTimer, blinking: !!blinkFrame };
      },
    };

    return () => {
      disposed = true;
      halt();
      stopBlink();
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("roll:replay", play);
    };
  }, []);

  return (
    <div className="overflow-hidden border-t border-secondary py-10">
      <div ref={rootRef} data-roll className="relative w-full" aria-label="Spiders roll the pieces of the Spider logo and wordmark into place; the logo blinks." role="img">
        <canvas ref={canvasRef} className="absolute left-0 w-full" />
        <div ref={stageRef} className="pointer-events-none absolute top-0 left-0 origin-top-left" style={{ width: SW, height: SCENE_H }}>
          <svg width={SW} height={SCENE_H} className="absolute inset-0 overflow-visible">
            {allTiles.map((_, i) => (
              <g key={i} data-pusher style={{ opacity: 0 }}>
                <SpiderRig width={SPIDER_W} height={SPIDER_H} className="text-aztec-900" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
