"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";
import { SCENES, type SceneName } from "./asciiScenes";

const RAMP = " .:-=+*#%@";
const CELL_W = 6;
const CELL_H = 10;
const FONT = "500 10px";
// 4×4 ordered dither so tone steps blend instead of banding.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const SETTLED_TIME = 6;

interface AsciiSceneProps {
  scene: SceneName;
  className?: string;
}

/** Renders a scene as a field of code glyphs, shaded with the ramp " .:-=+*#%@". */
export default function AsciiScene({ scene, className }: AsciiSceneProps) {
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
    const font = `${FONT} ${getComputedStyle(canvas).fontFamily}`;
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
      const columns = Math.ceil(width / CELL_W);
      const rows = Math.ceil(height / CELL_H);
      const accents: [number, number][] = [];

      ctx.fillStyle = toneColor;
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = (column + 0.5) * CELL_W;
          const y = (row + 0.5) * CELL_H;
          const tone = shade((x - width / 2) / half, (y - half) / half, t);
          if (tone < 0) continue;
          if (tone > 1) {
            accents.push([x, y]);
            continue;
          }
          const dithered = tone + (BAYER[(row % 4) * 4 + (column % 4)] / 16 - 0.5) / RAMP.length;
          const glyph = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(dithered * RAMP.length)))];
          if (glyph !== " ") ctx.fillText(glyph, x, y);
        }
      }
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
  }, [scene]);

  return (
    <div ref={accentRef} aria-hidden="true" className={cx("absolute inset-0 text-brand-500", className)}>
      <canvas ref={canvasRef} className="size-full font-mono text-aztec-600" />
    </div>
  );
}
