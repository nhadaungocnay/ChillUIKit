import * as React from "react";
import { ChevronDown, ChevronRight, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ToolCallCardProps {
  name: string;
  status?: "running" | "done" | "error";
  durationMs?: number;
  input: unknown;
  output?: unknown;
  className?: string;
}

export function ToolCallCard({
  name,
  status = "done",
  durationMs,
  input,
  output,
  className,
}: ToolCallCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("rounded-lg border border-border bg-surface text-xs", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 cursor-pointer"
      >
        <span className="flex items-center gap-2 font-mono font-medium text-foreground">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
          {name}
        </span>
        <span className="flex items-center gap-2">
          {durationMs !== undefined && (
            <span className="font-mono text-muted-foreground">{durationMs}ms</span>
          )}
          <Badge variant={status === "error" ? "destructive" : status === "running" ? "warning" : "success"}>
            {status}
          </Badge>
        </span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-border p-3 font-mono">
          <div>
            <p className="mb-1 text-[10px] uppercase text-muted-foreground">Input</p>
            <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>
          {output !== undefined && (
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Output</p>
              <pre className="overflow-x-auto rounded bg-background p-2 text-foreground">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
