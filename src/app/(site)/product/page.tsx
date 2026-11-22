import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookClosed, Code02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FEATURES } from "@/components/illustrations/feature-map/featureMapData";
import Band, { PAD } from "@/components/page/Band";
import CodeBlock from "@/components/page/CodeBlock";
import CtaRow from "@/components/page/CtaRow";
import SpiderMascot from "@/components/mascot/SpiderMascot";
import { cx } from "@/utils/cx";
import ProductIndex from "./ProductIndex";

export const metadata: Metadata = {
  title: "Product · Spider",
  description: "One TypeScript spec for routing, auth, typed operations, background jobs, email, entities and deployment.",
};

// The spec and app code each part shows. The first five are the excerpts from the homepage's feature map.
const excerpt = (name: string) => {
  const f = FEATURES.find((x) => x.name === name)!;
  return [f.spec, f.code];
};

const PARTS = [
  {
    id: "routing",
    title: "Routing",
    body: "Declare each route in the spec and point it at a React page. Spider builds the router, code-splits every page, and redirects signed-out visitors from routes marked as private.",
    files: excerpt("Routing"),
  },
  {
    id: "auth",
    title: "Auth",
    body: "Choose the sign-in methods and the entity that holds your users. Sessions, password resets and OAuth callbacks are wired for you, and every operation receives the signed-in user.",
    files: excerpt("Auth"),
  },
  {
    id: "typed-operations",
    title: "Typed operations",
    body: "Queries and actions are plain async functions on the server. Spider generates the client hooks, so calling one from React is fully typed, with no API layer to write or keep in sync.",
    files: excerpt("Operations"),
  },
  {
    id: "jobs",
    title: "Jobs",
    body: "Schedule work with a cron expression or queue it from an action. Jobs run on your server with the same database and email access as everything else, and retry when they fail.",
    files: excerpt("Jobs"),
  },
  {
    id: "email",
    title: "Email",
    body: "Pick a provider once in the spec. Send from any action or job with one call, and preview templates locally before they go anywhere.",
    files: excerpt("Email"),
  },
  {
    id: "entities",
    title: "Entities",
    body: "Model your data with Prisma. Spider generates the client, runs migrations in development, and lets operations declare which entities they read so their caches stay fresh.",
    files: [
      {
        name: "schema.prisma",
        start: 1,
        lines: ["model Task {", "  id     Int     @id @default(autoincrement())", "  title  String", "  done   Boolean @default(false)", "  user   User    @relation(fields: [userId], references: [id])", "  userId Int", "}"],
      },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    body: "Build a client bundle and a Node.js server with one command, then ship them wherever you like. Spider has guides for the common hosts and never locks you to one.",
    files: [{ name: "Terminal", start: 1, lines: ["spider build", "spider deploy fly"] }],
  },
];

// Each part's page in the docs.
const DOCS_FOR: Record<string, string> = {
  routing: "/docs/routing",
  auth: "/docs/auth",
  "typed-operations": "/docs/operations",
  jobs: "/docs/jobs",
  email: "/docs/email",
  entities: "/docs/entities",
  deployment: "/docs/deploying",
};

export default function ProductPage() {
  return (
    <>
      <Band as="header" className={cx(PAD, "flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between")}>
        <div className="flex max-w-200 flex-col gap-4 sm:gap-6">
          <p className="text-sm text-tertiary sm:text-md">Product</p>
          <h1 className="text-heading-hero tracking-heading text-pretty text-tertiary">
            <span className="font-medium text-primary">Everything a full-stack app needs, declared once.</span>
            {/* Phones get the headline alone (DESIGN.md › Typography). */}
            <span className="max-sm:hidden"> Below, every part of the framework next to the code you&apos;d write for it.</span>
          </h1>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button href="/docs" size="xl" color="secondary" iconTrailing={<BookClosed data-icon="trailing" />}>
            Read the docs
          </Button>
          <Button href="/docs/quickstart" size="xl" iconTrailing={<Code02 data-icon="trailing" />}>
            Start Building
          </Button>
        </div>
      </Band>

      <Band className="flex flex-col lg:flex-row">
        {/* The tour's index stays in view while the parts scroll past. */}
        <aside className="hidden shrink-0 border-r border-secondary px-8 py-24 lg:block lg:w-72">
          <div className="sticky top-28">
            <ProductIndex parts={PARTS.map(({ id, title }) => ({ id, title }))} />
          </div>
        </aside>

        <div className="min-w-0 flex-1 divide-y divide-secondary">
          {PARTS.map(({ id, title, body, files }) => (
            <article key={id} id={id} className={cx(PAD, "flex scroll-mt-20 flex-col gap-6 lg:px-12")}>
              <div className="flex max-w-160 flex-col gap-3">
                <h2 className="text-heading-section leading-heading font-medium tracking-heading text-primary">{title}</h2>
                <p className="text-md text-pretty text-tertiary">{body}</p>
              </div>
              <div className="flex max-w-200 flex-col gap-4">
                {files.map((file) => (
                  <CodeBlock key={file.name + file.start} name={file.name} lines={file.lines} start={file.start} />
                ))}
              </div>
              <Link
                href={DOCS_FOR[id] ?? "/docs"}
                className="group flex w-fit items-center gap-1 text-sm font-medium text-primary"
              >
                Read the {title.toLowerCase()} docs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </Band>

      <CtaRow lead="Build your first app." rest="The quickstart takes about five minutes." />

      <SpiderMascot />
    </>
  );
}
