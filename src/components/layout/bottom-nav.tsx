import * as React from "react";
import { cn } from "@/lib/utils";

export interface BottomNavProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomNav({ children, className }: BottomNavProps) {
  return (
    <nav
      aria-label="Mobile Navigation"
      className={cn(
        "flex items-center justify-around border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur",
        className
      )}
    >
      {children}
    </nav>
  );
}

export interface BottomNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export function BottomNavItem({
  icon,
  label,
  active = false,
  className,
  ...props
}: BottomNavItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <span className="[&_svg]:size-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
