import type { FC, SVGProps } from "react";
import { Browser, Clock, Code01, Database01, Lock01, LogIn01, Mail01, Route } from "@untitledui/icons";

export type NodeId = "auth" | "login" | "route" | "page" | "entity" | "query" | "job" | "email";

export interface AppNode {
  id: NodeId;
  name: string;
  kind: string;
  /** The config that shapes it, shown as a pill. */
  tag: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  /** Grid placement; neighbours in the graph sit next to each other. */
  cell: string;
}

export const NODES: AppNode[] = [
  { id: "auth", name: "Auth", kind: "Sessions", tag: "User", icon: Lock01, cell: "col-start-1 row-start-1" },
  { id: "route", name: "/tasks", kind: "Route", tag: "auth", icon: Route, cell: "col-start-2 row-start-1" },
  { id: "page", name: "Tasks", kind: "React page", tag: ".tsx", icon: Browser, cell: "col-start-3 row-start-1" },
  { id: "login", name: "Login", kind: "React page", tag: "/login", icon: LogIn01, cell: "col-start-1 row-start-2" },
  { id: "entity", name: "Task", kind: "Entity", tag: "Prisma", icon: Database01, cell: "col-start-2 row-start-2" },
  { id: "query", name: "getTasks", kind: "Query", tag: "typed", icon: Code01, cell: "col-start-3 row-start-2" },
  { id: "job", name: "digest", kind: "Job", tag: "@weekly", icon: Clock, cell: "col-start-2 row-start-3" },
  { id: "email", name: "Digest", kind: "Email", tag: "Resend", icon: Mail01, cell: "col-start-3 row-start-3" },
];

/** Silk between neighbouring nodes. */
export const EDGES: [NodeId, NodeId][] = [
  ["auth", "route"],
  ["auth", "login"],
  ["route", "page"],
  ["page", "query"],
  ["entity", "query"],
  ["entity", "job"],
  ["job", "email"],
];

export interface Excerpt {
  name: string;
  start: number;
  lines: string[];
}

export interface Feature {
  name: string;
  focus: NodeId;
  /** Nodes the feature reaches; edges between any two of them light up. */
  reach: NodeId[];
  spec: Excerpt;
  code: Excerpt;
}

/** In the order the section copy lists them. */
export const FEATURES: Feature[] = [
  {
    name: "Routing",
    focus: "route",
    reach: ["route", "page"],
    spec: {
      name: "spider.config.ts",
      start: 8,
      lines: ["routes: {", '  "/tasks": page(Tasks, { auth: true }),', '  "/login": page(Login),', "},"],
    },
    code: {
      name: "src/pages/Tasks.tsx",
      start: 4,
      lines: [
        "export default function Tasks() {",
        "  const { data } = useQuery(getTasks);",
        "  return <TaskList tasks={data} />;",
      ],
    },
  },
  {
    name: "Auth",
    focus: "auth",
    reach: ["auth", "route", "login"],
    spec: {
      name: "spider.config.ts",
      start: 2,
      lines: ["auth: {", '  user: "User",', '  methods: ["email", "github"],', '  onFail: "/login",', "},"],
    },
    code: {
      name: "src/pages/Login.tsx",
      start: 3,
      lines: ["export default function Login() {", '  return <SignIn redirect="/tasks" />;', "}"],
    },
  },
  {
    name: "Operations",
    focus: "query",
    reach: ["page", "query", "entity"],
    spec: {
      name: "spider.config.ts",
      start: 13,
      lines: ["operations: {", '  getTasks: query({ uses: ["Task"] }),', "},"],
    },
    code: {
      name: "src/server/tasks.ts",
      start: 3,
      lines: [
        "export async function getTasks(_, { user, db }) {",
        "  return db.task.findMany({ where: { user } });",
        "}",
      ],
    },
  },
  {
    name: "Jobs",
    focus: "job",
    reach: ["job", "entity"],
    spec: {
      name: "spider.config.ts",
      start: 16,
      lines: ["jobs: {", '  digest: job({ cron: "0 9 * * 1" }),', "},"],
    },
    code: {
      name: "src/jobs/digest.ts",
      start: 3,
      lines: [
        "export async function digest({ db, email }) {",
        "  const open = await db.task.count({ done: false });",
      ],
    },
  },
  {
    name: "Email",
    focus: "email",
    reach: ["email", "job"],
    spec: {
      name: "spider.config.ts",
      start: 19,
      lines: ["email: {", '  provider: "resend",', '  from: "hi@lumen.dev",', "},"],
    },
    code: {
      name: "src/jobs/digest.ts",
      start: 5,
      lines: ["  await email.send({", "    subject: `${open} open tasks`,", "  });"],
    },
  },
];
