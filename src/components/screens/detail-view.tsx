import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface DetailViewProps {
  breadcrumb?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DetailView({
  breadcrumb,
  title,
  subtitle,
  badge,
  actions,
  children,
  sidebar,
  className,
}: DetailViewProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          {breadcrumb && <div className="text-xs text-muted-foreground">{breadcrumb}</div>}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-5">{children}</div>
        {sidebar && <aside className="space-y-4">{sidebar}</aside>}
      </div>
    </div>
  );
}
