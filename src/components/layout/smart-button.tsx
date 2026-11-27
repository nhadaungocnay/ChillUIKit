import * as React from "react";
import { cn } from "@/lib/utils";

export interface SmartButtonProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function SmartButton({ icon, value, label, onClick, className }: SmartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-1.5 text-left transition-colors hover:bg-muted/60 cursor-pointer",
        className
      )}
    >
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <span className="leading-tight">
        <span className="block font-mono text-xs font-semibold text-foreground">{value}</span>
        <span className="block text-[11px] text-muted-foreground">{label}</span>
      </span>
    </button>
  );
}

export function SmartButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}
