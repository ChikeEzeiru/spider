"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownRight, File06 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { FEATURES, type Excerpt, type Feature } from "./featureMapData";

const TOKEN = /("[^"]*"|`[^`]*`|\b(?:export|default|async|function|const|await|return|true)\b)/;

/** Minimal highlighting: strings in brand, keywords in the brightest ink. */
function highlight(text: string) {
  return text.split(TOKEN).map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      <span key={i} className={/^["`]/.test(part) ? "text-brand-300" : "text-aztec-50"}>
        {part}
      </span>
    ),
  );
}

function Lines({ start, lines }: Excerpt) {
  return (
    <div className="overflow-x-auto font-mono text-xs leading-5 text-aztec-300">
      {lines.map((text, i) => (
        <div key={i} className="flex whitespace-pre">
          <span className="w-10 shrink-0 pr-4 text-right text-aztec-600 select-none">{start + i}</span>
          <span>{highlight(text)}</span>
        </div>
      ))}
    </div>
  );
}

interface CodePanelProps {
  feature: Feature;
  cycleMs: number;
  playing: boolean;
  onSelect: (index: number) => void;
}

/** The focused feature's config in the spec, and the app code it reaches. */
export default function CodePanel({ feature, cycleMs, playing, onSelect }: CodePanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-sm border border-aztec-800 bg-aztec-900">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-aztec-800 px-4">
        <span className="flex items-center gap-2 font-mono text-xs text-aztec-300">
          <File06 className="size-4 text-aztec-500" />
          {feature.spec.name}
        </span>
        <span className="text-xs text-aztec-500">{feature.name}</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={feature.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-3 py-3"
          >
            <Lines {...feature.spec} />
            <div className="flex items-center gap-2 px-4 font-mono text-xs text-brand-300">
              <CornerDownRight className="size-3.5" />
              {feature.code.name}
            </div>
            <Lines {...feature.code} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex border-t border-aztec-800">
        {FEATURES.map(({ name }, i) => {
          const active = name === feature.name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(i)}
              className={cx(
                "relative flex-1 cursor-pointer py-2.5 text-xs transition-colors outline-none focus-visible:bg-aztec-800",
                active ? "text-aztec-50" : "text-aztec-500 hover:text-aztec-300",
              )}
            >
              {name}
              <span className="absolute inset-x-2 top-0 h-px bg-aztec-800">
                {active && (
                  <motion.span
                    key={`${name}-${playing}`}
                    initial={{ scaleX: playing ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: playing ? cycleMs / 1000 : 0, ease: "linear" }}
                    className="block h-full origin-left bg-brand-400"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
