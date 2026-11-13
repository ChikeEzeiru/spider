"use client";

import { useEffect, useRef } from "react";

/*
 * The hero's dot grid, redrawn as code glyphs that keep rewriting themselves.
 * Ripples ("build pulses") run through it now and then, the pointer stirs it, and any
 * element marked data-ascii-pulse sends a ripple out when hovered.
 */

// The Figma dot grid (a 1280px square, centred, shifted up 280px) at twice its density,
// so every original dot position is still a cell.
const ARTBOARD = 1280;
const ARTBOARD_TOP = -280;
const COLUMNS = 49;
const ROWS = 43;
const EDGE_INSET = 2.57;
const STEP_X = (ARTBOARD - EDGE_INSET * 2) / (COLUMNS - 1);
const STEP_Y = (ARTBOARD - EDGE_INSET * 2) / (ROWS - 1);

// Structural characters of code appear twice as often as the rest.
const STRUCTURAL = "{}<>/()=;:";
const GLYPHS = [...STRUCTURAL, ...STRUCTURAL, ..."[]*+-|&_.,#$@!?~\\"];
const FONT_SIZE = 12;

const IDLE_FLIPS_PER_SECOND = 0.12;
const HOT_FLIPS_PER_SECOND = 18;
const COOLING_PER_SECOND = 1.6;

const PULSE_SPEED = 420;
const PULSE_BAND = 70;
const PULSE_LIFETIME = 2.6;
const PULSE_INTERVAL: [number, number] = [2.5, 5];

const POINTER_RADIUS = 130;

interface Cell {
  x: number;
  y: number;
  glyph: string;
  heat: number;
}

interface Pulse {
  x: number;
  y: number;
  age: number;
}

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const randomBetween = ([min, max]: [number, number]) => min + Math.random() * (max - min);

export default function AsciiGrid() {
  const accentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const accentHolder = accentRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !accentHolder || !ctx) return;

    // Colours and font come from Tailwind tokens on the two elements.
    const canvasStyle = getComputedStyle(canvas);
    const baseColor = canvasStyle.color;
    const accentColor = getComputedStyle(accentHolder).color;
    const font = `500 ${FONT_SIZE}px ${canvasStyle.fontFamily}`;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cells: Cell[] = [];
    const pulses: Pulse[] = [];
    const pointer = { x: 0, y: 0, strength: 0 };
    let width = 0;
    let height = 0;

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const left = (width - ARTBOARD) / 2 + EDGE_INSET;
      const top = ARTBOARD_TOP + EDGE_INSET;
      cells = [];
      for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
          const x = left + column * STEP_X;
          const y = top + row * STEP_Y;
          if (x < -FONT_SIZE || x > width + FONT_SIZE || y < -FONT_SIZE || y > height + FONT_SIZE) continue;
          cells.push({ x, y, glyph: randomGlyph(), heat: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const cell of cells) {
        ctx.globalAlpha = 1 - cell.heat;
        ctx.fillStyle = baseColor;
        ctx.fillText(cell.glyph, cell.x, cell.y);
        if (cell.heat > 0.01) {
          ctx.globalAlpha = cell.heat;
          ctx.fillStyle = accentColor;
          ctx.fillText(cell.glyph, cell.x, cell.y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const pulseAt = (x: number, y: number) => pulses.push({ x, y, age: 0 });

    const heatFor = (cell: Cell) => {
      let heat = 0;
      for (const pulse of pulses) {
        const distance = Math.hypot(cell.x - pulse.x, cell.y - pulse.y);
        const fromFront = Math.abs(distance - pulse.age * PULSE_SPEED);
        const fade = 1 - pulse.age / PULSE_LIFETIME;
        heat = Math.max(heat, Math.max(0, 1 - fromFront / PULSE_BAND) * fade);
      }
      if (pointer.strength > 0) {
        const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
        heat = Math.max(heat, Math.max(0, 1 - distance / POINTER_RADIUS) * pointer.strength);
      }
      return heat;
    };

    const step = (dt: number) => {
      for (const pulse of pulses) pulse.age += dt;
      while (pulses.length && pulses[0].age > PULSE_LIFETIME) pulses.shift();
      pointer.strength = Math.max(0, pointer.strength - dt * 1.5);

      for (const cell of cells) {
        cell.heat = Math.max(heatFor(cell), cell.heat - dt * COOLING_PER_SECOND);
        const flipsPerSecond = IDLE_FLIPS_PER_SECOND + cell.heat * HOT_FLIPS_PER_SECOND;
        if (Math.random() < flipsPerSecond * dt) cell.glyph = randomGlyph();
      }
    };

    layout();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw();
    });
    resizeObserver.observe(canvas);
    if (reducedMotion) return () => resizeObserver.disconnect();

    let frame = 0;
    let last = 0;
    let visible = true;
    let nextPulse = randomBetween(PULSE_INTERVAL) / 2;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      nextPulse -= dt;
      if (nextPulse <= 0 && cells.length) {
        const origin = cells[Math.floor(Math.random() * cells.length)];
        pulseAt(origin.x, origin.y);
        nextPulse = randomBetween(PULSE_INTERVAL);
      }
      step(dt);
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const toCanvas = (clientX: number, clientY: number) => {
      const box = canvas.getBoundingClientRect();
      return { x: clientX - box.left, y: clientY - box.top, inside: clientY >= box.top && clientY <= box.bottom };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!visible) return;
      const point = toCanvas(event.clientX, event.clientY);
      if (!point.inside) return;
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.strength = 1;
    };

    const onPulseSourceEnter = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const source = target.closest("[data-ascii-pulse]");
      if (!source || source.contains(event.relatedTarget as Node | null)) return;
      const box = source.getBoundingClientRect();
      const point = toCanvas(box.left + box.width / 2, box.top + box.height / 2);
      pulseAt(point.x, point.y);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPulseSourceEnter);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPulseSourceEnter);
    };
  }, []);

  return (
    <div ref={accentRef} aria-hidden="true" className="absolute inset-0 text-aztec-500">
      <canvas ref={canvasRef} className="size-full font-mono text-aztec-300" />
    </div>
  );
}
