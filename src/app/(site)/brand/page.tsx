import type { Metadata } from "next";
import Image from "next/image";
import Band, { PageTitle } from "@/components/page/Band";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Brand kit · Spider",
  description: "Spider's logo, colours and type, and how to use the name.",
};

const LOGOS = [
  { file: "/Logo-dark.svg", name: "Logo on a dark tile", note: "For avatars, app icons and light backgrounds." },
  { file: "/Logo-light.svg", name: "Logo on a light tile", note: "For dark backgrounds and anywhere the dark tile feels heavy." },
];

const COLOURS = [
  { name: "Ink", hex: "#1C211F", className: "bg-aztec-900", use: "Headings, buttons and the logo." },
  { name: "Body", hex: "#6D7773", className: "bg-aztec-500", use: "Running text and secondary labels." },
  { name: "Line", hex: "#E4E7E6", className: "bg-aztec-200", use: "Borders and dividers." },
  { name: "Canvas", hex: "#F9FAFA", className: "bg-aztec-50", use: "Page backgrounds." },
  { name: "Punch", hex: "#D94D32", className: "bg-brand-600", use: "The brand colour, used sparingly for emphasis." },
];

const NAMING = [
  { title: "Write it as Spider", body: "One word, capital S. Not SPIDER, spider.js or Spider Framework." },
  { title: "Leave the logo as it is", body: "Don't recolour, stretch, rotate or add effects to it. Give it space equal to the spider's eyes on every side." },
  { title: "Don't imply endorsement", body: "Say your project is built with Spider, not that it's made or approved by the Spider team." },
];

/** The logo files, colours, type and naming rules for anyone writing or making something about Spider. */
export default function BrandPage() {
  return (
    <>
      <PageTitle
        title="Brand kit"
        intro="Logos, colours and type for writing about Spider or making something with it. Everything here is free to use in that spirit."
      />

      <Band>
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Logo</h2>
        <ul className="grid sm:grid-cols-2">
          {LOGOS.map(({ file, name, note }, i) => (
            <li key={file} className={cx("flex flex-col border-secondary", i > 0 && "max-sm:border-t sm:border-l")}>
              <div className={cx("flex h-56 items-center justify-center border-b border-secondary", i === 0 ? "bg-primary" : "bg-aztec-900")}>
                <Image src={file} alt={name} width={96} height={96} className="size-24" />
              </div>
              <div className="flex flex-col gap-2 px-4 py-6 sm:px-6 lg:px-8">
                <h3 className="text-lg font-medium text-primary">{name}</h3>
                <p className="text-md text-tertiary">{note}</p>
                <a href={file} download className="mt-1 w-fit text-sm font-medium text-primary underline underline-offset-4">
                  Download SVG
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band>
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Colour</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-5">
          {COLOURS.map(({ name, hex, className, use }, i) => (
            <li
              key={name}
              className={cx(
                "flex flex-col border-secondary",
                i % 2 === 1 && "max-sm:border-l",
                i >= 2 && "max-sm:border-t",
                i > 0 && "sm:border-l",
              )}
            >
              <div className={cx("h-28 border-b border-secondary", className)} />
              <div className="flex flex-col gap-1 px-4 py-5 sm:px-5">
                <h3 className="text-md font-medium text-primary">{name}</h3>
                <p className="font-mono text-sm text-tertiary">{hex}</p>
                <p className="text-sm text-pretty text-tertiary">{use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band>
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Type</h2>
        <ul className="grid sm:grid-cols-2">
          <li className="flex flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <p className="text-heading-hero font-medium tracking-heading text-primary">Aa</p>
            <h3 className="text-lg font-medium text-primary">DM Sans</h3>
            <p className="text-md text-tertiary">Headings and running text. Headings use Medium with slightly tight tracking.</p>
          </li>
          <li className="flex flex-col gap-3 border-secondary px-4 py-8 max-sm:border-t sm:border-l sm:px-6 sm:py-10 lg:px-8">
            <p className="font-mono text-heading-hero text-primary">{"{ }"}</p>
            <h3 className="text-lg font-medium text-primary">Roboto Mono</h3>
            <p className="text-md text-tertiary">Code, commands and version numbers.</p>
          </li>
        </ul>
      </Band>

      <Band className="pb-12 sm:pb-18">
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Using the name and logo</h2>
        <ul className="flex flex-col divide-y divide-secondary">
          {NAMING.map(({ title, body }) => (
            <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
              <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
              <p className="max-w-215 text-md text-pretty text-tertiary">{body}</p>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
