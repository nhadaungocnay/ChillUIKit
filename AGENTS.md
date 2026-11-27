# ChillUIKit — AI & Vibecoding Guidelines

> Any AI agent or developer building an app with **ChillUIKit** MUST follow these rules to keep all apps visually and structurally consistent.

## 1. Core Rules
1. **Never hardcode hex/rgb colors** in components. Always use semantic Tailwind tokens (`bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`, etc.) defined in `src/styles/tokens.css`.
2. **Always use the App Frame** (`AppShell`, `PageContainer`, `PageHeader`) from `@/components/layout` for application pages.
3. **Use `cn()`** from `@/lib/utils` when merging conditional Tailwind classes.
4. **4px Spacing Grid**: Prefer Tailwind spacing multiples (`p-4`, `gap-3`, `space-y-6`).
5. **Component Discovery**: Check `registry.json` for the full list of `tokens`, `layout`, `ui`, `ai`, and `screens` modules.
6. **Theme Presets**: Set `data-theme="indigo" | "emerald" | "rose" | "amber"` on `<html>` (or omit for `neutral`).
7. **CLI**: Use `chilluikit init` and `chilluikit add <module...>` to copy modules into new apps.

## 2. Available Imports

### Layout & App Frame (`@/components/layout`)
- `AppShell`, `AppShellNavItem`, `useAppShellCollapsed`, `PageContainer`, `PageHeader`, `AuthLayout`, `CommandPalette`
- `DetailLayout` (`ratio="2:1" | "1:2" | "3:1"`), `WorkspaceLayout`, `ListLayout`
- `EmptyState`, `LoadingSkeleton`, `ErrorState`, `SplitPane`, `BottomNav`, `BottomNavItem`, `FilterBar`, `NavTree`, `FormSheet`, `SectionGrid`, `Statusbar`, `SmartButton`, `SmartButtonGroup`

### Core, Data Viz & Effects (`@/components/ui`)
- **Actions & Overlays:** `ActionButton`, `Button`, `HoldButton`, `SegmentedControl`, `ToggleGroup`, `ContextMenu`, `Dialog`, `Drawer`, `AlertDialog`, `Popover`, `DropdownMenu`, `HoverCard`, `UserMenu`, `FloatingDock`, `Tooltip`
- **Forms:** `FormField`, `Label`, `Input`, `PasswordInput`, `PasswordStrength`, `OTPInput`, `Textarea`, `Select`, `Combobox`, `MultiSelect`, `IconPicker`, `ChillIcon`, `DatePicker`, `DateRangePicker`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `FileUpload`
- **Data Display & Effects:** `Avatar`, `Badge`, `CommentThread`, `Tag`, `TagGroup`, `Kbd`, `Separator`, `Spinner`, `StatusDot`, `PriorityBars`, `Chart`, `UptimeBar`, `Heatmap`, `DataTable`, `StatCard`, `Progress`, `UsageMeter`, `Accordion`, `Stepper`, `Timeline`, `CodeBlock`, `Alert`, `Toaster`, `toast`, `TokenStream`, `ShimmerText`, `NumberTicker`, `ShineBorder`, `Marquee`
- **Enterprise & Collaboration:** `AuditLog`, `DataComparison`, `CurrencyInput`, `EditableLineItemsTable`, `AttachmentManager`, `ExcelToolbar`, `ImportReviewModal`, `WatcherWidget`, `CollapsibleCard`, `LanguageSwitcher`, `QueryBuilder`, `DynamicFilter`, `ApprovalChain`, `PermissionMatrix`, `BulkActionBar`, `PrintSheet`, `MentionInput`, `AnimatedCollapse`

### AI & Agentic Blocks (`@/components/ai`)
- `PromptInput`, `ApprovalCard`, `ExecutionSteps`, `ToolCallBadge`, `ContextWindow`, `ToolCallCard`, `ThinkingState`, `MessageActions`, `InlineDiff`

### SaaS & App Screens (`@/components/screens`)
- `SettingsLayout`, `NotificationCenter`, `OnboardingChecklist`, `ErrorPage`, `ChangelogFeed`, `KanbanBoard`, `GroupedList`, `GanttChart`, `CalendarView`, `TreeTable`, `GalleryGrid`, `DataGridView`, `DetailView`, `ThemeCustomizer`

### Node Flow (`@/components/flow`, powered by `@xyflow/react`)
- `FlowCanvas`, `FlowNode`, `StatusNode`, `FlowInspector`

## 3. Page Layout Decision Tree
- **Dashboard / Role Workspace / Report**: Use `WorkspaceLayout` (`header`, `tabs`, `kpis`, `content`).
- **List / Inbox / Table View**: Use `ListLayout` (`header`, `toolbar`, `filters`, `table`).
- **Record Detail / Create Form**: Use `DetailLayout` with `ratio="2:1"` (`header`, `main` 2/3, `aside` 1/3 sticky).

## 4. Key Prop Conventions & MCP Workflow
- `DataTable` columns use `render: (row) => ...` (not `cell`).
- `UsageMeter` uses `used` and `limit` (not `value`/`max`).
- `PropertyList` uses `rows={[{ label, value }]}` (not `items`).
- Display full date-time strings (`DD/MM/YYYY HH:mm`) for comments and audit logs.
- **MCP Workflow**: `search_components(query)` → `get_component_source(name)` → `get_template("templates")` → `install_components(targetDir, init, names)`.
