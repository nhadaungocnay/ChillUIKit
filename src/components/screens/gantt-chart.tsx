import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

export interface GanttTask {
  id: string;
  title: string;
  startDay: number;
  durationDays: number;
  progress?: number;
  assignee?: string;
  tone?: "primary" | "success" | "warning";
}

export interface GanttChartProps {
  tasks: GanttTask[];
  totalDays?: number;
  todayDay?: number;
  className?: string;
}

const barTones: Record<NonNullable<GanttTask["tone"]>, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-white",
  warning: "bg-warning text-foreground",
};

export function GanttChart({
  tasks,
  totalDays = 14,
  todayDay = 5,
  className,
}: GanttChartProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border bg-background", className)}>
      <div className="min-w-[640px]">
        {/* Header */}
        <div className="grid grid-cols-[200px_1fr] border-b border-border bg-surface text-xs font-medium text-muted-foreground">
          <div className="border-r border-border px-3 py-2">Task</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
            {days.map((d) => (
              <div
                key={d}
                className={cn(
                  "border-r border-border/50 py-2 text-center font-mono text-[10px]",
                  d === todayDay && "bg-ring/10 font-semibold text-ring"
                )}
              >
                D{d}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const leftPct = ((task.startDay - 1) / totalDays) * 100;
            const widthPct = (task.durationDays / totalDays) * 100;
            return (
              <div key={task.id} className="grid grid-cols-[200px_1fr] items-center text-xs">
                <div className="flex items-center justify-between gap-2 border-r border-border px-3 py-2.5">
                  <span className="truncate font-medium text-foreground">{task.title}</span>
                  {task.assignee && <Avatar fallback={task.assignee} size="sm" />}
                </div>
                <div className="relative h-9 bg-background">
                  <div
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    title={`${task.title} (${task.durationDays}d)`}
                    className={cn(
                      "absolute top-1.5 flex h-6 items-center overflow-hidden rounded-sm px-2 text-[10px] font-medium shadow-xs",
                      barTones[task.tone ?? "primary"]
                    )}
                  >
                    <span className="truncate">{task.progress !== undefined ? `${task.progress}%` : task.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
