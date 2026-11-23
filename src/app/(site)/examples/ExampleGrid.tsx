"use client";

import { useState, type ReactNode } from "react";
import Band, { PAD } from "@/components/page/Band";
import { FilterChip } from "@/components/page/Chip";
import { cx } from "@/utils/cx";

/** The examples, two to a row, filtered by the Spider feature they use. */
export default function ExampleGrid({
  filters,
  items,
  title,
  intro,
  more,
}: {
  filters: string[];
  items: { id: string; features: string[]; card: ReactNode }[];
  title: string;
  intro: string;
  /** Smaller examples listed after the gallery, filtered the same way. */
  more: { id: string; features: string[]; row: ReactNode }[];
}) {
  const [filter, setFilter] = useState("All");
  const matches = (i: { features: string[] }) => filter === "All" || i.features.includes(filter);
  const shown = items.filter(matches);
  const moreShown = more.filter(matches);

  const chips = (
    <div role="group" aria-label="Filter by feature" className="flex flex-wrap gap-2">
      {["All", ...filters].map((f) => (
        <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
          {f}
        </FilterChip>
      ))}
    </div>
  );

  return (
    <>
      {/* Title, intro, then the filters underneath (Figma: Inner — Examples). */}
      <Band as="header" className={cx(PAD, "flex flex-col gap-6 sm:gap-8")}>
        <div className="flex max-w-160 flex-col gap-3 sm:gap-4">
          <h1 className="text-heading-hero font-medium tracking-heading text-primary">{title}</h1>
          <p className="text-md text-pretty text-tertiary sm:text-lg">{intro}</p>
        </div>
        {chips}
      </Band>
      <section className="flex justify-center px-2">
        <ul className="grid w-full max-w-320 grid-cols-1 border-x border-b border-secondary lg:grid-cols-2">
          {shown.map(({ id, card }, i) => (
            <li
              key={id}
              className={cx(
                "flex flex-col",
                i > 0 && "border-t border-secondary",
                i === 1 && "lg:border-t-0",
                i % 2 === 0 && "lg:border-r lg:border-secondary",
              )}
            >
              {card}
            </li>
          ))}
        </ul>
      </section>

      {moreShown.length ? (
        <section className="flex justify-center px-2">
          {/* The side padding sits on the heading and each row, so the list's lines meet the frame. */}
          <div className="flex w-full max-w-320 flex-col gap-8 border-x border-b border-secondary py-12 sm:gap-12 sm:py-18 lg:py-24">
            <h2 className="max-w-240 px-4 text-heading-section sm:px-6 lg:px-8 leading-heading tracking-heading text-pretty text-tertiary">
              <span className="font-medium text-primary">More examples.</span> Smaller apps, each a working starter you can clone
              with one command.
            </h2>
            <ul className="flex flex-col divide-y divide-secondary border-y border-secondary">
              {moreShown.map(({ id, row }) => (
                <li key={id} className="px-4 sm:px-6 lg:px-8">
                  {row}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
