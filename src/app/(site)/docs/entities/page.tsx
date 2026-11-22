import type { Metadata } from "next";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "Entities · Docs · Spider",
  description: "Model your data with Prisma, migrate it, and use it from operations and jobs.",
};

export default function Entities() {
  return (
    <DocsPage
      path="/docs/entities"
      updated="2026-11-22"
      title="Entities"
      summary="Entities are the models in your Prisma schema. Spider generates the database client, runs migrations and uses entity names to keep queries fresh."
    >
      <h2>Defining entities</h2>
      <p>Write models in <code>schema.prisma</code> at the root of the app, exactly as you would in any Prisma project.</p>
      <CodeBlock
        name="schema.prisma"
        lines={[
          "model User {",
          "  id    Int    @id @default(autoincrement())",
          "  email String @unique",
          "  tasks Task[]",
          "}",
          "",
          "model Task {",
          "  id     Int     @id @default(autoincrement())",
          "  title  String",
          "  done   Boolean @default(false)",
          "  user   User    @relation(fields: [userId], references: [id])",
          "  userId Int",
          "}",
        ]}
        className="my-6"
      />

      <h2>Migrations</h2>
      <p>
        After changing the schema, create and apply a migration. Commit the files it writes to{" "}
        <code>migrations/</code>; deploys apply them in order.
      </p>
      <CodeBlock name="Terminal" lines={["spider db migrate"]} className="my-6" />

      <h2>Using the database</h2>
      <p>
        Operations and jobs receive <code>db</code>, the generated Prisma client. Everything Prisma can do is available,
        including transactions and raw queries.
      </p>
      <CodeBlock
        name="src/server/tasks.ts"
        start={12}
        lines={["export async function completeAll(_, { user, db }) {", "  await db.task.updateMany({ where: { userId: user.id }, data: { done: true } });", "}"]}
        className="my-6"
      />

      <h2>Databases</h2>
      <p>
        The starter uses SQLite in development, so there&apos;s nothing to install. Use Postgres in production by setting{" "}
        <code>DATABASE_URL</code>; <code>spider db studio</code> opens a browser view of whichever database is
        configured.
      </p>
    </DocsPage>
  );
}
