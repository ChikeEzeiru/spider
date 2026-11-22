import { POSTS } from "@/content/blog";
import { rss } from "@/content/rss";

export function GET(request: Request) {
  return rss(
    request,
    { title: "Spider blog", path: "/blog", description: "Releases, design decisions and how Spider works under the hood." },
    POSTS.map((p) => ({ title: p.title, path: `/blog/${p.slug}`, date: p.date, description: p.excerpt })),
  );
}
