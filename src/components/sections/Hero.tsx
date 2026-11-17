import { Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import AsciiGrid from "@/components/ui/AsciiGrid";

export default function Hero() {
  return (
    <section data-spider-scene className="flex justify-center px-2">
      <div className="relative flex min-h-[70dvh] w-full max-w-320 items-end overflow-hidden border-x border-b border-secondary px-4 sm:px-6 lg:px-8 py-12 sm:py-18 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mask-[url(/patterns/hero-fade-mask.svg)] mask-size-[1280px_768px] mask-top mask-no-repeat"
        >
          <AsciiGrid />
        </div>

        <div className="relative flex flex-col items-start gap-8">
          <p className="text-sm leading-heading tracking-heading text-tertiary sm:text-md">
            <span className="font-semibold text-primary">4.5k+</span> developers
            build with Spider
          </p>
          <h1 className="text-heading-hero tracking-heading text-pretty text-tertiary">
            <span className="font-medium text-primary">
              Build full-stack apps without wiring every layer by hand.
            </span>{" "}
            Define your app in TypeScript. Spider connects your React interface
            &amp; Node.js server with built-in auth, typed operations,
            background jobs, &amp; email.
          </h1>
          <div className="flex flex-wrap gap-4">
            <Button href="#" size="xl" color="secondary">
              See how it works
            </Button>
            <Button
              href="#"
              size="xl"
              iconTrailing={<Code02 data-icon="trailing" />}
              data-spider-perch
              data-spider-align="0.75"
              data-ascii-pulse
            >
              Start Building
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
