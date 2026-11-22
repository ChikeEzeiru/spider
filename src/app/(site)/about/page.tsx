import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Band, { PAD } from "@/components/page/Band";
import Stripes from "@/components/page/Stripes";
import { LATEST, RELEASES } from "@/content/changelog";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "About · Spider",
  description: "Why Spider exists and how it's built.",
};

const PRINCIPLES = [
  {
    title: "One source of truth",
    body: "The spec declares what the app is. Your code says how it behaves.",
  },
  {
    title: "Your code, your stack",
    body: "Pages are React, server code is Node.js, data is Prisma. Nothing is locked inside the framework.",
  },
  {
    title: "Types across the wire",
    body: "A server function becomes a typed hook. If the server changes, the client knows before you deploy.",
  },
  {
    title: "Calm defaults",
    body: "Sensible choices out of the box, and an extension point when you need something else.",
  },
];

const NOT = [
  {
    title: "Not a hosting platform",
    body: "Spider builds a Node.js server and a static client. Run them on Fly, Railway or any host you already use.",
  },
  {
    title: "Not low-code",
    body: "The spec describes structure. Everything your users see and every rule your app follows is code you write.",
  },
  {
    title: "Not a new stack to learn",
    body: "If you know React, Node.js and Prisma, you already know most of Spider. The spec is the only new part.",
  },
];

const ROADMAP = [
  {
    status: "In progress",
    title: "Live queries",
    body: "Queries that push updates to the page when their entities change, without polling.",
  },
  {
    status: "In progress",
    title: "File uploads",
    body: "Declare an upload in the spec and get signed URLs, size limits and storage on S3 or R2.",
  },
  {
    status: "Planned",
    title: "Testing helpers",
    body: "Call operations in tests with a fake user and a throwaway database.",
  },
  {
    status: "Planned",
    title: "More deploy targets",
    body: "spider deploy for Render and a Docker image for everything else.",
  },
  {
    status: "Planned",
    title: "1.0",
    body: "A stable spec format, with migration guides for anything that changes before then.",
  },
];

const first = RELEASES[RELEASES.length - 1];
const since = new Date(`${first.date}T00:00:00Z`).toLocaleDateString("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const STATS = [
  { value: "MIT", label: "License" },
  {
    value: `v${LATEST.version.split(".").slice(0, 2).join(".")}`,
    label: "Latest release",
  },
  { value: String(RELEASES.length), label: `Releases since ${since}` },
];

/**
 * A row of the page: its label in the margin, its content beside it. The opening row sits on open ground;
 * the rest rule the label column off with a line, and their content fills the space beside it edge to edge,
 * so grids of cells can share borders with the frame (Figma: Inner — About).
 */
function Row({ label, heading, children }: { label: string; heading?: boolean; children: ReactNode }) {
  const Label = heading ? "h1" : "h2";
  if (heading) {
    return (
      <Band className={cx(PAD, "flex flex-col gap-6 lg:flex-row lg:gap-12")}>
        <Label className="shrink-0 text-sm text-tertiary sm:text-md lg:w-60 lg:pt-2">{label}</Label>
        <div className="min-w-0 flex-1">{children}</div>
      </Band>
    );
  }
  return (
    <Band className="flex flex-col lg:flex-row">
      <Label className="shrink-0 border-secondary px-4 pt-12 pb-6 text-sm text-tertiary sm:px-6 sm:pt-14 sm:text-md lg:w-80 lg:border-r lg:px-8 lg:py-14">
        {label}
      </Label>
      <div className="min-w-0 flex-1 border-secondary max-lg:border-t">{children}</div>
    </Band>
  );
}

/** Padding for a cell beside the label column. */
const CELL = "px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14";

export default function AboutPage() {
  return (
    <>
      <Row label="About" heading>
        <p className="max-w-220 text-heading-hero tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">
            Spider exists so a small team can ship a full-stack app without assembling one first.
          </span>{" "}
          <span className="max-sm:hidden">
            Routing, auth, typed operations, jobs and email are declared once in a spec, and wired into a React and
            Node.js app you own.
          </span>
        </p>
      </Row>

      <Row label="Why we built it">
        <div className={cx(CELL, "flex max-w-220 flex-col gap-4 text-md text-pretty text-tertiary sm:text-lg")}>
          <p>
            Every full-stack project we started began the same way: a week of choosing and connecting a router, an auth
            library, an API layer, a job queue and an email provider. By the time the first real feature shipped, the
            app was already held together by glue code that nobody wanted to touch.
          </p>
          <p>
            Most of that glue says the same thing twice. The server defines an endpoint and the client describes it
            again; the database has a model and the API repeats its shape. Spider starts from one description of the app
            and generates the repetition, so the code you write is only the code that makes your product different.
          </p>
        </div>
      </Row>

      <Row label="Principles">
        <ol className="grid sm:grid-cols-2">
          {PRINCIPLES.map(({ title, body }, i) => (
            <li
              key={title}
              className={cx(
                CELL,
                "flex flex-col gap-3 border-secondary",
                i > 0 && "max-sm:border-t",
                i >= 2 && "sm:border-t",
                i % 2 === 1 && "sm:border-l",
              )}
            >
              <span className="font-mono text-xs text-quaternary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-heading-row tracking-heading text-primary">{title}</h3>
              <p className="text-md text-pretty text-tertiary">{body}</p>
            </li>
          ))}
        </ol>
      </Row>

      <Stripes />

      <Row label="What it isn't">
        <ul className="flex flex-col divide-y divide-secondary">
          {NOT.map(({ title, body }) => (
            <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-8 lg:px-12">
              <h3 className="text-lg font-medium text-primary">{title}</h3>
              <p className="text-md text-pretty text-tertiary">{body}</p>
            </li>
          ))}
        </ul>
      </Row>

      <Stripes />

      <Row label="Roadmap">
        {/* Every item is as tall as the tallest, so the list reads as an even ladder. */}
        <ol className="grid auto-rows-fr divide-y divide-secondary">
          {ROADMAP.map(({ status, title, body }) => (
            <li
              key={title}
              className="grid content-center gap-2 px-4 py-5 sm:grid-cols-12 sm:gap-6 sm:px-6 lg:px-12"
            >
              <h3 className="text-md font-medium text-primary sm:col-span-3">{title}</h3>
              <div className="flex flex-col items-start gap-3 sm:col-span-9">
                <p className="text-md text-pretty text-tertiary">{body}</p>
                {/* Work under way gets the dark pill (like "Latest" on the changelog); planned work stays grey. */}
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
        </ol>
      </Row>

      <Row label="Open source">
        <div className="flex flex-col">
          <div className={cx(CELL, "flex flex-col gap-6")}>
            <p className="max-w-200 text-md text-pretty text-tertiary sm:text-lg">
              Spider is released under the{" "}
              <Link href="/license" className="text-primary underline underline-offset-4">
                MIT License
              </Link>
              . Its roadmap is shaped by the people building with it. If something gets in your way,{" "}
              <Link href="/contact" className="text-primary underline underline-offset-4">
                tell us
              </Link>
              .
            </p>
            <p className="max-w-200 text-md text-pretty text-tertiary">
              The easiest ways to help: build something and tell us where Spider got in your way, answer a question in
              Discussions, or pick up an issue labelled &ldquo;good first issue&rdquo;. Every pull request gets a reply.
            </p>
          </div>
          <dl className="grid grid-cols-3 border-y border-secondary">
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className={cx(
                  "flex flex-col-reverse gap-1 border-secondary px-4 py-6 sm:px-6 lg:px-12 lg:py-8",
                  i > 0 && "border-l",
                )}
              >
                <dt className="text-sm text-tertiary">{label}</dt>
                <dd className="text-heading-section tracking-heading text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          {/* An empty strip under the figures, as in the design. */}
          <div aria-hidden="true" className="h-12 max-sm:hidden" />
        </div>
      </Row>
    </>
  );
}
