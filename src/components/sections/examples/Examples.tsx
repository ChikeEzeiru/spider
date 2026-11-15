import { Button } from "@/components/base/buttons/button";
import ExampleList from "./ExampleList";

export default function Examples() {
  return (
    <section className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary pb-16 md:pb-20 lg:pb-24">
        <div className="flex flex-col items-start gap-8 px-8 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-14 lg:pb-16 md:flex-row md:items-center">
          <h2 className="flex-1 text-display-sm leading-heading tracking-heading text-balance text-tertiary">
            <span className="font-medium text-primary">Explore apps built with Spider.</span> See how developers use
            Spider across different kinds of apps.
          </h2>
          <Button href="#" size="md" color="secondary">
            See more examples
          </Button>
        </div>

        <div className="px-8">
          <ExampleList />
        </div>
      </div>
    </section>
  );
}
