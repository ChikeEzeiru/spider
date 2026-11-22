"use client";

import { useEffect, useState } from "react";
import { Check, Copy01 } from "@untitledui/icons";

/** A one-line terminal command with a button that copies it. */
export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="flex h-11 items-center gap-3 rounded-sm bg-aztec-900 pr-1.5 pl-4 font-mono text-sm text-aztec-50">
      <span className="text-aztec-500 select-none">$</span>
      <code className="min-w-0 flex-1 truncate">{command}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(command).then(() => setCopied(true))}
        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-xs px-2.5 font-sans text-xs text-aztec-300 transition-colors hover:bg-aztec-800 hover:text-aztec-50"
      >
        {copied ? <Check className="size-3.5" /> : <Copy01 className="size-3.5" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
