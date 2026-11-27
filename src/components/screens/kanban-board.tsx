import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityBars, type PriorityLevel } from "@/components/ui/priority-bars";

export interface KanbanCardItem {
  id: string;
  key?: string;
  title: string;
  priority?: PriorityLevel;
  assignee?: string;
  tag?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCardItem[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveCard?: (cardId: string, fromCol: string, toCol: string) => void;
  onAddCard?: (columnId: string) => void;
  className?: string;
}

export function KanbanBoard({
  columns,
  onMoveCard,
  onAddCard,
  className,
}: KanbanBoardProps) {
  const [dragInfo, setDragInfo] = React.useState<{ cardId: string; fromCol: string } | null>(null);

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {columns.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragInfo && dragInfo.fromCol !== col.id) {
              onMoveCard?.(dragInfo.cardId, dragInfo.fromCol, col.id);
            }
            setDragInfo(null);
          }}
          className="flex flex-col rounded-lg border border-border bg-surface/70 p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {col.title}
              </span>
              <Badge variant="secondary">{col.cards.length}</Badge>
            </div>
            {onAddCard && (
              <Button variant="ghost" size="icon" onClick={() => onAddCard(col.id)} className="h-6 w-6" aria-label={`Add to ${col.title}`}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {col.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => setDragInfo({ cardId: card.id, fromCol: col.id })}
                className="cursor-grab rounded-md border border-border bg-background p-3 shadow-xs space-y-2 active:cursor-grabbing hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  {card.key && (
                    <span className="font-mono text-[11px] text-muted-foreground">{card.key}</span>
                  )}
                  {card.tag && <Badge variant="outline" className="text-[10px]">{card.tag}</Badge>}
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{card.title}</p>
                <div className="flex items-center justify-between pt-1">
                  {card.priority ? <PriorityBars priority={card.priority} showLabel={false} /> : <span />}
                  {card.assignee && <Avatar fallback={card.assignee} size="sm" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
