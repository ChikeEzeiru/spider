import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "The spec · Docs · Spider",
  description: "How spider.config.ts describes your app, and what Spider generates from it.",
};

export default function Spec() {
  return (
    <DocsPage
      path="/docs/spec"
      updated="2026-11-22"
      title="The spec"
      summary="spider.config.ts describes what your app is made of. Spider reads it and generates the wiring between client, server and database."
    >
      <h2>A complete spec</h2>
      <p>The spec is plain TypeScript, so your editor checks it as you type. A small app&apos;s spec looks like this.</p>
      <CodeBlock
        name="spider.config.ts"
        lines={[
          'import { app, page, query, action, job } from "spider";',
          'import Tasks from "./src/pages/Tasks";',
          'import Login from "./src/pages/Login";',
          "",
          "export default app({",
          '  auth: { user: "User", methods: ["email", "github"], onFail: "/login" },',
          "  routes: {",
          '    "/tasks": page(Tasks, { auth: true }),',
          '    "/login": page(Login),',
          "  },",
          "  operations: {",
          '    getTasks: query({ uses: ["Task"] }),',
          '    createTask: action({ writes: ["Task"] }),',
          "  },",
          '  jobs: { digest: job({ cron: "0 9 * * 1" }) },',
          '  email: { provider: "resend", from: "hello@example.com" },',
          "});",
        ]}
        className="my-6"
      />

      <h2>What Spider generates</h2>
      <ul>
        <li>A client router with a code-split bundle for each page.</li>
        <li>Server endpoints for every operation, with the signed-in user and database passed in.</li>
        <li>Typed React hooks for those operations, exported from <code>@spider/app</code>.</li>
        <li>Session handling, sign-in routes and OAuth callbacks for the methods you enabled.</li>
        <li>A job runner and an email client, available to every operation and job.</li>
      </ul>

      <h2>How names connect to files</h2>
      <p>
        Operations and jobs are matched to functions by name. <code>getTasks</code> is the function exported as{" "}
        <code>getTasks</code> from any file in <code>src/server</code>, and <code>digest</code> is the one exported
        from <code>src/jobs</code>. To keep a function somewhere else, pass its file:
      </p>
      <CodeBlock name="spider.config.ts" start={11} lines={['getInvoices: query({ uses: ["Invoice"], from: "./src/billing/invoices" }),']} className="my-6" />

      <h2>When the spec changes</h2>
      <p>
        <code>spider dev</code> regenerates everything as soon as you save. If a page calls an operation you&apos;ve
        renamed or removed, TypeScript reports it straight away, before anything reaches the browser. Every key is
        listed in the <Link href="/docs/configuration">configuration reference</Link>.
      </p>
    </DocsPage>
  );
}
