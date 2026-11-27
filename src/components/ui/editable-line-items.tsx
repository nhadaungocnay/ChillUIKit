import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";

export interface LineItemRow {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface EditableLineItemsTableProps {
  items: LineItemRow[];
  onChange: (items: LineItemRow[]) => void;
  currency?: string;
  className?: string;
}

export function EditableLineItemsTable({
  items,
  onChange,
  currency = "₫",
  className,
}: EditableLineItemsTableProps) {
  const updateRow = (id: string, patch: Partial<LineItemRow>) => {
    onChange(items.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    onChange([
      ...items,
      { id: `row-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeRow = (id: string) => {
    onChange(items.filter((r) => r.id !== id));
  };

  const grandTotal = items.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

  return (
    <div className={cn("rounded-lg border border-border bg-surface overflow-hidden", className)}>
      <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/50 px-3 py-2 text-[11px] font-medium text-muted-foreground">
        <span className="col-span-5">Description</span>
        <span className="col-span-2 text-right">Qty</span>
        <span className="col-span-2 text-right">Unit Price</span>
        <span className="col-span-2 text-right">Total</span>
        <span className="col-span-1" />
      </div>

      <div className="divide-y divide-border">
        {items.map((row) => {
          const lineTotal = row.quantity * row.unitPrice;
          return (
            <div key={row.id} className="grid grid-cols-12 items-center gap-2 px-3 py-2">
              <div className="col-span-5">
                <Input
                  value={row.description}
                  onChange={(e) => updateRow(row.id, { description: e.target.value })}
                  placeholder="Item description..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => updateRow(row.id, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  className="h-8 text-right text-xs font-mono"
                />
              </div>
              <div className="col-span-2">
                <CurrencyInput
                  value={row.unitPrice}
                  currency={currency}
                  onChange={(val) => updateRow(row.id, { unitPrice: val ?? 0 })}
                  className="[&_input]:h-8 [&_input]:text-xs"
                />
              </div>
              <div className="col-span-2 text-right font-mono text-xs font-medium text-foreground">
                {lineTotal.toLocaleString("en-US")} {currency}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-2.5">
        <Button variant="outline" size="sm" onClick={addRow} className="h-7 gap-1 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add Line
        </Button>
        <div className="text-xs">
          <span className="text-muted-foreground mr-2">Grand Total:</span>
          <span className="font-mono font-semibold text-foreground">
            {grandTotal.toLocaleString("en-US")} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
