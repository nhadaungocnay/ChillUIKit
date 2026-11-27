import type * as React from "react";
import { cn } from "@/lib/utils";

export interface DetailLayoutProps {
  header?: React.ReactNode;
  main: React.ReactNode;
  aside: React.ReactNode;
  ratio?: "2:1" | "3:1" | "1:2";
  stickyAside?: boolean;
  className?: string;
}

const RATIO_MAP = {
  "2:1": "lg:grid-cols-[2fr_1fr]",
  "3:1": "lg:grid-cols-[3fr_1fr]",
  "1:2": "lg:grid-cols-[1fr_2fr]",
} as const;

export function DetailLayout({
  header,
  main,
  aside,
  ratio = "2:1",
  stickyAside = true,
  className,
}: DetailLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header && <div>{header}</div>}
      <div className={cn("grid grid-cols-1 gap-6 items-start", RATIO_MAP[ratio])}>
        <div className="min-w-0 space-y-6">{main}</div>
        <aside className={cn("min-w-0 space-y-4", stickyAside && "lg:sticky lg:top-6")}>
          {aside}
        </aside>
      </div>
    </div>
  );
}
