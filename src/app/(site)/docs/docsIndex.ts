export type DocLink = { href: string; label: string };

/** Every docs page, in reading order, grouped as the sidebar shows them. */
export const DOC_GROUPS: { title: string; pages: DocLink[] }[] = [
  {
    title: "Get started",
    pages: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/quickstart", label: "Quickstart" },
      { href: "/docs/project-structure", label: "Project structure" },
      { href: "/docs/deploying", label: "Deploying" },
    ],
  },
  {
    title: "Core concepts",
    pages: [
      { href: "/docs/spec", label: "The spec" },
      { href: "/docs/routing", label: "Routing" },
      { href: "/docs/auth", label: "Auth" },
      { href: "/docs/operations", label: "Operations" },
      { href: "/docs/jobs", label: "Jobs" },
      { href: "/docs/email", label: "Email" },
      { href: "/docs/entities", label: "Entities" },
    ],
  },
  {
    title: "Reference",
    pages: [
      { href: "/docs/cli", label: "CLI reference" },
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
];

/** The docs pages themselves, without links that lead out of the docs. */
export const DOCS: DocLink[] = DOC_GROUPS.flatMap((g) => g.pages).filter((p) => p.href.startsWith("/docs"));

export const groupOf = (href: string) => DOC_GROUPS.find((g) => g.pages.some((p) => p.href === href))?.title;
