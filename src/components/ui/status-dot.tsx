import { cn } from "@/lib/utils";

export type StatusDotState = "idle" | "busy" | "blocked" | "failed" | "finished";

export interface StatusDotProps {
  status: StatusDotState;
  pulse?: boolean;
  label?: string;
  className?: string;
}

const dotColors: Record<StatusDotState, string> = {
  idle: "bg-muted-foreground",
  busy: "bg-ring",
  blocked: "bg-warning",
  failed: "bg-destructive",
  finished: "bg-success",
};

export function StatusDot({ status, pulse = false, label, className }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-foreground", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[status]
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColors[status])} />
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}
