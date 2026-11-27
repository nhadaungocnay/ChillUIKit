import * as React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AppShellContext = React.createContext<{ collapsed: boolean }>({
  collapsed: false,
});

export function useAppShellCollapsed() {
  return React.useContext(AppShellContext).collapsed;
}

export interface AppShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  brand?: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export function AppShell({
  sidebar,
  header,
  brand,
  children,
  defaultCollapsed = false,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <AppShellContext.Provider value={{ collapsed }}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Desktop Sidebar */}
        {sidebar && (
          <aside
            aria-label="Sidebar Navigation"
            className={cn(
              "hidden md:flex flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out overflow-hidden shrink-0",
              collapsed ? "w-16" : "w-60"
            )}
          >
            <div className="flex h-13 items-center justify-between border-b border-border px-3">
              <div
                className={cn(
                  "truncate font-semibold tracking-tight transition-all duration-200",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {brand}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="ml-auto h-8 w-8 shrink-0"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">{sidebar}</div>
          </aside>
        )}

      {/* Mobile Drawer */}
      {sidebar && mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 flex w-64 flex-col border-r border-border bg-surface">
            <div className="flex h-13 items-center justify-between border-b border-border px-4">
              <div className="font-semibold tracking-tight">{brand}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0">
        {(header || sidebar) && (
          <header className="sticky top-0 z-30 flex h-13 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
            {sidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="md:hidden h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
              {header}
            </div>
          </header>
        )}
        <main className={cn("flex-1 overflow-y-auto", className)}>{children}</main>
      </div>
    </div>
    </AppShellContext.Provider>
  );
}

export interface AppShellNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
}

export function AppShellNavItem({
  icon,
  label,
  active = false,
  badge,
  className,
  ...props
}: AppShellNavItemProps) {
  const collapsed = useAppShellCollapsed();
  return (
    <button
      type="button"
      title={label}
      className={cn(
        "flex w-full items-center rounded-md py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
        collapsed ? "justify-center px-2 gap-0" : "px-2.5 gap-2.5",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&_svg]:size-4">{icon}</span>}
      <span
        className={cn(
          "truncate text-left transition-all duration-200",
          collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
        )}
      >
        {label}
      </span>
      {!collapsed && badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
}
