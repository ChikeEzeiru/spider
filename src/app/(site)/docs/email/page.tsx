import type { Metadata } from "next";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "Email · Docs · Spider",
  description: "Send email from actions and jobs, with templates written in React.",
};

export default function Email() {
  return (
    <DocsPage
      path="/docs/email"
      updated="2026-11-22"
      title="Email"
      summary="Pick a provider once in the spec, write templates as React components, and send from any action or job with one call."
    >
      <h2>Choosing a provider</h2>
      <p>
        Spider supports Resend, Postmark, SendGrid and plain SMTP. Name one in the spec and put its key in your
        environment.
      </p>
      <CodeBlock name="spider.config.ts" start={19} lines={["email: {", '  provider: "resend",', '  from: "hello@example.com",', "},"]} className="my-6" />

      <h2>Templates</h2>
      <p>Templates are React components in <code>src/emails</code>. Spider renders them to HTML and a plain-text version.</p>
      <CodeBlock
        name="src/emails/Digest.tsx"
        lines={[
          "export default function Digest({ open }: { open: number }) {",
          "  return (",
          "    <Email preview={`${open} open tasks`}>",
          "      <Text>You have {open} open tasks this week.</Text>",
          '      <Button href="/tasks">Open your tasks</Button>',
          "    </Email>",
          "  );",
          "}",
        ]}
        className="my-6"
      />

      <h2>Sending</h2>
      <p>
        Every action and job receives <code>email</code> in its context. Pass a template and its props, and Spider
        checks the props against the component&apos;s types.
      </p>
      <CodeBlock
        name="src/jobs/digest.ts"
        start={4}
        lines={["await email.send({", "  to: user.email,", '  subject: "Your week in tasks",', "  template: Digest,", "  props: { open },", "});"]}
        className="my-6"
      />

      <h2>In development</h2>
      <p>
        <code>spider dev</code> never sends real email. Each message is printed in the terminal with a link to a preview,
        where you can see the HTML and text versions side by side.
      </p>
    </DocsPage>
  );
}
