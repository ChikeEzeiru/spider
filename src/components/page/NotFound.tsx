import { ArrowLeft, BookOpen01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import AsciiGrid from "@/components/ui/AsciiGrid";

/*
 * The 404 page's content, in the site's frame: the ASCII grid fading in from the right (as in the
 * CTAs), and the spider walks over to sit on the way home. Rendered by app/not-found.tsx for unknown
 * URLs and by (site)/not-found.tsx when a page calls notFound().
 */
export default function NotFound() {
  return (
    <>
      <title>Page not found · Spider</title>
      <section data-spider-scene className="flex justify-center px-2">
        <div className="relative flex min-h-140 w-full max-w-320 flex-col items-start justify-start gap-6 sm:justify-center overflow-hidden border-x border-b border-secondary px-4 py-12 sm:gap-8 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
          {/* Wide screens: the grid fades in from the right, as in the CTAs. Phones: it rises from the bottom,
              below the buttons, so no glyphs sit behind the headline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mask-[url(/patterns/cta-fade-mask.svg)] mask-size-[1280px_768px] mask-top-right mask-no-repeat max-sm:mask-[linear-gradient(to_bottom,transparent_55%,black)] max-sm:mask-size-[100%_100%] max-sm:mask-top-left"
          >
            <AsciiGrid />
          </div>
          <p className="relative font-mono text-sm text-tertiary">404</p>
          <h1 className="relative max-w-200 text-heading-hero tracking-heading text-pretty text-tertiary">
            <span className="font-medium text-primary">There&apos;s no page at this address.</span>{" "}
            <span className="max-sm:hidden">It may have moved, or the link may have a typo.</span>
          </h1>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              href="/"
              size="xl"
              color="dark"
              iconLeading={<ArrowLeft data-icon="leading" />}
              data-spider-perch
              data-ascii-pulse
            >
              Back to home
            </Button>
            <Button href="/docs" size="xl" color="secondary" iconLeading={<BookOpen01 data-icon="leading" />}>
              Read the docs
            </Button>
          </div>
        </div>
      </section>
      <SpiderMascot />
    </>
  );
}
