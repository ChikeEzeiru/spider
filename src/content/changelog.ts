/** Spider's releases, newest first. */

export interface Release {
  version: string;
  /** ISO date. */
  date: string;
  title: string;
  changes: { kind: "New" | "Improved"; text: string }[];
  code?: { name: string; lines: string[] };
}

export const RELEASES: Release[] = [
  {
    version: "0.4.0",
    date: "2026-11-10",
    title: "Queued jobs and Railway deploys",
    changes: [
      { kind: "New", text: "Jobs can be queued from any action, as well as scheduled with cron." },
      { kind: "Improved", text: "Failed jobs retry with backoff, and only one instance picks each job up." },
      { kind: "New", text: "spider deploy now supports Railway alongside Fly." },
    ],
    code: {
      name: "src/server/invites.ts",
      lines: [
        "export async function inviteUser({ email }, { jobs }) {",
        "  await jobs.sendInvite.enqueue({ email });",
        "}",
      ],
    },
  },
  {
    version: "0.3.0",
    date: "2026-10-14",
    title: "Live caches and GitHub sign-in",
    changes: [
      { kind: "New", text: "Operations declare the entities they read, and their caches refresh when an action writes to one." },
      { kind: "New", text: "GitHub sign-in joins email and password." },
      { kind: "New", text: "spider db studio opens a browser view of the development database." },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-09-16",
    title: "Email and private routes",
    changes: [
      { kind: "New", text: "Email: pick a provider in the spec and send from actions and jobs." },
      { kind: "Improved", text: "Private routes redirect signed-out visitors to the sign-in page." },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-08-19",
    title: "First public release",
    changes: [{ kind: "New", text: "Routing, auth, typed operations and Prisma entities from one spec." }],
  },
];

export const LATEST = RELEASES[0];
