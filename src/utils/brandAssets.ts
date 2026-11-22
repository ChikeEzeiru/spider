import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Files the generated images (share image, iPhone icon) are drawn from. Reading them inside
 * "use cache" lets those routes prerender at build time, so nothing is read from disk at
 * request time. Returned as base64 strings, which cache cleanly.
 */

export async function brandFonts() {
  "use cache";
  const [regular, medium] = await Promise.all(
    ["DMSans-Regular.ttf", "DMSans-Medium.ttf"].map((f) => readFile(join(process.cwd(), "src/assets/fonts", f))),
  );
  return { regular: regular.toString("base64"), medium: medium.toString("base64") };
}

export async function lightLogo() {
  "use cache";
  return readFile(join(process.cwd(), "public/Logo-light.svg"), "utf8");
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
