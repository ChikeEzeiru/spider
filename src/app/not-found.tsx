import SpiderRolls from "@/components/footer-concepts/SpiderRolls";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SkipLink from "@/components/layout/SkipLink";
import NotFound from "@/components/page/NotFound";
import Stripes from "@/components/page/Stripes";

/**
 * Unknown URLs. These render in the root layout only, outside the site's route group,
 * so the header, striped band and footer are added here to match every other page.
 */
export default function RootNotFound() {
  return (
    <div className="relative min-h-screen">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <NotFound />
      </main>
      <Stripes />
      <Footer showcase={<SpiderRolls />} />
    </div>
  );
}
