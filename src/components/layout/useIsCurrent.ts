"use client";

import { usePathname } from "next/navigation";

/** Whether a nav link points at the page being viewed, or a section it contains (/blog covers /blog/a-post). */
export function useIsCurrent() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}
