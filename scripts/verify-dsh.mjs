#!/usr/bin/env node
/**
 * Verify this suite against a locally installed DeepSeek Harness (DSH).
 *
 * Unlike `validate-skills.mjs`, this script does not re-implement DSH's rules.
 * It loads DSH's own `@deepseek-ai/dsh-skill-filesystem` provider and the
 * `@deepseek-ai/dsh-skill` name grammar from the local DSH install and runs the
 * real discovery path over the installed skills root, so a pass means the
 * running harness will actually see these skills in its catalog.
 *
 * Usage:
 *   node scripts/verify-dsh.mjs                 # verify the installed DSH home
 *   node scripts/verify-dsh.mjs --root <dir>    # verify an arbitrary skills root
 *   DSH_SKILL_ROOT=<dir> node scripts/verify-dsh.mjs
 *
 * Exits 0 when compatible, 1 on a real incompatibility, and 0 with a SKIPPED
 * notice when no local DSH install can be found.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

function parseArgs(argv) {
  const options = { root: process.env.DSH_SKILL_ROOT, dshHome: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") options.root = argv[++index];
    else if (arg === "--dsh-home") options.dshHome = argv[++index];
  }
  return options;
}

function resolveDshHome(explicit) {
  if (explicit) return path.resolve(explicit);
  const configured = process.env.DSH_HOME;
  if (typeof configured === "string" && configured.trim() !== "") {
    return path.resolve(configured.trim());
  }
  return path.join(os.homedir(), ".dsh");
}

function findDshModules(dshHome) {
  const candidates = [
    process.env.DSH_VERIFY_MODULES,
    path.join(dshHome, "profiles", "node_modules", "@deepseek-ai"),
    path.join(dshHome, "node_modules", "@deepseek-ai"),
  ].filter((value) => typeof value === "string" && value !== "");
  for (const dir of candidates) {
    if (
      fs.existsSync(path.join(dir, "dsh-skill-filesystem", "lib", "index.js")) &&
      fs.existsSync(path.join(dir, "dsh-skill", "lib", "index.js"))
    ) {
      return dir;
    }
  }
  return undefined;
}

const options = parseArgs(process.argv.slice(2));
const dshHome = resolveDshHome(options.dshHome);
const modulesDir = findDshModules(dshHome);

if (modulesDir === undefined) {
  console.log(
    `SKIPPED: no local DeepSeek Harness packages found under ${dshHome}.\n` +
      "Run this check on a machine with DeepSeek Harness Desktop or the DSH CLI installed,\n" +
      "or point DSH_VERIFY_MODULES at an @deepseek-ai node_modules directory.",
  );
  process.exit(0);
}

const skillsRoot = path.resolve(options.root ?? path.join(dshHome, "skills"));

/** Whether `child` is `parent` or lives beneath it, comparing resolved paths. */
function isUnder(child, parent) {
  const from = path.resolve(parent);
  const to = path.resolve(child);
  if (from === to) return true;
  const withSep = from.endsWith(path.sep) ? from : from + path.sep;
  return to.startsWith(withSep);
}

const skillUrl = pathToFileURL(
  path.join(modulesDir, "dsh-skill", "lib", "index.js"),
).href;
const providerUrl = pathToFileURL(
  path.join(modulesDir, "dsh-skill-filesystem", "lib", "index.js"),
).href;

const { isSkillName } = await import(skillUrl);
const { FileSystemSkillProvider } = await import(providerUrl);

// The provider only needs a logger and a filesystem-service probe from ctx.
const providerWarnings = [];
const ctx = {
  logger: {
    warn: (message) => providerWarnings.push(String(message)),
    info: () => {},
    debug: () => {},
    error: (message) => providerWarnings.push(String(message)),
  },
  get: () => undefined,
};

const controller = new AbortController();
// With an explicit --root, scan exactly that root (isolated provider). Without
// one, use the production configuration so project and user roots are included.
const useExplicitRoot = options.root !== undefined;
const provider = new FileSystemSkillProvider(
  ctx,
  { invalidate: () => {}, signal: controller.signal },
  {
    providerName: "filesystem",
    includeDefaultRoots: !useExplicitRoot,
    dshHome,
    customSkillDirs: useExplicitRoot ? [skillsRoot] : [],
    watch: false,
  },
);

const errors = [];
const found = new Map();

try {
  const observed = await provider.list({ cwd: process.cwd(), signal: controller.signal });
  const all = Array.isArray(observed) ? observed : observed.candidates;

  // The provider scans project, custom, and user roots together, so keep only
  // the candidates that actually came from the root under test. Without this,
  // an already-installed user root masks a broken bundle in a custom root.
  const candidates = all.filter((candidate) => isUnder(candidate.path, skillsRoot));
  const foreign = all.length - candidates.length;
  if (foreign > 0) {
    console.log(
      `Ignoring ${foreign} candidate(s) discovered outside ${skillsRoot} (project/user roots).`,
    );
  }

  for (const candidate of candidates) {
    found.set(candidate.name, candidate);
  }

  // Load every usable bundle body through the real provider.
  for (const [name, candidate] of found) {
    const definition = await provider.get(candidate, { signal: controller.signal });
    if (definition === undefined) {
      errors.push(`${name}: provider could not load the skill body`);
      continue;
    }
    if (definition.name !== name) {
      errors.push(`${name}: loaded definition reports name "${definition.name}"`);
    }
    if (!isSkillName(definition.name)) {
      errors.push(`${name}: failed the DSH kebab-case name grammar`);
    }
    if (definition.resourceBase?.kind !== "directory") {
      errors.push(`${name}: expected a directory resource base`);
    }
    if (typeof definition.content !== "string" || definition.content.trim() === "") {
      errors.push(`${name}: empty skill body`);
    }
    if (!definition.invocation.modelInvocable) {
      errors.push(`${name}: not model-invocable, so it will not appear in the catalog`);
    }
    if (!definition.invocation.userInvocable) {
      errors.push(`${name}: not user-invocable, so /${name} will not resolve`);
    }
  }
} finally {
  await provider.dispose();
}

// Every bundle declared on disk under the root under test must be discovered.
// When checking the default installed root, additionally require every skill
// this package ships, so a missing install is reported rather than tolerated.
function bundleNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, "SKILL.md")))
    .map((entry) => entry.name);
}

const sourceSkillsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "skills",
);
const expected = options.root === undefined
  ? bundleNames(sourceSkillsDir)
  : bundleNames(skillsRoot);

for (const name of expected) {
  if (!found.has(name)) errors.push(`${name}: not discovered under ${skillsRoot}`);
}

console.log(`DeepSeek Harness packages: ${modulesDir}`);
console.log(`Skills root: ${skillsRoot}`);
console.log(`Discovered: ${found.size} skill(s)`);
for (const name of [...found.keys()].sort()) console.log(`- ${name}`);

if (providerWarnings.length > 0) {
  console.log(`\nProvider warnings (${providerWarnings.length}):`);
  for (const warning of providerWarnings) console.log(`- ${warning}`);
}

if (found.size === 0) {
  errors.push(`no skills discovered under ${skillsRoot}`);
}

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nDeepSeek Harness compatibility verified.");
