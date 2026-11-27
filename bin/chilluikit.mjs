#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const registry = JSON.parse(fs.readFileSync(path.join(rootDir, "registry.json"), "utf8"));

const args = process.argv.slice(2);
const cmd = args[0];

const dirFlagIdx = args.indexOf("--dir");
const targetDir =
  dirFlagIdx !== -1 && args[dirFlagIdx + 1]
    ? path.resolve(args[dirFlagIdx + 1])
    : process.cwd();

function copyFile(relSrc, relDest = relSrc) {
  const src = path.join(rootDir, relSrc);
  const dest = path.join(targetDir, relDest);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  + ${relDest}`);
}

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(`ChillUIKit CLI v${registry.version}

Usage:
  chilluikit list                  List all available modules
  chilluikit init [--dir <path>]   Copy tokens, utils, and AGENTS.md
  chilluikit add <name...> [--dir <path>]  Add components by name
`);
  process.exit(0);
}

if (cmd === "list") {
  for (const group of ["layout", "ui", "ai", "screens"]) {
    const items = registry[group] ?? [];
    console.log(`\n${group.toUpperCase()} (${items.length}):`);
    console.log(`  ${items.join(", ")}`);
  }
  process.exit(0);
}

if (cmd === "init") {
  console.log(`Initializing ChillUIKit in ${targetDir}...`);
  copyFile("src/styles/tokens.css");
  copyFile("src/styles/globals.css");
  copyFile("src/lib/utils.ts");
  copyFile("AGENTS.md");
  console.log("Done! Install base deps: npm i clsx tailwind-merge class-variance-authority lucide-react");
  process.exit(0);
}

if (cmd === "add") {
  const names = args.slice(1).filter((a, i) => a !== "--dir" && args[i] !== "--dir");
  if (names.length === 0) {
    console.error("Specify at least one component name, e.g.: chilluikit add button app-shell");
    process.exit(1);
  }
  const groups = ["ui", "layout", "ai", "screens"];
  for (const name of names) {
    const foundGroup = groups.find((g) => (registry[g] ?? []).includes(name));
    if (!foundGroup) {
      console.error(`  ! Unknown module: ${name}`);
      continue;
    }
    copyFile(`src/components/${foundGroup}/${name}.tsx`);
  }
  console.log("Done!");
  process.exit(0);
}

console.error(`Unknown command: ${cmd}`);
process.exit(1);
