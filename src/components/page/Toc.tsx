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
 * "On this page": a list of the page's sections that marks the one being read. Clicking a section
 * glides the page to its heading (an instant jump with reduced motion).
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
      h.classList.add("scroll-mt-18");
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
              onClick={(e) => glideTo(e, id)}
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

/** Glides to a section and updates the address, the way the link would have. Modified clicks behave as normal. */
function glideTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  history.replaceState(null, "", `#${id}`);

  // Land the heading below the sticky header, where its scroll-margin says it should sit.
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const to = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
  glide(to);
}

let stop: (() => void) | null = null;

/**
 * An eased scroll written by hand, so it behaves the same in every browser. Longer distances take
 * a little longer (400–900ms); it eases in and out, stops the moment the reader scrolls or presses a
 * key, and jumps straight there with reduced motion.
 */
function glide(to: number) {
  stop?.();
  const from = window.scrollY;
  const distance = to - from;
  if (Math.abs(distance) < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, to);
    return;
  }

  const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.35));
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const start = performance.now();
  let frame = 0;

  const cancel = () => {
    cancelAnimationFrame(frame);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((type) => window.removeEventListener(type, cancel));
    stop = null;
  };
  ["wheel", "touchstart", "keydown", "mousedown"].forEach((type) => window.addEventListener(type, cancel, { passive: true }));
  stop = cancel;

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + distance * ease(t));
    if (t < 1) frame = requestAnimationFrame(step);
    else cancel();
  };
  frame = requestAnimationFrame(step);
}
