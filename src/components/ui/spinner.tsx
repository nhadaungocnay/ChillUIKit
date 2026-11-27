import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  default: "h-5 w-5",
  lg: "h-7 w-7",
};

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <Loader2
      aria-label="Loading"
      className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)}
    />
  );
}
