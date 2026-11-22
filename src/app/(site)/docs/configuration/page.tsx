import type { Metadata } from "next";
import Link from "next/link";
import DocsPage from "../DocsPage";
import DocsTable from "../DocsTable";

export const metadata: Metadata = {
  title: "Configuration · Docs · Spider",
  description: "Every key in spider.config.ts.",
};

export default function Configuration() {
  return (
    <DocsPage
      path="/docs/configuration"
      updated="2026-11-22"
      title="Configuration"
      summary="Every key spider.config.ts accepts. All of them are optional except routes."
    >
      <h2>app</h2>
      <DocsTable
        head={["Key", "What it does"]}
        rows={[
          ["name", "The app's name, used in page titles and email footers. Defaults to the folder name."],
          ["routes", <>URLs and the pages they render. See <Link href="/docs/routing">Routing</Link>.</>],
          ["auth", <>Sign-in methods and the user entity. See <Link href="/docs/auth">Auth</Link>.</>],
          ["operations", <>Queries and actions. See <Link href="/docs/operations">Operations</Link>.</>],
          ["jobs", <>Scheduled and queued jobs. See <Link href="/docs/jobs">Jobs</Link>.</>],
          ["email", <>The email provider and sender. See <Link href="/docs/email">Email</Link>.</>],
          ["server", "Server settings: port, CORS origins and middleware."],
          ["client", "Client settings: the HTML head, global CSS and the root component."],
        ]}
      />

      <h2>server</h2>
      <DocsTable
        head={["Key", "What it does"]}
        rows={[
          ["port", "The port to listen on. PORT in the environment takes priority. Defaults to 3000."],
          ["cors", "Origins allowed to call operations from other sites. Defaults to the app's own origin."],
          ["middleware", "Express-style middleware to run before every request, for logging or headers."],
          ["setup", "A function run once when the server starts, for connecting to other services."],
        ]}
      />

      <h2>client</h2>
      <DocsTable
        head={["Key", "What it does"]}
        rows={[
          ["head", "Tags added to every page's <head>, such as fonts and analytics."],
          ["css", "Global stylesheets, imported before any page."],
          ["root", "A component that wraps every page, for providers and shared layout."],
        ]}
      />
    </DocsPage>
  );
}
