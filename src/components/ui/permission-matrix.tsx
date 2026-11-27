import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type PermissionAction = "view" | "create" | "edit" | "approve" | "delete";

export interface PermissionModule {
  id: string;
  label: string;
  permissions: Record<PermissionAction, boolean>;
}

export interface PermissionMatrixProps {
  modules: PermissionModule[];
  onChange: (modules: PermissionModule[]) => void;
  className?: string;
}

const ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: "view", label: "Xem" },
  { key: "create", label: "Tạo" },
  { key: "edit", label: "Sửa" },
  { key: "approve", label: "Duyệt" },
  { key: "delete", label: "Xóa" },
];

export function PermissionMatrix({ modules, onChange, className }: PermissionMatrixProps) {
  const toggleCell = (moduleId: string, action: PermissionAction) => {
    onChange(
      modules.map((m) =>
        m.id !== moduleId
          ? m
          : { ...m, permissions: { ...m.permissions, [action]: !m.permissions[action] } }
      )
    );
  };

  return (
    <div className={cn("rounded-lg border border-border bg-surface overflow-x-auto", className)}>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Module</th>
            {ACTIONS.map((a) => (
              <th key={a.key} className="px-3 py-2.5 text-center font-medium">
                {a.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {modules.map((mod) => (
            <tr key={mod.id} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-medium text-foreground">{mod.label}</td>
              {ACTIONS.map((a) => (
                <td key={a.key} className="px-3 py-2.5 text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={mod.permissions[a.key]}
                      onCheckedChange={() => toggleCell(mod.id, a.key)}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
