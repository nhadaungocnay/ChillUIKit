import * as React from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  models?: string[];
  model?: string;
  onModelChange?: (model: string) => void;
  onAttach?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything or type / for commands...",
  models,
  model,
  onModelChange,
  onAttach,
  disabled = false,
  className,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-3 focus-within:ring-2 focus-within:ring-ring",
        className
      )}
    >
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
        <div className="flex items-center gap-2">
          {onAttach && (
            <Button type="button" variant="ghost" size="icon" onClick={onAttach} className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
          )}
          {models && models.length > 0 && (
            <Select value={model} onValueChange={onModelChange}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          disabled={!value.trim() || disabled}
          onClick={onSubmit}
          className="h-8 gap-1.5"
        >
          <span>Send</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
