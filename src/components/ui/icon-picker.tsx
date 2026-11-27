import * as React from "react";
import {
  AlertTriangle,
  Archive,
  Award,
  Banknote,
  BarChart3,
  Bell,
  Blocks,
  Bookmark,
  Bot,
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Compass,
  Copy,
  Cpu,
  CreditCard,
  Crown,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Flag,
  Folder,
  GitBranch,
  Globe,
  Heart,
  HelpCircle,
  History,
  Home,
  Inbox,
  Info,
  Kanban,
  Key,
  Landmark,
  Layers,
  LayoutDashboard,
  Link,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Paperclip,
  Pencil,
  Percent,
  Phone,
  PieChart,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Table2,
  Tag,
  Terminal,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  Workflow,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ICON_REGISTRY = {
  // General & Navigation
  home: Home,
  dashboard: LayoutDashboard,
  compass: Compass,
  search: Search,
  settings: Settings,
  sliders: SlidersHorizontal,
  filter: Filter,
  bell: Bell,
  mail: Mail,
  inbox: Inbox,
  send: Send,
  message: MessageSquare,
  phone: Phone,
  calendar: Calendar,
  clock: Clock,
  history: History,
  refresh: RefreshCw,
  globe: Globe,
  mapPin: MapPin,
  bookmark: Bookmark,
  tag: Tag,
  flag: Flag,
  star: Star,
  heart: Heart,
  help: HelpCircle,
  // Finance & ERP
  wallet: Wallet,
  creditCard: CreditCard,
  receipt: Receipt,
  banknote: Banknote,
  landmark: Landmark,
  calculator: Calculator,
  percent: Percent,
  trendingUp: TrendingUp,
  chart: BarChart3,
  pieChart: PieChart,
  briefcase: Briefcase,
  building: Building2,
  cart: ShoppingCart,
  package: Package,
  truck: Truck,
  // Files & Actions
  folder: Folder,
  file: FileText,
  spreadsheet: FileSpreadsheet,
  paperclip: Paperclip,
  printer: Printer,
  archive: Archive,
  plus: Plus,
  edit: Pencil,
  copy: Copy,
  trash: Trash2,
  download: Download,
  upload: Upload,
  link: Link,
  listChecks: ListChecks,
  table: Table2,
  kanban: Kanban,
  // Users & Security
  user: User,
  users: Users,
  userCheck: UserCheck,
  userPlus: UserPlus,
  crown: Crown,
  award: Award,
  lock: Lock,
  key: Key,
  shield: Shield,
  eye: Eye,
  // Status
  check: Check,
  checkCircle: CheckCircle2,
  alertTriangle: AlertTriangle,
  xCircle: XCircle,
  info: Info,
  // AI & Dev
  bot: Bot,
  sparkles: Sparkles,
  zap: Zap,
  terminal: Terminal,
  code: Code2,
  database: Database,
  server: Server,
  cloud: Cloud,
  cpu: Cpu,
  gitBranch: GitBranch,
  layers: Layers,
  blocks: Blocks,
  workflow: Workflow,
} as const;

export type ChillIconName = keyof typeof ICON_REGISTRY;

const ICON_CATEGORIES: Record<string, ChillIconName[]> = {
  all: Object.keys(ICON_REGISTRY) as ChillIconName[],
  finance: ["wallet", "creditCard", "receipt", "banknote", "landmark", "calculator", "percent", "trendingUp", "chart", "pieChart", "briefcase", "building", "cart", "package", "truck"],
  files: ["folder", "file", "spreadsheet", "paperclip", "printer", "archive", "plus", "edit", "copy", "trash", "download", "upload", "link", "listChecks", "table", "kanban"],
  users: ["user", "users", "userCheck", "userPlus", "crown", "award", "lock", "key", "shield", "eye"],
  status: ["check", "checkCircle", "alertTriangle", "xCircle", "info"],
  dev: ["bot", "sparkles", "zap", "terminal", "code", "database", "server", "cloud", "cpu", "gitBranch", "layers", "blocks", "workflow"],
};

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
  const [category, setCategory] = React.useState<string>("all");

  const baseList = ICON_CATEGORIES[category] ?? ICON_CATEGORIES.all;
  const entries = baseList.filter((k) => k.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("justify-start gap-2 font-normal", className)}
        >
          <ChillIcon name={value} className="text-foreground" />
          <span className="truncate text-sm">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-2.5">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 84 icons..."
            className="h-8 text-xs"
          />
          <div className="flex flex-wrap gap-1">
            {Object.keys(ICON_CATEGORIES).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded px-2 py-0.5 text-[11px] font-medium capitalize transition-colors cursor-pointer",
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto pr-1">
            {entries.map((name) => {
              const Icon = ICON_REGISTRY[name];
              const selected = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border transition-colors cursor-pointer",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-transparent hover:bg-muted text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          {entries.length === 0 && (
            <p className="py-3 text-center text-xs text-muted-foreground">No icons found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
