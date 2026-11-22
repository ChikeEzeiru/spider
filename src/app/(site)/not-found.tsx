import NotFound from "@/components/page/NotFound";

/** When a page calls notFound() (an unknown blog post, say), inside the site's header and footer. */
export default function SiteNotFound() {
  return <NotFound />;
}
