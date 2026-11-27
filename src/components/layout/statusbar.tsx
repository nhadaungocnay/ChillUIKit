import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusbarStage {
  id: string;
  label: string;
}

export interface StatusbarProps {
  stages: StatusbarStage[];
  currentId: string;
  onStageClick?: (id: string) => void;
  actions?: React.ReactNode;
  className?: string;
}

export function Statusbar({
  stages,
  currentId,
  onStageClick,
  actions,
  className,
}: StatusbarProps) {
  const currentIdx = stages.findIndex((s) => s.id === currentId);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2",
        className
      )}
    >
      <div className="flex items-center gap-2">{actions}</div>
      <div className="flex flex-wrap items-center gap-1">
        {stages.map((stage, idx) => {
          const active = stage.id === currentId;
          const passed = currentIdx !== -1 && idx < currentIdx;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onStageClick?.(stage.id)}
              className={cn(
                "rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors",
                onStageClick && "cursor-pointer",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : passed
                  ? "border-border bg-muted text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {stage.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
