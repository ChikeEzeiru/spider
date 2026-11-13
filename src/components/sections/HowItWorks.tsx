const STEPS = [
  { title: "Describe", body: "Declare routes & the framework features your app uses." },
  { title: "Connect", body: "Link the spec to your React pages, server operations, & data model." },
  { title: "Build and deploy", body: "Use the framework's build tools, & choose a deployment route." },
];

export default function HowItWorks() {
  return (
    <section data-spider-scene data-spider-mode="patrol" className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col gap-12 border-x border-b border-secondary px-8 py-18">
        <h2 className="text-display-sm leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">Describe the app, connect its parts, build and deploy.</span>{" "}
          The TypeScript spec declares framework-level structure. Your app code supplies the interface and product
          behavior
        </h2>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ title, body }) => (
            <li key={title} className="flex flex-col gap-5 p-2">
              {/* Illustration slot for each step. */}
              <div data-spider-perch className="h-50 bg-sunken" />
              <p className="text-xl leading-heading tracking-heading text-pretty text-tertiary">
                <span className="text-primary">{title}.</span> {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
