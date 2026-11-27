import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface MessageActionsProps {
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  className?: string;
}

export function MessageActions({
  onCopy,
  onRegenerate,
  onFeedback,
  className,
}: MessageActionsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {onCopy && (
        <Button variant="ghost" size="icon" onClick={onCopy} aria-label="Copy" className="h-7 w-7">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="icon" onClick={onRegenerate} aria-label="Regenerate" className="h-7 w-7">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
      {onFeedback && (
        <>
          <Button variant="ghost" size="icon" onClick={() => onFeedback("up")} aria-label="Good" className="h-7 w-7">
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onFeedback("down")} aria-label="Bad" className="h-7 w-7">
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </div>
  );
}
