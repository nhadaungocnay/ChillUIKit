#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function readRegistry() {
  return JSON.parse(fs.readFileSync(path.join(rootDir, "registry.json"), "utf8"));
}

const GROUPS = ["layout", "ui", "ai", "screens"];

const TOOLS = [
  {
    name: "recommend_design",
    description: "Get ChillUIKit design intelligence (recommended layouts, theme, font pairing, components, chart/motion rules, and UX checklist) for a product domain.",
    inputSchema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: ["erp-finance", "saas-dashboard", "ai-copilot", "admin-rbac", "crm-sales", "auth-onboarding"],
          description: "Target application domain. Omit to list all supported domains.",
        },
      },
    },
  },
  {
    name: "search_components",
    description: "Search ChillUIKit components and layouts by keyword (e.g. 'table', 'audit', 'layout', 'currency').",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword to match against module names." },
      },
      required: ["query"],
    },
  },
  {
    name: "list_components",
    description: "List all available ChillUIKit components and layouts by group.",
    inputSchema: {
      type: "object",
      properties: {
        group: {
          type: "string",
          enum: ["layout", "ui", "ai", "screens"],
          description: "Optional group filter.",
        },
      },
    },
  },
  {
    name: "get_component_props",
    description: "Batch-fetch compact TypeScript props/interfaces and function signatures for one or more components (~80% fewer tokens than full source).",
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string" },
          description: "List of component names (e.g. ['detail-layout', 'editable-line-items']).",
        },
      },
      required: ["names"],
    },
  },
  {
    name: "get_component_source",
    description: "Get the full TypeScript/TSX source code and props of a ChillUIKit component.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Module kebab-case name (e.g. detail-layout, audit-log, data-table).",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_template",
    description: "Get ChillUIKit design rules (AGENTS.md), page templates, or the full Expense Demo App.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          enum: ["rules", "templates", "demo-app"],
          description: "Template or reference to retrieve.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "install_components",
    description: "Copy ChillUIKit base tokens/utils/AGENTS.md and requested components into a target project.",
    inputSchema: {
      type: "object",
      properties: {
        targetDir: { type: "string", description: "Absolute path to the target project root." },
        init: { type: "boolean", description: "Also copy tokens.css, globals.css, utils.ts, and AGENTS.md." },
        names: {
          type: "array",
          items: { type: "string" },
          description: "Component names to install (e.g. ['detail-layout', 'audit-log']).",
        },
      },
      required: ["targetDir"],
    },
  },
];

function copyRel(relSrc, targetDir) {
  const src = path.join(rootDir, relSrc);
  const dest = path.join(targetDir, relSrc);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return relSrc;
}

function extractPropsSummary(code) {
  const blocks = [];
  const lines = code.split("\n");
  let capturing = false;
  let depth = 0;
  let buf = [];

  for (const line of lines) {
    if (!capturing) {
      if (/^export (type|interface) /.test(line)) {
        if (line.includes("{") && !line.includes("}")) {
          capturing = true;
          depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
          buf = [line];
        } else {
          blocks.push(line);
        }
      } else if (/^export function /.test(line)) {
        blocks.push(line.replace(/\{[\s\S]*$/, "").trim());
      }
    } else {
      buf.push(line);
      depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth <= 0) {
        blocks.push(buf.join("\n"));
        capturing = false;
        buf = [];
      }
    }
  }
  return blocks.join("\n\n");
}

function resolveComponentDeps(modName, registry, visited = new Set()) {
  if (visited.has(modName)) return [];
  const group = GROUPS.find((g) => (registry[g] ?? []).includes(modName));
  if (!group) return [];
  visited.add(modName);

  const relPath = `src/components/${group}/${modName}.tsx`;
  const code = fs.readFileSync(path.join(rootDir, relPath), "utf8");
  const files = [relPath];

  const importRe = /from\s+["']@\/components\/(?:ui|layout|ai|screens)\/([a-z0-9-]+)["']/g;
  let match;
  while ((match = importRe.exec(code)) !== null) {
    files.push(...resolveComponentDeps(match[1], registry, visited));
  }
  return files;
}

function handleToolCall(name, args = {}) {
  const registry = readRegistry();

  if (name === "recommend_design") {
    const rules = JSON.parse(fs.readFileSync(path.join(rootDir, "design-rules.json"), "utf8"));
    const domainKey = args.domain ? String(args.domain) : null;
    if (!domainKey) {
      const summary = Object.entries(rules.domains)
        .map(([k, v]) => `- ${k}: ${v.label}`)
        .join("\n");
      return { content: [{ type: "text", text: `Available domains:\n${summary}` }] };
    }
    const domainRule = rules.domains[domainKey];
    if (!domainRule) {
      return { isError: true, content: [{ type: "text", text: `Unknown domain: ${domainKey}` }] };
    }
    const payload = {
      domain: domainKey,
      ...domainRule,
      chartRules: rules.chartRules,
      motionRules: rules.motionRules,
      uxChecklist: rules.uxChecklist,
      deepRules: rules.deepRules,
    };
    return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
  }

  if (name === "search_components") {
    const q = String(args.query || "").trim().toLowerCase();
    const matches = [];
    for (const g of GROUPS) {
      for (const item of registry[g] ?? []) {
        if (item.toLowerCase().includes(q)) {
          matches.push(`${item} (@/components/${g}/${item})`);
        }
      }
    }
    return {
      content: [
        {
          type: "text",
          text: matches.length > 0 ? matches.join("\n") : `No components matching "${args.query}".`,
        },
      ],
    };
  }

  if (name === "list_components") {
    const targetGroups = args.group ? [args.group] : GROUPS;
    const lines = targetGroups.map((g) => `${g.toUpperCase()} (${(registry[g] ?? []).length}): ${(registry[g] ?? []).join(", ")}`);
    return { content: [{ type: "text", text: lines.join("\n\n") }] };
  }

  if (name === "get_component_props") {
    const names = Array.isArray(args.names) ? args.names : [];
    const sections = names.map((modName) => {
      const group = GROUPS.find((g) => (registry[g] ?? []).includes(modName));
      if (!group) return `// Unknown component: ${modName}`;
      const filePath = path.join(rootDir, `src/components/${group}/${modName}.tsx`);
      const code = fs.readFileSync(filePath, "utf8");
      return `// @/components/${group}/${modName}\n${extractPropsSummary(code)}`;
    });
    return { content: [{ type: "text", text: sections.join("\n\n---\n\n") }] };
  }

  if (name === "get_component_source") {
    const modName = String(args.name || "");
    const group = GROUPS.find((g) => (registry[g] ?? []).includes(modName));
    if (!group) {
      return { isError: true, content: [{ type: "text", text: `Unknown component: ${modName}` }] };
    }
    const filePath = path.join(rootDir, `src/components/${group}/${modName}.tsx`);
    const code = fs.readFileSync(filePath, "utf8");
    return { content: [{ type: "text", text: `// src/components/${group}/${modName}.tsx\n${code}` }] };
  }

  if (name === "get_template") {
    const map = {
      rules: "AGENTS.md",
      templates: "src/components/showcase/templates-showcase.tsx",
      "demo-app": "src/demo/expense-demo-app.tsx",
    };
    const rel = map[args.name];
    if (!rel) {
      return { isError: true, content: [{ type: "text", text: `Unknown template: ${args.name}` }] };
    }
    const content = fs.readFileSync(path.join(rootDir, rel), "utf8");
    return { content: [{ type: "text", text: content }] };
  }

  if (name === "install_components") {
    const targetDir = path.resolve(String(args.targetDir || ""));
    const copied = [];
    if (args.init) {
      for (const f of ["src/styles/tokens.css", "src/styles/globals.css", "src/lib/utils.ts", "AGENTS.md"]) {
        copied.push(copyRel(f, targetDir));
      }
    }
    const visited = new Set();
    const toCopy = new Set();
    for (const modName of args.names ?? []) {
      for (const rel of resolveComponentDeps(modName, registry, visited)) {
        toCopy.add(rel);
      }
    }
    for (const rel of toCopy) {
      copied.push(copyRel(rel, targetDir));
    }
    return {
      content: [{ type: "text", text: `Installed ${copied.length} file(s) into ${targetDir}:\n${copied.join("\n")}` }],
    };
  }

  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
}

function send(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  if (!line.trim()) return;
  let req;
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }

  if (req.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: req.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "chilluikit-mcp", version: "0.5.0" },
      },
    });
  } else if (req.method === "notifications/initialized") {
    // no-op
  } else if (req.method === "tools/list") {
    send({ jsonrpc: "2.0", id: req.id, result: { tools: TOOLS } });
  } else if (req.method === "tools/call") {
    const result = handleToolCall(req.params?.name, req.params?.arguments);
    send({ jsonrpc: "2.0", id: req.id, result });
  } else if (req.id !== undefined) {
    send({ jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `Method not found: ${req.method}` } });
  }
});
