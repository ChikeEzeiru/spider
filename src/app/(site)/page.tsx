import SpiderMascot from "@/components/mascot/SpiderMascot";
import Cta from "@/components/sections/Cta";
import Examples from "@/components/sections/examples/Examples";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/how-it-works/HowItWorks";
import Stack from "@/components/sections/Stack";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Stack />
      <Examples />
      <Cta />

      <SpiderMascot />
    </>
  );
}
