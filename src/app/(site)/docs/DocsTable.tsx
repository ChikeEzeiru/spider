import type { ReactNode } from "react";

/** A two-column reference table: a name in mono, then what it does. */
export default function DocsTable({ head, rows }: { head: [string, string]; rows: [string, ReactNode][] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-sm border border-secondary bg-primary">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-secondary text-xs text-quaternary">
          <tr>
            <th className="px-4 py-3 font-medium">{head[0]}</th>
            <th className="px-4 py-3 font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary">
          {rows.map(([name, does]) => (
            <tr key={name}>
              <td className="px-4 py-3 align-top font-mono text-xs whitespace-nowrap text-primary">{name}</td>
              <td className="px-4 py-3 text-tertiary">{does}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
