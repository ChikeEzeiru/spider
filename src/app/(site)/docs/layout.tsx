import DocsNav from "./DocsNav";

/** Docs pages: the grouped page list beside (or above) the page, inside the site's frame. */
export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="flex justify-center px-2">
      <div className="flex w-full max-w-320 flex-col border-x border-b border-secondary lg:flex-row">
        <aside className="border-b border-secondary px-4 py-4 sm:px-6 lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-5 lg:py-8">
          <div className="lg:sticky lg:top-24">
            <DocsNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
