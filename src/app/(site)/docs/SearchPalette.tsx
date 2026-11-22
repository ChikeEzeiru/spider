"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File06, SearchLg } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { cx } from "@/utils/cx";
import { DOCS } from "./docsIndex";
import { loadIndex, search, type DocSection, type SearchHit } from "./docsSearch";

/*
 * The docs' command palette (⌘K). With nothing typed it lists the pages; typing searches every
 * section's text. Arrows move, Enter opens, Esc closes. The panel is solid (DESIGN.md › Surfaces), so
 * nothing dims or blurs behind it; a shadow lifts it off the page instead.
 */

type Item = { key: string; href: string; title: string; detail?: SearchHit["snippet"] };

export default function SearchPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sections, setSections] = useState<DocSection[] | null>(null);
  const [active, setActive] = useState(0);

  // Start building the index as soon as the palette opens.
  useEffect(() => {
    if (open && !sections) loadIndex().then(setSections);
  }, [open, sections]);

  const q = query.trim();
  const items: Item[] = q
    ? (sections ? search(sections, q) : []).map((hit) => ({
        key: `${hit.href}#${hit.id ?? ""}`,
        href: hit.id ? `${hit.href}#${hit.id}` : hit.href,
        title: hit.heading ? `${hit.page} › ${hit.heading.replace(/^\d+\.\s*/, "")}` : hit.page,
        detail: hit.snippet,
      }))
    : DOCS.map((doc) => ({ key: doc.href, href: doc.href, title: doc.label }));
  const current = Math.min(active, Math.max(items.length - 1, 0));

  const close = () => {
    onOpenChange(false);
    setQuery("");
    setActive(0);
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (Math.min(i, items.length - 1) + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      go(items[current].href);
    }
  };

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      isDismissable
      className="fixed inset-0 z-60 flex items-start justify-center px-4 pt-20 sm:pt-28"
    >
      <Modal
        className={cx(
          "w-full max-w-160 overflow-hidden rounded-md border border-secondary bg-primary shadow-xl outline-none",
          "entering:animate-in entering:fade-in entering:zoom-in-95 entering:duration-150 entering:ease-out",
          "exiting:animate-out exiting:fade-out exiting:zoom-out-95 exiting:duration-100 exiting:ease-in",
          "motion-reduce:animate-none",
        )}
      >
        <Dialog aria-label="Search the docs" className="outline-none">
          <label className="flex h-14 items-center gap-3 border-b border-secondary px-4">
            <SearchLg className="size-5 shrink-0 text-fg-quaternary" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search the docs"
              aria-label="Search the docs"
              aria-controls="docs-palette-results"
              className="min-w-0 flex-1 bg-transparent text-md text-primary outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
            />
            <kbd className="rounded-xs border border-secondary px-1.5 py-0.5 font-sans text-xs text-quaternary">Esc</kbd>
          </label>

          <div id="docs-palette-results" aria-live="polite" className="max-h-100 overflow-y-auto p-2">
            <p className="px-3 pt-1 pb-2 text-xs text-quaternary">{q ? "Results" : "Pages"}</p>
            {q && !sections ? (
              <p className="px-3 pb-3 text-sm text-tertiary">Searching the docs…</p>
            ) : items.length ? (
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      onMouseMove={() => setActive(i)}
                      className={cx(
                        "flex items-start gap-3 rounded-sm px-3 py-2.5 transition-colors",
                        i === current ? "bg-tertiary" : null,
                      )}
                    >
                      <File06 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm text-primary">{item.title}</span>
                        {item.detail ? (
                          <span className="line-clamp-2 text-sm text-tertiary">
                            {item.detail.map((part, j) =>
                              part.match ? (
                                <span key={j} className="font-medium text-primary">
                                  {part.text}
                                </span>
                              ) : (
                                part.text
                              ),
                            )}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 pb-3 text-sm text-tertiary">Nothing in the docs matches “{q}”.</p>
            )}
          </div>

          <p className="flex gap-4 border-t border-secondary px-4 py-2.5 text-xs text-quaternary">
            <span>↑↓ to move</span>
            <span>Enter to open</span>
          </p>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
