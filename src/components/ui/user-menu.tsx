import { LogOut, Moon, Settings, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserMenuProps {
  name: string;
  email: string;
  plan?: string;
  onToggleTheme?: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
}

export function UserMenu({
  name,
  email,
  plan = "Pro",
  onToggleTheme,
  onSettings,
  onSignOut,
}: UserMenuProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
          <Avatar fallback={initials} status="online" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Badge variant="secondary">{plan}</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings}>
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        {onToggleTheme && (
          <DropdownMenuItem onClick={onToggleTheme}>
            <Moon className="h-4 w-4" /> Toggle theme
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-destructive">
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
