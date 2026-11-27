import { CheckCircle2, Circle, Loader2, Wrench, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StepStatus = "pending" | "running" | "done" | "error";

export interface ExecutionStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
}

export function ExecutionSteps({
  steps,
  className,
}: {
  steps: ExecutionStep[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2", className)}>
      {steps.map((step) => (
        <li
          key={step.id}
          className="flex items-start gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <span className="mt-0.5 shrink-0">
            {step.status === "done" && <CheckCircle2 className="h-4 w-4 text-success" />}
            {step.status === "running" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {step.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
            {step.status === "pending" && (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{step.label}</p>
            {step.detail && (
              <p className="font-mono text-xs text-muted-foreground">{step.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ToolCallBadge({ name, status = "done" }: { name: string; status?: StepStatus }) {
  const variant =
    status === "error" ? "destructive" : status === "running" ? "warning" : "secondary";
  return (
    <Badge variant={variant} className="gap-1 font-mono">
      <Wrench className="h-3 w-3" />
      {name}
    </Badge>
  );
}
