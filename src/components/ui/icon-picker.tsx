import * as React from "react";
import {
  BarChart3,
  Bell,
  Blocks,
  Bot,
  Calendar,
  Check,
  Clock,
  Code2,
  Copy,
  Database,
  Download,
  FileText,
  Flag,
  Folder,
  Globe,
  Heart,
  Home,
  Kanban,
  Layers,
  Link,
  Lock,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Trash2,
  Upload,
  User,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ICON_REGISTRY = {
  home: Home,
  search: Search,
  settings: Settings,
  user: User,
  users: Users,
  bell: Bell,
  mail: Mail,
  calendar: Calendar,
  clock: Clock,
  folder: Folder,
  file: FileText,
  check: Check,
  plus: Plus,
  trash: Trash2,
  edit: Pencil,
  copy: Copy,
  download: Download,
  upload: Upload,
  link: Link,
  lock: Lock,
  shield: Shield,
  star: Star,
  heart: Heart,
  zap: Zap,
  bot: Bot,
  sparkles: Sparkles,
  terminal: Terminal,
  code: Code2,
  database: Database,
  layers: Layers,
  blocks: Blocks,
  chart: BarChart3,
  kanban: Kanban,
  workflow: Workflow,
  globe: Globe,
  flag: Flag,
} as const;

export type ChillIconName = keyof typeof ICON_REGISTRY;

export function ChillIcon({
  name,
  className,
}: {
  name: ChillIconName;
  className?: string;
}) {
  const Icon = ICON_REGISTRY[name] ?? Blocks;
  return <Icon className={cn("h-4 w-4", className)} />;
}

export interface IconPickerProps {
  value: ChillIconName;
  onChange: (name: ChillIconName) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const names = (Object.keys(ICON_REGISTRY) as ChillIconName[]).filter((n) =>
    n.includes(query.trim().toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-44 justify-start gap-2 font-normal", className)}>
          <ChillIcon name={value} />
          <span className="font-mono text-xs">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2.5 space-y-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icon..."
          className="h-8"
        />
        <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto">
          {names.map((name) => (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => {
                onChange(name);
                setOpen(false);
                setQuery("");
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer",
                value === name
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <ChillIcon name={name} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
