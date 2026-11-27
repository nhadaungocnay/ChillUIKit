import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  delta,
  trend = "neutral",
  description,
  icon,
  className,
}: StatCardProps) {
  const variant =
    trend === "up" ? "success" : trend === "down" ? "destructive" : "secondary";

  return (
    <Card className={cn(className)}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          {icon && <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {delta && <Badge variant={variant}>{delta}</Badge>}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
