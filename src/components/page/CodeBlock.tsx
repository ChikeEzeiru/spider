import { File06, Terminal } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/*
 * A file or terminal excerpt, in the same dark panel and mono type as the homepage's feature
 * map code panel. Strings are picked out in the brand colour; line numbers are optional.
 */

export function Line({ text }: { text: string }) {
  // Split out quoted strings so they can take the accent colour.
  const parts = text.split(/("[^"]*"|`[^`]*`|'[^']*')/);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={/^["`']/.test(part) ? "text-brand-300" : "text-aztec-50"}>
          {part}
        </span>
      ))}
    </>
  );
}

export default function CodeBlock({
  name,
  lines,
  numbered = true,
  start = 1,
  className,
}: {
  /** A file name, or "Terminal". */
  name: string;
  lines: string[];
  numbered?: boolean;
  /** The first line's number, when it's an excerpt from further down a file. */
  start?: number;
  className?: string;
}) {
  const terminal = name === "Terminal";
  return (
    <figure className={cx("not-prose overflow-hidden rounded-sm border border-aztec-800 bg-aztec-900", className)}>
      <figcaption className="flex h-10 items-center gap-2 border-b border-aztec-800 px-4 font-mono text-xs text-aztec-300">
        {terminal ? <Terminal className="size-4 text-aztec-500" /> : <File06 className="size-4 text-aztec-500" />}
        {name}
      </figcaption>
      <pre className="overflow-x-auto py-3 font-mono text-xs leading-5">
        {lines.map((line, i) => (
          <div key={i} className="flex whitespace-pre pr-4">
            {numbered && !terminal ? (
              <span className="w-10 shrink-0 pr-4 text-right text-aztec-600 select-none">{start + i}</span>
            ) : (
              <span className="w-4 shrink-0" />
            )}
            {terminal && line ? <span className="pr-2 text-aztec-500 select-none">$</span> : null}
            <Line text={line} />
          </div>
        ))}
      </pre>
    </figure>
  );
}
