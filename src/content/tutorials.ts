import type { Block } from "./blog";

/** Step-by-step tutorials. Each section is a list of blocks, like a blog post body. */

export interface Tutorial {
  slug: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate";
  minutes: number;
  /** The Spider features it touches, shown as tags. */
  features: string[];
  sections: { title: string; blocks: Block[] }[];
}

export const TUTORIALS: Tutorial[] = [
  {
    slug: "build-a-task-app",
    title: "Build a task app",
    summary: "Create a Spider app, model tasks in the database, and list them on a page only signed-in users can see.",
    level: "Beginner",
    minutes: 15,
    features: ["Routing", "Auth", "Typed operations", "Entities"],
    sections: [
      {
        title: "Create the app",
        blocks: [
          { type: "p", text: "Start from the basic starter. It comes with email sign-in, a home page and an empty spec." },
          { type: "code", name: "Terminal", lines: ["npx spider new tasks", "cd tasks", "spider dev"] },
          { type: "p", text: "Open localhost:3000 and sign up with any email. In development, sign-in links are printed in the terminal instead of being sent." },
        ],
      },
      {
        title: "Model a task",
        blocks: [
          { type: "p", text: "Tasks belong to a user, so the model needs a title, a done flag and the owner's id. Add it to the Prisma schema next to the User model the starter created." },
          { type: "code", name: "schema.prisma", lines: ["model Task {", "  id     Int     @id @default(autoincrement())", "  title  String", "  done   Boolean @default(false)", "  user   User    @relation(fields: [userId], references: [id])", "  userId Int", "}"] },
          { type: "p", text: "Then create the table. Spider generates the migration and applies it to your development database." },
          { type: "code", name: "Terminal", lines: ["spider db migrate"] },
        ],
      },
      {
        title: "Read and write tasks",
        blocks: [
          { type: "p", text: "Declare one query and one action in the spec. The entity names tell Spider which screens to refresh when tasks change." },
          { type: "code", name: "spider.config.ts", lines: ["operations: {", "  getTasks: query({ uses: [\"Task\"] }),", "  createTask: action({ writes: [\"Task\"] }),", "},"] },
          { type: "code", name: "src/server/tasks.ts", lines: ["export async function getTasks(_, { user, db }) {", "  return db.task.findMany({ where: { userId: user.id } });", "}", "", "export async function createTask({ title }, { user, db }) {", "  return db.task.create({ data: { title, userId: user.id } });", "}"] },
        ],
      },
      {
        title: "Build the page",
        blocks: [
          { type: "p", text: "Add a route for the page and mark it private. Signed-out visitors are sent to the sign-in page, and the server rejects their requests too." },
          { type: "code", name: "spider.config.ts", lines: ["routes: {", "  \"/tasks\": page(Tasks, { auth: true }),", "},"] },
          { type: "code", name: "src/pages/Tasks.tsx", lines: ["export default function Tasks() {", "  const { data: tasks } = useQuery(getTasks);", "  const create = useAction(createTask);", "", "  return (", "    <>", "      <NewTaskForm onSubmit={(title) => create({ title })} />", "      <TaskList tasks={tasks} />", "    </>", "  );", "}"] },
          { type: "p", text: "Add a task and the list updates on its own: createTask writes to Task, and getTasks uses it." },
        ],
      },
    ],
  },
  {
    slug: "add-github-sign-in",
    title: "Add sign-in with GitHub",
    summary: "Let people sign in with their GitHub account alongside email, and show who's signed in.",
    level: "Beginner",
    minutes: 10,
    features: ["Auth"],
    sections: [
      {
        title: "Turn on the method",
        blocks: [
          { type: "p", text: "Sign-in methods are a list in the spec. Add github next to email." },
          { type: "code", name: "spider.config.ts", lines: ["auth: {", "  user: \"User\",", "  methods: [\"email\", \"github\"],", "},"] },
        ],
      },
      {
        title: "Add your GitHub credentials",
        blocks: [
          { type: "p", text: "Create an OAuth app in your GitHub developer settings. Set its callback URL to your app's address followed by /auth/github/callback, then copy the client id and secret into your environment." },
          { type: "code", name: ".env", lines: ["GITHUB_CLIENT_ID=your-client-id", "GITHUB_CLIENT_SECRET=your-client-secret"] },
          { type: "p", text: "Restart spider dev so it picks up the new variables." },
        ],
      },
      {
        title: "Show the button",
        blocks: [
          { type: "p", text: "The SignIn component shows a button for every method in the spec, so there's nothing else to change on the login page." },
          { type: "code", name: "src/pages/Login.tsx", lines: ["import { SignIn } from \"spider\";", "", "export default function Login() {", "  return <SignIn redirect=\"/tasks\" />;", "}"] },
        ],
      },
      {
        title: "Show who's signed in",
        blocks: [
          { type: "p", text: "useUser returns the signed-in user, or null. People who sign in with GitHub get the same User record as everyone else, so the rest of the app doesn't need to know how they signed in." },
          { type: "code", name: "src/components/Account.tsx", lines: ["const user = useUser();", "if (!user) return null;", "return <button onClick={signOut}>Sign out {user.email}</button>;"] },
        ],
      },
    ],
  },
  {
    slug: "send-a-weekly-digest",
    title: "Send a weekly digest email",
    summary: "Write an email as a React component and send it to every user on a schedule.",
    level: "Intermediate",
    minutes: 20,
    features: ["Jobs", "Email"],
    sections: [
      {
        title: "Choose a provider",
        blocks: [
          { type: "p", text: "Pick an email provider once in the spec. In development, Spider prints emails to the terminal instead of sending them." },
          { type: "code", name: "spider.config.ts", lines: ["email: {", "  provider: \"resend\",", "  from: \"hello@example.com\",", "},"] },
        ],
      },
      {
        title: "Write the email",
        blocks: [
          { type: "p", text: "Templates are React components in src/emails. They take props like any other component." },
          { type: "code", name: "src/emails/Digest.tsx", lines: ["export default function Digest({ open }: { open: number }) {", "  return <p>You have {open} open tasks this week.</p>;", "}"] },
        ],
      },
      {
        title: "Schedule the job",
        blocks: [
          { type: "p", text: "Declare a job with a cron expression. This one runs at 9:00 UTC every Monday." },
          { type: "code", name: "spider.config.ts", lines: ["jobs: {", "  digest: job({ cron: \"0 9 * * 1\" }),", "},"] },
          { type: "code", name: "src/jobs/digest.ts", lines: ["export async function digest(_, { db, email }) {", "  const users = await db.user.findMany();", "  for (const user of users) {", "    const open = await db.task.count({ where: { userId: user.id, done: false } });", "    await email.send({", "      to: user.email,", "      subject: \"Your week in tasks\",", "      template: Digest,", "      props: { open },", "    });", "  }", "}"] },
        ],
      },
      {
        title: "Try it without waiting a week",
        blocks: [
          { type: "p", text: "Queue the job yourself from an action while you're building it. The email appears in the spider dev output a moment later." },
          { type: "code", name: "src/server/dev.ts", lines: ["export async function sendDigestNow(_, { jobs }) {", "  await jobs.digest.enqueue();", "}"] },
          { type: "p", text: "If sending fails, the run is retried with backoff, three times by default. Set retries on the job to change that." },
        ],
      },
    ],
  },
  {
    slug: "deploy-to-fly",
    title: "Deploy to Fly",
    summary: "Ship a Spider app to Fly with a Postgres database, its secrets and its migrations.",
    level: "Intermediate",
    minutes: 15,
    features: ["Deployment", "Entities"],
    sections: [
      {
        title: "Build it locally first",
        blocks: [
          { type: "p", text: "A production build catches type errors and missing environment variables before they reach a server." },
          { type: "code", name: "Terminal", lines: ["spider build", "spider start"] },
        ],
      },
      {
        title: "Set your secrets",
        blocks: [
          { type: "p", text: "Spider needs a database address, a secret for session cookies, and the public address of the app. Keep SPIDER_SECRET the same across deploys, or everyone is signed out." },
          { type: "code", name: "Terminal", lines: ["fly secrets set DATABASE_URL=postgres://...", "fly secrets set SPIDER_SECRET=a-long-random-string", "fly secrets set APP_URL=https://your-app.fly.dev"] },
        ],
      },
      {
        title: "Deploy",
        blocks: [
          { type: "p", text: "spider deploy builds the app, packages the client and server together, and hands the result to Fly." },
          { type: "code", name: "Terminal", lines: ["spider deploy fly"] },
          { type: "p", text: "Committed migrations run before the new version starts taking traffic, so the database is always ready for the code that uses it." },
        ],
      },
      {
        title: "Run jobs separately when you need to",
        blocks: [
          { type: "p", text: "Jobs run inside the server process by default. If they start to slow requests down, run a second Fly process with only the job runner." },
          { type: "code", name: "Terminal", lines: ["spider start --jobs-only"] },
        ],
      },
    ],
  },
];

export const tutorialBySlug = (slug: string) => TUTORIALS.find((t) => t.slug === slug);
