import type * as React from "react";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PrintSheetProps {
  companyName?: string;
  title: string;
  code?: string;
  children: React.ReactNode;
  signatures?: string[];
  className?: string;
}

export function PrintSheet({
  companyName = "NHADAUNGOCNAY CORP",
  title,
  code,
  children,
  signatures = ["Người lập phiếu", "Kế toán trưởng", "Giám đốc"],
  className,
}: PrintSheetProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-end print:hidden">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => window.print()}
        >
          <Printer className="h-3.5 w-3.5" />
          In chứng từ (A4)
        </Button>
      </div>

      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-background p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {companyName}
            </p>
            <h2 className="mt-1 text-lg font-bold text-foreground">{title}</h2>
          </div>
          {code && <span className="font-mono text-xs text-muted-foreground">Số: {code}</span>}
        </div>

        <div>{children}</div>

        <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-center text-xs">
          {signatures.map((sig) => (
            <div key={sig} className="space-y-10">
              <p className="font-semibold text-foreground">{sig}</p>
              <p className="text-[11px] text-muted-foreground italic">(Ký, ghi rõ họ tên)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
