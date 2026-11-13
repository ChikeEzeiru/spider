"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useStepAnimation } from "./useStepAnimation";

// Drawn in a fixed 300×176 box that scales to fit the panel.
const VIEW_W = 300;
const VIEW_H = 176;
const NODE_W = 100;
const NODE_H = 24;
const SPEC_X = 6;
const APP_X = VIEW_W - SPEC_X - NODE_W;
const ROWS_Y = [44, 92, 140];

const SPEC_NODES = ["routes", "operations", "entities"];
const APP_NODES = ["<Dashboard/>", "getTasks()", "Task"];
// [spec row, app row]
const LINKS: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 2],
];

const silkPath = ([from, to]: [number, number]) => {
  const startX = SPEC_X + NODE_W;
  const middleX = (startX + APP_X) / 2;
  return `M ${startX} ${ROWS_Y[from]} C ${middleX} ${ROWS_Y[from]}, ${middleX} ${ROWS_Y[to]}, ${APP_X} ${ROWS_Y[to]}`;
};

function build(root: HTMLElement) {
  return gsap
    .timeline()
    .from(root.querySelectorAll('[data-part="spec"]'), { opacity: 0, x: -6, duration: 0.3, stagger: 0.12 })
    .from(root.querySelectorAll("[data-silk]"), {
      strokeDashoffset: 1,
      duration: 0.55,
      stagger: 0.14,
      ease: "power1.inOut",
    })
    .from(root.querySelectorAll('[data-part="app"]'), { opacity: 0, x: 6, duration: 0.3, stagger: 0.14 }, "-=0.5")
    .from(root.querySelectorAll("[data-linked]"), { opacity: 0, duration: 0.3, stagger: 0.14 }, "-=0.2");
}

function Node({ x, y, label, part }: { x: number; y: number; label: string; part: "spec" | "app" }) {
  const box = { x, y: y - NODE_H / 2, width: NODE_W, height: NODE_H, rx: 4 };
  return (
    <g data-part={part}>
      <rect {...box} className="fill-white stroke-aztec-300" />
      {part === "app" && <rect data-linked {...box} className="fill-none stroke-brand-500" />}
      <text
        x={x + NODE_W / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={part === "app" ? "fill-aztec-900" : "fill-aztec-600"}
      >
        {label}
      </text>
    </g>
  );
}

/** The spec wired to the app code by silk threads. */
export default function ConnectPanel() {
  const ref = useRef<HTMLDivElement>(null);
  useStepAnimation(ref, build);

  return (
    <div ref={ref} aria-hidden="true" className="flex size-full items-center justify-center p-3">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="size-full font-mono text-xs">
        <text x={SPEC_X} y={12} className="fill-aztec-400">
          spec
        </text>
        <text x={APP_X} y={12} className="fill-aztec-400">
          app
        </text>

        {LINKS.map((link) => (
          <path
            key={link.join("-")}
            data-silk
            d={silkPath(link)}
            pathLength={1}
            strokeDasharray={1}
            className="fill-none stroke-aztec-400"
          />
        ))}

        {SPEC_NODES.map((label, row) => (
          <Node key={label} part="spec" x={SPEC_X} y={ROWS_Y[row]} label={label} />
        ))}
        {APP_NODES.map((label, row) => (
          <Node key={label} part="app" x={APP_X} y={ROWS_Y[row]} label={label} />
        ))}
      </svg>
    </div>
  );
}
