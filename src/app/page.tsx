import { Button } from "@/components/base/buttons/button";
import Header from "@/components/layout/Header";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import SpiderIcon from "@/components/ui/SpiderIcon";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />

      {/* Placeholder content below until the remaining Figma sections arrive. */}

      <section data-spider-scene className="border-t border-secondary px-6 py-24 text-center">
        <h2 className="mb-4 text-display-sm font-semibold">Ready to build?</h2>
        <p className="mx-auto mb-8 max-w-sm text-sm text-tertiary">
          Join thousands of developers who ship faster with Spider.
        </p>
        <Button data-spider-perch size="lg">
          Get started free
        </Button>
      </section>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-secondary px-6 py-10 text-xs text-quaternary md:flex-row">
        <div className="flex items-center gap-2">
          <SpiderIcon size={20} />
          <span>© 2026 Spider, Inc.</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Status", "Blog"].map((label) => (
            <a key={label} href="#" className="transition-colors hover:text-tertiary">
              {label}
            </a>
          ))}
        </div>
      </footer>

      <SpiderMascot />
    </div>
  );
}
