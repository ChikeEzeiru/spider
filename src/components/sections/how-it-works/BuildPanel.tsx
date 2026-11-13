"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useStepAnimation } from "./useStepAnimation";

const TARGETS = ["spec", "client", "server"];
const BAR_WIDTH = 10;
const SCRAMBLE = "{}<>/()=;:#*";

const emptyBar = () => `[${"-".repeat(BAR_WIDTH)}]`;

function fillBar(bar: Element) {
  const progress = { filled: 0 };
  return gsap.to(progress, {
    filled: BAR_WIDTH,
    duration: 0.55,
    ease: "power1.inOut",
    onUpdate: () => {
      const done = Math.floor(progress.filled);
      const front = done < BAR_WIDTH ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] : "";
      bar.textContent = `[${"#".repeat(done)}${front}${"-".repeat(BAR_WIDTH - done - front.length)}]`;
    },
  });
}

function build(root: HTMLElement) {
  const lines = root.querySelectorAll("[data-line]");
  const bars = Array.from(root.querySelectorAll("[data-bar]"));
  const oks = root.querySelectorAll("[data-ok]");
  const timeline = gsap.timeline().call(() => bars.forEach((bar) => (bar.textContent = emptyBar())));

  timeline.from(lines[0], { opacity: 0, duration: 0.2 });
  bars.forEach((bar, i) => {
    timeline
      .from(lines[i + 1], { opacity: 0, duration: 0.15 })
      .add(fillBar(bar))
      .from(oks[i], { opacity: 0, duration: 0.15 });
  });
  return timeline
    .from(lines[bars.length + 1], { opacity: 0, duration: 0.2 }, "+=0.2")
    .from(lines[bars.length + 2], { opacity: 0, y: 4, duration: 0.3 }, "+=0.35");
}

/** The build and deploy run in a terminal. */
export default function BuildPanel() {
  const ref = useRef<HTMLDivElement>(null);
  useStepAnimation(ref, build);

  return (
    <div ref={ref} aria-hidden="true" className="flex h-full flex-col justify-center p-3 font-mono text-xs leading-4.5 whitespace-pre text-aztec-600">
      <p data-line>
        <span className="text-aztec-400">$</span> spider build
      </p>
      {TARGETS.map((target) => (
        <p key={target} data-line>
          {"  "}
          {target.padEnd(8)}
          <span data-bar>{emptyBar()}</span>{" "}
          <span data-ok className="text-aztec-900">
            ok
          </span>
        </p>
      ))}
      <p data-line>
        <span className="text-aztec-400">$</span> spider deploy
      </p>
      <p data-line className="font-medium text-brand-600">
        ✓ live → demo.spider.dev
      </p>
    </div>
  );
}
