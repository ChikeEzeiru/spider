export type ExampleId = "rosterly" | "stockwell" | "courseyard" | "cartwise";

export interface Example {
  id: ExampleId;
  /** The starter's name in `npx spider new --example …`: what the app does, not the company. */
  template: string;
  name: string;
  pitch: string;
  summary: string;
  /** Spider features the app leans on. */
  features: string[];
  /** Shown in the screenshot's address bar. */
  url: string;
  href: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "rosterly",
    template: "shift-planner",
    name: "Rosterly",
    pitch: "Shift planning for cafés and restaurants",
    summary: "Managers publish weekly rotas, staff swap shifts from their phones, and everyone gets a reminder before they're on.",
    features: ["Auth", "Typed operations", "Jobs", "Email"],
    url: "rosterly.app/rota",
    href: "https://github.com",
  },
  {
    id: "stockwell",
    template: "inventory",
    name: "Stockwell",
    pitch: "Inventory and reordering for independent shops",
    summary: "Tracks stock across tills and drafts purchase orders for suppliers as soon as an item runs low.",
    features: ["Routing", "Typed operations", "Jobs"],
    url: "stockwell.shop/inventory",
    href: "https://github.com",
  },
  {
    id: "courseyard",
    template: "cohort-courses",
    name: "Courseyard",
    pitch: "Cohort-based courses for independent instructors",
    summary: "Instructors run paid cohorts with lessons, deadlines and progress tracking, and learners get nudged by email.",
    features: ["Auth", "Routing", "Email"],
    url: "courseyard.io/cohorts/3",
    href: "https://github.com",
  },
  {
    id: "cartwise",
    template: "shop-assistant",
    name: "Cartwise",
    pitch: "AI shopping assistant for Shopify and WordPress stores",
    summary: "Answers product questions and builds carts for shoppers, syncing each store's catalogue overnight.",
    features: ["Typed operations", "Jobs", "Auth"],
    url: "trailhouse.store",
    href: "https://github.com",
  },
];

/** Smaller concept apps, listed below the four showcased ones: one-command starters without screenshots. */
export interface MoreExample {
  id: string;
  /** The starter's name in `npx spider new --example …`. */
  template: string;
  name: string;
  pitch: string;
  features: string[];
}

export const MORE_EXAMPLES: MoreExample[] = [
  { id: "studiodesk", template: "class-booking", name: "Studiodesk", pitch: "Class booking for yoga and climbing studios, with waitlists and reminder emails.", features: ["Auth", "Jobs", "Email"] },
  { id: "kitchenpass", template: "kitchen-tickets", name: "Kitchenpass", pitch: "A ticket screen for restaurant kitchens that updates as orders come in.", features: ["Routing", "Typed operations"] },
  { id: "tallyhouse", template: "house-bills", name: "Tallyhouse", pitch: "Shared bills and chores for a house, settled up at the end of each month.", features: ["Auth", "Typed operations", "Jobs"] },
  { id: "feedbox", template: "feedback-board", name: "Feedbox", pitch: "A public feedback board where customers post ideas and vote on them.", features: ["Auth", "Routing", "Typed operations"] },
  { id: "uptick", template: "uptime-checks", name: "Uptick", pitch: "Uptime checks for a handful of sites, with an email when one goes down.", features: ["Jobs", "Email"] },
  { id: "hirelane", template: "applicant-tracking", name: "Hirelane", pitch: "Applicant tracking for small teams: one board per role, notes and interview slots.", features: ["Auth", "Routing", "Email"] },
  { id: "lendshelf", template: "tool-library", name: "Lendshelf", pitch: "A neighbourhood tool library that tracks who has what and when it's due back.", features: ["Auth", "Jobs", "Email"] },
  { id: "launchlist", template: "waitlist", name: "Launchlist", pitch: "A pre-launch waitlist with referral codes and a weekly progress email.", features: ["Typed operations", "Jobs", "Email"] },
  { id: "clinicbook", template: "appointments", name: "Clinicbook", pitch: "Appointment booking for small clinics, with confirmations and next-day reminders.", features: ["Auth", "Routing", "Jobs", "Email"] },
  { id: "pantrylog", template: "food-bank", name: "Pantrylog", pitch: "Stock and collection slots for a community food bank.", features: ["Routing", "Typed operations"] },
];
