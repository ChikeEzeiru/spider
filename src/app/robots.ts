import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The footer lab is an internal animation test page.
    rules: { userAgent: "*", allow: "/", disallow: "/footer-lab" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
