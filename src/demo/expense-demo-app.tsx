import * as React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FilePlus2,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import {
  AppShell,
  AppShellNavItem,
  DetailLayout,
  ListLayout,
  PageContainer,
  Statusbar,
  WorkspaceLayout,
} from "@/components/layout";
import {
  AttachmentManager,
  AuditLog,
  Badge,
  Button,
  Chart,
  CollapsibleCard,
  CommentThread,
  CurrencyInput,
  DataTable,
  DynamicFilter,
  EditableLineItemsTable,
  ExcelToolbar,
  FormField,
  Input,
  LanguageSwitcher,
  PropertyList,
  SegmentedControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCard,
  UsageMeter,
  WatcherWidget,
  type AuditLogEntry,
  type DataTableColumn,
  type FilterCondition,
  type LineItemRow,
} from "@/components/ui";

type DemoView = "workspace" | "list" | "detail" | "create";

interface ExpenseRecord {
  id: string;
  code: string;
  title: string;
  requester: string;
  department: string;
  category: string;
  amount: number;
  status: "Nháp" | "Chờ duyệt" | "Đã duyệt";
  createdAt: string;
  items: LineItemRow[];
  audit: AuditLogEntry[];
}

function formatFullDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const INITIAL_RECORDS: ExpenseRecord[] = [
  {
    id: "rec-1",
    code: "PC-2026-089",
    title: "Công tác phí Hà Nội — Gặp đối tác Q4",
    requester: "Nguyễn Minh",
    department: "Kinh doanh",
    category: "Công tác phí",
    amount: 4900000,
    status: "Chờ duyệt",
    createdAt: "27/11/2026",
    items: [
      { id: "1", description: "Vé máy bay khứ hồi HN-HCM", quantity: 1, unitPrice: 3200000 },
      { id: "2", description: "Khách sạn 2 đêm", quantity: 2, unitPrice: 850000 },
    ],
    audit: [
      { id: "a1", actor: "Nguyễn Minh", actorRole: "Requester", action: "create", summary: "Tạo phiếu PC-2026-089", timestamp: "09:15" },
      { id: "a2", actor: "Trần Lan", actorRole: "Accountant", action: "update", summary: "Xác nhận chứng từ VAT", timestamp: "09:40", changes: [{ field: "Trạng thái", oldValue: "Nháp", newValue: "Chờ duyệt" }] },
    ],
  },
  {
    id: "rec-2",
    code: "PC-2026-090",
    title: "Gia hạn hạ tầng AWS & Figma Enterprise",
    requester: "Lê Hoàng",
    department: "Kỹ thuật",
    category: "Phần mềm & Cloud",
    amount: 12800000,
    status: "Chờ duyệt",
    createdAt: "26/11/2026",
    items: [
      { id: "1", description: "AWS EC2 & RDS Q4", quantity: 1, unitPrice: 9800000 },
      { id: "2", description: "Figma Seats (5 users)", quantity: 5, unitPrice: 600000 },
    ],
    audit: [
      { id: "a1", actor: "Lê Hoàng", actorRole: "Tech Lead", action: "create", summary: "Tạo phiếu PC-2026-090", timestamp: "14:20" },
    ],
  },
  {
    id: "rec-3",
    code: "PC-2026-085",
    title: "Tổ chức Workshop khách hàng tháng 11",
    requester: "Phạm Quân",
    department: "Marketing",
    category: "Tiếp khách",
    amount: 8250000,
    status: "Đã duyệt",
    createdAt: "24/11/2026",
    items: [{ id: "1", description: "Thuê hội trường & Teabreak", quantity: 1, unitPrice: 8250000 }],
    audit: [
      { id: "a1", actor: "Phạm Quân", action: "create", summary: "Tạo phiếu PC-2026-085", timestamp: "10:00" },
      { id: "a2", actor: "Lê Hùng", actorRole: "CFO", action: "approve", summary: "Phê duyệt chi", timestamp: "16:30" },
    ],
  },
];

export default function ExpenseDemoApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = React.useState<DemoView>("workspace");
  const [records, setRecords] = React.useState<ExpenseRecord[]>(INITIAL_RECORDS);
  const [activeId, setActiveId] = React.useState<string>("rec-1");
  const [subsystem, setSubsystem] = React.useState("PAYMENT");
  const [lang, setLang] = React.useState("vi");
  const [following, setFollowing] = React.useState(true);
  const [filters, setFilters] = React.useState<FilterCondition[]>([
    { id: "1", field: "Kỳ", value: "11/2026" },
  ]);

  // Create form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Công tác phí");
  const [newAmount, setNewAmount] = React.useState<number | null>(2500000);
  const [newItems, setNewItems] = React.useState<LineItemRow[]>([
    { id: "1", description: "Chi phí công tác", quantity: 1, unitPrice: 2500000 },
  ]);

  const activeRecord = records.find((r) => r.id === activeId) ?? records[0];

  const openDetail = (id: string) => {
    setActiveId(id);
    setView("detail");
  };

  const approveRecord = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              status: "Đã duyệt",
              audit: [
                ...r.audit,
                {
                  id: `a-${Date.now()}`,
                  actor: "Bạn (CFO)",
                  actorRole: "Approver",
                  action: "approve",
                  summary: `Phê duyệt phiếu ${r.code}`,
                  timestamp: formatFullDateTime(new Date()),
                  changes: [{ field: "Trạng thái", oldValue: r.status, newValue: "Đã duyệt" }],
                },
              ],
            }
      )
    );
  };

  const handleCreate = () => {
    const total = newItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0) || newAmount || 0;
    const created: ExpenseRecord = {
      id: `rec-${Date.now()}`,
      code: `PC-2026-0${91 + records.length}`,
      title: newTitle.trim() || "Đề nghị thanh toán mới",
      requester: "Bạn",
      department: "Kinh doanh",
      category: newCategory,
      amount: total,
      status: "Chờ duyệt",
      createdAt: "27/11/2026",
      items: newItems,
      audit: [
        {
          id: `a-${Date.now()}`,
          actor: "Bạn",
          actorRole: "Requester",
          action: "create",
          summary: "Tạo và gửi duyệt phiếu mới",
          timestamp: formatFullDateTime(new Date()),
        },
      ],
    };
    setRecords((prev) => [created, ...prev]);
    setNewTitle("");
    setActiveId(created.id);
    setView("detail");
  };

  const columns: DataTableColumn<ExpenseRecord>[] = [
    { key: "code", header: "Mã phiếu" },
    { key: "title", header: "Nội dung" },
    { key: "requester", header: "Người đề nghị" },
    {
      key: "amount",
      header: "Số tiền",
      render: (r) => <span className="font-mono font-medium">{r.amount.toLocaleString("en-US")} ₫</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => (
        <Badge variant={r.status === "Đã duyệt" ? "default" : r.status === "Chờ duyệt" ? "secondary" : "outline"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openDetail(r.id)}>
            Xem
          </Button>
          {r.status !== "Đã duyệt" && (
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => approveRecord(r.id)}>
              Duyệt
            </Button>
          )}
        </div>
      ),
    },
  ];

  const totalAmount = records.reduce((s, r) => s + r.amount, 0);
  const pendingCount = records.filter((r) => r.status === "Chờ duyệt").length;

  return (
    <AppShell
      brand="ChillExpense"
      sidebar={
        <div className="space-y-1">
          <AppShellNavItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Tổng quan"
            active={view === "workspace"}
            onClick={() => setView("workspace")}
          />
          <AppShellNavItem
            icon={<ListChecks className="h-4 w-4" />}
            label="Danh sách & Duyệt"
            active={view === "list"}
            onClick={() => setView("list")}
          />
          <AppShellNavItem
            icon={<FilePlus2 className="h-4 w-4" />}
            label="Tạo phiếu chi"
            active={view === "create"}
            onClick={() => setView("create")}
          />
          <AppShellNavItem
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Chi tiết phiếu"
            active={view === "detail"}
            onClick={() => setView("detail")}
          />
        </div>
      }
      header={
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>UI Kit</span>
            </Button>
            <Badge variant="secondary">Live Demo App</Badge>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher value={lang} onChange={setLang} />
            <Button size="sm" onClick={() => setView("create")}>
              + Tạo phiếu chi
            </Button>
          </div>
        </div>
      }
    >
      <PageContainer>
        {view === "workspace" && (
          <WorkspaceLayout
            header={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Không gian Kế toán & Chi phí Nội bộ
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Theo dõi ngân sách, hàng chờ duyệt và giải ngân theo thời gian thực.
                  </p>
                </div>
                <ExcelToolbar onImport={() => {}} onExport={() => {}} onDownloadTemplate={() => {}} />
              </div>
            }
            tabs={
              <SegmentedControl
                value={subsystem}
                onChange={setSubsystem}
                options={[
                  { value: "PAYMENT", label: `1. Quản lý Thanh toán (${records.length})` },
                  { value: "ADVANCE", label: "2. Quản lý Tạm ứng (4)" },
                ]}
              />
            }
            kpis={
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Tổng giá trị phiếu" value={`${(totalAmount / 1000000).toFixed(1)}M ₫`} delta="Kỳ 11/2026" trend="up" />
                <StatCard title="Chờ phê duyệt" value={String(pendingCount)} delta="Cần xử lý" trend="neutral" />
                <StatCard title="Ngân sách còn lại" value="51.5M ₫" delta="25.7% Q4" trend="up" />
                <StatCard title="Tỷ lệ hợp lệ" value="96.4%" delta="+1.8%" trend="up" />
              </div>
            }
            content={
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Chi phí 6 tháng gần nhất (Triệu ₫)</p>
                    <Chart
                      data={[
                        { label: "T6", value: 112 },
                        { label: "T7", value: 128 },
                        { label: "T8", value: 119 },
                        { label: "T9", value: 142 },
                        { label: "T10", value: 137 },
                        { label: "T11", value: 148 },
                      ]}
                    />
                  </div>
                  <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
                    <p className="text-xs font-semibold text-foreground">Hạn mức theo Phòng ban</p>
                    <UsageMeter label="Phòng Kinh doanh (88%)" used={88} limit={100} />
                    <UsageMeter label="Phòng Kỹ thuật (62%)" used={62} limit={100} />
                    <UsageMeter label="Vận hành & Nhân sự (45%)" used={45} limit={100} />
                  </div>
                </div>
                <DataTable data={records} columns={columns} />
              </div>
            }
          />
        )}

        {view === "list" && (
          <ListLayout
            header={
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Danh sách Phiếu chi</h1>
                <p className="text-xs text-muted-foreground">Bấm Xem để mở Detail View 2:1 hoặc Duyệt nhanh.</p>
              </div>
            }
            toolbar={<ExcelToolbar onImport={() => {}} onExport={() => {}} onDownloadTemplate={() => {}} />}
            filters={
              <DynamicFilter
                conditions={filters}
                onAddCondition={() =>
                  setFilters((prev) => [...prev, { id: String(Date.now()), field: "Trạng thái", value: "Chờ duyệt" }])
                }
                onRemoveCondition={(id) => setFilters((prev) => prev.filter((f) => f.id !== id))}
                onClearAll={() => setFilters([])}
              />
            }
            table={<DataTable data={records} columns={columns} />}
          />
        )}

        {view === "detail" && activeRecord && (
          <DetailLayout
            ratio="2:1"
            header={
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold text-foreground">{activeRecord.code}</span>
                  <Badge variant={activeRecord.status === "Đã duyệt" ? "default" : "secondary"}>
                    {activeRecord.status}
                  </Badge>
                </div>
                <Statusbar
                  stages={[
                    { id: "Nháp", label: "Nháp" },
                    { id: "Chờ duyệt", label: "Chờ duyệt" },
                    { id: "Đã duyệt", label: "Đã duyệt" },
                  ]}
                  currentId={activeRecord.status}
                  actions={
                    activeRecord.status !== "Đã duyệt" ? (
                      <Button size="sm" onClick={() => approveRecord(activeRecord.id)}>
                        Phê duyệt ngay
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            }
            main={
              <>
                <CollapsibleCard title="Thông tin chung" badge={activeRecord.category}>
                  <PropertyList
                    rows={[
                      { label: "Nội dung", value: activeRecord.title },
                      { label: "Người đề nghị", value: `${activeRecord.requester} (${activeRecord.department})` },
                      { label: "Ngày tạo", value: activeRecord.createdAt },
                      { label: "Tổng tiền", value: `${activeRecord.amount.toLocaleString("en-US")} ₫` },
                    ]}
                  />
                </CollapsibleCard>

                <CollapsibleCard title="Chi tiết khoản mục chi phí" badge={`${activeRecord.items.length} dòng`}>
                  <EditableLineItemsTable
                    items={activeRecord.items}
                    onChange={(nextItems) => {
                      const nextTotal = nextItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
                      setRecords((prev) =>
                        prev.map((r) => (r.id === activeRecord.id ? { ...r, items: nextItems, amount: nextTotal } : r))
                      );
                    }}
                  />
                </CollapsibleCard>

                <CollapsibleCard title="Thảo luận">
                  <CommentThread
                    comments={[
                      { id: "1", author: "Trần Lan", avatarFallback: "TL", time: "27/11/2026 09:40", content: "Đã kiểm tra hóa đơn VAT hợp lệ." },
                    ]}
                  />
                </CollapsibleCard>
              </>
            }
            aside={
              <>
                <WatcherWidget
                  watchers={[
                    { id: "1", name: activeRecord.requester },
                    { id: "2", name: "Trần Lan" },
                    { id: "3", name: "Lê Hùng" },
                  ]}
                  isFollowing={following}
                  onToggleFollow={() => setFollowing((f) => !f)}
                />
                <AttachmentManager
                  items={[{ id: "1", name: "hoa-don-vat.pdf", size: "420 KB", category: "VAT" }]}
                  onDownload={() => {}}
                />
                <AuditLog entries={activeRecord.audit} />
              </>
            }
          />
        )}

        {view === "create" && (
          <DetailLayout
            ratio="2:1"
            main={
              <CollapsibleCard title="Tạo phiếu đề nghị thanh toán mới">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Tiêu đề khoản chi">
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="VD: Công tác phí Đà Nẵng"
                      />
                    </FormField>
                    <FormField label="Danh mục">
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Công tác phí">Công tác phí</SelectItem>
                          <SelectItem value="Tiếp khách">Tiếp khách</SelectItem>
                          <SelectItem value="Phần mềm & Cloud">Phần mềm & Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Số tiền dự kiến">
                      <CurrencyInput value={newAmount} onChange={setNewAmount} />
                    </FormField>
                  </div>

                  <EditableLineItemsTable items={newItems} onChange={setNewItems} />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setView("workspace")}>
                      Hủy
                    </Button>
                    <Button onClick={handleCreate}>Gửi phê duyệt</Button>
                  </div>
                </div>
              </CollapsibleCard>
            }
            aside={
              <>
                <AttachmentManager items={[]} onAdd={() => {}} />
                <div className="rounded-lg border border-border bg-surface p-4">
                  <UsageMeter label="Ngân sách phòng ban còn lại (62%)" used={62} limit={100} />
                </div>
              </>
            }
          />
        )}
      </PageContainer>
    </AppShell>
  );
}
