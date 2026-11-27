import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleOption {
  value: string;
  label: React.ReactNode;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  multiple = false,
  className,
}: ToggleGroupProps) {
  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const toggle = (v: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  return (
    <div
      role="group"
      className={cn("inline-flex rounded-md border border-border bg-background p-0.5 gap-0.5", className)}
    >
      {options.map((opt) => {
        const active = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
