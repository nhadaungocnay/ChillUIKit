import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function SplitPane({
  left,
  right,
  defaultLeftWidth = 280,
  minLeftWidth = 180,
  maxLeftWidth = 520,
  className,
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = React.useState(defaultLeftWidth);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setLeftWidth((prev) =>
        Math.min(maxLeftWidth, Math.max(minLeftWidth, prev + e.movementX))
      );
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [minLeftWidth, maxLeftWidth]);

  return (
    <div className={cn("flex flex-col md:flex-row rounded-lg border border-border overflow-hidden", className)}>
      <div
        style={{ width: leftWidth }}
        className="hidden md:block shrink-0 bg-surface p-4 overflow-y-auto"
      >
        {left}
      </div>
      <div className="md:hidden border-b border-border bg-surface p-4">{left}</div>
      <div
        onMouseDown={() => {
          dragging.current = true;
        }}
        role="separator"
        aria-orientation="vertical"
        className="hidden md:block w-1 cursor-col-resize bg-border hover:bg-primary/40 transition-colors"
      />
      <div className="flex-1 bg-background p-4 overflow-y-auto">{right}</div>
    </div>
  );
}
