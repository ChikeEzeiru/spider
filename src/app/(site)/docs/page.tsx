import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "./DocsPage";

export const metadata: Metadata = {
  title: "Docs · Spider",
  description: "What Spider is, how the spec fits together, and where to start.",
};

export default function DocsIntroduction() {
  return (
    <DocsPage
      path="/docs"
      updated="2026-11-21"
      title="Introduction"
      summary="Spider is a full-stack TypeScript framework. You describe your app in one spec; Spider wires your React client, Node.js server and Prisma data model together."
    >
      <h2>How a Spider app fits together</h2>
      <p>
        Every Spider app has a <code>spider.config.ts</code> at its root. It declares the app&apos;s structure: routes,
        auth, operations, jobs and email. Your own code lives in <code>src/</code> as plain React components and
        Node.js functions, and your data model is a Prisma schema.
      </p>
      <CodeBlock
        name="spider.config.ts"
        lines={[
          "export default app({",
          '  auth: { user: "User", methods: ["email"] },',
          '  routes: { "/tasks": page(Tasks, { auth: true }) },',
          '  operations: { getTasks: query({ uses: ["Task"] }) },',
          "});",
        ]}
        className="my-8"
      />
      <h2>What Spider handles</h2>
      <ul>
        <li><strong><Link href="/docs/routing">Routing</Link>:</strong> each route maps to a React page, with private routes guarded by auth.</li>
        <li><strong><Link href="/docs/auth">Auth</Link>:</strong> sessions, sign-in methods and the signed-in user in every operation.</li>
        <li><strong><Link href="/docs/operations">Typed operations</Link>:</strong> server functions you call from React with generated, typed hooks.</li>
        <li><strong><Link href="/docs/jobs">Jobs</Link>:</strong> scheduled and queued work on your own server.</li>
        <li><strong><Link href="/docs/email">Email</Link>:</strong> one provider, sent from any action or job.</li>
      </ul>
      <h2>Where to start</h2>
      <p>
        The <Link href="/docs/quickstart">Quickstart</Link> creates a starter app and runs it locally in a few minutes.
        The <Link href="/docs/cli">CLI reference</Link> lists every command you&apos;ll use after that.
      </p>
    </DocsPage>
  );
}
