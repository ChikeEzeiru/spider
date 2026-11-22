"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchLg } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { DOC_GROUPS, DOCS } from "./docsIndex";

const linkClass = (active: boolean) =>
  cx(
    "block rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors",
    active ? "bg-tertiary font-medium text-primary" : "text-secondary hover:text-primary",
  );

/** The docs' page list: a filterable, grouped sidebar on wide screens, a row of tabs above the page on narrow ones. */
export default function DocsNav() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K jumps to the filter, the way most docs sites open search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const groups = DOC_GROUPS.map((g) => ({ ...g, pages: g.pages.filter((p) => p.label.toLowerCase().includes(q)) })).filter(
    (g) => g.pages.length,
  );

  return (
    <>
      {/* Narrow screens: the pages as a scrolling row. */}
      <nav aria-label="Docs" className="flex gap-1 overflow-x-auto lg:hidden">
        {DOCS.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={linkClass(pathname === href)}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-8 max-lg:hidden">
        <label className="flex h-10 items-center gap-2 rounded-sm border border-secondary bg-primary px-3 text-sm transition-colors focus-within:border-primary">
          <SearchLg className="size-4 shrink-0 text-fg-quaternary" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs"
            aria-label="Search docs"
            className="min-w-0 flex-1 bg-transparent text-primary outline-none placeholder:text-placeholder"
          />
          <kbd className="font-sans text-xs text-quaternary">⌘K</kbd>
        </label>

        <nav aria-label="Docs" className="flex flex-col gap-6">
          {groups.map(({ title, pages }) => (
            <div key={title} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-xs text-quaternary">{title}</p>
              {pages.map(({ href, label }) => (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={linkClass(pathname === href)}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          {groups.length ? null : <p className="px-3 text-sm text-tertiary">No pages match “{query}”.</p>}
        </nav>
      </div>
    </>
  );
}
