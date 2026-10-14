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

function parseScalar(raw) {
  const value = raw.trim();
  const quoted = value.match(/^(['"])([\s\S]*)\1$/);
  if (quoted) return quoted[2];
  return value;
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
  let nested = false;
  for (const line of raw.split(/\r?\n/)) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    if (/^\s+\S/.test(line)) {
      nested = true;
      continue;
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      errors.push(`${rel(file)}: invalid frontmatter line: ${line}`);
      continue;
    }
    data[match[1]] = parseScalar(match[2]);
  }
  return { data, nested };
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

// DeepSeek Harness skill rules, mirrored from @deepseek-ai/dsh-skill and
// @deepseek-ai/dsh-skill-filesystem. A violation of a hard rule makes the whole
// skill invisible to DSH discovery instead of merely degrading it.
const DSH_SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DSH_CATALOG_DESCRIPTION_MAX = 500;
const DSH_LEGACY_INVOCATION_KEYS = [
  ["disableModelInvocation", "disable-model-invocation"],
  ["modelInvocable", "disable-model-invocation"],
  ["userInvocable", "user-invocable"],
];
const DSH_BOOLEAN_KEYS = ["disable-model-invocation", "user-invocable"];
const DSH_BOOLEAN_VALUES = new Set([
  "true",
  "false",
  "yes",
  "no",
  "on",
  "off",
  "1",
  "0",
]);

function checkDshFrontmatter(fm, file) {
  const data = fm.data;
  if (fm.nested) {
    warnings.push(
      `${rel(file)}: frontmatter has nested/indented values; keep skill frontmatter flat so every loader parses it identically`,
    );
  }
  if (data.name && !DSH_SKILL_NAME.test(data.name))
    errors.push(
      `${rel(file)}: name "${data.name}" is not kebab-case; DeepSeek Harness requires /^[a-z0-9]+(?:-[a-z0-9]+)*$/`,
    );
  for (const [legacy, canonical] of DSH_LEGACY_INVOCATION_KEYS) {
    if (Object.hasOwn(data, legacy))
      errors.push(
        `${rel(file)}: frontmatter field "${legacy}" is unsupported by DeepSeek Harness; use "${canonical}"`,
      );
  }
  for (const key of DSH_BOOLEAN_KEYS) {
    if (!Object.hasOwn(data, key)) continue;
    const value = String(data[key]).toLowerCase();
    if (!DSH_BOOLEAN_VALUES.has(value))
      errors.push(
        `${rel(file)}: "${key}" must be a boolean (true/false, yes/no, on/off, 1/0); DeepSeek Harness drops the whole skill otherwise`,
      );
  }
  if (Object.hasOwn(data, "whenToUse") && !String(data.whenToUse).trim())
    warnings.push(`${rel(file)}: "whenToUse" is present but empty; omit it instead`);
  if (Object.hasOwn(data, "metadata"))
    warnings.push(
      `${rel(file)}: "metadata" must be a YAML mapping for DeepSeek Harness; verify it parses as one`,
    );
  if (
    data.description &&
    data.description.length > DSH_CATALOG_DESCRIPTION_MAX
  )
    warnings.push(
      `${rel(file)}: description is ${data.description.length} chars; DeepSeek Harness truncates the catalog entry at ${DSH_CATALOG_DESCRIPTION_MAX}`,
    );
}

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
    const data = fm.data;
    if (data.name !== dirName)
      errors.push(
        `${rel(file)}: name ${data.name || "<missing>"} does not match directory ${dirName}`,
      );
    if (!data.description) errors.push(`${rel(file)}: missing description`);
    if (data.description && data.description.length > 1024)
      errors.push(`${rel(file)}: description exceeds 1024 chars`);
    if (data.description && !/Use when/i.test(data.description))
      warnings.push(
        `${rel(file)}: description should include "Use when" trigger language`,
      );
    checkDshFrontmatter(fm, file);
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

console.log(
  `Checked ${skillFiles.length} skills (including DeepSeek Harness frontmatter rules).`,
);
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
