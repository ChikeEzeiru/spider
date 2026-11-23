import type { Metadata } from "next";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { formatDate } from "@/content/blog";

export const metadata: Metadata = {
  title: "Events · Spider",
  description: "Community calls, workshops and meetups for people building with Spider.",
};

interface Event {
  date: string;
  time: string;
  title: string;
  about: string;
  where: "Online" | "In person";
  kind: string;
}

const UPCOMING: Event[] = [
  {
    date: "2026-12-03",
    time: "17:00 UTC",
    title: "Community call: December",
    about: "The team walks through what shipped in November, demos live queries, and answers questions from the chat.",
    where: "Online",
    kind: "Community call",
  },
  {
    date: "2026-12-10",
    time: "15:00 UTC",
    title: "Workshop: from npx spider new to production",
    about: "A two-hour guided build. You'll create an app, add GitHub sign-in and a scheduled job, and deploy it to Fly.",
    where: "Online",
    kind: "Workshop",
  },
  {
    date: "2027-01-21",
    time: "18:30 WAT",
    title: "Full-stack TypeScript night, Lagos",
    about: "Three short talks from teams shipping Spider apps in production, then food and time to talk.",
    where: "In person",
    kind: "Meetup",
  },
];

const PAST: Event[] = [
  {
    date: "2026-11-05",
    time: "17:00 UTC",
    title: "Community call: Spider 0.4",
    about: "Queued jobs, retries and Railway deploys, with a look at how runs are claimed from the database.",
    where: "Online",
    kind: "Community call",
  },
  {
    date: "2026-10-15",
    time: "16:00 UTC",
    title: "Live build: a cohort course app",
    about: "Building the Courseyard example from scratch in 90 minutes, mistakes included.",
    where: "Online",
    kind: "Live stream",
  },
  {
    date: "2026-08-19",
    time: "17:00 UTC",
    title: "Spider launch stream",
    about: "The first public release, a tour of the spec, and the questions people asked most in the first week.",
    where: "Online",
    kind: "Live stream",
  },
];

/** Upcoming events, then past ones, each as a dated row. */
export default function EventsPage() {
  return (
    <>
      <PageTitle
        title="Events"
        intro="Community calls, workshops and meetups for people building with Spider. Online events are free and recorded."
      />
      <EventList label="Upcoming" events={UPCOMING} />
      <EventList label="Past" events={PAST} />
    </>
  );
}

function EventList({ label, events }: { label: string; events: Event[] }) {
  return (
    <Band className="pb-12 sm:pb-18">
      <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">{label}</h2>
      <ul className="flex flex-col divide-y divide-secondary">
        {events.map(({ date, time, title, about, where, kind }) => (
          <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8">
            <p className="flex flex-col text-sm text-tertiary md:w-40 md:shrink-0">
              <time dateTime={date}>{formatDate(date)}</time>
              <span className="text-quaternary">{time}</span>
            </p>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
              <p className="max-w-215 text-md text-pretty text-tertiary">{about}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Tag>{kind}</Tag>
                <Tag>{where}</Tag>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Band>
  );
}
