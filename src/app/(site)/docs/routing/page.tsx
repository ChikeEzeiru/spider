import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "Routing · Docs · Spider",
  description: "Map URLs to React pages, read URL parameters and protect private routes.",
};

export default function Routing() {
  return (
    <DocsPage
      path="/docs/routing"
      updated="2026-11-22"
      title="Routing"
      summary="Each route in the spec maps a URL to a React page. Spider builds the router, splits the code by page and guards private routes on both client and server."
    >
      <h2>Declaring routes</h2>
      <p>Point each path at the page component that renders it.</p>
      <CodeBlock
        name="spider.config.ts"
        start={8}
        lines={["routes: {", '  "/": page(Home),', '  "/tasks": page(Tasks, { auth: true }),', '  "/tasks/:id": page(Task, { auth: true }),', '  "/login": page(Login),', "},"]}
        className="my-6"
      />

      <h2>URL parameters</h2>
      <p>
        Segments that start with a colon become parameters. <code>useParams</code> returns them typed from the route
        they belong to.
      </p>
      <CodeBlock
        name="src/pages/Task.tsx"
        lines={[
          'import { useParams, useQuery } from "spider";',
          'import { getTask } from "@spider/app";',
          "",
          "export default function Task() {",
          '  const { id } = useParams("/tasks/:id");',
          "  const { data } = useQuery(getTask, { id });",
          "  return <TaskDetail task={data} />;",
          "}",
        ]}
        className="my-6"
      />

      <h2>Linking between pages</h2>
      <p>
        Use <code>Link</code> for navigation inside the app. Its <code>to</code> prop only accepts routes from the spec,
        so a typo in a path is a type error rather than a broken link.
      </p>
      <CodeBlock name="src/components/TaskRow.tsx" start={6} lines={['<Link to="/tasks/:id" params={{ id: task.id }}>{task.title}</Link>']} className="my-6" />

      <h2>Private routes</h2>
      <p>
        Mark a route with <code>auth: true</code> and signed-out visitors are sent to the <code>onFail</code> route set
        in <Link href="/docs/auth">Auth</Link>. The check runs on the server too, so a private page&apos;s operations
        never answer a signed-out request.
      </p>

      <h2>Not found</h2>
      <p>
        Any URL without a route renders the built-in not-found page. To use your own, add a <code>&quot;*&quot;</code>{" "}
        route as the last entry.
      </p>
    </DocsPage>
  );
}
