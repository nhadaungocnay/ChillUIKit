import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  Blocks,
  Bold,
  Command,
  Home,
  Italic,
  Layers,
  Moon,
  MoreHorizontal,
  Settings,
  Sun,
  Underline,
} from "lucide-react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
} from "@xyflow/react";
import { FlowCanvas, FlowInspector, type ChillFlowNode, type ChillStatusNode } from "@/components/flow";
import {
  ApprovalCard,
  ContextWindow,
  ExecutionSteps,
  InlineDiff,
  MessageActions,
  PromptInput,
  ThinkingState,
  ToolCallBadge,
  ToolCallCard,
} from "@/components/ai";
import {
  AppShell,
  BottomNav,
  BottomNavItem,
  CommandPalette,
  EmptyState,
  ErrorState,
  FilterBar,
  FormSheet,
  LoadingSkeleton,
  NavTree,
  PageContainer,
  PageHeader,
  SectionGrid,
  SmartButton,
  SmartButtonGroup,
  SplitPane,
  Statusbar,
} from "@/components/layout";
import {
  CalendarView,
  ChangelogFeed,
  DataGridView,
  DetailView,
  ErrorPage,
  GalleryGrid,
  GanttChart,
  GroupedList,
  type GroupedListGroup,
  KanbanBoard,
  type KanbanColumn,
  NotificationCenter,
  OnboardingChecklist,
  SettingsLayout,
  ThemeCustomizer,
  type ThemePresetId,
  TreeTable,
} from "@/components/screens";
import { ComponentPreview } from "@/components/showcase/component-preview";
import {
  type CatalogItem,
  ShowcaseSidebar,
} from "@/components/showcase/showcase-sidebar";
import { CATALOG } from "@/data/catalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActionButton,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chart,
  Checkbox,
  CodeBlock,
  Combobox,
  CommentThread,
  type CommentItem,
  ContextMenu,
  DataTable,
  DatePicker,
  DateRangePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  FileUpload,
  FloatingDock,
  FormField,
  Heatmap,
  HoldButton,
  HoverCard,
  IconPicker,
  type ChillIconName,
  Input,
  Kbd,
  MarkdownEditor,
  Marquee,
  MultiSelect,
  NumberTicker,
  OTPInput,
  Pagination,
  PasswordInput,
  PasswordStrength,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PriorityBars,
  PropertyList,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  ShimmerText,
  ShineBorder,
  Slider,
  Spinner,
  StatCard,
  StatusDot,
  Stepper,
  Switch,
  TagGroup,
  Textarea,
  Timeline,
  TimelineItem,
  Toaster,
  ToggleGroup,
  TokenStream,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UptimeBar,
  UsageMeter,
  UserMenu,
  toast,
} from "@/components/ui";

const ChillStudio = lazy(() => import("@/studio/studio-app"));
const ExpenseDemoApp = lazy(() => import("@/demo/expense-demo-app"));
const EnterpriseShowcase = lazy(() =>
  import("@/components/showcase/enterprise-showcase").then((m) => ({ default: m.EnterpriseShowcase }))
);
const TemplatesShowcase = lazy(() =>
  import("@/components/showcase/templates-showcase").then((m) => ({ default: m.TemplatesShowcase }))
);

const initialFlowNodes: ChillFlowNode[] = [
  {
    id: "n1",
    type: "chillNode",
    position: { x: 20, y: 80 },
    data: { label: "Webhook Trigger", kind: "trigger", description: "POST /api/agent-run", status: "finished" },
  },
  {
    id: "n2",
    type: "chillNode",
    position: { x: 290, y: 40 },
    data: { label: "Planner Agent", kind: "agent", description: "Breaks task into steps", meta: "gemini-2.5-pro", status: "busy" },
  },
  {
    id: "n3",
    type: "chillNode",
    position: { x: 290, y: 180 },
    data: { label: "Kanzo MCP", kind: "tool", description: "kanzo.update_task", status: "idle" },
  },
  {
    id: "n4",
    type: "chillNode",
    position: { x: 560, y: 100 },
    data: { label: "Final Output", kind: "output", description: "Return summary", status: "idle" },
  },
];

const initialFlowEdges: Edge[] = [
  { id: "e1-2", source: "n1", target: "n2", animated: true },
  { id: "e1-3", source: "n1", target: "n3" },
  { id: "e2-4", source: "n2", target: "n4", animated: true },
  { id: "e3-4", source: "n3", target: "n4" },
];

const initialStatusNodes: ChillStatusNode[] = [
  { id: "s1", type: "statusNode", position: { x: 20, y: 110 }, data: { label: "Start", tone: "start" } },
  { id: "s2", type: "statusNode", position: { x: 150, y: 110 }, data: { label: "To Do", tone: "todo" } },
  { id: "s3", type: "statusNode", position: { x: 320, y: 110 }, data: { label: "In Progress", tone: "in-progress" } },
  { id: "s4", type: "statusNode", position: { x: 510, y: 50 }, data: { label: "Code Review", tone: "in-progress" } },
  { id: "s5", type: "statusNode", position: { x: 510, y: 170 }, data: { label: "Done", tone: "done" } },
];

const initialStatusEdges: Edge[] = [
  { id: "se1", source: "s1", target: "s2", type: "smoothstep", label: "Create" },
  { id: "se2", source: "s2", target: "s3", type: "smoothstep", label: "Start work" },
  { id: "se3", source: "s3", target: "s4", type: "smoothstep", label: "Review" },
  { id: "se4", source: "s4", target: "s5", type: "smoothstep", label: "Approve" },
];

const sampleRows = [
  { id: "1", name: "AppShell", category: "Layout", status: "Ready" },
  { id: "2", name: "DataTable", category: "Data Display", status: "Ready" },
  { id: "3", name: "PromptInput", category: "AI Block", status: "Ready" },
  { id: "4", name: "ApprovalCard", category: "AI Block", status: "Ready" },
];

export default function App() {
  const [activeGroup, setActiveGroup] = useState<string>("overview");
  const [studioMode, setStudioMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [activeItem, setActiveItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.querySelector("main")?.scrollTo({ top: 0 });
  }, [activeGroup, activeItem?.id]);
  const [dark, setDark] = useState(false);
  const [brandTheme, setBrandTheme] = useState<ThemePresetId>("neutral");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [combo, setCombo] = useState("react");
  const [multi, setMulti] = useState<string[]>(["react", "tailwind"]);
  const [date, setDate] = useState("");
  const [iconName, setIconName] = useState<ChillIconName>("sparkles");
  const [range, setRange] = useState({ from: "2026-11-01", to: "2026-11-26" });
  const [files, setFiles] = useState<File[]>([]);
  const [sliderVal, setSliderVal] = useState([65]);
  const [segmented, setSegmented] = useState("preview");
  const [toggles, setToggles] = useState<string[]>(["bold"]);
  const [pwd, setPwd] = useState("ChillUI@2026");
  const [otp, setOtp] = useState("123");
  const [navTreeId, setNavTreeId] = useState("button");
  const [selectedTags, setSelectedTags] = useState<string[]>(["React", "Tailwind"]);
  const [tickerVal, setTickerVal] = useState(1240);
  const [filterSearch, setFilterSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("Gemini 2.5 Pro");
  const [flowNodes, , onNodesChange] = useNodesState(initialFlowNodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(initialFlowEdges);
  const onConnect = (params: Connection) => setFlowEdges((eds) => addEdge(params, eds));
  const [statusNodes, , onStatusNodesChange] = useNodesState(initialStatusNodes);
  const [statusEdges, , onStatusEdgesChange] = useEdgesState(initialStatusEdges);
  const [selectedTransition, setSelectedTransition] = useState("Approve");
  const [odooStage, setOdooStage] = useState("confirmed");
  const [gridRows, setGridRows] = useState([
    { id: "r1", key: "CHILL-1", title: "Design Tokens OKLCH", owner: "Dang TB", status: "Done" },
    { id: "r2", key: "CHILL-2", title: "DataGridView inline edit", owner: "AI", status: "Doing" },
    { id: "r3", key: "CHILL-3", title: "DetailView template", owner: "Dang TB", status: "Todo" },
  ]);
  const [markdown, setMarkdown] = useState("## Task Description\n- Implement `KanbanBoard` drag & drop\n- Add `PropertyList` for issue details");
  const [kanbanCols, setKanbanCols] = useState<KanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "k1", key: "CHILL-1", title: "Design tokens OKLCH", priority: "high", assignee: "DT", tag: "Tokens" },
      ],
    },
    {
      id: "doing",
      title: "In Progress",
      cards: [
        { id: "k2", key: "CHILL-2", title: "Build KanbanBoard", priority: "urgent", assignee: "AI", tag: "UI" },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "k3", key: "CHILL-3", title: "Setup AppShell", priority: "medium", assignee: "DT", tag: "Layout" },
      ],
    },
  ]);
  const [backlogGroups, setBacklogGroups] = useState<GroupedListGroup[]>([
    {
      id: "sprint-1",
      title: "Sprint 1",
      items: [
        { id: "g1", key: "CHILL-10", title: "Add CommentThread", status: "finished" as const, priority: "medium" as const, assignee: "DT" },
        { id: "g2", key: "CHILL-11", title: "Add KanbanBoard", status: "busy" as const, priority: "high" as const, assignee: "AI" },
      ],
    },
  ]);
  const [threadResolved, setThreadResolved] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "c1",
      author: "Dang TB",
      avatarFallback: "DT",
      role: "Owner",
      time: "27/11/2026 09:30",
      content: "Hey @agent please review the new FlowNode spacing.",
      reactions: [{ emoji: "👍", count: 2, reacted: true }],
      replies: [
        {
          id: "c2",
          author: "ChillAgent",
          avatarFallback: "AI",
          role: "AI",
          time: "27/11/2026 09:32",
          content: "Checked @dangtb — 4px grid and semantic tokens look clean!",
          reactions: [{ emoji: "🚀", count: 1 }],
        },
      ],
    },
  ]);
  const [onboarding, setOnboarding] = useState([
    { id: "1", label: "Install ChillUIKit tokens", done: true },
    { id: "2", label: "Wrap app in AppShell", done: true },
    { id: "3", label: "Ship first AI block", done: false },
  ]);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const selectGroup = (group: string) => {
    setActiveGroup(group);
    setActiveItem(null);
  };

  const selectItem = (item: CatalogItem) => {
    setActiveGroup(item.group);
    setActiveItem(item);
  };

  const commands = [
    ...CATALOG.map((item) => ({
      id: `item-${item.id}`,
      label: `${item.name} (${item.group})`,
      shortcut: item.tier,
      onSelect: () => selectItem(item),
    })),
    {
      id: "toggle-theme",
      label: dark ? "Switch to Light Mode" : "Switch to Dark Mode",
      shortcut: "T",
      icon: dark ? <Sun /> : <Moon />,
      onSelect: toggleTheme,
    },
  ];

  const previews: Record<string, ReactNode> = {
    button: (
      <ComponentPreview title="Button" description="Primary, secondary, outline, ghost and destructive buttons." badge="P0" code={`<Button>Primary</Button>\n<Button variant="outline">Outline</Button>`}>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </ComponentPreview>
    ),
    "action-button": (
      <ComponentPreview title="Action Button" description="Morphs Idle → Loading → Done Check." badge="P1" code={`<ActionButton onAction={async () => ...} />`}>
        <ActionButton onAction={() => new Promise((r) => setTimeout(r, 900))} />
      </ComponentPreview>
    ),
    "hold-button": (
      <ComponentPreview title="Hold Button" description="Press-and-hold confirmation button for risky actions." badge="P1" code={`<HoldButton label="Hold to delete" onConfirm={() => ...} />`}>
        <HoldButton label="Hold to delete" onConfirm={() => toast({ title: "Action confirmed!", variant: "destructive" })} />
      </ComponentPreview>
    ),
    "segmented-control": (
      <ComponentPreview title="Segmented Control" description="Mutually exclusive pill options." badge="P1" code={`<SegmentedControl value={val} onChange={setVal} options={options} />`}>
        <SegmentedControl
          value={segmented}
          onChange={setSegmented}
          options={[
            { value: "preview", label: "Preview" },
            { value: "code", label: "Code" },
            { value: "tokens", label: "Tokens" },
          ]}
        />
      </ComponentPreview>
    ),
    "toggle-group": (
      <ComponentPreview title="Toggle Group" description="Toolbar toggle buttons (single or multiple)." badge="P1" code={`<ToggleGroup multiple value={toggles} onChange={setToggles} options={options} />`}>
        <ToggleGroup
          multiple
          value={toggles}
          onChange={(v) => setToggles(Array.isArray(v) ? v : [v])}
          options={[
            { value: "bold", label: <Bold className="h-3.5 w-3.5" /> },
            { value: "italic", label: <Italic className="h-3.5 w-3.5" /> },
            { value: "underline", label: <Underline className="h-3.5 w-3.5" /> },
          ]}
        />
      </ComponentPreview>
    ),
    "context-menu": (
      <ComponentPreview title="Context Menu" description="Right-click menu." badge="P1" code={`<ContextMenu items={items}><div>Right click me</div></ContextMenu>`}>
        <ContextMenu
          items={[
            { label: "Copy", shortcut: "⌘C", onSelect: () => toast({ title: "Copied" }) },
            { label: "Duplicate", shortcut: "⌘D", onSelect: () => toast({ title: "Duplicated" }) },
            { label: "Delete", destructive: true, onSelect: () => toast({ title: "Deleted", variant: "destructive" }) },
          ]}
        >
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-xs text-muted-foreground">
            Right-click anywhere inside this box
          </div>
        </ContextMenu>
      </ComponentPreview>
    ),
    switch: (
      <ComponentPreview title="Switch" description="Accessible on/off toggle." badge="P0" code={`<Switch checked={dark} onCheckedChange={toggleTheme} />`}>
        <div className="flex items-center gap-3 text-sm">
          <Switch checked={dark} onCheckedChange={toggleTheme} />
          <span>Dark mode: {dark ? "On" : "Off"}</span>
        </div>
      </ComponentPreview>
    ),
    checkbox: (
      <ComponentPreview title="Checkbox" description="Accessible checkbox control." badge="P0" code={`<Checkbox defaultChecked />`}>
        <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Vibecoding ready</label>
      </ComponentPreview>
    ),
    slider: (
      <ComponentPreview title="Slider" description="Range slider built on Radix UI." badge="P2" code={`<Slider value={sliderVal} onValueChange={setSliderVal} max={100} />`}>
        <div className="w-64 space-y-2">
          <span className="text-xs text-muted-foreground">Opacity: {sliderVal[0]}%</span>
          <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} />
        </div>
      </ComponentPreview>
    ),
    "form-field": (
      <ComponentPreview title="Form Field" description="Label, required indicator, description, and error." badge="P0" code={`<FormField label="App Name" required><Input /></FormField>`}>
        <div className="max-w-sm"><FormField label="App Name" required description="Used as your package slug"><Input placeholder="chill-app" /></FormField></div>
      </ComponentPreview>
    ),
    input: (
      <ComponentPreview title="Input" description="Standard text input." badge="P0" code={`<Input placeholder="Search..." />`}>
        <Input placeholder="Search..." className="max-w-sm" />
      </ComponentPreview>
    ),
    "password-input": (
      <ComponentPreview title="Password Input" description="Password field with show/hide toggle." badge="P1" code={`<PasswordInput placeholder="Enter password" />`}>
        <div className="max-w-sm"><PasswordInput placeholder="Enter password" defaultValue="chilluikit123" /></div>
      </ComponentPreview>
    ),
    "password-strength": (
      <ComponentPreview title="Password Strength" description="Strength meter, rules checklist, and generator." badge="P1" code={`<PasswordStrength password={pwd} onGenerate={setPwd} />`}>
        <div className="max-w-sm space-y-3">
          <PasswordInput value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <PasswordStrength password={pwd} onGenerate={setPwd} />
        </div>
      </ComponentPreview>
    ),
    "otp-input": (
      <ComponentPreview title="OTP Input" description="Multi-slot verification code input." badge="P1" code={`<OTPInput length={6} value={otp} onChange={setOtp} />`}>
        <OTPInput length={6} value={otp} onChange={setOtp} />
      </ComponentPreview>
    ),
    textarea: (
      <ComponentPreview title="Textarea" description="Multi-line text input." badge="P0" code={`<Textarea placeholder="Describe your app..." />`}>
        <Textarea placeholder="Describe your app..." className="max-w-md" />
      </ComponentPreview>
    ),
    "markdown-editor": (
      <ComponentPreview title="Markdown Editor" description="Rich description editor with toolbar & Write/Preview tabs." badge="P1" code={`<MarkdownEditor value={markdown} onChange={setMarkdown} />`}>
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
      </ComponentPreview>
    ),
    select: (
      <ComponentPreview title="Select" description="Accessible select dropdown." badge="P0" code={`<Select defaultValue="web">...</Select>`}>
        <Select defaultValue="web">
          <SelectTrigger className="w-48"><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
      </ComponentPreview>
    ),
    "radio-group": (
      <ComponentPreview title="Radio Group" description="Single-choice radio group." badge="P0" code={`<RadioGroup defaultValue="cloud">...</RadioGroup>`}>
        <RadioGroup defaultValue="cloud" className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="cloud" /> Cloud</label>
          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="self" /> Self-hosted</label>
        </RadioGroup>
      </ComponentPreview>
    ),
    combobox: (
      <ComponentPreview title="Combobox" description="Searchable select dropdown." badge="P1" code={`<Combobox options={options} value={combo} onValueChange={setCombo} />`}>
        <Combobox value={combo} onValueChange={setCombo} options={[{ value: "react", label: "React + Vite" }, { value: "tauri", label: "Tauri Desktop" }, { value: "expo", label: "React Native Expo" }]} />
      </ComponentPreview>
    ),
    "multi-select": (
      <ComponentPreview title="Multi Select" description="Multi-choice searchable dropdown with removable chips." badge="P1" code={`<MultiSelect options={options} value={multi} onChange={setMulti} />`}>
        <MultiSelect
          value={multi}
          onChange={setMulti}
          options={[
            { value: "react", label: "React" },
            { value: "tailwind", label: "Tailwind v4" },
            { value: "radix", label: "Radix UI" },
            { value: "ts", label: "TypeScript" },
          ]}
        />
      </ComponentPreview>
    ),
    "date-picker": (
      <ComponentPreview title="Date Picker" description="Date input with quick presets." badge="P1" code={`<DatePicker value={date} onChange={setDate} />`}>
        <DatePicker value={date} onChange={setDate} />
      </ComponentPreview>
    ),
    "date-range-picker": (
      <ComponentPreview title="Date Range Picker" description="Start and end date range selector." badge="P1" code={`<DateRangePicker value={range} onChange={setRange} />`}>
        <DateRangePicker value={range} onChange={setRange} />
      </ComponentPreview>
    ),
    "file-upload": (
      <ComponentPreview title="File Upload" description="Drag-and-drop file upload zone." badge="P1" code={`<FileUpload files={files} onFilesChange={setFiles} />`}>
        <div className="max-w-md"><FileUpload files={files} onFilesChange={setFiles} /></div>
      </ComponentPreview>
    ),
    "icon-picker": (
      <ComponentPreview title="Icon Picker" description="Searchable Lucide icon picker & string-based ChillIcon renderer." badge="P1" code={`<IconPicker value={icon} onChange={setIcon} />\n<ChillIcon name={icon} />`}>
        <IconPicker value={iconName} onChange={setIconName} />
      </ComponentPreview>
    ),
    dialog: (
      <ComponentPreview title="Dialog" description="Accessible modal dialog." badge="P0" code={`<Dialog>...</Dialog>`}>
        <Dialog>
          <DialogTrigger asChild><Button variant="outline">Open Dialog</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>ChillUIKit Dialog</DialogTitle><DialogDescription>Accessible modal powered by Radix UI Dialog.</DialogDescription></DialogHeader>
            <DialogFooter><Button>Confirm</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </ComponentPreview>
    ),
    drawer: (
      <ComponentPreview title="Drawer / Sheet" description="Slide-over panel from right, left, or bottom." badge="P0" code={`<Drawer><DrawerContent side="right">...</DrawerContent></Drawer>`}>
        <Drawer>
          <DrawerTrigger asChild><Button variant="outline">Open Drawer</Button></DrawerTrigger>
          <DrawerContent side="right">
            <DrawerHeader><DrawerTitle>Inspector Drawer</DrawerTitle><DrawerDescription>Slide-over panel for details or AI copilot.</DrawerDescription></DrawerHeader>
            <DrawerFooter><Button>Save Changes</Button></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ComponentPreview>
    ),
    "alert-dialog": (
      <ComponentPreview title="Alert Dialog" description="Destructive action confirmation modal." badge="P0" code={`<AlertDialog>...</AlertDialog>`}>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive">Delete Item</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ComponentPreview>
    ),
    popover: (
      <ComponentPreview title="Popover" description="Floating panel anchored to a trigger." badge="P1" code={`<Popover>...</Popover>`}>
        <Popover>
          <PopoverTrigger asChild><Button variant="outline">Open Popover</Button></PopoverTrigger>
          <PopoverContent><p className="text-sm font-medium">Quick Settings</p><p className="text-xs text-muted-foreground mt-1">Configure workspace tokens here.</p></PopoverContent>
        </Popover>
      </ComponentPreview>
    ),
    "hover-card": (
      <ComponentPreview title="Hover Card" description="Preview card on hover or focus." badge="P1" code={`<HoverCard trigger={<Button variant="link">@chilluikit</Button>}>...</HoverCard>`}>
        <HoverCard trigger={<Button variant="outline" size="sm">Hover @chilluikit</Button>}>
          <div className="space-y-1">
            <p className="text-sm font-semibold">ChillUIKit</p>
            <p className="text-xs text-muted-foreground">Open-code React + Tailwind v4 design system for vibecoding.</p>
          </div>
        </HoverCard>
      </ComponentPreview>
    ),
    "dropdown-menu": (
      <ComponentPreview title="Dropdown Menu" description="Context actions menu with shortcuts." badge="P0" code={`<DropdownMenu>...</DropdownMenu>`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy ID <DropdownMenuShortcut>⌘C</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Saved!", variant: "success" })}>Save</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentPreview>
    ),
    "user-menu": (
      <ComponentPreview title="User Menu" description="Account menu behind an Avatar." badge="P1" code={`<UserMenu name="Dang TB" email="dev@chilluikit.dev" plan="Pro" />`}>
        <UserMenu name="Dang TB" email="dev@chilluikit.dev" plan="Pro" onToggleTheme={toggleTheme} onSettings={() => selectGroup("Screens")} onSignOut={() => toast({ title: "Signed out" })} />
      </ComponentPreview>
    ),
    "floating-dock": (
      <ComponentPreview title="Floating Dock" description="Floating action bar." badge="P2" code={`<FloatingDock><Button size="sm">Run</Button></FloatingDock>`}>
        <FloatingDock>
          <Button variant="ghost" size="sm">Inspect</Button>
          <Button variant="ghost" size="sm">Tokens</Button>
          <Button size="sm">Deploy</Button>
        </FloatingDock>
      </ComponentPreview>
    ),
    tooltip: (
      <ComponentPreview title="Tooltip" description="Short hint on hover/focus." badge="P0" code={`<Tooltip>...</Tooltip>`}>
        <Tooltip>
          <TooltipTrigger asChild><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger>
          <TooltipContent shortcut="⌘K">Quick Command</TooltipContent>
        </Tooltip>
      </ComponentPreview>
    ),
    breadcrumb: (
      <ComponentPreview title="Breadcrumb" description="Hierarchical path links." badge="P0" code={`<Breadcrumb>...</Breadcrumb>`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Navigation</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ComponentPreview>
    ),
    pagination: (
      <ComponentPreview title="Pagination" description="Page navigation controls." badge="P0" code={`<Pagination page={page} totalPages={4} onPageChange={setPage} />`}>
        <Pagination page={page} totalPages={4} onPageChange={setPage} />
      </ComponentPreview>
    ),
    "nav-tree": (
      <ComponentPreview title="Nav Tree" description="Collapsible multi-level tree menu with guide lines, badges & status dots." badge="P1" code={`<NavTree nodes={nodes} activeId={activeId} defaultOpenIds={["actions"]} onSelect={(n) => setActiveId(n.id)} />`}>
        <div className="max-w-xs rounded-lg border border-border bg-surface p-2">
          <NavTree
            activeId={navTreeId}
            defaultOpenIds={["actions"]}
            onSelect={(n) => setNavTreeId(n.id)}
            nodes={[
              {
                id: "actions",
                label: "Actions",
                badge: 3,
                children: [
                  { id: "button", label: "Button" },
                  { id: "action-button", label: "Action Button", dot: true },
                  { id: "hold-button", label: "Hold Button" },
                ],
              },
              {
                id: "forms",
                label: "Forms",
                badge: 2,
                children: [
                  { id: "input", label: "Input" },
                  { id: "multi-select", label: "Multi Select", dot: true },
                ],
              },
            ]}
          />
        </div>
      </ComponentPreview>
    ),
    "bottom-nav": (
      <ComponentPreview title="Bottom Nav" description="Mobile thumb-zone navigation bar." badge="P1" allowViewportToggle code={`<BottomNav>...</BottomNav>`}>
        <div className="overflow-hidden rounded-lg border border-border">
          <BottomNav>
            <BottomNavItem icon={<Home />} label="Home" active />
            <BottomNavItem icon={<Blocks />} label="UI" />
            <BottomNavItem icon={<Settings />} label="Settings" />
          </BottomNav>
        </div>
      </ComponentPreview>
    ),
    avatar: (
      <ComponentPreview title="Avatar" description="User avatar with status dot." badge="P0" code={`<Avatar fallback="CU" status="online" />`}>
        <div className="flex items-center gap-3"><Avatar fallback="CU" status="online" /><Avatar fallback="AI" size="sm" status="busy" /><Avatar fallback="UI" size="lg" status="offline" /></div>
      </ComponentPreview>
    ),
    "comment-thread": (
      <ComponentPreview
        title="Comment Thread"
        description="Nested comments with @mentions, emoji reactions, Resolve/Reopen & reply composer."
        badge="P1"
        code={`<CommentThread comments={comments} resolved={resolved} onToggleResolve={...} onSubmitReply={...} />`}
      >
        <CommentThread
          comments={comments}
          resolved={threadResolved}
          onToggleResolve={() => setThreadResolved((r) => !r)}
          onReact={(id, emoji) =>
            setComments((prev) =>
              prev.map((c) =>
                c.id === id
                  ? {
                      ...c,
                      reactions: c.reactions?.map((r) =>
                        r.emoji === emoji
                          ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 }
                          : r
                      ),
                    }
                  : c
              )
            )
          }
          onSubmitReply={(text) =>
            setComments((prev) => [
              ...prev,
              { id: String(Date.now()), author: "You", avatarFallback: "YO", time: "Just now", content: text },
            ])
          }
        />
      </ComponentPreview>
    ),
    badge: (
      <ComponentPreview title="Badge" description="Semantic status badges." badge="P0" code={`<Badge variant="success">Success</Badge>`}>
        <div className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="destructive">Error</Badge></div>
      </ComponentPreview>
    ),
    "tag-group": (
      <ComponentPreview title="Tag Group" description="Selectable/removable chips." badge="P1" code={`<TagGroup tags={["React", "Tailwind", "Radix"]} selected={selected} onToggle={...} />`}>
        <TagGroup
          tags={["React", "Tailwind", "Radix", "TypeScript"]}
          selected={selectedTags}
          onToggle={(t) => setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
        />
      </ComponentPreview>
    ),
    "priority-bars": (
      <ComponentPreview title="Priority Bars" description="Rising priority indicator bars." badge="P1" code={`<PriorityBars priority="high" />`}>
        <div className="flex flex-wrap gap-4">
          <PriorityBars priority="none" />
          <PriorityBars priority="low" />
          <PriorityBars priority="medium" />
          <PriorityBars priority="high" />
          <PriorityBars priority="urgent" />
        </div>
      </ComponentPreview>
    ),
    chart: (
      <ComponentPreview title="Chart (SVG)" description="Zero-dependency Bar, Line & Donut charts." badge="P1" code={`<Chart variant="bar" data={data} />`}>
        <div className="grid gap-6 md:grid-cols-3 items-center">
          <Chart variant="bar" data={[{ label: "Mon", value: 30 }, { label: "Tue", value: 65 }, { label: "Wed", value: 45 }, { label: "Thu", value: 90 }]} />
          <Chart variant="line" data={[{ label: "1", value: 20 }, { label: "2", value: 55 }, { label: "3", value: 40 }, { label: "4", value: 85 }]} />
          <Chart variant="donut" data={[{ label: "Web", value: 60 }, { label: "Desktop", value: 25 }, { label: "Mobile", value: 15 }]} />
        </div>
      </ComponentPreview>
    ),
    "uptime-bar": (
      <ComponentPreview title="Uptime Bar" description="Service health strip by day." badge="P1" code={`<UptimeBar days={days} />`}>
        <UptimeBar days={["up", "up", "up", "degraded", "up", "up", "up", "up", "down", "up", "up", "up", "up", "up"]} />
      </ComponentPreview>
    ),
    heatmap: (
      <ComponentPreview title="Heatmap" description="2-axis intensity grid." badge="P1" code={`<Heatmap values={values} columns={12} />`}>
        <div className="max-w-md"><Heatmap values={[0, 2, 5, 8, 1, 0, 4, 9, 6, 3, 2, 7, 1, 4, 8, 2, 0, 5, 9, 4, 6, 3, 1, 8]} columns={12} /></div>
      </ComponentPreview>
    ),
    kbd: (
      <ComponentPreview title="Kbd" description="Keyboard shortcut key badge." badge="P0" code={`<Kbd>⌘</Kbd> <Kbd>K</Kbd>`}>
        <div className="flex items-center gap-1.5"><Kbd>⌘</Kbd><Kbd>K</Kbd><span className="mx-2 text-xs text-muted-foreground">or</span><Kbd>Esc</Kbd></div>
      </ComponentPreview>
    ),
    separator: (
      <ComponentPreview title="Separator" description="1px hairline divider." badge="P0" code={`<Separator />`}>
        <div className="space-y-3 max-w-sm"><p className="text-sm">Section A</p><Separator /><p className="text-sm">Section B</p></div>
      </ComponentPreview>
    ),
    spinner: (
      <ComponentPreview title="Spinner" description="Indeterminate loading spinner." badge="P0" code={`<Spinner />`}>
        <div className="flex items-center gap-4"><Spinner size="sm" /><Spinner /><Spinner size="lg" /></div>
      </ComponentPreview>
    ),
    "status-dot": (
      <ComponentPreview title="Status Dot" description="Semantic state indicator dot." badge="P0" code={`<StatusDot status="busy" pulse label="Running" />`}>
        <div className="flex flex-wrap gap-4"><StatusDot status="idle" label="Idle" /><StatusDot status="busy" pulse label="Running" /><StatusDot status="blocked" label="Blocked" /><StatusDot status="failed" label="Failed" /><StatusDot status="finished" label="Finished" /></div>
      </ComponentPreview>
    ),
    "data-table": (
      <ComponentPreview title="Data Table" description="Sortable, searchable table with row selection." badge="P1" code={`<DataTable data={rows} columns={columns} />`}>
        <DataTable data={sampleRows} columns={[{ key: "name", header: "Component", sortable: true }, { key: "category", header: "Category", sortable: true }, { key: "status", header: "Status", render: (r) => <Badge variant="success">{r.status}</Badge> }]} />
      </ComponentPreview>
    ),
    "property-list": (
      <ComponentPreview title="Property List" description="2-column key-value grid for issue/record details." badge="P1" code={`<PropertyList rows={rows} />`}>
        <div className="max-w-sm">
          <PropertyList
            rows={[
              { label: "Status", value: <StatusDot status="busy" pulse label="In Progress" /> },
              { label: "Priority", value: <PriorityBars priority="high" /> },
              { label: "Assignee", value: <div className="flex items-center gap-2"><Avatar fallback="DT" size="sm" /><span>Dang TB</span></div> },
              { label: "Labels", value: <Badge variant="secondary">UI Kit</Badge> },
            ]}
          />
        </div>
      </ComponentPreview>
    ),
    "stat-card": (
      <ComponentPreview title="Stat Card" description="KPI metric card with trend badge." badge="P1" code={`<StatCard title="Components" value="72" delta="+30" trend="up" />`}>
        <div className="max-w-xs"><StatCard title="Components" value={CATALOG.length} delta="+30" trend="up" icon={<Blocks />} /></div>
      </ComponentPreview>
    ),
    "usage-meter": (
      <ComponentPreview title="Usage Meter" description="Quota progress bar." badge="P1" code={`<UsageMeter label="API Tokens" used={78} limit={100} unit="k" />`}>
        <div className="max-w-sm"><UsageMeter label="API Tokens" used={78} limit={100} unit="k" /></div>
      </ComponentPreview>
    ),
    accordion: (
      <ComponentPreview title="Accordion" description="Collapsible content sections." badge="P1" code={`<Accordion type="single" collapsible>...</Accordion>`}>
        <Accordion type="single" collapsible className="max-w-md"><AccordionItem value="item-1"><AccordionTrigger>Why open-code?</AccordionTrigger><AccordionContent>Full ownership for AI vibecoding.</AccordionContent></AccordionItem></Accordion>
      </ComponentPreview>
    ),
    stepper: (
      <ComponentPreview title="Stepper" description="Multi-step progress indicator." badge="P2" code={`<Stepper currentStep={1} steps={steps} />`}>
        <Stepper currentStep={1} steps={[{ id: "1", title: "Tokens" }, { id: "2", title: "UI" }, { id: "3", title: "Ship" }]} />
      </ComponentPreview>
    ),
    timeline: (
      <ComponentPreview title="Timeline" description="Vertical activity timeline." badge="P2" code={`<Timeline>...</Timeline>`}>
        <Timeline><TimelineItem title="Tokens initialized" time="10:30" active /><TimelineItem title="All 6 roadmap tasks shipped" time="11:35" /></Timeline>
      </ComponentPreview>
    ),
    "code-block": (
      <ComponentPreview title="Code Block" description="Monospace code block with copy." badge="P1" code={`<CodeBlock code="npm run build" language="bash" />`}>
        <CodeBlock code="npm run typecheck && npm run build" language="bash" />
      </ComponentPreview>
    ),
    alert: (
      <ComponentPreview title="Alert" description="Inline callout banner." badge="P0" code={`<Alert variant="warning">...</Alert>`}>
        <Alert variant="warning" className="max-w-lg"><AlertCircle className="h-4 w-4" /><AlertTitle>Heads up</AlertTitle><AlertDescription>Always use semantic tokens instead of hardcoded hex colors.</AlertDescription></Alert>
      </ComponentPreview>
    ),
    toast: (
      <ComponentPreview title="Toast" description="Non-blocking notification stack." badge="P0" code={`toast({ title: "Saved!", variant: "success" })`}>
        <Button size="sm" variant="secondary" onClick={() => toast({ title: "Saved!", description: "Tokens updated.", variant: "success" })}>Trigger Toast</Button>
      </ComponentPreview>
    ),
    "token-stream": (
      <ComponentPreview title="Token Stream" description="Streaming AI text token-by-token." badge="P2" code={`<TokenStream text="ChillUIKit ships 70+ components..." />`}>
        <TokenStream text="ChillUIKit ships unified AppShell frames, W3C design tokens, and AI-native blocks for rapid vibecoding." />
      </ComponentPreview>
    ),
    "shimmer-text": (
      <ComponentPreview title="Shimmer Text" description="Animated shimmer for in-progress labels." badge="P2" code={`<ShimmerText>Thinking...</ShimmerText>`}>
        <ShimmerText>Thinking through design tokens...</ShimmerText>
      </ComponentPreview>
    ),
    "number-ticker": (
      <ComponentPreview title="Number Ticker" description="Animated tabular number counter." badge="P2" code={`<NumberTicker value={tickerVal} prefix="$" />`}>
        <div className="flex items-center gap-4">
          <NumberTicker value={tickerVal} prefix="$" className="text-2xl" />
          <Button size="sm" variant="outline" onClick={() => setTickerVal((v) => v + 250)}>+250</Button>
        </div>
      </ComponentPreview>
    ),
    "shine-border": (
      <ComponentPreview title="Shine Border" description="Gradient border highlight." badge="P2" code={`<ShineBorder><div>Featured Card</div></ShineBorder>`}>
        <ShineBorder className="max-w-sm"><p className="text-sm font-medium">Featured AI Component</p><p className="text-xs text-muted-foreground">Subtle gradient border using semantic tokens.</p></ShineBorder>
      </ComponentPreview>
    ),
    marquee: (
      <ComponentPreview title="Marquee" description="Endless horizontal loop with WCAG Pause button." badge="P2" code={`<Marquee items={[<Badge>React</Badge>, ...]} />`}>
        <Marquee items={[<Badge key="1">React 19</Badge>, <Badge key="2">Tailwind v4</Badge>, <Badge key="3">Radix UI</Badge>, <Badge key="4">TypeScript</Badge>, <Badge key="5">W3C Tokens</Badge>]} />
      </ComponentPreview>
    ),
    "split-pane": (
      <ComponentPreview title="Split Pane" description="Draggable 2-column layout." badge="P1" allowViewportToggle code={`<SplitPane left={<div>Master</div>} right={<div>Detail</div>} />`}>
        <SplitPane left={<div className="text-sm font-medium">Master List (Draggable)</div>} right={<div className="text-sm text-muted-foreground">Detail Inspector Pane</div>} />
      </ComponentPreview>
    ),
    "filter-bar": (
      <ComponentPreview title="Filter Bar" description="Search + active filter chips." badge="P1" code={`<FilterBar search={search} onSearchChange={setSearch} />`}>
        <FilterBar search={filterSearch} onSearchChange={setFilterSearch} activeFilters={[{ key: "p1", label: "Priority: P1" }]} onRemoveFilter={() => {}} onClearAll={() => setFilterSearch("")} />
      </ComponentPreview>
    ),
    "form-sheet": (
      <ComponentPreview
        title="Form Sheet (Odoo Style)"
        description="Complete business form frame with Statusbar, SmartButtons, SectionGrid & Chatter."
        badge="P1"
        code={`<FormSheet title="SO-2026-001" statusbar={<Statusbar ... />} smartButtons={<SmartButtonGroup>...</SmartButtonGroup>} chatter={<CommentThread ... />}>...</FormSheet>`}
      >
        <FormSheet
          title="SO-2026-001 · ChillUIKit Enterprise"
          subtitle="Customer: Nhadaungocnay Corp"
          statusbar={
            <Statusbar
              currentId={odooStage}
              onStageClick={setOdooStage}
              actions={<Button size="sm" onClick={() => setOdooStage("done")}>Confirm Order</Button>}
              stages={[
                { id: "draft", label: "Draft" },
                { id: "confirmed", label: "Confirmed" },
                { id: "done", label: "Done" },
              ]}
            />
          }
          smartButtons={
            <SmartButtonGroup>
              <SmartButton icon={<Blocks />} value={12} label="Tasks" onClick={() => toast({ title: "12 Tasks" })} />
              <SmartButton icon={<Activity />} value="$4.2k" label="Invoiced" onClick={() => toast({ title: "$4.2k Invoiced" })} />
            </SmartButtonGroup>
          }
          chatter={<CommentThread comments={comments} />}
        >
          <SectionGrid title="General Information" columns={2}>
            <FormField label="Order Reference"><Input defaultValue="SO-2026-001" /></FormField>
            <FormField label="Owner"><Input defaultValue="Dang TB" /></FormField>
          </SectionGrid>
        </FormSheet>
      </ComponentPreview>
    ),
    "section-grid": (
      <ComponentPreview title="Section Grid" description="1/2/3-column slot container for forms & cards." badge="P1" code={`<SectionGrid title="General" columns={2}><FormField ... /></SectionGrid>`}>
        <SectionGrid title="General Information" description="Drop FormFields or StatCards here." columns={2}>
          <FormField label="First Name"><Input placeholder="Dang" /></FormField>
          <FormField label="Last Name"><Input placeholder="TB" /></FormField>
        </SectionGrid>
      </ComponentPreview>
    ),
    statusbar: (
      <ComponentPreview title="Statusbar" description="Odoo-style pipeline stage bar." badge="P1" code={`<Statusbar stages={stages} currentId={stage} onStageClick={setStage} />`}>
        <Statusbar
          currentId={odooStage}
          onStageClick={setOdooStage}
          actions={<Button size="sm" variant="outline" onClick={() => setOdooStage("draft")}>Reset</Button>}
          stages={[
            { id: "draft", label: "Draft" },
            { id: "confirmed", label: "Confirmed" },
            { id: "done", label: "Done" },
          ]}
        />
      </ComponentPreview>
    ),
    "smart-button": (
      <ComponentPreview title="Smart Button" description="Compact stat/link buttons for form headers." badge="P1" code={`<SmartButtonGroup><SmartButton icon={<Blocks />} value={12} label="Tasks" /></SmartButtonGroup>`}>
        <SmartButtonGroup>
          <SmartButton icon={<Blocks />} value={12} label="Tasks" onClick={() => toast({ title: "12 Tasks" })} />
          <SmartButton icon={<Activity />} value="99.9%" label="Uptime" onClick={() => toast({ title: "99.9% Uptime" })} />
        </SmartButtonGroup>
      </ComponentPreview>
    ),
    "feedback-states": (
      <ComponentPreview title="Empty / Error / Skeleton" description="Standardized feedback states." badge="P0" code={`<EmptyState title="No projects yet" />\n<ErrorState message="Failed." />`}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2"><EmptyState title="No projects yet" description="Create your first app." action={<Button size="sm">Create</Button>} /><ErrorState message="Failed to sync tokens." onRetry={() => {}} /></div>
          <LoadingSkeleton rows={2} />
        </div>
      </ComponentPreview>
    ),
    "prompt-input": (
      <ComponentPreview title="Prompt Input" description="AI chat composer with model selector." badge="AI" allowViewportToggle code={`<PromptInput value={prompt} onChange={setPrompt} onSubmit={...} />`}>
        <PromptInput value={prompt} onChange={setPrompt} onSubmit={() => { toast({ title: "Prompt sent", description: prompt, variant: "success" }); setPrompt(""); }} models={["Gemini 2.5 Pro", "Claude 3.7 Sonnet"]} model={model} onModelChange={setModel} onAttach={() => toast({ title: "Attach clicked" })} />
      </ComponentPreview>
    ),
    "context-window": (
      <ComponentPreview title="Context Window" description="Segmented token bar with Compact action." badge="AI" code={`<ContextWindow segments={segments} limit={128000} onCompact={...} />`}>
        <ContextWindow limit={128000} onCompact={() => toast({ title: "Context compacted!", variant: "success" })} segments={[{ label: "System", tokens: 12000 }, { label: "Files", tokens: 42000 }, { label: "History", tokens: 28000 }]} />
      </ComponentPreview>
    ),
    "tool-call-card": (
      <ComponentPreview title="Tool Call Card" description="Expandable JSON input/output card." badge="AI" code={`<ToolCallCard name="kanzo.create_task" input={...} output={...} />`}>
        <ToolCallCard name="kanzo.create_task" durationMs={142} input={{ project: "chilluikit", title: "Add Chart" }} output={{ id: "chilluikit#199", status: "done" }} />
      </ComponentPreview>
    ),
    "thinking-state": (
      <ComponentPreview title="Thinking State" description="Collapsible agent reasoning steps." badge="AI" code={`<ThinkingState isThinking steps={["Analyzing tokens...", "Generating UI..."]} />`}>
        <ThinkingState isThinking steps={["Reading docs/research/knowns-ui-catalog.md", "Checking semantic tokens in tokens.css"]} />
      </ComponentPreview>
    ),
    "message-actions": (
      <ComponentPreview title="Message Actions" description="Copy, Regenerate, and Feedback bar." badge="AI" code={`<MessageActions onCopy={...} onRegenerate={...} onFeedback={...} />`}>
        <MessageActions onCopy={() => toast({ title: "Copied" })} onRegenerate={() => toast({ title: "Regenerating..." })} onFeedback={(t) => toast({ title: `Feedback: ${t}` })} />
      </ComponentPreview>
    ),
    "inline-diff": (
      <ComponentPreview title="Inline Diff" description="Line-by-line code/text diff viewer." badge="AI" code={`<InlineDiff filename="tokens.css" lines={lines} />`}>
        <InlineDiff
          filename="src/styles/tokens.css"
          lines={[
            { type: "context", text: ":root {" },
            { type: "remove", text: "  --radius-md: 0.25rem;" },
            { type: "add", text: "  --radius-md: 0.5rem;" },
            { type: "context", text: "}" },
          ]}
        />
      </ComponentPreview>
    ),
    "approval-card": (
      <ComponentPreview title="Approval Card" description="Human-in-the-loop permission card." badge="AI" code={`<ApprovalCard title="Run migration" command="npx drizzle-kit push" risk="high" />`}>
        <ApprovalCard title="Run database migration" description="Agent requests permission to apply schema changes." command="npx drizzle-kit push --force" risk="high" onApprove={() => toast({ title: "Approved", variant: "success" })} onReject={() => toast({ title: "Rejected", variant: "destructive" })} />
      </ComponentPreview>
    ),
    "execution-steps": (
      <ComponentPreview title="Execution Steps" description="Live agent run steps." badge="AI" code={`<ExecutionSteps steps={steps} />`}>
        <ExecutionSteps steps={[{ id: "1", label: "Read design tokens", status: "done", detail: "tokens/semantic.json" }, { id: "2", label: "Generate UI components", status: "running", detail: "src/components/ai/" }, { id: "3", label: "Run typecheck & build", status: "pending" }]} />
      </ComponentPreview>
    ),
    "tool-call-badge": (
      <ComponentPreview title="Tool Call Badge" description="Inline MCP/tool execution badge." badge="AI" code={`<ToolCallBadge name="kanzo.update_task" status="running" />`}>
        <div className="flex flex-wrap gap-2"><ToolCallBadge name="kanzo.update_task" status="running" /><ToolCallBadge name="fs.write_file" status="done" /><ToolCallBadge name="npm.build" status="error" /></div>
      </ComponentPreview>
    ),
    "node-flow": (
      <ComponentPreview
        title="Node Flow (React Flow)"
        description="ChillUIKit-themed @xyflow/react canvas & custom FlowNode cards."
        badge="AI"
        code={`<FlowCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} showMiniMap />`}
      >
        <FlowCanvas
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          showMiniMap
          toolbar={
            <Button size="sm" variant="secondary" onClick={() => toast({ title: "Flow triggered", variant: "success" })}>
              Run Flow
            </Button>
          }
        />
      </ComponentPreview>
    ),
    "state-workflow": (
      <ComponentPreview
        title="State Workflow (StatusNode + FlowInspector)"
        description="Jira-style state machine editor with smoothstep labeled transitions & right-hand inspector."
        badge="AI"
        code={`<div className="flex flex-col md:flex-row rounded-lg border border-border overflow-hidden">\n  <FlowCanvas nodes={statusNodes} edges={statusEdges} className="border-0 rounded-none" />\n  <FlowInspector title="Transition" subtitle="Edit rules">...</FlowInspector>\n</div>`}
      >
        <div className="flex flex-col md:flex-row rounded-lg border border-border overflow-hidden">
          <FlowCanvas
            nodes={statusNodes}
            edges={statusEdges}
            onNodesChange={onStatusNodesChange}
            onEdgesChange={onStatusEdgesChange}
            onEdgeClick={(_, edge) => setSelectedTransition(String(edge.label ?? edge.id))}
            className="h-[360px] flex-1 border-0 rounded-none"
          />
          <FlowInspector
            title={`Transition: ${selectedTransition}`}
            subtitle="Connects statuses as workflow actions."
            footer={
              <>
                <Button size="sm" variant="destructive" onClick={() => toast({ title: "Deleted", variant: "destructive" })}>
                  Delete
                </Button>
                <Button size="sm" onClick={() => toast({ title: "Saved", variant: "success" })}>
                  Save
                </Button>
              </>
            }
          >
            <FormField label="Transition Name">
              <Input value={selectedTransition} onChange={(e) => setSelectedTransition(e.target.value)} />
            </FormField>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-foreground">Rules</span>
              <div className="rounded-md border border-border bg-background p-2.5 text-xs text-muted-foreground">
                Restrict to assigned reviewer before moving to Done.
              </div>
            </div>
          </FlowInspector>
        </div>
      </ComponentPreview>
    ),
    "settings-layout": (
      <ComponentPreview title="Settings Layout" description="Section nav, unsaved bar & danger zone." badge="P1" code={`<SettingsLayout sections={sections} dirty onSave={...} />`}>
        <SettingsLayout
          dirty
          onSave={() => toast({ title: "Settings saved", variant: "success" })}
          onDeleteWorkspace={() => toast({ title: "Delete clicked", variant: "destructive" })}
          sections={[
            { id: "general", label: "General", content: <FormField label="Workspace Name"><Input defaultValue="ChillUIKit" /></FormField> },
            { id: "billing", label: "Billing", content: <UsageMeter label="Seats" used={4} limit={10} /> },
          ]}
        />
      </ComponentPreview>
    ),
    "notification-center": (
      <ComponentPreview title="Notification Center" description="Bell trigger with unread badge & feed." badge="P1" code={`<NotificationCenter items={items} onMarkAllRead={...} />`}>
        <NotificationCenter
          onMarkAllRead={() => toast({ title: "All marked read" })}
          items={[
            { id: "1", title: "chilluikit#202 completed", time: "2m ago", unread: true },
            { id: "2", title: "New design tokens published", time: "1h ago" },
          ]}
        />
      </ComponentPreview>
    ),
    "onboarding-checklist": (
      <ComponentPreview title="Onboarding Checklist" description="First-run setup checklist." badge="P1" code={`<OnboardingChecklist steps={steps} onToggle={...} />`}>
        <OnboardingChecklist
          steps={onboarding}
          onToggle={(id) => setOnboarding((prev) => prev.map((s) => s.id === id ? { ...s, done: !s.done } : s))}
        />
      </ComponentPreview>
    ),
    "error-pages": (
      <ComponentPreview title="Error Pages" description="404, 500, and Maintenance templates." badge="P1" code={`<ErrorPage code="404" onAction={...} />`}>
        <div className="grid gap-4 md:grid-cols-2">
          <ErrorPage code="404" onAction={() => selectGroup("overview")} />
          <ErrorPage code="maintenance" />
        </div>
      </ComponentPreview>
    ),
    "changelog-feed": (
      <ComponentPreview title="Changelog Feed" description="Dated release notes with New/Improved/Fixed tags." badge="P1" code={`<ChangelogFeed entries={entries} />`}>
        <ChangelogFeed
          entries={[
            { version: "v0.4.0", date: "2026-11-26", type: "New", title: "Added 23 Knowns-UI inspired components", description: "Includes Chart, Heatmap, ContextWindow, ToolCallCard, and SaaS Screens." },
            { version: "v0.3.0", date: "2026-11-26", type: "Improved", title: "Tree Sidebar & Individual Previews", description: "Split every component into its own dedicated preview." },
          ]}
        />
      </ComponentPreview>
    ),
    "kanban-board": (
      <ComponentPreview title="Kanban Board" description="Drag-and-drop task board across columns." badge="P1" code={`<KanbanBoard columns={cols} onMoveCard={handleMove} />`}>
        <KanbanBoard
          columns={kanbanCols}
          onMoveCard={(cardId, fromCol, toCol) => {
            setKanbanCols((prev) => {
              const card = prev.find((c) => c.id === fromCol)?.cards.find((x) => x.id === cardId);
              if (!card) return prev;
              return prev.map((c) => {
                if (c.id === fromCol) return { ...c, cards: c.cards.filter((x) => x.id !== cardId) };
                if (c.id === toCol) return { ...c, cards: [...c.cards, card] };
                return c;
              });
            });
          }}
        />
      </ComponentPreview>
    ),
    "grouped-list": (
      <ComponentPreview title="Grouped List" description="Collapsible sprint/backlog list with inline issue creation." badge="P1" code={`<GroupedList groups={groups} onAddItem={handleAdd} />`}>
        <GroupedList
          groups={backlogGroups}
          onAddItem={(groupId, title) =>
            setBacklogGroups((prev) =>
              prev.map((g) =>
                g.id === groupId
                  ? { ...g, items: [...g.items, { id: String(Date.now()), key: `CHILL-${g.items.length + 12}`, title, status: "idle" as const, priority: "medium" as const }] }
                  : g
              )
            )
          }
        />
      </ComponentPreview>
    ),
    "gantt-chart": (
      <ComponentPreview title="Gantt Chart" description="Timeline schedule bars with today marker." badge="P1" code={`<GanttChart tasks={tasks} totalDays={14} todayDay={5} />`}>
        <GanttChart
          totalDays={14}
          todayDay={5}
          tasks={[
            { id: "t1", title: "Design Tokens", startDay: 1, durationDays: 4, progress: 100, assignee: "DT", tone: "success" },
            { id: "t2", title: "Core Components", startDay: 3, durationDays: 6, progress: 75, assignee: "AI", tone: "primary" },
            { id: "t3", title: "ChillStudio MVP", startDay: 8, durationDays: 5, progress: 20, assignee: "DT", tone: "warning" },
          ]}
        />
      </ComponentPreview>
    ),
    "calendar-view": (
      <ComponentPreview title="Calendar View" description="7-column month schedule grid with event pills." badge="P1" code={`<CalendarView events={events} today={26} />`}>
        <CalendarView
          today={26}
          events={[
            { id: "e1", title: "v0.5.0 Release", day: 26, tone: "success" },
            { id: "e2", title: "Sprint Planning", day: 28, tone: "primary" },
            { id: "e3", title: "Design Review", day: 18, tone: "warning" },
          ]}
        />
      </ComponentPreview>
    ),
    "tree-table": (
      <ComponentPreview title="Tree Table" description="Expandable Epic → Story → Subtask hierarchy table." badge="P1" code={`<TreeTable nodes={nodes} />`}>
        <TreeTable
          nodes={[
            {
              id: "ep1",
              key: "EPIC-1",
              title: "ChillUIKit v0.5.0",
              status: "busy",
              priority: "high",
              assignee: "DT",
              children: [
                { id: "st1", key: "CHILL-1", title: "GanttChart & CalendarView", status: "finished", priority: "medium", assignee: "AI" },
                { id: "st2", key: "CHILL-2", title: "ChillStudio Backlog", status: "idle", priority: "low", assignee: "DT" },
              ],
            },
          ]}
        />
      </ComponentPreview>
    ),
    "gallery-grid": (
      <ComponentPreview title="Gallery Grid" description="Card gallery view for projects, templates & media." badge="P1" code={`<GalleryGrid items={items} onSelect={...} />`}>
        <GalleryGrid
          onSelect={(item) => toast({ title: `Selected ${item.title}` })}
          items={[
            { id: "g1", title: "CRM Workspace", subtitle: "Contacts, deals & AI draft", badge: "Template", meta: "4 pages" },
            { id: "g2", title: "Jira Mini", subtitle: "Kanban, Gantt & Issue Detail", badge: "Template", meta: "6 pages" },
            { id: "g3", title: "Agent Ops", subtitle: "Node Flow & Trace Waterfall", badge: "AI", meta: "3 pages" },
          ]}
        />
      </ComponentPreview>
    ),
    "data-grid-view": (
      <ComponentPreview title="Data Grid View" description="Inline-editable spreadsheet grid with density & column visibility." badge="P1" code={`<DataGridView data={rows} columns={columns} onCellChange={...} onAddRow={...} />`}>
        <DataGridView
          data={gridRows}
          columns={[
            { key: "key", header: "Key", editable: false },
            { key: "title", header: "Title" },
            { key: "owner", header: "Owner" },
            { key: "status", header: "Status" },
          ]}
          onCellChange={(rowId, key, val) =>
            setGridRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [key]: val } : r)))
          }
          onAddRow={() =>
            setGridRows((prev) => [
              ...prev,
              { id: String(Date.now()), key: `CHILL-${prev.length + 1}`, title: "New item", owner: "You", status: "Todo" },
            ])
          }
        />
      </ComponentPreview>
    ),
    "detail-view": (
      <ComponentPreview title="Detail View" description="Complete record/issue detail page with main content & right property sidebar." badge="P1" code={`<DetailView title="CHILL-12" sidebar={<PropertyList rows={rows} />}>...</DetailView>`}>
        <DetailView
          breadcrumb="Projects / ChillUIKit / CHILL-12"
          title="Build DetailView & DataGridView"
          badge="In Progress"
          subtitle="Created 2 hours ago by Dang TB"
          actions={<Button size="sm" onClick={() => toast({ title: "Saved", variant: "success" })}>Save</Button>}
          sidebar={
            <PropertyList
              rows={[
                { label: "Status", value: <StatusDot status="busy" pulse label="In Progress" /> },
                { label: "Priority", value: <PriorityBars priority="high" /> },
                { label: "Assignee", value: <div className="flex items-center gap-2"><Avatar fallback="DT" size="sm" /><span>Dang TB</span></div> },
              ]}
            />
          }
        >
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
          <CommentThread comments={comments} resolved={threadResolved} onToggleResolve={() => setThreadResolved((r) => !r)} />
        </DetailView>
      </ComponentPreview>
    ),
    "theme-customizer": (
      <ComponentPreview title="Theme Customizer" description="8 brand presets, radius scale & custom color picker for app Settings." badge="P1" code={`<ThemeCustomizer dark={dark} onDarkChange={setDark} preset={preset} onPresetChange={setPreset} />`}>
        <ThemeCustomizer
          dark={dark}
          onDarkChange={(next) => {
            setDark(next);
            document.documentElement.classList.toggle("dark", next);
          }}
          preset={brandTheme}
          onPresetChange={setBrandTheme}
        />
      </ComponentPreview>
    ),
  };

  const visibleItems = activeItem
    ? [activeItem]
    : CATALOG.filter((item) => item.group === activeGroup);

  const header = (
    <>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">ChillUIKit</span>
        <span>/</span>
        <span className="capitalize">{activeGroup}</span>
        {activeItem && (
          <>
            <span>/</span>
            <span className="font-medium text-foreground">{activeItem.name}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-1" title="Brand Theme Preset">
          {(
            [
              { id: "neutral", color: "bg-zinc-900 dark:bg-zinc-100" },
              { id: "indigo", color: "bg-indigo-600" },
              { id: "emerald", color: "bg-emerald-600" },
              { id: "rose", color: "bg-rose-600" },
              { id: "amber", color: "bg-amber-500" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Theme ${t.id}`}
              onClick={() => {
                setBrandTheme(t.id);
                if (t.id === "neutral") delete document.documentElement.dataset.theme;
                else document.documentElement.dataset.theme = t.id;
              }}
              className={`h-3.5 w-3.5 rounded-full cursor-pointer transition-transform ${t.color} ${
                brandTheme === t.id ? "ring-2 ring-ring ring-offset-1 scale-110" : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setStudioMode(true)} className="gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Studio</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCmdOpen(true)} className="gap-2 text-muted-foreground">
          <Command className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search components...</span>
          <Kbd>⌘K</Kbd>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="h-8 w-8">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );

  if (demoMode) {
    return (
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
            Loading Demo App...
          </div>
        }
      >
        <ExpenseDemoApp onExit={() => setDemoMode(false)} />
      </Suspense>
    );
  }

  if (studioMode) {
    return (
      <TooltipProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
              Loading ChillStudio...
            </div>
          }
        >
          <ChillStudio onExit={() => setStudioMode(false)} />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <AppShell
        brand="ChillUIKit"
        sidebar={
          <ShowcaseSidebar
            items={CATALOG}
            activeGroup={activeGroup}
            activeItemId={activeItem?.id}
            onSelectOverview={() => selectGroup("overview")}
            onSelectTokens={() => selectGroup("tokens")}
            onSelectGroup={selectGroup}
            onSelectItem={selectItem}
            onOpenSearch={() => setCmdOpen(true)}
          />
        }
        header={header}
      >
        <PageContainer>
          {activeGroup === "overview" && (
            <>
              <div className="rounded-xl border border-border bg-surface/60 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v0.4.0</Badge>
                  <Badge variant="success">Vibecoding Ready</Badge>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  ChillUIKit Design System
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Open-code React + TypeScript + Tailwind v4 component kit with a unified App Shell,
                  W3C DTCG design tokens, AI-native blocks, and SaaS screens.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button onClick={() => setStudioMode(true)}>Open ChillStudio</Button>
                  <Button variant="outline" onClick={() => setDemoMode(true)}>Live Demo App</Button>
                  <Button variant="outline" onClick={() => selectGroup("Actions")}>Explore Components</Button>
                  <Button variant="outline" onClick={() => selectGroup("AI & Agentic")}>AI & Agentic Blocks</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard title="Catalog Components" value={CATALOG.length} delta="P0+P1+P2+AI" trend="up" icon={<Blocks />} />
                <StatCard title="Layout & Screens" value="13" delta="Responsive" trend="neutral" icon={<Layers />} />
                <StatCard title="AI & Agentic" value="9" delta="MCP Ready" trend="up" icon={<Activity />} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>Import directly from @/components/ui, @/components/layout, @/components/ai, or @/components/screens</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    code={`import { AppShell, PageContainer, PageHeader } from "@/components/layout";\nimport { Button, Chart, DataTable, HoldButton } from "@/components/ui";\nimport { PromptInput, ContextWindow, ToolCallCard } from "@/components/ai";\nimport { SettingsLayout, NotificationCenter } from "@/components/screens";`}
                  />
                </CardContent>
              </Card>
            </>
          )}

          {activeGroup === "tokens" && (
            <>
              <PageHeader title="Design Tokens" description="Semantic OKLCH CSS variables defined in src/styles/tokens.css and tokens/." />
              <ThemeCustomizer
                dark={dark}
                onDarkChange={(next) => {
                  setDark(next);
                  document.documentElement.classList.toggle("dark", next);
                }}
                preset={brandTheme}
                onPresetChange={setBrandTheme}
              />
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {[
                  { name: "background", cls: "bg-background" },
                  { name: "surface", cls: "bg-surface" },
                  { name: "muted", cls: "bg-muted" },
                  { name: "primary", cls: "bg-primary" },
                  { name: "success", cls: "bg-success" },
                  { name: "warning", cls: "bg-warning" },
                  { name: "destructive", cls: "bg-destructive" },
                  { name: "ring", cls: "bg-ring" },
                ].map((t) => (
                  <Card key={t.name}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={`h-8 w-8 rounded-md border border-border ${t.cls}`} />
                      <span className="font-mono text-xs">--{t.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeGroup !== "overview" && activeGroup !== "tokens" && (
            <>
              <PageHeader
                title={activeItem ? activeItem.name : activeGroup}
                description={
                  activeItem
                    ? `${activeItem.group} · Tier ${activeItem.tier}`
                    : `${visibleItems.length} components in ${activeGroup}`
                }
                actions={
                  activeItem && (
                    <Button variant="outline" size="sm" onClick={() => setActiveItem(null)}>
                      View all {activeGroup}
                    </Button>
                  )
                }
              />
              <div className="space-y-6">
                {activeGroup === "Enterprise" ? (
                  <Suspense fallback={<div className="py-8 text-center text-xs text-muted-foreground">Loading Enterprise...</div>}>
                    <EnterpriseShowcase activeItemId={activeItem?.id} />
                  </Suspense>
                ) : activeGroup === "Templates" ? (
                  <Suspense fallback={<div className="py-8 text-center text-xs text-muted-foreground">Loading Templates...</div>}>
                    <TemplatesShowcase activeItemId={activeItem?.id} />
                  </Suspense>
                ) : (
                  visibleItems.map((item) => (
                    <div key={item.id}>{previews[item.id]}</div>
                  ))
                )}
              </div>
            </>
          )}
        </PageContainer>
      </AppShell>

      <CommandPalette items={commands} open={cmdOpen} onOpenChange={setCmdOpen} />
      <Toaster />
    </TooltipProvider>
  );
}
