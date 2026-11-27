import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSheetProps {
  statusbar?: React.ReactNode;
  smartButtons?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  chatter?: React.ReactNode;
  className?: string;
}

export function FormSheet({
  statusbar,
  smartButtons,
  title,
  subtitle,
  children,
  chatter,
  className,
}: FormSheetProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background", className)}>
      {statusbar}
      <div className={cn("grid", chatter ? "lg:grid-cols-[1fr_320px]" : "grid-cols-1")}>
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            {smartButtons}
          </div>
          <div className="space-y-6">{children}</div>
        </div>
        {chatter && (
          <aside className="border-t lg:border-t-0 lg:border-l border-border bg-surface/40 p-4">
            {chatter}
          </aside>
        )}
      </div>
    </div>
  );
}
