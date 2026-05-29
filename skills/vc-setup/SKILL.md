---
name: vc-setup
description: Bootstrap a repository for Vector Cadence by creating or updating project instructions, domain docs, issue-tracker mappings, knowledge folders, validation commands, and optional budget guard. Use when first using Vector Cadence skills in a repo or when skills lack tracker, docs, context, or validation information.
---

# Vector Cadence Setup

## Purpose

Prepare a repository so Vector Cadence skills know where docs live, what labels mean, which commands validate work, and what project rules agents must follow.

## Operating model

Detect existing conventions first, preserve user/project instructions, ask only for missing setup choices, and create scaffolding lazily unless the user requests full setup.

## When to use

Use when:

- installing Vector Cadence skills in a repo for the first time,
- issue labels or docs layout are unknown,
- validation commands are missing,
- moving from ad-hoc agent use to a structured workflow,
- setting up the future Vector Cadence harness itself.

## When to skip

Skip when:

- the repo already has correct Vector Cadence setup,
- the user only wants a one-off edit,
- you would need to overwrite existing instructions without approval.

## Artifacts

Potential project artifacts:

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/align-notes/
docs/brainstorms/
docs/plans/
docs/issues/
docs/solutions/
docs/knowledge/
docs/handoffs/
.out-of-scope/
.vc-budget.yml
```

Create only what is needed unless full scaffold is requested.

## Workflow

### 1. Detect environment

Inspect:

- repo root and package manager,
- existing `AGENTS.md` / `CLAUDE.md`,
- existing docs layout,
- issue tracker availability,
- test/typecheck/lint commands,
- branch/worktree support,
- CI config.

### 2. Ask missing setup choices

Ask only what cannot be inferred:

- issue tracker: GitHub, Linear, local markdown, none,
- docs mode: separate `docs/plans` + `docs/solutions` or unified `docs/knowledge`,
- curated vs composable harness behavior,
- whether to enable budget guard,
- lazy vs full directory scaffold.

### 3. Update instruction file safely

Add or update a Vector Cadence section in `AGENTS.md` or the project’s chosen instruction file. Preserve existing content and do not replace project rules.

Include:

- Vector Cadence lifecycle summary,
- artifact locations,
- triage label mapping placeholders,
- validation commands,
- subagent safety policy,
- privacy/telemetry rule.

### 4. Create domain and docs scaffolding

Create `CONTEXT.md` only if domain terms exist or the user wants scaffolding. Keep it glossary-only.

Create docs directories lazily or as requested.

### 5. Add optional budget guard

If approved, create `.vc-budget.yml` from the template.

### 6. Report readiness

Summarize created/updated files, detected tracker, validation commands, docs mode, and any missing setup.

## Output

```markdown
## Vector Cadence Setup Complete

**Instruction file:** ...
**Docs mode:** ...
**Issue tracker:** ...
**Triage mapping:** ...
**Validation commands:** ...
**Created/updated:** ...
**Recommended next skill:** vc-align | vc-harness-architect
```

## Guardrails

- Do not overwrite existing instructions.
- Do not invent validation commands.
- Do not put implementation details in `CONTEXT.md`.
- Do not require GitHub; local markdown issues are valid.
- Do not lock users into curated mode without choice.
