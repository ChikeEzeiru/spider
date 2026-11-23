import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { slug } from "@/utils/slug";
import Band, { PAD } from "./Band";
import { Prose } from "./PageFrame";
import Toc from "./Toc";

/*
 * A long-form page (contributing guide, migration guides, a tutorial), laid out like a blog post:
 * a header band, then a sticky contents list beside the sections. Each section's heading gets an id,
 * so the contents links glide to it.
 */

// The margin column (back link, contents) and the reading column, shared by the header and body.
const MARGIN = "lg:w-64 lg:shrink-0";
const COLUMN = "w-full max-w-170 min-w-0";

export interface GuideSection {
  title: string;
  body: ReactNode;
}

export default function GuidePage({
  title,
  intro,
  meta,
  back,
  sections,
  after,
}: {
  title: string;
  intro: ReactNode;
  /** A short line above the title, like a date or "Tutorial · 15 min". */
  meta?: ReactNode;
  /** A link back to the listing this page belongs to. */
  back?: { href: string; label: string };
  sections: GuideSection[];
  /** Anything after the sections, inside the reading column. */
  after?: ReactNode;
}) {
  const items = sections.map((s) => ({ id: slug(s.title), label: s.title }));

  return (
    <article>
      <Band as="header" className={cx(PAD, "flex flex-col gap-8 lg:flex-row lg:gap-12")}>
        <div className={MARGIN}>
          {back ? (
            <Link href={back.href} className="flex w-fit items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary">
              <ArrowLeft className="size-4" />
              {back.label}
            </Link>
          ) : null}
        </div>
        <div className={cx(COLUMN, "flex flex-col gap-4 sm:gap-6")}>
          {meta ? <p className="flex flex-wrap gap-2 text-sm text-tertiary">{meta}</p> : null}
          <h1 className="text-heading-hero font-medium tracking-heading text-pretty text-primary">{title}</h1>
          <div className="text-md text-pretty text-tertiary sm:text-lg">{intro}</div>
        </div>
      </Band>

      <Band className={cx(PAD, "flex flex-col gap-8 lg:flex-row lg:gap-12")}>
        <aside className={cx(MARGIN, "max-lg:hidden")}>
          <Toc items={items} className="sticky top-28" />
        </aside>
        <Prose className={cx(COLUMN, "[&>:last-child]:mb-0")}>
          {sections.map(({ title: heading, body }, i) => (
            <section key={heading}>
              <h2 id={slug(heading)} className={cx("scroll-mt-24", i === 0 && "mt-0")}>
                {heading}
              </h2>
              {body}
            </section>
          ))}
          {after}
        </Prose>
      </Band>
    </article>
  );
}
