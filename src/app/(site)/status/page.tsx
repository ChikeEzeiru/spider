import type { Metadata } from "next";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { formatDate } from "@/content/blog";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Status · Spider",
  description: "How Spider's website, docs, starter templates and npm package are running.",
};

/*
 * A concept status page, like the ones open-source projects keep for their public services.
 * The history is fixed data: 90 days to the last check, with the two incidents marked on the days they happened.
 */

const LAST_CHECK = "2026-11-22";
const DAYS = 90;

const INCIDENTS = [
  {
    date: "2026-11-12",
    service: "Docs",
    title: "Docs search was slow",
    body: "While a deploy rebuilt the docs, search took up to ten seconds for some visitors. It was back to normal after 14 minutes.",
  },
  {
    date: "2026-10-28",
    service: "Starter templates",
    title: "Starter template downloads failed",
    body: "npx spider new failed for about 20 minutes while the template archive was unavailable. Downloads now fall back to a mirror.",
  },
];

const SERVICES = [
  { name: "Website", about: "This site, including the blog and changelog.", uptime: "100%" },
  { name: "Docs", about: "The documentation pages and their search.", uptime: "99.99%" },
  { name: "Starter templates", about: "The templates behind npx spider new and every example.", uptime: "99.98%" },
  { name: "npm package", about: "The spider package and CLI on the npm registry.", uptime: "100%" },
];

/** The 90 days up to the last check, oldest first, as ISO dates. */
const days = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(`${LAST_CHECK}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (DAYS - 1 - i));
  return d.toISOString().slice(0, 10);
});

export default function StatusPage() {
  return (
    <>
      <PageTitle
        title="Status"
        intro="How Spider's website, docs, starter templates and npm package are running."
        aside={
          <p className="flex items-center gap-2 text-md text-primary">
            <span aria-hidden="true" className="size-2 rounded-full bg-fg-success-secondary" />
            All systems operational
          </p>
        }
      />

      {/* Each service, with a bar per day for the last 90 days. Rows carry their own padding so the lines meet the frame. */}
      <Band>
        <ul className="divide-y divide-secondary">
          {SERVICES.map(({ name, about, uptime }) => {
            const incidents = INCIDENTS.filter((incident) => incident.service === name);
            return (
              <li key={name} className="flex flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-heading-row tracking-heading text-primary">{name}</h2>
                  <p className="text-md text-tertiary">{about}</p>
                  <div className="mt-1">
                    <Tag className="gap-1.5">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-success-secondary" />
                      Operational
                    </Tag>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <ol aria-label={`${name}: last ${DAYS} days`} className="flex h-8 gap-px sm:gap-0.5">
                    {days.map((day, i) => {
                      const incident = incidents.find((x) => x.date === day);
                      return (
                        <li
                          key={day}
                          title={`${formatDate(day)}: ${incident ? incident.title : "no issues"}`}
                          className={cx(
                            "flex-1 rounded-xs",
                            incident ? "bg-fg-warning-secondary" : "bg-fg-success-secondary",
                            // Phones show the last 45 days, so each day stays wide enough to see.
                            i < DAYS / 2 && "max-sm:hidden",
                          )}
                        >
                          <span className="sr-only">
                            {formatDate(day)}: {incident ? incident.title : "no issues"}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <p className="flex justify-between text-xs text-quaternary">
                    <span>
                      <span className="sm:hidden">45</span>
                      <span className="max-sm:hidden">{DAYS}</span> days ago
                    </span>
                    <span className="text-tertiary">{uptime} uptime</span>
                    <span>Today</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band className="pb-12 sm:pb-18">
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Past incidents</h2>
        <ul className="flex flex-col divide-y divide-secondary">
          {INCIDENTS.map(({ date, service, title, body }) => (
            <li key={date} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8">
              <time dateTime={date} className="text-sm text-tertiary md:w-40 md:shrink-0">
                {formatDate(date)}
              </time>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
                <p className="max-w-215 text-md text-pretty text-tertiary">{body}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Tag>{service}</Tag>
                  <Tag>Resolved</Tag>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
