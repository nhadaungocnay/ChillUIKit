import * as React from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Folder, Square, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isContainerType, type DropPosition, type StudioBlock } from "@/studio/types";

export interface StudioLayersProps {
  blocks: StudioBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onMoveNodeRelative: (sourceId: string, targetId: string | null, position: DropPosition) => void;
}

export function StudioLayers({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onToggleVisibility,
  onDeleteBlock,
  onMoveNodeRelative,
}: StudioLayersProps) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderLayer = (block: StudioBlock, depth = 0): React.ReactNode => {
    const isContainer = isContainerType(block.type);
    const hasChildren = Boolean(block.children && block.children.length > 0);
    const isCollapsed = Boolean(collapsed[block.id]);
    const selected = selectedBlockId === block.id;

    return (
      <div key={block.id}>
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData("application/x-chill-layer", block.id);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverId(block.id);
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            if (dragOverId === block.id) setDragOverId(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverId(null);
            const sourceId = e.dataTransfer.getData("application/x-chill-layer");
            if (sourceId && sourceId !== block.id) {
              onMoveNodeRelative(sourceId, block.id, isContainer ? "inside" : "after");
            }
          }}
          onClick={() => onSelectBlock(block.id)}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={cn(
            "group flex items-center justify-between gap-1 rounded-md py-1 pr-1.5 text-xs cursor-pointer transition-colors",
            selected
              ? "bg-primary/15 text-primary font-medium"
              : "text-foreground hover:bg-muted/70",
            block.hidden && "opacity-45",
            dragOverId === block.id && "ring-1 ring-primary bg-primary/10"
          )}
        >
          <div className="flex min-w-0 items-center gap-1">
            {isContainer ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapse(block.id);
                }}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-muted cursor-pointer"
              >
                {hasChildren ? (
                  isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )
                ) : (
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                )}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}
            {isContainer ? (
              <Folder className="h-3 w-3 shrink-0 text-muted-foreground" />
            ) : (
              <Square className="h-3 w-3 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{block.props.title || block.type}</span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              title={block.hidden ? "Show" : "Hide"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(block.id);
              }}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {block.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBlock(block.id);
              }}
              className="rounded p-0.5 text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {isContainer && !isCollapsed && block.children?.map((child) => renderLayer(child, depth + 1))}
      </div>
    );
  };

  if (blocks.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No layers yet. Drag components onto the canvas.
      </p>
    );
  }

  return <div className="space-y-0.5">{blocks.map((b) => renderLayer(b, 0))}</div>;
}
