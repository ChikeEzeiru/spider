export type Verdict = "supported" | "extension";

export interface Need {
  id: string;
  label: string;
  verdict: Verdict;
  note: string;
  /** How to wire it up, for needs met through an extension point. */
  code?: string;
}

/** Every need is either built in or one extension point away. */
export const NEEDS: Need[] = [
  { id: "postgres", label: "PostgreSQL", verdict: "supported", note: "The default production database." },
  { id: "sqlite", label: "SQLite", verdict: "supported", note: "Built in for local dev; switch to Postgres to deploy." },
  { id: "tailwind", label: "Tailwind CSS", verdict: "supported", note: "Works out of the box through Vite." },
  {
    id: "webhooks",
    label: "Stripe webhooks",
    verdict: "extension",
    note: "Declare a custom API route.",
    code: 'api("POST /webhooks/stripe", { fn: "@/server/stripe" })',
  },
  {
    id: "uploads",
    label: "File uploads to S3",
    verdict: "extension",
    note: "Sign upload URLs from a custom API route.",
    code: 'api("POST /uploads/sign", { fn: "@/server/uploads" })',
  },
  {
    id: "middleware",
    label: "Express middleware",
    verdict: "extension",
    note: "Extend the default middleware stack.",
    code: 'defaults.set("rateLimit", limit({ max: 100 }))',
  },
  {
    id: "websockets",
    label: "WebSockets",
    verdict: "extension",
    note: "Attach Socket.IO in the server setup function.",
    code: 'server: { setup: "@/server/sockets" }',
  },
  {
    id: "redis",
    label: "Redis cache",
    verdict: "extension",
    note: "Create the client once in server setup, then use it in operations.",
    code: 'server: { setup: "@/server/redis" }',
  },
];

export const DEFAULT_PICKS = ["postgres", "webhooks", "uploads"];
