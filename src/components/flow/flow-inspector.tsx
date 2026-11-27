import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FlowInspectorProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FlowInspector({
  title,
  subtitle,
  onClose,
  children,
  footer,
  className,
}: FlowInspectorProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full md:w-72 shrink-0 flex-col border-t md:border-t-0 md:border-l border-border bg-surface",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="space-y-0.5 min-w-0">
          <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close inspector" className="h-7 w-7 shrink-0">
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>

      {footer && (
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          {footer}
        </div>
      )}
    </aside>
  );
}
