import type { Metadata } from "next";
import AsciiScene from "@/components/illustrations/AsciiScene";
import { Tag } from "@/components/page/Chip";
import CopyTemplate from "@/components/page/CopyTemplate";
import AppScreenshot from "@/components/sections/examples/AppScreenshots";
import { EXAMPLES, MORE_EXAMPLES } from "@/components/sections/examples/exampleData";
import ExampleGrid from "./ExampleGrid";

export const metadata: Metadata = {
  title: "Examples · Spider",
  description: "Concept products built with Spider: shift planning, inventory, cohort courses and an AI shopping assistant.",
};

// Every feature any example uses, in the order the product tour lists them.
const ORDER = ["Auth", "Routing", "Typed operations", "Jobs", "Email"];
const FILTERS = ORDER.filter((f) => [...EXAMPLES, ...MORE_EXAMPLES].some((e) => e.features.includes(f)));

export default function ExamplesPage() {
  return (
    <ExampleGrid
      title="Examples"
      intro="Concept products built with Spider. Clone one to see how the spec, client and server fit together."
      filters={FILTERS}
      more={MORE_EXAMPLES.map(({ id, template, name, pitch, features }) => ({
        id,
        features,
        row: (
          <div className="grid gap-4 py-6 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="flex flex-col gap-3 lg:col-span-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-primary">{name}</h3>
                <p className="text-md text-pretty text-tertiary">{pitch}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Spider features it uses">
                {features.map((f) => (
                  <li key={f}>
                    <Tag>{f}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <CopyTemplate template={template} />
            </div>
          </div>
        ),
      }))}
      items={EXAMPLES.map(({ id, template, name, pitch, summary, features, url }) => ({
        id,
        features,
        card: (
          <article className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="relative flex h-53 justify-center overflow-hidden rounded-sm bg-aztec-950 px-4 pt-6 md:px-8 lg:h-65">
              <AsciiScene scene="wideWeb" toneClassName="text-aztec-700" />
              <div className="relative flex w-full justify-center">
                <AppScreenshot id={id} url={url} />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-aztec-950" />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-heading-row tracking-heading text-pretty text-tertiary">
                <span className="font-medium text-primary">{name}.</span> {pitch}
              </h2>
              <p className="text-md text-pretty text-tertiary">{summary}</p>
            </div>

            <ul className="flex flex-wrap gap-2" aria-label="Spider features it uses">
              {features.map((f) => (
                <li key={f}>
                  <Tag>{f}</Tag>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <CopyTemplate template={template} />
            </div>
          </article>
        ),
      }))}
    />
  );
}
