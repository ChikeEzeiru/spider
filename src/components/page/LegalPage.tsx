import type { ReactNode } from "react";
import Link from "next/link";
import { formatDate } from "@/content/blog";
import { cx } from "@/utils/cx";
import { slug } from "@/utils/slug";
import { Prose } from "./PageFrame";
import Toc from "./Toc";

const DOCUMENTS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/security", label: "Security" },
  { href: "/license", label: "License" },
];

/**
 * A legal document: a sidebar to switch between the documents and jump between sections,
 * and the document itself in numbered sections.
 */
export default function LegalPage({
  path,
  title,
  updated,
  sections,
}: {
  path: string;
  title: string;
  /** ISO date the document last changed. */
  updated?: string;
  sections: { title: string; body: ReactNode }[];
}) {
  const items = sections.map((s) => ({ id: slug(s.title), label: s.title }));

  return (
    <div className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary lg:flex-row">
        <aside className="border-b border-secondary px-4 py-4 sm:px-6 lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-5 lg:py-12">
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            <nav aria-label="Legal" className="scrollbar-hide flex gap-1 overflow-x-auto lg:flex-col">
              <p className="px-3 pb-1 text-xs text-quaternary max-lg:hidden">Legal</p>
              {DOCUMENTS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                  className={cx(
                    "block rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    path === href ? "bg-tertiary font-medium text-primary" : "text-secondary hover:text-primary",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Toc items={items} className="px-3 max-lg:hidden" />
          </div>
        </aside>

        <article className="min-w-0 flex-1">
          {/* The title sits in its own block, ruled off from the document (Figma: Inner — Legal). */}
          <header className="flex flex-col gap-3 border-b border-secondary px-4 py-12 sm:px-6 sm:py-14 lg:px-12">
            <h1 className="text-heading-hero font-medium tracking-heading text-primary">{title}</h1>
            {updated ? (
              <p className="text-sm text-tertiary">
                Last updated <time dateTime={updated}>{formatDate(updated)}</time>
              </p>
            ) : null}
          </header>

          <ol className="flex max-w-196 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:px-12">
            {sections.map(({ title: heading, body }, i) => (
              <li key={heading} className="flex gap-4 sm:gap-6">
                <span className="w-4 shrink-0 pt-1 text-sm text-quaternary">{i + 1}</span>
                <section className="flex min-w-0 flex-col gap-3">
                  <h2 id={slug(heading)} className="scroll-mt-18 text-lg font-medium text-primary">
                    {heading}
                  </h2>
                  <Prose className="prose-p:my-0 prose-ul:my-0 [&>*+*]:mt-4">{body}</Prose>
                </section>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}
