import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import GuidePage from "@/components/page/GuidePage";

export const metadata: Metadata = {
  title: "Contributing · Spider",
  description: "How to help with Spider: reporting bugs, improving the docs, and sending your first pull request.",
};

export default function ContributingPage() {
  return (
    <GuidePage
      title="Contributing"
      intro={
        <p>
          Spider is open source under the <Link href="/license">MIT License</Link>, and most of it was shaped by people
          building with it. Here&apos;s how to help, from a one-line docs fix to a new feature.
        </p>
      }
      sections={[
        {
          title: "Ways to help",
          body: (
            <ul>
              <li>
                <strong>Build something and tell us where Spider got in your way.</strong> Rough edges you hit are the
                most useful bug reports we get.
              </li>
              <li>
                <strong>Answer a question</strong> in <Link href="/discussions">Discussions</Link>. If you solved it once,
                someone else is stuck on it now.
              </li>
              <li>
                <strong>Improve the docs.</strong> Every docs page has an &ldquo;Edit this page&rdquo; link in its sidebar.
              </li>
              <li>
                <strong>Pick up an issue</strong> labelled &ldquo;good first issue&rdquo;. They&apos;re small, well
                described, and a maintainer has offered to review them.
              </li>
            </ul>
          ),
        },
        {
          title: "Set up the repository",
          body: (
            <>
              <p>
                You&apos;ll need Node.js 22 or later and pnpm. Fork the repository on GitHub, clone your fork, and install
                its dependencies.
              </p>
              <CodeBlock name="Terminal" lines={["git clone https://github.com/<you>/spider.git", "cd spider", "pnpm install"]} className="my-6" />
              <p>
                The repository holds the framework, the CLI and the starter templates. <code>pnpm dev</code> runs the basic
                starter against your local copy, so you can see a change in a real app as you make it.
              </p>
              <CodeBlock name="Terminal" lines={["pnpm dev", "pnpm test"]} className="my-6" />
            </>
          ),
        },
        {
          title: "Make a change",
          body: (
            <>
              <p>
                Work on a branch, and keep each change to one idea. If you&apos;re changing how the spec behaves, open an
                issue first so we can agree on the shape of it before you write the code.
              </p>
              <p>
                Add a test for anything you fix or add. Tests live next to the code they cover, in files ending in{" "}
                <code>.test.ts</code>.
              </p>
            </>
          ),
        },
        {
          title: "Open a pull request",
          body: (
            <>
              <p>
                Describe what changed and why, and link the issue it closes. Screenshots help for anything you can see. A
                maintainer reviews every pull request, usually within a few days, and will tell you if it needs anything
                before it&apos;s merged.
              </p>
              <p>Small pull requests get merged fastest. If yours is growing, it&apos;s fine to split it.</p>
            </>
          ),
        },
        {
          title: "Reporting bugs and security issues",
          body: (
            <p>
              Open an issue with the steps to reproduce the bug, the Spider version (<code>spider info</code> prints it) and
              what you expected to happen. Security issues are different: report them privately, as described on the{" "}
              <Link href="/security">Security</Link> page, never in a public issue.
            </p>
          ),
        },
        {
          title: "How we work together",
          body: (
            <p>
              Be kind and assume good intent. Critique the code, not the person who wrote it. Maintainers will remove
              anything that makes the project unwelcoming, in issues, pull requests and Discussions alike.
            </p>
          ),
        },
      ]}
    />
  );
}
