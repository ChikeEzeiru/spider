"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Rss01 } from "@untitledui/icons";
import Band, { PAD, PageTitle } from "@/components/page/Band";
import Byline from "@/components/page/Byline";
import { FilterChip, Tag } from "@/components/page/Chip";
import { Line } from "@/components/page/CodeBlock";
import { coverOf, formatDate, readingTime, type Post } from "@/content/blog";
import { cx } from "@/utils/cx";

const FILTERS = [
  { label: "All", tag: null },
  { label: "Announcements", tag: "Announcement" },
  { label: "Engineering", tag: "Engineering" },
] as const;

/** The blog: the newest post featured with its code as the cover, then the rest as dated rows. */
export default function BlogIndex({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["tag"]>(null);
  const shown = filter ? posts.filter((p) => p.tag === filter) : posts;
  const [featured, ...earlier] = shown;
  const cover = featured ? coverOf(featured) : undefined;

  return (
    <>
      {/* The title runs straight into the featured post, with no line between (Figma: Inner — Blog). */}
      <PageTitle
        className="border-b-0 pb-8 sm:pb-10 lg:pb-12"
        title="Blog"
        intro="Releases, design decisions and how Spider works under the hood."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filter posts" className="flex flex-wrap gap-2">
              {FILTERS.map(({ label, tag }) => (
                <FilterChip key={label} active={filter === tag} onClick={() => setFilter(tag)}>
                  {label}
                </FilterChip>
              ))}
            </div>
            <a href="/blog/rss.xml" className="ml-2 flex items-center gap-1.5 text-sm text-tertiary transition-colors hover:text-primary">
              <Rss01 className="size-4" />
              RSS
            </a>
          </div>
        }
      />

      {featured ? (
        <section className="flex justify-center px-2">
          <Link
            href={`/blog/${featured.slug}`}
            className={cx(
              PAD,
              "group grid w-full max-w-320 gap-8 border-x border-b border-secondary pt-0 pb-10 sm:pt-0 sm:pb-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-0 lg:pb-14",
            )}
          >
            {/* The post's own code is its cover. */}
            <div className="flex min-h-64 items-center overflow-hidden rounded-sm bg-aztec-900 px-6 py-10 sm:px-10 lg:col-span-7 lg:min-h-100 lg:px-12">
              {cover?.type === "code" ? (
                <figure className="flex min-w-0 flex-col gap-4">
                  <figcaption className="font-mono text-xs text-aztec-500">{cover.name}</figcaption>
                  <pre className="overflow-hidden font-mono text-xs leading-6 sm:text-sm sm:leading-7">
                    {cover.lines.map((line, i) => (
                      <div key={i} className="whitespace-pre">
                        <Line text={line} />
                      </div>
                    ))}
                  </pre>
                </figure>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              <p className="flex gap-2 text-sm text-tertiary">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span aria-hidden="true" className="text-quaternary">·</span>
                {featured.tag}
              </p>
              <h2 className="text-heading-hero font-medium tracking-heading text-pretty text-primary">{featured.title}</h2>
              <p className="text-md text-pretty text-tertiary sm:text-lg">{featured.excerpt}</p>
              <Byline author={featured.author} minutes={readingTime(featured)} />
              <span className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
                Read the post
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      {earlier.length ? (
        <Band className="pb-12 sm:pb-18">
          <h2 className="border-b border-secondary px-4 pt-10 pb-4 text-sm font-medium text-primary sm:px-6 lg:px-8">Earlier posts</h2>
          <ul className="flex flex-col divide-y divide-secondary">
            {earlier.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-7 md:flex-row md:items-start md:gap-12 lg:px-8"
                >
                  <time dateTime={post.date} className="text-sm text-tertiary md:w-40 md:shrink-0">
                    {formatDate(post.date)}
                  </time>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="text-heading-row font-medium text-pretty text-primary transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="max-w-215 text-md text-pretty text-tertiary">{post.excerpt}</p>
                    <div className="mt-1">
                      <Tag>{post.tag}</Tag>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}
    </>
  );
}
