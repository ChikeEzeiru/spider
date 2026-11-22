import { ImageResponse } from "next/og";
import { brandFonts, lightLogo, svgDataUri } from "@/utils/brandAssets";

/*
 * The share image for every page: the site's bordered frame on the canvas colour, the logo,
 * and the homepage headline in the "bold lead, softer follow-on" style. Built once at build time.
 */

export const alt = "Spider: build full-stack apps without wiring every layer by hand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand colours (src/styles/brand.css): canvas, subtle border, primary and tertiary text.
const CANVAS = "#f9fafa";
const BORDER = "#e4e7e6";
const PRIMARY = "#1c211f";
const TERTIARY = "#6d7773";

export default async function OpenGraphImage() {
  const [fonts, logo] = await Promise.all([brandFonts(), lightLogo()]);
  const logoSrc = svgDataUri(logo);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: CANVAS, padding: "0 40px" }}>
        {/* The 1280px column's side borders, as on every page. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            borderLeft: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            padding: "64px 64px 72px",
            fontFamily: "DM Sans",
          }}
        >
          <div style={{ display: "flex" }}>
            <img src={logoSrc} width={56} height={56} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: PRIMARY }}>
              Build full-stack apps without wiring every layer by hand.
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.4, color: TERTIARY, maxWidth: 900 }}>
              Define your app in TypeScript. Spider connects your React interface and Node.js server with built-in auth,
              typed operations, background jobs and email.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: Buffer.from(fonts.regular, "base64"), weight: 400, style: "normal" },
        { name: "DM Sans", data: Buffer.from(fonts.medium, "base64"), weight: 500, style: "normal" },
      ],
    },
  );
}
