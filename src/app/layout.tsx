import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/utils/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Defaults for every page. Pages set their own title and description; the share image
// (app/opengraph-image.tsx) applies everywhere, and platforms fall back to each page's title.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Spider",
  openGraph: { type: "website", siteName: "Spider", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-secondary text-primary">{children}</body>
    </html>
  );
}
