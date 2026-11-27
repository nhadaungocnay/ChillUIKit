import { cn } from "@/lib/utils";

export interface DiffLine {
  type: "context" | "add" | "remove";
  text: string;
}

export function InlineDiff({
  filename,
  lines,
  className,
}: {
  filename?: string;
  lines: DiffLine[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background font-mono text-xs", className)}>
      {filename && (
        <div className="border-b border-border bg-surface px-3 py-1.5 text-muted-foreground">
          {filename}
        </div>
      )}
      <div className="divide-y divide-border/30">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "px-3 py-1 whitespace-pre-wrap",
              line.type === "add" && "bg-success/10 text-success",
              line.type === "remove" && "bg-destructive/10 text-destructive",
              line.type === "context" && "text-muted-foreground"
            )}
          >
            <span className="mr-2 select-none">
              {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
            </span>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
