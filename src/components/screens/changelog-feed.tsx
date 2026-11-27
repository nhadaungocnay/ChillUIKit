import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ChangelogEntry {
  version: string;
  date: string;
  type: "New" | "Improved" | "Fixed";
  title: string;
  description: string;
}

export function ChangelogFeed({
  entries,
  className,
}: {
  entries: ChangelogEntry[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {entries.map((entry) => (
        <div key={entry.version + entry.title} className="rounded-lg border border-border bg-surface p-4 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={entry.type === "New" ? "success" : entry.type === "Improved" ? "secondary" : "outline"}>
              {entry.type}
            </Badge>
            <span className="font-mono text-xs font-medium text-foreground">{entry.version}</span>
            <span className="text-xs text-muted-foreground">· {entry.date}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">{entry.title}</h4>
          <p className="text-xs text-muted-foreground">{entry.description}</p>
        </div>
      ))}
    </div>
  );
}
