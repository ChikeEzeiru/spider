import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/page/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy · Spider",
  description: "What this website collects, why, and what you can do about it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy policy"
      updated="2026-11-21"
      sections={[
        {
          title: "The short version",
          body: (
            <p>
              This website doesn&apos;t ask you to sign up, doesn&apos;t sell data, and doesn&apos;t use advertising
              trackers. Spider the framework runs on your own servers, so the data in apps built with it belongs to
              whoever runs them, not to us.
            </p>
          ),
        },
        {
          title: "What we collect",
          body: (
            <ul>
              <li><strong>Basic visit data.</strong> Pages viewed, the referring site, and approximate country, collected without cookies and without identifying you.</li>
              <li><strong>What you send us.</strong> If you contact us or report a security issue, we keep what you send so we can reply.</li>
            </ul>
          ),
        },
        {
          title: "What we don't collect",
          body: (
            <p>
              Spider doesn&apos;t send telemetry from apps you build unless you turn it on with{" "}
              <code>spider telemetry enable</code>. When it&apos;s on, it sends anonymous command usage and versions,
              never your code or your users&apos; data.
            </p>
          ),
        },
        {
          title: "Your choices",
          body: (
            <p>
              You can ask us to see or delete anything you&apos;ve sent us. See the{" "}
              <Link href="/contact">contact page</Link> for how to reach us.
            </p>
          ),
        },
      ]}
    />
  );
}
