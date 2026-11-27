import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface SettingsSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface SettingsLayoutProps {
  sections: SettingsSection[];
  dirty?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  onDeleteWorkspace?: () => void;
  className?: string;
}

export function SettingsLayout({
  sections,
  dirty = false,
  onSave,
  onReset,
  onDeleteWorkspace,
  className,
}: SettingsLayoutProps) {
  const [active, setActive] = React.useState(sections[0]?.id ?? "");
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors cursor-pointer shrink-0",
                s.id === active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {current && (
            <Card>
              <CardHeader>
                <CardTitle>{current.label}</CardTitle>
              </CardHeader>
              <CardContent>{current.content}</CardContent>
            </Card>
          )}

          {onDeleteWorkspace && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for this workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={onDeleteWorkspace}>
                  Delete Workspace
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {dirty && onSave && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm">
          <span className="text-xs text-muted-foreground">You have unsaved changes.</span>
          <div className="flex gap-2">
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
            )}
            <Button size="sm" onClick={onSave}>
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
