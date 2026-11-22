import type { ReactNode } from "react";
import { PageHero, Prose } from "./PageFrame";

/** A page that's mostly text (About, Legal): its hero, then the text in one framed section. */
export default function TextPage({
  eyebrow,
  lead,
  rest,
  updated,
  children,
}: {
  eyebrow: string;
  lead: string;
  rest?: string;
  /** ISO date the text was last changed, shown above it. */
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} lead={lead} rest={rest} />
      <section className="flex justify-center px-2">
        <div className="flex w-full max-w-320 flex-col gap-6 border-x border-b border-secondary px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
          {updated ? (
            <p className="text-sm text-quaternary">
              Last updated{" "}
              <time dateTime={updated}>
                {new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
              </time>
            </p>
          ) : null}
          <Prose>{children}</Prose>
        </div>
      </section>
    </>
  );
}
