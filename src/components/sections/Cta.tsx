import { BookClosed } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import AsciiGrid from "@/components/ui/AsciiGrid";

export default function Cta() {
  return (
    <section data-spider-scene className="flex justify-center px-2">
      <div className="relative flex w-full max-w-320 flex-col items-start gap-12 md:gap-14 lg:gap-16 overflow-hidden border-x border-b border-secondary px-8 py-16 md:py-20 lg:py-24">
        {/* The hero's glyph grid, fading out leftwards from the right edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-180 mask-[url(/patterns/cta-fade-mask.svg)] mask-size-[1280px_768px] mask-top mask-no-repeat"
        >
          <AsciiGrid />
        </div>

        <h2 className="relative max-w-192 text-display-sm leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">Build your first app.</span> Use Spider&apos;s setup guide{" "}
          <br className="max-md:hidden" />
          to install the CLI and run a starter app.
        </h2>
        <Button
          href="#"
          size="md"
          iconTrailing={<BookClosed data-icon="trailing" />}
          data-spider-perch
          data-ascii-pulse
          className="relative"
        >
          Read setup guide
        </Button>
      </div>
    </section>
  );
}
