import type { Metadata } from "next";
import { POSTS } from "@/content/blog";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "Blog · Spider",
  description: "News, releases and engineering notes from the Spider team.",
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

export default function BlogPage() {
  return <BlogIndex posts={POSTS} />;
}
