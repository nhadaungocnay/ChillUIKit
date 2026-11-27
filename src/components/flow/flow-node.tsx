import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Bot, Flag, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatusDot, type StatusDotState } from "@/components/ui/status-dot";

export type FlowNodeKind = "trigger" | "agent" | "tool" | "output";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  kind: FlowNodeKind;
  description?: string;
  status?: StatusDotState;
  meta?: string;
}

export type ChillFlowNode = Node<FlowNodeData, "chillNode">;

const kindIcons: Record<FlowNodeKind, React.ReactNode> = {
  trigger: <Zap className="h-3.5 w-3.5 text-warning" />,
  agent: <Bot className="h-3.5 w-3.5 text-ring" />,
  tool: <Wrench className="h-3.5 w-3.5 text-muted-foreground" />,
  output: <Flag className="h-3.5 w-3.5 text-success" />,
};

export function FlowNode({ data, selected }: NodeProps<ChillFlowNode>) {
  return (
    <div
      className={cn(
        "min-w-52 max-w-64 rounded-lg border border-border bg-surface text-surface-foreground shadow-sm transition-shadow",
        selected && "ring-2 ring-ring border-primary"
      )}
    >
      {data.kind !== "trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !border-2 !border-background !bg-primary"
        />
      )}

      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0">{kindIcons[data.kind]}</span>
          <span className="truncate text-xs font-semibold text-foreground">{data.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {data.status && <StatusDot status={data.status} pulse={data.status === "busy"} />}
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
            {data.kind}
          </Badge>
        </div>
      </div>

      {(data.description || data.meta) && (
        <div className="space-y-1.5 px-3 py-2">
          {data.description && (
            <p className="text-[11px] text-muted-foreground leading-snug">{data.description}</p>
          )}
          {data.meta && (
            <p className="font-mono text-[10px] text-foreground/80">{data.meta}</p>
          )}
        </div>
      )}

      {data.kind !== "output" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-2.5 !w-2.5 !border-2 !border-background !bg-primary"
        />
      )}
    </div>
  );
}
