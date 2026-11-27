import * as React from "react";
import { Bold, Code, Italic, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write description in Markdown...",
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const insert = (prefix: string, suffix = "") => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "text";
    const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    onChange(next);
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background", className)}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-2.5 py-1.5">
        <div className="flex items-center gap-0.5">
          <Button type="button" variant="ghost" size="icon" onClick={() => insert("**", "**")} aria-label="Bold" className="h-7 w-7">
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => insert("_", "_")} aria-label="Italic" className="h-7 w-7">
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => insert("`", "`")} aria-label="Code" className="h-7 w-7">
            <Code className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => insert("\n- ")} aria-label="List" className="h-7 w-7">
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "rounded-sm px-2 py-0.5 font-medium cursor-pointer",
              tab === "write" ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-sm px-2 py-0.5 font-medium cursor-pointer",
              tab === "preview" ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={ref}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      ) : (
        <div className="min-h-32 space-y-1.5 p-3 text-sm text-foreground">
          {value.trim() ? (
            value.split("\n").map((line, i) => (
              <p key={i} className={line.startsWith("- ") ? "pl-3 text-muted-foreground" : ""}>
                {line || "\u00A0"}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground">Nothing to preview.</p>
          )}
        </div>
      )}
    </div>
  );
}
