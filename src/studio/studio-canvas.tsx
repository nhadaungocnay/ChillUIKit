import * as React from "react";
import { ArrowUp, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/studio/block-renderer";
import { layoutToClassName, layoutToInlineStyle } from "@/studio/layout-classes";
import {
  isContainerType,
  type DropPosition,
  type StudioBlock,
  type StudioBlockProps,
  type StudioBlockType,
} from "@/studio/types";

export interface StudioCanvasProps {
  blocks: StudioBlock[];
  selectedBlockId: string | null;
  previewMode: boolean;
  viewport: "desktop" | "tablet" | "mobile";
  onSelectBlock: (id: string | null) => void;
  onSelectParent: () => void;
  onDropNewBlock: (type: StudioBlockType, index?: number, parentId?: string | null) => void;
  onAddBlockRelative: (type: StudioBlockType, targetId: string, position: DropPosition) => void;
  onMoveNodeRelative: (sourceId: string, targetId: string | null, position: DropPosition) => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, patch: { props?: Partial<StudioBlockProps> }) => void;
}

interface DropIndicator {
  targetId: string;
  position: DropPosition;
}

export function StudioCanvas({
  blocks,
  selectedBlockId,
  previewMode,
  viewport,
  onSelectBlock,
  onSelectParent,
  onDropNewBlock,
  onAddBlockRelative,
  onMoveNodeRelative,
  onDuplicateBlock,
  onDeleteBlock,
  onUpdateBlock,
}: StudioCanvasProps) {
  const [dropIndicator, setDropIndicator] = React.useState<DropIndicator | null>(null);
  const [rootDragOver, setRootDragOver] = React.useState(false);
  const [inlineEditId, setInlineEditId] = React.useState<string | null>(null);
  const [inlineDraft, setInlineDraft] = React.useState("");

  const computeDropPosition = (
    e: React.DragEvent<HTMLElement>,
    isContainer: boolean,
    parentIsRow: boolean
  ): DropPosition => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = parentIsRow
      ? (e.clientX - rect.left) / Math.max(1, rect.width)
      : (e.clientY - rect.top) / Math.max(1, rect.height);
    if (ratio < 0.25) return "before";
    if (ratio > 0.75) return "after";
    return isContainer ? "inside" : ratio < 0.5 ? "before" : "after";
  };

  const handleDropOnNode = (
    e: React.DragEvent,
    targetId: string,
    position: DropPosition
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator(null);
    setRootDragOver(false);

    const newType = e.dataTransfer.getData("application/x-chill-new") as StudioBlockType;
    const moveId = e.dataTransfer.getData("application/x-chill-move");
    if (newType) {
      onAddBlockRelative(newType, targetId, position);
    } else if (moveId) {
      onMoveNodeRelative(moveId, targetId, position);
    }
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator(null);
    setRootDragOver(false);

    const newType = e.dataTransfer.getData("application/x-chill-new") as StudioBlockType;
    const moveId = e.dataTransfer.getData("application/x-chill-move");
    if (newType) {
      onDropNewBlock(newType, undefined, null);
    } else if (moveId) {
      onMoveNodeRelative(moveId, null, "inside");
    }
  };

  const renderNode = (block: StudioBlock, parentIsRow = false): React.ReactNode => {
    if (block.hidden) return null;

    const selected = !previewMode && selectedBlockId === block.id;
    const isContainer = isContainerType(block.type);
    const children = block.children ?? [];
    const thisIsRow = block.layout?.direction === "row" && block.layout?.display !== "grid";

    const isTarget = dropIndicator?.targetId === block.id;
    const dropPos = isTarget ? dropIndicator.position : null;

    const childrenContent = isContainer ? (
      children.length === 0 ? (
        !previewMode && (
          <div className="flex min-h-10 w-full items-center justify-center rounded border border-dashed border-border/70 px-3 py-2 text-[11px] text-muted-foreground">
            Drop inside {block.props.title || block.type}
          </div>
        )
      ) : (
        children.map((child) => renderNode(child, thisIsRow))
      )
    ) : undefined;

    return (
      <div
        key={block.id}
        draggable={!previewMode && inlineEditId !== block.id}
        onDragStart={(e) => {
          if (previewMode) return;
          e.stopPropagation();
          e.dataTransfer.setData("application/x-chill-move", block.id);
        }}
        onDragOver={(e) => {
          if (previewMode) return;
          e.preventDefault();
          e.stopPropagation();
          const pos = computeDropPosition(e, isContainer, parentIsRow);
          setDropIndicator({ targetId: block.id, position: pos });
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          if (dropIndicator?.targetId === block.id) {
            setDropIndicator(null);
          }
        }}
        onDrop={(e) => {
          if (previewMode) return;
          const pos = computeDropPosition(e, isContainer, parentIsRow);
          handleDropOnNode(e, block.id, pos);
        }}
        onClick={(e) => {
          if (previewMode) return;
          e.stopPropagation();
          onSelectBlock(block.id);
        }}
        onDoubleClick={(e) => {
          if (previewMode) return;
          e.stopPropagation();
          setInlineEditId(block.id);
          setInlineDraft(block.props.title);
        }}
        style={layoutToInlineStyle(block.layout)}
        className={cn(
          "relative transition-shadow",
          layoutToClassName(block.layout, isContainer),
          !previewMode && "hover:outline hover:outline-1 hover:outline-primary/40",
          selected && "outline-2 outline-primary z-10",
          dropPos === "inside" && "ring-2 ring-inset ring-primary bg-primary/5"
        )}
      >
        {/* Drop line before */}
        {dropPos === "before" && (
          <div
            className={cn(
              "pointer-events-none absolute z-30 bg-primary rounded-full",
              parentIsRow ? "-left-0.5 top-0 bottom-0 w-0.5" : "-top-0.5 left-0 right-0 h-0.5"
            )}
          />
        )}

        {/* Drop line after */}
        {dropPos === "after" && (
          <div
            className={cn(
              "pointer-events-none absolute z-30 bg-primary rounded-full",
              parentIsRow ? "-right-0.5 top-0 bottom-0 w-0.5" : "-bottom-0.5 left-0 right-0 h-0.5"
            )}
          />
        )}

        {/* Floating Selection Pill (zero layout shift) */}
        {selected && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-6 left-0 z-30 flex items-center gap-1 rounded-t-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow-xs"
          >
            {inlineEditId === block.id ? (
              <input
                autoFocus
                value={inlineDraft}
                onChange={(e) => setInlineDraft(e.target.value)}
                onBlur={() => {
                  onUpdateBlock(block.id, { props: { title: inlineDraft } });
                  setInlineEditId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onUpdateBlock(block.id, { props: { title: inlineDraft } });
                    setInlineEditId(null);
                  } else if (e.key === "Escape") {
                    setInlineEditId(null);
                  }
                }}
                className="h-4 w-28 rounded bg-background px-1 text-[10px] text-foreground outline-none"
              />
            ) : (
              <span className="max-w-32 truncate">{block.props.title || block.type}</span>
            )}
            <button
              type="button"
              title="Select parent (Esc)"
              onClick={onSelectParent}
              className="rounded p-0.5 hover:bg-primary-foreground/20 cursor-pointer"
            >
              <ArrowUp className="h-2.5 w-2.5" />
            </button>
            <button
              type="button"
              title="Duplicate (Cmd+D)"
              onClick={() => onDuplicateBlock(block.id)}
              className="rounded p-0.5 hover:bg-primary-foreground/20 cursor-pointer"
            >
              <Copy className="h-2.5 w-2.5" />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={() => onDeleteBlock(block.id)}
              className="rounded p-0.5 hover:bg-primary-foreground/20 cursor-pointer"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

        {isContainer ? (
          <BlockRenderer block={block} renderChildren={childrenContent} />
        ) : (
          <div className={cn(!previewMode && "pointer-events-none", block.layout?.width === "fill" && "w-full")}>
            <BlockRenderer block={block} />
          </div>
        )}
      </div>
    );
  };

  const viewportWidthClass =
    viewport === "mobile"
      ? "max-w-[390px]"
      : viewport === "tablet"
      ? "max-w-[768px]"
      : "max-w-6xl";

  return (
    <div
      onClick={() => !previewMode && onSelectBlock(null)}
      onDragOver={(e) => {
        if (previewMode) return;
        e.preventDefault();
        setRootDragOver(true);
      }}
      onDragLeave={() => {
        setRootDragOver(false);
        setDropIndicator(null);
      }}
      onDrop={(e) => !previewMode && handleDropOnRoot(e)}
      className={cn(
        "flex-1 overflow-y-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-6",
        rootDragOver && !dropIndicator && "ring-2 ring-inset ring-primary/40"
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-full flex-col rounded-xl border border-border bg-background shadow-xs transition-all overflow-hidden",
          viewportWidthClass
        )}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
            <p className="text-sm font-medium text-foreground">Empty Canvas</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag a Frame, Header Bar, Sidebar, or Component from the left panel.
            </p>
          </div>
        ) : (
          blocks.map((block) => renderNode(block, false))
        )}
      </div>
    </div>
  );
}
