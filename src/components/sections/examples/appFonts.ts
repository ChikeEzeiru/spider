import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans, Manrope, Space_Grotesk } from "next/font/google";

/*
 * Typefaces for the concept apps' screenshots, so each reads as its own product rather
 * than a Spider page. Not preloaded: they only matter once a screenshot is on screen.
 */

export const rosterlyFont = Manrope({ subsets: ["latin"], preload: false });
export const stockwellFont = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], preload: false });
export const stockwellMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-stockwell-mono",
  preload: false,
});
export const courseyardFont = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], preload: false });
export const cartwiseFont = Space_Grotesk({ subsets: ["latin"], preload: false });
