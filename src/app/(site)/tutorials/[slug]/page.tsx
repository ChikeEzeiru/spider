import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/page/Blocks";
import GuidePage from "@/components/page/GuidePage";
import { TUTORIALS, tutorialBySlug } from "@/content/tutorials";

// Every tutorial is known at build time, so each is prerendered.
export function generateStaticParams() {
  return TUTORIALS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/tutorials/[slug]">): Promise<Metadata> {
  const tutorial = tutorialBySlug((await params).slug);
  return tutorial ? { title: `${tutorial.title} · Tutorials · Spider`, description: tutorial.summary } : {};
}

export default function TutorialPage({ params }: PageProps<"/tutorials/[slug]">) {
  return (
    // The tutorial depends on the URL, so it's read inside Suspense (as on blog posts).
    <Suspense>
      <Tutorial params={params} />
    </Suspense>
  );
}

async function Tutorial({ params }: { params: PageProps<"/tutorials/[slug]">["params"] }) {
  const tutorial = tutorialBySlug((await params).slug);
  if (!tutorial) notFound();

  return (
    <GuidePage
      back={{ href: "/tutorials", label: "All tutorials" }}
      meta={
        <>
          <span>Tutorial</span>
          <span aria-hidden="true" className="text-quaternary">·</span>
          <span>{tutorial.level}</span>
          <span aria-hidden="true" className="text-quaternary">·</span>
          <span>{tutorial.minutes} min</span>
        </>
      }
      title={tutorial.title}
      intro={tutorial.summary}
      sections={tutorial.sections.map(({ title, blocks }) => ({ title, body: <Blocks blocks={blocks} /> }))}
    />
  );
}
