import type { MetadataRoute } from "next";
import { DOCS } from "@/app/(site)/docs/docsIndex";
import { POSTS } from "@/content/blog";
import { LATEST } from "@/content/changelog";
import { SITE_URL } from "@/utils/site";

/** Every public page: the top-level pages, each docs page and each blog post. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    page("/"),
    page("/product"),
    page("/examples"),
    page("/blog", POSTS[0]?.date),
    ...POSTS.map((post) => page(`/blog/${post.slug}`, post.date)),
    ...DOCS.map((doc) => page(doc.href)),
    page("/changelog", LATEST.date),
    page("/about"),
    page("/contact"),
    page("/privacy"),
    page("/terms"),
    page("/security"),
    page("/license"),
  ];
}
