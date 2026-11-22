import type { Metadata } from "next";
import CodeBlock from "@/components/page/CodeBlock";
import DocsPage from "../DocsPage";

export const metadata: Metadata = {
  title: "Operations · Docs · Spider",
  description: "Queries and actions: server functions you call from React with typed hooks.",
};

export default function Operations() {
  return (
    <DocsPage
      path="/docs/operations"
      updated="2026-11-22"
      title="Operations"
      summary="Operations are async functions on the server that the client can call. Queries read data, actions change it, and both are fully typed from end to end."
    >
      <h2>Queries</h2>
      <p>
        Declare a query with the entities it reads, then write it as a plain function. Its first argument is whatever
        the client passes; its second is the context, with the user, the database and the email client.
      </p>
      <CodeBlock name="spider.config.ts" start={13} lines={["operations: {", '  getTasks: query({ uses: ["Task"] }),', "},"]} className="my-6" />
      <CodeBlock
        name="src/server/tasks.ts"
        lines={["export async function getTasks(_, { user, db }) {", "  return db.task.findMany({ where: { userId: user.id } });", "}"]}
        className="my-6"
      />
      <p>Call it from React with the generated hook. The result has the function&apos;s own return type.</p>
      <CodeBlock name="src/pages/Tasks.tsx" start={4} lines={["const { data, isLoading } = useQuery(getTasks);"]} className="my-6" />

      <h2>Actions</h2>
      <p>Actions change data. Declare the entities they write, so Spider knows which queries to refresh afterwards.</p>
      <CodeBlock name="spider.config.ts" start={15} lines={['createTask: action({ writes: ["Task"] }),']} className="my-6" />
      <CodeBlock
        name="src/server/tasks.ts"
        start={5}
        lines={[
          "export async function createTask({ title }: { title: string }, { user, db }) {",
          "  return db.task.create({ data: { title, userId: user.id } });",
          "}",
        ]}
        className="my-6"
      />
      <CodeBlock
        name="src/components/NewTask.tsx"
        start={6}
        lines={["const create = useAction(createTask);", "", "await create({ title });"]}
        className="my-6"
      />

      <h2>Keeping the screen fresh</h2>
      <p>
        When <code>createTask</code> finishes, every query that uses <code>Task</code> refetches, so lists update without
        manual cache keys. For instant feedback, pass an <code>optimistic</code> function to <code>useAction</code> that
        updates the cached data before the server answers.
      </p>

      <h2>Errors</h2>
      <p>
        Throw an <code>HttpError</code> to send a status and message to the client. Anything else is logged on the
        server and reaches the client as a generic 500, so internal details never leak.
      </p>
      <CodeBlock name="src/server/tasks.ts" start={9} lines={['if (!task) throw new HttpError(404, "No such task");']} className="my-6" />
    </DocsPage>
  );
}
