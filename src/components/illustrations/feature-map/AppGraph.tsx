"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cx } from "@/utils/cx";
import { EDGES, NODES, type Feature } from "./featureMapData";

/** Straight silk from one node's facing edge to its neighbour's. */
function edgePath(a: DOMRect, b: DOMRect, origin: DOMRect) {
  const sameRow = Math.abs(a.top - b.top) < 1;
  const [first, second] = sameRow ? (a.left < b.left ? [a, b] : [b, a]) : a.top < b.top ? [a, b] : [b, a];
  const x1 = (sameRow ? first.right : first.left + first.width / 2) - origin.left;
  const y1 = (sameRow ? first.top + first.height / 2 : first.bottom) - origin.top;
  const x2 = (sameRow ? second.left : second.left + second.width / 2) - origin.left;
  const y2 = (sameRow ? second.top + second.height / 2 : second.top) - origin.top;
  return `M${x1} ${y1} L${x2} ${y2}`;
}

interface AppGraphProps {
  feature: Feature;
}

/** The app as its spec describes it: features as nodes, wired to what they reach. */
export default function AppGraph({ feature }: AppGraphProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const origin = grid.getBoundingClientRect();
      const rect = (id: string) => grid.querySelector(`[data-node="${id}"]`)!.getBoundingClientRect();
      setPaths(EDGES.map(([a, b]) => edgePath(rect(a), rect(b), origin)));
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(grid);
    return () => resize.disconnect();
  }, []);

  const reached = (id: string) => feature.reach.includes(id as Feature["focus"]);

  return (
    <div ref={gridRef} className="relative grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-12 sm:gap-y-8">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {paths.map((d, i) => {
          const live = EDGES[i].every(reached);
          return (
            <path
              key={i}
              d={d}
              strokeDasharray={live ? undefined : "2 4"}
              className={cx("fill-none transition-colors duration-500", live ? "stroke-brand-400" : "stroke-aztec-700")}
            />
          );
        })}
      </svg>
      {paths.map((d, i) =>
        EDGES[i].every(reached) ? (
          <span
            key={`${feature.name}-${i}`}
            aria-hidden="true"
            style={{ offsetPath: `path("${d}")` }}
            className="pointer-events-none absolute top-0 left-0 size-1.5 animate-bead rounded-full bg-brand-300 motion-reduce:hidden"
          />
        ) : null,
      )}

      {NODES.map(({ id, name, kind, tag, icon: Icon, cell }) => {
        const state = id === feature.focus ? "focus" : reached(id) ? "reached" : "idle";
        return (
          <div
            key={id}
            data-node={id}
            className={cx(
              "relative flex items-center gap-2.5 rounded-sm border bg-aztec-900 px-2.5 py-2.5 sm:px-3 transition duration-500",
              cell,
              state === "focus" && "border-brand-400/70 ring-4 ring-brand-500/15",
              state === "reached" && "border-aztec-600",
              state === "idle" && "border-aztec-800 opacity-80",
            )}
          >
            <Icon
              className={cx(
                "hidden size-4 shrink-0 transition-colors duration-500 sm:block",
                state === "focus" ? "text-brand-300" : "text-aztec-400",
              )}
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs text-aztec-50 sm:text-sm">{name}</span>
              <span className="hidden truncate text-xs text-aztec-400 sm:block">{kind}</span>
            </div>
            <span
              className={cx(
                "ml-auto hidden shrink-0 rounded-xs px-1.5 py-0.5 font-mono text-xs transition-colors duration-500 lg:block",
                state === "focus" ? "bg-brand-500/15 text-brand-300" : "bg-aztec-800 text-aztec-300",
              )}
            >
              {tag}
            </span>
          </div>
        );
      })}
    </div>
  );
}
