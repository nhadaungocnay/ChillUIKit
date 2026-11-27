import * as React from "react";
import { cn } from "@/lib/utils";

export function Timeline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ol className={cn("relative space-y-4 border-l border-border pl-5", className)}>{children}</ol>;
}

export interface TimelineItemProps {
  title: string;
  time?: string;
  description?: string;
  active?: boolean;
}

export function TimelineItem({ title, time, description, active = false }: TimelineItemProps) {
  return (
    <li className="relative">
      <span
        className={cn(
          "absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border border-background",
          active ? "bg-primary" : "bg-muted-foreground/50"
        )}
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {time && <span className="font-mono text-xs text-muted-foreground">{time}</span>}
      </div>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </li>
  );
}
