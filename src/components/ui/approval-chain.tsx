import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type ApprovalStepStatus = "approved" | "pending" | "rejected" | "waiting";

export interface ApprovalStep {
  id: string;
  approver: string;
  role: string;
  status: ApprovalStepStatus;
  timestamp?: string;
}

export interface ApprovalChainProps {
  steps: ApprovalStep[];
  className?: string;
}

export function ApprovalChain({ steps, className }: ApprovalChainProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-stretch", className)}>
      {steps.map((step, idx) => {
        const icon =
          step.status === "approved" ? (
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          ) : step.status === "rejected" ? (
            <XCircle className="h-4 w-4 text-destructive shrink-0" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          );

        return (
          <div
            key={step.id}
            className={cn(
              "flex flex-1 items-start gap-2.5 rounded-lg border p-3 text-xs",
              step.status === "pending"
                ? "border-primary bg-primary/5"
                : "border-border bg-surface"
            )}
          >
            {icon}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-foreground truncate">
                  {idx + 1}. {step.approver}
                </span>
                <Badge
                  variant={
                    step.status === "approved"
                      ? "default"
                      : step.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-[10px]"
                >
                  {step.status}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{step.role}</p>
              {step.timestamp && (
                <p className="text-[10px] text-muted-foreground">{step.timestamp}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
