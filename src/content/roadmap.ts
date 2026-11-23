/** What's being built next, shared by the About page and the Roadmap page. */

export interface RoadmapItem {
  status: "In progress" | "Planned";
  title: string;
  body: string;
}

export const ROADMAP: RoadmapItem[] = [
  {
    status: "In progress",
    title: "Live queries",
    body: "Queries that push updates to the page when their entities change, without polling.",
  },
  {
    status: "In progress",
    title: "File uploads",
    body: "Declare an upload in the spec and get signed URLs, size limits and storage on S3 or R2.",
  },
  {
    status: "Planned",
    title: "Testing helpers",
    body: "Call operations in tests with a fake user and a throwaway database.",
  },
  {
    status: "Planned",
    title: "More deploy targets",
    body: "spider deploy for Render and a Docker image for everything else.",
  },
  {
    status: "Planned",
    title: "1.0",
    body: "A stable spec format, with migration guides for anything that changes before then.",
  },
];
