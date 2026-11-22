"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Copy07 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/** Ease-out with a long, soft landing: the button settles instead of stopping. */
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

type Label = "idle" | "command" | "copied";

/**
 * A small dark button that copies the command to start from an example.
 * It reads "Copy template" until it's hovered or focused from the keyboard, then widens to show the
 * command it will copy. On touch screens there's no hover, so a tap copies straight away and says so.
 *
 * Motion: the button's width glides between labels (measured, so it lands exactly), while the old
 * label blurs out and the new one blurs in on top of it. The copy icon swaps to a tick the same way.
 * Everything is interruptible, and reduced motion swaps instantly.
 */
export default function CopyTemplate({ template }: { template: string }) {
  const command = `npx spider new --example ${template}`;
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [copied, setCopied] = useState(false);
  const label: Label = copied ? "copied" : hovered || keyboardFocus ? "command" : "idle";

  const text: Record<Label, string> = { idle: "Copy template", command: `Copy ${command}`, copied: "Copied" };

  // Each label's natural width, so the button can animate to it exactly.
  const refs = useRef<Partial<Record<Label, HTMLSpanElement | null>>>({});
  const [widths, setWidths] = useState<Partial<Record<Label, number>>>({});
  useLayoutEffect(() => {
    const measure = () =>
      setWidths({
        idle: refs.current.idle?.offsetWidth,
        command: refs.current.command?.offsetWidth,
        copied: refs.current.copied?.offsetWidth,
      });
    measure();
    // Web fonts can land after the first paint and change the widths.
    document.fonts?.ready.then(measure);
  }, [command]);
  const measured = widths.idle !== undefined;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const glide: CSSProperties = { transitionTimingFunction: EASE };

  return (
    <Button
      size="xs"
      color="dark"
      aria-label={`Copy ${command}`}
      onHoverChange={setHovered}
      onFocus={(e) => setKeyboardFocus((e.target as Element).matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}
      onPress={() => navigator.clipboard.writeText(command).then(() => setCopied(true))}
      iconTrailing={
        <span data-icon="trailing" aria-hidden="true" className="relative">
          {[Copy07, Check].map((Icon, i) => {
            const shown = (i === 1) === copied;
            return (
              <Icon
                key={i}
                strokeWidth={2.25}
                style={glide}
                className={cx(
                  "absolute inset-0 size-full transition-[opacity,scale,filter] duration-300 motion-reduce:transition-none",
                  shown ? "scale-100 opacity-100 blur-none" : "scale-50 opacity-0 blur-xs",
                )}
              />
            );
          })}
        </span>
      }
      className="max-w-full"
    >
      {/* The labels sit on top of each other; this box animates to the width of the one showing. */}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
      <span
        style={{ ...glide, width: measured ? widths[label] : undefined }}
        className="relative block h-5 max-w-full overflow-hidden whitespace-nowrap transition-[width] duration-400 motion-reduce:transition-none"
      >
        {(Object.keys(text) as Label[]).map((key) => {
          const shown = key === label;
          return (
            <span
              key={key}
              ref={(el) => {
                refs.current[key] = el;
              }}
              aria-hidden={!shown}
              style={glide}
              className={cx(
                "top-0 left-0 block transition-[opacity,filter,translate] duration-300 motion-reduce:transition-none",
                // Until the widths are known (first paint), the resting label holds the space.
                !measured && key === "idle" ? "relative" : "absolute",
                shown ? "translate-y-0 opacity-100 blur-none" : "translate-y-1 opacity-0 blur-xs",
              )}
            >
              {text[key]}
            </span>
          );
        })}
      </span>
    </Button>
  );
}
