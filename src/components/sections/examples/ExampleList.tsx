"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "@untitledui/icons";
import AsciiScene from "@/components/illustrations/AsciiScene";
import AppScreenshot from "./AppScreenshots";
import { EXAMPLES } from "./exampleData";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Example apps as an accordion: exactly one is open, starting with the first. */
export default function ExampleList() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <ul className="flex flex-col divide-y divide-secondary">
      {EXAMPLES.map(({ id, name, pitch, summary, features, url, href }, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <li key={id} className="px-4 sm:px-6 lg:px-8">
            <div className="group flex items-center gap-5 p-2">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(i)}
                className="flex-1 cursor-pointer py-1.5 text-left text-heading-row leading-heading tracking-heading text-pretty text-tertiary outline-none"
              >
                <span className="text-primary">{name}.</span> {pitch}
              </button>

              {/* The plus turns towards a close mark, then gives way to the open app's source link. */}
              <div className="relative flex h-10 shrink-0 justify-end">
                <AnimatePresence mode="popLayout" initial={false}>
                  {isOpen ? (
                    <motion.a
                      key="source"
                      href={href}
                      initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: 6, filter: "blur(4px)" }}
                      transition={{ duration: 0.28, ease: EASE, delay: 0.08 }}
                      className="flex items-center gap-1 rounded-sm px-3 text-sm font-semibold whitespace-nowrap text-brand-secondary transition-colors hover:bg-tertiary hover:text-brand-secondary_hover"
                    >
                      <span className="sr-only sm:not-sr-only">View source</span>
                      <ArrowUpRight className="size-5 sm:size-4" />
                    </motion.a>
                  ) : (
                    <motion.button
                      key="plus"
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => setOpen(i)}
                      initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="flex size-10 cursor-pointer items-center justify-center rounded-sm text-fg-quaternary transition-colors group-hover:bg-tertiary group-hover:text-fg-secondary"
                    >
                      <Plus className="size-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-4 px-2 pt-1 pb-6">
                    <div className="relative flex justify-center overflow-hidden rounded-sm bg-aztec-950 px-4 pt-6 h-53 md:h-65 md:px-10 lg:h-70 lg:px-20">
                      <AsciiScene scene="wideWeb" toneClassName="text-aztec-700" />
                      <div className="relative flex w-full justify-center">
                        <AppScreenshot id={id} url={url} />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-aztec-950" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="max-w-160 text-md text-tertiary">{summary}</p>
                      <ul className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <li key={feature} className="rounded-sm bg-tertiary px-2 py-0.5 text-xs text-secondary">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
