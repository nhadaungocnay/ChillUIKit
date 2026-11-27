import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";
import { SegmentedControl } from "@/components/ui/segmented-control";

export const THEME_PRESETS = [
  { id: "neutral", label: "Neutral", swatch: "bg-zinc-900 dark:bg-zinc-100" },
  { id: "indigo", label: "Indigo", swatch: "bg-indigo-600" },
  { id: "blue", label: "Blue", swatch: "bg-blue-600" },
  { id: "violet", label: "Violet", swatch: "bg-violet-600" },
  { id: "emerald", label: "Emerald", swatch: "bg-emerald-600" },
  { id: "rose", label: "Rose", swatch: "bg-rose-600" },
  { id: "amber", label: "Amber", swatch: "bg-amber-500" },
  { id: "slate", label: "Slate", swatch: "bg-slate-600" },
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];

const RADIUS_OPTIONS = [
  { id: "none", label: "0px", sm: "0px", md: "0px", lg: "0px" },
  { id: "sm", label: "4px", sm: "0.25rem", md: "0.375rem", lg: "0.5rem" },
  { id: "md", label: "8px", sm: "0.375rem", md: "0.5rem", lg: "0.75rem" },
  { id: "lg", label: "12px", sm: "0.5rem", md: "0.75rem", lg: "1rem" },
  { id: "xl", label: "16px", sm: "0.75rem", md: "1rem", lg: "1.25rem" },
] as const;

const FONT_OPTIONS = [
  { id: "inter", label: "Inter", value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: "system", label: "System", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { id: "jakarta", label: "Jakarta", value: "'Plus Jakarta Sans', Inter, sans-serif" },
  { id: "serif", label: "Serif", value: "Georgia, Cambria, 'Times New Roman', serif" },
  { id: "mono", label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
] as const;

const FONT_SCALE_OPTIONS = [
  { id: "compact", label: "13px", size: "13px" },
  { id: "default", label: "14px", size: "14px" },
  { id: "large", label: "16px", size: "16px" },
] as const;

export interface ThemeCustomizerProps {
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  preset: ThemePresetId;
  onPresetChange: (preset: ThemePresetId) => void;
  className?: string;
}

export function ThemeCustomizer({
  dark,
  onDarkChange,
  preset,
  onPresetChange,
  className,
}: ThemeCustomizerProps) {
  const [radiusId, setRadiusId] = React.useState<string>("md");
  const [fontId, setFontId] = React.useState<string>("inter");
  const [fontScaleId, setFontScaleId] = React.useState<string>("default");
  const [customColor, setCustomColor] = React.useState<string>("");

  const applyPreset = (id: ThemePresetId) => {
    setCustomColor("");
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--ring");
    if (id === "neutral") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = id;
    onPresetChange(id);
  };

  const applyRadius = (id: string) => {
    const found = RADIUS_OPTIONS.find((r) => r.id === id);
    if (!found) return;
    setRadiusId(id);
    document.documentElement.style.setProperty("--radius-sm", found.sm);
    document.documentElement.style.setProperty("--radius-md", found.md);
    document.documentElement.style.setProperty("--radius-lg", found.lg);
  };

  const applyCustomColor = (hex: string) => {
    setCustomColor(hex);
    document.documentElement.style.setProperty("--primary", hex);
    document.documentElement.style.setProperty("--ring", hex);
  };

  const applyFont = (id: string) => {
    const found = FONT_OPTIONS.find((f) => f.id === id);
    if (!found) return;
    setFontId(id);
    document.documentElement.style.setProperty("--font-sans", found.value);
  };

  const applyFontScale = (id: string) => {
    const found = FONT_SCALE_OPTIONS.find((s) => s.id === id);
    if (!found) return;
    setFontScaleId(id);
    document.documentElement.style.fontSize = found.size;
  };

  const cssSnippet = customColor
    ? `:root {\n  --primary: ${customColor};\n  --ring: ${customColor};\n  --radius-md: ${RADIUS_OPTIONS.find((r) => r.id === radiusId)?.md ?? "0.5rem"};\n}`
    : `<html lang="en"${preset !== "neutral" ? ` data-theme="${preset}"` : ""}${dark ? ` class="dark"` : ""}>`;

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5 space-y-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Theme Customizer</h3>
          <p className="text-xs text-muted-foreground">
            Drop into any app&apos;s Settings page or copy the preset config.
          </p>
        </div>
        <SegmentedControl
          value={dark ? "dark" : "light"}
          onChange={(v) => onDarkChange(v === "dark")}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>

      {/* Brand Presets */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-foreground">Brand Presets (8)</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THEME_PRESETS.map((t) => {
            const active = !customColor && preset === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => applyPreset(t.id)}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
                  active
                    ? "border-primary bg-background text-foreground"
                    : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn("h-3.5 w-3.5 rounded-full", t.swatch)} />
                  <span>{t.label}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius & Custom Color */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">Border Radius</span>
          <SegmentedControl
            value={radiusId}
            onChange={applyRadius}
            options={RADIUS_OPTIONS.map((r) => ({ value: r.id, label: r.label }))}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">Custom Primary Color</span>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={customColor || "#4f46e5"}
              onChange={(e) => applyCustomColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-border bg-background p-0.5"
            />
            <span className="font-mono text-xs text-muted-foreground">
              {customColor || "Using preset"}
            </span>
          </div>
        </div>
      </div>

      {/* Font Family & Scale */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">Font Family</span>
          <SegmentedControl
            value={fontId}
            onChange={applyFont}
            options={FONT_OPTIONS.map((f) => ({ value: f.id, label: f.label }))}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">Font Scale</span>
          <SegmentedControl
            value={fontScaleId}
            onChange={applyFontScale}
            options={FONT_SCALE_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
          />
        </div>
      </div>

      <CodeBlock code={cssSnippet} language={customColor ? "css" : "html"} />
    </div>
  );
}
