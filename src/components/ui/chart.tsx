import { cn } from "@/lib/utils";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartPoint[];
  variant?: "bar" | "line" | "sparkline" | "donut";
  height?: number;
  className?: string;
}

export function Chart({
  data,
  variant = "bar",
  height = 140,
  className,
}: ChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (variant === "donut") {
    const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
    let offset = 0;
    const colors = ["var(--primary)", "var(--ring)", "var(--success)", "var(--warning)"];
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
          {data.map((d, i) => {
            const pct = (d.value / total) * 100;
            const el = (
              <circle
                key={d.label}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="4"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-offset}
              />
            );
            offset += pct;
            return el;
          })}
        </svg>
        <ul className="space-y-1 text-xs">
          {data.map((d, i) => (
            <li key={d.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-muted-foreground">{d.label}:</span>
              <span className="font-mono font-medium">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "line" || variant === "sparkline") {
    const w = 300;
    const h = height;
    const pts = data
      .map((d, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
        const y = h - (d.value / max) * (h - 16) - 8;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full overflow-visible", className)} style={{ height }}>
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts}
        />
      </svg>
    );
  }

  return (
    <div className={cn("flex items-end gap-2", className)} style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
          <div
            className="w-full rounded-t-sm bg-primary/85 transition-all hover:bg-primary"
            style={{ height: `${Math.max(8, (d.value / max) * 100)}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-muted-foreground truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
