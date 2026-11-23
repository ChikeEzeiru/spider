import type { Metadata } from "next";
import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import Band, { PAD, PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Careers · Spider",
  description: "Open roles on the Spider team, and how we work.",
};

const HOW_WE_WORK = [
  { title: "Remote, with overlap", body: "We work from anywhere between UTC−3 and UTC+3, so everyone shares at least four working hours." },
  { title: "Open by default", body: "Plans, designs and decisions happen in public issues and Discussions, where the community can join in." },
  { title: "Small releases", body: "We ship in small steps every few weeks, and write the migration guide alongside the change." },
];

const ROLES = [
  {
    title: "Senior framework engineer",
    team: "Core",
    about: "Work on the compiler that turns the spec into a client and server, and on the runtime underneath them. You've built or maintained a developer tool people depend on.",
    tags: ["Full-time", "Remote"],
  },
  {
    title: "Developer advocate",
    team: "Community",
    about: "Write tutorials, run community calls and workshops, and bring what you hear back to the team. You've taught developers before, in writing or on stage.",
    tags: ["Full-time", "Remote"],
  },
  {
    title: "Product designer",
    team: "Design",
    about: "Design the docs, this site and the CLI's output, and help decide how new features should feel to use. You care about type, motion and developer tools.",
    tags: ["Full-time", "Remote"],
  },
];

export default function CareersPage() {
  return (
    <>
      <PageTitle
        title="Careers"
        intro="We're a small team building Spider in the open. If you want to make full-stack development calmer for a lot of people, we'd like to hear from you."
      />

      {/* How we work: three cells that share their borders with the frame. */}
      <Band>
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">How we work</h2>
        <ul className="grid sm:grid-cols-3">
          {HOW_WE_WORK.map(({ title, body }, i) => (
            <li key={title} className={cx("flex flex-col gap-2 border-secondary px-4 py-8 sm:px-6 sm:py-10 lg:px-8", i > 0 && "max-sm:border-t sm:border-l")}>
              <h3 className="text-lg font-medium text-primary">{title}</h3>
              <p className="text-md text-pretty text-tertiary">{body}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band className="pb-12 sm:pb-18">
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Open roles</h2>
        <ul className="flex flex-col divide-y divide-secondary">
          {ROLES.map(({ title, team, about, tags }) => (
            <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8">
              <p className="text-sm text-tertiary md:w-40 md:shrink-0">{team}</p>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
                <p className="max-w-215 text-md text-pretty text-tertiary">{about}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band className={cx(PAD, "flex flex-col items-start gap-6")}>
        <h2 className="max-w-240 text-heading-section leading-heading tracking-heading text-pretty text-tertiary">
          <span className="font-medium text-primary">How to apply.</span> Send us a link to something you&apos;ve built or
          written, and a few lines on which role interests you and why.
        </h2>
        <Button href="/contact" size="md" color="dark" iconTrailing={<ArrowRight data-icon="trailing" />}>
          Get in touch
        </Button>
      </Band>
    </>
  );
}
