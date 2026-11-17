import FeatureMap from "@/components/illustrations/feature-map/FeatureMap";

export default function Features() {
  return (
    <section data-spider-scene data-spider-mode="peek" className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary">
        <h2 className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-18 lg:pt-24 pb-12 md:pb-14 lg:pb-16 text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">Features for full-stack apps.</span> Use Spider&apos;s routing,
          auth, typed operations, jobs, &amp; email features where your app needs them. Write your interface &amp;
          product logic in React &amp; Node.js.
        </h2>

        <div className="px-3 pb-6 sm:px-6 lg:px-8">
          <FeatureMap />
        </div>
      </div>
    </section>
  );
}
