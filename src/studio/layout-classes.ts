import type * as React from "react";
import { cn } from "@/lib/utils";
import type { LayoutStyle } from "@/studio/types";

const GAP_MAP: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

const PAD_MAP: Record<number, string> = {
  0: "p-0",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  6: "p-6",
  8: "p-8",
};

const GRID_COLS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const GRID_RATIO_MAP: Record<string, string> = {
  "2:1": "grid-cols-1 lg:grid-cols-[2fr_1fr]",
  "1:2": "grid-cols-1 lg:grid-cols-[1fr_2fr]",
  "3:1": "grid-cols-1 lg:grid-cols-[3fr_1fr]",
};

const ALIGN_MAP: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const JUSTIFY_MAP: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const SURFACE_MAP: Record<string, string> = {
  transparent: "bg-transparent",
  background: "bg-background",
  surface: "bg-surface",
  muted: "bg-muted/60",
  primary: "bg-primary text-primary-foreground",
};

const BORDER_MAP: Record<string, string> = {
  none: "",
  all: "border border-border",
  b: "border-b border-border",
  r: "border-r border-border",
  t: "border-t border-border",
};

const RADIUS_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const SHADOW_MAP: Record<string, string> = {
  none: "",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
};

export function layoutToClassName(
  layout?: Partial<LayoutStyle>,
  isContainer = false
): string {
  const display = layout?.display ?? "flex";
  const direction = layout?.direction ?? "col";
  const align = layout?.align ?? (isContainer ? "stretch" : "start");
  const justify = layout?.justify ?? "start";
  const gap = layout?.gap ?? (isContainer ? 3 : 0);
  const padding = layout?.padding ?? 0;
  const width = layout?.width ?? (isContainer ? "fill" : "hug");
  const height = layout?.height ?? "hug";
  const surface = layout?.surface ?? "transparent";
  const border = layout?.border ?? "none";
  const radius = layout?.radius ?? "none";
  const shadow = layout?.shadow ?? "none";

  const layoutClasses = isContainer
    ? display === "grid"
      ? cn(
          "grid",
          layout?.gridRatio && layout.gridRatio !== "equal"
            ? GRID_RATIO_MAP[layout.gridRatio]
            : GRID_COLS_MAP[layout?.gridCols ?? 3]
        )
      : cn(
          "flex",
          direction === "row" ? "flex-row" : "flex-col",
          layout?.wrap && "flex-wrap",
          ALIGN_MAP[align],
          JUSTIFY_MAP[justify]
        )
    : "";

  const widthClass =
    width === "fill"
      ? "w-full min-w-0 flex-1"
      : width === "hug"
      ? "w-fit max-w-full"
      : "shrink-0";

  const heightClass =
    height === "fill" ? "h-full min-h-0 flex-1" : height === "hug" ? "h-fit" : "shrink-0";

  return cn(
    layoutClasses,
    isContainer && GAP_MAP[gap],
    PAD_MAP[padding],
    widthClass,
    heightClass,
    SURFACE_MAP[surface],
    BORDER_MAP[border],
    RADIUS_MAP[radius],
    SHADOW_MAP[shadow]
  );
}

export function layoutToInlineStyle(
  layout?: Partial<LayoutStyle>
): React.CSSProperties | undefined {
  if (!layout) return undefined;
  const style: React.CSSProperties = {};
  if (layout.width === "fixed" && layout.fixedWidth) {
    style.width = `${layout.fixedWidth}px`;
  }
  if (layout.height === "fixed" && layout.fixedHeight) {
    style.height = `${layout.fixedHeight}px`;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}
