import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";
import DocsTable from "../DocsTable";

export const metadata: Metadata = {
  title: "Project structure · Docs · Spider",
  description: "What's in a new Spider app, and where your own code goes.",
};

export default function ProjectStructure() {
  return (
    <DocsPage
      path="/docs/project-structure"
      updated="2026-11-22"
      title="Project structure"
      summary="A new Spider app is a small, ordinary TypeScript project. This page walks through what the starter creates and where your own code goes."
    >
      <h2>The starter app</h2>
      <p>
        <code>spider new</code> creates this layout. Everything outside <code>.spider/</code> is yours to edit and
        commit.
      </p>
      <CodeBlock
        name="my-app"
        numbered={false}
        lines={[
          "my-app/",
          "├── spider.config.ts     the spec",
          "├── schema.prisma        your data model",
          "├── src/",
          "│   ├── pages/           React pages, one per route",
          "│   ├── components/      shared React components",
          "│   ├── server/          queries and actions",
          "│   ├── jobs/            background jobs",
          "│   └── emails/          email templates",
          "├── public/              static files, served as they are",
          "├── .env                 secrets for development",
          "└── .spider/             generated code and builds (ignored by git)",
        ]}
        className="my-6"
      />

      <h2>What each part does</h2>
      <DocsTable
        head={["Path", "What it holds"]}
        rows={[
          ["spider.config.ts", "The spec: routes, auth, operations, jobs and email. Spider reads it on every change."],
          ["schema.prisma", "Your entities as a Prisma schema. Spider generates the database client from it."],
          ["src/pages", "React components that routes point at. Any file layout works; the spec decides the URLs."],
          ["src/server", "Async functions that run on the server. The spec turns them into typed queries and actions."],
          ["src/jobs", "Functions that run later, on a schedule or from a queue."],
          ["src/emails", "React components rendered to email HTML."],
          [".spider", "Generated hooks, types and production builds. Never edit it; it's rebuilt as you work."],
        ]}
      />

      <h2>Where imports come from</h2>
      <p>
        Spider generates a typed module for your app at <code>@spider/app</code>. It exports a hook for every query and
        action in the spec, so pages import from there rather than from <code>src/server</code> directly. Framework
        helpers such as <code>page</code>, <code>query</code> and <code>useUser</code> come from <code>spider</code>.
      </p>
      <CodeBlock
        name="src/pages/Tasks.tsx"
        lines={[
          'import { useQuery } from "spider";',
          'import { getTasks } from "@spider/app";',
          "",
          "export default function Tasks() {",
          "  const { data } = useQuery(getTasks);",
          "  return <TaskList tasks={data} />;",
          "}",
        ]}
        className="my-6"
      />

      <h2>Organising a bigger app</h2>
      <p>
        The folders above are a starting point, not a rule. Because the spec names each file it uses, you can group code
        by feature instead, with a <code>src/billing/</code> folder holding its pages, operations and jobs together. See{" "}
        <Link href="/docs/spec">The spec</Link> for how files are referenced.
      </p>
    </DocsPage>
  );
}
