import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingDockProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingDock({ children, className }: FloatingDockProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}
