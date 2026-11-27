import type * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedCollapseProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCollapse({ open, children, className }: AnimatedCollapseProps) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
