import { cn } from "@/lib/utils";

export type UptimeDayStatus = "up" | "degraded" | "down" | "empty";

export interface UptimeBarProps {
  days: UptimeDayStatus[];
  serviceName?: string;
  uptimePercent?: string;
  className?: string;
}

const barColors: Record<UptimeDayStatus, string> = {
  up: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
  empty: "bg-muted",
};

export function UptimeBar({
  days,
  serviceName = "API Gateway",
  uptimePercent = "99.95%",
  className,
}: UptimeBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{serviceName}</span>
        <span className="font-mono text-success">{uptimePercent} uptime</span>
      </div>
      <div className="flex h-7 items-stretch gap-1">
        {days.map((status, i) => (
          <div
            key={i}
            title={`Day ${i + 1}: ${status}`}
            className={cn("flex-1 rounded-xs transition-opacity hover:opacity-80", barColors[status])}
          />
        ))}
      </div>
    </div>
  );
}
