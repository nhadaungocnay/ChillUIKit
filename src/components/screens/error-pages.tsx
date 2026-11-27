import { AlertTriangle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorPageProps {
  code?: "404" | "500" | "maintenance";
  onAction?: () => void;
  className?: string;
}

const copy = {
  "404": {
    title: "Page not found",
    description: "The page you are looking for doesn't exist or has been moved.",
    action: "Go home",
  },
  "500": {
    title: "Internal server error",
    description: "Something went wrong on our end. Please try again shortly.",
    action: "Retry",
  },
  maintenance: {
    title: "Scheduled maintenance",
    description: "We're upgrading our systems and will be back online soon.",
    action: "Check status",
  },
};

export function ErrorPage({ code = "404", onAction, className }: ErrorPageProps) {
  const info = copy[code];
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-border bg-surface/50 px-6 py-12 text-center", className)}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground">
        {code === "maintenance" ? <Wrench className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      </div>
      <span className="font-mono text-xs text-muted-foreground uppercase">{code}</span>
      <h2 className="mt-1 text-lg font-semibold text-foreground">{info.title}</h2>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{info.description}</p>
      {onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {info.action}
        </Button>
      )}
    </div>
  );
}
