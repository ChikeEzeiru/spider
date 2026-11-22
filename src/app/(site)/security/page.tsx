import type { Metadata } from "next";
import LegalPage from "@/components/page/LegalPage";

export const metadata: Metadata = {
  title: "Security · Spider",
  description: "How to report a vulnerability in Spider, and what happens next.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      path="/security"
      title="Security"
      updated="2026-11-21"
      sections={[
        {
          title: "Reporting a vulnerability",
          body: (
            <p>
              Please report vulnerabilities privately through GitHub&apos;s security advisories on the Spider
              repository, not in a public issue or discussion. Include the version affected, the steps to reproduce it,
              and what an attacker could do with it.
            </p>
          ),
        },
        {
          title: "What happens next",
          body: (
            <ul>
              <li>We acknowledge reports within three working days.</li>
              <li>We confirm the issue, agree a fix and a disclosure date with you, and keep you updated.</li>
              <li>We release the fix, publish an advisory, and credit you unless you&apos;d rather we didn&apos;t.</li>
            </ul>
          ),
        },
        {
          title: "Supported versions",
          body: <p>Security fixes go into the latest minor release. While Spider is below 1.0, please keep apps on the newest version.</p>,
        },
      ]}
    />
  );
}
