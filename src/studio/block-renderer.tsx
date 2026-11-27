import { Fragment } from "react";
import { Activity, AlertCircle, Blocks } from "lucide-react";
import {
  ApprovalCard,
  ContextWindow,
  ExecutionSteps,
  PromptInput,
} from "@/components/ai";
import {
  FilterBar,
  FormSheet,
  PageHeader,
  SectionGrid,
  SmartButton,
  SmartButtonGroup,
  Statusbar,
} from "@/components/layout";
import {
  CalendarView,
  DataGridView,
  DetailView,
  GalleryGrid,
  GanttChart,
  KanbanBoard,
  TreeTable,
} from "@/components/screens";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AttachmentManager,
  AuditLog,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Chart,
  Checkbox,
  CodeBlock,
  CollapsibleCard,
  CommentThread,
  CurrencyInput,
  DataComparison,
  DataTable,
  DatePicker,
  DynamicFilter,
  EditableLineItemsTable,
  ExcelToolbar,
  FileUpload,
  FormField,
  Input,
  LanguageSwitcher,
  MarkdownEditor,
  MultiSelect,
  PropertyList,
  QueryBuilder,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCard,
  WatcherWidget,
  Stepper,
  Switch,
  Textarea,
  Timeline,
  TimelineItem,
  UptimeBar,
  UsageMeter,
} from "@/components/ui";
import type { StudioBlock } from "@/studio/types";

function parseLines(text?: string, fallback: string[] = []): string[] {
  const lines = (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : fallback;
}

function parsePairs(text?: string, fallback: [string, string][] = []): [string, string][] {
  const lines = parseLines(text);
  if (lines.length === 0) return fallback;
  return lines.map((l) => {
    const idx = l.indexOf(":");
    if (idx === -1) return [l, "—"];
    return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
  });
}

export function BlockRenderer({
  block,
  renderChildren,
}: {
  block: StudioBlock;
  renderChildren?: React.ReactNode;
}) {
  const { props } = block;

  switch (block.type) {
    case "frame":
    case "container-row":
    case "container-col":
    case "header-bar":
    case "sidebar":
    case "card-frame":
      return <>{renderChildren}</>;
    case "text":
      return (
        <span
          className={
            props.variant === "secondary"
              ? "text-sm text-muted-foreground"
              : "text-base font-semibold tracking-tight text-foreground"
          }
        >
          {props.title}
        </span>
      );
    case "badge":
      return (
        <Badge
          variant={
            props.variant === "outline" ||
            props.variant === "secondary" ||
            props.variant === "destructive"
              ? props.variant
              : "default"
          }
        >
          {props.title}
        </Badge>
      );
    case "page-header":
      if (block.children && block.children.length > 0) {
        return <>{renderChildren}</>;
      }
      return (
        <PageHeader
          title={props.title}
          description={props.subtitle}
          actions={props.buttonLabel ? <Button size="sm">{props.buttonLabel}</Button> : undefined}
        />
      );
    case "filter-bar":
      return (
        <FilterBar
          search=""
          onSearchChange={() => {}}
          searchPlaceholder={props.title}
          activeFilters={props.badge ? [{ key: "f1", label: props.badge }] : []}
        />
      );
    case "breadcrumb": {
      const items = parseLines(props.itemsText, ["Home", "Page"]);
      return (
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((label, i) => (
              <Fragment key={label + i}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {i === items.length - 1 ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      );
    }
    case "statusbar": {
      if (block.children && block.children.length > 0) {
        return <>{renderChildren}</>;
      }
      const stages = parseLines(props.itemsText, ["Draft", "Confirmed", "Done"]).map((label, i) => ({
        id: `s${i}`,
        label,
      }));
      return (
        <Statusbar
          stages={stages}
          currentId={stages[Math.min(1, stages.length - 1)]?.id ?? "s0"}
          actions={props.buttonLabel ? <Button size="sm">{props.buttonLabel}</Button> : undefined}
        />
      );
    }
    case "smart-button": {
      const pairs = parsePairs(props.itemsText, [["Tasks", "12"], ["Uptime", "99.9%"]]);
      return (
        <SmartButtonGroup>
          {pairs.map(([label, val], i) => (
            <SmartButton
              key={label + i}
              icon={i % 2 === 0 ? <Blocks /> : <Activity />}
              value={val}
              label={label}
            />
          ))}
        </SmartButtonGroup>
      );
    }
    case "section-grid": {
      if (renderChildren) {
        return <>{renderChildren}</>;
      }
      const fields = parseLines(props.itemsText, ["Name", "Email"]);
      return (
        <SectionGrid title={props.title} description={props.subtitle} columns={props.columns ?? 2}>
          {fields.map((f) => (
            <FormField key={f} label={f}>
              <Input placeholder={`Enter ${f.toLowerCase()}...`} />
            </FormField>
          ))}
        </SectionGrid>
      );
    }
    case "form-sheet": {
      if (renderChildren) {
        return (
          <FormSheet
            title={props.title}
            subtitle={props.subtitle}
            statusbar={
              props.buttonLabel ? (
                <Statusbar
                  stages={[{ id: "d", label: "Draft" }, { id: "c", label: "Confirmed" }]}
                  currentId="d"
                  actions={<Button size="sm">{props.buttonLabel}</Button>}
                />
              ) : undefined
            }
          >
            {renderChildren}
          </FormSheet>
        );
      }
      const fields = parseLines(props.itemsText, ["Reference", "Owner"]);
      return (
        <FormSheet
          title={props.title}
          subtitle={props.subtitle}
          statusbar={
            props.buttonLabel ? (
              <Statusbar
                stages={[{ id: "d", label: "Draft" }, { id: "c", label: "Confirmed" }]}
                currentId="d"
                actions={<Button size="sm">{props.buttonLabel}</Button>}
              />
            ) : undefined
          }
        >
          <SectionGrid title="Details" columns={props.columns ?? 2}>
            {fields.map((f) => (
              <FormField key={f} label={f}>
                <Input placeholder={`Enter ${f.toLowerCase()}...`} />
              </FormField>
            ))}
          </SectionGrid>
        </FormSheet>
      );
    }
    case "detail-view": {
      const pairs = parsePairs(props.itemsText, [["Status", "Active"], ["Owner", "Dang TB"]]);
      return (
        <DetailView
          title={props.title}
          subtitle={props.subtitle}
          badge={props.badge}
          actions={props.buttonLabel ? <Button size="sm">{props.buttonLabel}</Button> : undefined}
          sidebar={<PropertyList rows={pairs.map(([label, value]) => ({ label, value }))} />}
        >
          <MarkdownEditor value={props.subtitle ?? "## Details"} onChange={() => {}} />
        </DetailView>
      );
    }
    case "button": {
      const v = props.variant === "success" || props.variant === "warning" ? "default" : props.variant;
      return (
        <Button
          variant={v ?? "default"}
          className={block.layout?.width === "fill" ? "w-full justify-start" : undefined}
        >
          {props.title}
        </Button>
      );
    }
    case "input":
      return (
        <FormField label={props.title}>
          <Input placeholder={props.placeholder ?? "Enter value..."} />
        </FormField>
      );
    case "textarea":
      return (
        <FormField label={props.title}>
          <Textarea placeholder={props.placeholder ?? "Write details..."} />
        </FormField>
      );
    case "select": {
      const opts = parseLines(props.itemsText, ["Option 1", "Option 2"]);
      return (
        <FormField label={props.title}>
          <Select defaultValue={opts[0]}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      );
    }
    case "multi-select": {
      const opts = parseLines(props.itemsText, ["React", "Tailwind"]).map((o) => ({ value: o, label: o }));
      return (
        <FormField label={props.title}>
          <MultiSelect options={opts} value={[opts[0]?.value].filter(Boolean)} onChange={() => {}} />
        </FormField>
      );
    }
    case "date-picker":
      return (
        <FormField label={props.title}>
          <DatePicker value="" onChange={() => {}} />
        </FormField>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked /> {props.title}
        </label>
      );
    case "switch":
      return (
        <div className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          <span>{props.title}</span>
        </div>
      );
    case "file-upload":
      return (
        <FormField label={props.title}>
          <FileUpload files={[]} onFilesChange={() => {}} />
        </FormField>
      );
    case "markdown":
      return <MarkdownEditor value={props.title} onChange={() => {}} />;
    case "stat-card":
      return <StatCard title={props.title} value={props.value ?? "0"} delta={props.badge} trend="up" />;
    case "chart": {
      const pts = parsePairs(props.itemsText, [["Mon", "30"], ["Tue", "65"], ["Wed", "45"]]).map(
        ([label, v]) => ({ label, value: Number(v) || 0 })
      );
      return <Chart data={pts} variant="bar" />;
    }
    case "usage-meter":
      return <UsageMeter label={props.title} used={Number(props.value) || 75} limit={100} unit="%" />;
    case "uptime-bar":
      return (
        <UptimeBar
          serviceName={props.title}
          uptimePercent={props.badge ?? "99.95%"}
          days={["up", "up", "up", "degraded", "up", "up", "up", "up", "up", "up"]}
        />
      );
    case "property-list": {
      const pairs = parsePairs(props.itemsText, [["Status", "Active"], ["Owner", "Dang TB"]]);
      return <PropertyList rows={pairs.map(([label, value]) => ({ label, value }))} />;
    }
    case "timeline": {
      const lines = parseLines(props.itemsText, ["Created | 10:00", "Updated | 10:15"]);
      return (
        <Timeline>
          {lines.map((l, i) => {
            const [title, time] = l.split("|").map((s) => s.trim());
            return <TimelineItem key={i} title={title} time={time} active={i === 0} />;
          })}
        </Timeline>
      );
    }
    case "stepper": {
      const steps = parseLines(props.itemsText, ["Step 1", "Step 2", "Step 3"]).map((title, i) => ({
        id: `st-${i}`,
        title,
      }));
      return <Stepper steps={steps} currentStep={1} />;
    }
    case "alert": {
      const v = props.variant === "secondary" || props.variant === "outline" ? "default" : props.variant;
      return (
        <Alert variant={v ?? "warning"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{props.title}</AlertTitle>
          {props.subtitle && <AlertDescription>{props.subtitle}</AlertDescription>}
        </Alert>
      );
    }
    case "code-block":
      return <CodeBlock code={props.title} language="bash" />;
    case "comment-thread":
      return (
        <CommentThread
          comments={[
            { id: "c1", author: "Dang TB", avatarFallback: "DT", time: "5m ago", content: "Ready for review @team!" },
          ]}
        />
      );
    case "data-table": {
      const cols = parseLines(props.itemsText, ["Name", "Owner", "Status"]);
      return (
        <DataTable
          data={[
            { id: "1", c0: "Enterprise Deal", c1: "Dang TB", c2: "Active" },
            { id: "2", c0: "Starter Plan", c1: "AI", c2: "Pending" },
          ]}
          columns={cols.slice(0, 3).map((header, i) => ({
            key: `c${i}` as "c0" | "c1" | "c2",
            header,
            sortable: true,
          }))}
        />
      );
    }
    case "data-grid": {
      const cols = parseLines(props.itemsText, ["Key", "Title", "Owner"]);
      return (
        <DataGridView
          data={[
            { id: "1", c0: "REC-1", c1: "Sample Record", c2: "Dang TB" },
            { id: "2", c0: "REC-2", c1: "Second Row", c2: "AI" },
          ]}
          columns={cols.slice(0, 3).map((header, i) => ({
            key: `c${i}` as "c0" | "c1" | "c2",
            header,
          }))}
        />
      );
    }
    case "kanban": {
      const cols = parseLines(props.itemsText, ["To Do", "In Progress", "Done"]);
      return (
        <KanbanBoard
          columns={cols.map((title, i) => ({
            id: `col-${i}`,
            title,
            cards: i === 0 ? [{ id: "k1", key: "T-1", title: "Sample task", priority: "medium", assignee: "DT" }] : [],
          }))}
        />
      );
    }
    case "gantt": {
      const tasks = parseLines(props.itemsText, ["Phase 1", "Phase 2"]).map((title, i) => ({
        id: `g-${i}`,
        title,
        startDay: i * 3 + 1,
        durationDays: 4,
        progress: i === 0 ? 100 : 50,
        tone: (i === 0 ? "success" : "primary") as "success" | "primary",
      }));
      return <GanttChart totalDays={12} todayDay={4} tasks={tasks} />;
    }
    case "calendar":
      return (
        <CalendarView
          monthLabel={props.title}
          daysInMonth={14}
          today={5}
          events={[{ id: "e1", title: "Launch", day: 5, tone: "success" }]}
        />
      );
    case "tree-table":
      return (
        <TreeTable
          nodes={[
            {
              id: "e1",
              key: "EPIC-1",
              title: props.title,
              status: "busy",
              priority: "high",
              assignee: "DT",
              children: [{ id: "s1", key: "T-1", title: "Subtask 1", status: "finished", priority: "medium", assignee: "AI" }],
            },
          ]}
        />
      );
    case "gallery-grid": {
      const items = parseLines(props.itemsText, ["Item 1", "Item 2", "Item 3"]).map((title, i) => ({
        id: `gal-${i}`,
        title,
        subtitle: "Preview card",
        badge: "New",
      }));
      return <GalleryGrid items={items} />;
    }
    case "prompt-input":
      return (
        <PromptInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          placeholder={props.title}
          models={parseLines(props.itemsText, ["Gemini 2.5 Pro"])}
          model={parseLines(props.itemsText, ["Gemini 2.5 Pro"])[0]}
          onModelChange={() => {}}
        />
      );
    case "approval-card":
      return (
        <ApprovalCard
          title={props.title}
          description={props.subtitle}
          command={props.value ?? "npm run deploy"}
          onApprove={() => {}}
          onReject={() => {}}
        />
      );
    case "execution-steps": {
      const steps = parseLines(props.itemsText, ["Step 1", "Step 2"]).map((label, i) => ({
        id: `ex-${i}`,
        label,
        status: (i === 0 ? "done" : i === 1 ? "running" : "pending") as "done" | "running" | "pending",
      }));
      return <ExecutionSteps steps={steps} />;
    }
    case "context-window":
      return (
        <ContextWindow
          limit={128000}
          segments={[
            { label: "System", tokens: 12000 },
            { label: "Files", tokens: 42000 },
          ]}
        />
      );
    case "audit-log":
      return (
        <AuditLog
          entries={[
            {
              id: "1",
              actor: "Nguyễn Minh",
              actorRole: "Requester",
              action: "create",
              summary: "Tạo phiếu đề nghị thanh toán PC-2026-089",
              timestamp: "09:15",
            },
            {
              id: "2",
              actor: "Trần Lan",
              actorRole: "Accountant",
              action: "update",
              summary: "Cập nhật trạng thái chứng từ",
              timestamp: "09:40",
              changes: [{ field: "Trạng thái", oldValue: "Nháp", newValue: "Chờ duyệt" }],
            },
          ]}
        />
      );
    case "data-comparison":
      return (
        <DataComparison
          beforeLabel="v1 (Nháp)"
          afterLabel="v2 (Hiện tại)"
          fields={[
            { key: "amount", label: "Số tiền", before: "2,500,000 ₫", after: "4,200,000 ₫" },
            { key: "dept", label: "Phòng ban", before: "Kinh doanh", after: "Kinh doanh" },
            { key: "status", label: "Trạng thái", before: "Nháp", after: "Chờ duyệt" },
          ]}
        />
      );
    case "watcher-widget":
      return (
        <WatcherWidget
          watchers={[
            { id: "1", name: "Nguyễn Minh", role: "Requester" },
            { id: "2", name: "Trần Lan", role: "Accountant" },
            { id: "3", name: "Lê Hùng", role: "CFO" },
          ]}
          isFollowing
          onToggleFollow={() => {}}
          onAddWatcher={() => {}}
        />
      );
    case "collapsible-card":
      return (
        <CollapsibleCard title={props.title} badge={props.badge} summary="Click to expand">
          <p className="text-xs text-muted-foreground">
            Collapsible content area for secondary details or audit notes.
          </p>
        </CollapsibleCard>
      );
    case "language-switcher":
      return <LanguageSwitcher value="vi" onChange={() => {}} />;
    case "currency-input":
      return (
        <FormField label={props.title}>
          <CurrencyInput value={Number(props.value) || 2500000} onChange={() => {}} />
        </FormField>
      );
    case "editable-line-items":
      return (
        <EditableLineItemsTable
          items={[
            { id: "1", description: "Vé máy bay khứ hồi HN-HCM", quantity: 1, unitPrice: 3200000 },
            { id: "2", description: "Khách sạn 2 đêm", quantity: 2, unitPrice: 850000 },
          ]}
          onChange={() => {}}
        />
      );
    case "attachment-manager":
      return (
        <AttachmentManager
          items={[
            { id: "1", name: "hoa-don-vat-089.pdf", size: "420 KB", category: "VAT" },
            { id: "2", name: "ve-may-bay.png", size: "1.2 MB", category: "Receipt" },
          ]}
          onAdd={() => {}}
          onDownload={() => {}}
          onRemove={() => {}}
        />
      );
    case "excel-toolbar":
      return <ExcelToolbar onImport={() => {}} onExport={() => {}} onDownloadTemplate={() => {}} />;
    case "query-builder":
      return (
        <QueryBuilder
          value={{
            combinator: "AND",
            rules: [
              { id: "1", field: "Amount", operator: ">", value: "5000000" },
              { id: "2", field: "Department", operator: "=", value: "Sales" },
            ],
          }}
          onChange={() => {}}
        />
      );
    case "dynamic-filter":
      return (
        <DynamicFilter
          conditions={[
            { id: "1", field: "Trạng thái", value: "Chờ duyệt" },
            { id: "2", field: "Kỳ", value: "11/2026" },
          ]}
          onAddCondition={() => {}}
          onRemoveCondition={() => {}}
          onClearAll={() => {}}
        />
      );
  }
}
