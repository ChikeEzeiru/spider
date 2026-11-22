import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";
import DocsTable from "../DocsTable";

export const metadata: Metadata = {
  title: "Auth · Docs · Spider",
  description: "Sign-in methods, sessions and the current user in Spider.",
};

export default function Auth() {
  return (
    <DocsPage
      path="/docs/auth"
      updated="2026-11-22"
      title="Auth"
      summary="Choose the sign-in methods and the entity that holds your users. Spider handles sessions, password resets and OAuth callbacks."
    >
      <h2>Turning auth on</h2>
      <CodeBlock
        name="spider.config.ts"
        start={2}
        lines={["auth: {", '  user: "User",', '  methods: ["email", "github"],', '  onFail: "/login",', "},"]}
        className="my-6"
      />
      <DocsTable
        head={["Key", "What it does"]}
        rows={[
          ["user", "The entity that stores your users. It needs a unique email field."],
          ["methods", <>The sign-in methods to offer: <code>email</code>, <code>github</code> or both.</>],
          ["onFail", "Where signed-out visitors go when they open a private route."],
        ]}
      />

      <h2>Sign-in pages</h2>
      <p>
        Spider ships unstyled <code>SignIn</code> and <code>SignUp</code> components that render a form for each method
        you enabled. Style them with your own classes, or build the forms yourself with the <code>signIn</code> action.
      </p>
      <CodeBlock
        name="src/pages/Login.tsx"
        lines={['import { SignIn } from "spider";', "", "export default function Login() {", '  return <SignIn redirect="/tasks" />;', "}"]}
        className="my-6"
      />

      <h2>The current user</h2>
      <p>
        On the client, <code>useUser</code> returns the signed-in user, or <code>null</code>. On the server, every
        operation and job receives it in its context, already loaded from the session.
      </p>
      <CodeBlock
        name="src/server/tasks.ts"
        lines={["export async function getTasks(_, { user, db }) {", "  return db.task.findMany({ where: { userId: user.id } });", "}"]}
        className="my-6"
      />

      <h2>Signing out</h2>
      <p>
        Call <code>signOut()</code> from anywhere on the client. It clears the session on the server and returns the
        visitor to <code>onFail</code>.
      </p>

      <h2>Email and password</h2>
      <p>
        Passwords are hashed with Argon2. Spider sends verification and reset emails through the provider configured in{" "}
        <Link href="/docs/email">Email</Link>, using templates you can replace in <code>src/emails</code>.
      </p>
    </DocsPage>
  );
}
