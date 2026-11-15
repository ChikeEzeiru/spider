"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle, PuzzlePiece01 } from "@untitledui/icons";
import AsciiScene from "@/components/illustrations/AsciiScene";
import { cx } from "@/utils/cx";
import { DEFAULT_PICKS, NEEDS, type Verdict } from "./needsData";

// Calm, on-brand tones: built in reads as green, an extension point as a neutral "plug this in".
const VERDICTS: Record<Verdict, { label: string; icon: typeof Check; className: string }> = {
  supported: { label: "Supported", icon: CheckCircle, className: "bg-green-500/15 text-green-400" },
  extension: { label: "Via extension", icon: PuzzlePiece01, className: "bg-celeste-500/20 text-celeste-300" },
};

/** Visitors pick what their app needs and see how Spider meets each one. */
export default function NeedsChecker() {
  const [picked, setPicked] = useState<string[]>(DEFAULT_PICKS);
  const toggle = (id: string) => setPicked((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const results = NEEDS.filter((need) => picked.includes(need.id));

  return (
    <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-sm bg-aztec-950 p-4 sm:p-6 lg:h-98 lg:flex-row lg:gap-8">
      <AsciiScene scene="web" toneClassName="text-aztec-700" className="-z-10" />

      <div className="flex shrink-0 flex-col gap-4 lg:w-80">
        <span className="text-sm text-aztec-200">What does your app need?</span>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map(({ id, label }) => {
            const on = picked.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(id)}
                className={cx(
                  "flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs transition-colors outline-none focus-visible:border-aztec-300",
                  on
                    ? "border-brand-400 bg-aztec-800 text-aztec-50"
                    : "border-aztec-800 bg-aztec-900 text-aztec-400 hover:border-aztec-600 hover:text-aztec-200",
                )}
              >
                {on && <Check className="size-3.5 text-brand-400" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-80 flex-col overflow-hidden rounded-sm border border-aztec-800 bg-aztec-900 lg:h-auto lg:flex-1">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-aztec-800 px-4 text-xs">
          <span className="text-aztec-300">Will Spider fit?</span>
          <span className="text-aztec-500" aria-live="polite">
            {results.length} checked
          </span>
        </div>
        <ul className="flex flex-col overflow-y-auto">
          <AnimatePresence initial={false}>
            {results.map(({ id, label, verdict, note, code }) => {
              const { label: verdictLabel, icon: Icon, className } = VERDICTS[verdict];
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0 overflow-hidden border-b border-aztec-800"
                >
                  <div className="flex flex-col gap-1.5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-aztec-50">{label}</span>
                      <span className={cx("flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-xs", className)}>
                        <Icon className="size-3.5" />
                        {verdictLabel}
                      </span>
                    </div>
                    <span className="text-xs text-aztec-400">{note}</span>
                    {code && <code className="truncate font-mono text-xs text-aztec-300">{code}</code>}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {!results.length && <li className="px-4 py-6 text-xs text-aztec-500">Pick a few needs to check them.</li>}
        </ul>
      </div>
    </div>
  );
}
