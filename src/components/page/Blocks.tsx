import type { Block } from "@/content/blog";
import CodeBlock from "./CodeBlock";

/** Renders content blocks (paragraphs, quotes, code) inside Prose, styled as on the blog. */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, i) =>
    block.type === "p" ? (
      <p key={i}>{block.text}</p>
    ) : block.type === "h2" ? (
      <h3 key={i}>{block.text}</h3>
    ) : block.type === "quote" ? (
      <blockquote key={i} className="not-prose my-10 border-l-2 border-aztec-900 pl-6 text-heading-row tracking-heading text-pretty text-primary">
        {block.text}
      </blockquote>
    ) : (
      <CodeBlock key={i} name={block.name} lines={block.lines} className="my-6" />
    ),
  );
}
