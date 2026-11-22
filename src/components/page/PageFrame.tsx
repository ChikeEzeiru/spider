import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/** Long-form text (legal pages, posts, docs), set in the site's type and colours. */
export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        "prose max-w-180 text-md text-tertiary",
        "prose-headings:font-medium prose-headings:tracking-heading prose-headings:text-primary",
        "prose-h2:mt-12 prose-h2:text-xl prose-h3:text-lg",
        "prose-p:leading-7 prose-li:leading-7 prose-strong:font-medium prose-strong:text-primary",
        "prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4",
        "prose-code:rounded-xs prose-code:bg-aztec-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
