import { Bell, BellOff, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface WatcherItem {
  id: string;
  name: string;
  role?: string;
}

export interface WatcherWidgetProps {
  watchers: WatcherItem[];
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onAddWatcher?: () => void;
  className?: string;
}

export function WatcherWidget({
  watchers,
  isFollowing = false,
  onToggleFollow,
  onAddWatcher,
  className,
}: WatcherWidgetProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {watchers.slice(0, 4).map((w) => (
            <div
              key={w.id}
              title={w.role ? `${w.name} (${w.role})` : w.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-muted text-[10px] font-semibold text-foreground"
            >
              {w.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {watchers.length} {watchers.length === 1 ? "watcher" : "watchers"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {onAddWatcher && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddWatcher} title="Add watcher">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
        {onToggleFollow && (
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={onToggleFollow}
          >
            {isFollowing ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    </div>
  );
}
