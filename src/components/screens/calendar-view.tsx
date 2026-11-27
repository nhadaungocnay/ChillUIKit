import { cn } from "@/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  tone?: "primary" | "success" | "warning" | "destructive";
}

export interface CalendarViewProps {
  monthLabel?: string;
  daysInMonth?: number;
  today?: number;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  className?: string;
}

const eventTones: Record<NonNullable<CalendarEvent["tone"]>, string> = {
  primary: "bg-primary/10 text-foreground border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView({
  monthLabel = "November 2026",
  daysInMonth = 30,
  today = 26,
  events,
  onSelectEvent,
  className,
}: CalendarViewProps) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background", className)}>
      <div className="border-b border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground">
        {monthLabel}
      </div>
      <div className="grid grid-cols-7 border-b border-border bg-surface/50 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1.5">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-y divide-border">
        {days.map((day) => {
          const dayEvents = events.filter((e) => e.day === day);
          return (
            <div key={day} className="min-h-20 p-1.5 space-y-1">
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px]",
                  day === today
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {day}
              </span>
              <div className="space-y-1">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onSelectEvent?.(ev)}
                    className={cn(
                      "block w-full truncate rounded border px-1.5 py-0.5 text-left text-[10px] font-medium cursor-pointer",
                      eventTones[ev.tone ?? "primary"]
                    )}
                  >
                    {ev.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
