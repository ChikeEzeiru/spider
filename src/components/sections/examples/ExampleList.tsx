"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { EXAMPLES } from "./exampleData";

/** Example apps as an accordion; one opens at a time. */
export default function ExampleList() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <ul className="flex flex-col divide-y divide-secondary">
      {EXAMPLES.map(({ name, pitch, summary, features, href }, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <li key={name}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full cursor-pointer items-center gap-5 p-2 text-left outline-none"
            >
              <span className="flex-1 py-1.5 text-xl leading-heading tracking-heading text-pretty text-tertiary sm:text-display-xs">
                <span className="text-primary">{name}.</span> {pitch}
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm text-fg-quaternary transition-colors group-hover:bg-tertiary group-hover:text-fg-secondary group-focus-visible:bg-tertiary">
                <Plus className={cx("size-5 transition-transform duration-300", isOpen && "rotate-45")} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-4 px-2 pt-1 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
                    <div className="flex max-w-160 flex-col gap-4">
                      <p className="text-md text-tertiary">{summary}</p>
                      <ul className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <li key={feature} className="rounded-sm bg-tertiary px-2 py-0.5 text-xs text-secondary">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={href}
                      className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                    >
                      View source
                      <ArrowUpRight className="size-4" />
                    </a>
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
