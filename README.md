# Vector Cadence Skills

Vector Cadence Skills is a production-ready skill suite for agentic software engineering workflows. It integrates the useful disciplines from Matt Pocock’s skills and Compound Engineering without making runtime skills depend on upstream command names or block-by-block composition.

## Setup

Install globally using `npm`:
```bash
npm install -g vector-cadence-skills
```
Or execute the installer directly using `npx`:
```bash
npx vector-cadence-skills
```

By default, executing `npx vector-cadence-skills` without arguments installs the skills globally to your **Antigravity** plugin config. 

To deploy rules and skills locally to other agent environments in your current project folder, run:
```bash
npx vector-cadence-skills --cursor       # Cursor rules (.cursor/rules/)
npx vector-cadence-skills --claude       # Claude Code skills (.claude/skills/)
npx vector-cadence-skills --codex        # Codex CLI skills (.codex/skills/)
npx vector-cadence-skills --opencode     # OpenCode skills (.opencode/skills/)
npx vector-cadence-skills --pi           # Pi skills (.pi/skills/)
npx vector-cadence-skills --omp          # Oh-My-Pi skills (.omp/skills/)
npx vector-cadence-skills --all          # Deploys to all local environments simultaneously
```

## Core idea

Each skill owns one lifecycle responsibility:

```text
setup → orient → align → plan → review → slice → triage → execute → review → learn
```

Use only the amount of process the task needs. See `references/minimal-mode.md` for lightweight usage.

## Skill catalog

| Skill | Purpose |
|---|---|
| `vc-setup` | Bootstrap repo instructions, docs, labels, validation commands, and optional budget guard. |
| `vc-orient` | Map a codebase area before planning, debugging, or editing. |
| `vc-align` | Clarify product/domain intent, risks, terminology, and rejected alternatives. |
| `vc-plan` | Write implementation-ready technical plans with units, files, tests, and verification. |
| `vc-slice` | Convert plans into vertical issues or agent briefs. |
| `vc-triage` | Route issues to agent, human, needs-info, or wontfix states. |
| `vc-prototype` | Build a throwaway artifact to answer one design question. |
| `vc-execute` | Implement clear work with workspace safety, TDD, and tiered validation. |
| `vc-debug` | Diagnose bugs with a feedback-loop-first and causal-chain process. |
| `vc-review` | Review code/docs against Standards and Spec with severity/confidence routing. |
| `vc-architecture` | Improve application module boundaries, seams, and testability. |
| `vc-learn` | Capture reusable lessons after verified non-trivial work. |
| `vc-handoff` | Compact state for another agent or future session. |
| `vc-harness-architect` | Design Vector Cadence/pi harness, extensions, subagents, providers, search, and permissions. |
| `vc-skill-author` | Create or improve Vc-compatible skills. |

## Naming convention

Skill folders are named `vc-*`. Slash-command harnesses may expose them as `/vc-*`, but the canonical skill names are the folder/frontmatter names, such as `vc-align`.

## Recommended workflows

### Normal feature

```text
vc-align → vc-plan → vc-review → vc-slice → vc-triage → vc-execute → vc-review → vc-learn
```

Use `vc-review` before slicing only for important plans. Use `vc-learn` only when there is a reusable lesson.

### Small known change

```text
vc-execute → optional vc-review
```

### Unfamiliar code

```text
vc-orient → vc-execute
```

### Bug

```text
vc-debug → vc-review → optional vc-learn
```

Use `vc-execute` if the diagnosis produces a plan but the fix has not been applied.

### Harness work

```text
vc-harness-architect → vc-plan → vc-slice → vc-execute → vc-review
```

## Artifact model

| Artifact | Question answered |
|---|---|
| `AGENTS.md` | How should agents operate in this repo? |
| `CONTEXT.md` | What are domain things called? |
| `STRATEGY.md` | What product outcome matters? |
| `docs/align-notes/` | What did alignment reject, fear, or assume? |
| `docs/brainstorms/` | What should be built from a product/user view? |
| `docs/plans/` | How should it be implemented? |
| issue tracker or `docs/issues/` | What can an agent/human pick up? |
| `docs/solutions/` | What solved problem should future agents reuse? |
| `docs/knowledge/` | What was planned, what shipped, and what changed? |
| `docs/adr/` | Which durable trade-off should future agents respect? |
| `.out-of-scope/` | Which rejected idea should not be rediscovered? |
| `docs/handoffs/` | What state should a future agent resume from? |

## Included support files

```text
templates/AGENTS.md
templates/CONTEXT.md
templates/vc-budget.yml
scripts/validate-skills.mjs
scripts/bin.js
skills.json
examples/
references/
```

## Installation & Deployment

Vector Cadence Skills can be installed globally as an npm package or executed directly to deploy rules and skills to various local development agent environments.

### 1. Global Installation (Antigravity)
By default, running the installer without arguments copies all skills and assets to the Antigravity global plugins directory:

```bash
# Install dependencies first
npm install

# Run the installer to deploy to Antigravity global config
node scripts/bin.js

# Or if installed globally / via npx:
npx vector-cadence-skills
```

### 2. Deploying to Local Agent Tools
You can deploy the skills as configuration rules directly to local agent environments in your active project directory. Use the corresponding CLI flags:

| Target Environment | CLI Command | Target Location | Description |
|---|---|---|---|
| **Cursor** | `npx vector-cadence-skills --cursor` | `.cursor/rules/vc-*.md` | Deploys skills as Cursor rules |
| **Claude Code** | `npx vector-cadence-skills --claude` | `.claude/skills/vc-*/` | Deploys skill directories and a lightweight starter `CLAUDE.md` to Claude Code |
| **Codex CLI** | `npx vector-cadence-skills --codex` | `.codex/skills/vc-*/` | Deploys skill directories to Codex |
| **OpenCode** | `npx vector-cadence-skills --opencode` | `.opencode/skills/vc-*/` | Deploys skill directories to OpenCode |
| **Pi** | `npx vector-cadence-skills --pi` | `.pi/skills/vc-*/` | Deploys skill directories to Pi |
| **Oh-My-Pi** | `npx vector-cadence-skills --omp` | `.omp/skills/vc-*/` | Deploys skill directories to Oh-My-Pi |
| **All targets** | `npx vector-cadence-skills --all` | (All of the above) | Deploys to all local targets simultaneously |

## Validation

From this directory, run:

```bash
node scripts/validate-skills.mjs
```

The validator checks frontmatter, name/path consistency, description length, broken markdown links, banned legacy runtime command names, and line-count warnings.

## When not to use full Vector Cadence

Do not run the full lifecycle for:

- typos,
- formatting-only changes,
- obvious one-file fixes,
- mechanical renames,
- throwaway experiments,
- changes with exact user instructions and clear validation.

Use minimal mode instead.

## Harness boundary

These markdown skills can guide workflows. They do not by themselves provide tools such as subagents, DeepSeek telemetry, Taste integration, code search indexing, or permission gates. Those belong in future Vector Cadence extensions or the Vector Cadence CLI.

Recommended package split:

```text
@your-scope/vc-core
@your-scope/vc-skills
@your-scope/vc-extensions
@your-scope/vc-cli
```

## Documentation

- `DOCUMENTATION.md` — comprehensive architecture documentation.
- `references/architecture-overview.md` — shorter architecture overview.
- `references/source-integration-map.md` — why each skill chose its source disciplines.
- `references/minimal-mode.md` — how to use Vector Cadence without excess process.
- `references/final-skill-quality-bar.md` — publishing checklist.
