import { Check, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PasswordStrengthProps {
  password: string;
  onGenerate?: (pwd: string) => void;
  className?: string;
}

export function PasswordStrength({ password, onGenerate, className }: PasswordStrengthProps) {
  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    { label: "Contains symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = rules.filter((r) => r.met).length;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let out = "";
    for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
    onGenerate?.(out);
  };

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Strength: {labels[score]}</span>
        {onGenerate && (
          <Button type="button" variant="ghost" size="sm" onClick={generate} className="h-6 gap-1 px-2 text-xs">
            <RefreshCw className="h-3 w-3" /> Generate
          </Button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-colors",
              score >= idx
                ? score <= 1
                  ? "bg-destructive"
                  : score <= 2
                  ? "bg-warning"
                  : "bg-success"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {rules.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {r.met ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/60" />
            )}
            <span className={r.met ? "text-foreground" : ""}>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
