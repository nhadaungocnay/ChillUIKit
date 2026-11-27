import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContextMenuItem {
  label: string;
  shortcut?: string;
  destructive?: boolean;
  onSelect: () => void;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
      }}
      className={cn("relative", className)}
    >
      {children}
      {pos && (
        <div
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-50 min-w-44 rounded-md border border-border bg-background p-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onSelect();
                setPos(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-xs hover:bg-muted cursor-pointer",
                item.destructive ? "text-destructive" : "text-foreground"
              )}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <kbd className="font-mono text-[10px] text-muted-foreground">{item.shortcut}</kbd>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
