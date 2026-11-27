import * as React from "react";
import { DetailLayout, ListLayout, WorkspaceLayout } from "@/components/layout";
import { ComponentPreview } from "@/components/showcase/component-preview";
import {
  AnimatedCollapse,
  ApprovalChain,
  AttachmentManager,
  AuditLog,
  Badge,
  BulkActionBar,
  Button,
  CollapsibleCard,
  CurrencyInput,
  DataComparison,
  DynamicFilter,
  EditableLineItemsTable,
  ExcelToolbar,
  ImportReviewModal,
  LanguageSwitcher,
  MentionInput,
  PermissionMatrix,
  PrintSheet,
  QueryBuilder,
  StatCard,
  WatcherWidget,
  type FilterCondition,
  type LineItemRow,
  type PermissionModule,
  type QueryGroup,
} from "@/components/ui";

export function EnterpriseShowcase({ activeItemId }: { activeItemId?: string | null }) {
  const [amount, setAmount] = React.useState<number | null>(4200000);
  const [lang, setLang] = React.useState("vi");
  const [following, setFollowing] = React.useState(true);
  const [importOpen, setImportOpen] = React.useState(false);
  const [lineItems, setLineItems] = React.useState<LineItemRow[]>([
    { id: "1", description: "Vé máy bay khứ hồi HN-HCM", quantity: 1, unitPrice: 3200000 },
    { id: "2", description: "Khách sạn 2 đêm", quantity: 2, unitPrice: 850000 },
  ]);
  const [filters, setFilters] = React.useState<FilterCondition[]>([
    { id: "1", field: "Trạng thái", value: "Chờ duyệt" },
    { id: "2", field: "Kỳ", value: "11/2026" },
  ]);
  const [query, setQuery] = React.useState<QueryGroup>({
    combinator: "AND",
    rules: [
      { id: "1", field: "Amount", operator: ">", value: "5000000" },
      { id: "2", field: "Department", operator: "=", value: "Sales" },
    ],
  });
  const [selectedCount, setSelectedCount] = React.useState(3);
  const [collapseOpen, setCollapseOpen] = React.useState(true);
  const [mentionText, setMentionText] = React.useState("");
  const [rbac, setRbac] = React.useState<PermissionModule[]>([
    { id: "payment", label: "Phiếu thanh toán", permissions: { view: true, create: true, edit: true, approve: false, delete: false } },
    { id: "budget", label: "Ngân sách", permissions: { view: true, create: false, edit: false, approve: true, delete: false } },
  ]);

  const content = (
    <>
      <div key="audit-log" id="audit-log">
        <ComponentPreview
          title="Audit Log"
          description="Chronological record history with action filters and field-level diffs."
          code={`<AuditLog entries={entries} />`}
        >
          <AuditLog
            entries={[
              {
                id: "1",
                actor: "Nguyễn Minh",
                actorRole: "Requester",
                action: "create",
                summary: "Tạo phiếu đề nghị thanh toán PC-2026-089",
                timestamp: "27/11/2026 09:15",
              },
              {
                id: "2",
                actor: "Trần Lan",
                actorRole: "Accountant",
                action: "update",
                summary: "Cập nhật trạng thái chứng từ",
                timestamp: "27/11/2026 09:40",
                changes: [{ field: "Trạng thái", oldValue: "Nháp", newValue: "Chờ duyệt" }],
              },
            ]}
          />
        </ComponentPreview>
      </div>

      <div id="data-comparison">
        <ComponentPreview
          title="Data Comparison"
          description="Side-by-side record diff table with Only changes toggle."
          code={`<DataComparison fields={fields} />`}
        >
          <DataComparison
            beforeLabel="v1 (Nháp)"
            afterLabel="v2 (Hiện tại)"
            fields={[
              { key: "amount", label: "Số tiền", before: "2,500,000 ₫", after: "4,200,000 ₫" },
              { key: "dept", label: "Phòng ban", before: "Kinh doanh", after: "Kinh doanh" },
              { key: "status", label: "Trạng thái", before: "Nháp", after: "Chờ duyệt" },
            ]}
          />
        </ComponentPreview>
      </div>

      <div id="currency-input">
        <ComponentPreview
          title="Currency Input"
          description="Formatted numeric input with currency suffix."
          code={`<CurrencyInput value={amount} onChange={setAmount} currency="₫" />`}
        >
          <div className="max-w-xs">
            <CurrencyInput value={amount} onChange={setAmount} currency="₫" />
          </div>
        </ComponentPreview>
      </div>

      <div id="editable-line-items">
        <ComponentPreview
          title="Editable Line Items Table"
          description="Inline editable expense/invoice rows with auto-computed totals."
          code={`<EditableLineItemsTable items={items} onChange={setItems} />`}
        >
          <EditableLineItemsTable items={lineItems} onChange={setLineItems} />
        </ComponentPreview>
      </div>

      <div id="attachment-manager">
        <ComponentPreview
          title="Attachment Manager"
          description="Manage uploaded invoices and receipts with category tags."
          code={`<AttachmentManager items={items} onRemove={...} />`}
        >
          <AttachmentManager
            items={[
              { id: "1", name: "hoa-don-vat-089.pdf", size: "420 KB", category: "VAT" },
              { id: "2", name: "ve-may-bay.png", size: "1.2 MB", category: "Receipt" },
            ]}
            onAdd={() => {}}
            onDownload={() => {}}
            onRemove={() => {}}
          />
        </ComponentPreview>
      </div>

      <div id="excel-toolbar">
        <ComponentPreview
          title="Excel Toolbar & Import Review Modal"
          description="Import/Export Excel actions and validation review dialog."
          code={`<ExcelToolbar onImport={() => setOpen(true)} onExport={...} />`}
        >
          <div className="space-y-3">
            <ExcelToolbar
              onImport={() => setImportOpen(true)}
              onExport={() => {}}
              onDownloadTemplate={() => {}}
            />
            <ImportReviewModal
              open={importOpen}
              onOpenChange={setImportOpen}
              rows={[
                { rowNumber: 1, label: "PC-091 • Tiếp khách", detail: "2,400,000 ₫" },
                { rowNumber: 2, label: "PC-092 • Thiếu MST", detail: "", error: "Missing tax code" },
              ]}
              onConfirm={() => setImportOpen(false)}
            />
          </div>
        </ComponentPreview>
      </div>

      <div id="watcher-widget">
        <ComponentPreview
          title="Watcher Widget, Collapsible Card & Language Switcher"
          description="Collaboration and record utility primitives."
          code={`<WatcherWidget watchers={watchers} isFollowing={following} />`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <WatcherWidget
                watchers={[
                  { id: "1", name: "Nguyễn Minh", role: "Requester" },
                  { id: "2", name: "Trần Lan", role: "Accountant" },
                  { id: "3", name: "Lê Hùng", role: "CFO" },
                ]}
                isFollowing={following}
                onToggleFollow={() => setFollowing((f) => !f)}
                onAddWatcher={() => {}}
              />
              <LanguageSwitcher value={lang} onChange={setLang} />
            </div>
            <CollapsibleCard title="Thông tin bổ sung" badge="3 mục" summary="Nhấn để mở rộng">
              <p className="text-xs text-muted-foreground">
                Nội dung chi tiết có thể thu gọn để giữ màn hình chứng từ gọn gàng.
              </p>
            </CollapsibleCard>
          </div>
        </ComponentPreview>
      </div>

      <div id="query-builder">
        <ComponentPreview
          title="Query Builder & Dynamic Filter"
          description="Visual AND/OR rule builder and multi-criteria filter chips."
          code={`<QueryBuilder value={query} onChange={setQuery} />`}
        >
          <div className="space-y-4">
            <DynamicFilter
              conditions={filters}
              onAddCondition={() =>
                setFilters((prev) => [
                  ...prev,
                  { id: String(Date.now()), field: "Phòng ban", value: "Kinh doanh" },
                ])
              }
              onRemoveCondition={(id) => setFilters((prev) => prev.filter((f) => f.id !== id))}
              onClearAll={() => setFilters([])}
            />
            <QueryBuilder value={query} onChange={setQuery} />
          </div>
        </ComponentPreview>
      </div>

      <div id="page-layouts">
        <ComponentPreview
          title="Page Layouts: DetailLayout (2:1), WorkspaceLayout & ListLayout"
          description="Standardized page-level layout shells matching Internal-Payment views."
          code={`<DetailLayout ratio="2:1" main={...} aside={...} />`}
        >
          <div className="space-y-6">
            <DetailLayout
              ratio="2:1"
              stickyAside={false}
              header={<Badge variant="secondary">DetailLayout (2:1)</Badge>}
              main={
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                  Main 2/3 (Thông tin chung, Line Items, Bình luận)
                </div>
              }
              aside={
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                  Aside 1/3 (Tiến độ, Đính kèm, Watcher)
                </div>
              }
            />
            <WorkspaceLayout
              header={<Badge variant="secondary">WorkspaceLayout (4 tầng)</Badge>}
              kpis={
                <div className="grid grid-cols-2 gap-3">
                  <StatCard title="Chờ duyệt" value="12" />
                  <StatCard title="Đã chi" value="148.5M ₫" />
                </div>
              }
              content={
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                  Queue Table Content
                </div>
              }
            />
            <ListLayout
              header={<Badge variant="secondary">ListLayout</Badge>}
              toolbar={<Button size="sm">+ Tạo mới</Button>}
              table={
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                  Full-width DataTable
                </div>
              }
            />
          </div>
        </ComponentPreview>
      </div>

      <div id="approval-chain">
        <ComponentPreview
          title="Approval Chain"
          description="Multi-step approval workflow showing approvers, roles, and status."
          code={`<ApprovalChain steps={steps} />`}
        >
          <ApprovalChain
            steps={[
              { id: "1", approver: "Trưởng phòng", role: "Dept Manager", status: "approved", timestamp: "09:30" },
              { id: "2", approver: "Trần Lan", role: "Chief Accountant", status: "pending", timestamp: "Waiting 2h" },
              { id: "3", approver: "Lê Hùng", role: "CFO", status: "waiting" },
            ]}
          />
        </ComponentPreview>
      </div>

      <div id="permission-matrix">
        <ComponentPreview
          title="Permission Matrix (RBAC)"
          description="Role-based access control matrix by module and action."
          code={`<PermissionMatrix modules={modules} onChange={setModules} />`}
        >
          <PermissionMatrix modules={rbac} onChange={setRbac} />
        </ComponentPreview>
      </div>

      <div id="bulk-action-bar">
        <ComponentPreview
          title="Bulk Action Bar & Mention Input"
          description="Multi-row selection bar and @mention comment composer."
          code={`<BulkActionBar selectedCount={3} actions={...} onClear={...} />`}
        >
          <div className="space-y-4">
            <BulkActionBar
              selectedCount={selectedCount}
              actions={[
                { id: "approve", label: "Duyệt hàng loạt", variant: "default", onClick: () => {} },
                { id: "delete", label: "Xóa", variant: "destructive", onClick: () => {} },
              ]}
              onClear={() => setSelectedCount(0)}
            />
            <MentionInput
              value={mentionText}
              onChange={setMentionText}
              users={[
                { id: "1", name: "Nguyễn Minh", role: "Requester" },
                { id: "2", name: "Trần Lan", role: "Accountant" },
                { id: "3", name: "Lê Hùng", role: "CFO" },
              ]}
            />
          </div>
        </ComponentPreview>
      </div>

      <div id="print-sheet">
        <ComponentPreview
          title="Print Sheet (A4 Voucher)"
          description="Printable A4 payment voucher with signature blocks."
          code={`<PrintSheet title="PHIẾU CHI NỘI BỘ" code="PC-2026-089">...</PrintSheet>`}
        >
          <PrintSheet title="PHIẾU ĐỀ NGHỊ THANH TOÁN" code="PC-2026-089">
            <p className="text-xs text-muted-foreground">
              Nội dung: Công tác phí Hà Nội — Tổng tiền: 4,900,000 ₫ (Bốn triệu chín trăm nghìn đồng).
            </p>
          </PrintSheet>
        </ComponentPreview>
      </div>

      <div key="animated-collapse" id="animated-collapse">
        <ComponentPreview
          title="Animated Collapse"
          description="Smooth CSS grid-row collapse/expand wrapper for menus, filters, or cards."
          code={`<AnimatedCollapse open={open}>...</AnimatedCollapse>`}
        >
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={() => setCollapseOpen((o) => !o)}>
              {collapseOpen ? "Thu gọn" : "Mở rộng"}
            </Button>
            <AnimatedCollapse open={collapseOpen}>
              <div className="rounded-lg border border-border bg-surface p-4 text-xs text-muted-foreground">
                Nội dung bên trong đóng/mở mượt mà bằng CSS Grid `grid-rows-[1fr]` ↔ `grid-rows-[0fr]`.
              </div>
            </AnimatedCollapse>
          </div>
        </ComponentPreview>
      </div>
    </>
  );
  return (
    <div className="space-y-6">
      {React.Children.toArray(content.props.children).filter(
        (el) => !activeItemId || (React.isValidElement<{ id?: string }>(el) && el.props.id === activeItemId)
      )}
    </div>
  );
}
