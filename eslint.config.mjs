import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Design rules from DESIGN.md that can be checked in code.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/base/**"], // Untitled UI's own components
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/[a-z-]+-\\[\\d+(\\.\\d+)?px\\]/]",
          message: "Use Tailwind's scale (gap-2, p-6), not arbitrary pixel values. See DESIGN.md > Spacing & layout.",
        },
        {
          selector: "TemplateElement[value.raw=/[a-z-]+-\\[\\d+(\\.\\d+)?px\\]/]",
          message: "Use Tailwind's scale (gap-2, p-6), not arbitrary pixel values. See DESIGN.md > Spacing & layout.",
        },
        {
          selector: "Literal[value=/backdrop-blur/], TemplateElement[value.raw=/backdrop-blur/]",
          message: "Surfaces are solid: no backdrop blur. See DESIGN.md > Surfaces.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
