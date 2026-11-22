import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";
import DocsTable from "../DocsTable";

export const metadata: Metadata = {
  title: "Deploying · Docs · Spider",
  description: "Build a Spider app for production and deploy it to Fly, Railway or any Node.js host.",
};

export default function Deploying() {
  return (
    <DocsPage
      path="/docs/deploying"
      updated="2026-11-22"
      title="Deploying"
      summary="A production build is a static client bundle and a Node.js server. Deploy both with one command, or run them anywhere Node.js runs."
    >
      <h2>Build for production</h2>
      <p>
        <code>spider build</code> type-checks the app, bundles the client and compiles the server into{" "}
        <code>.spider/build</code>. Run it locally with <code>spider start</code> before you ship.
      </p>
      <CodeBlock name="Terminal" lines={["spider build", "spider start"]} className="my-6" />

      <h2>Set your environment</h2>
      <p>Production needs a real database and a few secrets. Set these on your host before the first deploy.</p>
      <DocsTable
        head={["Variable", "What it's for"]}
        rows={[
          ["DATABASE_URL", "The Postgres database the app uses in production."],
          ["SPIDER_SECRET", "Signs session cookies. Use a long random string, and keep it the same across deploys."],
          ["APP_URL", "The public address of the app, used in email links and OAuth callbacks."],
          ["GITHUB_CLIENT_ID", "Only if the spec enables GitHub sign-in. Pair it with GITHUB_CLIENT_SECRET."],
          ["RESEND_API_KEY", "Or the key for whichever email provider the spec names."],
        ]}
      />

      <h2>Deploy to Fly or Railway</h2>
      <p>
        The CLI knows how to deploy to Fly and Railway. It builds the app, creates the service if it doesn&apos;t exist,
        runs pending migrations and starts the new version once it&apos;s healthy.
      </p>
      <CodeBlock name="Terminal" lines={["spider deploy fly", "# or", "spider deploy railway"]} className="my-6" />

      <h2>Deploy anywhere else</h2>
      <p>
        Any host that runs Node.js 22 can run a Spider app. Serve <code>.spider/build/client</code> as static files,
        start the server, and run migrations as part of each release.
      </p>
      <CodeBlock
        name="Terminal"
        lines={["spider build", "spider db migrate --deploy", "node .spider/build/server/index.js"]}
        className="my-6"
      />
      <p>
        The server listens on <code>PORT</code>, or 3000 if it isn&apos;t set. Jobs run inside the same process, so a
        single server is enough for most apps. See <Link href="/docs/jobs">Jobs</Link> for running them separately.
      </p>
    </DocsPage>
  );
}
