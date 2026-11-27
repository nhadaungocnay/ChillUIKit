import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface QueryRule {
  id: string;
  field: string;
  operator: "=" | "!=" | ">" | "<" | "contains";
  value: string;
}

export interface QueryGroup {
  combinator: "AND" | "OR";
  rules: QueryRule[];
}

export interface QueryBuilderProps {
  value: QueryGroup;
  onChange: (next: QueryGroup) => void;
  fields?: string[];
  className?: string;
}

const DEFAULT_FIELDS = ["Amount", "Department", "Category", "Status", "Requester"];

export function QueryBuilder({
  value,
  onChange,
  fields = DEFAULT_FIELDS,
  className,
}: QueryBuilderProps) {
  const addRule = () => {
    onChange({
      ...value,
      rules: [
        ...value.rules,
        { id: `rule-${Date.now()}`, field: fields[0] ?? "Amount", operator: "=", value: "" },
      ],
    });
  };

  const updateRule = (id: string, patch: Partial<QueryRule>) => {
    onChange({
      ...value,
      rules: value.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const removeRule = (id: string) => {
    onChange({
      ...value,
      rules: value.rules.filter((r) => r.id !== id),
    });
  };

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-3 space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <SegmentedControl
          value={value.combinator}
          onChange={(v) => onChange({ ...value, combinator: v as "AND" | "OR" })}
          options={[
            { value: "AND", label: "AND" },
            { value: "OR", label: "OR" },
          ]}
        />
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={addRule}>
          <Plus className="h-3 w-3" /> Add Rule
        </Button>
      </div>

      <div className="space-y-2">
        {value.rules.map((rule) => (
          <div key={rule.id} className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Select value={rule.field} onValueChange={(v) => updateRule(rule.id, { field: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fields.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Select
                value={rule.operator}
                onValueChange={(v) => updateRule(rule.id, { operator: v as QueryRule["operator"] })}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value="!=">!=</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Input
                value={rule.value}
                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                placeholder="Value..."
                className="h-8 text-xs"
              />
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeRule(rule.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
