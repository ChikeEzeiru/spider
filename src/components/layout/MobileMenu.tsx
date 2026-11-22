"use client";

import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import SpiderIcon from "@/components/ui/SpiderIcon";
import { cx } from "@/utils/cx";
import HeaderBar from "./HeaderBar";
import { GITHUB_URL, NAV_LINKS, START_BUILDING_URL } from "./navLinks";
import { useIsCurrent } from "./useIsCurrent";

const BAR = "absolute left-0 h-0.5 w-4 rounded-full bg-fg-primary transition-all duration-300 ease-in-out";

function MenuToggle({ open, ...props }: { open: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-expanded={open}
      className="flex size-10 items-center justify-center rounded-sm bg-quaternary transition-colors hover:bg-aztec-300"
      {...props}
    >
      <span className="relative h-2.5 w-4">
        <span className={cx(BAR, open ? "top-1 rotate-45" : "top-0")} />
        <span className={cx(BAR, "top-1", open && "opacity-0")} />
        <span className={cx(BAR, open ? "top-1 -rotate-45" : "top-2")} />
      </span>
    </button>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const isCurrent = useIsCurrent();

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const trigger = openButton.current;
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    root.style.overflow = "hidden";
    closeButton.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <MenuToggle
        ref={openButton}
        open={false}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      />

      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        // Opening shows the panel at once so focus can land in it; closing fades before hiding.
        className={cx(
          "fixed inset-0 z-50 flex flex-col bg-secondary duration-250 ease-in-out",
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-all",
        )}
      >
        <HeaderBar>
          <Link href="/" aria-label="Spider home" className="text-primary" onClick={close}>
            <SpiderIcon size={36} className="size-7 sm:size-8 lg:size-9" />
          </Link>
          <MenuToggle ref={closeButton} open={open} aria-controls={panelId} aria-label="Close menu" onClick={close} />
        </HeaderBar>

        <nav
          aria-label="Main"
          className={cx(
            "px-4 pt-3 transition-transform duration-500 ease-in-out",
            open ? "translate-y-0" : "-translate-y-2",
          )}
        >
          <ul>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label} className="border-b border-dashed border-secondary">
                <Link
                  href={href}
                  onClick={close}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className={cx(
                    "flex h-12.5 items-center text-lg transition-colors hover:text-primary",
                    isCurrent(href) ? "font-medium text-primary" : "text-tertiary",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
          <Button
            href={GITHUB_URL}
            size="lg"
            color="secondary"
            iconLeading={<Image src="/icons/github.svg" alt="" width={20} height={20} data-icon="leading" />}
          >
            GitHub
          </Button>
          <Button href={START_BUILDING_URL} size="lg" color="dark" iconTrailing={<Code02 data-icon="trailing" />}>
            Start Building
          </Button>
        </div>
      </div>
    </div>
  );
}
