import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HoldButtonProps {
  label?: string;
  doneLabel?: string;
  durationMs?: number;
  onConfirm: () => void;
  className?: string;
}

export function HoldButton({
  label = "Hold to confirm",
  doneLabel = "Confirmed",
  durationMs = 1200,
  onConfirm,
  className,
}: HoldButtonProps) {
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number>(0);

  const stop = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    if (!done) setProgress(0);
  };

  const start = () => {
    if (done) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - startRef.current) / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setDone(true);
        onConfirm();
        setTimeout(() => {
          setDone(false);
          setProgress(0);
        }, 1500);
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
  };

  return (
    <button
      type="button"
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      className={cn(
        "relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md border border-destructive/40 bg-destructive/10 px-4 text-sm font-medium text-destructive select-none cursor-pointer",
        done && "border-success/40 bg-success/15 text-success",
        className
      )}
    >
      <span
        className="absolute inset-y-0 left-0 bg-destructive/20 transition-none"
        style={{ width: `${done ? 0 : progress}%` }}
      />
      <span className="relative z-10 flex items-center gap-1.5">
        {done && <Check className="h-4 w-4" />}
        {done ? doneLabel : label}
      </span>
    </button>
  );
}
