"use client";

import { useEffect, useState } from "react";
import { cx } from "@/utils/cx";
import { slug } from "@/utils/slug";
import { useActiveSection } from "./useActiveSection";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * "On this page": a list of the page's sections that marks the one being read.
 * Give it the items, or the id of the element whose h2s it should list (they get ids if they lack them).
 */
export default function Toc({
  items: given,
  containerId,
  label = "On this page",
  className,
}: {
  items?: TocItem[];
  containerId?: string;
  label?: string;
  className?: string;
}) {
  const [found, setFound] = useState<TocItem[]>([]);
  const items = given ?? found;

  // Read the headings from the page when they weren't passed in.
  useEffect(() => {
    if (given || !containerId) return;
    const headings = document.getElementById(containerId)?.querySelectorAll("h2") ?? [];
    const next: TocItem[] = [];
    headings.forEach((h) => {
      const text = h.textContent?.trim() ?? "";
      if (!h.id) h.id = slug(text);
      h.classList.add("scroll-mt-24");
      next.push({ id: h.id, label: text.replace(/^\d+\.\s*/, "") });
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the headings only exist in the DOM
    setFound(next);
  }, [given, containerId]);

  const active = useActiveSection(items.map((i) => i.id));

  if (!items.length) return null;

  return (
    <nav aria-label={label} className={cx("flex flex-col gap-3", className)}>
      <p className="text-xs text-quaternary">{label}</p>
      <ul className="flex flex-col border-l border-secondary">
        {items.map(({ id, label: text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={cx(
                "-ml-px block border-l py-1.5 pl-3 text-sm transition-colors",
                active === id ? "border-aztec-900 text-primary" : "border-transparent text-tertiary hover:text-primary",
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
