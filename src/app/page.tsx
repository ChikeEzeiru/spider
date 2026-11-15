import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import Cta from "@/components/sections/Cta";
import Examples from "@/components/sections/examples/Examples";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/how-it-works/HowItWorks";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Examples />
      <Cta />

      <Footer />

      <SpiderMascot />
    </div>
  );
}
