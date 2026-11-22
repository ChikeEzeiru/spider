"use client";

import { useEffect, useRef } from "react";

/*
 * A strand of silk down the release list. As you scroll, it spins out in the brand colour,
 * and each release's knot lights up when the strand reaches it. The strand follows the
 * scroll position directly, so it moves continuously with the page (DESIGN.md › Motion).
 */
export default function SilkThread() {
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = track.current?.parentElement;
    if (!list || !fill.current) return;
    const knots = Array.from(list.querySelectorAll<HTMLElement>("[data-knot]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const box = list.getBoundingClientRect();
      const line = window.innerHeight * 0.45;
      const reached = Math.min(Math.max(line - box.top, 0), box.height);
      fill.current!.style.transform = `scaleY(${box.height ? reached / box.height : 0})`;
      for (const knot of knots) {
        const at = knot.getBoundingClientRect().top - box.top;
        knot.toggleAttribute("data-reached", at <= reached);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={track} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-8 w-px bg-aztec-200 max-lg:hidden">
      <div ref={fill} className="absolute inset-0 origin-top bg-brand-600" style={{ transform: "scaleY(0)" }} />
    </div>
  );
}
