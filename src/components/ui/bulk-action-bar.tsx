import type * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BulkActionItem {
  id: string;
  label: string;
  variant?: "default" | "outline" | "destructive";
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkActionItem[];
  onClear: () => void;
  className?: string;
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClear,
  className,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="default">{selectedCount} selected</Badge>
        <span className="text-muted-foreground">Choose a bulk action:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((act) => (
          <Button
            key={act.id}
            variant={act.variant ?? "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={act.onClick}
          >
            {act.icon}
            {act.label}
          </Button>
        ))}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear} title="Clear selection">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
