import type { ReactNode } from "react";
import { Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import AsciiGrid from "@/components/ui/AsciiGrid";

/*
 * A compact call to action for the end of an inner page. Like the homepage CTA it has the
 * ASCII grid fading in from the right, and the spider comes to sit on its button
 * (the page mounts <SpiderMascot />).
 */
export default function CtaRow({
  lead,
  rest,
  href = "/docs/quickstart",
  action = "Start Building",
}: {
  lead: ReactNode;
  rest?: ReactNode;
  href?: string;
  action?: string;
}) {
  return (
    <section data-spider-scene className="flex justify-center px-2">
      <div className="relative flex w-full max-w-320 flex-col items-start gap-6 overflow-hidden border-x border-b border-secondary px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mask-[url(/patterns/cta-fade-mask.svg)] mask-size-[1280px_768px] mask-top-right mask-no-repeat"
        >
          <AsciiGrid />
        </div>
        <h2 className="relative text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">{lead}</span>
          {rest ? <> {rest}</> : null}
        </h2>
        <Button
          href={href}
          size="md"
          iconTrailing={<Code02 data-icon="trailing" />}
          data-spider-perch
          data-ascii-pulse
          className="relative shrink-0"
        >
          {action}
        </Button>
      </div>
    </section>
  );
}
