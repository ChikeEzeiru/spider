/** Blog posts. Each body is a list of blocks, so posts need no Markdown pipeline. */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; name: string; lines: string[] };

export interface Post {
  slug: string;
  /** The writer's first name; bylines read "Firstname@Spider". */
  author: string;
  title: string;
  /** ISO date. */
  date: string;
  tag: "Announcement" | "Engineering";
  excerpt: string;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "introducing-spider",
    author: "Pete",
    title: "Introducing Spider",
    date: "2026-11-02",
    tag: "Announcement",
    excerpt: "A full-stack TypeScript framework where one spec wires your React client, Node.js server, auth, jobs and email.",
    body: [
      { type: "p", text: "Most full-stack apps spend their first weeks on the same plumbing: a router, a session store, an API layer that mirrors the database, a queue for background work, and an email provider. None of it is the product, and all of it has to be kept in sync by hand." },
      { type: "p", text: "Spider starts from a different place. You describe the app in a single TypeScript spec: its routes, the sign-in methods it supports, the operations the client can call, the jobs it runs, and how it sends email. Spider reads that spec and connects your React pages, server functions and Prisma models for you." },
      { type: "code", name: "spider.config.ts", lines: ["export default app({", "  auth: { user: \"User\", methods: [\"email\", \"github\"] },", "  routes: { \"/tasks\": page(Tasks, { auth: true }) },", "  operations: { getTasks: query({ uses: [\"Task\"] }) },", "  jobs: { digest: job({ cron: \"0 9 * * 1\" }) },", "});"] },
      { type: "quote", text: "The spec says what the app is. Your code says how it behaves." },
      { type: "h2", text: "Your code, not ours" },
      { type: "p", text: "The spec declares structure; everything else is plain React and Node.js. Pages are ordinary components, operations are ordinary async functions, and the data model is an ordinary Prisma schema. If you outgrow Spider, the code you wrote still stands on its own." },
      { type: "h2", text: "What's next" },
      { type: "p", text: "Spider is open source and early. Start with the quickstart, build something small, and tell us where it got in your way. The roadmap is shaped by what people build." },
    ],
  },
  {
    slug: "typed-operations-end-to-end",
    author: "Maya",
    title: "Typed operations, end to end",
    date: "2026-10-20",
    tag: "Engineering",
    excerpt: "How a server function becomes a fully typed React hook, without an API layer in between.",
    body: [
      { type: "p", text: "An operation in Spider is an async function on the server that the client can call. You declare it in the spec, write it next to your other server code, and call it from React with a hook. The types flow the whole way: change what the function returns, and every component that uses it fails to compile until it's updated." },
      { type: "code", name: "src/server/tasks.ts", lines: ["export async function getTasks(_, { user, db }) {", "  return db.task.findMany({ where: { user } });", "}"] },
      { type: "p", text: "On the client, Spider generates the hook from the same declaration. There's no fetch to write, no route to name, and no response type to keep in step with the server." },
      { type: "code", name: "src/pages/Tasks.tsx", lines: ["export default function Tasks() {", "  const { data } = useQuery(getTasks);", "  return <TaskList tasks={data} />;", "}"] },
      { type: "h2", text: "Caches that know what changed" },
      { type: "p", text: "Each operation lists the entities it reads. When an action writes to one of them, Spider invalidates the queries that depend on it, so the screen updates without manual cache keys." },
    ],
  },
  {
    slug: "background-jobs-without-a-queue-service",
    author: "Tomi",
    title: "Background jobs without a queue service",
    date: "2026-10-06",
    tag: "Engineering",
    excerpt: "Scheduled and queued work that runs on your own server, with the same database and email access as the rest of the app.",
    body: [
      { type: "p", text: "Sooner or later every app needs to do something later: send a weekly digest, sync a catalogue overnight, retry a payment. The usual answer is another service to run and another set of credentials to manage." },
      { type: "p", text: "Spider runs jobs on your own server, backed by the database you already have. Declare a job with a schedule, or queue one from an action, and Spider takes care of running it, retrying it when it fails, and making sure only one instance picks it up." },
      { type: "code", name: "src/jobs/digest.ts", lines: ["export async function digest({ db, email }) {", "  const open = await db.task.count({ done: false });", "  await email.send({ subject: `${open} open tasks` });", "}"] },
      { type: "h2", text: "When you need more" },
      { type: "p", text: "For heavy workloads, a job can hand off to an external queue through an extension. The declaration in the spec stays the same, so moving a job is a configuration change, not a rewrite." },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "20 Oct 2026", as the designs write dates. Spelled out by hand so September is never "Sept". */
export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

/** Minutes to read a post at about 200 words a minute, counting its code. */
export const readingTime = (post: Post) => {
  const words = post.body
    .flatMap((b) => (b.type === "code" ? b.lines : [b.text]))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

/** The post's first code excerpt, used as its cover on the blog index. */
export const coverOf = (post: Post) => post.body.find((b) => b.type === "code");
