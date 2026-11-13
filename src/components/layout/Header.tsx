import Image from "next/image";
import Link from "next/link";
import { Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import SpiderIcon from "@/components/ui/SpiderIcon";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Examples", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  return (
    <header className="flex justify-center px-2">
      <div className="flex h-18 w-full max-w-320 items-center justify-between border border-secondary px-8">
        <div className="flex h-full items-center gap-6 p-2">
          <Link href="/" aria-label="Spider home" className="text-primary">
            <SpiderIcon size={41} />
          </Link>
          <nav className="hidden h-full gap-2 p-2 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center px-2 text-md text-black transition-colors hover:text-tertiary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-stretch gap-4">
          <a href="#" aria-label="Spider on GitHub" className="flex items-center px-2">
            <Image src="/icons/github.svg" alt="" width={20} height={20} />
          </a>
          <Button href="#" size="xs" iconTrailing={<Code02 data-icon="trailing" />}>
            Start Building
          </Button>
        </div>
      </div>
    </header>
  );
}
