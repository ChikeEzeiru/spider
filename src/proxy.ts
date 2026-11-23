import { NextResponse, type NextRequest } from "next/server";
import { POSTS } from "@/content/blog";
import { TUTORIALS } from "@/content/tutorials";

/*
 * Unknown blog posts and tutorials get a real 404 status. Those pages read their slug inside Suspense, so by the
 * time it finds no post the response has already started with a 200 (Next 16 with Cache Components).
 * Checking the slug here, before rendering, lets the not-found page go out as a 404 instead.
 */

const KNOWN: Record<string, Set<string>> = {
  blog: new Set([...POSTS.map((post) => post.slug), "rss.xml"]),
  tutorials: new Set(TUTORIALS.map((tutorial) => tutorial.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (!slug || KNOWN[section]?.has(slug)) return NextResponse.next();
  // No route matches this path, so Next renders the site's 404 page with a 404 status.
  return NextResponse.rewrite(new URL("/_missing-post", request.url));
}

export const config = {
  matcher: ["/blog/:slug", "/tutorials/:slug"],
};
