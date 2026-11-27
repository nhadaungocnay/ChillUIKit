# ChillUIKit

Open-code **React + TypeScript + Tailwind CSS v4** Design System & App Frame built for **vibecoding** multiple Web, Desktop (Tauri/Electron), and Mobile apps with a unified UX/UI.

## Features
- **77+ Components & Blocks** across `ui/`, `layout/`, `ai/`, and `screens/`.
- **W3C DTCG Design Tokens** (`tokens/primitives.json`, `tokens/semantic.json`) + OKLCH CSS Variables (`src/styles/tokens.css`).
- **5 Brand Theme Presets**: `neutral` (default), `indigo`, `emerald`, `rose`, `amber` — full Light & Dark mode support via `data-theme`.
- **Vibecoding Governance**: `AGENTS.md` + `registry.json` for AI coding agents.
- **Built-in CLI**: Copy tokens and components into any new project in seconds.

## Quick Start (Showcase)
```bash
npm install
npm run dev
```

## Using ChillUIKit CLI in Another App
```bash
# 1. List all available modules
node /Volumes/Data/App/ChillUIKit/bin/chilluikit.mjs list

# 2. Initialize tokens, utils, and AGENTS.md in your new app
node /Volumes/Data/App/ChillUIKit/bin/chilluikit.mjs init --dir /path/to/your-app

# 3. Add specific components
node /Volumes/Data/App/ChillUIKit/bin/chilluikit.mjs add app-shell button data-table multi-select --dir /path/to/your-app
```

## Brand Theme Presets
Set `data-theme` on `<html>`:
```html
<html lang="en" data-theme="indigo">
```
Supported values: `indigo`, `emerald`, `rose`, `amber` (or omit for `neutral`).

## MCP Server (AI Agent Integration)

Add ChillUIKit as a zero-dependency MCP server in Antigravity, Cursor, or Claude Code:

```json
{
  "mcpServers": {
    "chilluikit": {
      "command": "node",
      "args": ["/path/to/ChillUIKit/bin/chilluikit-mcp.mjs"]
    }
  }
}
```

Available MCP tools: `search_components`, `list_components`, `get_component_props`, `get_component_source`, `get_template`, `install_components` (with auto-dependency resolution).

## Two Usage Modes

### Mode 1: Headless CLI + MCP (Recommended for Production & AI Agents)
- **Zero `npm install` required** inside `ChillUIKit` — both `bin/chilluikit.mjs` and `bin/chilluikit-mcp.mjs` use pure Node.js with zero external dependencies (~15–20 MB RAM, 0% idle CPU).
- Clone the repo and point your AI Agent MCP config directly to `bin/chilluikit-mcp.mjs`, or run `node bin/chilluikit.mjs init --dir /path/to/your-app`.

### Mode 2: Visual UI (Showcase, ChillStudio & Live Demo App)
- Only needed when you want to visually browse components, test themes, or use ChillStudio:
  ```bash
  npm install
  npm run build && npm run serve   # Lightweight static host on http://localhost:4173
  ```
