import { ArrowRight } from "@untitledui/icons";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import SpiderIcon from "@/components/ui/SpiderIcon";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <SpiderIcon size={32} color="white" />
            <span className="text-sm font-semibold tracking-tight">Spider</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Products</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">
            Log in
          </button>
          <button className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section data-spider-scene className="flex flex-col items-center justify-center min-h-screen pt-16 px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
          <span className="size-1.5 rounded-full bg-green-400"></span>
          Now in public beta
        </div>

        <h1 className="max-w-3xl text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
          Build faster.<br />Ship smarter.
        </h1>

        <p className="max-w-lg text-base md:text-lg text-white/50 mb-10">
          The platform for high-performance web. Deploy, scale, and iterate
          at the speed of thought.
        </p>

        <div className="flex items-center gap-3">
          <button data-spider-perch data-spider-align="0.75" className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
            Start for free
            <ArrowRight className="size-4" />
          </button>
          <button className="text-sm text-white/70 border border-white/20 px-6 py-3 rounded-full hover:border-white/40 hover:text-white transition-colors">
            See how it works
          </button>
        </div>
      </section>

      {/* Logo strip */}
      <section className="border-t border-white/10 py-14 px-6">
        <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-10">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 text-white/25 text-sm font-semibold tracking-wide">
          {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Dunder Mifflin"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section data-spider-scene data-spider-mode="patrol" className="py-24 px-6 max-w-5xl mx-auto">
        <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-4">Features</p>
        <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-16">
          Everything you need to ship
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Instant deploys", body: "Push to git and your site is live in seconds. No config, no fuss." },
            { title: "Edge network", body: "Serve from 100+ locations worldwide. Sub-100ms response times globally." },
            { title: "Analytics built in", body: "Real-time insights on traffic, performance, and Core Web Vitals." },
            { title: "Preview URLs", body: "Every pull request gets its own shareable preview environment." },
            { title: "Zero-config CI", body: "Automatic builds on every commit. Rollbacks in one click." },
            { title: "Team collaboration", body: "Comments, roles, and access controls for teams of any size." },
          ].map((f) => (
            <div
              key={f.title}
              data-spider-perch
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:bg-white/8 data-spider-on:border-white/30 data-spider-on:bg-white/10"
            >
              <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section data-spider-scene className="border-t border-white/10 py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Ready to build?
        </h2>
        <p className="text-white/50 mb-8 max-w-sm mx-auto text-sm">
          Join thousands of developers who ship faster with Spider.
        </p>
        <button data-spider-perch className="bg-white text-black text-sm font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
          Get started free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
        <div className="flex items-center gap-2">
          <SpiderIcon size={20} color="white" className="opacity-40" />
          <span>© 2026 Spider, Inc.</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Status", "Blog"].map((l) => (
            <a key={l} href="#" className="hover:text-white/60 transition-colors">{l}</a>
          ))}
        </div>
      </footer>

      <SpiderMascot />
    </div>
  );
}
