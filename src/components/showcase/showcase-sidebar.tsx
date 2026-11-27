import * as React from "react";
import {
  BookOpen,
  Boxes,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppShellCollapsed } from "@/components/layout/app-shell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ComponentTier = "P0" | "P1" | "P2" | "AI";

export interface CatalogItem {
  id: string;
  name: string;
  group: string;
  tier: ComponentTier;
  isNew?: boolean;
}

export interface ShowcaseSidebarProps {
  items: CatalogItem[];
  activeGroup: string;
  activeItemId?: string | null;
  onSelectOverview: () => void;
  onSelectTokens: () => void;
  onSelectGroup: (group: string) => void;
  onSelectItem: (item: CatalogItem) => void;
  onOpenSearch: () => void;
}

const GROUP_ORDER = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data Display",
  "Effects",
  "Layouts",
  "Enterprise",
  "Templates",
  "AI & Agentic",
  "Screens",
];

export function ShowcaseSidebar({
  items,
  activeGroup,
  activeItemId,
  onSelectOverview,
  onSelectTokens,
  onSelectGroup,
  onSelectItem,
  onOpenSearch,
}: ShowcaseSidebarProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [componentsOpen, setComponentsOpen] = React.useState(true);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
  const collapsed = useAppShellCollapsed();

  React.useEffect(() => {
    if (activeItemId && GROUP_ORDER.includes(activeGroup)) {
      setOpenGroups((prev) => (prev[activeGroup] ? prev : { ...prev, [activeGroup]: true }));
    }
  }, [activeGroup, activeItemId]);

  const grouped = React.useMemo(() => {
    const map: Record<string, CatalogItem[]> = {};
    for (const g of GROUP_ORDER) map[g] = [];
    for (const item of items) {
      if (!map[item.group]) map[item.group] = [];
      map[item.group].push(item);
    }
    return map;
  }, [items]);

  const visibleGroups = selectedGroup === "all" ? GROUP_ORDER : [selectedGroup];

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    onSelectGroup(group);
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        <button
          type="button"
          title="Search (⌘K)"
          onClick={onOpenSearch}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Documentation"
          onClick={onSelectOverview}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "overview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <BookOpen className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Design Tokens"
          onClick={onSelectTokens}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Components"
          onClick={() => onSelectGroup("Actions")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup !== "overview" && activeGroup !== "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Boxes className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Search Trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
        </span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘ K
        </kbd>
      </button>

      {/* Group Filter Dropdown */}
      <Select
        value={selectedGroup}
        onValueChange={(val) => {
          setSelectedGroup(val);
          if (val !== "all") {
            setOpenGroups((prev) => ({ ...prev, [val]: true }));
            onSelectGroup(val);
          }
        }}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="All groups" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All groups ({items.length})</SelectItem>
          {GROUP_ORDER.map((g) => (
            <SelectItem key={g} value={g}>
              {g} ({grouped[g]?.length ?? 0})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Scrollable Tree */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {/* Docs */}
        <button
          type="button"
          onClick={onSelectOverview}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            activeGroup === "overview"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Docs</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </button>

        {/* Tokens */}
        <button
          type="button"
          onClick={onSelectTokens}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            activeGroup === "tokens"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Design Tokens</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </button>

        {/* Components Root */}
        <div>
          <button
            type="button"
            onClick={() => setComponentsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-foreground hover:bg-muted/60 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Boxes className="h-4 w-4" />
              <span>Components</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {items.length}
              </span>
              {componentsOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </span>
          </button>

          {componentsOpen && (
            <div className="mt-1 space-y-0.5 pl-2">
              {visibleGroups.map((group) => {
                const list = grouped[group] ?? [];
                if (list.length === 0) return null;
                const isOpen = !!openGroups[group];
                const isGroupActive = activeGroup === group;

                if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        <button
          type="button"
          title="Search (⌘K)"
          onClick={onOpenSearch}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Documentation"
          onClick={onSelectOverview}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "overview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <BookOpen className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Design Tokens"
          onClick={onSelectTokens}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Components"
          onClick={() => onSelectGroup("Actions")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup !== "overview" && activeGroup !== "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Boxes className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
                  <div key={group}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                        isGroupActive && !activeItemId
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {isOpen ? (
                          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                        )}
                        <span>{group}</span>
                      </span>
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {list.length}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="ml-3.5 mt-0.5 space-y-0.5 border-l border-border pl-2.5">
                        {list.map((item) => {
                          const selected = activeItemId === item.id;
                          if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        <button
          type="button"
          title="Search (⌘K)"
          onClick={onOpenSearch}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Documentation"
          onClick={onSelectOverview}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "overview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <BookOpen className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Design Tokens"
          onClick={onSelectTokens}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup === "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Components"
          onClick={() => onSelectGroup("Actions")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md transition-colors cursor-pointer",
            activeGroup !== "overview" && activeGroup !== "tokens"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Boxes className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => onSelectItem(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors cursor-pointer",
                                selected
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                              )}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span className="truncate">{item.name}</span>
                                {item.isNew && (
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                                    title="New"
                                  />
                                )}
                              </span>
                              {item.tier === "AI" && (
                                <Sparkles className="h-3 w-3 shrink-0 text-ring" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom What's New Pill */}
      <button
        type="button"
        onClick={onSelectOverview}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span>What&apos;s new</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span>{items.length} ready</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  );
}
