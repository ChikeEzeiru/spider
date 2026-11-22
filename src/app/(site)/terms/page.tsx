import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/page/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service · Spider",
  description: "The terms for using this website and Spider's documentation.",
};

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of service"
      updated="2026-11-21"
      sections={[
        {
          title: "The framework",
          body: (
            <p>
              Spider itself is open-source software. Your use of it is governed by its{" "}
              <Link href="/license">MIT License</Link>, not by these terms.
            </p>
          ),
        },
        {
          title: "This website",
          body: (
            <p>
              You&apos;re welcome to read, share and link to anything on this site. The documentation and code samples
              may be copied into your own projects. Please don&apos;t use the Spider name or logo in a way that suggests
              we endorse your product.
            </p>
          ),
        },
        {
          title: "No warranty",
          body: (
            <p>
              The site and its examples are provided as they are. We work to keep them accurate, but we can&apos;t
              promise they&apos;re free of errors, and we aren&apos;t liable for losses that come from relying on them.
            </p>
          ),
        },
        {
          title: "Changes",
          body: <p>If these terms change, we&apos;ll update the date at the top of this page.</p>,
        },
      ]}
    />
  );
}
