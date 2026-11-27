import { Download, FileText, Paperclip, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  category?: string;
}

export interface AttachmentManagerProps {
  items: AttachmentItem[];
  onAdd?: () => void;
  onDownload?: (item: AttachmentItem) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export function AttachmentManager({
  items,
  onAdd,
  onDownload,
  onRemove,
  className,
}: AttachmentManagerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-3 space-y-2.5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Attachments ({items.length})</span>
        </div>
        {onAdd && (
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={onAdd}>
            <Plus className="h-3 w-3" /> Add File
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-3 text-center text-xs text-muted-foreground">No attachments yet.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.size}</p>
                </div>
                {item.category && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {item.category}
                  </Badge>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onDownload(item)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
