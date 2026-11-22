import type { Metadata } from "next";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";
import DocsTable from "../DocsTable";

export const metadata: Metadata = {
  title: "Jobs · Docs · Spider",
  description: "Scheduled and queued background work that runs on your own server.",
};

export default function Jobs() {
  return (
    <DocsPage
      path="/docs/jobs"
      updated="2026-11-22"
      title="Jobs"
      summary="Jobs run work outside a request: on a schedule, or queued from an action. They use the database you already have, so there's no queue service to run."
    >
      <h2>Scheduled jobs</h2>
      <p>Give a job a cron expression and it runs on that schedule, in UTC.</p>
      <CodeBlock name="spider.config.ts" start={16} lines={["jobs: {", '  digest: job({ cron: "0 9 * * 1" }),', "},"]} className="my-6" />
      <CodeBlock
        name="src/jobs/digest.ts"
        lines={[
          "export async function digest(_, { db, email }) {",
          "  const open = await db.task.count({ where: { done: false } });",
          "  await email.send({ to: \"team@example.com\", subject: `${open} open tasks` });",
          "}",
        ]}
        className="my-6"
      />

      <h2>Queued jobs</h2>
      <p>
        A job without a schedule waits to be queued. Enqueue it from any action or other job, with the arguments it
        needs. The action returns straight away and the job runs in the background.
      </p>
      <CodeBlock
        name="src/server/invites.ts"
        lines={["export async function inviteUser({ email }, { jobs }) {", "  await jobs.sendInvite.enqueue({ email });", "}"]}
        className="my-6"
      />

      <h2>Retries and options</h2>
      <DocsTable
        head={["Option", "What it does"]}
        rows={[
          ["cron", "Run on a schedule. Leave it out for a job that's only queued."],
          ["retries", "How many times to retry a failed run, with backoff between tries. Defaults to 3."],
          ["timeout", "Seconds a run may take before it's stopped and counted as failed. Defaults to 300."],
          ["concurrency", "How many runs of this job may happen at once. Defaults to 1."],
        ]}
      />

      <h2>Where jobs run</h2>
      <p>
        By default jobs run inside the app&apos;s server process, and Spider makes sure only one instance picks up each
        run, even with several servers. For heavy work, start a separate worker with <code>spider start --jobs-only</code>{" "}
        and scale it on its own.
      </p>
    </DocsPage>
  );
}
