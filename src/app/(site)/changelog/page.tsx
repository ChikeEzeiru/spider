import type { Metadata } from "next";
import { Rss01 } from "@untitledui/icons";
import Band, { PAD, PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import CodeBlock from "@/components/page/CodeBlock";
import { formatDate } from "@/content/blog";
import { LATEST, RELEASES } from "@/content/changelog";
import { cx } from "@/utils/cx";
import SilkThread from "./SilkThread";

export const metadata: Metadata = {
  title: "Changelog · Spider",
  description: "What's new in each Spider release.",
  alternates: { types: { "application/rss+xml": "/changelog/rss.xml" } },
};

export default function ChangelogPage() {
  return (
    <>
      <PageTitle
        title="Changelog"
        intro="Every Spider release, newest first."
        aside={
          <div className="flex items-center gap-4">
            <a href="/changelog/rss.xml" className="flex items-center gap-1.5 text-sm text-tertiary transition-colors hover:text-primary">
              <Rss01 className="size-4" />
              Subscribe via RSS
            </a>
            <a href={`#v${LATEST.version}`}>
              <Tag small={false}>Latest: v{LATEST.version}</Tag>
            </a>
          </div>
        }
      />

      <Band as="div" className="relative">
        <SilkThread />
        <ol className="divide-y divide-secondary">
          {RELEASES.map(({ version, date, title, changes, code }) => (
            <li key={version} id={`v${version}`} className={cx(PAD, "flex scroll-mt-20 flex-col gap-6 lg:flex-row lg:gap-12")}>
              {/* The version stays beside its release while you read it. */}
              <div className="relative flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 self-start lg:sticky lg:top-28 lg:w-60 lg:flex-col lg:items-start lg:pl-6">
                {/* The knot where the silk thread passes this release. */}
                <span
                  data-knot
                  aria-hidden="true"
                  className="absolute top-2.5 -left-1 size-2 rounded-full border border-aztec-300 bg-primary transition-colors duration-300 data-reached:border-brand-600 data-reached:bg-brand-600 max-lg:hidden"
                >
                  {version === LATEST.version ? (
                    <span className="absolute -inset-1 rounded-full bg-brand-200 motion-safe:animate-ping" />
                  ) : null}
                </span>
                <p className="font-mono text-heading-row text-primary">v{version}</p>
                <time dateTime={date} className="text-sm text-tertiary">
                  {formatDate(date)}
                </time>
                {version === LATEST.version ? (
                  <span className="rounded-sm bg-aztec-900 px-2 py-0.5 text-xs text-aztec-50">Latest</span>
                ) : null}
              </div>

              <div className="flex max-w-180 min-w-0 flex-1 flex-col gap-6">
                <h2 className="text-heading-row tracking-heading text-pretty text-primary">{title}</h2>
                <ul className="flex flex-col gap-3">
                  {changes.map(({ kind, text }) => {
                    // Only the latest release calls anything "New"; on older ones the same changes read "Updated".
                    const label = kind === "New" && version !== LATEST.version ? "Updated" : kind;
                    return (
                      <li key={text} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                        <span
                          className={cx(
                            "w-22 shrink-0 pt-1 font-mono text-xs",
                            label === "New" ? "text-punch-600" : "text-tertiary",
                          )}
                        >
                          {label}
                        </span>
                        <span className="text-md text-pretty text-tertiary">{text}</span>
                      </li>
                    );
                  })}
                </ul>
                {code ? <CodeBlock name={code.name} lines={code.lines} /> : null}
              </div>
            </li>
          ))}
        </ol>
      </Band>
    </>
  );
}
