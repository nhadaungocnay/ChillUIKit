import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuthLayoutProps {
  brand?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  brand,
  title,
  description,
  children,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center bg-background p-4", className)}>
      <div className="w-full max-w-sm space-y-4">
        {brand && <div className="flex justify-center text-lg font-semibold tracking-tight">{brand}</div>}
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {footer && <div className="text-center text-xs text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
