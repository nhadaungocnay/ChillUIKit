import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function formatOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const presets = [
    { label: "Today", value: formatOffset(0) },
    { label: "7 days ago", value: formatOffset(-7) },
    { label: "30 days ago", value: formatOffset(-30) },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-52 justify-start gap-2 font-normal", className)}
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{value || placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3 p-3" align="start">
        <Input
          type="date"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                onChange?.(p.value);
                setOpen(false);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
