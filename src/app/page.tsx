import { Button } from "@/components/base/buttons/button";
import Header from "@/components/layout/Header";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import Hero from "@/components/sections/Hero";
import SpiderIcon from "@/components/ui/SpiderIcon";

const FEATURES = [
  { title: "Instant deploys", body: "Push to git and your site is live in seconds. No config, no fuss." },
  { title: "Edge network", body: "Serve from 100+ locations worldwide. Sub-100ms response times globally." },
  { title: "Analytics built in", body: "Real-time insights on traffic, performance, and Core Web Vitals." },
  { title: "Preview URLs", body: "Every pull request gets its own shareable preview environment." },
  { title: "Zero-config CI", body: "Automatic builds on every commit. Rollbacks in one click." },
  { title: "Team collaboration", body: "Comments, roles, and access controls for teams of any size." },
];

const CUSTOMERS = ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Dunder Mifflin"];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />

      <Hero />

      {/* Placeholder content below until the remaining Figma sections arrive. */}

      <section className="border-t border-secondary px-6 py-14">
        <p className="mb-10 text-center text-xs tracking-widest text-quaternary uppercase">Trusted by teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-10 text-sm font-semibold text-quaternary">
          {CUSTOMERS.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      <section data-spider-scene data-spider-mode="patrol" className="mx-auto max-w-5xl px-6 py-24">
        <p className="mb-4 text-center text-xs tracking-widest text-quaternary uppercase">Features</p>
        <h2 className="mb-16 text-center text-display-sm font-semibold">Everything you need to ship</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-spider-perch
              className="rounded-sm border border-secondary bg-primary p-6 transition-colors duration-300 data-spider-on:border-primary data-spider-on:bg-secondary"
            >
              <h3 className="mb-2 text-sm font-semibold">{f.title}</h3>
              <p className="text-sm text-tertiary">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

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
