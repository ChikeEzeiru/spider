"use client";

import Link from "next/link";
import { cx } from "@/utils/cx";
import { NAV_LINKS } from "./navLinks";
import { useIsCurrent } from "./useIsCurrent";

/**
 * The header's links: body-text grey, with the page you're on in the heading colour and medium weight.
 * Each label reserves its medium-weight width up front, so a link turning medium never nudges its neighbours.
 */
export default function DesktopNav() {
  const isCurrent = useIsCurrent();

  return (
    <nav aria-label="Main" className="hidden h-full gap-2 p-2 md:flex">
      {NAV_LINKS.map(({ label, href }) => {
        const current = isCurrent(href);
        return (
          <Link
            key={label}
            href={href}
            aria-current={current ? "page" : undefined}
            className={cx(
              "flex items-center px-2 text-md transition-colors hover:text-primary",
              current ? "text-primary" : "text-tertiary",
            )}
          >
            <WeightSafeLabel label={label} current={current} />
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The label sits in a one-cell grid with an invisible medium-weight copy of itself.
 * The cell is always as wide as the medium copy, so the link's width is the same in both states.
 */
function WeightSafeLabel({ label, current }: { label: string; current: boolean }) {
  return (
    <span className="grid justify-items-center">
      <span className={cx("col-start-1 row-start-1", current && "font-medium")}>{label}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-medium select-none">
        {label}
      </span>
    </span>
  );
}
