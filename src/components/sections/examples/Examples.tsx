import { Button } from "@/components/base/buttons/button";
import ExampleList from "./ExampleList";

export default function Examples() {
  return (
    <section className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary pb-12 sm:pb-18 lg:pb-24">
        <div className="flex flex-col items-start gap-8 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-18 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 md:flex-row md:items-center">
          <h2 className="flex-1 text-heading-section leading-heading tracking-heading text-balance text-tertiary">
            <span className="font-medium text-primary">Explore apps built with Spider.</span> See how developers use
            Spider across different kinds of apps.
          </h2>
          <Button href="/examples" size="md" color="secondary">
            See more examples
          </Button>
        </div>

        {/* Each row carries its own side padding, so the lines between rows meet the frame. */}
        <ExampleList />
      </div>
    </section>
  );
}
