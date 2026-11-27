import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type StatusNodeTone = "start" | "todo" | "in-progress" | "done" | "blocked";

export interface StatusNodeData extends Record<string, unknown> {
  label: string;
  tone: StatusNodeTone;
}

export type ChillStatusNode = Node<StatusNodeData, "statusNode">;

const toneClasses: Record<StatusNodeTone, string> = {
  start: "rounded-full bg-primary text-primary-foreground border-primary px-4",
  todo: "rounded-md bg-muted text-foreground border-border",
  "in-progress": "rounded-md bg-ring/15 text-ring border-ring/40",
  done: "rounded-md bg-success/15 text-success border-success/40",
  blocked: "rounded-md bg-destructive/15 text-destructive border-destructive/40",
};

export function StatusNode({ data, selected }: NodeProps<ChillStatusNode>) {
  return (
    <div
      className={cn(
        "inline-flex min-w-24 items-center justify-center border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-xs transition-shadow",
        toneClasses[data.tone],
        selected && "ring-2 ring-ring ring-offset-1"
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-muted-foreground !border-background" />
      <Handle type="target" position={Position.Top} id="top" className="!h-2 !w-2 !bg-muted-foreground !border-background" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-muted-foreground !border-background" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!h-2 !w-2 !bg-muted-foreground !border-background" />
    </div>
  );
}
