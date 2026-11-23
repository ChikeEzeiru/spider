import type { Metadata } from "next";
import Link from "next/link";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import CopyTemplate from "@/components/page/CopyTemplate";
import { EXAMPLES, MORE_EXAMPLES } from "@/components/sections/examples/exampleData";

export const metadata: Metadata = {
  title: "Starter templates · Spider",
  description: "Starting points for a new Spider app: general starters, plus every example app as a template.",
};

/** General starting points, beyond the example apps. */
const STARTERS = [
  { template: "basic", name: "Basic", pitch: "Email sign-in, a home page and an empty spec. This is what npx spider new uses when you don't pick one.", features: ["Auth", "Routing"] },
  { template: "saas", name: "SaaS", pitch: "Teams, invites and roles, with a billing page wired to Stripe through an extension.", features: ["Auth", "Jobs", "Email"] },
  { template: "internal-tool", name: "Internal tool", pitch: "Tables and forms over your database, with role-based access for your team.", features: ["Auth", "Typed operations"] },
  { template: "api-only", name: "API only", pitch: "A Node.js server with typed operations and no React client, for backends and integrations.", features: ["Typed operations", "Jobs"] },
  { template: "marketing-site", name: "Marketing site", pitch: "Static pages, a Markdown blog and a waitlist form that emails you each sign-up.", features: ["Routing", "Email"] },
];

/** The example apps, each one also a template. */
const FROM_EXAMPLES = [
  ...EXAMPLES.map(({ template, name, pitch, features }) => ({ template, name, pitch, features })),
  ...MORE_EXAMPLES.map(({ template, name, pitch, features }) => ({ template, name, pitch, features })),
];

export default function TemplatesPage() {
  return (
    <>
      <PageTitle
        title="Starter templates"
        intro="Pick a starting point and run one command. Every template is a complete app you can run, read and change."
      />
      <TemplateList
        label="Starters"
        note="General starting points, each with the spec, pages and server code already in place."
        items={STARTERS}
        kind="template"
      />
      <TemplateList
        label="From the examples"
        note={
          <>
            Every app from the{" "}
            <Link href="/examples" className="text-primary underline underline-offset-4">
              examples
            </Link>
            , ready to clone and make your own.
          </>
        }
        items={FROM_EXAMPLES}
        kind="example"
      />
    </>
  );
}

function TemplateList({
  label,
  note,
  items,
  kind,
}: {
  label: string;
  note: React.ReactNode;
  items: { template: string; name: string; pitch: string; features: string[] }[];
  kind: "example" | "template";
}) {
  return (
    <Band className="pb-12 sm:pb-18">
      <div className="flex flex-col gap-1 border-b border-secondary px-4 pt-10 pb-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-medium text-primary">{label}</h2>
        <p className="text-sm text-tertiary">{note}</p>
      </div>
      <ul className="flex flex-col divide-y divide-secondary">
        {items.map(({ template, name, pitch, features }) => (
          <li key={template} className="grid gap-4 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8">
            <div className="flex flex-col gap-3 lg:col-span-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-primary">{name}</h3>
                <p className="text-md text-pretty text-tertiary">{pitch}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Spider features it uses">
                {features.map((f) => (
                  <li key={f}>
                    <Tag>{f}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <CopyTemplate template={template} kind={kind} />
            </div>
          </li>
        ))}
      </ul>
    </Band>
  );
}
