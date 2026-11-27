import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ExcelToolbarProps {
  onImport?: () => void;
  onExport?: () => void;
  onDownloadTemplate?: () => void;
  className?: string;
}

export function ExcelToolbar({
  onImport,
  onExport,
  onDownloadTemplate,
  className,
}: ExcelToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {onImport && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onImport}>
          <Upload className="h-3.5 w-3.5" />
          Import Excel
        </Button>
      )}
      {onExport && (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onExport}>
          <Download className="h-3.5 w-3.5" />
          Export Excel
        </Button>
      )}
      {onDownloadTemplate && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground"
          onClick={onDownloadTemplate}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Template
        </Button>
      )}
    </div>
  );
}
