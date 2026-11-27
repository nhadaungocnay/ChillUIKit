export type StudioBlockType =
  // Containers (Open Auto-Layout)
  | "frame"
  | "container-row"
  | "container-col"
  | "card-frame"
  | "header-bar"
  | "sidebar"
  | "section-grid"
  | "form-sheet"
  // Primitives & Nav
  | "text"
  | "badge"
  | "button"
  | "statusbar"
  | "page-header"
  | "filter-bar"
  | "breadcrumb"
  | "smart-button"
  | "detail-view"
  // Forms & Inputs
  | "input"
  | "textarea"
  | "select"
  | "multi-select"
  | "date-picker"
  | "checkbox"
  | "switch"
  | "file-upload"
  | "markdown"
  // Data & Charts
  | "stat-card"
  | "chart"
  | "usage-meter"
  | "uptime-bar"
  | "property-list"
  | "timeline"
  | "stepper"
  | "alert"
  | "code-block"
  | "comment-thread"
  | "audit-log"
  | "data-comparison"
  | "watcher-widget"
  | "collapsible-card"
  | "language-switcher"
  | "currency-input"
  | "editable-line-items"
  | "attachment-manager"
  | "excel-toolbar"
  | "query-builder"
  | "dynamic-filter"
  // Views & Boards
  | "data-table"
  | "data-grid"
  | "kanban"
  | "gantt"
  | "calendar"
  | "tree-table"
  | "gallery-grid"
  // AI & Agentic
  | "prompt-input"
  | "approval-card"
  | "execution-steps"
  | "context-window";

export type BlockSpan = 1 | 2 | 3;

export type BlockVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

export type LayoutDisplay = "flex" | "grid";
export type LayoutGridRatio = "equal" | "2:1" | "1:2" | "3:1";
export type LayoutDirection = "row" | "col";
export type LayoutAlign = "start" | "center" | "end" | "stretch";
export type LayoutJustify = "start" | "center" | "end" | "between";
export type LayoutSizeMode = "fill" | "hug" | "fixed";
export type LayoutSurface = "transparent" | "background" | "surface" | "muted" | "primary";
export type LayoutBorder = "none" | "all" | "b" | "r" | "t";
export type LayoutRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type LayoutShadow = "none" | "xs" | "sm" | "md";

export interface LayoutStyle {
  display: LayoutDisplay;
  direction: LayoutDirection;
  wrap: boolean;
  gridCols: 1 | 2 | 3 | 4;
  gridRatio?: LayoutGridRatio;
  align: LayoutAlign;
  justify: LayoutJustify;
  gap: 0 | 1 | 2 | 3 | 4 | 6 | 8;
  padding: 0 | 2 | 3 | 4 | 6 | 8;
  width: LayoutSizeMode;
  fixedWidth?: number;
  height: LayoutSizeMode;
  fixedHeight?: number;
  surface: LayoutSurface;
  border: LayoutBorder;
  radius: LayoutRadius;
  shadow: LayoutShadow;
}

export interface StudioBlockProps {
  title: string;
  subtitle?: string;
  badge?: string;
  buttonLabel?: string;
  value?: string;
  placeholder?: string;
  variant?: BlockVariant;
  columns?: 1 | 2 | 3;
  /** Newline-separated items (fields, options, columns, stages, or Key: Value pairs). */
  itemsText?: string;
}

export interface StudioBlock {
  id: string;
  type: StudioBlockType;
  span?: BlockSpan;
  layout?: Partial<LayoutStyle>;
  props: StudioBlockProps;
  children?: StudioBlock[];
  hidden?: boolean;
}

export function isContainerType(type: StudioBlockType): boolean {
  return (
    type === "frame" ||
    type === "container-row" ||
    type === "container-col" ||
    type === "card-frame" ||
    type === "header-bar" ||
    type === "sidebar" ||
    type === "section-grid" ||
    type === "form-sheet" ||
    type === "statusbar" ||
    type === "page-header"
  );
}

export type StarterTemplateId = "blank" | "app-shell" | "dashboard" | "detail-2-1" | "settings" | "auth";
export type DropPosition = "before" | "after" | "inside";

export interface StudioPage {
  id: string;
  name: string;
  blocks: StudioBlock[];
}

export interface StudioProject {
  id: string;
  name: string;
  pages: StudioPage[];
}
