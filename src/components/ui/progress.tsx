import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full bg-primary transition-all duration-300", indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  className?: string;
}

export function UsageMeter({ label, used, limit, unit = "", className }: UsageMeterProps) {
  const pct = Math.min(100, Math.max(0, (used / limit) * 100));
  const color =
    pct >= 90 ? "bg-destructive" : pct >= 75 ? "bg-warning" : "bg-primary";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-muted-foreground">
          {used}
          {unit} / {limit}
          {unit} ({Math.round(pct)}%)
        </span>
      </div>
      <Progress value={used} max={limit} indicatorClassName={color} />
    </div>
  );
}
