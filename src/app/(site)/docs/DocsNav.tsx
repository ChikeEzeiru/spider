"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchLg } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { DOC_GROUPS, DOCS } from "./docsIndex";
import SearchPalette from "./SearchPalette";

const linkClass = (active: boolean) =>
  cx(
    "block rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors",
    active ? "bg-tertiary font-medium text-primary" : "text-secondary hover:text-primary",
  );

/**
 * The docs' page list: a grouped sidebar on wide screens, a row of tabs above the page on narrow ones.
 * Search opens a command palette, from the button here or with ⌘K / Ctrl+K anywhere in the docs.
 */
export default function DocsNav() {
  const pathname = usePathname();
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearching((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Narrow screens: search, then the pages as a scrolling row. */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setSearching(true)}
          aria-label="Search docs"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-secondary bg-primary text-fg-quaternary transition-colors hover:text-fg-secondary"
        >
          <SearchLg className="size-4" />
        </button>
        <nav aria-label="Docs" className="scrollbar-hide flex gap-1 overflow-x-auto">
          {DOCS.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={linkClass(pathname === href)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-8 max-lg:hidden">
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-sm border border-secondary bg-primary px-3 text-sm text-placeholder transition-colors hover:border-primary"
        >
          <SearchLg className="size-4 shrink-0 text-fg-quaternary" />
          <span className="flex-1 text-left">Search docs</span>
          <kbd className="font-sans text-xs text-quaternary">⌘K</kbd>
        </button>

        <nav aria-label="Docs" className="flex flex-col gap-6">
          {DOC_GROUPS.map(({ title, pages }) => (
            <div key={title} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-xs text-quaternary">{title}</p>
              {pages.map(({ href, label }) => (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={linkClass(pathname === href)}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <SearchPalette open={searching} onOpenChange={setSearching} />
    </>
  );
}
