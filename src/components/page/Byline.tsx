/** Who wrote a post and how long it takes to read: a grey avatar, "Firstname@Spider", the minutes. */
export default function Byline({ author, minutes }: { author: string; minutes: number }) {
  return (
    <p className="flex items-center gap-2 text-sm text-tertiary">
      <span aria-hidden="true" className="size-6 rounded-full bg-tertiary" />
      <span className="text-primary">{author}@Spider</span>
      <span aria-hidden="true" className="text-quaternary">·</span>
      {minutes} min read
    </p>
  );
}
