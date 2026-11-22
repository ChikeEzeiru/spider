import { NextResponse, type NextRequest } from "next/server";
import { POSTS } from "@/content/blog";

/*
 * Unknown blog posts get a real 404 status. The post page reads its slug inside Suspense, so by the
 * time it finds no post the response has already started with a 200 (Next 16 with Cache Components).
 * Checking the slug here, before rendering, lets the not-found page go out as a 404 instead.
 */

const KNOWN = new Set(POSTS.map((post) => post.slug));

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slug || KNOWN.has(slug) || slug === "rss.xml") return NextResponse.next();
  // No route matches this path, so Next renders the site's 404 page with a 404 status.
  return NextResponse.rewrite(new URL("/_missing-post", request.url));
}

export const config = {
  matcher: "/blog/:slug",
};
