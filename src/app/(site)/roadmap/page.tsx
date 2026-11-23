import type { Metadata } from "next";
import Link from "next/link";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { formatDate } from "@/content/blog";
import { RELEASES } from "@/content/changelog";
import { ROADMAP } from "@/content/roadmap";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Roadmap · Spider",
  description: "What the Spider team is building now, what's planned next, and what has already shipped.",
};

/** In progress and planned work (shared with the About page), then every release so far. */
export default function RoadmapPage() {
  return (
    <>
      <PageTitle
        title="Roadmap"
        intro={
          <>
            What we&apos;re building now, what&apos;s next, and what has shipped. Ideas come from the people building with
            Spider, so{" "}
            <Link href="/discussions" className="text-primary underline underline-offset-4">
              tell us what you need
            </Link>
            .
          </>
        }
      />

      {(["In progress", "Planned"] as const).map((status) => (
        <Band key={status} className="pb-12 sm:pb-18">
          <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">{status}</h2>
          <ul className="flex flex-col divide-y divide-secondary">
            {ROADMAP.filter((item) => item.status === status).map(({ title, body }) => (
              <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
                <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
                <p className="max-w-215 text-md text-pretty text-tertiary">{body}</p>
                <div className="mt-1">
                  {/* Work under way gets the dark pill, as on the About page. */}
                  <span
                    className={cx(
                      "inline-flex rounded-sm px-2 py-0.5 text-xs whitespace-nowrap",
                      status === "In progress" ? "bg-aztec-900 text-aztec-50" : "bg-tertiary text-secondary",
                    )}
                  >
                    {status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Band>
      ))}

      <Band className="pb-12 sm:pb-18">
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Shipped</h2>
        <ul className="flex flex-col divide-y divide-secondary">
          {RELEASES.map(({ version, date, title, changes }) => (
            <li key={version}>
              <Link
                href={`/changelog#v${version}`}
                className="group flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8"
              >
                <time dateTime={date} className="text-sm text-tertiary md:w-40 md:shrink-0">
                  {formatDate(date)}
                </time>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h3 className="text-heading-row font-medium text-pretty text-primary transition-colors group-hover:text-brand-700">
                    {title}
                  </h3>
                  <p className="max-w-215 text-md text-pretty text-tertiary">{changes[0].text}</p>
                  <div className="mt-1">
                    <Tag className="font-mono">v{version}</Tag>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
