import type { Metadata } from "next";
import LegalPage from "@/components/page/LegalPage";

export const metadata: Metadata = {
  title: "License · Spider",
  description: "Spider is released under the MIT License.",
};

// The MIT License's text, split at its natural breaks so it reads like the other documents.
export default function LicensePage() {
  return (
    <LegalPage
      path="/license"
      title="License"
      sections={[
        {
          title: "MIT License",
          body: (
            <p>
              Spider is free and open source, released under the MIT License. Copyright (c) 2026 Spider, Inc.
            </p>
          ),
        },
        {
          title: "Permission",
          body: (
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
              associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction,
              including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
              and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
              subject to the following conditions:
            </p>
          ),
        },
        {
          title: "Conditions",
          body: (
            <p>
              The above copyright notice and this permission notice shall be included in all copies or substantial
              portions of the Software.
            </p>
          ),
        },
        {
          title: "No warranty",
          body: (
            <p>
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
              BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
              OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
              CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          ),
        },
      ]}
    />
  );
}
