import * as React from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface CommentReaction {
  emoji: string;
  count: number;
  reacted?: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  avatarFallback: string;
  role?: string;
  time: string;
  content: string;
  reactions?: CommentReaction[];
  replies?: CommentItem[];
}

export interface CommentThreadProps {
  comments: CommentItem[];
  resolved?: boolean;
  onToggleResolve?: () => void;
  onReact?: (commentId: string, emoji: string) => void;
  onSubmitReply?: (text: string) => void;
  className?: string;
}

function renderContentWithMentions(text: string) {
  return text.split(/(@\w+)/g).map((part, idx) =>
    part.startsWith("@") ? (
      <span key={idx} className="rounded bg-ring/15 px-1 py-0.5 font-medium text-ring">
        {part}
      </span>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

export function CommentThread({
  comments,
  resolved = false,
  onToggleResolve,
  onReact,
  onSubmitReply,
  className,
}: CommentThreadProps) {
  const [reply, setReply] = React.useState("");

  const renderItem = (item: CommentItem, isReply = false) => (
    <div key={item.id} className={cn("flex gap-3", isReply && "ml-9 mt-3 border-l border-border pl-3")}>
      <Avatar fallback={item.avatarFallback} size="sm" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">{item.author}</span>
          {item.role && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.role}</Badge>}
          <span className="text-muted-foreground">{item.time}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {renderContentWithMentions(item.content)}
        </p>
        {item.reactions && item.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.reactions.map((r) => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => onReact?.(item.id, r.emoji)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors cursor-pointer",
                  r.reacted
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{r.emoji}</span>
                <span className="font-mono text-[11px]">{r.count}</span>
              </button>
            ))}
          </div>
        )}
        {item.replies?.map((rep) => renderItem(rep, true))}
      </div>
    </div>
  );

  return (
    <div className={cn("rounded-lg border border-border bg-surface/60 p-4 space-y-4", className)}>
      {onToggleResolve && (
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            {resolved ? "Thread resolved" : `${comments.length} comment(s)`}
          </span>
          <Button variant="ghost" size="sm" onClick={onToggleResolve} className="h-7 gap-1.5 text-xs">
            {resolved ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Reopen
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Resolve
              </>
            )}
          </Button>
        </div>
      )}

      <div className={cn("space-y-4", resolved && "opacity-60")}>
        {comments.map((c) => renderItem(c))}
      </div>

      {onSubmitReply && !resolved && (
        <div className="space-y-2 border-t border-border pt-3">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply... (use @name to mention)"
            className="min-h-16"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!reply.trim()}
              onClick={() => {
                onSubmitReply(reply.trim());
                setReply("");
              }}
            >
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
