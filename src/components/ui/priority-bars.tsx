import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PriorityLevel = "none" | "low" | "medium" | "high" | "urgent";

export function PriorityBars({
  priority,
  showLabel = true,
  className,
}: {
  priority: PriorityLevel;
  showLabel?: boolean;
  className?: string;
}) {
  if (priority === "urgent") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-destructive font-medium", className)}>
        <AlertCircle className="h-3.5 w-3.5" />
        {showLabel && <span>Urgent</span>}
      </span>
    );
  }

  const activeBars =
    priority === "high" ? 3 : priority === "medium" ? 2 : priority === "low" ? 1 : 0;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-foreground", className)}>
      <span className="inline-flex items-end gap-0.5 h-3.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-1 rounded-xs",
              bar === 1 ? "h-1.5" : bar === 2 ? "h-2.5" : "h-3.5",
              bar <= activeBars ? "bg-foreground" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </span>
      {showLabel && <span className="capitalize">{priority}</span>}
    </span>
  );
}
