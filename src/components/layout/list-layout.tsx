import type * as React from "react";
import { cn } from "@/lib/utils";

export interface ListLayoutProps {
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  filters?: React.ReactNode;
  table: React.ReactNode;
  className?: string;
}

export function ListLayout({
  header,
  toolbar,
  filters,
  table,
  className,
}: ListLayoutProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(header || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {header && <div className="min-w-0">{header}</div>}
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}
      {filters && <div>{filters}</div>}
      <div className="min-w-0">{table}</div>
    </div>
  );
}
