import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "Quickstart · Docs · Spider",
  description: "Install the Spider CLI, create a starter app and run it locally.",
};

export default function Quickstart() {
  return (
    <DocsPage
      path="/docs/quickstart"
      updated="2026-11-21"
      title="Quickstart"
      summary="Install the CLI, create a starter app and run it locally. You'll need Node.js 22 or later."
    >
      <h2>1. Create an app</h2>
      <p>The CLI creates a new app from the starter template and installs its dependencies.</p>
      <CodeBlock name="Terminal" lines={["npx spider new my-app", "cd my-app"]} className="my-6" />

      <h2>2. Set up the database</h2>
      <p>
        The starter uses SQLite in development, so there&apos;s nothing to install. Run the first migration to create
        its tables.
      </p>
      <CodeBlock name="Terminal" lines={["spider db migrate"]} className="my-6" />

      <h2>3. Run it</h2>
      <p>
        Start the development server. Spider watches <code>spider.config.ts</code> and your <code>src/</code> folder, and
        reloads the client and server as you work.
      </p>
      <CodeBlock name="Terminal" lines={["spider dev"]} className="my-6" />
      <p>
        Open <code>localhost:3000</code>, sign up, and add a task. That task travels through every part of the stack: a
        React page, a typed operation, auth and the database.
      </p>

      <h2>4. Make it yours</h2>
      <p>
        Open <code>spider.config.ts</code> and add a route, or a new operation next to <code>getTasks</code>. When you&apos;re
        ready to ship, <code>spider build</code> produces a client bundle and a Node.js server; see the{" "}
        <Link href="/docs/cli">CLI reference</Link> for deploying.
      </p>
    </DocsPage>
  );
}
