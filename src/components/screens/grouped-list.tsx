import * as React from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PriorityBars, type PriorityLevel } from "@/components/ui/priority-bars";
import { StatusDot, type StatusDotState } from "@/components/ui/status-dot";

export interface GroupedListItem {
  id: string;
  key?: string;
  title: string;
  status?: StatusDotState;
  priority?: PriorityLevel;
  assignee?: string;
}

export interface GroupedListGroup {
  id: string;
  title: string;
  items: GroupedListItem[];
}

export interface GroupedListProps {
  groups: GroupedListGroup[];
  onAddItem?: (groupId: string, title: string) => void;
  className?: string;
}

export function GroupedList({ groups, onAddItem, className }: GroupedListProps) {
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, true]))
  );
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  return (
    <div className={cn("space-y-3", className)}>
      {groups.map((g) => {
        const isOpen = !!open[g.id];
        return (
          <div key={g.id} className="overflow-hidden rounded-lg border border-border bg-background">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [g.id]: !prev[g.id] }))}
              className="flex w-full items-center justify-between bg-surface px-3 py-2 text-xs font-semibold text-foreground cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                <span>{g.title}</span>
                <Badge variant="secondary">{g.items.length}</Badge>
              </span>
            </button>

            {isOpen && (
              <div className="divide-y divide-border">
                {g.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-muted/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.status && <StatusDot status={item.status} />}
                      {item.key && <span className="font-mono text-muted-foreground shrink-0">{item.key}</span>}
                      <span className="truncate font-medium text-foreground">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {item.priority && <PriorityBars priority={item.priority} showLabel={false} />}
                      {item.assignee && <Avatar fallback={item.assignee} size="sm" />}
                    </div>
                  </div>
                ))}

                {onAddItem && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = (drafts[g.id] ?? "").trim();
                      if (!val) return;
                      onAddItem(g.id, val);
                      setDrafts((prev) => ({ ...prev, [g.id]: "" }));
                    }}
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      value={drafts[g.id] ?? ""}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [g.id]: e.target.value }))}
                      placeholder="Create issue..."
                      className="h-7 w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </form>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
