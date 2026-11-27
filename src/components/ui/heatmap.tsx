import { cn } from "@/lib/utils";

export interface HeatmapProps {
  values: number[];
  columns?: number;
  className?: string;
}

export function Heatmap({ values, columns = 12, className }: HeatmapProps) {
  const max = Math.max(1, ...values);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {values.map((v, idx) => {
          const ratio = v / max;
          const bg =
            v === 0
              ? "bg-muted"
              : ratio < 0.35
              ? "bg-success/30"
              : ratio < 0.7
              ? "bg-success/65"
              : "bg-success";
          return (
            <div
              key={idx}
              title={`Count: ${v}`}
              className={cn("aspect-square rounded-xs", bg)}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        <span className="h-2.5 w-2.5 rounded-xs bg-muted" />
        <span className="h-2.5 w-2.5 rounded-xs bg-success/30" />
        <span className="h-2.5 w-2.5 rounded-xs bg-success/65" />
        <span className="h-2.5 w-2.5 rounded-xs bg-success" />
        <span>More</span>
      </div>
    </div>
  );
}
