import { Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ContextSegment {
  label: string;
  tokens: number;
  colorClass?: string;
}

export interface ContextWindowProps {
  segments: ContextSegment[];
  limit: number;
  onCompact?: () => void;
  className?: string;
}

export function ContextWindow({ segments, limit, onCompact, className }: ContextWindowProps) {
  const used = segments.reduce((acc, s) => acc + s.tokens, 0);
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const fallbackColors = ["bg-primary", "bg-ring", "bg-success", "bg-warning"];

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-3.5 space-y-2.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs">
          <span className="font-medium text-foreground">Context Window</span>
          <span className="ml-2 font-mono text-muted-foreground">
            {used.toLocaleString()} / {limit.toLocaleString()} ({pct}%)
          </span>
        </div>
        {onCompact && (
          <Button variant="outline" size="sm" onClick={onCompact} className="h-7 gap-1 px-2 text-xs">
            <Minimize2 className="h-3 w-3" /> Compact
          </Button>
        )}
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            title={`${seg.label}: ${seg.tokens.toLocaleString()} tokens`}
            className={cn("h-full", seg.colorClass ?? fallbackColors[i % fallbackColors.length])}
            style={{ width: `${(seg.tokens / limit) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        {segments.map((seg, i) => (
          <span key={seg.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                seg.colorClass ?? fallbackColors[i % fallbackColors.length]
              )}
            />
            {seg.label} ({seg.tokens.toLocaleString()})
          </span>
        ))}
      </div>
    </div>
  );
}
