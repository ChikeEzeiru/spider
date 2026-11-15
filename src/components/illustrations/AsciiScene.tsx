"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";
import { SCENES, type SceneName } from "./asciiScenes";

const RAMP = " .:-=+*#%@";
// Tonal scenes keep to symbols (letters would read as words) with a few more steps.
const TONAL_RAMP = " .,:;-~=+*o#%@";
// Glyph cells: the default grid, and a finer one for tonal scenes where shading carries the form.
const GRID = {
  glyph: { cellW: 6, cellH: 10, font: "500 10px" },
  tonal: { cellW: 5, cellH: 8, font: "500 8px" },
};
// Tonal mode also maps tone to brightness, quantised so each level is one canvas state change.
const ALPHA_LEVELS = 10;
const MIN_ALPHA = 0.16;
// 4×4 ordered dither so tone steps blend instead of banding.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const SETTLED_TIME = 6;

interface AsciiSceneProps {
  scene: SceneName;
  className?: string;
  /** Glyph colour; accents always use the brand colour. */
  toneClassName?: string;
  /** Brightness follows tone as well as glyph density, on a finer grid. For light glyphs on dark. */
  tonal?: boolean;
}

/** Renders a scene as a field of code glyphs, shaded with the ramp " .:-=+*#%@". */
export default function AsciiScene({
  scene,
  className,
  toneClassName = "text-aztec-600",
  tonal = false,
}: AsciiSceneProps) {
  const accentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const accentHolder = accentRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !accentHolder || !ctx) return;

    const shade = SCENES[scene];
    const toneColor = getComputedStyle(canvas).color;
    const accentColor = getComputedStyle(accentHolder).color;
    const { cellW, cellH, font: fontSpec } = GRID[tonal ? "tonal" : "glyph"];
    const ramp = tonal ? TONAL_RAMP : RAMP;
    const font = `${fontSpec} ${getComputedStyle(canvas).fontFamily}`;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const half = height / 2;
      const columns = Math.ceil(width / cellW);
      const rows = Math.ceil(height / cellH);
      const accents: [number, number][] = [];
      const levels: [string, number, number][][] = Array.from({ length: ALPHA_LEVELS + 1 }, () => []);

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = (column + 0.5) * cellW;
          const y = (row + 0.5) * cellH;
          const tone = shade((x - width / 2) / half, (y - half) / half, t);
          if (tone < 0) continue;
          if (tone > 1) {
            accents.push([x, y]);
            continue;
          }
          const dithered = tone + (BAYER[(row % 4) * 4 + (column % 4)] / 16 - 0.5) / ramp.length;
          const glyph = ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(dithered * ramp.length)))];
          if (glyph === " ") continue;
          levels[tonal ? Math.round(tone * ALPHA_LEVELS) : ALPHA_LEVELS].push([glyph, x, y]);
        }
      }

      ctx.fillStyle = toneColor;
      levels.forEach((cells, level) => {
        if (!cells.length) return;
        ctx.globalAlpha = MIN_ALPHA + (1 - MIN_ALPHA) * (level / ALPHA_LEVELS);
        for (const [glyph, x, y] of cells) ctx.fillText(glyph, x, y);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = accentColor;
      for (const [x, y] of accents) ctx.fillText("#", x, y);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(SETTLED_TIME);
      return () => resizeObserver.disconnect();
    }

    // Scene time only advances while visible, and restarts when the spider lands here.
    let frame = 0;
    let time = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last) time += (now - last) / 1000;
      last = now;
      draw(time);
      frame = requestAnimationFrame(tick);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) frame = requestAnimationFrame(tick);
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    });
    visibility.observe(canvas);

    const perch = canvas.closest("[data-spider-perch]");
    const landing = new MutationObserver(() => {
      if (perch?.hasAttribute("data-spider-on")) time = 0;
    });
    if (perch) landing.observe(perch, { attributes: true, attributeFilter: ["data-spider-on"] });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      landing.disconnect();
    };
  }, [scene, tonal]);

  return (
    <div ref={accentRef} aria-hidden="true" className={cx("absolute inset-0 text-brand-500", className)}>
      <canvas ref={canvasRef} className={cx("size-full font-mono", toneClassName)} />
    </div>
  );
}
