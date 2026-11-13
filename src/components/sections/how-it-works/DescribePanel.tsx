"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useStepAnimation } from "./useStepAnimation";

type Tone = "plain" | "keyword" | "string" | "comment";
type Token = [text: string, tone?: Tone];

const TONE: Record<Tone, string> = {
  plain: "text-aztec-600",
  keyword: "font-medium text-aztec-900",
  string: "text-brand-600",
  comment: "text-aztec-400",
};

const SPEC: Token[][] = [
  [["// spider.config.ts", "comment"]],
  [["export default", "keyword"], [" app({"]],
  [["  auth: ["], ['"email"', "string"], [", "], ['"github"', "string"], ["],"]],
  [["  routes: {"]],
  [["    "], ['"/"', "string"], [": Home,"]],
  [["    "], ['"/dashboard"', "string"], [": Dashboard,"]],
  [["  },"]],
  [["  jobs: { sendDigest: "], ['"@weekly"', "string"], [" },"]],
  [["});"]],
];

function build(root: HTMLElement) {
  return gsap
    .timeline()
    .from(root.querySelectorAll("[data-char]"), { opacity: 0, duration: 0.01, stagger: 0.012, ease: "none" })
    .fromTo(
      root.querySelector("[data-caret]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.4, repeat: 5, yoyo: true, ease: "steps(1)" },
    );
}

/** The spec file typing itself out. */
export default function DescribePanel() {
  const ref = useRef<HTMLPreElement>(null);
  useStepAnimation(ref, build);

  return (
    <pre ref={ref} aria-hidden="true" className="flex h-full flex-col justify-center p-3 font-mono text-xs leading-4.5">
      {SPEC.map((line, row) => (
        <div key={row}>
          {line.map(([text, tone = "plain"], i) => (
            <span key={i} className={TONE[tone]}>
              {[...text].map((char, c) => (
                <span key={c} data-char>
                  {char}
                </span>
              ))}
            </span>
          ))}
          {row === SPEC.length - 1 && (
            <span data-caret className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-aztec-900" />
          )}
        </div>
      ))}
    </pre>
  );
}
