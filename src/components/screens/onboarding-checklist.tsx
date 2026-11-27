import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface OnboardingStep {
  id: string;
  label: string;
  done: boolean;
}

export function OnboardingChecklist({
  title = "Getting Started",
  steps,
  onToggle,
  className,
}: {
  title?: string;
  steps: OnboardingStep[];
  onToggle?: (id: string) => void;
  className?: string;
}) {
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <Card className={cn("max-w-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <span className="font-mono text-xs text-muted-foreground">
            {doneCount}/{steps.length}
          </span>
        </div>
        <Progress value={doneCount} max={steps.length} />
      </CardHeader>
      <CardContent className="space-y-1.5 pt-2">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle?.(s.id)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted/60 cursor-pointer"
          >
            {s.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className={s.done ? "line-through text-muted-foreground" : "text-foreground"}>
              {s.label}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
