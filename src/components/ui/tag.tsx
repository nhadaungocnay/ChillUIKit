import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function Tag({ label, selected, onClick, onRemove, className }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        onClick && "cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground hover:bg-muted",
        className
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          className="rounded-full opacity-70 hover:opacity-100 cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export function TagGroup({
  tags,
  selected = [],
  onToggle,
}: {
  tags: string[];
  selected?: string[];
  onToggle?: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <Tag
          key={t}
          label={t}
          selected={selected.includes(t)}
          onClick={onToggle ? () => onToggle(t) : undefined}
        />
      ))}
    </div>
  );
}
