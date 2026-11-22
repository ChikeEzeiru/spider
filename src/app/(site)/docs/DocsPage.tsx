import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { GITHUB_URL } from "@/components/layout/navLinks";
import { Prose } from "@/components/page/PageFrame";
import Toc from "@/components/page/Toc";
import { formatDate } from "@/content/blog";
import { cx } from "@/utils/cx";
import { DOCS, groupOf, type DocLink } from "./docsIndex";

/**
 * A docs page: breadcrumb, title and summary, the page itself, links to the pages either side,
 * and a rail with its contents and when it last changed. The title, each section (from one h2 to the next)
 * and the page links are split by full-width lines.
 */
export default function DocsPage({
  path,
  title,
  summary,
  updated,
  children,
}: {
  /** The page's own URL, which places it in the docs. */
  path: string;
  title: string;
  summary: string;
  /** ISO date the page last changed. */
  updated?: string;
  children: ReactNode;
}) {
  const i = DOCS.findIndex((d) => d.href === path);
  const prev = DOCS[i - 1];
  const next = DOCS[i + 1];

  return (
    <div className="flex">
      <div className="min-w-0 flex-1 border-secondary xl:border-r">
        <header className={cx(SIDE, "flex flex-col gap-3 border-b border-secondary py-10 sm:py-12")}>
          <p className="flex gap-2 text-sm text-tertiary">
            <Link href="/docs" className="transition-colors hover:text-primary">
              Docs
            </Link>
            <span aria-hidden="true" className="text-quaternary">/</span>
            {groupOf(path)}
          </p>
          <h1 className="text-heading-hero font-medium tracking-heading text-pretty text-primary">{title}</h1>
          <p className="max-w-180 text-md text-pretty text-tertiary sm:text-lg">{summary}</p>
        </header>

        <div id="docs-article">
          {sections(children).map((section, i) => (
            <section key={i} className={cx(SIDE, "border-b border-secondary py-10 sm:py-12")}>
              <Prose className="[&>:last-child]:mb-0">{section}</Prose>
            </section>
          ))}
        </div>

        {prev || next ? (
          <nav aria-label="Previous and next pages" className={cx(SIDE, "grid gap-4 py-10 sm:grid-cols-2 sm:py-12")}>
            {prev ? <Pager link={prev} dir="Previous" /> : <span />}
            {next ? <Pager link={next} dir="Next" /> : null}
          </nav>
        ) : null}
      </div>

      <aside className="w-56 shrink-0 px-5 py-12 max-xl:hidden">
        <div className="sticky top-28 flex flex-col gap-6">
          <Toc containerId="docs-article" />
          <div className="-mx-5 flex flex-col gap-2 border-t border-secondary px-5 pt-6 text-sm">
            <a href={GITHUB_URL} className="text-tertiary transition-colors hover:text-primary">
              Edit this page on GitHub
            </a>
            {updated ? (
              <p className="text-quaternary">
                Updated <time dateTime={updated}>{formatDate(updated)}</time>
              </p>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

/** The main column's side padding, shared by the title, each section and the page links. */
const SIDE = "px-4 sm:px-6 lg:px-12";

/** Splits a page's content at each h2, so every section can sit between its own lines. */
function sections(children: ReactNode) {
  const groups: ReactNode[][] = [];
  for (const child of Children.toArray(children)) {
    if (groups.length === 0 || (isValidElement(child) && child.type === "h2")) groups.push([]);
    groups[groups.length - 1].push(child);
  }
  return groups;
}

function Pager({ link, dir }: { link: DocLink; dir: "Previous" | "Next" }) {
  return (
    <Link
      href={link.href}
      className={cx(
        "flex flex-col gap-1 rounded-sm border border-secondary bg-primary px-5 py-4 transition-colors hover:border-primary",
        dir === "Next" && "items-end text-right",
      )}
    >
      <span className="text-xs text-quaternary">{dir}</span>
      <span className="text-md font-medium text-primary">{link.label}</span>
    </Link>
  );
}
