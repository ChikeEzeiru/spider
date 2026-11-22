import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/*
 * The site's frame for inner pages: a full-width band holding the 1280px bordered column.
 * Each page arranges its own content inside it; PAD is the standard section padding
 * (DESIGN.md › Spacing & layout).
 */

export const PAD = "px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-24";

export default function Band({
  as: Tag = "section",
  id,
  className,
  children,
}: {
  as?: "section" | "div" | "header" | "article";
  id?: string;
  /** Classes for the bordered column. */
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Tag id={id} className="flex scroll-mt-20 justify-center px-2">
      <div className={cx("w-full max-w-320 border-x border-b border-secondary", className)}>{children}</div>
    </Tag>
  );
}

/** The top of a listing page: its name, a sentence about it, and any filters or tags beneath it. */
export function PageTitle({
  title,
  intro,
  aside,
  className,
}: {
  title: string;
  intro: ReactNode;
  aside?: ReactNode;
  /** Overrides for the band, e.g. to run straight into the next section without a line. */
  className?: string;
}) {
  return (
    <Band as="header" className={cx(PAD, "flex flex-col gap-6 sm:gap-8", className)}>
      <div className="flex max-w-160 flex-col gap-3 sm:gap-4">
        <h1 className="text-heading-hero font-medium tracking-heading text-primary">{title}</h1>
        <p className="text-md text-pretty text-tertiary sm:text-lg">{intro}</p>
      </div>
      {aside}
    </Band>
  );
}
