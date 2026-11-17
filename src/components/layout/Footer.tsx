import Link from "next/link";
import SpiderIcon from "@/components/ui/SpiderIcon";
import { FOOTER_COLUMNS, STATUS_URL } from "./footerLinks";

export default function Footer() {
  return (
    <footer className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-secondary">
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-4 gap-y-10 px-4 sm:px-6 lg:px-8 pt-16 pb-28 md:grid-cols-3 lg:grid-cols-6"
        >
          {FOOTER_COLUMNS.map((groups) => (
            <div key={groups[0].title} className="flex flex-col gap-10">
              {groups.map(({ title, links }) => (
                <div key={title} className="flex flex-col gap-4">
                  <h2 className="text-md font-medium text-primary sm:text-lg">{title}</h2>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className="text-md text-tertiary transition-colors hover:text-primary">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-secondary px-4 sm:px-6 lg:px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Spider home">
              <SpiderIcon size={20} />
            </Link>
            <Link
              href={STATUS_URL}
              className="flex items-center gap-2 text-xs text-tertiary transition-colors hover:text-primary"
            >
              <span className="size-1.5 rounded-full bg-fg-success-secondary" />
              All systems operational
            </Link>
          </div>
          <p className="text-xs text-quaternary">© 2026 Spider, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
