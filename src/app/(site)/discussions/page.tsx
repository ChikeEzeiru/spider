import type { Metadata } from "next";
import { ArrowUpRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import Band, { PageTitle } from "@/components/page/Band";
import { Tag } from "@/components/page/Chip";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
  title: "Discussions · Spider",
  description: "Ask questions, share what you're building and suggest features for Spider.",
};

// Spider is a concept, so discussions point at GitHub's homepage, like the footer's socials.
const DISCUSSIONS_URL = "https://github.com";

const CATEGORIES = [
  { glyph: "?", name: "Q&A", about: "Ask how something works. Mark the reply that solved it, so the next person finds it.", count: 214 },
  { glyph: "+", name: "Ideas", about: "Suggest a feature or a change. Popular ideas feed the roadmap.", count: 87 },
  { glyph: "*", name: "Show and tell", about: "Share something you built with Spider, finished or not.", count: 46 },
  { glyph: "!", name: "Announcements", about: "Releases and news from the team. Only maintainers can post here.", count: 12 },
];

const RECENT = [
  { title: "How do I run one job on a different schedule per user?", category: "Q&A", replies: 6, answered: true, when: "2 hours ago" },
  { title: "Live queries: what would you use them for?", category: "Ideas", replies: 23, answered: false, when: "Yesterday" },
  { title: "A booking app for my climbing gym, built in a weekend", category: "Show and tell", replies: 9, answered: false, when: "2 days ago" },
  { title: "Spider 0.4: queued jobs and Railway deploys", category: "Announcements", replies: 31, answered: false, when: "13 days ago" },
  { title: "Using a different ORM alongside Prisma", category: "Q&A", replies: 4, answered: true, when: "2 weeks ago" },
];

export default function DiscussionsPage() {
  return (
    <>
      <PageTitle
        title="Discussions"
        intro="Ask questions, share what you're building and suggest features. Discussions live on GitHub, where the team reads every thread."
        aside={
          <div>
            <Button href={DISCUSSIONS_URL} target="_blank" rel="noreferrer" size="md" color="dark" iconTrailing={<ArrowUpRight data-icon="trailing" />}>
              Start a discussion
            </Button>
          </div>
        }
      />

      {/* Categories as a grid of cells that share their borders with the frame. */}
      <Band>
        <ul className="grid sm:grid-cols-2">
          {CATEGORIES.map(({ glyph, name, about, count }, i) => (
            <li
              key={name}
              className={cx(
                "flex flex-col gap-3 border-secondary px-4 py-8 sm:px-6 sm:py-10 lg:px-12",
                i > 0 && "max-sm:border-t",
                i >= 2 && "sm:border-t",
                i % 2 === 1 && "sm:border-l",
              )}
            >
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-sm bg-tertiary font-mono text-sm text-secondary">
                {glyph}
              </span>
              <h2 className="mt-2 text-heading-row tracking-heading text-primary">{name}</h2>
              <p className="text-md text-pretty text-tertiary">{about}</p>
              <p className="text-sm text-quaternary">{count} discussions</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band className="pb-12 sm:pb-18">
        <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Recent discussions</h2>
        <ul className="flex flex-col divide-y divide-secondary">
          {RECENT.map(({ title, category, replies, answered, when }) => (
            <li key={title} className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:gap-12 lg:px-8">
              <p className="text-sm text-tertiary md:w-40 md:shrink-0">{when}</p>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="text-heading-row font-medium text-pretty text-primary">{title}</h3>
                <p className="text-md text-tertiary">
                  {replies} replies{answered ? " · Answered" : ""}
                </p>
                <div className="mt-1">
                  <Tag>{category}</Tag>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
