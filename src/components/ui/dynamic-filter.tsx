import { Filter, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FilterCondition {
  id: string;
  field: string;
  value: string;
}

export interface DynamicFilterProps {
  conditions: FilterCondition[];
  onAddCondition?: () => void;
  onRemoveCondition: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function DynamicFilter({
  conditions,
  onAddCondition,
  onRemoveCondition,
  onClearAll,
  className,
}: DynamicFilterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        <span>Filters</span>
      </div>

      {conditions.map((c) => (
        <Badge key={c.id} variant="secondary" className="gap-1.5 pr-1 text-xs font-normal">
          <span className="font-medium">{c.field}:</span>
          <span>{c.value}</span>
          <button
            type="button"
            onClick={() => onRemoveCondition(c.id)}
            className="rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {onAddCondition && (
        <Button variant="outline" size="sm" className="h-6 gap-1 px-2 text-xs" onClick={onAddCondition}>
          <Plus className="h-3 w-3" /> Add Filter
        </Button>
      )}

      {conditions.length > 0 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-6 px-2 text-xs text-muted-foreground"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
