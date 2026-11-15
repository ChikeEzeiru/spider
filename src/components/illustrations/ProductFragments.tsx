"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

function useEntrance(build: (root: HTMLElement) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => build(root), root);
    return () => ctx.revert();
  }, [build]);
  return ref;
}

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-72 overflow-hidden rounded-sm border border-secondary bg-primary font-mono text-xs shadow-xs">
      <div className="flex items-center gap-1.5 border-b border-secondary bg-secondary px-3 py-2">
        <span className="size-2 rounded-full bg-aztec-300" />
        <span className="size-2 rounded-full bg-aztec-300" />
        <span className="size-2 rounded-full bg-aztec-300" />
        <span className="ml-2 text-aztec-500">{title}</span>
      </div>
      {children}
    </div>
  );
}

const SPEC_LINES: ReactNode[] = [
  <>
    <b className="font-medium text-aztec-900">export default</b> app({"{"}
  </>,
  <>
    {"  "}auth: [<span className="text-brand-600">&quot;email&quot;</span>, <span className="text-brand-600">&quot;github&quot;</span>],
  </>,
  <>
    {"  "}routes: {"{"} <span className="text-brand-600">&quot;/&quot;</span>: Home {"}"},
  </>,
  <>
    {"  "}jobs: {"{"} digest: <span className="text-brand-600">&quot;@weekly&quot;</span> {"}"},
  </>,
  <>{"});"}</>,
];

const specEntrance = (root: HTMLElement) => {
  gsap
    .timeline({ delay: 0.5 })
    .from(root.querySelectorAll("[data-row]"), { opacity: 0, x: -4, duration: 0.25, stagger: 0.18 })
    .fromTo(root.querySelector("[data-caret]"), { opacity: 0 }, { opacity: 1, duration: 0.45, repeat: -1, yoyo: true, ease: "steps(1)" });
};

export function SpecFragment() {
  const ref = useEntrance(specEntrance);
  return (
    <div ref={ref}>
      <Window title="spider.config.ts">
        <div className="py-2 leading-5 whitespace-pre text-aztec-600">
          {SPEC_LINES.map((line, i) => (
            <div key={i} data-row className="flex">
              <span className="w-8 shrink-0 pr-3 text-right text-aztec-300">{i + 1}</span>
              <span>
                {line}
                {i === SPEC_LINES.length - 1 && (
                  <span data-caret className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-aztec-900" />
                )}
              </span>
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}

const WIRES = [
  { from: "routes", to: "<Dashboard/>" },
  { from: "operations", to: "getTasks()" },
  { from: "entities", to: "Task" },
];

const wiringEntrance = (root: HTMLElement) => {
  gsap
    .timeline({ delay: 0.5 })
    .from(root.querySelectorAll("[data-row]"), { opacity: 0, duration: 0.25, stagger: 0.15 })
    .from(root.querySelectorAll("[data-wire]"), { scaleX: 0, transformOrigin: "0 50%", duration: 0.4, stagger: 0.3 })
    .from(root.querySelectorAll("[data-linked]"), { opacity: 0, scale: 0.4, duration: 0.25, stagger: 0.3 }, "<0.3");
};

export function WiringFragment() {
  const ref = useEntrance(wiringEntrance);
  return (
    <div ref={ref}>
      <Window title="Wiring">
        <div className="flex flex-col gap-2 p-3">
          {WIRES.map(({ from, to }) => (
            <div key={from} data-row className="flex items-center gap-2">
              <span className="w-20 text-aztec-600">{from}</span>
              <span data-wire className="h-px flex-1 bg-aztec-300" />
              <span className="relative size-2 rounded-full bg-aztec-300">
                <span data-linked className="absolute inset-0 rounded-full bg-brand-500" />
              </span>
              <span className="w-24 text-aztec-900">{to}</span>
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}

const DEPLOYS = [
  { name: "main", status: "live", dot: "bg-success-solid" },
  { name: "pr-42", status: "preview", dot: "bg-brand-500" },
  { name: "pr-43", status: "building", dot: "bg-aztec-300" },
];

const deployEntrance = (root: HTMLElement) => {
  gsap
    .timeline({ delay: 0.5 })
    .from(root.querySelectorAll("[data-row]"), { opacity: 0, y: 4, duration: 0.25, stagger: 0.15 })
    .fromTo(
      root.querySelector("[data-progress]"),
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "0 50%", duration: 2.2, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 },
    );
};

export function DeployFragment() {
  const ref = useEntrance(deployEntrance);
  return (
    <div ref={ref}>
      <Window title="Deployments">
        <div className="flex flex-col divide-y divide-secondary">
          {DEPLOYS.map(({ name, status, dot }) => (
            <div key={name} data-row className="flex items-center gap-2 px-3 py-2">
              <span className={`size-2 rounded-full ${dot}`} />
              <span className="w-14 text-aztec-900">{name}</span>
              <span className="w-16 text-aztec-500">{status}</span>
              {status === "building" ? (
                <span className="h-1 flex-1 overflow-hidden bg-aztec-200">
                  <span data-progress className="block h-full bg-aztec-600" />
                </span>
              ) : (
                <span className="flex-1 text-right text-aztec-400">{status === "live" ? "2m" : "now"}</span>
              )}
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}
