/**
 * The first thing a keyboard user reaches: a link past the header to the page itself.
 * Hidden until focused, then a solid dark chip in the top-left corner, above the sticky header.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-sm bg-aztec-900 px-3 py-2 text-sm font-medium text-aztec-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
    >
      Skip to content
    </a>
  );
}
