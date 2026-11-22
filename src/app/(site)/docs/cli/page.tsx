import type { Metadata } from "next";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "CLI reference · Docs · Spider",
  description: "Every Spider CLI command: creating, running, migrating, building and deploying an app.",
};

const COMMANDS: { command: string; does: string }[] = [
  { command: "spider new <name>", does: "Create an app from the starter template and install its dependencies." },
  { command: "spider dev", does: "Run the client and server in development, reloading as you edit." },
  { command: "spider db migrate", does: "Create and apply a migration from changes to your Prisma schema." },
  { command: "spider db migrate --deploy", does: "Apply committed migrations without creating new ones, for production releases." },
  { command: "spider db studio", does: "Open a browser view of your development database." },
  { command: "spider build", does: "Build a production client bundle and Node.js server into .spider/build." },
  { command: "spider start", does: "Run the production build locally." },
  { command: "spider start --jobs-only", does: "Run only the job runner, as a separate worker for heavy background work." },
  { command: "spider deploy <host>", does: "Deploy the production build to a supported host, such as fly or railway." },
  { command: "spider info", does: "Print the versions and settings the app is using, for bug reports." },
];

export default function CliReference() {
  return (
    <DocsPage
      path="/docs/cli"
      updated="2026-11-21"
      title="CLI reference"
      summary="The spider command creates, runs, migrates, builds and deploys your app. Run any command with --help for its options."
    >
      <div className="not-prose overflow-x-auto rounded-sm border border-secondary bg-primary">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary text-xs text-quaternary">
            <tr>
              <th className="px-4 py-3 font-medium">Command</th>
              <th className="px-4 py-3 font-medium">What it does</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {COMMANDS.map(({ command, does }) => (
              <tr key={command}>
                <td className="px-4 py-3 align-top font-mono text-xs whitespace-nowrap text-primary">{command}</td>
                <td className="px-4 py-3 text-tertiary">{does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocsPage>
  );
}
