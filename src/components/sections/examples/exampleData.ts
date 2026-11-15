export interface Example {
  name: string;
  pitch: string;
  summary: string;
  /** Spider features the app leans on. */
  features: string[];
  href: string;
}

export const EXAMPLES: Example[] = [
  {
    name: "Rosterly",
    pitch: "Shift planning for cafés and restaurants",
    summary: "Managers publish weekly rotas, staff swap shifts from their phones, and everyone gets a reminder before they're on.",
    features: ["Auth", "Typed operations", "Jobs", "Email"],
    href: "#",
  },
  {
    name: "Stockwell",
    pitch: "Inventory and reordering for independent shops",
    summary: "Tracks stock across tills and drafts purchase orders for suppliers as soon as an item runs low.",
    features: ["Routing", "Typed operations", "Jobs"],
    href: "#",
  },
  {
    name: "Courseyard",
    pitch: "Cohort-based courses for independent instructors",
    summary: "Instructors run paid cohorts with lessons, deadlines and progress tracking, and learners get nudged by email.",
    features: ["Auth", "Routing", "Email"],
    href: "#",
  },
  {
    name: "Cartwise",
    pitch: "AI shopping assistant for Shopify and WordPress stores",
    summary: "Answers product questions and builds carts for shoppers, syncing each store's catalogue overnight.",
    features: ["Typed operations", "Jobs", "Auth"],
    href: "#",
  },
];
