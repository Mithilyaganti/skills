#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const indexPath = path.join(root, "skills.json");
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function exists(file) {
  return fs.existsSync(file);
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function parseFrontmatter(text, file) {
  const normalized = text.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) {
    errors.push(`${rel(file)}: missing opening frontmatter delimiter`);
    return null;
  }
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    errors.push(`${rel(file)}: missing closing frontmatter delimiter`);
    return null;
  }
  const raw = normalized.slice(4, end).trim();
  const data = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      errors.push(`${rel(file)}: invalid frontmatter line: ${line}`);
      continue;
    }
    data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return data;
}

function checkLinks(file, text) {
  const dir = path.dirname(file);
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith("#") || /^[a-z]+:/i.test(target)) continue;
    const clean = target.split("#")[0];
    if (!clean) continue;
    const resolved = path.resolve(dir, clean);
    if (!exists(resolved)) {
      errors.push(`${rel(file)}: broken link to ${target}`);
    }
  }
}

if (!exists(indexPath)) {
  errors.push("skills.json missing");
} else {
  let index;
  try {
    index = JSON.parse(read(indexPath));
  } catch (error) {
    errors.push(`skills.json invalid JSON: ${error.message}`);
  }
  if (index) {
    if (!Array.isArray(index.skills))
      errors.push("skills.json: skills must be an array");
    for (const entry of index.skills || []) {
      if (!entry.name || !entry.path) {
        errors.push("skills.json: every skill entry needs name and path");
        continue;
      }
      const file = path.join(root, entry.path);
      if (!exists(file)) {
        errors.push(`skills.json: missing ${entry.path}`);
        continue;
      }
      const dirName = path.basename(path.dirname(file));
      if (dirName !== entry.name) {
        errors.push(
          `${entry.path}: directory name ${dirName} does not match index name ${entry.name}`,
        );
      }
    }
  }
}

const skillsRoot = path.join(root, "skills");
const skillFiles = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(skillsRoot, d.name, "SKILL.md"));

if (skillFiles.length === 0) errors.push("No vc-*/SKILL.md files found");

const bannedRuntimePatterns = [
  {
    pattern: /Integrated source decision/i,
    label: "Integrated source decision",
  },
  { pattern: /\/ce-[A-Za-z0-9_-]+/, label: "legacy /ce-* command" },
  { pattern: /\/grill-with-docs|\/grill-me/, label: "legacy grill command" },
  {
    pattern: /\/to-issues|\/to-prd|\/triage|\/tdd|\/diagnose/,
    label: "legacy Pocock slash command",
  },
  {
    pattern: /\/vc-spec|\/vc-run|\/vc-judge/,
    label: "old Vector Cadence command name",
  },
];

for (const file of skillFiles) {
  if (!exists(file)) {
    errors.push(`${rel(file)} missing`);
    continue;
  }
  const text = read(file);
  const lines = text.split(/\r?\n/).length;
  const fm = parseFrontmatter(text, file);
  const dirName = path.basename(path.dirname(file));

  if (fm) {
    if (fm.name !== dirName)
      errors.push(
        `${rel(file)}: name ${fm.name || "<missing>"} does not match directory ${dirName}`,
      );
    if (!fm.description) errors.push(`${rel(file)}: missing description`);
    if (fm.description && fm.description.length > 1024)
      errors.push(`${rel(file)}: description exceeds 1024 chars`);
    if (fm.description && !/Use when/i.test(fm.description))
      warnings.push(
        `${rel(file)}: description should include "Use when" trigger language`,
      );
  }

  if (lines > 170)
    warnings.push(
      `${rel(file)}: ${lines} lines; consider shortening below 170`,
    );
  if (!/^## Purpose/m.test(text))
    warnings.push(`${rel(file)}: missing ## Purpose`);
  if (!/^## When to use/m.test(text))
    warnings.push(`${rel(file)}: missing ## When to use`);
  if (!/^## When to skip/m.test(text))
    warnings.push(`${rel(file)}: missing ## When to skip`);
  if (!/^## Workflow/m.test(text))
    warnings.push(`${rel(file)}: missing ## Workflow`);
  if (!/^## Output/m.test(text))
    warnings.push(`${rel(file)}: missing ## Output`);
  if (!/^## Guardrails/m.test(text))
    warnings.push(`${rel(file)}: missing ## Guardrails`);

  for (const { pattern, label } of bannedRuntimePatterns) {
    if (pattern.test(text))
      errors.push(`${rel(file)}: banned runtime phrase found: ${label}`);
  }

  checkLinks(file, text);
}

for (const file of fs.readdirSync(root, { recursive: true })) {
  const filePathStr = file.toString().replaceAll("\\", "/");
  if (
    filePathStr.includes("node_modules") ||
    filePathStr.includes(".git") ||
    path.basename(filePathStr).startsWith("session-")
  ) {
    continue;
  }
  const full = path.join(root, file.toString());
  if (exists(full) && fs.statSync(full).isFile() && full.endsWith(".md")) {
    checkLinks(full, read(full));
  }
}

console.log(`Checked ${skillFiles.length} skills.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nValidation passed.");
