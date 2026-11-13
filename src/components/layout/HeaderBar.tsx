import type { ReactNode } from "react";

/** The bordered strip the header sits in; shared with the mobile menu so its top row lines up exactly. */
export default function HeaderBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center px-2">
      <div className="flex h-16.5 w-full max-w-320 items-center justify-between border border-secondary pr-1 pl-2 md:h-18 md:px-8">
        {children}
      </div>
    </div>
  );
}
