import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  currency?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function formatNumber(val: number | null): string {
  if (val === null || Number.isNaN(val)) return "";
  return val.toLocaleString("en-US");
}

export function CurrencyInput({
  value,
  onChange,
  currency = "₫",
  placeholder = "0",
  className,
  disabled,
}: CurrencyInputProps) {
  const [text, setText] = React.useState(() => formatNumber(value));

  React.useEffect(() => {
    setText(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setText("");
      onChange(null);
      return;
    }
    const num = Number(raw);
    setText(formatNumber(num));
    onChange(num);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Input
        type="text"
        inputMode="numeric"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-12 text-right font-mono tabular-nums"
      />
      <span className="pointer-events-none absolute right-3 text-xs font-medium text-muted-foreground">
        {currency}
      </span>
    </div>
  );
}
