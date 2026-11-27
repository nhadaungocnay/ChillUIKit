import * as React from "react";
import { Code2, Eye, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

export interface ComponentPreviewProps {
  title: string;
  description?: string;
  badge?: string;
  code: string;
  children: React.ReactNode;
  allowViewportToggle?: boolean;
  className?: string;
}

export function ComponentPreview({
  title,
  description,
  badge,
  code,
  children,
  allowViewportToggle = false,
  className,
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [viewport, setViewport] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background", className)}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {allowViewportToggle && tab === "preview" && (
            <div className="flex items-center rounded-md border border-border bg-background p-0.5">
              <Button
                type="button"
                variant={viewport === "desktop" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewport("desktop")}
                aria-label="Desktop viewport"
                className="h-7 w-7"
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant={viewport === "mobile" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewport("mobile")}
                aria-label="Mobile viewport"
                className="h-7 w-7"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            <Button
              type="button"
              variant={tab === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("preview")}
              className="h-7 gap-1.5 px-2.5 text-xs"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
            <Button
              type="button"
              variant={tab === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("code")}
              className="h-7 gap-1.5 px-2.5 text-xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              Code
            </Button>
          </div>
        </div>
      </div>

      {/* Stage */}
      {tab === "preview" ? (
        <div className="bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-6">
          <div
            className={cn(
              "mx-auto transition-all duration-200",
              viewport === "mobile"
                ? "max-w-[375px] rounded-xl border border-border bg-background p-4 shadow-sm"
                : "w-full"
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-surface/30">
          <CodeBlock code={code} language="tsx" className="border-0" />
        </div>
      )}
    </div>
  );
}
