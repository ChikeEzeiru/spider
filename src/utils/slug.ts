/** A heading's text as a URL fragment: "What's next" → "whats-next". */
export const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
