"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "@untitledui/icons";
import AsciiScene from "@/components/illustrations/AsciiScene";
import AppGraph from "./AppGraph";
import CodePanel from "./CodePanel";
import { FEATURES } from "./featureMapData";

const CYCLE_MS = 5000;

/**
 * A Spider app as a graph over a faint ASCII web. Each feature takes focus in turn, lighting the
 * pages, operations and data it reaches, while the panel shows its spec config and the code it wires to.
 */
export default function FeatureMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const playing = visible && !hovered && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    visibility.observe(root);
    return () => visibility.disconnect();
  }, []);

  // One timer per focus, so the progress bar and the switch stay in step.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % FEATURES.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  const feature = FEATURES[active];

  return (
    <div
      ref={rootRef}
      data-spider-peek
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="relative isolate overflow-hidden rounded-sm bg-aztec-950 p-4 sm:p-6 xl:h-98"
    >
      <AsciiScene scene="web" toneClassName="text-aztec-700" className="-z-10" />

      <div className="flex h-full flex-col gap-6 xl:flex-row xl:justify-between xl:gap-12">
        <div className="flex flex-col gap-6 xl:flex-1">
          <div className="flex items-center gap-1.5 text-xs text-aztec-400">
            <span>lumen</span>
            <ChevronRight className="size-3.5 text-aztec-600" />
            <span className="text-aztec-200">tasks-app</span>
          </div>
          <div className="xl:my-auto">
            <AppGraph feature={feature} />
          </div>
        </div>

        <div className="flex flex-col xl:w-112">
          <CodePanel feature={feature} cycleMs={CYCLE_MS} playing={playing} onSelect={setActive} />
        </div>
      </div>
    </div>
  );
}
