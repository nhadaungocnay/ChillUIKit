import * as React from "react";
import { FlowInspector } from "@/components/flow/flow-inspector";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  isContainerType,
  type BlockVariant,
  type LayoutAlign,
  type LayoutBorder,
  type LayoutDirection,
  type LayoutDisplay,
  type LayoutGridRatio,
  type LayoutJustify,
  type LayoutRadius,
  type LayoutShadow,
  type LayoutSizeMode,
  type LayoutStyle,
  type LayoutSurface,
  type StudioBlock,
  type StudioBlockProps,
} from "@/studio/types";

export interface StudioInspectorProps {
  projectName: string;
  pageName: string;
  onRenameProject: (name: string) => void;
  onRenamePage: (name: string) => void;
  block: StudioBlock | null;
  onUpdate: (patch: {
    layout?: Partial<LayoutStyle>;
    props?: Partial<StudioBlockProps>;
  }) => void;
  onDelete: () => void;
}

export function StudioInspector({
  projectName,
  pageName,
  onRenameProject,
  onRenamePage,
  block,
  onUpdate,
  onDelete,
}: StudioInspectorProps) {
  const [tab, setTab] = React.useState<"design" | "props">("design");

  if (!block) {
    return (
      <FlowInspector title="Page Settings" subtitle="No layer selected">
        <FormField label="Project Name">
          <Input value={projectName} onChange={(e) => onRenameProject(e.target.value)} />
        </FormField>
        <FormField label="Page Name">
          <Input value={pageName} onChange={(e) => onRenamePage(e.target.value)} />
        </FormField>
        <p className="text-xs text-muted-foreground">
          Select any frame or component on the canvas or Layers tree to edit its layout, tokens, or props.
        </p>
      </FlowInspector>
    );
  }

  const isContainer = isContainerType(block.type);
  const layout = block.layout ?? {};
  const setLayout = (patch: Partial<LayoutStyle>) => onUpdate({ layout: patch });

  return (
    <FlowInspector
      title={block.props.title || block.type}
      subtitle={block.type}
      footer={
        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
          Delete Layer
        </Button>
      }
    >
      <SegmentedControl
        value={tab}
        onChange={(v) => setTab(v as "design" | "props")}
        options={[
          { value: "design", label: "Design" },
          { value: "props", label: "Props" },
        ]}
      />

      {tab === "design" ? (
        <div className="space-y-4 pt-1">
          {isContainer && (
            <div className="space-y-3 border-b border-border pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Auto Layout
              </p>

              <FormField label="Display">
                <SegmentedControl
                  value={layout.display ?? "flex"}
                  onChange={(v) => setLayout({ display: v as LayoutDisplay })}
                  options={[
                    { value: "flex", label: "Flex" },
                    { value: "grid", label: "Grid" },
                  ]}
                />
              </FormField>

              {(layout.display ?? "flex") === "flex" ? (
                <>
                  <FormField label="Direction">
                    <SegmentedControl
                      value={layout.direction ?? "col"}
                      onChange={(v) => setLayout({ direction: v as LayoutDirection })}
                      options={[
                        { value: "row", label: "Row →" },
                        { value: "col", label: "Col ↓" },
                      ]}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="Align">
                      <Select
                        value={layout.align ?? "stretch"}
                        onValueChange={(v) => setLayout({ align: v as LayoutAlign })}
                      >
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="stretch">Stretch</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Justify">
                      <Select
                        value={layout.justify ?? "start"}
                        onValueChange={(v) => setLayout({ justify: v as LayoutJustify })}
                      >
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="between">Between</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </>
              ) : (
                <>
                  <FormField label="Grid Ratio">
                    <SegmentedControl
                      value={layout.gridRatio ?? "equal"}
                      onChange={(v) => setLayout({ gridRatio: v as LayoutGridRatio })}
                      options={[
                        { value: "equal", label: "Equal" },
                        { value: "2:1", label: "2:1" },
                        { value: "1:2", label: "1:2" },
                        { value: "3:1", label: "3:1" },
                      ]}
                    />
                  </FormField>
                  {(layout.gridRatio ?? "equal") === "equal" && (
                    <FormField label="Grid Columns">
                      <SegmentedControl
                        value={String(layout.gridCols ?? 3)}
                        onChange={(v) => setLayout({ gridCols: Number(v) as 1 | 2 | 3 | 4 })}
                        options={[
                          { value: "1", label: "1" },
                          { value: "2", label: "2" },
                          { value: "3", label: "3" },
                          { value: "4", label: "4" },
                        ]}
                      />
                    </FormField>
                  )}
                </>
              )}

              <FormField label="Gap (4px grid)">
                <Select
                  value={String(layout.gap ?? 3)}
                  onValueChange={(v) => setLayout({ gap: Number(v) as LayoutStyle["gap"] })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 (0px)</SelectItem>
                    <SelectItem value="1">1 (4px)</SelectItem>
                    <SelectItem value="2">2 (8px)</SelectItem>
                    <SelectItem value="3">3 (12px)</SelectItem>
                    <SelectItem value="4">4 (16px)</SelectItem>
                    <SelectItem value="6">6 (24px)</SelectItem>
                    <SelectItem value="8">8 (32px)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          )}

          {/* Sizing */}
          <div className="space-y-3 border-b border-border pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sizing & Spacing
            </p>

            <FormField label="Width">
              <SegmentedControl
                value={layout.width ?? (isContainer ? "fill" : "hug")}
                onChange={(v) => setLayout({ width: v as LayoutSizeMode })}
                options={[
                  { value: "fill", label: "Fill" },
                  { value: "hug", label: "Hug" },
                  { value: "fixed", label: "Fixed" },
                ]}
              />
            </FormField>

            {layout.width === "fixed" && (
              <FormField label="Fixed Width (px)">
                <Input
                  type="number"
                  value={layout.fixedWidth ?? 240}
                  onChange={(e) => setLayout({ fixedWidth: Number(e.target.value) || 240 })}
                />
              </FormField>
            )}

            <FormField label="Padding">
              <Select
                value={String(layout.padding ?? 0)}
                onValueChange={(v) => setLayout({ padding: Number(v) as LayoutStyle["padding"] })}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (0px)</SelectItem>
                  <SelectItem value="2">2 (8px)</SelectItem>
                  <SelectItem value="3">3 (12px)</SelectItem>
                  <SelectItem value="4">4 (16px)</SelectItem>
                  <SelectItem value="6">6 (24px)</SelectItem>
                  <SelectItem value="8">8 (32px)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Surface Tokens */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Surface & Border
            </p>

            <div className="grid grid-cols-2 gap-2">
              <FormField label="Surface">
                <Select
                  value={layout.surface ?? "transparent"}
                  onValueChange={(v) => setLayout({ surface: v as LayoutSurface })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transparent">Transparent</SelectItem>
                    <SelectItem value="background">Background</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Border">
                <Select
                  value={layout.border ?? "none"}
                  onValueChange={(v) => setLayout({ border: v as LayoutBorder })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="b">Bottom</SelectItem>
                    <SelectItem value="r">Right</SelectItem>
                    <SelectItem value="t">Top</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Radius">
                <Select
                  value={layout.radius ?? "none"}
                  onValueChange={(v) => setLayout({ radius: v as LayoutRadius })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">SM</SelectItem>
                    <SelectItem value="md">MD</SelectItem>
                    <SelectItem value="lg">LG</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Shadow">
                <Select
                  value={layout.shadow ?? "none"}
                  onValueChange={(v) => setLayout({ shadow: v as LayoutShadow })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="sm">SM</SelectItem>
                    <SelectItem value="md">MD</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <FormField label="Title / Label">
            <Input
              value={block.props.title}
              onChange={(e) => onUpdate({ props: { title: e.target.value } })}
            />
          </FormField>

          {block.props.subtitle !== undefined && (
            <FormField label="Subtitle / Description">
              <Input
                value={block.props.subtitle}
                onChange={(e) => onUpdate({ props: { subtitle: e.target.value } })}
              />
            </FormField>
          )}

          {block.props.placeholder !== undefined && (
            <FormField label="Placeholder">
              <Input
                value={block.props.placeholder}
                onChange={(e) => onUpdate({ props: { placeholder: e.target.value } })}
              />
            </FormField>
          )}

          {block.props.value !== undefined && (
            <FormField label="Value / Command">
              <Input
                value={block.props.value}
                onChange={(e) => onUpdate({ props: { value: e.target.value } })}
              />
            </FormField>
          )}

          {block.props.badge !== undefined && (
            <FormField label="Badge">
              <Input
                value={block.props.badge}
                onChange={(e) => onUpdate({ props: { badge: e.target.value } })}
              />
            </FormField>
          )}

          {block.props.buttonLabel !== undefined && (
            <FormField label="Button Label">
              <Input
                value={block.props.buttonLabel}
                onChange={(e) => onUpdate({ props: { buttonLabel: e.target.value } })}
              />
            </FormField>
          )}

          {block.props.variant !== undefined && (
            <FormField label="Variant">
              <Select
                value={block.props.variant}
                onValueChange={(v) => onUpdate({ props: { variant: v as BlockVariant } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          )}

          {block.props.itemsText !== undefined && (
            <FormField
              label="Items / Fields / Options"
              description="One per line (use Key: Value for pairs)"
            >
              <Textarea
                rows={4}
                value={block.props.itemsText}
                onChange={(e) => onUpdate({ props: { itemsText: e.target.value } })}
              />
            </FormField>
          )}
        </div>
      )}
    </FlowInspector>
  );
}
