import AsciiScene from "@/components/illustrations/AsciiScene";
import type { SceneName } from "@/components/illustrations/asciiScenes";

const STEPS: { title: string; body: string; scene: SceneName }[] = [
  { title: "Describe", body: "Declare routes & the framework features your app uses.", scene: "cube" },
  { title: "Connect", body: "Link the spec to your React pages, server operations, & data model.", scene: "connect" },
  { title: "Build and deploy", body: "Use the framework's build tools, & choose a deployment route.", scene: "globe" },
];

export default function HowItWorks() {
  return (
    <section data-spider-scene data-spider-mode="patrol" className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col gap-8 sm:gap-12 lg:gap-16 border-x border-b border-secondary px-4 sm:px-6 lg:px-8 py-12 sm:py-18 lg:py-24">
        <h2 className="text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">Describe the app, connect its parts, build and deploy.</span>{" "}
          The TypeScript spec declares framework-level structure. Your app code supplies the interface and product
          behavior
        </h2>

        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STEPS.map(({ title, body, scene }) => (
            <li key={title} className="flex flex-col gap-5 p-2">
              <div data-spider-perch className="relative h-50 overflow-hidden rounded-sm bg-aztec-950">
                <AsciiScene scene={scene} tonal toneClassName="text-aztec-50" />
              </div>
              <p className="text-lg leading-heading tracking-heading text-pretty text-tertiary lg:text-xl">
                <span className="text-primary">{title}.</span> {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
