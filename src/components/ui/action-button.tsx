import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface ActionButtonProps extends Omit<ButtonProps, "onClick"> {
  onAction: () => Promise<void> | void;
  idleLabel?: string;
  loadingLabel?: string;
  doneLabel?: string;
}

export function ActionButton({
  onAction,
  idleLabel = "Run",
  loadingLabel = "Running...",
  doneLabel = "Done",
  className,
  ...props
}: ActionButtonProps) {
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("loading");
    try {
      await onAction();
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className={cn("min-w-24", className)}
      {...props}
    >
      {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
      {state === "done" && <Check className="h-4 w-4 text-success" />}
      <span>
        {state === "idle" ? idleLabel : state === "loading" ? loadingLabel : doneLabel}
      </span>
    </Button>
  );
}
