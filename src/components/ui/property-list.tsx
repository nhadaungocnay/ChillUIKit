import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropertyRow {
  label: string;
  value: React.ReactNode;
}

export function PropertyList({
  rows,
  className,
}: {
  rows: PropertyRow[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-border rounded-lg border border-border bg-surface text-xs", className)}>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[120px_1fr] items-center gap-3 px-3 py-2.5">
          <dt className="font-medium text-muted-foreground">{row.label}</dt>
          <dd className="text-foreground min-w-0">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
