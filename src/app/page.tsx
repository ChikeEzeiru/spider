import Header from "@/components/layout/Header";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import Cta from "@/components/sections/Cta";
import Examples from "@/components/sections/examples/Examples";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/how-it-works/HowItWorks";
import SpiderIcon from "@/components/ui/SpiderIcon";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Examples />
      <Cta />

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
