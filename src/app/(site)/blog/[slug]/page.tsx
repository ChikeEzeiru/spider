import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";
import Band, { PAD } from "@/components/page/Band";
import Byline from "@/components/page/Byline";
import CodeBlock from "@/components/page/CodeBlock";
import { Prose } from "@/components/page/PageFrame";
import Toc from "@/components/page/Toc";
import { POSTS, formatDate, postBySlug, readingTime } from "@/content/blog";
import { cx } from "@/utils/cx";
import { slug } from "@/utils/slug";

// Every post is known at build time, so each is prerendered.
export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  return post ? { title: `${post.title} · Spider`, description: post.excerpt } : {};
}

// The margin column (back link, contents) and the reading column, shared by the header and body.
const MARGIN = "lg:w-64 lg:shrink-0";
const COLUMN = "w-full max-w-170 min-w-0";

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    // The post depends on the URL, so it's read inside Suspense (Next 16 instant navigation).
    <Suspense>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const toc = post.body.flatMap((b) => (b.type === "h2" ? [{ id: slug(b.text), label: b.text }] : []));

  return (
    <article>
      <Band as="header" className={cx(PAD, "flex flex-col gap-8 lg:flex-row lg:gap-12")}>
        <div className={MARGIN}>
          <Link href="/blog" className="flex w-fit items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary">
            <ArrowLeft className="size-4" />
            All posts
          </Link>
        </div>
        <div className={cx(COLUMN, "flex flex-col gap-4 sm:gap-6")}>
          <p className="flex gap-2 text-sm text-tertiary">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true" className="text-quaternary">·</span>
            {post.tag}
          </p>
          <h1 className="text-heading-hero font-medium tracking-heading text-pretty text-primary">{post.title}</h1>
          <p className="text-md text-pretty text-tertiary sm:text-lg">{post.excerpt}</p>
          <Byline author={post.author} minutes={readingTime(post)} />
        </div>
      </Band>

      <Band className={cx(PAD, "flex flex-col gap-8 lg:flex-row lg:gap-12")}>
        <aside className={cx(MARGIN, "max-lg:hidden")}>
          <Toc items={toc} className="sticky top-28" />
        </aside>
        <Prose className={COLUMN}>
          {post.body.map((block, i) =>
            block.type === "p" ? (
              <p key={i}>{block.text}</p>
            ) : block.type === "h2" ? (
              <h2 key={i} id={slug(block.text)} className="scroll-mt-24">
                {block.text}
              </h2>
            ) : block.type === "quote" ? (
              <blockquote key={i} className="not-prose my-10 border-l-2 border-aztec-900 pl-6 text-heading-row tracking-heading text-pretty text-primary">
                {block.text}
              </blockquote>
            ) : (
              <CodeBlock key={i} name={block.name} lines={block.lines} className="my-8" />
            ),
          )}
        </Prose>
      </Band>
    </article>
  );
}
