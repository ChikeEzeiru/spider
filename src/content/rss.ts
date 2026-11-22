/** A minimal RSS 2.0 feed, built from the request's own origin so links work on every deploy. */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function rss(
  request: Request,
  feed: { title: string; path: string; description: string },
  items: { title: string; path: string; date: string; description: string }[],
) {
  const origin = new URL(request.url).origin;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(feed.title)}</title>
<link>${origin}${feed.path}</link>
<description>${esc(feed.description)}</description>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${origin}${i.path}</link>
<guid>${origin}${i.path}</guid>
<pubDate>${new Date(`${i.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${esc(i.description)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
