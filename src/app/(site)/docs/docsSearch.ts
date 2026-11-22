import { DOCS } from "./docsIndex";

/*
 * Full-text search over the docs, built in the browser from the pages themselves.
 * The first search fetches each docs page (static HTML), splits it into its sections at each h2,
 * and keeps the text in memory for the rest of the visit. Nothing has to be kept in sync by hand.
 */

export interface DocSection {
  href: string;
  page: string;
  /** The section's heading, or null for the text before the first heading. */
  heading: string | null;
  /** The heading's id, to link straight to the section. */
  id: string | null;
  text: string;
}

export interface SearchHit extends DocSection {
  /** A short passage around the first match, split so the matched words can be marked. */
  snippet: { text: string; match: boolean }[];
}

let index: Promise<DocSection[]> | null = null;

/** The search index, built once per visit. */
export function loadIndex() {
  index ??= Promise.all(DOCS.map(readPage)).then((pages) => pages.flat());
  return index;
}

async function readPage({ href, label }: { href: string; label: string }): Promise<DocSection[]> {
  try {
    const html = await (await fetch(href)).text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const summary = doc.querySelector("main header p.max-w-180")?.textContent ?? "";
    const sections = [...doc.querySelectorAll("#docs-article > section")].map((section) => {
      const h2 = section.querySelector("h2");
      const heading = h2?.textContent?.trim() || null;
      h2?.remove();
      // Drop code-block chrome (file name, line numbers, "$" prompts): it isn't content.
      section.querySelectorAll("figcaption, .select-none").forEach((el) => el.remove());
      // Keep words in separate cells, items and lines apart once the markup is gone.
      section.querySelectorAll("p, li, td, th, h3, h4, div, tr").forEach((el) => el.append(" "));
      return { href, page: label, heading, id: h2?.id || null, text: tidy(section.textContent ?? "") };
    });
    // The summary belongs to the top of the page: fold it into any text before the first heading.
    const [first, ...rest] = sections;
    if (first && !first.heading) return [{ ...first, text: tidy(`${summary} ${first.text}`) }, ...rest];
    return [{ href, page: label, heading: null, id: null, text: tidy(summary) }, ...sections];
  } catch {
    // A page that fails to load just isn't searchable this visit.
    return [];
  }
}

const tidy = (text: string) => text.replace(/\s+/g, " ").trim();

/** Sections containing every word of the query, best first: title, then heading, then body matches. */
export function search(sections: DocSection[], query: string, limit = 8): SearchHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  return sections
    .map((section) => {
      const page = section.page.toLowerCase();
      const heading = (section.heading ?? "").toLowerCase();
      const body = section.text.toLowerCase();
      const all = `${page} ${heading} ${body}`;
      if (!words.every((w) => all.includes(w))) return null;
      const score = words.reduce(
        (sum, w) => sum + (page.includes(w) ? 3 : 0) + (heading.includes(w) ? 2 : 0) + (body.includes(w) ? 1 : 0),
        0,
      );
      return { section, score };
    })
    .filter((hit): hit is { section: DocSection; score: number } => hit !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ section }) => ({ ...section, snippet: snippet(section.text, words) }));
}

/** About 120 characters around the first matched word, with every matched word marked. */
function snippet(text: string, words: string[]): SearchHit["snippet"] {
  const lower = text.toLowerCase();
  const first = Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0));
  if (!Number.isFinite(first)) return [{ text: text.slice(0, 120) + (text.length > 120 ? "…" : ""), match: false }];

  const start = Math.max(0, first - 40);
  const end = Math.min(text.length, start + 120);
  const passage = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");

  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return passage
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({ text: part, match: words.includes(part.toLowerCase()) }));
}
