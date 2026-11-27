import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export interface ComparisonField {
  key: string;
  label: string;
  before: string;
  after: string;
}

export interface DataComparisonProps {
  fields: ComparisonField[];
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function DataComparison({
  fields,
  beforeLabel = "Previous",
  afterLabel = "Current",
  className,
}: DataComparisonProps) {
  const [onlyChanges, setOnlyChanges] = React.useState(false);
  const rows = onlyChanges ? fields.filter((f) => f.before !== f.after) : fields;

  return (
    <div className={cn("rounded-lg border border-border bg-surface overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-semibold text-foreground">Record Comparison</span>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <Switch checked={onlyChanges} onCheckedChange={setOnlyChanges} />
          <span>Only changes</span>
        </label>
      </div>
      <div className="divide-y divide-border text-xs">
        <div className="grid grid-cols-3 bg-muted/50 px-4 py-2 font-medium text-muted-foreground">
          <span>Field</span>
          <span>{beforeLabel}</span>
          <span>{afterLabel}</span>
        </div>
        {rows.map((f) => {
          const changed = f.before !== f.after;
          return (
            <div
              key={f.key}
              className={cn("grid grid-cols-3 items-center px-4 py-2.5", changed && "bg-primary/5")}
            >
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <span>{f.label}</span>
                {changed && <Badge variant="secondary" className="text-[10px]">Changed</Badge>}
              </div>
              <span className={cn("truncate", changed ? "text-destructive line-through" : "text-muted-foreground")}>
                {f.before}
              </span>
              <span className={cn("truncate font-medium", changed ? "text-foreground" : "text-muted-foreground")}>
                {f.after}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
