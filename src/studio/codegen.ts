import { layoutToClassName } from "@/studio/layout-classes";
import { isContainerType, type StudioBlock, type StudioPage } from "@/studio/types";

function renderBlockJsx(block: StudioBlock, indent = 6): string {
  if (block.hidden) return "";
  const pad = " ".repeat(indent);
  const { props } = block;
  const isContainer = isContainerType(block.type);
  const cls = layoutToClassName(block.layout, isContainer);
  const styleAttr =
    block.layout?.width === "fixed" && block.layout.fixedWidth
      ? ` style={{ width: ${block.layout.fixedWidth} }}`
      : "";

  if (isContainer && (block.children?.length || ["frame", "container-row", "container-col", "header-bar", "sidebar", "card-frame"].includes(block.type))) {
    const inner = (block.children ?? [])
      .map((c) => renderBlockJsx(c, indent + 2))
      .filter(Boolean)
      .join("\n");
    const tag =
      block.type === "header-bar"
        ? "header"
        : block.type === "sidebar"
        ? "aside"
        : "div";
    return `${pad}<${tag} className="${cls}"${styleAttr}>\n${inner}\n${pad}</${tag}>`;
  }

  let body: string;
  switch (block.type) {
    case "text":
      body = `<span className="text-base font-semibold tracking-tight">${props.title}</span>`;
      break;
    case "badge":
      body = `<Badge variant="${props.variant === "outline" || props.variant === "secondary" || props.variant === "destructive" ? props.variant : "default"}">${props.title}</Badge>`;
      break;
    case "button":
      body = `<Button variant="${props.variant ?? "default"}">${props.title}</Button>`;
      break;
    case "input":
      body = `<FormField label="${props.title}"><Input placeholder="${props.placeholder ?? ""}" /></FormField>`;
      break;
    case "stat-card":
      body = `<StatCard title="${props.title}" value="${props.value ?? "0"}" change="${props.badge ?? ""}" />`;
      break;
    case "data-table":
      body = `<DataTable data={[]} columns={[]} />`;
      break;
    case "chart":
      body = `<Chart title="${props.title}" data={[]} />`;
      break;
    case "prompt-input":
      body = `<PromptInput placeholder="${props.placeholder ?? "Ask AI..."}" onSubmit={() => {}} />`;
      break;
    default:
      body = `<div className="rounded-lg border border-border bg-surface p-3 text-xs">${props.title} (${block.type})</div>`;
  }

  return cls ? `${pad}<div className="${cls}"${styleAttr}>${body}</div>` : `${pad}${body}`;
}

export function generatePageTsx(page: StudioPage): string {
  const componentName =
    page.name.replace(/[^a-zA-Z0-9]/g, "") || "GeneratedPage";
  const body = page.blocks
    .map((b) => renderBlockJsx(b, 6))
    .filter(Boolean)
    .join("\n");

  return `import { Badge, Button, Chart, DataTable, FormField, Input, StatCard } from "@/components/ui";
import { PromptInput } from "@/components/ai";

export function ${componentName}() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
${body}
    </div>
  );
}
`;
}
