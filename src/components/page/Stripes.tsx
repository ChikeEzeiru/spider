import Band from "./Band";

/** A 24px band of slanted hairlines that separates one part of a page from the next (Figma: "STRIPED SECTION"). */
export default function Stripes() {
  return (
    <Band as="div" className="h-6 bg-stripes" />
  );
}
