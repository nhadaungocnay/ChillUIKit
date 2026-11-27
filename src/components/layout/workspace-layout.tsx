import type * as React from "react";
import { cn } from "@/lib/utils";

export interface WorkspaceLayoutProps {
  header?: React.ReactNode;
  tabs?: React.ReactNode;
  kpis?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function WorkspaceLayout({
  header,
  tabs,
  kpis,
  content,
  className,
}: WorkspaceLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header && <div>{header}</div>}
      {tabs && <div>{tabs}</div>}
      {kpis && <div>{kpis}</div>}
      <div className="min-w-0">{content}</div>
    </div>
  );
}
