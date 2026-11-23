import type { Metadata } from "next";
import Link from "next/link";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { TUTORIALS } from "@/content/tutorials";

export const metadata: Metadata = {
  title: "Tutorials · Spider",
  description: "Step-by-step guides to building, extending and deploying a Spider app.",
};

/** Every tutorial as a row: its level and length, title, summary, and the features it touches. */
export default function TutorialsPage() {
  return (
    <>
      <PageTitle
        title="Tutorials"
        intro="Step-by-step guides that take one feature from an empty file to working code. Each one takes under half an hour."
      />
      <Band className="pb-12 sm:pb-18">
        <ul className="flex flex-col divide-y divide-secondary">
          {TUTORIALS.map(({ slug, title, summary, level, minutes, features }) => (
            <li key={slug}>
              <Link
                href={`/tutorials/${slug}`}
                className="group flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8"
              >
                <p className="text-sm text-tertiary md:w-40 md:shrink-0">
                  {level} · {minutes} min
                </p>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h2 className="text-heading-row font-medium text-pretty text-primary transition-colors group-hover:text-brand-700">
                    {title}
                  </h2>
                  <p className="max-w-215 text-md text-pretty text-tertiary">{summary}</p>
                  <ul className="mt-1 flex flex-wrap gap-2" aria-label="Spider features it covers">
                    {features.map((f) => (
                      <li key={f}>
                        <Tag>{f}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
