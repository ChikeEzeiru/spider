import { RELEASES } from "@/content/changelog";
import { rss } from "@/content/rss";

export function GET(request: Request) {
  return rss(
    request,
    { title: "Spider changelog", path: "/changelog", description: "Every Spider release, newest first." },
    RELEASES.map((r) => ({
      title: `v${r.version}: ${r.title}`,
      path: `/changelog#v${r.version}`,
      date: r.date,
      description: r.changes.map((c) => `${c.kind}: ${c.text}`).join(" "),
    })),
  );
}
