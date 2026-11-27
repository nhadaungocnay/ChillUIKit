import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ImportReviewRow {
  rowNumber: number;
  label: string;
  detail: string;
  error?: string;
}

export interface ImportReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  rows: ImportReviewRow[];
  onConfirm: () => void;
}

export function ImportReviewModal({
  open,
  onOpenChange,
  title = "Review Imported Data",
  rows,
  onConfirm,
}: ImportReviewModalProps) {
  const errorCount = rows.filter((r) => Boolean(r.error)).length;
  const validCount = rows.length - errorCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Verify parsed rows before committing them to your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary">Total: {rows.length}</Badge>
          <Badge variant="default">Valid: {validCount}</Badge>
          {errorCount > 0 && <Badge variant="destructive">Errors: {errorCount}</Badge>}
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-border text-xs">
          {rows.map((row) => (
            <div
              key={row.rowNumber}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  #{row.rowNumber} · {row.label}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {row.error ?? row.detail}
                </p>
              </div>
              {row.error ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={validCount === 0} onClick={onConfirm}>
            Confirm Import ({validCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
