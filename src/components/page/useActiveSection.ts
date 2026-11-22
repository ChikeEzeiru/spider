"use client";

import { useEffect, useState } from "react";

/** The id of the section being read: the last one whose top has passed a line just below the header. */
export function useActiveSection(ids: string[], line = 140) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    const list = key ? key.split(" ") : [];
    if (!list.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < line) current = id;
      }
      setActive(current);
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
  }, [key, line]);

  return active;
}
