/**
 * The site's public address, for metadata, the sitemap and share images.
 * Netlify sets URL at build time to the site's primary address; locally it's the dev server.
 */
export const SITE_URL = process.env.URL ?? "http://localhost:3000";

export const SITE_TITLE = "Spider: full-stack TypeScript apps from one spec";

export const SITE_DESCRIPTION =
  "Build full-stack apps without wiring every layer by hand. Define your app in TypeScript, and Spider connects your React interface and Node.js server with built-in auth, typed operations, background jobs and email.";
