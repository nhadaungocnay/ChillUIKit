import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type AuditActionType = "create" | "update" | "approve" | "reject" | "comment";

export interface AuditFieldChange {
  field: string;
  oldValue?: string;
  newValue: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole?: string;
  action: AuditActionType;
  summary: string;
  timestamp: string;
  changes?: AuditFieldChange[];
}

export interface AuditLogProps {
  entries: AuditLogEntry[];
  className?: string;
  showFilter?: boolean;
}

const ACTION_LABEL: Record<AuditActionType, string> = {
  create: "Created",
  update: "Updated",
  approve: "Approved",
  reject: "Rejected",
  comment: "Commented",
};

const ACTION_VARIANT: Record<AuditActionType, "default" | "secondary" | "outline" | "destructive"> = {
  create: "default",
  update: "secondary",
  approve: "default",
  reject: "destructive",
  comment: "outline",
};

export function AuditLog({ entries, className, showFilter = true }: AuditLogProps) {
  const [filter, setFilter] = React.useState<AuditActionType | "all">("all");
  const filtered = filter === "all" ? entries : entries.filter((e) => e.action === filter);

  return (
    <div className={cn("space-y-3 rounded-lg border border-border bg-surface p-4", className)}>
      {showFilter && (
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "create", "update", "approve", "reject", "comment"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {key === "all" ? "All" : ACTION_LABEL[key]}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No activity recorded.</p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                {entry.actor.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{entry.actor}</span>
                    {entry.actorRole && (
                      <span className="text-[11px] text-muted-foreground">{entry.actorRole}</span>
                    )}
                    <Badge variant={ACTION_VARIANT[entry.action]} className="text-[10px]">
                      {ACTION_LABEL[entry.action]}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{entry.timestamp}</span>
                </div>
                <p className="text-xs text-foreground">{entry.summary}</p>
                {entry.changes && entry.changes.length > 0 && (
                  <div className="mt-1.5 space-y-1 rounded-md bg-muted/60 p-2 text-[11px]">
                    {entry.changes.map((c, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-muted-foreground">{c.field}:</span>
                        {c.oldValue !== undefined && (
                          <span className="line-through text-destructive">{c.oldValue}</span>
                        )}
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium text-foreground">{c.newValue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
