import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/*
 * The building blocks every inner page is made of, in the homepage's own frame:
 * a 1280px bordered column, 16 / 24 / 32px side padding and 48 / 72 / 96px vertical padding
 * (DESIGN.md › Spacing & layout), and the "bold lead, softer follow-on" heading style.
 */

/** A heading in the site's voice: the lead in primary, the rest in tertiary. */
export function Lead({ lead, rest }: { lead: ReactNode; rest?: ReactNode }) {
  return (
    <>
      <span className="font-medium text-primary">{lead}</span>
      {rest ? <> {rest}</> : null}
    </>
  );
}

/** The top of an inner page: an eyebrow, the page's headline, and an optional row of actions. */
export function PageHero({
  eyebrow,
  lead,
  rest,
  children,
}: {
  eyebrow: string;
  lead: ReactNode;
  rest?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col items-start gap-6 border-x border-b border-secondary px-4 py-12 sm:gap-8 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <p className="text-sm text-tertiary sm:text-md">{eyebrow}</p>
        <h1 className="max-w-240 text-heading-hero tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">{lead}</span>
          {/* Phones get the headline alone (DESIGN.md › Typography); the rest returns from sm up. */}
          {rest ? <span className="max-sm:hidden"> {rest}</span> : null}
        </h1>
        {children ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">{children}</div> : null}
      </div>
    </section>
  );
}

/** A section of an inner page, optionally with a heading in the site's voice. */
export function PageSection({
  id,
  lead,
  rest,
  className,
  children,
}: {
  id?: string;
  lead?: ReactNode;
  rest?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-20 justify-center px-2">
      <div
        className={cx(
          "flex w-full max-w-320 flex-col gap-8 border-x border-b border-secondary px-4 py-12 sm:gap-12 sm:px-6 sm:py-18 lg:gap-16 lg:px-8 lg:py-24",
          className,
        )}
      >
        {lead ? (
          <h2 className="max-w-240 text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
            <Lead lead={lead} rest={rest} />
          </h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** Long-form text (legal pages, posts, docs), set in the site's type and colours. */
export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        "prose max-w-180 text-md text-tertiary",
        "prose-headings:font-medium prose-headings:tracking-heading prose-headings:text-primary",
        "prose-h2:mt-12 prose-h2:text-xl prose-h3:text-lg",
        "prose-p:leading-7 prose-li:leading-7 prose-strong:font-medium prose-strong:text-primary",
        "prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4",
        "prose-code:rounded-xs prose-code:bg-aztec-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
