"use client";

import { cx } from "@/utils/cx";
import { useActiveSection } from "@/components/page/useActiveSection";

/** The feature tour's index: every part, numbered, with the one being read marked. */
export default function ProductIndex({ parts }: { parts: { id: string; title: string }[] }) {
  const active = useActiveSection(parts.map((p) => p.id), 360);
  return (
    <nav aria-label="Parts of Spider">
      <ol className="flex flex-col gap-1">
        {parts.map(({ id, title }, i) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={cx(
                "flex items-baseline gap-3 rounded-sm py-1.5 text-sm transition-colors",
                active === id ? "text-primary" : "text-tertiary hover:text-primary",
              )}
            >
              <span className={cx("font-mono text-xs", active === id ? "text-brand-600" : "text-quaternary")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
