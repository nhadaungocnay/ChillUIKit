import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionGridProps {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

const colClasses: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
};

export function SectionGrid({
  title,
  description,
  columns = 2,
  children,
  className,
}: SectionGridProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || description) && (
        <div className="border-b border-border pb-1.5">
          {title && <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h3>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className={cn("grid gap-4", colClasses[columns])}>{children}</div>
    </section>
  );
}
