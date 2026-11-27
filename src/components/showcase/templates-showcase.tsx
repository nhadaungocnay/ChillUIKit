import * as React from "react";
import { DetailLayout, ListLayout, Statusbar, WorkspaceLayout } from "@/components/layout";
import { ComponentPreview } from "@/components/showcase/component-preview";
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
  type DataTableColumn,
  type LineItemRow,
} from "@/components/ui";

interface ReportRow {
  id: string;
  department: string;
  budget: string;
  spent: string;
  remaining: string;
  status: string;
}

const REPORT_COLUMNS: DataTableColumn<ReportRow>[] = [
  { key: "department", header: "Phòng ban" },
  { key: "budget", header: "Ngân sách Q4" },
  { key: "spent", header: "Đã chi" },
  { key: "remaining", header: "Còn lại" },
  {
    key: "status",
    header: "Trạng thái",
    render: (row: ReportRow) => (
      <Badge variant={row.status === "Cảnh báo" ? "destructive" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
];

const REPORT_ROWS: ReportRow[] = [
  { id: "1", department: "Kỹ thuật & Hạ tầng", budget: "80,000,000 ₫", spent: "49,600,000 ₫", remaining: "30,400,000 ₫", status: "An toàn" },
  { id: "2", department: "Kinh doanh", budget: "60,000,000 ₫", spent: "52,800,000 ₫", remaining: "7,200,000 ₫", status: "Cảnh báo" },
  { id: "3", department: "Vận hành & Nhân sự", budget: "60,000,000 ₫", spent: "27,000,000 ₫", remaining: "33,000,000 ₫", status: "An toàn" },
];

export function TemplatesShowcase({ activeItemId }: { activeItemId?: string | null }) {
  const [subsystem, setSubsystem] = React.useState("PAYMENT");
  const [amount, setAmount] = React.useState<number | null>(4900000);
  const [lineItems, setLineItems] = React.useState<LineItemRow[]>([
    { id: "1", description: "Vé máy bay khứ hồi HN-HCM", quantity: 1, unitPrice: 3200000 },
    { id: "2", description: "Khách sạn 2 đêm", quantity: 2, unitPrice: 850000 },
  ]);

  const content = (
    <>
      <div key="tpl-expense-report" id="tpl-expense-report">
        <ComponentPreview
          title="Template 1: Budget & Expense Report (WorkspaceLayout)"
          description="Báo cáo ngân sách & chi phí nội bộ 4 tầng: Header, Subsystem Tabs, 4 KPIs, Chart + UsageMeter và DataTable."
          code={`<WorkspaceLayout header={...} tabs={...} kpis={...} content={...} />`}
        >
          <WorkspaceLayout
            header={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Báo cáo Ngân sách & Chi phí</h3>
                  <p className="text-xs text-muted-foreground">Theo dõi hạn mức theo phòng ban — Kỳ 11/2026</p>
                </div>
                <ExcelToolbar onImport={() => {}} onExport={() => {}} onDownloadTemplate={() => {}} />
              </div>
            }
            tabs={
              <SegmentedControl
                value={subsystem}
                onChange={setSubsystem}
                options={[
                  { value: "PAYMENT", label: "Thanh toán (24)" },
                  { value: "ADVANCE", label: "Tạm ứng (12)" },
                ]}
              />
            }
            kpis={
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Tổng ngân sách Q4" value="200M ₫" delta="3 phòng ban" trend="neutral" />
                <StatCard title="Đã giải ngân" value="129.4M ₫" delta="64.7%" trend="up" />
                <StatCard title="Chờ phê duyệt" value="34.2M ₫" delta="12 phiếu" trend="neutral" />
                <StatCard title="Cảnh báo vượt ngưỡng" value="1" delta="Phòng Kinh doanh" trend="down" />
              </div>
            }
            content={
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Xu hướng chi phí 6 tháng (Triệu ₫)</p>
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
                    <UsageMeter label="Phòng Kinh doanh (88%)" used={88} limit={100} />
                    <UsageMeter label="Phòng Kỹ thuật (62%)" used={62} limit={100} />
                    <UsageMeter label="Vận hành & Nhân sự (45%)" used={45} limit={100} />
                  </div>
                </div>
                <DataTable data={REPORT_ROWS} columns={REPORT_COLUMNS} />
              </div>
            }
          />
        </ComponentPreview>
      </div>

      <div id="tpl-payment-detail">
        <ComponentPreview
          title="Template 2: Payment Detail 2:1 (DetailLayout)"
          description="Màn hình chi tiết phiếu thanh toán tỷ lệ 2/3 – 1/3 với CollapsibleCard, Line Items, Watcher, Attachment & AuditLog."
          code={`<DetailLayout ratio="2:1" header={...} main={...} aside={...} />`}
        >
          <DetailLayout
            ratio="2:1"
            stickyAside={false}
            header={
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">PC-2026-089</span>
                  <Badge variant="secondary">Chờ Kế toán duyệt</Badge>
                </div>
                <Statusbar
                  stages={[
                    { id: "draft", label: "Nháp" },
                    { id: "pending", label: "Chờ duyệt" },
                    { id: "done", label: "Đã chi" },
                  ]}
                  currentId="pending"
                  actions={<Button size="sm">Phê duyệt</Button>}
                />
              </div>
            }
            main={
              <>
                <CollapsibleCard title="Thông tin chung" badge="Hợp lệ">
                  <PropertyList
                    rows={[
                      { label: "Người đề nghị", value: "Nguyễn Minh (Kinh doanh)" },
                      { label: "Kỳ ngân sách", value: "T11/2026 • Tiếp khách" },
                      { label: "Tổng tiền", value: "4,900,000 ₫" },
                    ]}
                  />
                </CollapsibleCard>
                <CollapsibleCard title="Chi tiết khoản mục chi phí" badge="2 dòng">
                  <EditableLineItemsTable items={lineItems} onChange={setLineItems} />
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
                    { id: "1", name: "Nguyễn Minh" },
                    { id: "2", name: "Trần Lan" },
                    { id: "3", name: "Lê Hùng" },
                  ]}
                  isFollowing
                  onToggleFollow={() => {}}
                />
                <AttachmentManager
                  items={[{ id: "1", name: "hoa-don-vat-089.pdf", size: "420 KB", category: "VAT" }]}
                  onDownload={() => {}}
                />
                <AuditLog
                  showFilter={false}
                  entries={[
                    { id: "1", actor: "Nguyễn Minh", action: "create", summary: "Tạo phiếu PC-2026-089", timestamp: "27/11/2026 09:15" },
                    { id: "2", actor: "Trần Lan", action: "update", summary: "Chuyển trạng thái", timestamp: "27/11/2026 09:40", changes: [{ field: "Trạng thái", oldValue: "Nháp", newValue: "Chờ duyệt" }] },
                  ]}
                />
              </>
            }
          />
        </ComponentPreview>
      </div>

      <div id="tpl-approval-list">
        <ComponentPreview
          title="Template 3: Approval Inbox & List (ListLayout)"
          description="Danh sách hồ sơ chờ duyệt với ExcelToolbar, DynamicFilter và DataTable."
          code={`<ListLayout header={...} toolbar={...} filters={...} table={...} />`}
        >
          <ListLayout
            header={<h3 className="text-sm font-semibold text-foreground">Hàng đợi Phê duyệt</h3>}
            toolbar={
              <>
                <ExcelToolbar onExport={() => {}} />
                <Button size="sm">+ Tạo phiếu chi</Button>
              </>
            }
            filters={
              <DynamicFilter
                conditions={[
                  { id: "1", field: "Trạng thái", value: "Chờ duyệt" },
                  { id: "2", field: "Phòng ban", value: "Kinh doanh" },
                ]}
                onRemoveCondition={() => {}}
                onClearAll={() => {}}
              />
            }
            table={<DataTable data={REPORT_ROWS} columns={REPORT_COLUMNS} />}
          />
        </ComponentPreview>
      </div>

      <div id="tpl-create-expense">
        <ComponentPreview
          title="Template 4: Create Expense Form (DetailLayout 2:1)"
          description="Form tạo phiếu chi 2 cột: bên trái nhập liệu + bảng dòng chi, bên phải đính kèm & hạn mức."
          code={`<DetailLayout ratio="2:1" main={<Form />} aside={<BudgetCheck />} />`}
        >
          <DetailLayout
            ratio="2:1"
            stickyAside={false}
            main={
              <CollapsibleCard title="Tạo phiếu đề nghị thanh toán">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Tiêu đề khoản chi">
                      <Input placeholder="VD: Công tác phí Hà Nội" />
                    </FormField>
                    <FormField label="Danh mục">
                      <Select defaultValue="travel">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travel">Công tác phí</SelectItem>
                          <SelectItem value="software">Phần mềm & Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Số tiền dự kiến">
                      <CurrencyInput value={amount} onChange={setAmount} />
                    </FormField>
                  </div>
                  <EditableLineItemsTable items={lineItems} onChange={setLineItems} />
                </div>
              </CollapsibleCard>
            }
            aside={
              <>
                <AttachmentManager items={[]} onAdd={() => {}} />
                <div className="rounded-lg border border-border bg-surface p-4">
                  <UsageMeter label="Ngân sách còn lại (62%)" used={62} limit={100} />
                </div>
              </>
            }
          />
        </ComponentPreview>
      </div>
    </>
  );
  return (
    <div className="space-y-8">
      {React.Children.toArray(content.props.children).filter(
        (el) => !activeItemId || (React.isValidElement<{ id?: string }>(el) && el.props.id === activeItemId)
      )}
    </div>
  );
}
