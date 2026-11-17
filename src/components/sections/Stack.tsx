import { BookClosed } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import NeedsChecker from "@/components/illustrations/needs-checker/NeedsChecker";

export default function Stack() {
  return (
    <section className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary">
        <div className="flex flex-col items-start gap-8 px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-14 lg:pb-16">
          <h2 className="text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
            <span className="font-medium text-primary">Build with React and Node.js.</span> Spider uses React for the
            client, Node.js for the server, &amp; Prisma for data. Check the supported databases and extension points
            against your app&apos;s needs.
          </h2>
          <Button href="#" size="md" color="secondary" iconTrailing={<BookClosed data-icon="trailing" />}>
            Read the Docs
          </Button>
        </div>

        <div className="px-3 pb-6 sm:px-6 lg:px-8">
          <NeedsChecker />
        </div>
      </div>
    </section>
  );
}
