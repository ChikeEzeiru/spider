import { ImageResponse } from "next/og";
import { lightLogo, svgDataUri } from "@/utils/brandAssets";

/*
 * The home-screen icon for iPhones and iPads: the logo as a light spider on the dark tile,
 * matching icon.svg. iOS rounds the corners itself, so the tile fills the square.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const light = await lightLogo();
  // Invert the light logo: dark tile, light spider.
  const inverted = light
    .replaceAll('"#1C211F"', '"__INK__"')
    .replaceAll('fill="white"', 'fill="#1C211F"')
    .replaceAll('"__INK__"', '"#F9FAFA"');
  const src = svgDataUri(inverted);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1c211f" }}>
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
