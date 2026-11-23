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
  [
    group("Resources", ["Tutorials", "Starter templates", "Migration guides", "Showcase", "Roadmap"], {
      Tutorials: "/tutorials",
      "Starter templates": "/templates",
      "Migration guides": "/migrations",
      Showcase: "/examples",
      Roadmap: "/roadmap",
    }),
  ],
  [
    group("Community", ["Discord", "Discussions", "Contributing", "Events"], {
      Discord: "https://discord.com",
      Discussions: "/discussions",
      Contributing: "/contributing",
      Events: "/events",
    }),
  ],
  [
    group("Company", ["About", "Careers", "Brand kit", "Contact"], {
      About: "/about",
      Careers: "/careers",
      "Brand kit": "/brand",
      Contact: "/contact",
    }),
    // As with the socials, the comparisons go to each project's homepage while Spider is a concept.
    group("Compare", ["Next.js", "RedwoodJS", "T3 Stack"], {
      "Next.js": "https://nextjs.org",
      RedwoodJS: "https://redwoodjs.com",
      "T3 Stack": "https://create.t3.gg",
    }),
  ],
  [
    group("Legal", ["Privacy policy", "Terms of service", "Security", "License"], {
      "Privacy policy": "/privacy",
      "Terms of service": "/terms",
      Security: "/security",
      License: "/license",
    }),
    // Spider is a concept, so the socials go to each service's homepage.
    group("Socials", ["GitHub", "X", "LinkedIn", "YouTube"], {
      GitHub: "https://github.com",
      X: "https://x.com",
      LinkedIn: "https://www.linkedin.com",
      YouTube: "https://www.youtube.com",
    }),
  ],
];

export const STATUS_URL = "/status";
