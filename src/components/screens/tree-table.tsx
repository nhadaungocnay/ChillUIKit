import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { PriorityBars, type PriorityLevel } from "@/components/ui/priority-bars";
import { StatusDot, type StatusDotState } from "@/components/ui/status-dot";

export interface TreeTableNode {
  id: string;
  key?: string;
  title: string;
  status?: StatusDotState;
  priority?: PriorityLevel;
  assignee?: string;
  children?: TreeTableNode[];
}

export function TreeTable({
  nodes,
  className,
}: {
  nodes: TreeTableNode[];
  className?: string;
}) {
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(nodes.map((n) => [n.id, true]))
  );

  const renderRows = (list: TreeTableNode[], depth = 0): React.ReactNode =>
    list.map((node) => {
      const hasChildren = !!node.children && node.children.length > 0;
      const isOpen = !!open[node.id];

      return (
        <React.Fragment key={node.id}>
          <tr className="border-b border-border text-xs hover:bg-muted/40">
            <td className="px-3 py-2">
              <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setOpen((p) => ({ ...p, [node.id]: !p[node.id] }))}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                ) : (
                  <span className="w-3.5" />
                )}
                {node.key && <span className="font-mono text-muted-foreground">{node.key}</span>}
                <span className="font-medium text-foreground">{node.title}</span>
              </div>
            </td>
            <td className="px-3 py-2">
              {node.status && <StatusDot status={node.status} label={node.status} />}
            </td>
            <td className="px-3 py-2">
              {node.priority && <PriorityBars priority={node.priority} />}
            </td>
            <td className="px-3 py-2">
              {node.assignee && <Avatar fallback={node.assignee} size="sm" />}
            </td>
          </tr>
          {hasChildren && isOpen && renderRows(node.children!, depth + 1)}
        </React.Fragment>
      );
    });

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border bg-background", className)}>
      <table className="w-full text-left">
        <thead className="border-b border-border bg-surface text-[11px] font-medium text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Work Item</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Priority</th>
            <th className="px-3 py-2">Assignee</th>
          </tr>
        </thead>
        <tbody>{renderRows(nodes)}</tbody>
      </table>
    </div>
  );
}
