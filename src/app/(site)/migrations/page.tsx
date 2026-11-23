import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import GuidePage from "@/components/page/GuidePage";

export const metadata: Metadata = {
  title: "Migration guides · Spider",
  description: "What to change in your app when you upgrade to a new Spider release.",
};

/** One guide per release, newest first, plus what to do before any upgrade. */
export default function MigrationsPage() {
  return (
    <GuidePage
      title="Migration guides"
      intro={
        <p>
          What to change in your app for each release. Spider is before 1.0, so a minor version can change the spec. Each
          release is listed in the <Link href="/changelog">changelog</Link>.
        </p>
      }
      sections={[
        {
          title: "Before you upgrade",
          body: (
            <>
              <p>
                Upgrade one minor version at a time and follow each guide in order. Commit first, so you can compare the
                generated code before and after.
              </p>
              <CodeBlock name="Terminal" lines={["npm install spider@0.4", "spider db migrate", "spider dev"]} className="my-6" />
              <p>
                <code>spider dev</code> checks the spec on start and names any field that changed, with a link to the guide
                below.
              </p>
            </>
          ),
        },
        {
          title: "0.3 to 0.4",
          body: (
            <>
              <p>
                Jobs can now be queued from actions as well as scheduled. Nothing changes for scheduled jobs, but two
                defaults did:
              </p>
              <ul>
                <li>
                  <strong>Only one instance runs each job.</strong> If you ran several servers and relied on every one of them
                  running a scheduled job, move that work into a job that loops over what it needs to do.
                </li>
                <li>
                  <strong>Failed runs are retried</strong> three times with backoff. Make jobs safe to run twice, or set{" "}
                  <code>retries: 0</code> on the ones that can&apos;t be.
                </li>
              </ul>
              <CodeBlock name="spider.config.ts" lines={["jobs: {", '  chargeCard: job({ retries: 0 }),', "},"]} className="my-6" />
              <p>
                Queueing a job from an action uses the <code>jobs</code> context, the same way you reach the database.
              </p>
              <CodeBlock name="src/server/invites.ts" lines={["export async function inviteUser({ email }, { jobs }) {", "  await jobs.sendInvite.enqueue({ email });", "}"]} className="my-6" />
            </>
          ),
        },
        {
          title: "0.2 to 0.3",
          body: (
            <>
              <p>
                Operations now declare the entities they touch. Queries list what they read with <code>uses</code>; actions
                list what they change with <code>writes</code>. Spider uses these to refresh the right screens.
              </p>
              <CodeBlock name="spider.config.ts" lines={["operations: {", '  getTasks: query({ uses: ["Task"] }),', '  createTask: action({ writes: ["Task"] }),', "},"]} className="my-6" />
              <p>
                A query without <code>uses</code> still works, but it&apos;s cached until the page reloads. If you were
                refreshing queries by hand after an action, you can delete that code once the entities are declared.
              </p>
              <p>
                GitHub sign-in and <code>spider db studio</code> are new in this release and need no changes to adopt.
              </p>
            </>
          ),
        },
        {
          title: "0.1 to 0.2",
          body: (
            <>
              <p>
                Email moved into the spec. Pick a provider and a sender once, and send from any action or job through the{" "}
                <code>email</code> context. Remove any email client you created yourself.
              </p>
              <CodeBlock name="spider.config.ts" lines={["email: {", '  provider: "resend",', '  from: "hello@example.com",', "},"]} className="my-6" />
              <p>
                Private routes now send signed-out visitors to the sign-in page instead of showing a 404. If you need the
                old behaviour on a route, set <code>onFail</code> on it.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
