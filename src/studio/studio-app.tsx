import * as React from "react";
import {
  ArrowLeft,
  Code2,
  Download,
  Eye,
  FilePlus2,
  GripVertical,
  Monitor,
  Pencil,
  Plus,
  Redo2,
  RotateCcw,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePageTsx } from "@/studio/codegen";
import { PALETTE_ITEMS, STARTER_TEMPLATES } from "@/studio/defaults";
import { useStudioStore } from "@/studio/store";
import { StudioCanvas } from "@/studio/studio-canvas";
import { StudioInspector } from "@/studio/studio-inspector";
import { StudioLayers } from "@/studio/studio-layers";
import type { StarterTemplateId } from "@/studio/types";

export default function StudioApp({ onExit }: { onExit: () => void }) {
  const store = useStudioStore();
  const [previewMode, setPreviewMode] = React.useState(false);
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [leftTab, setLeftTab] = React.useState<"components" | "layers">("components");
  const [tsxOpen, setTsxOpen] = React.useState(false);
  const [newPageOpen, setNewPageOpen] = React.useState(false);
  const [newPageName, setNewPageName] = React.useState("");
  const [newPageTemplate, setNewPageTemplate] = React.useState<StarterTemplateId>("app-shell");
  const [paletteQuery, setPaletteQuery] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) store.redo();
        else store.undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        store.redo();
      } else if (mod && e.key.toLowerCase() === "d" && store.selectedBlockId) {
        e.preventDefault();
        store.duplicateBlock(store.selectedBlockId);
      } else if ((e.key === "Delete" || e.key === "Backspace") && store.selectedBlockId) {
        e.preventDefault();
        store.deleteBlock(store.selectedBlockId);
      } else if (e.key === "Escape" && store.selectedBlockId) {
        e.preventDefault();
        store.selectParentBlock();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [store]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(store.activeProject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${store.activeProject.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        store.importProjectJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const groups = [
    "Containers",
    "Layout & Nav",
    "Forms & Inputs",
    "Data & Charts",
    "Views & Boards",
    "AI & Agentic",
  ] as const;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="flex h-13 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4">
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">UI Kit</span>
          </Button>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold tracking-tight">ChillStudio</span>
          <Select value={store.activeProject.id} onValueChange={store.selectProject}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {store.projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            title="New Project"
            onClick={() => store.addProject(`App ${store.projects.length + 1}`)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-0.5 mr-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Undo (Cmd+Z)"
              disabled={!store.canUndo}
              onClick={store.undo}
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Redo (Cmd+Shift+Z)"
              disabled={!store.canRedo}
              onClick={store.redo}
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center rounded-md border border-border bg-background p-0.5">
            <Button
              variant={viewport === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              title="Desktop"
              onClick={() => setViewport("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewport === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              title="Tablet"
              onClick={() => setViewport("tablet")}
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewport === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              title="Mobile"
              onClick={() => setViewport("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode((p) => !p)}
            className="h-8 gap-1.5 text-xs"
          >
            {previewMode ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {previewMode ? "Edit" : "Preview"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportJson}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-1.5 text-xs"
            title="Import JSON"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>

          <Button variant="outline" size="sm" onClick={exportJson} className="h-8 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">JSON</span>
          </Button>

          <Button size="sm" onClick={() => setTsxOpen(true)} className="h-8 gap-1.5 text-xs">
            <Code2 className="h-3.5 w-3.5" />
            <span>Export TSX</span>
          </Button>
        </div>
      </header>

      {/* 3-Column Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Pages + Components / Layers */}
        {!previewMode && (
          <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface overflow-y-auto p-3 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pages
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="New Page"
                  onClick={() => {
                    setNewPageName(`Page ${store.activeProject.pages.length + 1}`);
                    setNewPageOpen(true);
                  }}
                >
                  <FilePlus2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1">
                {store.activeProject.pages.map((pg) => (
                  <div
                    key={pg.id}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs cursor-pointer",
                      pg.id === store.activePage.id
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => store.selectPage(pg.id)}
                  >
                    <span className="truncate">{pg.name}</span>
                    {store.activeProject.pages.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          store.deletePage(pg.id);
                        }}
                        className="opacity-60 hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <SegmentedControl
              value={leftTab}
              onChange={(v) => setLeftTab(v as "components" | "layers")}
              options={[
                { value: "components", label: "Components" },
                { value: "layers", label: "Layers" },
              ]}
            />

            {leftTab === "components" ? (
              <div className="space-y-3">
                <Input
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  placeholder="Search components..."
                  className="h-8 text-xs"
                />
                {groups.map((grp) => {
                  const list = PALETTE_ITEMS.filter(
                    (i) =>
                      i.group === grp &&
                      i.label.toLowerCase().includes(paletteQuery.trim().toLowerCase())
                  );
                  if (list.length === 0) return null;
                  return (
                    <div key={grp} className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground">{grp}</p>
                      {list.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("application/x-chill-new", item.type);
                          }}
                          onClick={() => store.addBlock(item.type)}
                          className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-left text-xs text-foreground hover:border-primary/50 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <StudioLayers
                blocks={store.activePage.blocks}
                selectedBlockId={store.selectedBlockId}
                onSelectBlock={store.setSelectedBlockId}
                onToggleVisibility={store.toggleBlockVisibility}
                onDeleteBlock={store.deleteBlock}
                onMoveNodeRelative={store.moveNodeRelative}
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={store.resetDemo}
              className="mt-auto gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Demo
            </Button>
          </aside>
        )}

        {/* Center Canvas */}
        <StudioCanvas
          blocks={store.activePage.blocks}
          selectedBlockId={store.selectedBlockId}
          previewMode={previewMode}
          viewport={viewport}
          onSelectBlock={store.setSelectedBlockId}
          onSelectParent={store.selectParentBlock}
          onDropNewBlock={store.addBlock}
          onAddBlockRelative={store.addBlockRelative}
          onMoveNodeRelative={store.moveNodeRelative}
          onDuplicateBlock={store.duplicateBlock}
          onDeleteBlock={store.deleteBlock}
          onUpdateBlock={store.updateBlock}
        />

        {/* Right Inspector */}
        {!previewMode && (
          <div className="hidden lg:block">
            <StudioInspector
              projectName={store.activeProject.name}
              pageName={store.activePage.name}
              onRenameProject={store.renameProject}
              onRenamePage={(name) => store.renamePage(store.activePage.id, name)}
              block={store.selectedBlock}
              onUpdate={(patch) =>
                store.selectedBlock && store.updateBlock(store.selectedBlock.id, patch)
              }
              onDelete={() =>
                store.selectedBlock && store.deleteBlock(store.selectedBlock.id)
              }
            />
          </div>
        )}
      </div>

      {/* New Page Starter Preset Dialog */}
      <Dialog open={newPageOpen} onOpenChange={setNewPageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Page</DialogTitle>
            <DialogDescription>
              Start from a blank Auto-Layout canvas or an open starter preset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Page name..."
            />
            <div className="grid grid-cols-1 gap-2">
              {STARTER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setNewPageTemplate(tpl.id)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors cursor-pointer",
                    newPageTemplate === tpl.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <p className="text-xs font-semibold text-foreground">{tpl.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{tpl.description}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setNewPageOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  store.addPage(newPageName, newPageTemplate);
                  setNewPageOpen(false);
                }}
              >
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export TSX Dialog */}
      <Dialog open={tsxOpen} onOpenChange={setTsxOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export TSX — {store.activePage.name}</DialogTitle>
            <DialogDescription>
              Copy this ChillUIKit React code directly into your application.
            </DialogDescription>
          </DialogHeader>
          <CodeBlock code={generatePageTsx(store.activePage)} language="tsx" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
