import * as React from "react";
import { Columns3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DataGridColumn<T> {
  key: keyof T & string;
  header: string;
  editable?: boolean;
}

export interface DataGridViewProps<T extends { id: string }> {
  data: T[];
  columns: DataGridColumn<T>[];
  onCellChange?: (rowId: string, key: keyof T & string, value: string) => void;
  onAddRow?: () => void;
  className?: string;
}

export function DataGridView<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  onAddRow,
  className,
}: DataGridViewProps<T>) {
  const [compact, setCompact] = React.useState(true);
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([]);
  const [editing, setEditing] = React.useState<{ rowId: string; key: string } | null>(null);
  const [draft, setDraft] = React.useState("");

  const visibleCols = columns.filter((c) => !hiddenCols.includes(c.key));

  const toggleCol = (key: string) => {
    setHiddenCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Columns3 className="h-3.5 w-3.5" /> Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-2 space-y-1">
              {columns.map((col) => (
                <label key={col.key} className="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={!hiddenCols.includes(col.key)}
                    onCheckedChange={() => toggleCol(col.key)}
                  />
                  <span>{col.header}</span>
                </label>
              ))}
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompact((c) => !c)}
            className="h-8 text-xs"
          >
            Density: {compact ? "Compact" : "Comfortable"}
          </Button>
        </div>

        {onAddRow && (
          <Button size="sm" onClick={onAddRow} className="h-8 gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add row
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="border-b border-border bg-surface text-muted-foreground">
            <tr>
              {visibleCols.map((col) => (
                <th key={col.key} className="border-r border-border/60 last:border-r-0 px-3 py-2 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30">
                {visibleCols.map((col) => {
                  const isEditing = editing?.rowId === row.id && editing?.key === col.key;
                  const val = String(row[col.key] ?? "");
                  return (
                    <td
                      key={col.key}
                      onClick={() => {
                        if (col.editable !== false && onCellChange) {
                          setEditing({ rowId: row.id, key: col.key });
                          setDraft(val);
                        }
                      }}
                      className={cn(
                        "border-r border-border/60 last:border-r-0 px-3",
                        compact ? "py-1.5" : "py-2.5",
                        col.editable !== false && onCellChange && "cursor-text hover:bg-muted/50"
                      )}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => {
                            onCellChange?.(row.id, col.key, draft);
                            setEditing(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onCellChange?.(row.id, col.key, draft);
                              setEditing(null);
                            } else if (e.key === "Escape") {
                              setEditing(null);
                            }
                          }}
                          className="w-full bg-background px-1 py-0.5 text-xs text-foreground outline-none ring-1 ring-ring rounded-xs"
                        />
                      ) : (
                        <span className="text-foreground">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
