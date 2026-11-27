import * as React from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerText } from "@/components/ui/effects";

export interface ThinkingStateProps {
  durationLabel?: string;
  steps: string[];
  isThinking?: boolean;
  className?: string;
}

export function ThinkingState({
  durationLabel = "Thought for 2.4s",
  steps,
  isThinking = false,
  className,
}: ThinkingStateProps) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={cn("rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Sparkles className="h-3.5 w-3.5 text-ring" />
        {isThinking ? <ShimmerText>Thinking...</ShimmerText> : <span>{durationLabel}</span>}
      </button>
      {open && (
        <ul className="mt-2 space-y-1 border-l border-border pl-3 text-muted-foreground">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
