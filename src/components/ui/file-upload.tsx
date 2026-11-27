import * as React from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  files,
  onFilesChange,
  accept,
  multiple = true,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 px-4 py-6 text-center transition-colors hover:bg-muted/50",
          dragging && "border-primary bg-muted"
        )}
      >
        <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : "Any file type"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, idx) => (
            <li
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-1.5 text-xs"
            >
              <span className="flex items-center gap-2 truncate">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{f.name}</span>
              </span>
              <button
                type="button"
                onClick={() => onFilesChange(files.filter((_, i) => i !== idx))}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
