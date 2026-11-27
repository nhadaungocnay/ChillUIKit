import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavTreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  dot?: boolean;
  children?: NavTreeNode[];
}

export interface NavTreeProps {
  nodes: NavTreeNode[];
  activeId?: string | null;
  defaultOpenIds?: string[];
  onSelect?: (node: NavTreeNode) => void;
  className?: string;
}

export function NavTree({
  nodes,
  activeId,
  defaultOpenIds = [],
  onSelect,
  className,
}: NavTreeProps) {
  const [openIds, setOpenIds] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(defaultOpenIds.map((id) => [id, true]))
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNodes = (list: NavTreeNode[], depth = 0) =>
    list.map((node) => {
      const hasChildren = !!node.children && node.children.length > 0;
      const isOpen = !!openIds[node.id];
      const isActive = activeId === node.id;

      return (
        <div key={node.id}>
          <button
            type="button"
            onClick={() => {
              if (hasChildren) toggle(node.id);
              onSelect?.(node);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
              depth === 0 ? "font-medium" : "font-normal",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {hasChildren &&
                (isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
                ))}
              {node.icon && <span className="shrink-0 [&_svg]:size-3.5">{node.icon}</span>}
              <span className="truncate">{node.label}</span>
              {node.dot && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              )}
            </span>
            {node.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {node.badge}
              </span>
            )}
          </button>

          {hasChildren && isOpen && (
            <div className="ml-3.5 mt-0.5 space-y-0.5 border-l border-border pl-2.5">
              {renderNodes(node.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  return <nav className={cn("space-y-0.5", className)}>{renderNodes(nodes)}</nav>;
}
