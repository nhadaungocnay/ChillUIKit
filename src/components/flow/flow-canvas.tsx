import * as React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type Edge,
  type Node,
  type ReactFlowProps,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { FlowNode } from "@/components/flow/flow-node";
import { StatusNode } from "@/components/flow/status-node";

const defaultNodeTypes = {
  chillNode: FlowNode,
  statusNode: StatusNode,
};

export interface FlowCanvasProps<N extends Node = Node, E extends Edge = Edge>
  extends ReactFlowProps<N, E> {
  toolbar?: React.ReactNode;
  showMiniMap?: boolean;
  className?: string;
}

export function FlowCanvas<N extends Node = Node, E extends Edge = Edge>({
  toolbar,
  showMiniMap = false,
  nodeTypes,
  className,
  ...props
}: FlowCanvasProps<N, E>) {
  return (
    <div
      className={cn(
        "h-[420px] w-full overflow-hidden rounded-lg border border-border bg-background",
        className
      )}
    >
      <ReactFlow
        nodeTypes={nodeTypes ?? defaultNodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        {...props}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--border)" />
        <Controls className="!border-border !bg-surface !shadow-sm" />
        {showMiniMap && (
          <MiniMap
            nodeColor="var(--muted)"
            maskColor="color-mix(in oklch, var(--background) 70%, transparent)"
            className="!border !border-border !bg-surface"
          />
        )}
        {toolbar && <Panel position="top-right">{toolbar}</Panel>}
      </ReactFlow>
    </div>
  );
}
