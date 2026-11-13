"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Builds a paused timeline for a step illustration and plays it when the panel first
 * scrolls into view, then again every time the spider lands on the panel.
 * `build` must be stable (define it at module level).
 */
export function useStepAnimation(
  ref: RefObject<HTMLElement | null>,
  build: (root: HTMLElement) => gsap.core.Timeline,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let timeline: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      timeline = build(root).pause(0);
    }, root);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeline?.progress(1);
      return () => ctx.revert();
    }

    const play = () => timeline?.restart();

    const inView = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        inView.disconnect();
      },
      { threshold: 0.6 },
    );
    inView.observe(root);

    const perch = root.closest("[data-spider-perch]");
    const landing = new MutationObserver(() => {
      if (perch?.hasAttribute("data-spider-on")) play();
    });
    if (perch) landing.observe(perch, { attributes: true, attributeFilter: ["data-spider-on"] });

    return () => {
      inView.disconnect();
      landing.disconnect();
      ctx.revert();
    };
  }, [ref, build]);
}
