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
      { type: "p", text: "This post walks through what happens between those three steps, and why we chose to generate the layer in the middle instead of asking you to write it." },
      { type: "h2", text: "Declaring an operation" },
      { type: "p", text: "Operations come in two kinds. A query reads data and an action changes it. Each one names the entities it touches, which is what lets Spider keep the screen up to date later on." },
      { type: "code", name: "spider.config.ts", lines: ["operations: {", "  getTasks: query({ uses: [\"Task\"] }),", "  createTask: action({ writes: [\"Task\"] }),", "},"] },
      { type: "p", text: "The function itself is ordinary server code. Its first argument is whatever the client sends, and the second is a context with the signed-in user, the database client and the rest of the app's services." },
      { type: "code", name: "src/server/tasks.ts", lines: ["export async function getTasks(_, { user, db }) {", "  return db.task.findMany({ where: { userId: user.id } });", "}"] },
      { type: "h2", text: "Calling it from React" },
      { type: "p", text: "On the client, Spider generates the hook from the same declaration. There's no fetch to write, no route to name, and no response type to keep in step with the server." },
      { type: "code", name: "src/pages/Tasks.tsx", lines: ["export default function Tasks() {", "  const { data, isLoading } = useQuery(getTasks);", "  if (isLoading) return <Spinner />;", "  return <TaskList tasks={data} />;", "}"] },
      { type: "p", text: "The type of data comes straight from the server function's return type. If you add a field to the query, the component can use it right away. If you remove one, the compiler points at every component that still reads it." },
      { type: "p", text: "Actions work the same way through useAction. The input type comes from the function's first argument, so calling an action with the wrong shape is a compile error rather than a 400 response in production." },
      { type: "code", name: "src/pages/NewTask.tsx", lines: ["const create = useAction(createTask);", "", "await create({ title });"] },
      { type: "h2", text: "Caches that know what changed" },
      { type: "p", text: "Each operation lists the entities it reads. When an action writes to one of them, Spider invalidates the queries that depend on it, so the screen updates without manual cache keys." },
      { type: "p", text: "In practice that means creating a task refreshes every list of tasks on the page, and nothing else. A query that only reads users stays cached. You never write a key like [\"tasks\", userId], and you can't forget to clear one." },
      { type: "quote", text: "Declaring what an operation reads is one line. Hunting down a stale cache is an afternoon." },
      { type: "h2", text: "Errors travel too" },
      { type: "p", text: "When a server function throws an HttpError, the client receives the same status and message. The hook exposes it as error, typed, so a page can show a not-found state without parsing anything." },
      { type: "code", name: "src/server/tasks.ts", lines: ["const task = await db.task.findUnique({ where: { id } });", "if (!task) throw new HttpError(404, \"No such task\");"] },
      { type: "p", text: "Any other exception is logged on the server and reaches the client as a generic 500, so stack traces and database messages never leave your server." },
      { type: "h2", text: "What we left out" },
      { type: "p", text: "Operations are for your own client. They aren't a public API, and their URLs aren't meant to be stable. If other apps need to call yours, write a plain HTTP endpoint next to your operations and treat it like any other public contract. Keeping the two apart means we can change how operations travel over the wire without breaking anyone." },
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
      { type: "h2", text: "A job on a schedule" },
      { type: "p", text: "A scheduled job is a cron expression in the spec and a function in your code. Schedules run in UTC, so a digest set for nine on Monday goes out at the same moment wherever your servers are." },
      { type: "code", name: "spider.config.ts", lines: ["jobs: {", "  digest: job({ cron: \"0 9 * * 1\" }),", "},"] },
      { type: "code", name: "src/jobs/digest.ts", lines: ["export async function digest(_, { db, email }) {", "  for (const user of await db.user.findMany()) {", "    const open = await db.task.count({ where: { userId: user.id, done: false } });", "    await email.send({ to: user.email, subject: \"Your week in tasks\", template: Digest, props: { open } });", "  }", "}"] },
      { type: "p", text: "The function gets the same context as an operation: the database client, email and the other jobs. There's no separate worker codebase to keep in step with the app." },
      { type: "h2", text: "Queueing work from an action" },
      { type: "p", text: "Leave out the schedule and a job only runs when something queues it. That's how you move slow work out of a request, like sending an invite email after a user is added." },
      { type: "code", name: "src/server/invites.ts", lines: ["export async function inviteUser({ email }, { jobs }) {", "  await jobs.sendInvite.enqueue({ email });", "}"] },
      { type: "p", text: "The action returns as soon as the job is saved, and the user sees their screen update straight away. The email goes out a moment later." },
      { type: "h2", text: "How a run gets claimed" },
      { type: "p", text: "Queued and scheduled runs are rows in a table in your database. A runner picks up the next row inside a transaction and locks it, skipping rows another runner has already locked. On Postgres that's SELECT \u2026 FOR UPDATE SKIP LOCKED. Two servers can poll the same table and never run the same job twice." },
      { type: "p", text: "Because the queue lives in your database, it's backed up with everything else, you can inspect it with spider db studio, and a job queued in the same transaction as the data it needs can't run before that data exists." },
      { type: "quote", text: "The queue is a table you already back up, not a service you have to page someone about." },
      { type: "h2", text: "Retries, timeouts and concurrency" },
      { type: "p", text: "A run that throws is retried with backoff, three times by default. A run that takes longer than its timeout is stopped and counted as failed. Concurrency sets how many runs of the same job may happen at once, which is one unless you say otherwise." },
      { type: "code", name: "spider.config.ts", lines: ["jobs: {", "  syncCatalogue: job({ cron: \"0 2 * * *\", retries: 5, timeout: 900 }),", "  sendInvite: job({ concurrency: 4 }),", "},"] },
      { type: "h2", text: "Running jobs on their own" },
      { type: "p", text: "By default the runner lives inside your app's server process, which is right for most apps. When jobs get heavy enough to slow down requests, start a second process that only runs jobs. It uses the same build and the same database." },
      { type: "code", name: "Terminal", lines: ["spider start --jobs-only"] },
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
