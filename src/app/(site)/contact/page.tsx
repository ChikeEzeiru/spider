import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@untitledui/icons";
import { GITHUB_URL } from "@/components/layout/navLinks";
import Band, { PageTitle } from "@/components/page/Band";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Contact · Spider",
  description: "Where to ask questions, report bugs, and reach the Spider team.",
};

const CHANNELS = [
  {
    glyph: "{ }",
    title: "Questions and ideas",
    body: "Ask how something works, share what you're building, or suggest a feature.",
    action: "GitHub Discussions",
    href: GITHUB_URL,
    external: true,
  },
  {
    glyph: "#",
    title: "Chat",
    body: "Talk to the team and other people building with Spider, in real time.",
    action: "Join the Discord",
    href: "https://discord.com",
    external: true,
  },
  {
    glyph: "!",
    title: "Security",
    body: "Found a vulnerability? Please report it privately, never in a public issue.",
    action: "How to report",
    href: "/security",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageTitle title="Get in touch" intro="Pick the channel that fits. We read everything." />

      {/* A two-column checkerboard: each channel sits beside (and above) a plain grey cell. Phones get the cards alone. */}
      <Band className="grid grid-cols-1 md:grid-cols-2">
        {CHANNELS.flatMap((channel, i) => {
          const right = i % 2 === 1;
          const card = (
            <ChannelCard key={channel.title} {...channel} className={cx(i > 0 && "max-md:border-t", right && "md:border-l")} />
          );
          const filler = (
            <div key={`${channel.title}-fill`} aria-hidden="true" className={cx("border-secondary bg-tertiary max-md:hidden", !right && "md:border-l")} />
          );
          return right ? [filler, card] : [card, filler];
        })}
      </Band>

      <Band className="flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-md text-pretty text-tertiary">Found a bug? Open an issue on GitHub with the steps to reproduce it.</p>
        <a href={GITHUB_URL} className="group flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-primary">
          Open an issue
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </Band>
    </>
  );
}

function ChannelCard({
  glyph,
  title,
  body,
  action,
  href,
  external,
  className,
}: (typeof CHANNELS)[number] & { className?: string }) {
  return (
    <section
      className={cx(
        "flex flex-col gap-4 border-secondary px-4 py-8 sm:px-6 sm:py-10 md:min-h-80 lg:px-12 lg:pb-12",
        className,
      )}
    >
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-sm bg-tertiary font-mono text-sm text-secondary">
        {glyph}
      </span>
      <h2 className="mt-2 text-heading-row tracking-heading text-primary">{title}</h2>
      <p className="text-md text-pretty text-tertiary">{body}</p>
      <Link
        href={href}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group mt-2 flex w-fit items-center gap-1 text-sm font-medium text-primary"
      >
        {action}
        {external ? (
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ) : (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </Link>
    </section>
  );
}
