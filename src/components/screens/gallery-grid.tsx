import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
  accentClass?: string;
}

export function GalleryGrid({
  items,
  onSelect,
  className,
}: {
  items: GalleryItem[];
  onSelect?: (item: GalleryItem) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => onSelect?.(item)}
          className={cn(
            "overflow-hidden transition-all",
            onSelect && "cursor-pointer hover:border-primary/50 hover:shadow-sm"
          )}
        >
          <div className={cn("h-24 w-full border-b border-border bg-muted/60", item.accentClass)} />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm truncate">{item.title}</CardTitle>
              {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
            </div>
          </CardHeader>
          {(item.subtitle || item.meta) && (
            <CardContent className="space-y-1">
              {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
              {item.meta && <p className="font-mono text-[11px] text-muted-foreground">{item.meta}</p>}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
