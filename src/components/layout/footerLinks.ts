import { GITHUB_URL } from "./navLinks";

export interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const group = (title: string, labels: string[], hrefs: Record<string, string> = {}): LinkGroup => ({
  title,
  links: labels.map((label) => ({ label, href: hrefs[label] ?? "#" })),
});

/** Footer columns, left to right; a column with two groups stacks them. */
export const FOOTER_COLUMNS: LinkGroup[][] = [
  [group("Framework", ["Overview", "Routing", "Auth", "Typed operations", "Jobs", "Email", "Entities", "Deployment"])],
  [group("Developers", ["Docs", "Quickstart", "CLI reference", "Examples", "Changelog", "Blog"])],
  [group("Resources", ["Tutorials", "Starter templates", "Migration guides", "Showcase", "Roadmap"])],
  [group("Community", ["Discord", "Discussions", "Contributing", "Events"])],
  [group("Company", ["About", "Careers", "Brand kit", "Contact"]), group("Compare", ["Next.js", "RedwoodJS", "T3 Stack"])],
  [
    group("Legal", ["Privacy policy", "Terms of use", "Security", "License"]),
    group("Socials", ["GitHub", "X", "LinkedIn", "YouTube"], { GitHub: GITHUB_URL }),
  ],
];

export const STATUS_URL = "#";
