import Image from "next/image";
import Link from "next/link";
import { Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import SpiderIcon from "@/components/ui/SpiderIcon";
import DesktopNav from "./DesktopNav";
import HeaderBar from "./HeaderBar";
import MobileMenu from "./MobileMenu";
import { GITHUB_URL, START_BUILDING_URL } from "./navLinks";

export default function Header() {
  return (
    // Sticky, above the spider's layer (z-40) so the mascot passes under the nav and never over the open menu.
    <header className="sticky top-0 z-50 bg-secondary">
      <HeaderBar>
        <div className="flex h-full items-center gap-6 md:py-2">
          <Link href="/" aria-label="Spider home" className="text-primary">
            <SpiderIcon size={36} blink className="size-7 sm:size-8 lg:size-9" />
          </Link>
          <DesktopNav />
        </div>

        <div className="hidden items-stretch gap-4 md:flex">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="Spider on GitHub" className="flex items-center px-2">
            <Image src="/icons/github.svg" alt="" width={20} height={20} />
          </a>
          <Button href={START_BUILDING_URL} size="xs" color="dark" iconTrailing={<Code02 data-icon="trailing" />}>
            Start Building
          </Button>
        </div>

        <MobileMenu />
      </HeaderBar>
    </header>
  );
}
