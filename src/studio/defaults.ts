import type {
  BlockSpan,
  LayoutStyle,
  StarterTemplateId,
  StudioBlock,
  StudioBlockProps,
  StudioBlockType,
  StudioProject,
} from "@/studio/types";

export interface PaletteItem {
  type: StudioBlockType;
  label: string;
  group:
    | "Containers"
    | "Layout & Nav"
    | "Forms & Inputs"
    | "Data & Charts"
    | "Views & Boards"
    | "AI & Agentic";
  defaultSpan: BlockSpan;
  defaultLayout?: Partial<LayoutStyle>;
  defaultProps: StudioBlockProps;
}

export const PALETTE_ITEMS: PaletteItem[] = [
  // Containers (Open Auto-Layout)
  {
    type: "frame",
    label: "Frame (Auto-Layout)",
    group: "Containers",
    defaultSpan: 3,
    defaultLayout: { display: "flex", direction: "col", gap: 3, padding: 4, width: "fill", surface: "transparent", border: "none", radius: "md" },
    defaultProps: { title: "Frame" },
  },
  {
    type: "container-row",
    label: "Row (Horizontal)",
    group: "Containers",
    defaultSpan: 3,
    defaultLayout: { display: "flex", direction: "row", align: "center", justify: "start", gap: 3, padding: 2, width: "fill", wrap: true },
    defaultProps: { title: "Row" },
  },
  {
    type: "container-col",
    label: "Column (Vertical)",
    group: "Containers",
    defaultSpan: 1,
    defaultLayout: { display: "flex", direction: "col", align: "stretch", gap: 3, padding: 2, width: "fill" },
    defaultProps: { title: "Column" },
  },
  {
    type: "header-bar",
    label: "Header Bar",
    group: "Containers",
    defaultSpan: 3,
    defaultLayout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 3, width: "fill", surface: "surface", border: "b" },
    defaultProps: { title: "Header Bar" },
  },
  {
    type: "sidebar",
    label: "Sidebar",
    group: "Containers",
    defaultSpan: 1,
    defaultLayout: { display: "flex", direction: "col", align: "stretch", gap: 2, padding: 3, width: "fixed", fixedWidth: 240, surface: "surface", border: "r" },
    defaultProps: { title: "Sidebar" },
  },
  {
    type: "card-frame",
    label: "Card",
    group: "Containers",
    defaultSpan: 2,
    defaultLayout: { display: "flex", direction: "col", gap: 3, padding: 4, width: "fill", surface: "surface", border: "all", radius: "lg", shadow: "xs" },
    defaultProps: { title: "Card", subtitle: "" },
  },
  {
    type: "section-grid",
    label: "Grid Container",
    group: "Containers",
    defaultSpan: 3,
    defaultLayout: { display: "grid", gridCols: 3, gap: 4, padding: 0, width: "fill" },
    defaultProps: { title: "Grid", columns: 3 },
  },

  // Layout & Nav
  {
    type: "text",
    label: "Text / Heading",
    group: "Layout & Nav",
    defaultSpan: 1,
    defaultLayout: { width: "hug" },
    defaultProps: { title: "Section Heading", variant: "default" },
  },
  {
    type: "badge",
    label: "Badge / Pill",
    group: "Layout & Nav",
    defaultSpan: 1,
    defaultLayout: { width: "hug" },
    defaultProps: { title: "Active", variant: "secondary" },
  },
  {
    type: "statusbar",
    label: "Statusbar",
    group: "Layout & Nav",
    defaultSpan: 3,
    defaultLayout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 2, padding: 2, width: "fill", surface: "muted", radius: "md", border: "all" },
    defaultProps: { title: "Statusbar", buttonLabel: "Confirm", itemsText: "Draft\nConfirmed\nDone" },
  },
  {
    type: "page-header",
    label: "Page Header",
    group: "Layout & Nav",
    defaultSpan: 3,
    defaultLayout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 0, width: "fill" },
    defaultProps: { title: "Page Title", subtitle: "Manage your records here.", buttonLabel: "New Item" },
  },
  { type: "filter-bar", label: "Filter Bar", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Search...", badge: "Status: Active" } },
  { type: "breadcrumb", label: "Breadcrumb", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { width: "hug" }, defaultProps: { title: "Breadcrumb", itemsText: "Home\nProjects\nCurrent Page" } },
  { type: "smart-button", label: "Smart Buttons", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Quick Stats", itemsText: "Tasks: 12\nInvoices: $4.2k\nUptime: 99.9%" } },
  { type: "form-sheet", label: "Form Sheet (Odoo)", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { display: "flex", direction: "col", gap: 4, padding: 5 as 4, width: "fill", surface: "surface", border: "all", radius: "lg" }, defaultProps: { title: "SO-2026-001", subtitle: "Customer: Nhadaungocnay Corp", buttonLabel: "Confirm", itemsText: "Order Reference\nCustomer\nOwner\nDue Date" } },
  { type: "detail-view", label: "Detail View", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Record Detail", subtitle: "Updated 2h ago", badge: "In Progress", buttonLabel: "Save", itemsText: "Status: Active\nPriority: High\nOwner: Dang TB" } },

  // Forms & Inputs
  { type: "button", label: "Button", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "hug" }, defaultProps: { title: "Save Changes", variant: "default" } },
  { type: "input", label: "Input", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Project Name", placeholder: "Enter name..." } },
  { type: "textarea", label: "Textarea", group: "Forms & Inputs", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Description", placeholder: "Write details..." } },
  { type: "select", label: "Select", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Status", itemsText: "Active\nPending\nArchived" } },
  { type: "multi-select", label: "MultiSelect", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Tags", itemsText: "UI\nDesign\nFrontend\nAPI" } },
  { type: "date-picker", label: "Date Picker", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Due Date", placeholder: "Pick a date" } },
  { type: "checkbox", label: "Checkbox", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "hug" }, defaultProps: { title: "Enable notifications" } },
  { type: "switch", label: "Switch", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "hug" }, defaultProps: { title: "Auto-save changes" } },
  { type: "file-upload", label: "File Upload", group: "Forms & Inputs", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Attachments", subtitle: "Drop files or click to browse" } },
  { type: "markdown", label: "Markdown", group: "Forms & Inputs", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Release Notes", value: "## Highlights\n- Faster builds\n- Semantic tokens" } },

  // Data & Charts
  { type: "stat-card", label: "Stat Card", group: "Data & Charts", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Monthly Revenue", value: "$48,290", badge: "+14.2%", variant: "success" } },
  { type: "chart", label: "Chart", group: "Data & Charts", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Revenue Trend", subtitle: "Last 6 months", itemsText: "Jan: 120\nFeb: 180\nMar: 150\nApr: 240\nMay: 290\nJun: 340" } },
  { type: "usage-meter", label: "Usage Meter", group: "Data & Charts", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "API Quota", value: "74", subtitle: "74,000 / 100,000 requests" } },
  { type: "uptime-bar", label: "Uptime Bar", group: "Data & Charts", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Core API Uptime", badge: "99.98%", variant: "success" } },
  { type: "property-list", label: "Property List", group: "Data & Charts", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Metadata", itemsText: "Owner: Dang TB\nEnvironment: Production\nRegion: ap-southeast-1" } },
  { type: "timeline", label: "Timeline", group: "Data & Charts", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Activity", itemsText: "Deployed v2.4\nMerged PR #142\nUpdated tokens" } },
  { type: "stepper", label: "Stepper", group: "Data & Charts", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Onboarding", itemsText: "Account\nWorkspace\nInvite Team\nLaunch" } },
  { type: "alert", label: "Alert", group: "Data & Charts", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Heads up!", subtitle: "Your trial ends in 5 days.", variant: "warning" } },
  { type: "code-block", label: "Code Block", group: "Data & Charts", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Install CLI", value: "npx chilluikit init" } },
  { type: "comment-thread", label: "Comment Thread", group: "Data & Charts", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Discussion", itemsText: "Alex: Looks clean!\nMia: Ready to ship." } },
  { type: "audit-log", label: "Audit Log", group: "Data & Charts", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Change History" } },
  { type: "data-comparison", label: "Data Comparison", group: "Data & Charts", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Record Diff" } },
  { type: "watcher-widget", label: "Watcher Widget", group: "Layout & Nav", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Watchers" } },
  { type: "collapsible-card", label: "Collapsible Card", group: "Containers", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Additional Details", badge: "3 items" } },
  { type: "language-switcher", label: "Language Switcher", group: "Layout & Nav", defaultSpan: 1, defaultLayout: { width: "hug" }, defaultProps: { title: "Language" } },
  { type: "currency-input", label: "Currency Input", group: "Forms & Inputs", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Amount", value: "2500000" } },
  { type: "editable-line-items", label: "Line Items Table", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Expense Line Items" } },
  { type: "attachment-manager", label: "Attachment Manager", group: "Forms & Inputs", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Attachments" } },
  { type: "excel-toolbar", label: "Excel Toolbar", group: "Layout & Nav", defaultSpan: 2, defaultLayout: { width: "hug" }, defaultProps: { title: "Excel Actions" } },
  { type: "query-builder", label: "Query Builder", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Approval Rules" } },
  { type: "dynamic-filter", label: "Dynamic Filter", group: "Layout & Nav", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Dynamic Filters" } },

  // Views & Boards
  { type: "data-table", label: "Data Table", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Recent Orders", itemsText: "Order\nCustomer\nAmount\nStatus" } },
  { type: "data-grid", label: "Data Grid", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Customers", columns: 3, itemsText: "Acme Corp\nGlobex\nInitech" } },
  { type: "kanban", label: "Kanban Board", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Sprint Board", itemsText: "Backlog\nIn Progress\nReview\nDone" } },
  { type: "gantt", label: "Gantt Chart", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Roadmap Q4", itemsText: "Design System\nStudio Builder\nCLI Release" } },
  { type: "calendar", label: "Calendar View", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Release Schedule" } },
  { type: "tree-table", label: "Tree Table", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "File Explorer", itemsText: "src/components\nsrc/styles\nsrc/studio" } },
  { type: "gallery-grid", label: "Gallery Grid", group: "Views & Boards", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Templates", columns: 3, itemsText: "SaaS Dashboard\nCRM Pipeline\nAI Copilot" } },

  // AI & Agentic
  { type: "prompt-input", label: "Prompt Input", group: "AI & Agentic", defaultSpan: 3, defaultLayout: { width: "fill" }, defaultProps: { title: "Ask AI", placeholder: "Describe what you want to build..." } },
  { type: "approval-card", label: "Approval Card", group: "AI & Agentic", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Deploy to Production?", subtitle: "Agent wants to run build & deploy", buttonLabel: "Approve" } },
  { type: "execution-steps", label: "Execution Steps", group: "AI & Agentic", defaultSpan: 2, defaultLayout: { width: "fill" }, defaultProps: { title: "Agent Plan", itemsText: "Analyze schema\nGenerate components\nRun typecheck" } },
  { type: "context-window", label: "Context Window", group: "AI & Agentic", defaultSpan: 1, defaultLayout: { width: "fill" }, defaultProps: { title: "Token Budget", value: "42", subtitle: "42k / 128k tokens" } },
];

let uid = 1;
function id(prefix = "blk") {
  uid += 1;
  return `${prefix}-${uid}-${Math.random().toString(36).slice(2, 5)}`;
}

export const STARTER_TEMPLATES: {
  id: StarterTemplateId;
  label: string;
  description: string;
  createBlocks: () => StudioBlock[];
}[] = [
  {
    id: "blank",
    label: "Blank Canvas",
    description: "Empty Auto-Layout page ready for your own frames.",
    createBlocks: () => [],
  },
  {
    id: "app-shell",
    label: "App Shell",
    description: "Sidebar + Header Bar (with Statusbar) + Main Content.",
    createBlocks: () => [
      {
        id: id(),
        type: "container-row",
        layout: { display: "flex", direction: "row", align: "stretch", gap: 0, padding: 0, width: "fill", height: "fill", surface: "background" },
        props: { title: "App Shell" },
        children: [
          {
            id: id(),
            type: "sidebar",
            layout: { display: "flex", direction: "col", align: "stretch", gap: 2, padding: 3, width: "fixed", fixedWidth: 220, surface: "surface", border: "r" },
            props: { title: "Sidebar" },
            children: [
              { id: id(), type: "text", layout: { width: "fill" }, props: { title: "ChillApp", variant: "default" } },
              { id: id(), type: "button", layout: { width: "fill" }, props: { title: "Overview", variant: "secondary" } },
              { id: id(), type: "button", layout: { width: "fill" }, props: { title: "Projects", variant: "outline" } },
              { id: id(), type: "button", layout: { width: "fill" }, props: { title: "Settings", variant: "outline" } },
            ],
          },
          {
            id: id(),
            type: "container-col",
            layout: { display: "flex", direction: "col", align: "stretch", gap: 0, padding: 0, width: "fill" },
            props: { title: "Main Column" },
            children: [
              {
                id: id(),
                type: "header-bar",
                layout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 3, width: "fill", surface: "surface", border: "b" },
                props: { title: "Header Bar" },
                children: [
                  { id: id(), type: "text", layout: { width: "hug" }, props: { title: "Sales Orders", variant: "default" } },
                  {
                    id: id(),
                    type: "statusbar",
                    layout: { display: "flex", direction: "row", align: "center", gap: 2, padding: 2, width: "hug", surface: "muted", radius: "md", border: "all" },
                    props: { title: "Statusbar" },
                    children: [
                      { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Draft", variant: "outline" } },
                      { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Confirmed", variant: "success" } },
                      { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Publish", variant: "default" } },
                    ],
                  },
                ],
              },
              {
                id: id(),
                type: "frame",
                layout: { display: "flex", direction: "col", gap: 4, padding: 4, width: "fill" },
                props: { title: "Content Area" },
                children: [
                  {
                    id: id(),
                    type: "section-grid",
                    layout: { display: "grid", gridCols: 3, gap: 4, padding: 0, width: "fill" },
                    props: { title: "KPIs", columns: 3 },
                    children: [
                      { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Total Revenue", value: "$48,290", badge: "+14.2%", variant: "success" } },
                      { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Active Users", value: "2,480", badge: "+6.1%", variant: "default" } },
                      { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Conversion", value: "4.8%", badge: "+0.4%", variant: "secondary" } },
                    ],
                  },
                  { id: id(), type: "data-table", layout: { width: "fill" }, props: { title: "Recent Orders", itemsText: "Order\nCustomer\nAmount\nStatus" } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Header + 3-column KPI grid + Chart + Table.",
    createBlocks: () => [
      {
        id: id(),
        type: "frame",
        layout: { display: "flex", direction: "col", gap: 4, padding: 4, width: "fill" },
        props: { title: "Dashboard" },
        children: [
          {
            id: id(),
            type: "header-bar",
            layout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 3, width: "fill", surface: "surface", border: "all", radius: "lg" },
            props: { title: "Header" },
            children: [
              { id: id(), type: "text", layout: { width: "hug" }, props: { title: "Analytics Overview" } },
              { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Export Report", variant: "default" } },
            ],
          },
          {
            id: id(),
            type: "section-grid",
            layout: { display: "grid", gridCols: 3, gap: 4, padding: 0, width: "fill" },
            props: { title: "Stats Grid", columns: 3 },
            children: [
              { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "MRR", value: "$48,290", badge: "+14%", variant: "success" } },
              { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Churn", value: "1.2%", badge: "-0.3%", variant: "secondary" } },
              { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "NPS", value: "72", badge: "+4", variant: "default" } },
            ],
          },
          { id: id(), type: "chart", layout: { width: "fill" }, props: { title: "Revenue Trend", subtitle: "Last 6 months", itemsText: "Jan: 120\nFeb: 180\nMar: 150\nApr: 240\nMay: 290\nJun: 340" } },
        ],
      },
    ],
  },
  {
    id: "detail-2-1",
    label: "Detail View (2:1)",
    description: "2/3 main content (line items, comments) + 1/3 aside (audit log, attachments, watchers).",
    createBlocks: () => [
      {
        id: id(),
        type: "frame",
        layout: { display: "flex", direction: "col", gap: 4, padding: 4, width: "fill" },
        props: { title: "Detail Page" },
        children: [
          {
            id: id(),
            type: "header-bar",
            layout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 3, width: "fill", surface: "surface", border: "all", radius: "lg" },
            props: { title: "Record Header" },
            children: [
              { id: id(), type: "text", layout: { width: "hug" }, props: { title: "PC-2026-089 • Công tác phí" } },
              {
                id: id(),
                type: "statusbar",
                layout: { display: "flex", direction: "row", align: "center", gap: 2, padding: 2, width: "hug", surface: "muted", radius: "md", border: "all" },
                props: { title: "Statusbar" },
                children: [
                  { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Chờ duyệt", variant: "secondary" } },
                  { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Phê duyệt", variant: "default" } },
                ],
              },
            ],
          },
          {
            id: id(),
            type: "section-grid",
            layout: { display: "grid", gridRatio: "2:1", gap: 4, padding: 0, width: "fill" },
            props: { title: "2:1 Detail Split" },
            children: [
              {
                id: id(),
                type: "container-col",
                layout: { display: "flex", direction: "col", gap: 4, padding: 0, width: "fill" },
                props: { title: "Main (2/3)" },
                children: [
                  { id: id(), type: "editable-line-items", layout: { width: "fill" }, props: { title: "Chi tiết khoản chi" } },
                  { id: id(), type: "comment-thread", layout: { width: "fill" }, props: { title: "Thảo luận", itemsText: "Kế toán: Đã kiểm tra chứng từ.\nTrưởng phòng: Đồng ý chi." } },
                ],
              },
              {
                id: id(),
                type: "container-col",
                layout: { display: "flex", direction: "col", gap: 4, padding: 0, width: "fill" },
                props: { title: "Aside (1/3)" },
                children: [
                  { id: id(), type: "watcher-widget", layout: { width: "fill" }, props: { title: "Watchers" } },
                  { id: id(), type: "attachment-manager", layout: { width: "fill" }, props: { title: "Chứng từ" } },
                  { id: id(), type: "audit-log", layout: { width: "fill" }, props: { title: "Lịch sử" } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    description: "Clean settings form inside a Card container.",
    createBlocks: () => [
      {
        id: id(),
        type: "frame",
        layout: { display: "flex", direction: "col", gap: 4, padding: 6, width: "fill" },
        props: { title: "Settings Page" },
        children: [
          { id: id(), type: "text", layout: { width: "hug" }, props: { title: "Workspace Settings" } },
          {
            id: id(),
            type: "card-frame",
            layout: { display: "flex", direction: "col", gap: 4, padding: 4, width: "fill", surface: "surface", border: "all", radius: "lg", shadow: "xs" },
            props: { title: "General" },
            children: [
              { id: id(), type: "input", layout: { width: "fill" }, props: { title: "Workspace Name", placeholder: "Acme Inc." } },
              { id: id(), type: "switch", layout: { width: "hug" }, props: { title: "Enable AI Copilot" } },
              { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Save Settings", variant: "default" } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "auth",
    label: "Auth / Login",
    description: "Centered login card with email, password & submit.",
    createBlocks: () => [
      {
        id: id(),
        type: "frame",
        layout: { display: "flex", direction: "col", align: "center", justify: "center", gap: 4, padding: 8, width: "fill" },
        props: { title: "Auth Wrapper" },
        children: [
          {
            id: id(),
            type: "card-frame",
            layout: { display: "flex", direction: "col", gap: 3, padding: 6, width: "fixed", fixedWidth: 380, surface: "surface", border: "all", radius: "xl", shadow: "sm" },
            props: { title: "Sign In" },
            children: [
              { id: id(), type: "text", layout: { width: "hug" }, props: { title: "Welcome back" } },
              { id: id(), type: "input", layout: { width: "fill" }, props: { title: "Email", placeholder: "you@company.com" } },
              { id: id(), type: "input", layout: { width: "fill" }, props: { title: "Password", placeholder: "••••••••" } },
              { id: id(), type: "button", layout: { width: "fill" }, props: { title: "Sign In", variant: "default" } },
            ],
          },
        ],
      },
    ],
  },
];

function createExpenseShell(
  activeMenu: "Tổng quan" | "Tạo phiếu chi" | "Phê duyệt" | "Ngân sách",
  headerTitle: string,
  statusChildren: StudioBlock[],
  contentChildren: StudioBlock[]
): StudioBlock[] {
  const menus: Array<"Tổng quan" | "Tạo phiếu chi" | "Phê duyệt" | "Ngân sách"> = [
    "Tổng quan",
    "Tạo phiếu chi",
    "Phê duyệt",
    "Ngân sách",
  ];
  return [
    {
      id: id(),
      type: "container-row",
      layout: { display: "flex", direction: "row", align: "stretch", gap: 0, padding: 0, width: "fill", height: "fill", surface: "background" },
      props: { title: "Expense Shell" },
      children: [
        {
          id: id(),
          type: "sidebar",
          layout: { display: "flex", direction: "col", align: "stretch", gap: 2, padding: 3, width: "fixed", fixedWidth: 220, surface: "surface", border: "r" },
          props: { title: "Sidebar" },
          children: [
            { id: id(), type: "text", layout: { width: "fill" }, props: { title: "ChillExpense", variant: "default" } },
            ...menus.map((m) => ({
              id: id(),
              type: "button" as const,
              layout: { width: "fill" as const },
              props: { title: m, variant: m === activeMenu ? ("secondary" as const) : ("outline" as const) },
            })),
          ],
        },
        {
          id: id(),
          type: "container-col",
          layout: { display: "flex", direction: "col", align: "stretch", gap: 0, padding: 0, width: "fill" },
          props: { title: "Main Column" },
          children: [
            {
              id: id(),
              type: "header-bar",
              layout: { display: "flex", direction: "row", align: "center", justify: "between", gap: 3, padding: 3, width: "fill", surface: "surface", border: "b" },
              props: { title: "Header Bar" },
              children: [
                { id: id(), type: "text", layout: { width: "hug" }, props: { title: headerTitle, variant: "default" } },
                {
                  id: id(),
                  type: "statusbar",
                  layout: { display: "flex", direction: "row", align: "center", gap: 2, padding: 2, width: "hug", surface: "muted", radius: "md", border: "all" },
                  props: { title: "Statusbar" },
                  children: statusChildren,
                },
              ],
            },
            {
              id: id(),
              type: "frame",
              layout: { display: "flex", direction: "col", gap: 4, padding: 4, width: "fill" },
              props: { title: "Content Area" },
              children: contentChildren,
            },
          ],
        },
      ],
    },
  ];
}

export const DEFAULT_PROJECTS: StudioProject[] = [
  {
    id: "proj-expense",
    name: "Quản lý Chi phí Nội bộ",
    pages: [
      {
        id: "page-exp-overview",
        name: "Tổng quan",
        blocks: createExpenseShell(
          "Tổng quan",
          "Tổng quan Chi phí Nội bộ",
          [
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Kỳ 11/2026", variant: "outline" } },
            { id: id(), type: "button", layout: { width: "hug" }, props: { title: "+ Tạo phiếu chi", variant: "default" } },
          ],
          [
            {
              id: id(),
              type: "section-grid",
              layout: { display: "grid", gridCols: 4, gap: 3, padding: 0, width: "fill" },
              props: { title: "KPI Chi phí", columns: 3 },
              children: [
                { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Tổng chi tháng", value: "148.5M ₫", badge: "+8.2%", variant: "default" } },
                { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Chờ phê duyệt", value: "12 phiếu", badge: "34.2M ₫", variant: "warning" } },
                { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Ngân sách còn lại", value: "51.5M ₫", badge: "25.7%", variant: "success" } },
                { id: id(), type: "stat-card", layout: { width: "fill" }, props: { title: "Tỷ lệ hợp lệ", value: "96.4%", badge: "+1.8%", variant: "secondary" } },
              ],
            },
            {
              id: id(),
              type: "section-grid",
              layout: { display: "grid", gridCols: 2, gap: 4, padding: 0, width: "fill" },
              props: { title: "Biểu đồ & Hạn mức", columns: 2 },
              children: [
                { id: id(), type: "chart", layout: { width: "fill" }, props: { title: "Chi phí 6 tháng gần nhất (Triệu ₫)", subtitle: "Theo kỳ kế toán", itemsText: "T6: 112\nT7: 128\nT8: 119\nT9: 142\nT10: 137\nT11: 148" } },
                { id: id(), type: "usage-meter", layout: { width: "fill" }, props: { title: "Hạn mức chi tiêu tháng 11", value: "74", subtitle: "148.5M / 200M ₫" } },
              ],
            },
            { id: id(), type: "data-table", layout: { width: "fill" }, props: { title: "Phiếu chi gần đây", itemsText: "Mã phiếu\nNhân viên\nDanh mục\nSố tiền\nTrạng thái" } },
          ]
        ),
      },
      {
        id: "page-exp-create",
        name: "Tạo phiếu chi",
        blocks: createExpenseShell(
          "Tạo phiếu chi",
          "Tạo phiếu đề nghị thanh toán",
          [
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Nháp", variant: "outline" } },
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Chờ duyệt", variant: "secondary" } },
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Đã chi", variant: "success" } },
            { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Gửi duyệt", variant: "default" } },
          ],
          [
            {
              id: id(),
              type: "card-frame",
              layout: { display: "flex", direction: "col", gap: 4, padding: 6, width: "fill", surface: "surface", border: "all", radius: "lg", shadow: "xs" },
              props: { title: "Thông tin phiếu chi" },
              children: [
                {
                  id: id(),
                  type: "section-grid",
                  layout: { display: "grid", gridCols: 2, gap: 4, padding: 0, width: "fill" },
                  props: { title: "Trường nhập liệu", columns: 2 },
                  children: [
                    { id: id(), type: "input", layout: { width: "fill" }, props: { title: "Tiêu đề khoản chi", placeholder: "VD: Tiếp khách đối tác Q4" } },
                    { id: id(), type: "select", layout: { width: "fill" }, props: { title: "Danh mục chi phí", itemsText: "Công tác phí\nTiếp khách\nPhần mềm & Cloud\nVăn phòng phẩm\nĐào tạo" } },
                    { id: id(), type: "input", layout: { width: "fill" }, props: { title: "Số tiền (VNĐ)", placeholder: "2,500,000" } },
                    { id: id(), type: "date-picker", layout: { width: "fill" }, props: { title: "Ngày phát sinh", placeholder: "Chọn ngày..." } },
                  ],
                },
                { id: id(), type: "textarea", layout: { width: "fill" }, props: { title: "Diễn giải / Ghi chú", placeholder: "Nhập lý do chi và mã dự án liên quan..." } },
                { id: id(), type: "file-upload", layout: { width: "fill" }, props: { title: "Hóa đơn & Chứng từ đính kèm", subtitle: "Kéo thả ảnh hóa đơn VAT hoặc PDF vào đây" } },
                {
                  id: id(),
                  type: "container-row",
                  layout: { display: "flex", direction: "row", justify: "end", align: "center", gap: 2, padding: 0, width: "fill" },
                  props: { title: "Hành động" },
                  children: [
                    { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Lưu nháp", variant: "outline" } },
                    { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Gửi phê duyệt", variant: "default" } },
                  ],
                },
              ],
            },
          ]
        ),
      },
      {
        id: "page-exp-approve",
        name: "Phê duyệt",
        blocks: createExpenseShell(
          "Phê duyệt",
          "Hàng đợi phê duyệt",
          [
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "12 chờ duyệt", variant: "warning" } },
            { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Duyệt hàng loạt", variant: "default" } },
          ],
          [
            { id: id(), type: "filter-bar", layout: { width: "fill" }, props: { title: "Tìm theo mã phiếu, nhân viên...", badge: "Phòng ban: Tất cả" } },
            {
              id: id(),
              type: "section-grid",
              layout: { display: "grid", gridCols: 2, gap: 4, padding: 0, width: "fill" },
              props: { title: "Phiếu chờ duyệt", columns: 2 },
              children: [
                { id: id(), type: "approval-card", layout: { width: "fill" }, props: { title: "PC-2026-089 • 4,200,000 ₫", subtitle: "Nguyễn Minh • Công tác phí Hà Nội", buttonLabel: "Phê duyệt" } },
                { id: id(), type: "approval-card", layout: { width: "fill" }, props: { title: "PC-2026-090 • 12,800,000 ₫", subtitle: "Trần Lan • Gia hạn AWS & Figma", buttonLabel: "Phê duyệt" } },
              ],
            },
            {
              id: id(),
              type: "section-grid",
              layout: { display: "grid", gridCols: 2, gap: 4, padding: 0, width: "fill" },
              props: { title: "Trao đổi & Lịch sử", columns: 2 },
              children: [
                { id: id(), type: "comment-thread", layout: { width: "fill" }, props: { title: "Trao đổi kế toán", itemsText: "Kế toán: Đã kiểm tra hóa đơn VAT hợp lệ.\nTrưởng phòng: Đồng ý chi theo ngân sách Q4." } },
                { id: id(), type: "timeline", layout: { width: "fill" }, props: { title: "Lịch sử xử lý", itemsText: "09:15 • Tạo phiếu PC-2026-089\n09:40 • Kế toán xác nhận chứng từ\n10:05 • Chờ Giám đốc duyệt" } },
              ],
            },
          ]
        ),
      },
      {
        id: "page-exp-budget",
        name: "Ngân sách",
        blocks: createExpenseShell(
          "Ngân sách",
          "Ngân sách theo Phòng ban",
          [
            { id: id(), type: "badge", layout: { width: "hug" }, props: { title: "Q4 / 2026", variant: "outline" } },
            { id: id(), type: "button", layout: { width: "hug" }, props: { title: "Điều chỉnh hạn mức", variant: "outline" } },
          ],
          [
            { id: id(), type: "alert", layout: { width: "fill" }, props: { title: "Cảnh báo ngưỡng ngân sách", subtitle: "Phòng Kinh doanh đã sử dụng 88% hạn mức tiếp khách tháng 11.", variant: "warning" } },
            {
              id: id(),
              type: "section-grid",
              layout: { display: "grid", gridCols: 3, gap: 4, padding: 0, width: "fill" },
              props: { title: "Hạn mức phòng ban", columns: 3 },
              children: [
                { id: id(), type: "usage-meter", layout: { width: "fill" }, props: { title: "Phòng Kỹ thuật (Cloud/AI)", value: "62", subtitle: "49.6M / 80M ₫" } },
                { id: id(), type: "usage-meter", layout: { width: "fill" }, props: { title: "Phòng Kinh doanh", value: "88", subtitle: "52.8M / 60M ₫" } },
                { id: id(), type: "usage-meter", layout: { width: "fill" }, props: { title: "Vận hành & Nhân sự", value: "45", subtitle: "27M / 60M ₫" } },
              ],
            },
            { id: id(), type: "property-list", layout: { width: "fill" }, props: { title: "Chính sách chi tiêu nội bộ", itemsText: "Hạn mức tự duyệt: Dưới 2,000,000 ₫\nCần hóa đơn VAT: Mọi khoản từ 200,000 ₫\nChu kỳ thanh toán: Thứ 5 hàng tuần" } },
          ]
        ),
      },
    ],
  },
  {
    id: "proj-saas",
    name: "SaaS Workspace",
    pages: [
      {
        id: "page-home",
        name: "App Shell",
        blocks: STARTER_TEMPLATES.find((t) => t.id === "app-shell")!.createBlocks(),
      },
    ],
  },
];
