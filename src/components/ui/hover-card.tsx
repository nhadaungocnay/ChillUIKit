import * as React from "react";
import { cn } from "@/lib/utils";

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {trigger}
      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-background p-3.5 shadow-lg",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
