import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCollapse } from "@/components/ui/animated-collapse";
import { Badge } from "@/components/ui/badge";

export interface CollapsibleCardProps {
  title: string;
  summary?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleCard({
  title,
  summary,
  badge,
  defaultOpen = true,
  children,
  className,
}: CollapsibleCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("rounded-lg border border-border bg-surface overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-90"
            )}
          />
          <span className="text-sm font-semibold text-foreground truncate">{title}</span>
          {badge && <Badge variant="secondary" className="text-[10px]">{badge}</Badge>}
        </div>
        {summary && !open && (
          <span className="text-xs text-muted-foreground truncate">{summary}</span>
        )}
      </button>
      <AnimatedCollapse open={open}>
        <div className="border-t border-border p-4">{children}</div>
      </AnimatedCollapse>
    </div>
  );
}
