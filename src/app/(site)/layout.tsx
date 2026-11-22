import SpiderRolls from "@/components/footer-concepts/SpiderRolls";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SkipLink from "@/components/layout/SkipLink";
import Stripes from "@/components/page/Stripes";

/** Every page of the site: the sticky header, the page, a striped band, and the footer with its logo animation. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative min-h-screen">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Stripes />
      <Footer showcase={<SpiderRolls />} />
    </div>
  );
}
