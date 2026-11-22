import type { ComponentProps } from "react";
import { cx } from "@/utils/cx";

/**
 * A chip on a solid surface: a filter when it's a button, a tag when it's static.
 * Filters and tags both have 6px corners, the most any tag on the site may round
 * (Figma's tag: 3/8px padding, aztec-600 text).
 */
export function chipClass(active = false, small = false) {
  return cx(
    "inline-flex items-center rounded-md border whitespace-nowrap transition-colors",
    small ? "px-2 py-0.75 text-xs" : "px-3 py-1.5 text-sm",
    active ? "border-aztec-900 bg-aztec-900 text-aztec-50" : "border-secondary bg-primary text-secondary",
  );
}

export function Tag({ className, small = true, ...props }: ComponentProps<"span"> & { small?: boolean }) {
  return <span className={cx(chipClass(false, small), small && "text-aztec-600", className)} {...props} />;
}

export function FilterChip({ active, className, ...props }: ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(chipClass(active), !active && "cursor-pointer hover:border-primary hover:text-primary", className)}
      {...props}
    />
  );
}
