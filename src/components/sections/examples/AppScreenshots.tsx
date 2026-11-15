import type { ReactNode } from "react";
import { Box, CheckCircle, Home02, PackageCheck, Send01, Stars02, Truck01, Users01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { cartwiseFont, courseyardFont, rosterlyFont, stockwellFont, stockwellMono } from "./appFonts";
import type { ExampleId } from "./exampleData";

/*
 * Product screenshots for the concept apps. Each is its own product with its own palette,
 * type and layout (Tailwind's stock palettes, not Spider's), drawn in markup so it stays crisp.
 * Each is the top of a browser window; the showcase crops the rest.
 */

/*
 * Rosterly: calm hospitality software. Cream and espresso with a single terracotta accent,
 * kept for the one thing that needs a manager's attention: the pending swap.
 */

const DAYS = [
  ["Mon", 17],
  ["Tue", 18],
  ["Wed", 19],
  ["Thu", 20],
  ["Fri", 21],
  ["Sat", 22],
  ["Sun", 23],
] as const;
const TODAY = 2;
// Phones show the first four days, so each shift keeps room for its times.
const PHONE_DAYS = 4;
const phoneHidden = (day: number) => day >= PHONE_DAYS && "max-sm:hidden";

const ROTA: { name: string; role: string; shifts: (string | null)[] }[] = [
  { name: "Ada Mensah", role: "Barista", shifts: ["07–15", "07–15", null, "07–15", "swap", null, "09–17"] },
  { name: "Ben Hart", role: "Kitchen", shifts: [null, "11–19", "11–19", null, "11–19", "07–15", "07–15"] },
  { name: "Chloe Ruiz", role: "Floor", shifts: ["15–23", null, "15–23", "15–23", null, "15–23", null] },
  { name: "Dev Patel", role: "Barista", shifts: ["09–17", "09–17", "09–17", null, "07–15", "11–19", null] },
];

function Rosterly() {
  return (
    <div className={cx(rosterlyFont.className, "bg-amber-50/40 text-stone-800")}>
      <div className="flex h-11 items-center gap-6 border-b border-stone-200/80 bg-white px-4">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900">
          <span className="flex size-5 items-center justify-center rounded-md bg-stone-900">
            <span className="size-1.5 rounded-full bg-amber-100" />
          </span>
          Rosterly
        </span>
        <nav className="hidden h-full items-stretch gap-4 text-xs font-medium text-stone-500 sm:flex">
          <span className="flex items-center border-b-2 border-stone-900 text-stone-900">Rota</span>
          <span className="flex items-center">Team</span>
          <span className="flex items-center gap-1.5">
            Swaps
            <span className="size-1.5 rounded-full bg-orange-700" />
          </span>
        </nav>
        <span className="ml-auto rounded-md bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-50">
          Publish week
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-stone-900">Week of 17 November</span>
            <span className="text-xs text-stone-500">Camden · 4 on the team · 152 hours</span>
          </div>
          <span className="hidden items-center gap-1.5 text-xs font-medium text-orange-800 sm:flex">
            <span className="size-1.5 rounded-full bg-orange-700" />1 swap to review
          </span>
        </div>

        <div className="grid grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] gap-1.5 text-xs sm:grid-cols-[6.5rem_repeat(7,minmax(0,1fr))]">
          <span />
          {DAYS.map(([day, date], i) => (
            <span
              key={day}
              className={cx("flex flex-col items-center", i === TODAY ? "text-stone-900" : "text-stone-400", phoneHidden(i))}
            >
              <span>{day}</span>
              <span className={cx("font-semibold", i === TODAY && "underline decoration-2 underline-offset-4")}>
                {date}
              </span>
            </span>
          ))}

          {ROTA.map(({ name, role, shifts }) => (
            <div key={name} className="contents">
              <span className="flex min-w-0 flex-col justify-center">
                <span className="truncate font-semibold text-stone-800">{name}</span>
                <span className="truncate text-stone-400">{role}</span>
              </span>
              {shifts.map((shift, i) =>
                shift === "swap" ? (
                  <span
                    key={i}
                    className={cx(
                      "flex h-8 items-center justify-center rounded-md border border-orange-700/30 bg-orange-50 font-medium text-orange-800",
                      phoneHidden(i),
                    )}
                  >
                    Swap?
                  </span>
                ) : shift ? (
                  <span
                    key={i}
                    className={cx(
                      "flex h-8 items-center justify-center rounded-md border bg-white font-medium text-stone-700 tabular-nums",
                      i === TODAY ? "border-stone-400" : "border-stone-200",
                      phoneHidden(i),
                    )}
                  >
                    {shift}
                  </span>
                ) : (
                  <span key={i} className={cx("h-8 rounded-md border border-dashed border-stone-200", phoneHidden(i))} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Stockwell: dense, utilitarian back-office software. Slate sidebar, blue actions, mono SKUs. */

const STOCK: { sku: string; item: string; onHand: number; reorderAt: number; supplier: string }[] = [
  { sku: "OAT-1L", item: "Oat milk 1L", onHand: 4, reorderAt: 12, supplier: "Minor Figures" },
  { sku: "BEAN-1K", item: "House espresso 1kg", onHand: 9, reorderAt: 6, supplier: "Square Mile" },
  { sku: "CUP-12", item: "Paper cups 12oz", onHand: 120, reorderAt: 200, supplier: "Vegware" },
  { sku: "CRS-01", item: "Butter croissant", onHand: 18, reorderAt: 10, supplier: "Bread Ahead" },
  { sku: "SYR-VAN", item: "Vanilla syrup", onHand: 6, reorderAt: 4, supplier: "Monin" },
];

const STOCKWELL_NAV = [
  { Icon: Home02, label: "Overview", active: false },
  { Icon: Box, label: "Inventory", active: true },
  { Icon: Truck01, label: "Orders", active: false },
  { Icon: Users01, label: "Suppliers", active: false },
];

function Stockwell() {
  return (
    <div className={cx(stockwellFont.className, stockwellMono.variable, "flex bg-white text-slate-700")}>
      <aside className="hidden w-36 shrink-0 flex-col gap-0.5 bg-slate-900 p-2 text-xs sm:flex">
        <span className="px-2 py-2 text-xs font-semibold tracking-[0.2em] text-white">STOCKWELL</span>
        {STOCKWELL_NAV.map(({ Icon, label, active }) => (
          <span
            key={label}
            className={cx("flex items-center gap-2 rounded px-2 py-1.5", active ? "bg-blue-600 text-white" : "text-slate-400")}
          >
            <Icon className="size-3.5" />
            {label}
          </span>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Camden · Inventory</span>
            <span className="text-sm font-semibold text-slate-900">Stock levels</span>
          </div>
          <span className="flex items-center gap-1.5 rounded bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white">
            <PackageCheck className="size-3.5" />
            Draft 2 POs
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-1.5 font-medium">SKU</th>
              <th className="px-2 py-1.5 font-medium">Item</th>
              <th className="px-2 py-1.5 text-right font-medium">On hand</th>
              <th className="hidden px-2 py-1.5 font-medium md:table-cell">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {STOCK.map(({ sku, item, onHand, reorderAt, supplier }) => {
              const low = onHand < reorderAt;
              return (
                <tr key={sku} className="border-b border-slate-100">
                  <td className="px-2 py-1.5 font-(family-name:--font-stockwell-mono) text-slate-500">{sku}</td>
                  <td className="truncate px-2 py-1.5 text-slate-800">{item}</td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={cx("inline-flex items-center gap-1.5", low && "font-semibold text-red-600")}>
                      <span className={cx("size-1.5 rounded-full", low ? "bg-red-500" : "bg-slate-300")} />
                      {onHand}
                      <span className="font-normal text-slate-400">/ {reorderAt}</span>
                    </span>
                  </td>
                  <td className="hidden px-2 py-1.5 text-slate-500 md:table-cell">{supplier}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Courseyard: editorial and calm. Paper white, deep green, mustard; a serif throughout. */

const LESSONS: { week: string; title: string; progress: number; note: string }[] = [
  { week: "I", title: "Finding your voice", progress: 100, note: "Completed" },
  { week: "II", title: "Structure that carries", progress: 64, note: "Due Friday" },
  { week: "III", title: "Editing without mercy", progress: 0, note: "Opens Monday" },
];

function Courseyard() {
  return (
    <div className={cx(courseyardFont.className, "flex gap-4 bg-stone-50 p-4 text-emerald-950")}>
      <div className="hidden w-40 shrink-0 flex-col justify-between rounded-lg bg-emerald-900 p-3 text-emerald-50 sm:flex">
        <span className="text-xs tracking-widest text-emerald-300 uppercase">Cohort 3</span>
        <span className="text-xl leading-tight">
          Product <em className="text-amber-300">Writing</em>
        </span>
        <span className="text-xs text-emerald-300">with Maya Okafor</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-lg">
            Good morning, <em>Sam</em>
          </span>
          <span className="text-xs text-emerald-800/60">24 learners</span>
        </div>
        <ol className="flex flex-col gap-2.5">
          {LESSONS.map(({ week, title, progress, note }) => (
            <li key={week} className="flex flex-col gap-1 border-t border-emerald-900/10 pt-2">
              <div className="flex items-baseline gap-2 text-sm">
                <span className="w-6 text-emerald-800/50 italic">{week}.</span>
                <span className="flex-1 truncate">{title}</span>
                <span className="text-xs text-emerald-800/60 italic">{note}</span>
              </div>
              <span className="ml-8 h-1 overflow-hidden rounded-full bg-emerald-900/10">
                <span className="block h-full rounded-full bg-amber-400" style={{ width: `${progress}%` }} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* Cartwise: a violet assistant widget, docked on a store built in its own outdoorsy brand. */

function Cartwise() {
  return (
    <div className={cx(cartwiseFont.className, "flex gap-4 bg-stone-100 p-4 text-stone-900")}>
      <div className="hidden min-w-0 flex-1 flex-col gap-2 sm:flex">
        <span className="text-xs font-bold tracking-[0.3em]">TRAILHOUSE</span>
        <div className="flex h-28 items-end rounded-md bg-linear-to-br from-lime-200 via-lime-300 to-emerald-400 p-2">
          <span className="rounded-sm bg-stone-900 px-1.5 py-0.5 text-xs font-medium text-lime-200">New</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">Ridge trail runner</span>
          <span className="text-sm font-bold">£68</span>
        </div>
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-violet-100 sm:w-64">
        <div className="flex items-center gap-2 bg-linear-to-r from-violet-600 to-fuchsia-500 px-3 py-2 text-white">
          <Stars02 className="size-4" />
          <span className="text-sm font-semibold">Cartwise</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-violet-100">
            <span className="size-1.5 rounded-full bg-lime-300" />
            online
          </span>
        </div>
        <div className="flex flex-col gap-2 p-3 text-xs">
          <p className="max-w-4/5 self-end rounded-2xl rounded-br-sm bg-violet-600 px-3 py-1.5 text-white">
            Do these come in a size 8?
          </p>
          <p className="max-w-4/5 rounded-2xl rounded-bl-sm bg-violet-50 px-3 py-1.5 text-violet-950">
            Yes! Two pairs left in Sand. Added to your cart.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-violet-100 p-1.5">
            <span className="size-7 rounded-md bg-linear-to-br from-lime-200 to-emerald-400" />
            <span className="flex-1 text-stone-700">Ridge · Sand · 8</span>
            <CheckCircle className="size-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1.5 text-stone-400">
            Ask about sizing, stock…
            <Send01 className="ml-auto size-3.5 text-violet-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREENS: Record<ExampleId, () => ReactNode> = {
  rosterly: Rosterly,
  stockwell: Stockwell,
  courseyard: Courseyard,
  cartwise: Cartwise,
};

/** A neutral browser window around the app, so the product's own brand does the talking. */
export default function AppScreenshot({ id, url }: { id: ExampleId; url: string }) {
  const Screen = SCREENS[id];
  return (
    <div className="w-full overflow-hidden rounded-t-lg border border-b-0 border-zinc-700 bg-white shadow-2xl">
      <div className="flex h-8 items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-3">
        <span className="size-2.5 rounded-full bg-zinc-300" />
        <span className="size-2.5 rounded-full bg-zinc-300" />
        <span className="size-2.5 rounded-full bg-zinc-300" />
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 font-sans text-xs text-zinc-500">{url}</span>
      </div>
      <Screen />
    </div>
  );
}
