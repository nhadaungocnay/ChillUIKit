import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TokenStream({
  text,
  speedMs = 35,
  className,
}: {
  text: string;
  speedMs?: number;
  className?: string;
}) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => (c < words.length ? c + 1 : c));
    }, speedMs);
    return () => window.clearInterval(id);
  }, [words, speedMs]);

  return (
    <p className={cn("text-sm text-foreground leading-relaxed", className)}>
      {words.slice(0, count).join(" ")}
      {count < words.length && (
        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />
      )}
    </p>
  );
}

export function ShimmerText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-sm font-medium text-transparent animate-[shimmer_2s_infinite_linear]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 450;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setDisplay(Math.round(start + diff * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={cn("font-mono tabular-nums font-semibold", className)}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ShineBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg p-[1px] bg-gradient-to-r from-border via-ring/60 to-border",
        className
      )}
    >
      <div className="rounded-[calc(var(--radius-lg)-1px)] bg-background p-4">
        {children}
      </div>
    </div>
  );
}

export function Marquee({
  items,
  className,
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  const [paused, setPaused] = React.useState(false);

  return (
    <div className={cn("relative flex items-center gap-2 overflow-hidden", className)}>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex w-max gap-4 animate-[marquee_14s_linear_infinite]"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {[...items, ...items].map((item, i) => (
            <div key={i} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play marquee" : "Pause marquee"}
        className="h-7 w-7 shrink-0"
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}
