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
  [
    group("Framework", ["Overview", "Routing", "Auth", "Typed operations", "Jobs", "Email", "Entities", "Deployment"], {
      Overview: "/product",
      Routing: "/product#routing",
      Auth: "/product#auth",
      "Typed operations": "/product#typed-operations",
      Jobs: "/product#jobs",
      Email: "/product#email",
      Entities: "/product#entities",
      Deployment: "/product#deployment",
    }),
  ],
  [
    group("Developers", ["Docs", "Quickstart", "CLI reference", "Examples", "Changelog", "Blog"], {
      Docs: "/docs",
      Quickstart: "/docs/quickstart",
      "CLI reference": "/docs/cli",
      Examples: "/examples",
      Changelog: "/changelog",
      Blog: "/blog",
    }),
  ],
  [group("Resources", ["Tutorials", "Starter templates", "Migration guides", "Showcase", "Roadmap"], { Showcase: "/examples" })],
  [group("Community", ["Discord", "Discussions", "Contributing", "Events"])],
  [
    group("Company", ["About", "Careers", "Brand kit", "Contact"], { About: "/about", Contact: "/contact" }),
    group("Compare", ["Next.js", "RedwoodJS", "T3 Stack"]),
  ],
  [
    group("Legal", ["Privacy policy", "Terms of service", "Security", "License"], {
      "Privacy policy": "/privacy",
      "Terms of service": "/terms",
      Security: "/security",
      License: "/license",
    }),
    group("Socials", ["GitHub", "X", "LinkedIn", "YouTube"], { GitHub: GITHUB_URL }),
  ],
];

export const STATUS_URL = "#";
