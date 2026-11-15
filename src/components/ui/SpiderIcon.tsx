import Image from "next/image";

const SOURCES = {
  /** Light spider on a dark tile: the default on the light page. */
  dark: "/Logo-dark.svg",
  /** Dark spider on a white tile, for dark surfaces. */
  light: "/Logo-light.svg",
} as const;

interface SpiderIconProps {
  /** Width and height in px; the mark is a square tile. */
  size?: number;
  variant?: keyof typeof SOURCES;
  className?: string;
}

export default function SpiderIcon({ size = 36, variant = "dark", className }: SpiderIconProps) {
  return (
    <Image src={SOURCES[variant]} alt="Spider logo" width={size} height={size} unoptimized className={className} />
  );
}
