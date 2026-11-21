import Footer from "@/components/layout/Footer";
import SpiderRolls from "@/components/footer-concepts/SpiderRolls";
import Header from "@/components/layout/Header";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import Cta from "@/components/sections/Cta";
import Examples from "@/components/sections/examples/Examples";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/how-it-works/HowItWorks";
import Stack from "@/components/sections/Stack";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Stack />
      <Examples />
      <Cta />

      <Footer showcase={<SpiderRolls />} />

      <SpiderMascot />
    </div>
  );
}
