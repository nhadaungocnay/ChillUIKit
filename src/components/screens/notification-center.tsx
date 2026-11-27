import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread?: boolean;
}

export interface NotificationCenterProps {
  items: NotificationItem[];
  onMarkAllRead?: () => void;
}

export function NotificationCenter({ items, onMarkAllRead }: NotificationCenterProps) {
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <span className="text-xs font-semibold">Notifications</span>
          {onMarkAllRead && (
            <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="h-6 gap-1 px-2 text-xs">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-64 divide-y divide-border overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className={cn("flex items-start gap-2.5 px-3 py-2.5 text-xs", item.unread && "bg-muted/40")}>
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", item.unread ? "bg-primary" : "bg-transparent")} />
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
