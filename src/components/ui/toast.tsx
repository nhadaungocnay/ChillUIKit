import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "warning" | "destructive";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

type Listener = (toasts: ToastItem[]) => void;

let memoryToasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener([...memoryToasts]);
  }
}

export function toast(options: ToastOptions) {
  const id = Math.random().toString(36).slice(2, 9);
  const item: ToastItem = { duration: 4000, variant: "default", ...options, id };
  memoryToasts = [...memoryToasts, item];
  emit();

  if (item.duration && item.duration > 0) {
    setTimeout(() => dismissToast(id), item.duration);
  }
  return id;
}

export function dismissToast(id: string) {
  memoryToasts = memoryToasts.filter((t) => t.id !== id);
  emit();
}

const variantClasses: Record<ToastVariant, string> = {
  default: "border-border bg-background text-foreground",
  success: "border-success/40 bg-background text-foreground",
  warning: "border-warning/40 bg-background text-foreground",
  destructive: "border-destructive/40 bg-background text-destructive",
};

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>(memoryToasts);

  React.useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border p-3.5 shadow-lg transition-all",
            variantClasses[item.variant ?? "default"]
          )}
        >
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground">{item.description}</p>
            )}
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick();
                  dismissToast(item.id);
                }}
                className="mt-1.5 text-xs font-medium underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                {item.action.label}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(item.id)}
            aria-label="Dismiss"
            className="rounded-sm opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
