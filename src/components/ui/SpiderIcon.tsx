"use client";

import { useId } from "react";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/cx";

/*
 * The logo, drawn inline from public/Logo-dark.svg / Logo-light.svg so its eyes can blink.
 * The tile crops a large spider peeking up from the bottom edge.
 */

const VARIANTS = {
  /** Light spider on a dark tile: the default on the light page. */
  dark: { tile: "#1C211F", spider: "#F9FAFA" },
  /** Dark spider on a white tile, for dark surfaces. */
  light: { tile: "#FFFFFF", spider: "#1C211F" },
} as const;

const LEGS = [
  "M32.3452 17.821L35.7028 7.94577L39.0604 34.4113",
  "M23.6551 17.821L20.2975 7.94577L16.9399 34.4113",
  "M35.5054 21.7711L41.0355 12.6859L48.5407 34.4113",
  "M20.4948 21.7711L14.9646 12.6859L7.45947 34.4113",
  "M37.4805 24.1411L45.3806 8.34077L57.6259 34.4113",
  "M18.5199 24.1411L10.6198 8.34077L-1.62549 34.4113",
];
const BODY =
  "M28.0002 36.9789C34.3267 36.9789 39.4554 31.7618 39.4554 25.3262C39.4554 18.8905 34.3267 13.6734 28.0002 13.6734C21.6736 13.6734 16.5449 18.8905 16.5449 25.3262C16.5449 31.7618 21.6736 36.9789 28.0002 36.9789Z";
const EYES = [
  "M24.84 27.4987C26.258 27.4987 27.4076 25.9955 27.4076 24.1411C27.4076 22.2868 26.258 20.7836 24.84 20.7836C23.422 20.7836 22.2725 22.2868 22.2725 24.1411C22.2725 25.9955 23.422 27.4987 24.84 27.4987Z",
  "M31.1603 27.4987C32.5784 27.4987 33.7279 25.9955 33.7279 24.1411C33.7279 22.2868 32.5784 20.7836 31.1603 20.7836C29.7423 20.7836 28.5928 22.2868 28.5928 24.1411C28.5928 25.9955 29.7423 27.4987 31.1603 27.4987Z",
];

interface SpiderIconProps {
  /** Width and height in px; the mark is a square tile. */
  size?: number;
  variant?: keyof typeof VARIANTS;
  /** Blink once when the page loads or changes, as if the spider just noticed you. */
  blink?: boolean;
  className?: string;
}

export default function SpiderIcon({ size = 36, variant = "dark", blink = false, className }: SpiderIconProps) {
  const { tile, spider } = VARIANTS[variant];
  const clipId = useId();
  const pathname = usePathname();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      role="img"
      aria-label="Spider logo"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="36" height="36" rx="6" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="36" height="36" fill={tile} />
        <g stroke={spider} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          {LEGS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d={BODY} fill={spider} />
        {/* Keyed on the route so a page change replays the blink. */}
        <g
          key={blink ? pathname : undefined}
          fill={tile}
          className={cx(blink && "origin-center transform-fill motion-safe:animate-blink")}
        >
          {EYES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
